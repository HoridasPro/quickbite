import FoodCardsSkeleton from "@/components/FoodCardsSkeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <FoodCardsSkeleton key={index}></FoodCardsSkeleton>
      ))}
    </div>
  );
};

export default loading;
