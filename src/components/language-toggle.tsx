"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslations } from "@/hooks/useTranslations"
import { SupportedLocale } from "@/lib/constants/localeOptions"

const languages: { code: SupportedLocale; flag: string }[] = [
  { code: "en_US", flag: "🇺🇸" },
  { code: "vi_VN", flag: "🇻🇳" },
  { code: "ja_JP", flag: "🇯🇵" },
]

export function LanguageToggle() {
  const { locale, setLanguage } = useLanguage()
  const t = useTranslations("admin")
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdidasButton size="icon" className="border-2 border-foreground">
          <Globe className="h-4 w-4" />
        </AdidasButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-2 border-foreground">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLanguage(language.code)
              setOpen(!open)
            }}
            className={`cursor-pointer ${locale === language.code ? "bg-muted" : ""}`}
          >
            <span className="mr-2">{language.flag}</span>
            {t?.language?.[language.code] ?? language.code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
