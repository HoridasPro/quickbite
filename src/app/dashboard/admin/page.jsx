"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Welcome to Admin Dashboard 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">Total Foods</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalFoods}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">
            ${stats.totalRevenue}
          </p>
        </div>

      </div>
    </div>
  );
}