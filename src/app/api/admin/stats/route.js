import clientPromise from "@/lib/dbConnect";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "quickbite");

    const totalUsers = await db.collection("users").countDocuments();
    
    // FIX: Point to 'allFoods'
    const totalFoods = await db.collection("allFoods").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments();

    const orders = await db.collection("orders").find().toArray();

    const totalRevenue = orders.reduce(
      // FIX: Use totalAmount to match team schema
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
    console.error("Admin Stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}