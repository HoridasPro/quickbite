"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    apartment: "",
    note: "",
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount,
          customerInfo: formData,
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
          <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border">
            <iframe
              className="w-full h-full"
              src="https://maps.google.com/maps?q=Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-semibold text-black">📍 Road 71</p>
              <p className="text-sm text-gray-600">Dhaka</p>
            </div>
            <button className="text-gray-600 text-sm font-medium">Edit</button>
          </div>
          <hr className="mb-4 border-gray-300" />
          <p className="font-bold mb-4 text-black">We’re missing your street / house number</p>
          <div className="space-y-4">
            <input
              type="text"
              name="street"
              onChange={handleInputChange}
              placeholder="Street / House Number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <input
              type="text"
              name="apartment"
              onChange={handleInputChange}
              placeholder="Apartment #"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600"
            />
            <textarea
              rows="3"
              name="note"
              onChange={handleInputChange}
              placeholder="Note to rider - e.g. building, landmark"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black resize-none focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Delivery options</h2>
          <div className="space-y-3">
            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer">
              <span className="text-black">Standard 30 – 45 mins</span>
              <input type="radio" name="delivery" defaultChecked />
            </label>
            <label className="border border-gray-300 rounded-xl p-4 flex justify-between items-center cursor-pointer">
              <span className="text-black">Priority 25 – 40 mins (+ Tk 40)</span>
              <input type="radio" name="delivery" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Personal details</h2>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                onChange={handleInputChange}
                placeholder="First name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
              />
              <input
                type="text"
                name="lastName"
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
              />
            </div>
            <input
              type="text"
              name="mobile"
              onChange={handleInputChange}
              placeholder="Mobile number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black"
            />
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">Your Order</h2>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg h-fit text-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.selectedVariations && Object.values(item.selectedVariations).map((variant, i) => {
                        if (Array.isArray(variant)) {
                          return variant.map((v, j) => (
                            <p key={`${i}-${j}`} className="text-xs text-gray-500">+ {v.name}</p>
                          ));
                        } else if (variant) {
                          return <p key={i} className="text-xs text-gray-500">+ {variant.name}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    Tk {item.totalPrice}
                  </div>
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
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-400 hover:bg-orange-700 transition"
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