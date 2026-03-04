
import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// ✅ GET All Users
export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const users = await db.collection("users").find().toArray();

  return Response.json(users);
}

// ✅ PATCH - Make Admin
export async function PATCH(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: "admin" } }
  );

  return Response.json(result);
}

// ✅ DELETE User
export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const result = await db.collection("users").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json(result);
}