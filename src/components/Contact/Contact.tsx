"use client";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function Contact() {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    emailjs
      .sendForm(
        "service_0p9zf7a",
        "template_qzpe0vy",
        form,
        "h8cHenbS8Y6PmrZ51",
      )
      .then(() => {
        setStatus("success");
        form.reset(); // استخدمي form بدل e.currentTarget
        setLoading(false);

        setTimeout(() => setStatus(""), 5000);
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        setLoading(false);

        setTimeout(() => setStatus(""), 5000);
      });
  };
  return (
    <Reveal>
      <section
        id="contact"
        className="py-24 bg-[#f8f9fb] dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h1 className="text-[#1b3255] font-bold dark:text-blue-400 uppercase tracking-[4px] font-serif text-2xl">
              {t("subtitle")}
            </h1>

            <h2 className="text-3xl sm:text-4xl md:text-5xl  mt-4 mb-12 text-gray-900 dark:text-white">
              {t("title")}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Side */}
              <div>
                {/* <h3 className="text-3xl font-bold text-[#1b3255] dark:text-blue-400 mb-6">
                  {t("contactTitle")}
                </h3> */}

                <p className="text-gray-600  dark:text-gray-300 leading-8 mb-10">
                  {t("description")}
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 ">
                    <Phone className="text-[#1b3255]" size={24} />
                    <a
                      href="tel:+201034439824"
                      className="text-gray-600 dark:text-gray-300  dark:hover:text-blue-400 transition"
                    >
                      {t("phone")}
                    </a>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="text-[#1b3255]" size={24} />
                    <a
                      href="mailto:velmoorelhamd@gmail.com"
                      className="text-gray-600  dark:text-gray-300  dark:hover:text-blue-400 transition"
                    >
                      velmoorelhamd@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-4">
                    <MapPin className="text-[#1b3255]" size={24} />
                    <p className="text-gray-600  dark:text-gray-300  dark:hover:text-blue-400">
                      {t("address")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <MessageCircle className="text-green-600" size={24} />
                    <a
                      href="https://wa.me/201034439833"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600  dark:text-gray-300 hover:text-green-600 transition"
                    >
                      {t("whatsapp")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side */}

              <div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      name="name"
                      placeholder={t("form.name")}
                      className="w-full border  border-gray-300
dark:border-slate-600
dark:bg-slate-800
dark:text-white
dark:placeholder:text-gray-400 rounded-xl px-5 py-4 outline-none focus:border-[#1b3255] focus:ring-2 focus:ring-[#1b3255]/20 transition"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder={t("form.phone")}
                      className="w-full border border-gray-300
dark:border-slate-600
dark:bg-slate-800
dark:text-white
dark:placeholder:text-gray-400 rounded-xl px-5 py-4 outline-none focus:border-[#1b3255] focus:ring-2 focus:ring-[#1b3255]/20 transition"
                    />

                    <textarea
                      rows={5}
                      name="message"
                      placeholder={t("form.message")}
                      className="w-full border border-gray-300
dark:border-slate-600
dark:bg-slate-800
dark:text-white
dark:placeholder:text-gray-400 rounded-xl px-5 py-4 outline-none resize-none focus:border-[#1b3255] focus:ring-2 focus:ring-[#1b3255]/20 transition"
                    ></textarea>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1b3255] hover:bg-[#24477b] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300"
                    >
                      {loading ? t("form.sending") : t("form.send")}
                    </button>

                    {status === "success" && (
                      <p className="text-green-600 text-center font-medium">
                        {t("form.success")}
                      </p>
                    )}

                    {status === "error" && (
                      <p className="text-red-600 text-center font-medium">
                        {t("form.error")}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
