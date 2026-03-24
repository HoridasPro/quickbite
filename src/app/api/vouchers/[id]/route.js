import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid voucher ID" }, { status: 400 });
    const collection = await dbConnect("vouchers");
    const voucher = await collection.findOne({ _id: new ObjectId(id) });
    if (!voucher) return NextResponse.json({ success: false, message: "Voucher not found" }, { status: 404 });
    return NextResponse.json({ success: true, voucher }, { status: 200 });
  } catch (error) { return NextResponse.json({ success: false, message: "Failed to fetch voucher" }, { status: 500 }); }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin" || session.user?.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid voucher ID" }, { status: 400 });
    }

    const body = await request.json();
    const collection = await dbConnect("vouchers");

    const existingCode = await collection.findOne({ 
      code: body.code?.toUpperCase(),
      _id: { $ne: new ObjectId(id) }
    });

    if (existingCode) {
      return NextResponse.json({ success: false, message: "This voucher code already exists." }, { status: 400 });
    }

    const updateData = {
      title: body.title,
      titleBn: body.titleBn || "",
      subtitle: body.subtitle || "",
      subtitleBn: body.subtitleBn || "",
      code: body.code?.toUpperCase(),
      discountType: body.discountType,
      discountValue: Number(body.discountValue) || 0,
      maxDiscount: Number(body.maxDiscount) || null,
      minOrderValue: Number(body.minOrderValue) || 0,
      applicableTo: body.applicableTo || "all",
      applicableId: body.applicableId || null,
      expiryDate: body.expiryDate ? new Date(body.expiryDate).toISOString() : null,
      usageLimit: Number(body.usageLimit) || null,
      status: body.status || "Active",
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Voucher updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update voucher" }, { status: 500 });
  }
}