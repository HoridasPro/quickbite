import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/lib/dbConnect";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({
        message: "Token and password required",
      });
    }

    const users = await dbConnect("users");

    const user = await users.findOne({ resetToken: token });

    if (!user) {
      return NextResponse.json({
        message: "Invalid token",
      });
    }

    // Expiry check manually
    if (user.resetTokenExpiry < Date.now()) {
      return NextResponse.json({
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.updateOne(
      { resetToken: token },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      },
    );

    return NextResponse.json({
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("RESET ERROR:", error);
    return NextResponse.json({
      message: "Server error",
      error: error.message,
    });
  }
}
