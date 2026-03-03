"use server";

import { dbConnect } from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postUser = async (payload) => {
  try {
    console.log("Payload received:", payload);

    // Check if user already exists
    const existUser = await dbConnect("users").findOne({
      email: payload.email.toLowerCase(),
    });

    if (existUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // Hash password
    const hashPassword = await bcrypt.hash(payload.password, 10);
    console.log(hashPassword);

    // Prepare new user object
    const newUser = {
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashPassword,
      image: payload.image || null, // optional base64 image
      role: "user",
      createdAt: new Date().toISOString(),
    };

    // Insert into MongoDB
    const result = await dbConnect("users").insertOne(newUser);
    if (result.acknowledged) {
      return {
        success: true,
        message: `User Created with ${result.insertedId.toString()}`,
      };
    }
  } catch (error) {
    console.error("Server error:", error);
  }
};
