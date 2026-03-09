"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";

export const handleCart = async ({ food, inc = true }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return { success: false };

  const cartCollection = await dbConnect("carts");
  const query = { email: session.user.email, foodId: food?._id };
  const isAdded = await cartCollection.findOne(query);

  if (isAdded) {
    const updatedData = {
      $inc: {
        quantity: inc ? 1 : -1,
      },
    };
    const result = await cartCollection.updateOne(query, updatedData);
    return { success: Boolean(result.modifiedCount) };
  } else {
    const newData = {
      foodId: food._id,
      email: session.user.email,
      title: food.title,
      image: food.foodImg,
      quantity: 1,
      price: food.price,
      username: session.user.name,
    };
    const result = await cartCollection.insertOne(newData);
    return { success: result.acknowledged };
  }
};

export const getCarts = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return [];
  
  const cartCollection = await dbConnect("carts");
  const query = { email: session.user.email };
  const result = await cartCollection.find(query).toArray();
  
  return result;
};