import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      }
    );

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}