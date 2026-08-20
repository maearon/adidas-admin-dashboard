// src/lib/constants/localeOptions.ts

export type SupportedLocale =
  | "en_US"
  | "vi_VN"
  | "ja_JP"

export const localeDisplayMap: Record<SupportedLocale, string> = {
  en_US: "English (US)",
  vi_VN: "Tiếng Việt",
  ja_JP: "日本語",
}

export const countryDisplayMap: Record<SupportedLocale, string> = {
  en_US: "United States",
  vi_VN: "Việt Nam",
  ja_JP: "日本",
}

export const countryToLocaleMap: Record<string, SupportedLocale> = {
  "united-states": "en_US",
  "viet-nam": "vi_VN",
  japan: "ja_JP",
}

export interface LocaleOption {
  label: string
  value: SupportedLocale
  flagShow: string
  flag: string
}

export const localeOptions: LocaleOption[] = [
  {
    label: localeDisplayMap.en_US,
    value: "en_US",
    flagShow: "/flag/us-show.svg",
    flag: "/flag/us.svg",
  },
  {
    label: localeDisplayMap.vi_VN,
    value: "vi_VN",
    flagShow: "/flag/vn-show.svg",
    flag: "/flag/vn.svg",
  },
  {
    label: localeDisplayMap.ja_JP,
    value: "ja_JP",
    flagShow: "/flag/jp-show.svg",
    flag: "/flag/jp.svg",
  },
]
