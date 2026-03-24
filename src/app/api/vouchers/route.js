import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); 

    const collection = await dbConnect("vouchers");
    const vouchers = await collection.find({}).sort({ _id: -1 }).toArray();

    const now = new Date();

    const processedVouchers = vouchers.map(v => {
      if (v.expiryDate && new Date(v.expiryDate) < now && v.status === "Active") {
        v.status = "Expired";
      }
      if (v.usageLimit && (v.usedCount || 0) >= v.usageLimit && v.status === "Active") {
        v.status = "Fully Claimed";
      }
      return v;
    });

    if (type === "public") {
      const activeVouchers = processedVouchers.filter(v => v.status === "Active");
      return NextResponse.json({ success: true, vouchers: activeVouchers }, { status: 200 });
    }

    return NextResponse.json({ success: true, vouchers: processedVouchers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch vouchers" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin" || session.user?.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const collection = await dbConnect("vouchers");

    if (!body.title || !body.code || !body.discountType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingCode = await collection.findOne({ code: body.code.toUpperCase() });
    if (existingCode) {
      return NextResponse.json({ success: false, message: "This voucher code already exists." }, { status: 400 });
    }

    const newVoucher = {
      title: body.title,
      titleBn: body.titleBn || "",
      subtitle: body.subtitle || "",
      subtitleBn: body.subtitleBn || "",
      code: body.code.toUpperCase(),
      discountType: body.discountType, 
      discountValue: Number(body.discountValue) || 0,
      maxDiscount: Number(body.maxDiscount) || null, 
      minOrderValue: Number(body.minOrderValue) || 0,
      applicableTo: body.applicableTo || "all", 
      applicableId: body.applicableId || null, 
      expiryDate: body.expiryDate ? new Date(body.expiryDate).toISOString() : null,
      usageLimit: Number(body.usageLimit) || null,
      usedCount: 0,
      status: body.status || "Active",
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newVoucher);

    return NextResponse.json({ 
      success: true, 
      message: "Voucher created successfully",
      voucher: { ...newVoucher, _id: result.insertedId }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create voucher" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin" || session.user?.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Voucher ID is required" }, { status: 400 });
    }
    const collection = await dbConnect("vouchers");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Voucher not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Voucher deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete voucher" }, { status: 500 });
  }
}