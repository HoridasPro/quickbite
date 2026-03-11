import clientPromise from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "quickbite");

    const totalUsers = await db.collection("users").countDocuments();
    const totalFoods = await db.collection("allFoods").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments({ paymentStatus: "Paid" });

    const paidOrders = await db.collection("orders").find({ paymentStatus: "Paid" }).toArray();

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.totalAmount || order.total || 0),
      0
    );

    return Response.json({
      totalUsers,
      totalFoods,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}