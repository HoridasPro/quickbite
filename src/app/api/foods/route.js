import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sort = searchParams.get("sort") || "";
    const offer = searchParams.get("offer") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    const query = {};
    if (offer) {
      query.offer = offer;
    }
    
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case "Price: Low to High":
        sortOption = { price: 1 };
        break;
      case "Price: High to Low":
        sortOption = { price: -1 };
        break;
      case "Rating":
        sortOption = { ratings: -1 };
        break;
      case "Delivery Time":
        sortOption = { deliveryTime: 1 };
        break;
      default:
        sortOption = { _id: 1 };
    }

    const skip = (page - 1) * limit;
    
    const collection = await dbConnect("allFoods");
    
    const foods = await collection.find(query).sort(sortOption).skip(skip).limit(limit).toArray();
    const totalItems = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedFoods = foods.map((item) => ({
      ...item,
      id: item.id || item._id.toString(),
      foodImg: item.foodImg || "https://via.placeholder.com/150",
      foodName: item.title || "Untitled Dish",
      category: item.category || "General",
      categoryName: item.category || "General",
    }));

    return NextResponse.json({
      foods: mappedFoods,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems
    });
  } catch (error) {
    console.error("Foods list fetch error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}