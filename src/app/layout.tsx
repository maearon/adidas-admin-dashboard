import { Outfit } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Metadata } from "next";
import { ReduxProvider } from "@/providers/redux-provider";
import ReactQueryProvider from "./ReactQueryProvider";
import ScrollToTop from "@/components/scroll-to-top";
import { LocationModalProvider } from "@/components/modal-providers";
import { resolveRequestLocale } from "@/lib/locale.server";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "adidas Dashboard %s | adidas US",
    default: "adidas Admin Dashboard | adidas US",
  },
  description:
    "Admin Dashboard Managment for Shop the latest adidas shoes, clothing and accessories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = await resolveRequestLocale(
    cookieStore.get("NEXT_LOCALE")?.value,
  );
  const htmlLang = initialLocale.split("_")[0];

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body
        className={`${outfit.className} dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <ReduxProvider initialLocale={initialLocale}>
          <ReactQueryProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
              <ScrollToTop />
              <LocationModalProvider />
            </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
