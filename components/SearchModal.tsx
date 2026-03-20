'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import GameCard from './GameCard';

// Временный список игр
const GAMES = [
  { id: 1, title: "Saints Row", price: "3 670", image: "https://i.imgur.com/3Z4n5X1.jpg" },
  { id: 2, title: "Gran Turismo 7", price: "6 995", image: "https://i.imgur.com/8Q6z2X3.jpg" },
  { id: 3, title: "Elden Ring", price: "5 490", image: "https://i.imgur.com/4R6z1A9.jpg" },
];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');

  // Фильтруем игры по названию
  const filteredGames = GAMES.filter(game => 
    game.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[100] bg-[#121820]/95 p-6 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 relative">
                <input 
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти игру или подписку"
                  className="w-full bg-[#1e2530] border-none rounded-2xl py-4 px-14 text-xl text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <button onClick={onClose} className="p-4 bg-[#1e2530] rounded-2xl text-white hover:bg-[#252d3a]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredGames.map((game: any) => (
                    <GameCard 
                        key={game.id} 
                        id={game.id} // Вот эта строчка ОБЯЗАТЕЛЬНА
                        title={game.title} 
                        price={game.price} 
                        image={game.image} 
                                />
                                ))}
             
            </div>
            
            {filteredGames.length === 0 && (
              <p className="text-center text-gray-500 mt-10">Ничего не найдено...</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}