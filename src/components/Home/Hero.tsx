"use client";
import { heroSlides } from "@/constants/heroData";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import { useTranslations } from "next-intl";
export default function Hero() {
  const t = useTranslations("hero");
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section id="home" className="relative h-screen">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-2 md:left-6 top-[75%] -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#1b3255]"
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-2   md:right-6 top-[75%] -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#1b3255]"
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>
      <Swiper
        modules={[Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        allowTouchMove={false}
        simulateTouch={false}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-screen">
              <Image
                src={slide.image}
                alt={slide.key}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    {t(`${slide.key}.title`)}
                  </h1>

                  <p className="mt-4 text-base sm:text-lg md:text-xl">
                    {t(`${slide.key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
