 
import React from "react";

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] py-10">
      <div className="max-w-[680px] mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">📍 Home</h3>
            <p className="text-sm text-gray-600 mt-1">Road 71, Dhaka, Bangladesh</p>
          </div>
          <button className="text-orange-500 font-medium text-sm">Edit</button>
        </div>

        <button className="mt-6 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition">
          + Add New Address
        </button>
      </div>
    </div>
  );
}