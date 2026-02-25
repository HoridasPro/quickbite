import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      items: body.items,
      totalAmount: body.totalAmount,
      customerInfo: body.customerInfo,
      status: "Pending",
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to process order" },
      { status: 500 }
    );
  }
}