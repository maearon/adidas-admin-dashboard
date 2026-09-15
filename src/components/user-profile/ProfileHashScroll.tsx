"use client";

import { useEffect } from "react";

export default function ProfileHashScroll() {
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#security") {
      return;
    }

    const target = document.getElementById("security");
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
