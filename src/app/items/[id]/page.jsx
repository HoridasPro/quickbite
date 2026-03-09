import React from "react";
import ItemDetailView from "@/components/items/ItemDetailView";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export default async function ItemPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const collection = await dbConnect("foods");

  let query = {};
  
  // Support both legacy numeric IDs and new MongoDB ObjectIds
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

  // Ensure fields match what ItemDetailView expects
  const mappedItem = {
    ...food,
    id: food.id || food._id.toString(),
    image: food.image || food.foodImg,
    title: food.title || food.foodName,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ItemDetailView item={mappedItem} />
    </div>
  );
}