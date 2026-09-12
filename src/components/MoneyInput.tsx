"use client";

import { useState } from "react";

type Props = {
  label: string;
  name: string;
  defaultValue: string | number | null;
};

export default function MoneyInput({ label, name, defaultValue }: Props) {
  const initialValue =
    defaultValue !== null && defaultValue !== undefined && defaultValue !== ""
      ? Number(String(defaultValue).replace(/,/g, "")).toLocaleString("en-US")
      : "";

  const [value, setValue] = useState(initialValue);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // نشيل أي حاجة غير الأرقام
    const rawValue = event.target.value.replace(/\D/g, "");

    // لو الحقل فاضي
    if (!rawValue) {
      setValue("");
      return;
    }

    // نضيف فواصل الآلاف
    setValue(Number(rawValue).toLocaleString("en-US"));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <input
        name={name}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        className="w-full h-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 outline-none focus:ring-2 focus:ring-[#1b3255]/20 dark:text-white"
      />
    </div>
  );
}
