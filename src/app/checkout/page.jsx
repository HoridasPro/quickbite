"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Map from "@/components/Map";
import { ChevronDown, MapPin, Check } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [mapPosition, setMapPosition] = useState([23.8103, 90.4125]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    apartment: "",
    note: "",
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || session.user.email || "",
        firstName: prev.firstName || session.user.name?.split(" ")[0] || "",
        lastName: prev.lastName || session.user.name?.split(" ").slice(1).join(" ") || "",
      }));

      fetch(`/api/user/addresses?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            setSelectedAddressId(data.addresses[0]._id);
            setFormData((prev) => ({
              ...prev,
              street: data.addresses[0].address,
              city: data.addresses[0].city || "",
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomAddressSelect = (addr) => {
    setSelectedAddressId(addr._id);
    setFormData((prev) => ({
      ...prev,
      street: addr.address,
      city: addr.city || "",
    }));
    setIsDropdownOpen(false);
  };

  const handleLocationSelect = async (lat, lng) => {
    setMapPosition([lat, lng]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        setFormData((prev) => ({
          ...prev,
          street: data.address.road || data.address.suburb || data.display_name.split(",")[0],
          city: data.address.city || data.address.state || data.address.county || "",
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const finalEmail = session?.user?.email || formData.email;
    if (!finalEmail) {
      alert("Please login or provide an email to place an order.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          totalAmount,
          customerInfo: formData,
          email: finalEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        alert("Order placed successfully! Order ID: " + data.order.orderId);
        router.push("/orders");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex justify-center py-10 text-gray-800 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-extrabold mb-4 text-black">Delivery address</h2>
          
          {savedAddresses.length > 0 && (
            <div className="mb-6 relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Select a Saved Address</label>
              
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isDropdownOpen ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    {selectedAddressId ? (
                      (() => {
                        const selected = savedAddresses.find((a) => a._id === selectedAddressId);
                        return selected ? (
                          <>
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              {selected.label}
                              {selected.isDefault && (
                                <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Default</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                              {selected.address}, {selected.city}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">Choose an address...</p>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-gray-500">Choose an address...</p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                  <div className="max-h-60 overflow-y-auto p-2">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => handleCustomAddressSelect(addr)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === addr._id ? "bg-orange-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {addr.label}
                            {addr.isDefault && (
                              <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Default</span>
                            )}
                          </span>
                          <span className="text-xs text-gray-500">{addr.address}, {addr.city}</span>
                        </div>
                        {selectedAddressId === addr._id && (
                          <Check size={18} className="text-orange-500 shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full h-48 rounded-xl overflow-hidden mb-2 border border-gray-300 relative z-0">
            <Map position={mapPosition} onLocationSelect={handleLocationSelect} />
          </div>
          <p className="text-xs text-gray-500 mb-4 text-right">Click the map to drop a pin and auto-fill your address</p>

          <hr className="mb-4 border-gray-300" />
          <p className="font-bold mb-4 text-black">Delivery Details</p>
          <div className="space-y-4">
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street / House Number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City / Area"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment #"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <textarea
              rows="3"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Note to rider - e.g. building, landmark"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black resize-none focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Delivery options</h2>
          <div className="space-y-3">
            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-gray-400 transition-colors">
              <span className="text-black">Standard 30 – 45 mins</span>
              <input type="radio" name="delivery" defaultChecked className="accent-orange-600 w-5 h-5" />
            </label>
            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-gray-400 transition-colors">
              <span className="text-black">Priority 25 – 40 mins (+ Tk 40)</span>
              <input type="radio" name="delivery" className="accent-orange-600 w-5 h-5" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Personal details</h2>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
              />
            </div>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Your Order</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex gap-3">
                    <div className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg h-fit text-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.selectedVariations &&
                        Object.values(item.selectedVariations).map((variant, i) => {
                          if (Array.isArray(variant)) {
                            return variant.map((v, j) => (
                              <p key={`${i}-${j}`} className="text-xs text-gray-500">
                                + {v.name}
                              </p>
                            ));
                          } else if (variant) {
                            return (
                              <p key={i} className="text-xs text-gray-500">
                                + {variant.name}
                              </p>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">Tk {item.totalPrice}</div>
                </div>
              ))}

              <div className="pt-4 flex justify-between items-center text-lg font-extrabold text-black">
                <span>Total</span>
                <span className="text-orange-600">Tk {totalAmount}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-400 hover:bg-orange-700 transition cursor-pointer"
        >
          {loading ? "Processing..." : `Place order (Tk ${totalAmount})`}
        </button>

        <p className="text-gray-600 text-sm">
          By making this purchase you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}