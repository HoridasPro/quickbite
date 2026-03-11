import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const users = await db.collection("users").find().toArray();

  return Response.json(users);
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: "admin" } }
  );

  return Response.json(result);
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const result = await db.collection("users").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json(result);
}