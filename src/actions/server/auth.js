"use server";
import { connect } from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";
export const postUser = async (payload) => {
  try {
    const { email, password, name, photo } = payload;

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password required",
      };
    }

    const collection = await connect("users");

    //Check existing user properly
    const isUserExist = await collection.findOne({
      email: email.toLowerCase(),
    });
    if (isUserExist) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    //Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name: name || "",
      email: email.toLowerCase(),
      photo: photo || "",
      role: "user",
      password: hashPassword,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(newUser);
    if (result.acknowledged) {
      return {
        success: true,
        message: `User created with ID ${result.insertedId}`,
      };
    }
    return {
      success: false,
      message: "User creation failed",
    };
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      return {
        success: false,
        message: "Email already registered",
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
