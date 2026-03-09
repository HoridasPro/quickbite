import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    // Convert to number if possible to match the team's numeric IDs
    const queryId = isNaN(itemId) ? itemId : parseInt(itemId);

    // FIX: Must await the dbConnect call
    const collection = await dbConnect("reviews");
    const reviews = await collection
      .find({ itemId: queryId })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, user, rating, comment } = body;

    if (!itemId || !user || !rating) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Convert to number if possible to match the team's numeric IDs
    const storedId = isNaN(itemId) ? itemId : parseInt(itemId);

    const newReview = {
      itemId: storedId,
      user,
      rating: parseInt(rating),
      comment: comment || "",
      date: new Date().toISOString()
    };

    // FIX: Must await the dbConnect call
    const collection = await dbConnect("reviews");
    const result = await collection.insertOne(newReview);
    
    return NextResponse.json({ success: true, message: "Review added", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Post review error:", error);
    return NextResponse.json({ success: false, message: "Failed to add review" }, { status: 500 });
  }
}