"use client";

import { projects } from "@/constants/projectsData";
import ProjectCard from "./ProjectCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
export default function Projects() {
  const t = useTranslations("projects");

  return (
    <Reveal>
      <section
        id="projects"
        className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-[#1b3255] font-bold dark:text-blue-400 uppercase tracking-[4px] font-serif text-2xl">
              {t("subtitle")}
            </h1>

            <h2 className="text-3xl sm:text-4xl md:text-5xl  mt-4 mb-12 text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <div className="relative px-0 md:px-20">
              <button
                className="
custom-prev
absolute
left-[-12px] md:left-0
top-[60%]
md:top-1/2
-translate-y-1/2
z-20
w-9 h-9
md:w-14 md:h-14
rounded-full
bg-white dark:bg-slate-900
shadow-lg
flex items-center justify-center
transition
hover:scale-110
"
              >
                <ChevronLeft
                  size={18}
                  className="md:w-6 md:h-6 text-[#1b3255] dark:text-white"
                />
              </button>

              <button
                className="custom-next absolute right-[-12px] md:right-0
 top-[60%]
md:top-1/2
md:w-14 md:h-14 -translate-y-1/2 z-20
    w-9 h-9 rounded-full bg-white dark:bg-slate-900
    shadow-xl flex items-center justify-center
    hover:scale-110 duration-300"
              >
                <ChevronRight
                  size={18}
                  className="md:w-6 md:h-6 text-[#1b3255] dark:text-white"
                />
              </button>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                }}
                spaceBetween={30}
                slidesPerView={1}
                loop
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
              >
                {projects.map((project, index) => (
                  <SwiperSlide key={index}>
                    <div>
                      <ProjectCard
                        id={project.id}
                        images={project.images}
                        video={project.video}
                        title={t(`${project.id}.title`)}
                        location={t(`${project.id}.location`)}
                        description={t(`${project.id}.description`)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
