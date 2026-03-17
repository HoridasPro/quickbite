import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Universally block restricted users (Suspended or Banned) from leaving reviews
    // The role !== "admin" exception has been permanently removed.
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

    const storedId = isNaN(itemId) ? itemId : parseInt(itemId);

    const newReview = {
      itemId: storedId,
      user: session.user.name || "Anonymous",
      rating: parseInt(rating),
      comment: comment || "",
      date: new Date().toISOString()
    };

    const collection = await dbConnect("reviews");
    const result = await collection.insertOne(newReview);
    
    return NextResponse.json({ success: true, message: "Review added", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Post review error:", error);
    return NextResponse.json({ success: false, message: "Failed to add review" }, { status: 500 });
  }
}