"use client";

import React from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, cartCount } = useCart();
  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <>
      {/* Dark Overlay - closes drawer when clicking outside */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />
      
      {/* Sliding Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-orange-500 w-6 h-6" />
            Your Cart ({cartCount})
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body (Scrollable Cart Items) */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-20 h-20 text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty.</p>
              <button onClick={onClose} className="text-orange-500 font-bold hover:underline cursor-pointer">Start browsing</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 relative group">
                  <div className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg h-fit text-sm">
                    {item.quantity}x
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 pr-6 leading-tight">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)} 
                        className="absolute right-4 top-4 text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Render selected variations (e.g., Extra Cheese, Large) */}
                    <div className="mt-1">
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
                    
                    <div className="mt-3 font-extrabold text-orange-500">
                      Tk {item.totalPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Total & Checkout Button) */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-lg font-extrabold text-gray-900">
              <span>Total</span>
              <span className="text-orange-600">Tk {totalAmount}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={onClose} 
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold flex justify-center items-center hover:bg-orange-700 transition shadow-lg shadow-orange-200 cursor-pointer"
            >
              Review Payment and Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}