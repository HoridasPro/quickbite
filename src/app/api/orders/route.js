import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      items: body.items,
      totalAmount: body.totalAmount,
      customerInfo: body.customerInfo,
      email: body.customerInfo?.email || body.email,
      status: "Pending",
      timestamp: new Date().toISOString()
    };

    const result = await dbConnect("orders").insertOne(newOrder);

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order: newOrder, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to process order" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const orders = await dbConnect("orders").find({ email }).sort({ timestamp: -1 }).toArray();

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}