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

  // Fetch users, but exclude their passwords for security
  const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();

  return Response.json(users);
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, role, accountStatus, statusReason } = body;

    if (!id) {
      return Response.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Build a dynamic update object based on what the Admin sent
    const updateFields = {};
    
    // Role management
    if (role) {
      const allowedRoles = ["user", "admin", "restaurant", "rider"];
      if (allowedRoles.includes(role)) updateFields.role = role;
    }

    // Regulatory Status management
    if (accountStatus) {
      const allowedStatuses = ["Active", "Suspended", "Banned"];
      if (allowedStatuses.includes(accountStatus)) {
        updateFields.accountStatus = accountStatus;
        updateFields.statusReason = statusReason || "Action taken by Administrator.";
        updateFields.statusUpdatedAt = new Date().toISOString();
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return Response.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}