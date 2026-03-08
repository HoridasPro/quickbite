"use client";

import { postUser } from "@/actions/server/auth";
import SocialLogin from "@/components/SocialLogin";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const image = form.image.value.trim();
    const password = form.password.value.trim();

    let hasError = false;
    const newErrors = { name: "", email: "", image: "", password: "" };

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    // Photo URL validation
    if (!image) {
      newErrors.image = "Photo URL is required";
      hasError = true;
    } else if (
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)
    ) {
      newErrors.image = "Invalid photo URL";
      hasError = true;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Call server
    const result = await postUser({ name, email, image, password });

    if (result?.message) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Please login",
        confirmButtonColor: "#f97316",
      }).then(() => {
        router.push("/login");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: result?.error || "Something went wrong",
        confirmButtonColor: "#f97316",
      });
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input
              name="image"
              type="url"
              placeholder="Enter your photo URL"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.image ? "border-red-500" : ""}`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md cursor-pointer"
          >
            Register
          </button>
        </form>
        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        <SocialLogin></SocialLogin>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
