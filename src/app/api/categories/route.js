import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 

// FIX: Force Next.js to fetch fresh data on every request instead of caching
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collection = await dbConnect("foods");

    const uniqueTags = await collection.distinct("tags");
    
    console.log("Found unique tags:", uniqueTags);

    if (!uniqueTags || uniqueTags.length === 0) {
      return NextResponse.json({ categories: [] });
    }

    const categoriesList = await Promise.all(
      uniqueTags.map(async (tag, index) => {
        const sampleItem = await collection.findOne({ tags: tag });
        
        return {
          id: index + 1,
          categoryName: tag,
          categoryImg: sampleItem?.image || sampleItem?.foodImg || "https://via.placeholder.com/150",
        };
      })
    );

    return NextResponse.json({ categories: categoriesList });
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dynamic categories" },
      { status: 500 }
    );
  }
}