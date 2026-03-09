import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" });
    }

    const users = await dbConnect("users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await users.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } },
    );

    // 🔥 Check ENV values
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in .env");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    return NextResponse.json({
      message: "Reset link sent to your email!",
    });
  } catch (error) {
    console.error("FORGOT ERROR:", error);
    return NextResponse.json({
      message: "Server error",
      error: error.message,
    });
  }
}
