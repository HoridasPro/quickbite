import React from "react";

const ShopCardSkeleton = () => {
  return (
    <div className="animate-pulse w-full block">
      {/* 1. Image Skeleton: aspect-[4/3] অরিজিনাল কার্ডের হাইট ধরে রাখবে */}
      <div className="relative aspect-[4/3] rounded-xl bg-gray-200 mb-2 overflow-hidden">
        {/* Shimmer Effect Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="px-1">
        {/* 2. Title & Location: পুরো লাইনের সমান বড় করা হয়েছে */}
        <div className="flex gap-2 mb-2">
          <div className="h-[18px] bg-gray-200 rounded w-full"></div>{" "}
          {/* Title line */}
        </div>

        {/* 3. Time Skeleton: আইকন এবং টেক্সট এরিয়া */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>{" "}
          {/* Clock Icon circle */}
          <div className="h-3 bg-gray-200 rounded w-16"></div> {/* Time text */}
        </div>

        {/* 4. Delivery Fee Skeleton: অরিজিনাল কার্ডের পজিশন অনুযায়ী */}
        <div className="mt-2 flex items-center gap-1">
          <div className="h-3.5 w-3.5 bg-gray-200 rounded-sm"></div>{" "}
          {/* Delivery Icon */}
          <div className="h-3.5 bg-gray-200 rounded w-20"></div>{" "}
          {/* Fee text */}
        </div>
      </div>
    </div>
  );
};

export default ShopCardSkeleton;
