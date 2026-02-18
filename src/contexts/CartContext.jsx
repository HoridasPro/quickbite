"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // 1. Add loading flag

  // Load cart on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('quickbite_cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart data:", error);
        }
      }
      setIsLoaded(true); // 2. Mark as loaded
    }
  }, []);

  // Save to localStorage ONLY after loading is complete
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') { // 3. Check flag before saving
      localStorage.setItem('quickbite_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}