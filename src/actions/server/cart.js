"use server";

import { authOption } from "@/app/lib/authOption";
// import { authOption } from "@/app/lib/authOption";
import { getServerSession } from "next-auth";

const { dbConnect } = require("@/app/lib/dbConnect");

const cartCollection = dbConnect("carts");
export const handleCart = async ({ food, inc = true }) => {
  const { user } = await getServerSession(authOption || {});
  if (!user) return { success: false };

  //getItemCart
  const query = { email: user?.email, foodId: food?._id };
  const isAdded = await cartCollection.findOne(query);

  if (isAdded) {
    //if Exist:update cart
    const updatedData = {
      $inc: {
        quantity: inc ? 1 : -1,
      },
    };
    const result = await cartCollection.updateOne(query, updatedData);
    return { success: Boolean(result.modifiedCount) };
  } else {
    //not Exist : update card
    const newData = {
      foodId: food._id,
      email: user?.email,
      title: food.title,
      image: food.foodImg,
      quantity: 1,
      price: food.price,
      username: user?.name,
    };
    const result = await cartCollection.insertOne(newData);
    return { success: result.acknowledged };
  }
};

export const getCarts = async () => {
  const { user } = await getServerSession(authOption || {});
  if (!user) return [];
  const query = { email: user?.email };
  const result = await cartCollection.find(query).toArray();
  return result;
};
