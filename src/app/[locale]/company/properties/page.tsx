import { supabase } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";
import PropertiesManager from "./PropertiesManager";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PropertiesPage({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "properties",
  });

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1b3255] dark:text-white">
            {t("title")}
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 p-4">
            {t("loadingError")}
          </div>
        ) : (
          <PropertiesManager properties={properties || []} locale={locale} />
        )}
      </div>
    </main>
  );
}
