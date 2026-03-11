"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const InputSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.trim()) {
      router.push(`/foods?search=${encodeURIComponent(val)}`);
    } else {
      router.push(`/foods`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/foods?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/foods`);
    }
  };

  return (
    <div className="relative w-full lg:w-[400px] py-5">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          name="search"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for restaurants, cuisines, and dishes"
          className="w-full pl-10 pr-24 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600 transition cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default InputSearch;