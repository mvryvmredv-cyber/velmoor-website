import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-[#1b3255] dark:bg-[#0B1120] text-white pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo */}
        <div>
          <Image
            src="/assets/image/footer.jpg"
            alt="Velmoor"
            width={150}
            height={45}
            className="h-12 w-auto rounded-3xl"
            priority
          />

          <p className="mt-4 text-gray-300 leading-7">{t("description")}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5"> {t("quickLinks")}</h3>

          <ul className="space-y-3 text-gray-300 dark:text-gray-400">
            <li>
              <a
                href="#home"
                className="hover:text-blue-300 transition duration-300"
              >
                {t("links.home")}
              </a>
            </li>

            <li>
              <a
                href="#about"
                className="hover:text-blue-300 transition duration-300"
              >
                {t("links.about")}
              </a>
            </li>

            <li>
              <a
                href="#services"
                className="hover:text-blue-300 transition duration-300"
              >
                {t("links.services")}
              </a>
            </li>

            <li>
              <a
                href="#projects"
                className="hover:text-blue-300 transition duration-300"
              >
                {t("links.projects")}
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="hover:text-blue-300 transition duration-300"
              >
                {t("links.contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-5"> {t("services")}</h3>

          <ul className="space-y-3 text-gray-300">
            <li>{t("servicesList.consultation")}</li>
            <li>{t("servicesList.investment")}</li>
            <li>{t("servicesList.marketing")}</li>
            <li>{t("servicesList.buying")}</li>
            <li>{t("servicesList.payment")}</li>
            <li>{t("servicesList.support")}</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div>
            <h3 className="text-xl font-semibold mb-5"> {t("contact")}</h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <a
                  href="tel:+201034439824"
                  className=" hover:text-blue-300 dark:hover:text-blue-400"
                >
                  {t("phone")}
                </a>
              </div>

              <div className="flex items-center gap-3 hover:text-blue-300 dark:hover:text-blue-400">
                <Mail size={18} />
                <a href="mailto:velmoorelhamd@gmail.com" className="">
                  velmoorelhamd@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 hover:text-blue-300 dark:hover:text-blue-400">
                <MapPin size={18} />
                <span>{t("address")}</span>
              </div>
            </div>

            <div className="flex gap-5 mt-8">
              <a
                href="https://facebook.com/share/1GqcPLFhB4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="text-2xl text-gray-300 hover:text-blue-300  hover:-translate-y-1 transition-all duration-300  dark:hover:text-blue-400" />
              </a>

              <a
                href="https://instagram.com/velmoor40"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-2xl text-gray-300 hover:text-blue-300 hover:-translate-y-1 transition-all duration-300  dark:hover:text-blue-400" />
              </a>

              <a
                href="https://tiktok.com/@velmoor41"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="text-2xl text-gray-300 hover:text-blue-300 hover:-translate-y-1 transition-all duration-300  dark:hover:text-blue-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 mt-12 pt-6 text-center text-gray-300">
        {t("copyright")}
      </div>
    </footer>
  );
}
