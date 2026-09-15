"use client";

import type { ProfileUserView } from "@/lib/profile-user";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserInfoCard({ user }: { user: ProfileUserView }) {
  const t = useTranslations("admin");
  const p = (t?.profile as Record<string, string | undefined>) ?? {};

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        {p.personalInfo ?? "Thông tin cá nhân"}
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            {p.fullName ?? "Họ tên"}
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user.name || "—"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Email
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user.email || "—"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            {p.role ?? "Vai trò"}
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user.role || "user"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            {p.roleHint ?? "Ghi chú"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {p.roleHintText ?? "Admin đổi vai trò tại trang Tài khoản (/users)."}
          </p>
        </div>
      </div>
    </div>
  );
}
