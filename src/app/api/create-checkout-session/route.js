import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const sessionUser = await getServerSession(authOptions);
    
    if (!sessionUser || !sessionUser.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order } = await request.json();

    if (!order || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    const collection = await dbConnect("allFoods");

    const queryIds = order.items.map(item => {
      try {
        return new ObjectId(item.itemId);
      } catch {
        return item.itemId;
      }
    });

    const dbItems = await collection.find({
      $or: [
        { _id: { $in: queryIds.filter(id => id instanceof ObjectId) } },
        { id: { $in: queryIds.map(id => typeof id === 'string' ? parseInt(id) : id) } },
        { id: { $in: queryIds.map(String) } }
      ]
    }).toArray();

    const lineItems = order.items.map((item) => {
      const dbItem = dbItems.find(
        dbI => dbI._id.toString() === item.itemId.toString() || dbI.id?.toString() === item.itemId.toString()
      );

      if (!dbItem) throw new Error(`Item not found: ${item.title}`);

      let unitPrice = dbItem.price || 0;

      if (item.selectedVariations && dbItem.variations) {
        Object.entries(item.selectedVariations).forEach(([varId, selection]) => {
          const dbVariation = dbItem.variations.find(v => v.id.toString() === varId.toString());
          
          if (dbVariation) {
            if (Array.isArray(selection)) {
              selection.forEach(opt => {
                const dbOpt = dbVariation.options.find(o => o.name === opt.name);
                if (dbOpt) unitPrice += (dbOpt.price || 0);
              });
            } else if (selection) {
              const dbOpt = dbVariation.options.find(o => o.name === selection.name);
              if (dbOpt) unitPrice += (dbOpt.price || 0);
            }
          }
        });
      }

      return {
        price_data: {
          currency: "bdt",
          product_data: {
            name: dbItem.title || item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.orderId}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: sessionUser.user.email,
      metadata: {
        orderId: order.orderId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}