import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/dbConnect";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne({ email });

    // security reason: always same response
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 10 * 60 * 1000; // 10 min

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      }
    );

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await sendEmail(
      email,
      "Reset Your Password",
      `
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" 
           style="padding:10px 20px;background:black;color:white;text-decoration:none;">
           Reset Password
        </a>
        <p>This link will expire in 10 minutes.</p>
      `
    );

    return NextResponse.json({
      message: "If this email exists, a reset link has been sent",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}