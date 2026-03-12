import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categoryCollection = await dbConnect("categories");
    const allCategories = await categoryCollection.find({}).toArray();

    if (allCategories.length > 0) {
      return NextResponse.json(allCategories);
    }

    const foodsCollection = await dbConnect("allFoods");

    let uniqueTags = await foodsCollection.distinct("category");
    if (!uniqueTags || uniqueTags.length === 0) {
      uniqueTags = await foodsCollection.distinct("tags");
    }

    if (!uniqueTags || uniqueTags.length === 0) {
      return NextResponse.json([]);
    }

    const categoriesList = await Promise.all(
      uniqueTags.map(async (tag, index) => {
        const sampleItem = await foodsCollection.findOne({
          $or: [{ category: tag }, { tags: tag }],
        });

        return {
          _id: (index + 1).toString(),
          categoryName: tag,
          categoryImg:
            sampleItem?.image ||
            sampleItem?.foodImg ||
            "https://via.placeholder.com/150",
        };
      }),
    );

    return NextResponse.json(categoriesList);
  } catch (err) {
    console.error("Category fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
