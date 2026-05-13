"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Zap, Award } from "lucide-react";

import {
  AboutContent,
  ContactsContent,
  ReviewsContent,
  SupportContent,
  AgreementContent,
  PrivacyContent,
} from "./FooterModals";

type ModalId = "about" | "contacts" | "reviews" | "support" | "agreement" | "privacy";

const MODAL_TITLES: Record<ModalId, string> = {
  about: "О магазине",
  contacts: "Контакты",
  reviews: "Отзывы",
  support: "Поддержка",
  agreement: "Пользовательское соглашение",
  privacy: "Политика конфиденциальности",
};

const MODAL_CONTENT: Record<ModalId, React.ReactNode> = {
  about: <AboutContent />,
  contacts: <ContactsContent />,
  reviews: <ReviewsContent />,
  support: <SupportContent />,
  agreement: <AgreementContent />,
  privacy: <PrivacyContent />,
};

const NAV_LINKS: Array<{ label: string; modal: ModalId }> = [
  { label: "О магазине", modal: "about" },
  { label: "Контакты", modal: "contacts" },
  { label: "Отзывы", modal: "reviews" },
  { label: "Поддержка", modal: "support" },
];

const LEGAL_LINKS: Array<{ label: string; modal: ModalId }> = [
  { label: "Пользовательское соглашение", modal: "agreement" },
  { label: "Политика конфиденциальности", modal: "privacy" },
];

const REGIONS = [
  { flag: "🇹🇷", code: "TR", name: "Турция", discount: "до 65%" },
  { flag: "🇮🇳", code: "IN", name: "Индия", discount: "до 45%" },
];

const FEATURES = [
  { icon: Zap, text: "Моментальная доставка" },
  { icon: Shield, text: "Официальные карты PSN" },
  { icon: Award, text: "Скидки до 65%" },
];

function Modal({ id, onClose }: { id: ModalId; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative z-10 w-full max-w-2xl bg-[#0d1f6e] border border-[#ff6b00]/40 rounded-[2rem] overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#ff6b00]/30">
          <h2 className="text-white font-black uppercase text-xl tracking-tight">
            {MODAL_TITLES[id]}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-8 max-h-[75vh] overflow-y-auto">
          {MODAL_CONTENT[id]}
        </div>
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);

  return (
    <>
      <AnimatePresence>
        {activeModal && <Modal id={activeModal} onClose={() => setActiveModal(null)} />}
      </AnimatePresence>

      <footer className="relative z-20 w-full px-4 pb-8 mt-10">
        <div className="max-w-[1420px] mx-auto bg-[#0a1860]/60 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 border border-[#ff6b00]/40">
          {/* Здесь твой основной контент футера */}
          {/* ... (вставь сюда компактную версию, которую я дал раньше) */}
        </div>
      </footer>
    </>
  );
}