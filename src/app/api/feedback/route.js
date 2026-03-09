import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Keeping this returning allFoods because the team's UI currently fetches foods from here
    const collection = await dbConnect("allFoods");
    const allFoods = await collection.find({}).toArray();

    return NextResponse.json(allFoods, { status: 200 });
  } catch (err) {
    console.error("GET FOODS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // FIX: Save actual feedback to a 'feedback' collection, NOT 'allFoods'
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
    console.error("POST FEEDBACK ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}