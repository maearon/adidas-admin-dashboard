"use client";

import { normalizeLocale } from "@/lib/utils";
import { Nullable } from "@/types/common";
import { useState, useEffect } from "react";

export function useLocationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLocation: Nullable<string> = localStorage.getItem("NEXT_LOCALE");

    if (!savedLocation) {
      const detected = normalizeLocale(navigator.language);
      localStorage.setItem("NEXT_LOCALE", detected);
      document.cookie = `NEXT_LOCALE=${detected}; path=/; max-age=31536000`;
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("location-modal-seen", "true");
    }
  };

  const selectLocation = (location: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("NEXT_LOCALE", location);
      localStorage.setItem("location-modal-seen", "true");
      document.cookie = `NEXT_LOCALE=${location}; path=/; max-age=31536000`;
    }
    setIsOpen(false);
  };

  return {
    isOpen,
    closeModal,
    selectLocation,
  };
}
