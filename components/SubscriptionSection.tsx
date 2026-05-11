"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRegionStore } from "@/store/useRegion";
import { useCartStore } from "@/store/useCart";
import type { Game } from "@/store/games";

const PSIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.998.636.2.76.893.76 1.582v5.815c2.77 1.397 4.851-.29 4.851-3.652 0-3.5-1.201-5.135-4.851-6.457 0 0-3.143-1.012-5.469-1.382zm-4.732 14.5c-2.361-.766-2.75-2.355-1.674-3.27.981-.858 2.639-1.491 2.639-1.491l.01 2.86s-1.016.35-1.534.668c-.519.319-.525.757.108.98.894.315 1.813.162 1.813.162v2.005s-.407.08-.928.08c-.961 0-2.153-.26-2.974-.77l.54-.224zm11.49 1.639l-4.223-1.362v-2.15l4.223 1.487v2.025z" />
  </svg>
);

interface Period {
  id: string;
  label: string;
  fullLabel: string;
  multiplier: number;
  badge?: string;
}

interface Plan {
  id: string;
  name: string;
  basePrice: number;
  gradient: string;
  accentColor: string;
  popular?: boolean;
  features: string[];
}

const periods: Period[] = [
  { id: "1", label: "1 мес", fullLabel: "1 месяц", multiplier: 1 },
  { id: "3", label: "3 мес", fullLabel: "3 месяца", multiplier: 2.7, badge: "-10%" },
  { id: "12", label: "12 мес", fullLabel: "12 месяцев", multiplier: 9.6, badge: "-20%" },
];

const plans: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    basePrice: 945,
    gradient: "from-[#8a8a8a] via-[#c0c0c0] to-[#8a8a8a]",
    accentColor: "#c0c0c0",
    features: [
      "Возможность играть по сети",
      "Бесплатные игры месяца",
      "Эксклюзивные скидки",
      "Облачное хранилище",
    ],
  },
  {
    id: "extra",
    name: "Extra",
    basePrice: 1415,
    gradient: "from-[#f5a623] via-[#f0c040] to-[#e8920a]",
    accentColor: "#f5a623",
    popular: true,
    features: [
      "Всё что есть в Essential",
      "Каталог с сотнями консольных хитов",
      "Набор игр от Ubisoft",
      "Облачное хранилище",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    basePrice: 1655,
    gradient: "from-[#2a1f0a] via-[#4a3510] to-[#2a1f0a]",
    accentColor: "#f5a623",
    features: [
      "Всё из Essential и Extra",
      "Каталог классических хитов Sony",
      "Эксклюзивные демо-версии",
      "Облачное хранилище",
    ],
  },
];

export default function SubscriptionSection() {
  const [activePeriod, setActivePeriod] = useState("1");
  const [activePlan, setActivePlan] = useState(1);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { getPrice } = useRegionStore();
  const addItem = useCartStore((state) => state.addItem);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPeriod = periods.find((p) => p.id === activePeriod)!;

  const handleAdd = (plan: Plan) => {
    const price = Math.round(getPrice(plan.basePrice) * currentPeriod.multiplier);
    addItem({
      id: `${plan.id}-${activePeriod}`,
      title: `PS Plus ${plan.name} — ${currentPeriod.fullLabel}`,
      price,
      image: "/images/psplus.jpg",
      category: "subscription",
      shortDescription: "",
      fullDescription: "",
      screenshots: [],
      editions: [],
    } as Game);
    setAddedId(plan.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const scrollToCard = (idx: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[idx] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActivePlan(idx);
  };

  return (
    <section
      className="w-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden py-8 md:py-10 px-4 md:px-8"
      style={{
        background: "#08113d",
        border: "1px solid rgba(0, 214, 143, 0.35)",
        boxShadow: "inset 0 0 80px rgba(0,20,80,0.3), 0 0 40px rgba(0, 214, 143, 0.05)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d68f]/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] mb-1">
            PlayStation Network
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            <span className="text-white">ПОДПИСКИ </span>
            <span className="text-[#00d68f]" style={{ textShadow: "0 0 30px rgba(0,214,143,0.4)" }}>
              PS PLUS
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#060e30] border border-[#00d68f]/40 rounded-2xl self-start md:self-auto">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setActivePeriod(period.id)}
              className="relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all"
            >
              {activePeriod === period.id && (
                <motion.div
                  layoutId="period-bg"
                  className="absolute inset-0 bg-[#00d68f] rounded-xl"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${activePeriod === period.id ? "text-black" : "text-white/40"}`}>
                {period.label}
              </span>
              {period.badge && activePeriod !== period.id && (
                <span className="absolute -top-2 -right-1 text-[7px] bg-green-500 text-white font-black px-1 py-0.5 rounded-md">
                  {period.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative hidden md:grid grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = Math.round(getPrice(plan.basePrice) * currentPeriod.multiplier);
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              price={price}
              isAdded={addedId === plan.id}
              currentPeriod={currentPeriod}
              onAdd={() => handleAdd(plan)}
            />
          );
        })}
      </div>

      <div className="md:hidden">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
          {plans.map((plan) => {
            const price = Math.round(getPrice(plan.basePrice) * currentPeriod.multiplier);
            return (
              <div key={plan.id} className="snap-center shrink-0 w-[85vw]">
                <PlanCard
                  plan={plan}
                  price={price}
                  isAdded={addedId === plan.id}
                  currentPeriod={currentPeriod}
                  onAdd={() => handleAdd(plan)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => scrollToCard(Math.max(0, activePlan - 1))}
            className="w-9 h-9 rounded-xl bg-[#060e30] border border-[#00d68f]/40 flex items-center justify-center text-white/40 hover:text-[#00d68f] transition-all active:scale-90"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activePlan ? "w-8 bg-[#00d68f]" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => scrollToCard(Math.min(plans.length - 1, activePlan + 1))}
            className="w-9 h-9 rounded-xl bg-[#060e30] border border-[#00d68f]/40 flex items-center justify-center text-white/40 hover:text-[#00d68f] transition-all active:scale-90"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan, price, isAdded, currentPeriod, onAdd,
}: {
  plan: Plan;
  price: number;
  isAdded: boolean;
  currentPeriod: Period;
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col rounded-[2rem] border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
        plan.popular
          ? "border-[#f5a623]/40 shadow-[0_0_40px_rgba(245,166,35,0.15)]"
          : "border-[#00d68f]/30 hover:border-[#00d68f]/50"
      }`}
      style={{ background: "#0a1650" }}
    >
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#f5a623] rounded-xl">
          <span className="text-black text-[8px] font-black uppercase tracking-widest">Популярное</span>
        </div>
      )}

      <div className={`relative h-40 md:h-44 bg-gradient-to-br ${plan.gradient} flex flex-col items-center justify-center overflow-hidden`}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
        <PSIcon className="w-8 h-8 text-black/30 mb-1 relative z-10" />
        <p className="text-black/50 text-xs font-bold relative z-10">PlayStation Plus</p>
        <p className="text-black font-black text-3xl uppercase tracking-tighter relative z-10"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          {plan.name}
        </p>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6 gap-4 md:gap-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${currentPeriod.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-white font-black text-3xl">{price.toLocaleString()}</span>
              <span className="text-[#00d68f] font-black text-sm">₽</span>
            </div>
            <p className="text-white/30 text-xs font-bold mt-0.5">
              PS Plus {plan.name} · {currentPeriod.fullLabel}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-2.5 flex-1">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: plan.accentColor + "30", border: `1px solid ${plan.accentColor}50` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.accentColor }} />
              </div>
              <span className="text-white/50 text-xs font-bold leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={onAdd}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-[#00d68f] text-black shadow-[0_0_20px_rgba(0,214,143,0.3)]"
              : plan.popular
              ? "bg-[#f5a623] text-black hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]"
              : "bg-[#060e30] border border-[#00d68f]/40 text-white hover:bg-[#0a1650] hover:border-[#00d68f]/60 hover:text-[#00d68f]"
          }`}
        >
          {isAdded ? <><Check size={14} /> Добавлено!</> : "Купить подписку"}
        </motion.button>
      </div>
    </motion.div>
  );
}