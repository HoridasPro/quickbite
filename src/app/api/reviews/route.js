import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    const reviews = await dbConnect("reviews")
      .find({ itemId: parseInt(itemId) })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
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

    const newReview = {
      itemId: parseInt(itemId),
      user,
      rating: parseInt(rating),
      comment: comment || "",
      date: new Date().toISOString()
    };

    const result = await dbConnect("reviews").insertOne(newReview);
    
    return NextResponse.json({ success: true, message: "Review added", review: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add review" }, { status: 500 });
  }
}