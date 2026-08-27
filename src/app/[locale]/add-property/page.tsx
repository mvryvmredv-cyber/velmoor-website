"use client";

import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar/Navbar";
import AddPropertyForm from "@/components/AddProperty/AddPropertyForm";

export default function AddPropertyPage() {
  const t = useTranslations("addProperty");

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen bg-gray-50 dark:bg-slate-950
        pt-28 pb-16"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1b3255] dark:text-white">
              {t("title")}
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {t("subtitle")}
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-5 md:p-8">
            <AddPropertyForm />
          </div>
        </div>
      </main>
    </>
  );
}
