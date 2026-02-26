"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Icons import

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let hasError = false;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
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

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
        confirmButtonColor: "#f97316",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push("/");
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center cursor-pointer">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
