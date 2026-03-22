import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security Enforcement
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.accountStatus !== "Active") {
      return NextResponse.json(
        { success: false, message: "Account restricted. Data access disabled." }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const collection = await dbConnect("auditLogs");
    
    // Fetch logs sorted by newest first
    const logs = await collection.find({})
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalItems = await collection.countDocuments({});
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      logs,
      currentPage: page,
      totalPages,
      totalItems
    }, { status: 200 });

  } catch (error) {
    console.error("Audit Logs fetch error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}