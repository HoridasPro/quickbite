import clientPromise from "@/lib/dbConnect";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("food-delivery");

  const totalUsers = await db.collection("users").countDocuments();
  const totalFoods = await db.collection("foods").countDocuments();
  const totalOrders = await db.collection("orders").countDocuments();

  const orders = await db.collection("orders").find().toArray();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return Response.json({
    totalUsers,
    totalFoods,
    totalOrders,
    totalRevenue,
  });
}