import React from "react";
const CartSideBar = async () => {
  return (
    <div className="w-full md:w-80 bg-white shadow-md rounded-xl p-4 sticky top-24 h-auto md:h-[calc(100vh-6rem)] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Your Cart</h3>
      <p className="text-gray-500 text-sm">Add items to see your cart.</p>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-gray-700 font-medium">Total: Tk 0</p>
        <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
          Review Payment
        </button>
      </div>
    </div>
  );
};

export default CartSideBar;
