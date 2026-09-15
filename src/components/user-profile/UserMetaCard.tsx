"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoadingButton } from "@/components/loading-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { authClient } from "@/lib/auth-client";
import type { ProfileUserView } from "@/lib/profile-user";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserMetaCard({ user }: { user: ProfileUserView }) {
  const t = useTranslations("admin");
  const p = (t?.profile as Record<string, string | undefined>) ?? {};
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();

  const initial = (user.name || user.email || "?").slice(0, 1).toUpperCase();
  const [name, setName] = useState(user.name);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [pendingImage, setPendingImage] = useState<string | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPendingImage(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  function openEditModal() {
    setName(user.name);
    setImagePreview(user.image);
    setPendingImage(undefined);
    openModal();
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(p.nameRequired ?? "Nhập họ tên.");
      return;
    }

    setSaving(true);
    const payload: { name: string; image?: string | null } = { name: trimmed };
    if (pendingImage !== undefined) {
      payload.image = pendingImage;
    }

    const { error } = await authClient.updateUser(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message || (p.saveError ?? "Lưu thất bại."));
      return;
    }

    toast.success(p.saved ?? "Đã lưu hồ sơ.");
    closeModal();
    router.refresh();
  }

  const displayImage = user.image;

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xl font-semibold text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-white/90">
              {displayImage ? (
                <Image
                  width={80}
                  height={80}
                  src={displayImage}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role || "user"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openEditModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            {p.edit ?? "Sửa"}
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[560px] m-4">
        <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-5 dark:bg-gray-900 lg:p-8">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            {p.editProfileTitle ?? "Sửa hồ sơ"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {p.editProfileLead ?? "Cập nhật tên hiển thị và ảnh đại diện."}
          </p>

          <div className="space-y-5">
            <div>
              <Label htmlFor="profile-name">{p.fullName ?? "Họ tên"}</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={p.fullNamePlaceholder ?? "Họ và tên"}
              />
            </div>

            <div>
              <Label htmlFor="profile-avatar">{p.avatar ?? "Ảnh đại diện"}</Label>
              <Input
                id="profile-avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {imagePreview && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                <Image
                  src={imagePreview}
                  alt={name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <LoadingButton type="button" loading={saving} onClick={handleSave}>
              {p.save ?? "Lưu"}
            </LoadingButton>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            >
              {p.cancel ?? "Hủy"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
