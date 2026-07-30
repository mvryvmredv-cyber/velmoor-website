"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Play } from "lucide-react";
type ProjectCardProps = {
  images: string[];
  video: string;
  title: string;
  location: string;
  description: string;
};

export default function ProjectCard({
  images,
  video,
  title,
  location,
  description,
}: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("projects");

  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
      >
        <div className="flex-shrink-0">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            loop
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-72">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    className="
      absolute
      inset-0
      flex
      items-center
      justify-center
      bg-black/20
      opacity-0
      hover:opacity-100
      transition-all
      duration-300
    "
                  >
                    <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-full shadow-lg">
                      <div className="w-10 h-10 rounded-full bg-[#1b3255] flex items-center justify-center">
                        <Play size={20} fill="white" />
                      </div>

                      <span className="font-semibold text-[#1b3255]">
                        {t("watchVideo")}
                      </span>
                    </div>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="p-7 flex flex-col flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="text-[#1b3255] dark:text-blue-400 mt-2 font-medium">
            📍 {location}
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-7 mt-4 flex-1 ">
            {description}
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-red-500 transition"
            >
              ✕
            </button>

            <video
              ref={videoRef}
              src={video}
              controls
              autoPlay
              playsInline
              className="w-full rounded-2xl"
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
