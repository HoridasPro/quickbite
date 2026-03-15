import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const collection = await dbConnect("restaurants");

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    const restaurant = await collection.findOne({ _id: queryId });

    if (!restaurant) {
      return NextResponse.json({ success: false, message: "Restaurant not found" }, { status: 404 });
    }

    const mappedRestaurant = {
      ...restaurant,
      id: restaurant._id.toString(),
    };

    return NextResponse.json({ success: true, restaurant: mappedRestaurant });
  } catch (error) {
    console.error("Single restaurant fetch error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { _id, id: bodyId, ...updateData } = body;
    
    const collection = await dbConnect("restaurants");
    
    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }
    
    const result = await collection.updateOne(
      { _id: queryId },
      { $set: updateData }
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Update restaurant error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const collection = await dbConnect("restaurants");

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: queryId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}