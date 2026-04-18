import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Region = 'TR' | 'IN';

export interface RegionInfo {
  code: Region;
  name: string;
  flag: string;
  currency: string;
  psStoreDiscount: number;
}

export const REGIONS: Record<Region, RegionInfo> = {
  TR: {
    code: 'TR',
    name: 'Турция',
    flag: '🇹🇷',
    currency: 'TRY',
    psStoreDiscount: 0.35,
  },
  IN: {
    code: 'IN',
    name: 'Индия',
    flag: '🇮🇳',
    currency: 'INR',
    psStoreDiscount: 0.55,
  },
};

const MARKUP = 1.10;

export interface ExchangeRates {
  RUB: number;
  TRY: number;
  INR: number;
  lastUpdated: number;
}

interface RegionStore {
  region: Region;
  rates: ExchangeRates | null; // экспортируем чтобы GameModal мог читать
  isLoadingRates: boolean;
  setRegion: (region: Region) => void;
  fetchRates: () => Promise<void>;
  getPrice: (basePrice: number) => number;
  // Вспомогательная функция — цена для конкретного региона
  getPriceForRegion: (basePrice: number, regionCode: Region) => number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000;

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      region: 'TR',
      rates: null,
      isLoadingRates: false,

      setRegion: (region) => set({ region }),

      fetchRates: async () => {
        const { rates, isLoadingRates } = get();
        if (isLoadingRates) return;
        if (rates && Date.now() - rates.lastUpdated < CACHE_TTL) return;

        set({ isLoadingRates: true });

        try {
          const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
          const res = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
          );
          const data = await res.json();

          if (data.result === 'success') {
            set({
              rates: {
                RUB: data.conversion_rates.RUB,
                TRY: data.conversion_rates.TRY,
                INR: data.conversion_rates.INR,
                lastUpdated: Date.now(),
              },
              isLoadingRates: false,
            });
          }
        } catch (err) {
          console.error('Ошибка загрузки курсов:', err);
          set({
            rates: {
              RUB: 90,
              TRY: 32,
              INR: 84,
              lastUpdated: Date.now(),
            },
            isLoadingRates: false,
          });
        }
      },

      getPrice: (basePrice: number) => {
        const { region, rates } = get();
        if (!rates) return 0;
        const regionInfo = REGIONS[region];
        const priceInUSD = basePrice / rates.RUB;
        const regionalPriceInUSD = priceInUSD * regionInfo.psStoreDiscount;
        const priceInRUB = regionalPriceInUSD * rates.RUB;
        return Math.round(priceInRUB * MARKUP);
      },

      // Новая функция — считает цену для любого региона
      // Используется в GameModal для сравнения цен
      getPriceForRegion: (basePrice: number, regionCode: Region) => {
        const { rates } = get();
        if (!rates) return 0;
        const regionInfo = REGIONS[regionCode];
        const priceInUSD = basePrice / rates.RUB;
        const regionalPriceInUSD = priceInUSD * regionInfo.psStoreDiscount;
        const priceInRUB = regionalPriceInUSD * rates.RUB;
        return Math.round(priceInRUB * MARKUP);
      },
    }),
    {
      name: 'clic-region-storage',
      partialize: (state) => ({
        region: state.region,
        rates: state.rates,
      }),
    }
  )
);