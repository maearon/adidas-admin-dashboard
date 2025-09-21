// app/admin/layout.tsx (Server Component)
import type { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "👕Admin' Sneakers and Activewear | adidas US👕",
    description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/signin");

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
