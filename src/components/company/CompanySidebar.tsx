"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import CompanyLogout from "@/components/company/CompanyLogout";

export default function CompanySidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("companyDashboard");

  const currentStatus = searchParams.get("status");

  const isDashboard = pathname === `/${locale}/company/dashboard`;

  const isProperties =
    pathname === `/${locale}/company/properties` && !currentStatus;

  const isStatus = (status: string) =>
    pathname === `/${locale}/company/properties` && currentStatus === status;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      active
        ? "bg-white text-[#1b3255] shadow-sm"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="hidden lg:flex w-72 bg-[#1b3255] text-white flex-col fixed inset-y-0 left-0 z-40">
      {/* Logo */}
      <div className="px-7 py-7 border-b border-white/10">
        <p className="text-xl font-bold tracking-[3px]">VELMOOR</p>

        <p className="text-sm text-white/50 mt-1">{t("portal")}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href={`/${locale}/company/dashboard`}
          className={linkClass(isDashboard)}
        >
          <LayoutDashboard size={20} />
          <span>{t("dashboard")}</span>
        </Link>

        <Link
          href={`/${locale}/company/properties`}
          className={linkClass(isProperties)}
        >
          <Building2 size={20} />
          <span>{t("properties")}</span>
        </Link>

        <Link
          href={`/${locale}/company/properties?status=pending`}
          className={linkClass(isStatus("pending"))}
        >
          <Clock3 size={20} />
          <span>{t("pending")}</span>
        </Link>

        <Link
          href={`/${locale}/company/properties?status=available`}
          className={linkClass(isStatus("available"))}
        >
          <CheckCircle2 size={20} />
          <span>{t("available")}</span>
        </Link>

        <Link
          href={`/${locale}/company/properties?status=sold`}
          className={linkClass(isStatus("sold"))}
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
  );
}
