import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    const queryId = isNaN(itemId) ? itemId : parseInt(itemId);

    const collection = await dbConnect("reviews");
    const reviews = await collection
      .find({ itemId: queryId })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.accountStatus !== "Active") {
      return NextResponse.json(
        { success: false, message: `Account ${session.user.accountStatus}. Reviews disabled.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { itemId, rating, comment } = body;

    if (!itemId || !rating) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (comment && comment.length > 1000) {
      return NextResponse.json({ success: false, message: "Comment too long" }, { status: 400 });
    }

    let foodQuery = {};
    if (!isNaN(itemId)) {
      foodQuery = { id: parseInt(itemId) };
    } else {
      try {
        foodQuery = { _id: new ObjectId(itemId) };
      } catch {
        return NextResponse.json({ success: false, message: "Invalid item ID format" }, { status: 400 });
      }
    }

    const foodsCollection = await dbConnect("allFoods");
    const foodExists = await foodsCollection.findOne(foodQuery);

    if (!foodExists) {
      return NextResponse.json({ success: false, message: "Item does not exist" }, { status: 404 });
    }

    const storedId = isNaN(itemId) ? itemId : parseInt(itemId);

    const orderCollection = await dbConnect("orders");
    const hasPurchased = await orderCollection.findOne({
      email: session.user.email,
      status: "Delivered",
      "items.itemId": String(itemId)
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { success: false, message: "You can only review items you have purchased and received." },
        { status: 403 }
      );
    }

    const collection = await dbConnect("reviews");
    const existingReview = await collection.findOne({
      itemId: storedId,
      userEmail: session.user.email
    });

    if (existingReview) {
      return NextResponse.json({ success: false, message: "You have already reviewed this item." }, { status: 409 });
    }

    const newReview = {
      itemId: storedId,
      user: session.user.name || "Anonymous",
      userEmail: session.user.email,
      rating: parsedRating,
      comment: comment || "",
      date: new Date().toISOString()
    };

    await collection.insertOne(newReview);

    const stats = await collection.aggregate([
      { $match: { itemId: storedId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]).toArray();

    const newAvg = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;
    const newCount = stats.length > 0 ? stats[0].count : 0;

    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const ratingsStr = newAvg.toString();
    const ratingsBnStr = ratingsStr.replace(/\d/g, d => bnDigits[d]);

    await foodsCollection.updateOne(
      { _id: foodExists._id },
      { 
        $set: { 
          rating: newAvg, 
          ratingsBn: ratingsBnStr,
          reviewsCount: newCount
        } 
      }
    );

    return NextResponse.json({ success: true, message: "Review added", review: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add review" }, { status: 500 });
  }
}