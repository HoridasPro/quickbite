import clientPromise from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.accountStatus !== "Active") {
    return Response.json({ success: false, message: "Account restricted." }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "quickbite");

    // Fetch only active riders
    const riders = await db.collection("users").find(
      { role: "rider", accountStatus: "Active" },
      { projection: { password: 0 } }
    ).toArray();

    return Response.json({ success: true, riders });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}