import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // FIX: Must await the async dbConnect to get the actual collection
    const collection = await dbConnect("foods");

    let query = {};
    
    if (!isNaN(id)) {
      query = { id: parseInt(id) };
    } else {
      try {
        query = { _id: new ObjectId(id) };
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" }, 
          { status: 400 }
        );
      }
    }

    const food = await collection.findOne(query);

    if (!food) {
      return NextResponse.json(
        { success: false, message: "Food item not found" }, 
        { status: 404 }
      );
    }

    const mappedFood = {
      ...food,
      id: food.id || food._id.toString(),
      foodImg: food.image || food.foodImg,
      foodName: food.title || food.foodName,
      category: food.tags && food.tags.length > 0 ? food.tags[0] : "General",
      categoryName: food.tags && food.tags.length > 0 ? food.tags[0] : "General",
    };

    return NextResponse.json({ success: true, food: mappedFood });
  } catch (error) {
    console.error("Single food fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" }, 
      { status: 500 }
    );
  }
}