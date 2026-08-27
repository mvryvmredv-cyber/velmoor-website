import Link from "next/link";
import CompanyLogout from "@/components/company/CompanyLogout";
import { getTranslations } from "next-intl/server";
import {
  LayoutDashboard,
  Building2,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function CompanyLayout({ children, params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "companyDashboard",
  });

  return (
    <div className="min-h-screenb bg-[#e9eef3] dark:bg-slate-950">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="hidden lg:flex w-60 bg-[#1b3255] text-white flex-col fixed inset-y-0 left-0 z-40">
          {/* Logo */}
          <div className="px-7 py-7 border-b border-white/10">
            <p className="text-xl font-bold tracking-[3px]">{t("llogo")}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              href={`/${locale}/company/dashboard`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <LayoutDashboard size={20} />
              <span>{t("dashboard")}</span>
            </Link>

            <Link
              href={`/${locale}/company/properties`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <Building2 size={20} />
              <span>{t("properties")}</span>
            </Link>

            <Link
              href={`/${locale}/company/properties?status=pending`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <Clock3 size={20} />
              <span>{t("pending")}</span>
            </Link>

            <Link
              href={`/${locale}/company/properties?status=available`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <CheckCircle2 size={20} />
              <span>{t("available")}</span>
            </Link>

            <Link
              href={`/${locale}/company/properties?status=sold`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <CircleDollarSign size={20} />
              <span>{t("sold")}</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <CompanyLogout />
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden h-20 bg-[#1b3255] text-white flex items-center px-5">
            <div>
              <p className="font-bold tracking-[3px]">VELMOOR</p>

              {/* <p className="text-xs text-white/50">{t("portal")}</p> */}
            </div>
          </header>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
