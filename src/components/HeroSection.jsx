"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

// Swiper components ebong modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Image Imports
import fdpImg1 from "../../public/fdp.jpg";
import fdpImg2 from "../../public/chad-montano-.jpg";
import fdpImg3 from "../../public/chad-montano.jpg";
import fdpImg4 from "../../public/eaters-collective-.jpg";
import fdpImg5 from "../../public/luisa-brimble.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  const images = [fdpImg1, fdpImg2, fdpImg3, fdpImg4, fdpImg5];

  return (
    <section className="bg-orange-100 p-6 rounded-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-gray-700 mb-8 text-lg">{t("heroSubtitle")}</p>
          <Link
            href="/"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer inline-block"
          >
            {t("heroExploreBtn")}
          </Link>
        </div>

        {/* Image Slider Section */}
        <div className="md:w-1/2 w-full max-w-[400px]">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            effect={"fade"}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination, EffectFade]}
            className="mySwiper rounded-xl shadow-lg overflow-hidden"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full aspect-square">
                  <Image
                    src={img}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="rounded-xl object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
