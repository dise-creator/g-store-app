"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  Tag,
  ShieldX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/useAdmin";

interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n: number) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `CLIC-${part(4)}-${part(4)}`;
}

export default function PromoPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (!adminLoading && !isAdmin) router.push("/");
  }, [isAdmin, adminLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    loadPromos();
  }, [isAdmin]);

  const loadPromos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!value) return;
    setCreating(true);
    const code = generateCode();
    const { error } = await supabase.from("promo_codes").insert({
      code,
      type,
      value: Number(value),
      max_uses: Number(maxUses),
      expires_at: expiresAt || null,
      is_active: true,
    });
    if (!error) {
      setValue("");
      setMaxUses("1");
      setExpiresAt("");
      await loadPromos();
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("promo_codes").delete().eq("id", id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = async (id: string, current: boolean) => {
    await supabase
      .from("promo_codes")
      .update({ is_active: !current })
      .eq("id", id);
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)),
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00d68f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShieldX size={48} className="text-red-400" />
        <p className="text-white/30 font-black uppercase  text-xl">
          Нет доступа
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#00d68f] text-black font-black uppercase  text-xs rounded-2xl"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-10 pb-20 px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 border border-[#00d68f]/40 flex items-center justify-center text-white/40 hover:text-[#00d68f] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black  uppercase text-white tracking-tighter">
              Промо<span className="text-[#00d68f]">коды</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">
              Создавай и управляй скидочными кодами
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0a1860]/60 border border-[#00d68f]/40 rounded-[2rem] p-6 flex flex-col gap-4">
            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
              Новый промокод
            </p>

            <div className="flex gap-2">
              {(["percent", "fixed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase  transition-all ${type === t ? "bg-[#00d68f] text-black" : "bg-white/5 border border-[#00d68f]/40 text-white/40 hover:text-white"}`}
                >
                  {t === "percent" ? "Скидка %" : "Сумма ₽"}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                type === "percent"
                  ? "Например: 15 (15%)"
                  : "Например: 500 (500₽)"
              }
              className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/40 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
            />

            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Кол-во использований"
              min="1"
              className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/40 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
            />

            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/40 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all"
            />
            <p className="text-white/20 text-[10px] font-black -mt-2">
              Дата истечения (необязательно)
            </p>

            <button
              onClick={handleCreate}
              disabled={creating || !value}
              className="w-full py-4 bg-[#00d68f] text-black font-black uppercase  text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Сгенерировать
            </button>
          </div>

          <div className="bg-[#0a1860]/60 border border-[#00d68f]/40 rounded-[2rem] p-6">
            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">
              Все промокоды ({promos.length})
            </p>

            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 size={20} className="animate-spin text-[#00d68f]" />
              </div>
            )}

            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence>
                {promos.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-2xl border transition-all ${p.is_active ? "border-[#00d68f]/10 bg-[#00d68f]/[0.02]" : "border-[#00d68f]/30 bg-white/[0.01] opacity-40"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Tag size={12} className="text-[#00d68f] shrink-0" />
                        <p className="font-mono text-xs text-white font-black truncate">
                          {p.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyCode(p.code)}
                          className="text-white/20 hover:text-[#00d68f] transition-all"
                        >
                          {copied === p.code ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggle(p.id, p.is_active)}
                          className="text-white/20 hover:text-yellow-400 transition-all text-[10px] font-black px-1"
                        >
                          {p.is_active ? "OFF" : "ON"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-white/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[#00d68f] text-[10px] font-black">
                        {p.type === "percent" ? `−${p.value}%` : `−${p.value}₽`}
                      </span>
                      <span className="text-white/20 text-[10px]">
                        {p.used_count}/{p.max_uses} использований
                      </span>
                      {p.expires_at && (
                        <span className="text-white/20 text-[10px]">
                          до {new Date(p.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
