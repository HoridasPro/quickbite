import clientPromise from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "quickbite");

    // Fetch orders that are marked as Paid
    const payments = await db.collection("orders")
      .find({ paymentStatus: "Paid" })
      .sort({ timestamp: -1 }) // Newest transactions first
      .toArray();

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch payments" }, { status: 500 });
  }
}