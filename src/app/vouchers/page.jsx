"use client";

import { Ticket, Info } from "lucide-react";

export default function VouchersPage() {
  const vouchers = [
    {
      title: "50% off for your first order",
      subtitle: "50%",
      code: "yumpanda",
      min: "Min. order Tk 199",
      expiry: "Use by Dec 31, 2026",
    },
    {
      title: "BANKASIA150 : Bank Asia Credit Card",
      subtitle: "25%",
      code: "bankasia150",
      min: "Min. order Tk 599",
      expiry: "Use by Mar 20, 2026",
    },
    {
      title: "UCB150 : Applicable for all UCB",
      subtitle: "20%",
      code: "ucb150",
      min: "Min. order Tk 499",
      expiry: "Expiring in 13 hours",
    },
    {
      title: "DBBL120 : Dutch Bangla Debit Card",
      subtitle: "15%",
      code: "dbbl120",
      min: "Min. order Tk 399",
      expiry: "Use by Apr 15, 2026",
    },
    {
      title: "BRAC200 : BRAC Bank Special Offer",
      subtitle: "30%",
      code: "brac200",
      min: "Min. order Tk 699",
      expiry: "Use by May 10, 2026",
    },
    {
      title: "CITY100 : City Bank Exclusive",
      subtitle: "18%",
      code: "city100",
      min: "Min. order Tk 499",
      expiry: "Expiring in 2 days",
    },
  ];

  return (
    <div className="bg-[#ffffff] px-8 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Vouchers & offers
          </h1>

          <button className="flex items-center gap-2 border px-4 py-2 rounded text-gray-800 font-medium transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Ticket className="text-gray-600 w-4 h-4" />
            Add a Voucher
          </button>
        </div>

        <div className="flex gap-8 border-b">
          <button className="pb-3 border-b-2 border-black text-black font-semibold">
            All
          </button>
          <button className="pb-3 text-gray-500">Restaurants</button>
          <button className="pb-3 text-gray-500">Shops</button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 px-4">
        <div className="col-span-4 space-y-4">
          <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black bg-white">
            <option>Default</option>
            <option>Latest</option>
            <option>Expiring First</option>
            <option>Lowest minimum order value</option>
          </select>

          {vouchers.map((v, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-2 overflow-hidden"
            >
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"></div>

              <div className="flex gap-2">
                <div className="h-[32px]">
                  <Ticket className="text-orange-500 w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-800 leading-5">
                    {v.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="font-semibold text-gray-800">
                      {v.subtitle}
                    </span>

                    <Info className="w-4 h-4 text-gray-400" />

                    <span className="text-gray-500 text-sm">{v.code}</span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 my-3"></div>

                  <div className="flex items-center justify-between">
                    <div className="text-[12px] bg-gray-100 border border-gray-200 rounded-full px-3 py-[4px] text-gray-500">
                      {v.min} • {v.expiry}
                    </div>

                    <button className="text-orange-500 font-medium text-sm hover:underline">
                      Use now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE same as before */}
      </div>
    </div>
  );
}
