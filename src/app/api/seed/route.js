import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import foodItems from "@/data/foodItems.json";

export async function GET() {
  try {
    // FIX: Await the async dbConnect to get the actual collection
    const collection = await dbConnect("foods");

    // Clear the existing collection
    await collection.deleteMany({});

    // Seed the database with items from the JSON file
    const result = await collection.insertMany(foodItems);

    return NextResponse.json(
      { 
        success: true, 
        message: "Data seeded to MongoDB successfully", 
        insertedCount: result.insertedCount 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}