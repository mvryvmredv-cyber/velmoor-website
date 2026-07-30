"use client";

import { useEffect } from "react";

export default function RestoreScroll() {
  useEffect(() => {
    const scroll = sessionStorage.getItem("scroll-position");

    if (scroll) {
      window.scrollTo({
        top: Number(scroll),
        behavior: "instant",
      });

      sessionStorage.removeItem("scroll-position");
    }
  }, []);

  return null;
}
