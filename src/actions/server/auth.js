"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postUser = async (payload) => {
  try {
    const collection = await dbConnect("users");

    const existUser = await collection.findOne({
      email: payload.email.toLowerCase(),
    });

    if (existUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    // SECURITY: Only allow specific roles to be passed. Default to 'user'. 
    // Explicitly prevents someone from passing role: "admin" via API tools.
    const requestedRole = payload.role?.toLowerCase() || "user";
    const assignedRole = ["user", "rider", "restaurant"].includes(requestedRole) 
      ? requestedRole 
      : "user";

    const newUser = {
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashPassword,
      image: payload.image || null,
      role: assignedRole,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser);

    if (result.acknowledged) {
      return {
        success: true,
        message: "User created successfully",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const collection = await dbConnect("users");

    const user = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      image: user.image,
    };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};