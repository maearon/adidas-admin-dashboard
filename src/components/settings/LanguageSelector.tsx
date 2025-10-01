"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { useTranslations } from "@/hooks/useTranslations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SupportedLocale } from "@/lib/constants/localeOptions"

export function LanguageSelector() {
  const { locale, setLanguage } = useLanguage()
  const t = useTranslations("settings")

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLocale)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="language">{t?.appearance?.language}</Label>
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en_US">{t?.appearance?.languageOptions?.en_US}</SelectItem>
          <SelectItem value="vi_VN">{t?.appearance?.languageOptions?.vi_VN}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
