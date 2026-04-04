'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCart';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Trash2, Minus, Plus, CreditCard, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  // Добавляем состояние для проверки монтирования (решает Hydration Error)
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ждем, пока компонент загрузится на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = async () => {
    console.log("Кнопка нажата! Начинаю оформление..."); // Лог для проверки клика
    
    if (items.length === 0) {
      alert("Корзина пуста");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Генерируем чистый массив данных для колонки 'items' (jsonb)
      const preparedItems = items.map(item => ({
        game_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const orderPayload = {
        items: preparedItems,
        total_price: Number(totalPrice()),
        status: 'pending',
        user_email: "customer@example.com" // В будущем здесь будет email из Auth
      };

      console.log("Отправка в Supabase:", orderPayload);

      // 2. Вставка в таблицу 'orders'
      const { data, error } = await supabase
        .from('orders') 
        .insert([orderPayload])
        .select();

      if (error) {
        console.error("Ошибка Supabase:", error.message);
        throw error;
      }

      console.log("Заказ успешно создан в базе!", data);
      alert('✅ Заказ успешно оформлен и сохранен в базе!');
      clearCart();

    } catch (err: any) {
      console.error('Критическая ошибка при сохранении:', err);
      alert('❌ Ошибка: ' + (err.message || 'Не удалось сохранить заказ'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если компонент еще не монтирован, возвращаем пустой контейнер (защита от Hydration Error)
  if (!isMounted) return <div className="min-h-screen bg-black" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <ShoppingBag size={64} className="text-white/20 mb-4" />
        <h2 className="text-2xl font-bold mb-2 uppercase italic">Корзина пуста</h2>
        <p className="opacity-50 text-center">Добавьте игры из каталога,<br/>чтобы сделать заказ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white pb-24">
      <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">Ваша Корзина</h1>

      <div className="grid gap-4 mb-10">
        {items.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
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
              <p className="text-cyan-400 font-black text-lg">
                {(item.price || 0).toLocaleString()} ₽
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-4 py-2 border border-white/10">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                className="hover:text-cyan-400 opacity-50 hover:opacity-100 p-1"
              >
                <Minus size={20} />
              </button>
              <span className="w-6 text-center font-black text-xl">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                className="hover:text-cyan-400 opacity-50 hover:opacity-100 p-1"
              >
                <Plus size={20} />
              </button>
            </div>

            <button 
              onClick={() => removeItem(item.id)} 
              className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
            >
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <span className="text-white/40 uppercase font-black text-sm">Итого к оплате</span>
          <span className="text-5xl font-black text-cyan-400 italic">
            {totalPrice().toLocaleString()} ₽
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className={`w-full py-6 rounded-2xl font-black uppercase italic text-black transition-all flex items-center justify-center gap-3 text-lg ${
            isSubmitting 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_15px_45px_rgba(34,211,238,0.25)]'
          }`}
        >
          <CreditCard size={24} />
          {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
}