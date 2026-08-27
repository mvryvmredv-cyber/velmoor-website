import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Building2,
  Clock3,
  CheckCircle2,
  BadgeDollarSign,
  LayoutDashboard,
  Plus,
  ArrowRight,
  Home,
  Globe,
} from "lucide-react";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CompanyDashboard({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "companyDashboard",
  });

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const allProperties = properties || [];

  const pendingCount = allProperties.filter(
    (property) => property.status === "pending",
  ).length;

  const availableCount = allProperties.filter(
    (property) => property.status === "available",
  ).length;

  const soldCount = allProperties.filter(
    (property) => property.status === "sold",
  ).length;

  const recentProperties = allProperties.slice(0, 5);

  return (
    <main className="min-h-screen  bg-[#eef2f6] dark:bg-slate-950 pt-24 pb-10">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          {/* ================= MAIN ================= */}
          <div className="min-w-0">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Home size={16} />

                    <span>{t("portal")}</span>

                    {/* <span>/</span> */}

                    {/* <span className="text-[#1b3255] dark:text-blue-400">
                      {t("dashboard")}
                    </span> */}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#1b3255] dark:text-white">
                    {t("title")}
                  </h1>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {t("subtitle")}
                  </p>
                </div>

                {/* Language Button */}
                <Link
                  href={`/${locale === "ar" ? "en" : "ar"}/company/dashboard`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-[#1b3255] dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  <Globe size={18} />

                  <span>{locale === "ar" ? "English" : "العربية"}</span>
                </Link>
              </div>
            </header>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 p-4 mb-6">
                {t("loadingError")}
              </div>
            )}

            {/* ================= STATISTICS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
              <StatCard
                title={t("totalProperties")}
                value={allProperties.length}
                description={t("allProperties")}
                icon={<Building2 size={22} />}
              />

              <StatCard
                title={t("pending")}
                value={pendingCount}
                description={t("waitingForReview")}
                icon={<Clock3 size={22} />}
              />

              <StatCard
                title={t("available")}
                value={availableCount}
                description={t("currentlyAvailable")}
                icon={<CheckCircle2 size={22} />}
              />

              <StatCard
                title={t("sold")}
                value={soldCount}
                description={t("completedSales")}
                icon={<BadgeDollarSign size={22} />}
              />
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="grid md:grid-cols-2 gap-5 mb-6">
              <Link
                href={`/${locale}/add-property`}
                className="group bg-[#1b3255] rounded-3xl p-6 text-white hover:bg-[#142844] transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{t("quickAction")}</p>

                    <h3 className="text-xl font-bold mt-2">
                      {t("addProperty")}
                    </h3>

                    <p className="text-sm text-white/60 mt-2">
                      {t("addPropertyDescription")}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition">
                    <Plus size={23} />
                  </div>
                </div>
              </Link>

              <Link
                href={`/${locale}/company/properties`}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{t("manage")}</p>

                    <h3 className="text-xl font-bold text-[#1b3255] dark:text-white mt-2">
                      {t("properties")}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t("managePropertiesDescription")}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 text-[#1b3255] dark:text-blue-400 flex items-center justify-center group-hover:translate-x-1 transition">
                    <ArrowRight size={22} />
                  </div>
                </div>
              </Link>
            </section>

            {/* ================= RECENT PROPERTIES ================= */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 md:px-8 py-6 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-[#1b3255] dark:text-white">
                    {t("recentProperties")}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("latestProperties")}
                  </p>
                </div>

                <Link
                  href={`/${locale}/company/properties`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1b3255] dark:text-blue-400 hover:underline"
                >
                  {t("viewAll")}

                  <ArrowRight size={16} />
                </Link>
              </div>

              {recentProperties.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                  {t("noProperties")}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {recentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="px-6 md:px-8 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f7fa] dark:bg-slate-800 flex items-center justify-center text-[#1b3255] dark:text-blue-400 shrink-0">
                          <Building2 size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#1b3255] dark:text-white">
                            {property["property-type"]
                              ? t(`propertyTypes.${property["property-type"]}`)
                              : t("property")}
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            📍 {property.location || t("noLocation")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {property.price
                            ? `${Number(
                                String(property.price).replace(/,/g, ""),
                              ).toLocaleString("en-US")} ${t("currency")}`
                            : t("noPrice")}
                        </span>

                        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {property.status
                            ? t(`statuses.${property.status}`)
                            : t("statuses.pending")}
                        </span>

                        <Link
                          href={`/${locale}/company/properties/${property.id}`}
                          className="text-sm font-medium text-[#1b3255] dark:text-blue-400 hover:underline"
                        >
                          {t("details")}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

          <p className="text-3xl font-bold text-[#1b3255] dark:text-white mt-3">
            {value}
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-[#f5f7fa] dark:bg-slate-800 text-[#1b3255] dark:text-blue-400 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        {description}
      </p>
    </div>
  );
}
