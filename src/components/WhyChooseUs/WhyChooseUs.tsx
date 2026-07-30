"use client";
import { whyChooseData } from "@/constants/whyChooseData";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
export default function WhyChooseUs() {
  const t = useTranslations("whyChoose");
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-[#1b3255] font-bold dark:text-blue-400 uppercase tracking-[4px] font-serif text-2xl">
            {t("subtitle")}
          </h1>

          <h2 className="text-4xl md:text-5xl mt-4 mb-12 text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <div className="relative max-w-4xl mx-auto">
            {/* الخط في المنتصف */}
            <div className="absolute left-1/2 top-0 h-full w-1 bg-[#1b3255]/20 dark:bg-blue-400/20 -translate-x-1/2"></div>

            {whyChooseData.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                  }}
                >
                  {/* الأيقونة */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b3255] dark:bg-blue-600 flex items-center justify-center text-white shadow-lg z-10">
                    <Icon size={26} />
                  </div>

                  {/* المحتوى */}
                  <motion.div
                    className={`bg-white
dark:bg-slate-800


dark:border-slate-700 shadow-lg hover:shadow-2xl border border-transparent hover:border-[#1b3255] rounded-2xl p-6 w-[42%] transition-all duration-300${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {t(`${item.id}.title`)}
                    </h3>

                    <p
                      className="text-gray-600 dark:text-gray-300 leading-7 
group-hover:text-white
transition-colors duration-500"
                    >
                      {t(`${item.id}.description`)}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
