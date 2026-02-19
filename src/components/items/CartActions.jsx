"use client";

import React from 'react';

const CartActions = ({ quantity, setQuantity, onAdd }) => {
    return (
        <div className="flex gap-3 h-12">
            <div className="flex items-center border border-gray-300 rounded-lg w-28 md:w-32 justify-between px-1">
                <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-8 md:w-10 h-full text-gray-500 hover:text-[#D70F64] text-xl font-medium"
                >
                    −
                </button>
                <span className="font-bold text-gray-900">{quantity}</span>
                <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-8 md:w-10 h-full text-gray-500 hover:text-[#D70F64] text-xl font-medium"
                >
                    +
                </button>
            </div>

            <button 
                onClick={onAdd}
                className="flex-1 bg-[#D70F64] hover:bg-[#c20d5a] text-white font-bold rounded-lg transition-colors shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default CartActions;