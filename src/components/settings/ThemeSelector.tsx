"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "@/hooks/useTranslations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTheme } from "../../context/ThemeContext"

export function ThemeSelector() {
  const { theme, toggleTheme } = useTheme()
  const t = useTranslations("settings")
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="space-y-2">
      <Label htmlFor="theme">{t?.appearance?.theme}</Label>
      <Select
        value={theme} // sẽ highlight theme hiện tại
        onValueChange={() => toggleTheme()} // chọn bất kỳ sẽ gọi toggleTheme
      >
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
