// components/TrackView.tsx
"use client";
import { useEffect } from "react";

export function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      keepalive: true,
    }).catch(() => {});
  }, [productId]);
  return null;
}
