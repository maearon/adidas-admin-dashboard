"use client"

import { useTheme } from "next-themes"
import { useTranslations } from "@/hooks/useTranslations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("settings")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-2">
      <Label htmlFor="theme">{t?.appearance?.theme}</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger>
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">{t?.appearance?.themeOptions?.light ?? "Light"}</SelectItem>
          <SelectItem value="dark">{t?.appearance?.themeOptions?.dark ?? "Dark"}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
