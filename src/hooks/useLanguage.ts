"use client";

import { SupportedLocale } from "@/lib/constants/localeOptions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLocale, setLocale } from "@/store/localeSlice";

export function useLanguage() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(selectLocale) as SupportedLocale;

  const setLanguage = (value: SupportedLocale) => {
    dispatch(setLocale(value));
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`;
    localStorage.setItem("NEXT_LOCALE", value);

    // 🔥 cập nhật lang attribute cho <html>
    const langAttr = value.split("_")[0]; // ví dụ: "en_US" -> "en"
    document.documentElement.setAttribute("lang", langAttr);
  };

  const toggleLanguage = () => {
    const order: SupportedLocale[] = ["en_US", "vi_VN", "ja_JP"]
    const idx = order.indexOf(locale)
    const next = order[(idx + 1) % order.length]
    setLanguage(next)
  }

  return {
    locale,
    setLanguage,
    toggleLanguage,
  };
}
