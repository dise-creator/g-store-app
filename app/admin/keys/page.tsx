"use client";

import React, { useState, useEffect } from "react";
import { Upload, Check, Loader2, ChevronLeft, Key, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
}

interface Voucher {
  id: string;
  code: string;
  game_title: string;
  is_used: boolean;
  user_email: string | null;
  created_at: string;
}

export default function KeysPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [keysText, setKeysText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // Загружаем список игр
  useEffect(() => {
    supabase
      .from("games")
      .select("id, title")
      .order("title")
      .then(({ data }) => setGames(data || []));
  }, []);

  // Загружаем ваучеры выбранной игры
  useEffect(() => {
    if (!selectedGame) return;
    setLoadingVouchers(true);
    supabase
      .from("vouchers")
      .select("*")
      .eq("game_id", selectedGame)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setVouchers(data || []);
        setLoadingVouchers(false);
      });
  }, [selectedGame]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setKeysText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!selectedGame) { setError("Выбери игру"); return; }
    if (!keysText.trim()) { setError("Нет ключей"); return; }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Парсим ключи — каждый на новой строке, пустые пропускаем
    const keys = keysText
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      setError("Ключи не найдены в файле");
      setLoading(false);
      return;
    }

    const game = games.find((g) => g.id === selectedGame);

    const rows = keys.map((code) => ({
      game_id: selectedGame,
      game_title: game?.title || "",
      code,
      is_used: false,
      user_email: null,
    }));

    const { error: insertError } = await supabase.from("vouchers").insert(rows);

    if (insertError) {
      setError("Ошибка: " + insertError.message);
    } else {
      setSuccess(`✅ Загружено ${keys.length} ключей!`);
      setKeysText("");
      // Обновляем список ваучеров
      const { data } = await supabase
        .from("vouchers")
        .select("*")
        .eq("game_id", selectedGame)
        .order("created_at", { ascending: false });
      setVouchers(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("vouchers").delete().eq("id", id);
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const freeCount = vouchers.filter((v) => !v.is_used).length;
  const usedCount = vouchers.filter((v) => v.is_used).length;

  return (
    <main className="min-h-screen pt-10 pb-20 px-8">
      <div className="max-w-[900px] mx-auto">

        {/* Шапка */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#63f3f7] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Загрузка <span className="text-[#63f3f7]">ключей</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">Загружай .txt файл — каждый ключ на новой строке</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Левая часть — загрузка */}
          <div className="flex flex-col gap-4">

            {/* Выбор игры */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">Игра</p>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#63f3f7]/40 transition-all"
              >
                <option value="" className="bg-[#0a0a0a]">Выбери игру...</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#0a0a0a]">
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Загрузка файла */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-3">
                Файл с ключами (.txt)
              </p>
              <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[#63f3f7]/30 transition-all group">
                <Upload size={24} className="text-white/20 group-hover:text-[#63f3f7]/50 transition-all" />
                <p className="text-white/30 text-xs font-black uppercase">Нажми или перетащи файл</p>
                <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Или вставь вручную */}
              <p className="text-white/20 text-[10px] uppercase font-black tracking-widest my-3 text-center">или вставь вручную</p>
              <textarea
                value={keysText}
                onChange={(e) => setKeysText(e.target.value)}
                placeholder={"XXXXX-XXXXX-XXXXX\nXXXXX-XXXXX-XXXXX\nXXXXX-XXXXX-XXXXX"}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/70 font-mono text-xs focus:outline-none focus:border-[#63f3f7]/40 transition-all placeholder-white/10 resize-none"
              />
              {keysText && (
                <p className="text-[#63f3f7] text-[10px] font-black mt-2">
                  {keysText.split("\n").filter(Boolean).length} ключей готово к загрузке
                </p>
              )}
            </div>

            {/* Ошибка / успех */}
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
                  className="p-4 bg-[#63f3f7]/10 border border-[#63f3f7]/20 rounded-2xl text-[#63f3f7] text-sm font-bold"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Кнопка */}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-5 bg-[#63f3f7] text-black font-black uppercase italic text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Загружаем...</>
              ) : (
                <><Upload size={18} /> Загрузить ключи</>
              )}
            </button>
          </div>

          {/* Правая часть — список ключей */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Ключи в базе</p>
              {selectedGame && (
                <div className="flex gap-2">
                  <span className="text-[10px] bg-[#63f3f7]/10 border border-[#63f3f7]/20 text-[#63f3f7] px-2 py-1 rounded-lg font-black">
                    {freeCount} свободных
                  </span>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-white/30 px-2 py-1 rounded-lg font-black">
                    {usedCount} использовано
                  </span>
                </div>
              )}
            </div>

            {!selectedGame && (
              <p className="text-white/20 text-xs font-black uppercase text-center py-10">
                Выбери игру слева
              </p>
            )}

            {loadingVouchers && (
              <div className="flex justify-center py-10">
                <Loader2 size={20} className="animate-spin text-[#63f3f7]" />
              </div>
            )}

            {!loadingVouchers && selectedGame && vouchers.length === 0 && (
              <p className="text-white/20 text-xs font-black uppercase text-center py-10">
                Ключей нет — загрузи первые!
              </p>
            )}

            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className={`flex items-center justify-between gap-2 p-3 rounded-xl border ${
                    v.is_used
                      ? "border-white/5 bg-white/[0.01] opacity-40"
                      : "border-[#63f3f7]/10 bg-[#63f3f7]/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Key size={12} className={v.is_used ? "text-white/20" : "text-[#63f3f7]"} />
                    <p className="font-mono text-xs text-white/70 truncate">{v.code}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
    </main>
  );
}