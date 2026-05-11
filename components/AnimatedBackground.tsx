"use client";

import { motion } from "framer-motion";
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
        className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, #0d1530 0%, #080d1a 50%, #060a14 100%)",
        }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-700/20 blur-[100px] rounded-full opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-900/15 blur-[100px] rounded-full opacity-40" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080f1e_100%)] opacity-40" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 bg-[#0d1f6e] overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: ["-30%", "10%", "-30%"],
          y: ["-10%", "20%", "-10%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-700/30 blur-[150px] rounded-full opacity-70"
      />
      <motion.div
        animate={{
          x: ["30%", "-10%", "30%"],
          y: ["10%", "-20%", "10%"],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-900/25 blur-[150px] rounded-full opacity-60"
      />
      <motion.div
        animate={{
          x: ["0%", "15%", "0%"],
          y: ["0%", "-15%", "0%"],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[#00d68f]/[0.05] blur-[120px] rounded-full"
      />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080f1e_100%)] opacity-40" />
    </div>
  );
}
