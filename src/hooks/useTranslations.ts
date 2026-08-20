"use client"

import { useAppSelector } from "@/store/hooks"
import { selectLocale } from "@/store/localeSlice"
import { locales, Locale, Namespace } from "@/lib/locale"

const DEFAULT_LOCALE: Locale = "en_US"

function deepMerge<T>(base: T, overlay: T): T {
  if (!overlay) return base
  if (typeof base !== "object" || base === null) return overlay ?? base
  if (typeof overlay !== "object" || overlay === null) return overlay
  if (Array.isArray(overlay)) return overlay

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [key, value] of Object.entries(overlay as Record<string, unknown>)) {
    const prev = out[key]
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMerge(prev, value)
    } else if (value !== undefined) {
      out[key] = value
    }
  }
  return out as T
}

export function interpolate(
  template: string,
  vars: Record<string, string | number> = {}
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key])
  )
}

export function useTranslations<N extends Namespace>(namespace: N) {
  let locale = useAppSelector(selectLocale) as Locale | undefined

  if (!locale || !locales[locale]) {
    locale = DEFAULT_LOCALE
  }

  const base = locales[DEFAULT_LOCALE][namespace]
  const current = locales[locale][namespace] ?? base
  return deepMerge(base, current)
}
