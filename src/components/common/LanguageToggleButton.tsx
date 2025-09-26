"use client";

import React from "react";
import { Globe, Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLocale, setLocale } from "@/store/localeSlice";
import { SupportedLocale } from "@/lib/constants/localeOptions";

export const LanguageToggleButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(selectLocale) as SupportedLocale;

  const handleChangeLocale = (value: SupportedLocale) => {
    dispatch(setLocale(value));
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`;
    localStorage.setItem("NEXT_LOCALE", value);
  };

  const toggleLocale = () => {
    const next = locale === "en_US" ? "vi_VN" : "en_US";
    handleChangeLocale(next);
  };

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {locale === "en_US" ? (
        <Globe className="w-5 h-5" />
      ) : (
        <Languages className="w-5 h-5" />
      )}
    </button>
  );
};
