import React from "react";
import ItemDetailView from "@/components/items/ItemDetailView";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export default async function ItemPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const collection = await dbConnect("allFoods");

  let query = {};
  
  if (!isNaN(id)) {
    query = { id: parseInt(id) };
  } else {
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      return notFound();
    }
  }

  const food = await collection.findOne(query);

  if (!food) {
    return notFound();
  }

  const mappedItem = {
    _id: food._id.toString(),
    id: food.id?.toString() || food._id.toString(),
    image: food.foodImg || "https://via.placeholder.com/800x450",
    title: food.title || "Untitled Dish",
    price: food.price || 0,
    description: food.description || "No description available.",
    category: food.category || "General",
    variations: food.variations || [],
    restaurant_name: food.restaurant_name || "QuickBite"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ItemDetailView item={mappedItem} />
    </div>
  );
}