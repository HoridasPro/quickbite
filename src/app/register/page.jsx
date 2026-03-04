"use client";

import { postUser } from "@/actions/server/auth";
import SocialLogin from "@/components/SocialLogin";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;

    const formData = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      image: form.image.value,
    };

    const result = await postUser(formData);
    if (result?.message) {
      alert(result.message);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            name="image"
            type="url"
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md"
          />

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
