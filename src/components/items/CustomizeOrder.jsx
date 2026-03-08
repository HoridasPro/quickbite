"use client";

import React from "react";

const CustomizeOrder = ({ variations, handleOptionSelect, isSelected }) => {
  if (!variations || variations.length === 0) return null;

  return (
    <div className="space-y-8 mb-8">
      {variations.map((variant) => (
        <div key={variant.id}>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-bold text-gray-800 text-md">
                {variant.title}
              </h4>
              {variant.type === "checkbox" && (
                <p className="text-xs text-gray-400">
                  Select multiple options
                </p>
              )}
            </div>
            {variant.required ? (
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                Required
              </span>
            ) : (
              <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded">
                Optional
              </span>
            )}
          </div>

          <div className="space-y-3">
            {variant.options.map((opt, idx) => {
              const active = isSelected(variant.id, opt.name);
              return (
                <div
                  key={idx}
                  onClick={() =>
                    handleOptionSelect(variant.id, variant.type, opt)
                  }
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 
                    ${
                      active
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        active
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        active ? "font-medium text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {opt.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {opt.price > 0 ? `+ Tk ${opt.price}` : "Free"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomizeOrder;