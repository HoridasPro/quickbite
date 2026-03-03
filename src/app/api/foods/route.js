import { NextResponse } from "next/server";
import foodItems from "@/data/foodItems.json";

export async function GET() {
  // Map the local JSON schema to perfectly match the frontend UI expectations
  const mappedFoods = foodItems.map((item) => {
    return {
      ...item,
      // Map 'image' to 'foodImg'
      foodImg: item.image,
      
      // Ensure 'foodName' is available if any component prefers it over 'title'
      foodName: item.title,
      
      // Take the first tag from the array and assign it as the primary 'category'
      category: item.tags && item.tags.length > 0 ? item.tags[0] : "General",
      categoryName: item.tags && item.tags.length > 0 ? item.tags[0] : "General",
    };
  });

  return NextResponse.json(mappedFoods);
}