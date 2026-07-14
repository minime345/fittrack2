"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBlock() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="my-10 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3940256099942544" // 👉 ТЕСТОВ ID
        data-ad-slot="1390018435"              // 👉 ТЕСТОВ слот
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
