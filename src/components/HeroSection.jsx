"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import fdpImg from "../../public/fdp.jpg";

const HeroSection = () => {
  return (
    <section className="bg-orange-100 py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Order Your Favorite Food Anytime
          </h1>

          <p className="text-gray-700 mb-8 text-lg">
            Fast, reliable, and smart food delivery platform connecting you with
            your favorite local restaurants.
          </p>

          <Link href="/">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">
              Explore Delivery
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={fdpImg}
            alt="Delicious Food"
            className="rounded-xl shadow-lg"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
