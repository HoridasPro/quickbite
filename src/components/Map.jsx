"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
      Loading Interactive Map...
    </div>
  ),
});

export default DynamicMap;