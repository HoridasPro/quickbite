// "use server";

// import { dbConnect } from "@/app/lib/dbConnect";
// import bcrypt from "bcryptjs";
// // import connectDB from "@/lib/connectDB";
// import User from "@/models/User";
// export const postUser = async (payload) => {
//   try {
//     const existUser = await dbConnect("users").findOne({
//       email: payload.email.toLowerCase(),
//     });

//     if (existUser) {
//       return {
//         success: false,
//         message: "User already exists",
//       };
//     }

//     // Hash password
//     const hashPassword = await bcrypt.hash(payload.password, 10);
//     console.log(hashPassword);

//     // Prepare new user object
//     const newUser = {
//       name: payload.name,
//       email: payload.email.toLowerCase(),
//       password: hashPassword,
//       image: payload.image || null, // optional base64 image
//       role: "user",
//       createdAt: new Date().toISOString(),
//     };

//     // Insert into MongoDB
//     const result = await dbConnect("users").insertOne(newUser);
//     if (result.acknowledged) {
//       return {
//         success: true,
//         message: `User Created with ${result.insertedId.toString()}`,
//       };
//     }
//   } catch (error) {
//     console.error("Server error:", error);
//   }
// };

// export const loginUser = async (email, password) => {
//   await dbConnect();

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error("Invalid password");
//   }

//   return user;
// };

"use server";

import { dbConnect } from "@/app/lib/dbConnect";
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

    const newUser = {
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashPassword,
      image: payload.image || null,
      role: "user",
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
    console.log(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const collection = dbConnect("users");

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
      role: user.role,
      image: user.image,
    };
  } catch (error) {
    console.log(error);
  }
};
