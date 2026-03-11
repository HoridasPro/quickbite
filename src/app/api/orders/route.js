import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const foodsCollection = await dbConnect("allFoods");

    const queryIds = body.items.map((item) => {
      try {
        return new ObjectId(item.itemId);
      } catch {
        return item.itemId;
      }
    });

    const dbItems = await foodsCollection.find({
      $or: [
        { _id: { $in: queryIds.filter(id => id instanceof ObjectId) } },
        { id: { $in: queryIds.map(id => typeof id === 'string' ? parseInt(id) : id) } },
        { id: { $in: queryIds.map(String) } }
      ]
    }).toArray();

    let serverTotalAmount = 0;
    const sanitizedItems = [];

    for (const item of body.items) {
      const quantity = parseInt(item.quantity);
      
      if (isNaN(quantity) || quantity <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid item quantity" },
          { status: 400 }
        );
      }

      const dbItem = dbItems.find(
        (dbI) => dbI._id.toString() === item.itemId.toString() || dbI.id?.toString() === item.itemId.toString()
      );

      if (!dbItem) {
        return NextResponse.json(
          { success: false, message: `Item not found: ${item.title}` },
          { status: 400 }
        );
      }

      let unitPrice = dbItem.price || 0;
      let validatedVariations = {};

      if (item.selectedVariations && dbItem.variations) {
        Object.entries(item.selectedVariations).forEach(([varId, selection]) => {
          const dbVariation = dbItem.variations.find(v => v.id.toString() === varId.toString());
          if (dbVariation) {
            if (Array.isArray(selection)) {
              const validOptions = [];
              selection.forEach(opt => {
                const dbOpt = dbVariation.options.find(o => o.name === opt.name);
                if (dbOpt) {
                  unitPrice += (dbOpt.price || 0);
                  validOptions.push({ name: dbOpt.name, price: dbOpt.price });
                }
              });
              if (validOptions.length > 0) {
                validatedVariations[varId] = validOptions;
              }
            } else if (selection) {
              const dbOpt = dbVariation.options.find(o => o.name === selection.name);
              if (dbOpt) {
                unitPrice += (dbOpt.price || 0);
                validatedVariations[varId] = { name: dbOpt.name, price: dbOpt.price };
              }
            }
          }
        });
      }

      const itemTotal = unitPrice * quantity;
      serverTotalAmount += itemTotal;

      sanitizedItems.push({
        cartItemId: item.cartItemId || Date.now(),
        itemId: item.itemId,
        title: dbItem.title || item.title,
        restaurant: dbItem.restaurant_name || item.restaurant || "QuickBite",
        image: dbItem.foodImg || dbItem.image || item.image,
        selectedVariations: validatedVariations,
        quantity: quantity,
        basePrice: dbItem.price,
        totalPrice: itemTotal
      });
    }
    
    const newOrder = {
      orderId: body.orderId || `ORD-${Date.now()}`,
      items: sanitizedItems,
      totalAmount: serverTotalAmount,
      customerInfo: {
        firstName: body.customerInfo?.firstName || "",
        lastName: body.customerInfo?.lastName || "",
        email: session.user.email,
        mobile: body.customerInfo?.mobile || "",
        street: body.customerInfo?.street || "",
        city: body.customerInfo?.city || "",
        apartment: body.customerInfo?.apartment || "",
        note: body.customerInfo?.note || ""
      },
      email: session.user.email,
      status: "Pending",
      paymentStatus: "Unpaid",
      timestamp: new Date().toISOString()
    };

    const collection = await dbConnect("orders");

    const existingOrder = await collection.findOne({ orderId: newOrder.orderId });
    
    if (existingOrder && existingOrder.paymentStatus === "Paid") {
      return NextResponse.json(
        { success: false, message: "This order has already been paid and cannot be modified." },
        { status: 400 }
      );
    }
    
    const result = await collection.updateOne(
      { orderId: newOrder.orderId },
      { $set: newOrder },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order: newOrder, id: result.upsertedId || newOrder.orderId },
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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const orderId = searchParams.get("orderId");
    
    let query = {};

    if (orderId) {
      query.orderId = orderId;
      if (!["admin", "restaurant", "rider"].includes(session.user.role)) {
        query.email = session.user.email;
      }
    } else {
      if (["admin", "restaurant", "rider"].includes(session.user.role)) {
        if (email) query.email = email;
      } else {
        query.email = session.user.email;
      }
    }

    const collection = await dbConnect("orders");
    const orders = await collection.find(query).sort({ timestamp: -1 }).toArray();

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

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security: Only staff roles can update order statuses
    if (!session || !["admin", "restaurant", "rider"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, status, riderEmail, riderName } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect("orders");
    const existingOrder = await collection.findOne({ orderId: orderId });

    if (!existingOrder) {
       return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (existingOrder.paymentStatus !== "Paid") {
      const allowedUnpaidStatuses = ["Pending", "Cancelled"];
      if (!allowedUnpaidStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Unpaid orders can only be set to Pending or Cancelled." },
          { status: 400 }
        );
      }
    }

    // Build the update payload (supports linking a rider to the order)
    let updateFields = { status };
    if (riderEmail) updateFields.riderEmail = riderEmail;
    if (riderName) updateFields.riderName = riderName;

    const result = await collection.updateOne(
      { orderId: orderId },
      { $set: updateFields }
    );

    return NextResponse.json(
      { success: true, message: "Order updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}