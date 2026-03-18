import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.accountStatus !== "Active") {
      return NextResponse.json(
        { success: false, message: "Account restricted. Data access disabled." }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const collection = await dbConnect("reviews");
    const foodsCollection = await dbConnect("allFoods");

    let matchQuery = {};
    
    if (search) {
      const safeSearch = escapeRegex(search);
      
      const matchedFoods = await foodsCollection.find({
        $or: [
          { title: { $regex: safeSearch, $options: "i" } },
          { titleBn: { $regex: safeSearch, $options: "i" } }
        ]
      }).toArray();

      const foodIds = matchedFoods.flatMap(f => {
        const ids = [f.id, f._id];
        if (f._id) ids.push(String(f._id));
        return ids.filter(Boolean);
      });

      matchQuery.$or = [
        { user: { $regex: safeSearch, $options: "i" } },
        { userEmail: { $regex: safeSearch, $options: "i" } },
        { comment: { $regex: safeSearch, $options: "i" } },
        { itemId: { $in: foodIds } }
      ];
    }

    const pipeline = [
      { $match: matchQuery },
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "allFoods",
          let: { r_itemId: "$itemId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$id", "$$r_itemId"] },
                    { $eq: ["$_id", "$$r_itemId"] },
                    { $eq: [{ $toString: "$_id" }, { $toString: "$$r_itemId" }] }
                  ]
                }
              }
            },
            { $project: { title: 1, titleBn: 1 } }
          ],
          as: "foodDetails"
        }
      },
      { $addFields: { itemInfo: { $arrayElemAt: ["$foodDetails", 0] } } },
      { $project: { foodDetails: 0 } }
    ];

    const reviews = await collection.aggregate(pipeline).toArray();
    const totalItems = await collection.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      reviews,
      currentPage: page,
      totalPages,
      totalItems
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.accountStatus !== "Active") {
      return NextResponse.json(
        { success: false, message: "Account restricted. Deletions disabled." }, 
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Review ID required" }, { status: 400 });
    }

    const collection = await dbConnect("reviews");
    const auditCollection = await dbConnect("auditLogs");
    const foodsCollection = await dbConnect("allFoods");
    
    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    const reviewToDelete = await collection.findOne({ _id: queryId });
    if (!reviewToDelete) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    await collection.deleteOne({ _id: queryId });

    await auditCollection.insertOne({
      action: "DELETE_REVIEW",
      reviewId: queryId,
      itemId: reviewToDelete.itemId,
      adminEmail: session.user.email,
      deletedAt: new Date().toISOString(),
      deletedContent: reviewToDelete.comment,
      deletedUser: reviewToDelete.userEmail
    });

    const stats = await collection.aggregate([
      { $match: { itemId: reviewToDelete.itemId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]).toArray();

    const newAvg = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;
    const newCount = stats.length > 0 ? stats[0].count : 0;

    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const ratingsStr = newAvg.toString();
    const ratingsBnStr = ratingsStr.replace(/\d/g, d => bnDigits[d]);

    let objectIdFallback = null;
    try {
      objectIdFallback = new ObjectId(reviewToDelete.itemId);
    } catch {
      objectIdFallback = null;
    }

    const foodMatch = objectIdFallback
      ? { $or: [{ id: reviewToDelete.itemId }, { _id: reviewToDelete.itemId }, { _id: objectIdFallback }] }
      : { $or: [{ id: reviewToDelete.itemId }, { _id: reviewToDelete.itemId }] };

    await foodsCollection.updateOne(
      foodMatch,
      { 
        $set: { 
          rating: newAvg, 
          ratingsBn: ratingsBnStr,
          reviewsCount: newCount 
        } 
      }
    );

    return NextResponse.json({ success: true, message: "Review deleted successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}