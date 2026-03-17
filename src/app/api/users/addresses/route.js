import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Banned users cannot view addresses. Suspended users retain Read-Only access.
    if (session.user.accountStatus === "Banned") {
      return NextResponse.json({ success: false, message: "Account Banned" }, { status: 403 });
    }

    // IDOR FIX: Hardcode the email to the securely verified session email.
    // Completely ignore any email passed in the URL searchParams.
    const email = session.user.email;

    const collection = await dbConnect("addresses");
    const addresses = await collection.find({ email }).toArray();
    
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return (a.order || 0) - (b.order || 0);
    });

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Only Active users can create new addresses.
    if (session.user.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Account restricted. Modifications disabled." }, { status: 403 });
    }

    const body = await request.json();
    const { label, address, city } = body; 
    
    // IDOR FIX: Extract email directly from the secure session, never the request body.
    const email = session.user.email;

    if (!label || !address) {
       return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const collection = await dbConnect("addresses");

    const existingAddressesCount = await collection.countDocuments({ email });
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

    const result = await collection.insertOne(newAddress);
    return NextResponse.json({ success: true, message: "Address added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Only Active users can update default addresses.
    if (session.user.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Account restricted. Modifications disabled." }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;
    
    // IDOR FIX: Force email from session
    const email = session.user.email;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const collection = await dbConnect("addresses");

    // Scope updates strictly to this user's email
    await collection.updateMany({ email }, { $set: { isDefault: false } });

    // IDOR FIX: Append 'email' to the query to ensure users cannot update an address ID that belongs to someone else
    const result = await collection.updateOne(
      { _id: new ObjectId(id), email: email },
      { $set: { isDefault: true } }
    );

    if (result.modifiedCount === 1 || result.matchedCount === 1) {
      return NextResponse.json({ success: true, message: "Default address updated" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Address not found or unauthorized" }, { status: 404 });
    }
  } catch (error) {
    console.error("Update default address error:", error);
    return NextResponse.json({ success: false, message: "Failed to update default address" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Only Active users can reorder addresses.
    if (session.user.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Account restricted. Modifications disabled." }, { status: 403 });
    }

    const body = await request.json();
    const { updates } = body;
    
    // IDOR FIX: Force email from session
    const email = session.user.email;

    if (!updates) {
       return NextResponse.json({ success: false, message: "Updates are required" }, { status: 400 });
    }

    const collection = await dbConnect("addresses");
    
    for (const item of updates) {
      // IDOR FIX: Append 'email' to the query ensuring cross-account pollution is impossible
      await collection.updateOne(
        { _id: new ObjectId(item.id), email },
        { $set: { order: item.order } }
      );
    }

    return NextResponse.json({ success: true, message: "Order updated" }, { status: 200 });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ENFORCEMENT: Only Active users can delete addresses.
    if (session.user.accountStatus !== "Active") {
      return NextResponse.json({ success: false, message: "Account restricted. Deletions disabled." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    // IDOR FIX: Force email from session
    const email = session.user.email;

    if (!id) {
       return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const collection = await dbConnect("addresses");

    // IDOR FIX: Append 'email' to the deletion query to prevent malicious deletion of other users' addresses via ID guessing
    const result = await collection.deleteOne({ _id: new ObjectId(id), email: email });
    
    if (result.deletedCount === 1) {
       return NextResponse.json({ success: true, message: "Address deleted" }, { status: 200 });
    } else {
       return NextResponse.json({ success: false, message: "Address not found or unauthorized" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete address" }, { status: 500 });
  }
}