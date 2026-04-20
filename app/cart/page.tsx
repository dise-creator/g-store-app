'use client';

import { useState, useEffect } from 'react';
import { useCartStore, getTotalPrice } from '@/store/useCart';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Trash2, Minus, Plus, CreditCard, ShoppingBag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getLoyaltyInfo } from '@/lib/loyalty';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCartStore();
  const { data: session } = useSession();
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadUserData() {
      if (!session?.user?.email) return;
      const { data } = await supabase
        .from("users")
        .select("total_spent")
        .eq("email", session.user.email)
        .single();
      if (data) setTotalSpent(Number(data.total_spent) || 0);
    }
    loadUserData();
  }, [session]);

  const loyalty = getLoyaltyInfo(totalSpent);
  const originalPrice = getTotalPrice(items);
  const discountAmount = Math.round(originalPrice * loyalty.discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handleCheckout = () => {
    if (items.length === 0) { alert("Корзина пуста"); return; }
    if (!session?.user?.email) { alert("Войдите в аккаунт чтобы оформить заказ"); return; }
    router.push("/checkout");
  };

  if (!isMounted) return <div className="min-h-screen" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white gap-6">
        <ShoppingBag size={64} className="text-white/20" />
        <h2 className="text-2xl font-bold uppercase italic">Корзина пуста</h2>
        <p className="text-white/40 text-center">Добавьте игры из каталога,<br/>чтобы сделать заказ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white pb-24 pt-32">
      <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">Ваша Корзина</h1>

      <div className="grid gap-4 mb-10">
        {items.map((item, index) => (
          <div
            key={`${item.cartItemId}-${index}`}
            className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-6 backdrop-blur-sm"
          >
            <div className="relative w-24 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-white/10">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-grow">
              <h3 className="font-black text-xl uppercase italic leading-tight mb-1">{item.title}</h3>
              <p className="text-[#63f3f7] font-black text-lg">
                {(item.price || 0).toLocaleString()} ₽
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-4 py-2 border border-white/10">
              <button
                onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                className="hover:text-[#63f3f7] opacity-50 hover:opacity-100 p-1 transition-all"
              >
                <Minus size={20} />
              </button>
              <span className="w-6 text-center font-black text-xl">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                className="hover:text-[#63f3f7] opacity-50 hover:opacity-100 p-1 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.cartItemId)}
              className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
            >
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">

        {/* Скидка лояльности */}
        {loyalty.discount > 0 && (
          <div className="flex flex-col gap-2 mb-6 p-4 bg-[#63f3f7]/5 border border-[#63f3f7]/20 rounded-2xl">
            <div className="flex justify-between items-center">
              <span className="text-white/40 uppercase font-black text-xs">Цена без скидки</span>
              <span className="text-white/40 font-black line-through">{originalPrice.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#63f3f7] uppercase font-black text-xs">
                Скидка {loyalty.discount}% ({loyalty.level})
              </span>
              <span className="text-[#63f3f7] font-black">−{discountAmount.toLocaleString()} ₽</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <span className="text-white/40 uppercase font-black text-sm">Итого к оплате</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-[#63f3f7] italic">{finalPrice.toLocaleString()}</span>
            <span className="text-[#63f3f7] font-black text-xl">₽</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-6 rounded-2xl font-black uppercase italic text-black transition-all flex items-center justify-center gap-3 text-lg bg-[#63f3f7] hover:shadow-[0_0_30px_rgba(99,243,247,0.3)] active:scale-95"
        >
          <CreditCard size={24} />
          Перейти к оплате
        </button>
      </div>
    </div>
  );
}