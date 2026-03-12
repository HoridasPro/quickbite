import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId, orderId } = await request.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata.orderId !== orderId) {
      return NextResponse.json({ success: false, message: "Order ID mismatch" }, { status: 403 });
    }

    if (session.payment_status === "paid") {
      const collection = await dbConnect("orders");
      
      await collection.updateOne(
        { orderId: orderId },
        { $set: { paymentStatus: "Paid", status: "Confirmed" } }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Payment not verified" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}