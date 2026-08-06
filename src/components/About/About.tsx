"use client";
import { about } from "@/constants/aboutData";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function About() {
  const t = useTranslations("about");

  return (
    <Reveal>
      <section
        id="about"
        className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-[#1b3255]  font-bold dark:text-blue-400 uppercase tracking-[4px] font-serif text-2xl">
              {t("subtitle")}
            </h1>

            <h2 className="text-3xl sm:text-4xl md:text-5xl  mt-4 text-gray-900 dark:text-white">
              {t("title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Image
                  src="/assets/image/About.jpg"
                  alt="About velmore"
                  width={600}
                  height={600}
                  className="w-full  object-cover rounded-3xl shadow-2xl"
                />

                <div className="absolute -bottom-8 -right-8 bg-[#1b3255] dark:bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                  <h3 className="text-4xl font-bold">
                    {" "}
                    {t("experience.number")}
                  </h3>
                  <p className="text-sm mt-2"> {t("experience.text")}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tightmb-12 text-gray-900 dark:text-white">
                {t("description1")}
              </h2>

              <p
                className="
mt-6
max-w-3xl
mx-auto
text-center

text-lg
sm:text-xl
md:text-2xl

leading-9
md:leading-10

text-gray-600
dark:text-gray-300
"
              >
                {t("description2")}
              </p>

              <div className="grid grid-cols-2 gap-5 mt-8">
                {about.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2
                      size={28}
                      className="text-[#1b3255] dark:text-blue-400 flex-shrink-0"
                    />

                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {t(`features.${feature}`)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
