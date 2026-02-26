"use server";

import clientPromise from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postUser = async (payload) => {
  try {
    const { name, email, password, image } = payload;

    if (!name || !email || !password || !image) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const isExist = await db.collection("users").findOne({ email });

    if (isExist) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      image: image || null,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    if (result.acknowledged) {
      return {
        success: true,
        message: "User created successfully",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Server error",
    };
  }
};