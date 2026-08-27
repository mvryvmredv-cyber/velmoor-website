"use client";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
export default function CompanyLogout() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("companyDashboard");
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(`/${locale}/company/login`);
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
    >
      {" "}
      <LogOut size={20} /> <span>{t("logout")}</span>{" "}
    </button>
  );
}
