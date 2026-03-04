import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const addresses = await dbConnect("addresses").find({ email }).toArray();
    
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return (a.order || 0) - (b.order || 0);
    });

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, label, address, city } = body;

    if (!email || !label || !address) {
       return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingAddressesCount = await dbConnect("addresses").countDocuments({ email });
    const isFirstAddress = existingAddressesCount === 0;

    const newAddress = {
      email,
      label,
      address,
      city,
      isDefault: isFirstAddress,
      order: existingAddressesCount,
      createdAt: new Date().toISOString()
    };

    const result = await dbConnect("addresses").insertOne(newAddress);
    return NextResponse.json({ success: true, message: "Address added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, email } = body;

    if (!id || !email) {
      return NextResponse.json({ success: false, message: "ID and email are required" }, { status: 400 });
    }

    const collection = dbConnect("addresses");

    await collection.updateMany({ email }, { $set: { isDefault: false } });

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDefault: true } }
    );

    if (result.modifiedCount === 1 || result.matchedCount === 1) {
      return NextResponse.json({ success: true, message: "Default address updated" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update default address" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { updates, email } = body;

    if (!updates || !email) {
       return NextResponse.json({ success: false, message: "Updates and email are required" }, { status: 400 });
    }

    const collection = dbConnect("addresses");
    
    for (const item of updates) {
      await collection.updateOne(
        { _id: new ObjectId(item.id), email },
        { $set: { order: item.order } }
      );
    }

    return NextResponse.json({ success: true, message: "Order updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
       return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const result = await dbConnect("addresses").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
       return NextResponse.json({ success: true, message: "Address deleted" }, { status: 200 });
    } else {
       return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete address" }, { status: 500 });
  }
}