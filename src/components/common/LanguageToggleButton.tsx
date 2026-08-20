"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslations } from "@/hooks/useTranslations";
import { SupportedLocale } from "@/lib/constants/localeOptions";

const OPTIONS: { value: SupportedLocale; flag: string }[] = [
  { value: "en_US", flag: "🇺🇸" },
  { value: "vi_VN", flag: "🇻🇳" },
  { value: "ja_JP", flag: "🇯🇵" },
];

export const LanguageToggleButton: React.FC = () => {
  const { locale, setLanguage } = useLanguage();
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale.split("_")[0]);
  }, [locale]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label={t?.language?.[locale] ?? locale}
      >
        <span className="text-base leading-none">
          {OPTIONS.find((o) => o.value === locale)?.flag ?? "🌐"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setLanguage(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                locale === opt.value ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <span>{opt.flag}</span>
              {t?.language?.[opt.value] ?? opt.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
