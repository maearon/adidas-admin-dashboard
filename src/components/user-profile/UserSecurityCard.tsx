"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoadingButton } from "@/components/loading-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { authClient } from "@/lib/auth-client";
import type { ProfileUserView } from "@/lib/profile-user";
import { passwordSchema } from "@/lib/validation";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserSecurityCard({ user }: { user: ProfileUserView }) {
  const t = useTranslations("admin");
  const p = (t?.profile as Record<string, string | undefined>) ?? {};
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  async function handlePasswordSave() {
    const parsed = passwordSchema.safeParse(newPassword);
    if (!currentPassword.trim()) {
      toast.error(p.currentPasswordRequired ?? "Nhập mật khẩu hiện tại.");
      return;
    }
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Mật khẩu không hợp lệ.");
      return;
    }

    setPasswordLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setPasswordLoading(false);

    if (error) {
      toast.error(error.message || (p.passwordError ?? "Đổi mật khẩu thất bại."));
      return;
    }

    toast.success(p.passwordSaved ?? "Đã đổi mật khẩu.");
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handleEmailRequest() {
    if (!newEmail.trim() || newEmail === user.email) {
      toast.error(p.emailUnchanged ?? "Nhập email mới khác email hiện tại.");
      return;
    }

    setEmailLoading(true);
    const { error } = await authClient.changeEmail({
      newEmail: newEmail.trim(),
      callbackURL: "/email-verified",
    });
    setEmailLoading(false);

    if (error) {
      toast.error(error.message || (p.emailError ?? "Không thể gửi xác minh email."));
      return;
    }

    toast.success(p.emailVerificationSent ?? "Đã gửi email xác minh tới hộp thư hiện tại.");
  }

  async function handleRevokeSessions() {
    setRevokeLoading(true);
    const { error } = await authClient.revokeSessions();
    setRevokeLoading(false);

    if (error) {
      toast.error(error.message || (p.revokeError ?? "Không thể đăng xuất mọi thiết bị."));
      return;
    }

    toast.success(p.revokeSuccess ?? "Đã đăng xuất mọi thiết bị.");
    router.push("/signin");
  }

  return (
    <div
      id="security"
      className="scroll-mt-24 rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6"
    >
      <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
        {p.securityTitle ?? "Bảo mật tài khoản"}
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {p.securityLead ?? "Đổi mật khẩu, email và quản lý phiên đăng nhập."}
      </p>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              User ID
            </p>
            <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
              {user.id || "—"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {p.emailVerified ?? "Email verified"}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.emailVerified
                ? (p.yes ?? "Có")
                : (p.no ?? "Chưa")}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
          <h5 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
            {p.changePassword ?? "Đổi mật khẩu"}
          </h5>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="current-password">{p.currentPassword ?? "Mật khẩu hiện tại"}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="new-password">{p.newPassword ?? "Mật khẩu mới"}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <LoadingButton
            type="button"
            className="mt-4"
            loading={passwordLoading}
            onClick={handlePasswordSave}
          >
            {p.savePassword ?? "Lưu mật khẩu"}
          </LoadingButton>
        </div>

        <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
          <h5 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
            {p.changeEmail ?? "Đổi email"}
          </h5>
          <div className="max-w-xl">
            <Label htmlFor="new-email">{p.newEmail ?? "Email mới"}</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@company.com"
            />
          </div>
          <LoadingButton
            type="button"
            className="mt-4"
            loading={emailLoading}
            onClick={handleEmailRequest}
          >
            {p.requestEmailChange ?? "Gửi xác minh đổi email"}
          </LoadingButton>
        </div>

        <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
          <LoadingButton
            type="button"
            variant="outline"
            loading={revokeLoading}
            onClick={handleRevokeSessions}
          >
            {p.logoutEverywhere ?? "Đăng xuất mọi thiết bị"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
