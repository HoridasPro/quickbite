import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbName = "quickbite"; // তোমার database নাম

export async function getUserByEmail(email) {
  await client.connect();
  const db = client.db(dbName);
  return db.collection("users").findOne({ email });
}

export async function createUser(user) {
  await client.connect();
  const db = client.db(dbName);
  return db.collection("users").insertOne(user);
}

export async function updateUser(email, updateData) {
  await client.connect();
  const db = client.db(dbName);
  return db.collection("users").updateOne({ email }, { $set: updateData });
}
