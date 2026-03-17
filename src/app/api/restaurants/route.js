import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // 1. Identify if the requester is an active administrator
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin" && session?.user?.accountStatus === "Active";

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameBn: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    let finalQuery = { ...query };

    // ENFORCEMENT: The "Ghost Store" Fix
    // If the user is NOT an active admin, filter out Suspended or Banned restaurants.
    if (!isAdmin) {
      const activeFilter = {
        $or: [{ status: "Active" }, { status: { $exists: false } }]
      };

      // Safely merge the visibility filter with any existing search filters
      if (Object.keys(query).length > 0) {
        finalQuery = {
          $and: [query, activeFilter]
        };
      } else {
        finalQuery = activeFilter;
      }
    }

    const skip = (page - 1) * limit;
    const collection = await dbConnect("restaurants"); 
    
    const restaurants = await collection.find(finalQuery).skip(skip).limit(limit).toArray();
    const totalItems = await collection.countDocuments(finalQuery);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedRestaurants = restaurants.map((item) => ({
      ...item,
      id: item._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      restaurants: mappedRestaurants,
      totalPages,
      totalItems
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
    const collection = await dbConnect("restaurants");
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}