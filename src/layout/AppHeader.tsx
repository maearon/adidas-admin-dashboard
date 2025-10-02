// Navbar.tsx (server component)
import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import AppHeaderClient from "./AppHeaderClient";

export default async function AppHeader() {
  const session: Session | null = await getServerSession() // Session type-safe
  const user = session?.user;

  if (!user) return null;
  return <AppHeaderClient user={user} />
}
