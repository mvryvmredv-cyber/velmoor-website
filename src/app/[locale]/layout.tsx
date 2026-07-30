import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import LanguageFloating from "@/components/LanguageFloating";
import ThemeProvider from "@/components/Provider/ThemeProvider";
import RestoreScroll from "@/components/RestoreScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Alexandria, Manrope } from "next/font/google";
import Screen from "@/components/Screen";
import "../globals.css";

const bodyFont = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
});

const headingFont = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const locales = ["ar", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isArabic = locale === "ar";

  return {
    // metadataBase: new URL("https://velmoor.com"),

    title: isArabic
      ? "فيلمور | التسويق العقاري"
      : "Velmoor | Real Estate Marketing",

    description: isArabic
      ? "فيلمور شركة متخصصة في التسويق العقاري والاستشارات العقارية، نساعدك في الوصول إلى أفضل المشروعات السكنية والتجارية والاستثمارية داخل المنيا والمنيا الجديدة وجميع أنحاء مصر."
      : "Velmoor is a leading real estate marketing company helping clients discover premium residential, commercial and investment properties across Egypt.",

    keywords: isArabic
      ? [
          "فيلمور",
          "التسويق العقاري",
          "عقارات",
          "عقارات المنيا",
          "عقارات المنيا الجديدة",
          "شراء شقة",
          "بيع شقق",
          "استثمار عقاري",
          "كمبوند",
          "مشروعات عقارية",
        ]
      : [
          "Velmoor",
          "Real Estate",
          "Elminya",
          " New Minya",
          "Real Estate Marketing",
          "Property Investment",
          "Luxury Properties",
          "Commercial Properties",
          "Residential Projects",
          "Egypt Real Estate",
          "New Minya",
          "Minya",
        ],

    authors: [
      {
        name: "Velmoor",
      },
    ],

    creator: "Velmoor",

    publisher: "Velmoor",

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: isArabic
        ? "فيلمور | التسويق العقاري"
        : "Velmoor | Real Estate Marketing",

      description: isArabic
        ? "اكتشف أفضل الفرص العقارية مع فيلمور."
        : "Discover premium real estate opportunities with Velmoor.",

      // url: "https://velmoor.com",

      siteName: "Velmoor",

      locale: isArabic ? "ar_EG" : "en_US",

      type: "website",

      images: [
        {
          url: "/seo-cover.jpg",
          width: 1200,
          height: 630,
          alt: "Velmoor",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: isArabic
        ? "فيلامور | التسويق العقاري"
        : "Velmoor | Real Estate Marketing",

      description: isArabic
        ? "اكتشف أفضل الفرص العقارية مع فيلامور."
        : "Discover premium real estate opportunities with Velmoor.",

      images: ["/seo-cover.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${bodyFont.variable} ${headingFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-slate-950 transition-colors duration-300">
        <Screen>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <RestoreScroll />
              {children}
              <LanguageFloating />
              <WhatsAppButton />
            </NextIntlClientProvider>
          </ThemeProvider>
        </Screen>
      </body>
    </html>
  );
}
