"use client";
// import { services } from "@/constants/servicesData";
import { useTranslations } from "next-intl";

import {
  Building2,
  TrendingUp,
  Megaphone,
  Handshake,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import Reveal from "@/components/Reveal";
export default function Services() {
  const t = useTranslations("services");
  return (
    <Reveal>
      <section
        id="services"
        className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-[#1b3255] font-bold dark:text-blue-400 uppercase tracking-[4px] font-serif text-2xl">
              {t("subtitle")}
            </h1>

            <h2 className="text-3xl sm:text-4xl md:text-5xl  mt-4 text-gray-900 dark:text-white">
              {t("title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="
group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500
"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <Building2 size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("Real Estate Consultation.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("Real Estate Consultation.description")}
              </p>
            </div>

            <div
              className="group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <TrendingUp size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("Investment Advisory.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("Investment Advisory.description")}
              </p>
            </div>

            <div
              className="group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <Megaphone size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("Property Marketing.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("Property Marketing.description")}
              </p>
            </div>

            <div
              className="group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <Wallet size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("Buying Assistance.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("Buying Assistance.description")}
              </p>
            </div>

            <div
              className="group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <ShieldCheck size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("Payment Solutions.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("Payment Solutions.description")}
              </p>
            </div>

            <div
              className="group
bg-white
dark:bg-slate-900
rounded-3xl
p-8
shadow-lg
border
border-gray-100
dark:border-slate-700
hover:bg-[#1b3255]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500"
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#1b3255]
text-white flex items-center justify-center
group-hover:bg-white
group-hover:text-[#1b3255]
transition-all duration-500"
              >
                <Handshake size={34} />
              </div>
              <h3
                className="text-2xl font-bold mt-6 text-center
text-[#1b3255]
dark:text-white
group-hover:text-white
transition-colors duration-500"
              >
                {t("After-Sales Support.title")}
              </h3>
              <p
                className="text-gray-600
dark:text-gray-300
text-center mt-4 leading-7
group-hover:text-gray-200
transition-colors duration-500"
              >
                {t("After-Sales Support.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
