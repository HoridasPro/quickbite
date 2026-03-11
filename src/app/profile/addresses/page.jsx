"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [label, setLabel] = useState("Home");
  const [addressText, setAddressText] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [mapPosition, setMapPosition] = useState([23.8103, 90.4125]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const fetchAddresses = async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch(`/api/users/addresses?email=${session.user.email}`);
        const data = await res.json();
        if (data.success) {
          setAddresses(data.addresses);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.email) {
      fetchAddresses();
    }
  }, [session, status, router]);

  const handleLocationSelect = async (lat, lng) => {
    setMapPosition([lat, lng]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        setAddressText(data.address.road || data.address.suburb || data.display_name.split(",")[0]);
        setCity(data.address.city || data.address.state || data.address.county || "");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addressText || !city) return alert("Please fill in all fields");

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          label,
          address: addressText,
          city,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setAddressText("");
        setCity("");
        fetchAddresses();
        window.dispatchEvent(new Event("addressUpdated"));
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === id,
      }))
    );

    try {
      const res = await fetch("/api/users/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          email: session.user.email,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to set default");
        fetchAddresses();
      } else {
        window.dispatchEvent(new Event("addressUpdated"));
      }
    } catch (error) {
      console.error(error);
      fetchAddresses();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const res = await fetch(`/api/users/addresses?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
        window.dispatchEvent(new Event("addressUpdated"));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const copyAddresses = [...addresses];
    const draggedItemContent = copyAddresses[dragItem.current];
    copyAddresses.splice(dragItem.current, 1);
    copyAddresses.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setAddresses(copyAddresses);

    const updates = copyAddresses.map((addr, index) => ({
      id: addr._id,
      order: index
    }));

    try {
      await fetch("/api/users/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates,
          email: session.user.email,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading addresses...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-10">
      <div className="max-w-[680px] mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h1>
        
        <div className="space-y-4">
          {addresses.length === 0 && !showForm ? (
            <p className="text-gray-500 text-center py-4">No saved addresses yet.</p>
          ) : (
            addresses.map((addr, index) => (
              <div 
                key={addr._id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleSetDefault(addr._id)}
                className={`bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer transition-all ${
                  addr.isDefault ? "border-2 border-orange-500" : "border border-gray-100 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <input
                      type="radio"
                      name="defaultAddress"
                      checked={addr.isDefault || false}
                      readOnly
                      className="w-5 h-5 text-orange-600 cursor-pointer accent-orange-600 pointer-events-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">📍 {addr.label}</h3>
                      {addr.isDefault && (
                        <span className="bg-orange-100 text-orange-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.city}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center pl-9 sm:pl-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr._id);
                    }}
                    className="text-red-500 font-medium text-sm hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 space-y-4">
            <h3 className="font-bold text-lg mb-2">Add New Address</h3>

            <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-300 mb-2 relative">
              <Map position={mapPosition} onLocationSelect={handleLocationSelect} />
            </div>
            <p className="text-xs text-gray-500 text-right -mt-2">Click map to auto-fill</p>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Label</label>
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    type="button"
                    key={lbl}
                    onClick={() => setLabel(lbl)}
                    className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                      label === lbl ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Street / House Number / Apartment"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="City / Area"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition disabled:bg-gray-400 cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowForm(true)}
            className="mt-6 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition cursor-pointer"
          >
            + Add New Address
          </button>
        )}
      </div>
    </div>
  );
}