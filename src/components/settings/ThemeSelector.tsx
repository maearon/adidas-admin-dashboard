// "use client"

// import { useTheme } from "next-themes"
// import { useTranslations } from "@/hooks/useTranslations"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { useEffect, useState } from "react"

// export function ThemeSelector() {
//   const { theme, setTheme } = useTheme()
//   const t = useTranslations("settings")
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

//   return (
//     <div className="space-y-2">
//       <Label htmlFor="theme">{t?.appearance?.theme}</Label>
//       <Select value={theme} onValueChange={setTheme}>
//         <SelectTrigger>
//           <SelectValue placeholder="Select theme" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="light">{t?.appearance?.themeOptions?.light}</SelectItem>
//           <SelectItem value="dark">{t?.appearance?.themeOptions?.dark}</SelectItem>
//           <SelectItem value="system">{t?.appearance?.themeOptions?.system}</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function ThemeToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Define theme options with icons for different themes
  const themeOptions = {
    light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
    dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
    system: <Monitor className="h-[1.2rem] w-[1.2rem]" />,
  };

  const currentTheme = theme ?? "system"; // Default to system if no theme is set

  // Type guard for valid theme values
  const isValidTheme = (theme: string): theme is keyof typeof themeOptions => 
    theme === "light" || theme === "dark" || theme === "system";

  // Calculate the next theme based on the current theme
  const getNextTheme = () => {
    switch (currentTheme) {
      case "light":
        return "dark";
      case "dark":
        return "system";
      case "system":
        return "light";
      default:
        return "system"; // Fallback to 'system' if invalid
    }
  };

  const toggleTheme = () => {
    setTheme(getNextTheme()); // Switch to the next theme in the cycle
  };

  return (
    <div className={className} {...props}>
      <Link href="" onClick={toggleTheme}>
        {isValidTheme(currentTheme) && themeOptions[currentTheme]}
      </Link>
    </div>
  );
}
