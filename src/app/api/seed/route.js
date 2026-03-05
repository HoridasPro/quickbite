import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import foodItems from "@/data/foodItems.json";

export async function GET() {
  try {
    const collection = dbConnect("foods");

    await collection.deleteMany({});

    await collection.insertMany(foodItems);

    return NextResponse.json(
      { 
        success: true, 
        message: "Data seeded to MongoDB successfully", 
        insertedCount: foodItems.length 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}