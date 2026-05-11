"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  Newspaper,
  Check,
  ShieldX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/useAdmin";

interface NewsItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  game_id: string;
  created_at?: string;
}

const TAGS = ["Новость", "Обновление", "Анонс", "Скидки", "Акция"];
const empty = (): NewsItem => ({
  title: "",
  description: "",
  image: "",
  tag: "Новость",
  game_id: "",
});

export default function AdminNewsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<NewsItem>(empty());
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) router.push("/");
  }, [isAdmin, adminLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    loadNews();
  }, [isAdmin]);

  const loadNews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    setNews(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    if (editId) {
      await supabase.from("news").update(form).eq("id", editId);
    } else {
      await supabase.from("news").insert(form);
    }
    setForm(empty());
    setEditId(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    await loadNews();
    setSaving(false);
  };

  const handleEdit = (item: NewsItem) => {
    setForm(item);
    setEditId(item.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("news").delete().eq("id", id);
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCancel = () => {
    setForm(empty());
    setEditId(null);
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
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 border border-[#00d68f]/20 flex items-center justify-center text-white/40 hover:text-[#00d68f] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black  uppercase text-white tracking-tighter">
              Управление <span className="text-[#00d68f]">новостями</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">
              Добавляй и редактируй новости магазина
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-[#00d68f]/20 rounded-[2rem] p-6 flex flex-col gap-4">
            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
              {editId ? "Редактировать новость" : "Новая новость"}
            </p>

            <div>
              <p className="text-white/20 text-[10px] font-black uppercase mb-1.5">
                Заголовок *
              </p>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Заголовок новости..."
                className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
              />
            </div>

            <div>
              <p className="text-white/20 text-[10px] font-black uppercase mb-1.5">
                Описание *
              </p>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Текст новости..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20 resize-none"
              />
            </div>

            <div>
              <p className="text-white/20 text-[10px] font-black uppercase mb-1.5">
                Ссылка на изображение
              </p>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://... или /hero/1.jpg"
                className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
              />
            </div>

            <div>
              <p className="text-white/20 text-[10px] font-black uppercase mb-1.5">
                Game ID (необязательно)
              </p>
              <input
                value={form.game_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, game_id: e.target.value }))
                }
                placeholder="gow-1, tlou-1..."
                className="w-full px-4 py-3 bg-white/5 border border-[#00d68f]/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-[#00d68f]/40 transition-all placeholder-white/20"
              />
            </div>

            <div>
              <p className="text-white/20 text-[10px] font-black uppercase mb-2">
                Тег
              </p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setForm((p) => ({ ...p, tag }))}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase  border transition-all ${form.tag === tag ? "bg-[#00d68f] text-black border-transparent" : "bg-white/5 border-[#00d68f]/20 text-white/40 hover:text-white"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {form.image && (
              <div className="relative h-32 rounded-2xl overflow-hidden border border-[#00d68f]/20">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex gap-2">
              {editId && (
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white/5 border border-[#00d68f]/20 text-white/40 font-black uppercase  text-xs rounded-2xl hover:text-white transition-all"
                >
                  Отмена
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.description}
                className="flex-1 py-3 bg-[#00d68f] text-black font-black uppercase  text-xs rounded-2xl hover:shadow-[0_0_20px_rgba(99,243,247,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : success ? (
                  <>
                    <Check size={14} /> Сохранено!
                  </>
                ) : (
                  <>
                    <Plus size={14} /> {editId ? "Сохранить" : "Добавить"}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-[#00d68f]/20 rounded-[2rem] p-6">
            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">
              Все новости ({news.length})
            </p>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={20} className="animate-spin text-[#00d68f]" />
              </div>
            ) : news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Newspaper size={24} className="text-white/10" />
                <p className="text-white/20 text-xs font-black uppercase">
                  Новостей нет
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {news.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#00d68f]/20 ${editId === item.id ? "border-[#00d68f]/30 bg-[#00d68f]/5" : "border-[#00d68f]/15 bg-white/[0.02]"}`}
                      onClick={() => handleEdit(item)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] bg-[#00d68f]/10 border border-[#00d68f]/20 text-[#00d68f] px-2 py-0.5 rounded-lg font-black uppercase">
                              {item.tag}
                            </span>
                            <span className="text-white/20 text-[9px] font-black">
                              {new Date(item.created_at!).toLocaleDateString(
                                "ru-RU",
                              )}
                            </span>
                          </div>
                          <p className="text-white/70 text-xs font-black uppercase  truncate">
                            {item.title}
                          </p>
                          <p className="text-white/30 text-[10px] mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id!);
                          }}
                          className="text-white/20 hover:text-red-400 transition-all shrink-0 mt-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
