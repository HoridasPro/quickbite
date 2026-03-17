import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin" && session?.user?.accountStatus === "Active";

    // 1. Try to fetch from the team's dedicated categories collection
    const categoryCollection = await dbConnect("categories");
    const allCategories = await categoryCollection.find({}).toArray();

    if (allCategories.length > 0) {
      return NextResponse.json(allCategories);
    }

    // 2. FALLBACK: Dynamic generation with Ghost Store Protection
    const foodsCollection = await dbConnect("allFoods");
    let activeRestaurantFilter = {};

    // Only aggregate categories from Active restaurants (unless viewing as Admin)
    if (!isAdmin) {
      const restCollection = await dbConnect("restaurants");
      const activeRestaurants = await restCollection.find({
        $or: [{ status: "Active" }, { status: { $exists: false } }]
      }).toArray();
      
      const activeNames = activeRestaurants.map(r => r.name).filter(Boolean);

      activeRestaurantFilter = {
        $or: [
          { restaurant_name: { $in: activeNames } },
          { restaurant_name: null },
          { restaurant_name: "" },
          { restaurant_name: { $exists: false } }
        ]
      };
    }
    
    // Pass the filter into the distinct query
    let uniqueTags = await foodsCollection.distinct("category", activeRestaurantFilter);
    if (!uniqueTags || uniqueTags.length === 0) {
      uniqueTags = await foodsCollection.distinct("tags", activeRestaurantFilter);
    }

    if (!uniqueTags || uniqueTags.length === 0) {
      return NextResponse.json([]);
    }

    const categoriesList = await Promise.all(
      uniqueTags.map(async (tag, index) => {
        const sampleItem = await foodsCollection.findOne({ 
          $and: [
            { $or: [{ category: tag }, { tags: tag }] },
            activeRestaurantFilter
          ]
        });
        
        return {
          _id: (index + 1).toString(),
          categoryName: tag,
          categoryBn: sampleItem?.categoryBn || null,
          categoryImg: sampleItem?.image || sampleItem?.foodImg || "https://via.placeholder.com/150",
        };
      })
    );

    return NextResponse.json(categoriesList);
  } catch (err) {
    console.error("Category fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}