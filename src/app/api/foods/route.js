import { NextResponse } from "next/server";
import foodItems from "@/data/foodItems.json";

export async function GET(request) {
  // 1. Extract page and limit from URL (default to page 1, 3 items per page)
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");

  // 2. Map the local JSON schema
  const mappedFoods = foodItems.map((item) => {
    return {
      ...item,
      foodImg: item.image,
      foodName: item.title,
      category: item.tags && item.tags.length > 0 ? item.tags[0] : "General",
      categoryName: item.tags && item.tags.length > 0 ? item.tags[0] : "General",
    };
  });

  // 3. Slice array for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedFoods = mappedFoods.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(mappedFoods.length / limit);

  // 4. Return paginated response
  return NextResponse.json({
    foods: paginatedFoods,
    currentPage: page,
    totalPages: totalPages,
    totalItems: mappedFoods.length
  });
}