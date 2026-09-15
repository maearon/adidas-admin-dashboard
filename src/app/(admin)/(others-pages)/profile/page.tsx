import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import ProfileHashScroll from "@/components/user-profile/ProfileHashScroll";
import UserSecurityCard from "@/components/user-profile/UserSecurityCard";
import { getServerSession } from "@/lib/get-session";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profile | adidas Admin",
    description: "Account details and security settings for the signed-in user",
  };
}

export default async function Profile() {
  const session = await getServerSession();
  const user = session?.user;

  const profile = {
    id: user?.id ?? "",
    name: user?.name?.trim() || user?.email || "User",
    email: user?.email ?? "",
    image: user?.image ?? null,
    role: user?.role ?? null,
    emailVerified: Boolean(user?.emailVerified),
  };

  return (
    <div>
      <ProfileHashScroll />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={profile} />
          <UserInfoCard user={profile} />
          <UserSecurityCard user={profile} />
        </div>
      </div>
    </div>
  );
}
