"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none -z-50"
        style={{
          background:
            "linear-gradient(160deg, #0d1f6e 0%, #0a1860 50%, #08113d 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#080f1e_100%)] opacity-40" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#0d1f6e]">
      {/* BLOB 1 — чистый CSS */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full opacity-30 bg-blue-700/20 blur-[40px] transform-gpu"
        style={{ animation: "blob1 20s linear infinite" }}
      />

      {/* BLOB 2 — чистый CSS */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full opacity-20 bg-blue-900/20 blur-[40px] transform-gpu"
        style={{ animation: "blob2 24s linear infinite" }}
      />

      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#080f1e_100%)] opacity-40" />
    </div>
  );
}
