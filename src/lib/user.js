import { dbConnect } from "@/lib/dbConnect";

export async function getUserByEmail(email) {
  const collection = await dbConnect("users");
  return collection.findOne({ email });
}

export async function createUser(user) {
  const collection = await dbConnect("users");
  return collection.insertOne(user);
}

export async function updateUser(email, updateData) {
  const collection = await dbConnect("users");
  return collection.updateOne({ email }, { $set: updateData });
}