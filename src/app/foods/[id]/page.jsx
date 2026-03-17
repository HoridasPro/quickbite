"use client";

import React, { useEffect, useState } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import CartSideBar from "@/components/CartSideBar";
import FoodsModal from "@/models/FoodsModal";
import CategoriesFoods from "@/components/CategoriesFoods";

const getFoodById = async (id) => {
  const res = await fetch(`/api/foods/${id}`);
  const data = await res.json();
  return data.success ? data.food : null;
};

const ProductPage = () => {
  const params = useParams();
  const { id } = params || {};
  const { t, language } = useTranslation();

  const [mainFood, setMainFood] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await getFoodById(id);
        setMainFood(item); 
      } catch (err) {
        console.error("Failed to fetch page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500 min-h-screen flex items-center justify-center">{t("loadingDetails")}</div>;
  if (!mainFood) return <div className="p-10 text-center text-red-500 min-h-screen flex items-center justify-center">{t("restaurantNotFound")}</div>;

  return (
    <div className="pb-20 px-2 sm:px-4">
      <div className="bg-[#FCFCFC] pt-4">
        <RestaurantHero 
          foodImg={mainFood.foodImg || mainFood.image} 
          title={language === 'bn' && (mainFood.titleBn || mainFood.foodNameBn) ? (mainFood.titleBn || mainFood.foodNameBn) : (mainFood.title || mainFood.foodName)} 
          id={mainFood.id || mainFood._id} 
        />
      </div>

      <div className="py-5 relative max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-8 lg:col-span-9">
            {/* FIX: Centralized component eliminates 100+ lines of duplicate logic */}
            <CategoriesFoods onFoodClick={(food) => setSelectedFood(food)} />
          </div>
          
          <div className="md:col-span-4 lg:col-span-3 pt-10">
            <CartSideBar />
          </div>
          
        </div>
      </div>

      {selectedFood && (
        <FoodsModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;