import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin" && session?.user?.accountStatus === "Active";
    
    let finalQuery = {};

    if (!isAdmin) {
      const restCollection = await dbConnect("restaurants");
      const activeRestaurants = await restCollection.find({
        $or: [{ status: "Active" }, { status: { $exists: false } }]
      }).toArray();
      
      const activeNames = activeRestaurants.map(r => r.name).filter(Boolean);

      finalQuery = {
        $or: [
          { restaurant_name: { $in: activeNames } },
          { restaurant_name: null },
          { restaurant_name: "" },
          { restaurant_name: { $exists: false } }
        ]
      };
    }

    const collection = await dbConnect("allFoods");
    const allFoods = await collection.find(finalQuery).toArray();

    return NextResponse.json(allFoods, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const collection = await dbConnect("feedback");
    const { message } = await req.json();
    
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "Please send a valid message" },
        { status: 400 }
      );
    }

    const newFeedback = { message, date: new Date().toISOString() };
    const result = await collection.insertOne(newFeedback);
    
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}