"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // FIX: Removed process.env.EMAIL_PASS which leaks secrets and breaks client-side routing
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    
    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Set New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full border border-gray-300 p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-2 rounded-md cursor-pointer disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        {message && (
          <p className="mt-4 text-sm text-center font-medium text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}