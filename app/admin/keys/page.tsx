"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Check,
  Loader2,
  ChevronLeft,
  Key,
  Trash2,
  ShieldX,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/useAdmin";

interface Voucher {
  id: string;
  code: string;
  is_used: boolean;
  user_email: string | null;
  created_at: string;
  denomination: number;
  region: string;
}

const DENOMINATIONS = [250, 500, 1000, 2000, 3000, 5000];
const REGIONS = [
  { code: "TR", label: "Турция", flag: "🇹🇷" },
  { code: "IN", label: "Индия", flag: "🇮🇳" },
];

export default function KeysPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [denomination, setDenomination] = useState<number>(500);
  const [region, setRegion] = useState<string>("TR");
  const [keysText, setKeysText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [filterDenomination, setFilterDenomination] = useState<number | null>(
    null,
  );
  const [filterRegion, setFilterRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) router.push("/");
  }, [isAdmin, adminLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    loadVouchers();
  }, [isAdmin]);

  const loadVouchers = async () => {
    setLoadingVouchers(true);
    const { data } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });
    setVouchers(data || []);
    setLoadingVouchers(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setKeysText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!keysText.trim()) {
      setError("Нет ключей");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const keys = keysText
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      setError("Ключи не найдены в файле");
      setLoading(false);
      return;
    }

    const rows = keys.map((code) => ({
      code,
      is_used: false,
      user_email: null,
      denomination,
      region,
    }));
    const { error: insertError } = await supabase.from("vouchers").insert(rows);

    if (insertError) {
      setError("Ошибка: " + insertError.message);
    } else {
      const regionLabel = REGIONS.find((r) => r.code === region);
      setSuccess(
        `✅ Загружено ${keys.length} ключей · ${denomination.toLocaleString()} ₽ · ${regionLabel?.flag} ${regionLabel?.label}`,
      );
      setKeysText("");
      await loadVouchers();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("vouchers").delete().eq("id", id);
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (filterDenomination && v.denomination !== filterDenomination)
      return false;
    if (filterRegion && v.region !== filterRegion) return false;
    return true;
  });

  const freeCount = filteredVouchers.filter((v) => !v.is_used).length;
  const usedCount = filteredVouchers.filter((v) => v.is_used).length;

  const denominationStats = DENOMINATIONS.map((d) => ({
    value: d,
    TR: {
      free: vouchers.filter(
        (v) => v.denomination === d && v.region === "TR" && !v.is_used,
      ).length,
      used: vouchers.filter(
        (v) => v.denomination === d && v.region === "TR" && v.is_used,
      ).length,
    },
    IN: {
      free: vouchers.filter(
        (v) => v.denomination === d && v.region === "IN" && !v.is_used,
      ).length,
      used: vouchers.filter(
        (v) => v.denomination === d && v.region === "IN" && v.is_used,
      ).length,
    },
  })).filter((d) => d.TR.free + d.TR.used + d.IN.free + d.IN.used > 0);

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShieldX size={48} className="text-red-400" />
        <p className="text-white/30 font-black uppercase text-xl">
          Нет доступа
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#f5a623] text-black font-black uppercase text-xs rounded-2xl"
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
            className="w-10 h-10 rounded-xl bg-white/5 border border-[#f5a623]/40 flex items-center justify-center text-white/40 hover:text-[#f5a623] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
              Загрузка <span className="text-[#f5a623]">ключей</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">
              Загружай .txt файл — каждый ключ на новой строке
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                Регион карты
              </p>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => setRegion(r.code)}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                      region === r.code
                        ? "bg-[#f5a623] text-black"
                        : "bg-white/5 border border-[#f5a623]/40 text-white/40 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{r.flag}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                Номинал карты PSN
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DENOMINATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDenomination(d)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-1.5 ${
                      denomination === d
                        ? "bg-[#f5a623] text-black"
                        : "bg-white/5 border border-[#f5a623]/40 text-white/40 hover:text-white"
                    }`}
                  >
                    <CreditCard size={12} />
                    {d.toLocaleString()} ₽
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                Файл с ключами (.txt)
              </p>
              <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-[#f5a623]/40 rounded-2xl cursor-pointer hover:border-[#f5a623]/30 transition-all group">
                <Upload
                  size={24}
                  className="text-white/20 group-hover:text-[#f5a623]/50 transition-all"
                />
                <p className="text-white/30 text-xs font-black uppercase">
                  Нажми или перетащи файл
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-white/20 text-[10px] uppercase font-black tracking-widest my-3 text-center">
                или вставь вручную
              </p>
              <textarea
                value={keysText}
                onChange={(e) => setKeysText(e.target.value)}
                placeholder={"XXXXX-XXXXX-XXXXX\nXXXXX-XXXXX-XXXXX"}
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-[#f5a623]/40 rounded-2xl text-white/70 font-mono text-xs focus:outline-none focus:border-[#f5a623]/40 transition-all placeholder-white/10 resize-none"
              />
              {keysText && (
                <p className="text-[#f5a623] text-[10px] font-black mt-2">
                  {keysText.split("\n").filter(Boolean).length} ключей ·{" "}
                  {denomination.toLocaleString()} ₽ ·{" "}
                  {REGIONS.find((r) => r.code === region)?.flag}{" "}
                  {REGIONS.find((r) => r.code === region)?.label}
                </p>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-[#f5a623]/10 border border-[#f5a623]/40 rounded-2xl text-[#f5a623] text-sm font-bold"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-5 bg-[#f5a623] text-black font-black uppercase text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Загружаем...
                </>
              ) : (
                <>
                  <Upload size={18} />{" "}
                  {REGIONS.find((r) => r.code === region)?.flag}{" "}
                  {denomination.toLocaleString()} ₽ — Загрузить
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                Фильтр по региону
              </p>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.code}
                    onClick={() =>
                      setFilterRegion(filterRegion === r.code ? null : r.code)
                    }
                    className={`flex-1 py-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                      filterRegion === r.code
                        ? "bg-[#f5a623] text-black"
                        : "bg-white/5 border border-[#f5a623]/40 text-white/40 hover:text-white"
                    }`}
                  >
                    {r.flag} {r.label}
                  </button>
                ))}
              </div>
            </div>

            {denominationStats.length > 0 && (
              <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6">
                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                  По номиналам
                </p>
                <div className="flex flex-col gap-2">
                  {denominationStats.map((d) => (
                    <button
                      key={d.value}
                      onClick={() =>
                        setFilterDenomination(
                          filterDenomination === d.value ? null : d.value,
                        )
                      }
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        filterDenomination === d.value
                          ? "border-[#f5a623]/30 bg-[#f5a623]/5"
                          : "border-[#f5a623]/30 hover:border-[#f5a623]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-[#f5a623]" />
                        <span className="text-white font-black text-sm">
                          {d.value.toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-[9px] bg-white/5 border border-[#f5a623]/40 text-white/50 px-1.5 py-1 rounded-lg font-black">
                          🇹🇷 {d.TR.free} св
                        </span>
                        <span className="text-[9px] bg-white/5 border border-[#f5a623]/40 text-white/50 px-1.5 py-1 rounded-lg font-black">
                          🇮🇳 {d.IN.free} св
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {(filterDenomination || filterRegion) && (
                  <button
                    onClick={() => {
                      setFilterDenomination(null);
                      setFilterRegion(null);
                    }}
                    className="mt-2 text-[10px] text-white/30 hover:text-white transition-all font-black uppercase"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}

            <div className="bg-[#0a1860]/60 border border-[#f5a623]/40 rounded-[2rem] p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                  Все ключи
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-[#f5a623]/10 border border-[#f5a623]/40 text-[#f5a623] px-2 py-1 rounded-lg font-black">
                    {freeCount} своб
                  </span>
                  <span className="text-[10px] bg-white/5 border border-[#f5a623]/40 text-white/30 px-2 py-1 rounded-lg font-black">
                    {usedCount} исп
                  </span>
                </div>
              </div>

              {loadingVouchers && (
                <div className="flex justify-center py-10">
                  <Loader2 size={20} className="animate-spin text-[#f5a623]" />
                </div>
              )}
              {!loadingVouchers && vouchers.length === 0 && (
                <p className="text-white/20 text-xs font-black uppercase text-center py-10">
                  Ключей нет — загрузи первые!
                </p>
              )}

              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                {filteredVouchers.map((v) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border ${v.is_used ? "border-[#f5a623]/30 bg-white/[0.01] opacity-40" : "border-[#f5a623]/10 bg-[#f5a623]/[0.02]"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Key
                        size={12}
                        className={
                          v.is_used ? "text-white/20" : "text-[#f5a623]"
                        }
                      />
                      <p className="font-mono text-xs text-white/70 truncate">
                        {v.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px]">
                        {REGIONS.find((r) => r.code === v.region)?.flag}
                      </span>
                      {v.denomination > 0 && (
                        <span className="text-[9px] bg-[#f5a623]/10 border border-[#f5a623]/40 text-[#f5a623] px-1.5 py-0.5 rounded-lg font-black">
                          {v.denomination.toLocaleString()} ₽
                        </span>
                      )}
                      {v.is_used && (
                        <Check size={12} className="text-white/20" />
                      )}
                      {!v.is_used && (
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-white/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
