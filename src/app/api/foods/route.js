import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    // Check if the requester is an ACTIVE admin
    const isAdmin = session?.user?.role === "admin" && session?.user?.accountStatus === "Active";

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sort = searchParams.get("sort") || "";
    const offer = searchParams.get("offer") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    const query = {};
    if (offer) {
      query.offer = offer;
    }
    
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { titleBn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { descriptionBn: { $regex: search, $options: "i" } },
        { restaurant_name: { $regex: search, $options: "i" } },
        { restaurant_nameBn: { $regex: search, $options: "i" } }
      ];
    }

    let finalQuery = { ...query };

    // ENFORCEMENT: The "Ghost Store" Fix
    // If the user is NOT an active admin, filter out foods from Suspended/Banned restaurants
    if (!isAdmin) {
      const restCollection = await dbConnect("restaurants");
      // Fetch restaurants that are explicitly Active (or legacy ones with no status)
      const activeRestaurants = await restCollection.find({
        $or: [{ status: "Active" }, { status: { $exists: false } }]
      }).toArray();
      
      const activeNames = activeRestaurants.map(r => r.name).filter(Boolean);

      const activeRestaurantFilter = {
        $or: [
          { restaurant_name: { $in: activeNames } },
          { restaurant_name: null },
          { restaurant_name: "" },
          { restaurant_name: { $exists: false } }
        ]
      };

      // Safely merge the visibility filter with existing search filters
      if (Object.keys(query).length > 0) {
        finalQuery = {
          $and: [query, activeRestaurantFilter]
        };
      } else {
        finalQuery = activeRestaurantFilter;
      }
    }

    let sortOption = {};
    switch (sort) {
      case "Price: Low to High":
        sortOption = { price: 1 };
        break;
      case "Price: High to Low":
        sortOption = { price: -1 };
        break;
      case "Rating":
        sortOption = { ratings: -1 };
        break;
      case "Delivery Time":
        sortOption = { deliveryTime: 1 };
        break;
      default:
        sortOption = { _id: 1 };
    }

    const skip = (page - 1) * limit;
    
    const collection = await dbConnect("allFoods");
    
    const foods = await collection.find(finalQuery).sort(sortOption).skip(skip).limit(limit).toArray();
    const totalItems = await collection.countDocuments(finalQuery);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedFoods = foods.map((item) => ({
      ...item,
      id: item.id || item._id.toString(),
      foodImg: item.foodImg || "https://via.placeholder.com/150",
      foodName: item.title || "Untitled Dish",
      category: item.category || "General",
      categoryName: item.category || "General",
    }));

    return NextResponse.json({
      foods: mappedFoods,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ENFORCEMENT: Destroy the Admin God-Mode Loophole
  if (session.user.accountStatus !== "Active") {
    return NextResponse.json({ success: false, message: "Account restricted" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const collection = await dbConnect("allFoods");
    const result = await collection.insertOne(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ENFORCEMENT: Destroy the Admin God-Mode Loophole
  if (session.user.accountStatus !== "Active") {
    return NextResponse.json({ success: false, message: "Account restricted" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    
    if (!_id && !id) {
        return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }

    const collection = await dbConnect("allFoods");
    
    const targetId = _id || id;
    const queryId = typeof targetId === 'string' && targetId.length === 24 
      ? new ObjectId(targetId) 
      : (isNaN(targetId) ? targetId : parseInt(targetId));
    
    const result = await collection.updateOne(
      { $or: [{ _id: queryId }, { id: queryId }] },
      { $set: updateData }
    );
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ENFORCEMENT: Destroy the Admin God-Mode Loophole
  if (session.user.accountStatus !== "Active") {
    return NextResponse.json({ success: false, message: "Account restricted" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
         return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }

    const collection = await dbConnect("allFoods");
    const queryId = typeof id === 'string' && id.length === 24 ? new ObjectId(id) : (isNaN(id) ? id : parseInt(id));

    const result = await collection.deleteOne({ 
       $or: [{ _id: queryId }, { id: queryId }] 
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}