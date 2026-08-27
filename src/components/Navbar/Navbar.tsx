"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { navLinks } from "@/constants/navLinks";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();

  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();

  const isAddPropertyPage = pathname.includes("/add-property");

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // useEffect(() => {
    //   setIsOpen(false);
    // }, [pathname]);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  /*
   * Add Property page:
   * Navbar should always look like the scrolled navbar
   * from the moment the page opens.
   */
  const solidNavbar = scrolled || isAddPropertyPage;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isAddPropertyPage
          ? "bg-white dark:bg-slate-900 shadow-md"
          : scrolled
            ? "bg-white dark:bg-slate-900 shadow-lg"
            : "bg-white/20 dark:bg-slate-900/80 backdrop-blur-md"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          solidNavbar ? "py-3" : "py-5"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-1">
          <Image
            src={
              resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"
            }
            alt="Velmoor"
            width={350}
            height={100}
            priority
            className="h-12 w-auto transition-all duration-300"
          />

          <div className="leading-tight">
            <span
              className={`navbar-logo text-[25px] font-serif tracking-[4px] transition-colors duration-500 ${
                solidNavbar
                  ? "text-[#1b3255] dark:text-white"
                  : "text-white hover:text-gray-200"
              }`}
            >
              {t("logo.title")}
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden xl:flex items-center gap-4 lg:gap-7 xl:gap-10">
          {navLinks.map((link) => (
            <li key={link.href} className="whitespace-nowrap">
              <Link
                href={
                  link.label === "addProperty"
                    ? `/${locale}/add-property`
                    : isAddPropertyPage
                      ? `/${locale}/${link.href}`
                      : link.href
                }
                className={`text-[14px] lg:text-[15px] xl:text-[17px] transition duration-300 ${
                  solidNavbar
                    ? "text-[#1b3255] dark:text-white hover:text-blue-700 dark:hover:text-blue-400"
                    : "text-white hover:text-gray-200"
                }`}
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Dark Mode */}
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="relative flex items-center justify-center w-11 h-11 rounded-full
             bg-gray-100 dark:bg-slate-800
             border border-gray-300 dark:border-slate-600
             hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {resolvedTheme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Sun size={20} className="text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Moon size={20} className="text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Language */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <button
            className={`xl:hidden ${
              solidNavbar ? "text-gray-800 dark:text-white" : "text-white"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 shadow-lg border-t border-gray-100 dark:border-slate-800">
          <ul className="flex flex-col items-center py-6 gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={
                    link.label === "addProperty"
                      ? `/${locale}/add-property`
                      : isAddPropertyPage
                        ? `/${locale}/${link.href}`
                        : link.href
                  }
                  onClick={() => setIsOpen(false)}
                  className="text-[15px] text-[#1b3255] dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition duration-300"
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
