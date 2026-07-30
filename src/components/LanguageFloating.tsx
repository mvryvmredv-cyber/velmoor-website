"use client";

import LanguageSwitcher from "./LanguageSwitcher";

export default function LanguageFloating() {
  return (
    <div
      className="
        fixed
        bottom-5
        left-5
        z-50
        md:hidden
      "
    >
      <LanguageSwitcher />
    </div>
  );
}
