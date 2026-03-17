import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin" && session?.user?.accountStatus === "Active";

    const { id } = await params;
    const collection = await dbConnect("allFoods");

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

    if (!isAdmin && food.restaurant_name) {
      const restCollection = await dbConnect("restaurants");
      const restaurant = await restCollection.findOne({ name: food.restaurant_name });
      
      if (!restaurant || restaurant.status !== "Active") {
        return NextResponse.json(
          { success: false, message: "Item unavailable" }, 
          { status: 403 }
        );
      }
    }

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
    return NextResponse.json(
      { success: false, message: "Server error" }, 
      { status: 500 }
    );
  }
}