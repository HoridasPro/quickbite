import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // FIX: Point to the actual team collection 'allFoods'
    const collection = await dbConnect("allFoods");

    let query = {};
    
    // Support both the team's numeric 'id' and MongoDB '_id'
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

    // FIX: Mapping values based on team schema examples
    const mappedFood = {
      ...food,
      id: food.id || food._id.toString(),
      image: food.foodImg || "https://via.placeholder.com/150",
      foodImg: food.foodImg || "https://via.placeholder.com/150",
      title: food.title || "Untitled Dish",
      foodName: food.title || "Untitled Dish",
      category: food.category || "General",
      categoryName: food.category || "General",
      price: food.price || 0,
      ratings: food.ratings || "0",
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