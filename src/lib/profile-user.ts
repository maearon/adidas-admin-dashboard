export type ProfileUserView = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  emailVerified?: boolean;
};

export function splitDisplayName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "—", last: "—" };
  if (parts.length === 1) return { first: parts[0], last: "—" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}
