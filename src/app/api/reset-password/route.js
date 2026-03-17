import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password required" }, { status: 400 });
    }

    const users = await dbConnect("users");
    const user = await users.findOne({ resetToken: token });

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // ENFORCEMENT: Edge-case block. Ensure the user wasn't banned after generating the token.
    if (user.accountStatus === "Banned") {
      return NextResponse.json({ message: "Account is banned. Password reset disabled." }, { status: 403 });
    }

    // Expiry check manually
    if (user.resetTokenExpiry < Date.now()) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.updateOne(
      { resetToken: token },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      },
    );

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("RESET ERROR:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}