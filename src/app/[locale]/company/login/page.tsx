"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function CompanyLoginPage() {
  const router = useRouter();
  const t = useTranslations("companyLogin");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.log("LOGIN ERROR:", error.message);
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    if (!data.session) {
      console.log("NO SESSION");
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    console.log("LOGIN SUCCESS");
    console.log("USER:", data.user?.email);
    console.log("SESSION EXISTS:", !!data.session);

    // نجيب الـ session الحالية للتأكد إنها اتسجلت
    const { data: sessionData } = await supabase.auth.getSession();

    console.log("CURRENT SESSION:", sessionData.session);

    if (!sessionData.session) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    router.push(`/${locale}/company/dashboard`);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] dark:bg-slate-950 flex items-center justify-center px-4">
      {/* Language Button */}
      <Link
        href={`/${locale === "ar" ? "en" : "ar"}/company/login`}
        className="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1b3255] dark:text-white font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition"
      >
        <Globe size={18} />

        <span>{locale === "ar" ? "English" : "العربية"}</span>
      </Link>
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl grid md:grid-cols-2">
        {/* Left */}
        <div className="hidden md:flex relative bg-[#1b3255] min-h-[600px] p-10 text-white flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm tracking-[4px] uppercase opacity-70">
              Velmoor
            </p>

            <h1 className="text-4xl font-bold mt-6 leading-tight">
              {t("welcome")}
            </h1>

            <p className="mt-4 text-white/70 leading-7 max-w-sm">
              {t("description")}
            </p>
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <LockKeyhole size={28} />
            </div>

            <p className="mt-4 text-white/60 text-sm">{t("secureAccess")}</p>
          </div>

          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-white/5" />
        </div>

        {/* Right */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm text-[#1b3255] dark:text-blue-400 font-medium">
              {t("portal")}
            </p>

            <h2 className="text-3xl font-bold text-[#1b3255] dark:text-white mt-2">
              {t("title")}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t("subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t("email")}
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full h-13 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#1b3255]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t("password")}
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full h-13 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-11 pr-12 outline-none focus:ring-2 focus:ring-[#1b3255]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-xl bg-[#1b3255] text-white font-semibold hover:bg-[#142844] transition disabled:opacity-60"
            >
              {loading ? t("loading") : t("login")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
