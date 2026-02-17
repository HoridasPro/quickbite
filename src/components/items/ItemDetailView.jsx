"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ItemDetailView = ({ item }) => {
    const [quantity, setQuantity] = useState(1);

    const [selections, setSelections] = useState(() => {
        const defaults = {};
        if (item.variations) {
            item.variations.forEach((variant) => {
                if (variant.required && variant.options.length > 0) {
                    defaults[variant.id] = variant.options[0];
                }
            });
        }
        return defaults;
    });

    const handleOptionSelect = (variationId, type, option) => {
        setSelections((prev) => {
            if (type === 'radio') {
                return { ...prev, [variationId]: option };
            }

            if (type === 'checkbox') {
                const currentList = prev[variationId] || [];
                const isAlreadySelected = currentList.find((opt) => opt.name === option.name);

                if (isAlreadySelected) {
                    return { ...prev, [variationId]: currentList.filter((opt) => opt.name !== option.name) };
                } else {
                    return { ...prev, [variationId]: [...currentList, option] };
                }
            }
            return prev;
        });
    };

    const calculateTotal = () => {
        let total = item.price;
        Object.values(selections).forEach((selection) => {
            if (Array.isArray(selection)) {
                selection.forEach((opt) => (total += opt.price));
            } else if (selection) {
                total += selection.price;
            }
        });
        return total * quantity;
    };

    const isSelected = (variationId, optionName) => {
        const selection = selections[variationId];
        if (!selection) return false;
        if (Array.isArray(selection)) {
            return selection.some((opt) => opt.name === optionName);
        }
        return selection.name === optionName;
    };

    const handleAddToCart = () => {
        const missingRequirements = item.variations?.filter(variant => {
            if (!variant.required) return false;

            const selection = selections[variant.id];
            return !selection || (Array.isArray(selection) && selection.length === 0);
        });

        if (missingRequirements && missingRequirements.length > 0) {
            alert(`Please select options for: ${missingRequirements.map(v => v.title).join(", ")}`);
            return;
        }

        const orderPayload = {
            cartItemId: Date.now(),
            itemId: item.id,
            title: item.title,
            restaurant: item.restaurant_name,
            basePrice: item.price,
            selectedVariations: selections,
            quantity: quantity,
            totalPrice: calculateTotal(),
        };

        console.log("Order Placed:", orderPayload);
        alert(`Added to Cart!\nTotal: Tk ${orderPayload.totalPrice}\n(Check Console for JSON)`);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="border-b border-gray-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center text-xs text-gray-500">
                        <Link href="/" className="hover:text-[#D70F64] transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium truncate">{item.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {item.tags.map((tag, index) => (
                                        <span key={index} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
                            <p className="text-gray-500 text-lg leading-relaxed mb-4">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="text-[#D70F64] font-bold text-2xl">Tk {item.price}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Base Price</span>
                            </div>
                        </div>

                        <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <span className="text-sm font-medium">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-6">
                            <h3 className="font-bold text-gray-900 text-lg mb-6 pb-3 border-b border-gray-100">Customize your Order</h3>

                            <div className="space-y-8 mb-8">
                                {item.variations?.map((variant) => (
                                    <div key={variant.id}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-md">{variant.title}</h4>
                                                {variant.type === 'checkbox' && <p className="text-xs text-gray-400">Select multiple options</p>}
                                            </div>
                                            {variant.required ? (
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Required</span>
                                            ) : (
                                                <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded">Optional</span>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {variant.options.map((opt, idx) => {
                                                const active = isSelected(variant.id, opt.name);
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleOptionSelect(variant.id, variant.type, opt)}
                                                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 
                                                        ${active ? 'border-[#D70F64] bg-pink-50 ring-1 ring-[#D70F64]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-[#D70F64] bg-[#D70F64]' : 'border-gray-300'}`}>
                                                                {active && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                            </div>
                                                            <span className={`text-sm ${active ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{opt.name}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500 font-medium">{opt.price > 0 ? `+ Tk ${opt.price}` : 'Free'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between font-bold text-gray-900 text-lg">
                                    <span>Total</span>
                                    <span className="text-[#D70F64]">Tk {calculateTotal()}</span>
                                </div>

                                <div className="flex gap-3 h-12">
                                    <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full text-gray-500 hover:text-[#D70F64] text-xl font-medium">−</button>
                                        <span className="font-bold text-gray-900">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full text-gray-500 hover:text-[#D70F64] text-xl font-medium">+</button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-[#D70F64] hover:bg-[#c20d5a] text-white font-bold rounded-lg transition-colors shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailView;