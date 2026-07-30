"use client";
import ReactCountryFlag from "react-country-flag";
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    {
      code: "en",
      label: "English",
      country: "US",
    },
    {
      code: "ar",
      label: "العربية",
      country: "EG",
    },
  ];
  const current = languages.find((l) => l.code === locale)!;
  const changeLocale = (lang: "ar" | "en") => {
    const scrollY = window.scrollY;

    sessionStorage.setItem("scroll-position", scrollY.toString());

    router.replace(pathname, { locale: lang });
  };

  return (
    <Menu as="div" className="relative">
      {/* Button */}
      <MenuButton
        className="
    flex items-center gap-1.5 sm:gap-2

    rounded-xl
    border border-gray-200 dark:border-slate-700

    bg-white/80 dark:bg-slate-900/80
    backdrop-blur-md

    px-2.5 py-1.5
    sm:px-4 sm:py-2

    shadow-sm
    hover:shadow-lg

    transition-all duration-300
  "
      >
        <ReactCountryFlag
          countryCode={current.country}
          svg
          style={{
            width: "1.2em",
            height: "1.2em",
          }}
          className="sm:w-6 sm:h-6"
        />

        <span className="text-sm sm:text-base font-medium">
          {current.label}
        </span>

        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
      </MenuButton>

      {/* Dropdown */}
      <Transition
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 scale-95 -translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom end"
          className="
            mt-3
            w-52
            rounded-2xl
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-700
            shadow-2xl
            p-2
            outline-none
            z-50
          "
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code}>
              <button
                onClick={() => changeLocale(lang.code as "ar" | "en")}
                className="
        flex items-center gap-3
        w-full
        rounded-xl
        px-4 py-3
        hover:bg-gray-100
        dark:hover:bg-slate-800
        transition
      "
              >
                <ReactCountryFlag
                  countryCode={lang.country}
                  svg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                  }}
                />

                <span>{lang.label}</span>
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
