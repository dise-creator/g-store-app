"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Copy, ShoppingBag, Home } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  game_title: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    async function loadVouchers() {
      const { data } = await supabase
        .from("vouchers")
        .select("id, code, game_title")
        .eq("order_id", orderId);
      if (data) setVouchers(data);
    }
    loadVouchers();
  }, [orderId]);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <div className="max-w-[600px] w-full flex flex-col items-center gap-8">

        {/* Иконка успеха */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-[#63f3f7]/20 border-2 border-[#63f3f7]/40 flex items-center justify-center shadow-[0_0_40px_rgba(99,243,247,0.3)]"
        >
          <Check size={40} className="text-[#63f3f7]" />
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-2">
            Заказ <span className="text-[#63f3f7]">оформлен!</span>
          </h1>
          <p className="text-white/40 text-sm">
            Ключи отправлены на <span className="text-white font-black">{email}</span>
          </p>
        </motion.div>

        {/* Ключи */}
        {vouchers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4"
          >
            <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">Ваши ключи активации</p>
            {vouchers.map((voucher, i) => (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl gap-4"
              >
                <div className="min-w-0">
                  <p className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">{voucher.game_title}</p>
                  <p className="text-[#63f3f7] font-black text-sm font-mono tracking-widest">{voucher.code}</p>
                </div>
                <motion.button
                  onClick={() => handleCopy(voucher.id, voucher.code)}
                  whileTap={{ scale: 0.9 }}
                  className={`shrink-0 p-3 rounded-xl border transition-all ${
                    copied === voucher.id
                      ? "bg-[#63f3f7]/10 border-[#63f3f7]/30 text-[#63f3f7]"
                      : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                  }`}
                >
                  {copied === voucher.id ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </motion.div>
            ))}

            <div className="p-4 bg-[#63f3f7]/5 border border-[#63f3f7]/10 rounded-2xl">
              <p className="text-white/40 text-xs leading-relaxed">
                <span className="text-[#63f3f7] font-black">Как активировать:</span> Зайди в PS Store → Пополнить баланс → Введи код
              </p>
            </div>
          </motion.div>
        )}

        {/* Кнопки */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 w-full"
        >
          <Link
            href="/profile"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-2xl font-black text-xs uppercase italic tracking-widest transition-all"
          >
            <ShoppingBag size={16} />
            Мои заказы
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#63f3f7] text-black rounded-2xl font-black text-xs uppercase italic tracking-widest hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all"
          >
            <Home size={16} />
            В магазин
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}