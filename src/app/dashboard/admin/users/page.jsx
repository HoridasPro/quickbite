"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (id) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Users Management
        </h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
          Total Users: {users.length}
        </span>
      </div>

      <div className="w-full overflow-x-auto sm:overflow-visible min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-4 font-semibold text-gray-600 rounded-tl-xl">Name</th>
              <th className="py-4 px-4 font-semibold text-gray-600">Email</th>
              <th className="py-4 px-4 font-semibold text-gray-600">Role</th>
              <th className="py-4 px-4 font-semibold text-gray-600 text-center rounded-tr-xl">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-50 hover:bg-gray-50/80 transition duration-200"
              >
                <td className="py-4 px-4 text-gray-700 font-medium">
                  {user.name}
                </td>

                <td className="py-4 px-4 text-gray-600">
                  {user.email}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                      user.role === "admin"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>

                <td className="py-4 px-4 text-center space-x-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                    >
                      Make Admin
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-12 text-gray-500 font-medium"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}