import { NextResponse } from "next/server";
import foodItems from "@/data/foodItems.json";

export async function GET() {
  const categoriesSet = new Set();
  const categoriesList = [];

  foodItems.forEach((item, index) => {
    // Extract the primary tag to use as the category name
    const mainCategory = item.tags && item.tags.length > 0 ? item.tags[0] : "General";
    
    if (!categoriesSet.has(mainCategory)) {
      categoriesSet.add(mainCategory);
      categoriesList.push({
        id: index + 1,
        categoryName: mainCategory,
        // Re-use the food image as the category image for visual consistency
        categoryImg: item.image || "https://via.placeholder.com/150",
      });
    }
  });

  // Wrap in an object with a 'categories' key to match the frontend's expectation
  return NextResponse.json({ categories: categoriesList });
}