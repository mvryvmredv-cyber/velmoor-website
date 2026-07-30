"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/201034439833?text=مرحباً، أريد الاستفسار عن المشروعات المتاحة."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-5 z-50 group"
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"></span>

      {/* Button */}
      <div
        className="
          relative
          w-14
          h-14
          rounded-full
          bg-[#25D366]
          text-white
          flex
          items-center
          justify-center
          shadow-2xl
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:rotate-12
        "
      >
        <FaWhatsapp size={30} />
      </div>
    </a>
  );
}
