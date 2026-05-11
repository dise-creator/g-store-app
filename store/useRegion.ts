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
const CACHE_TTL = 24 * 60 * 60 * 1000;

const FALLBACK_RATES = {
  RUB: 90,
  TRY: 32,
  INR: 84,
  lastUpdated: 0,
};

export interface ExchangeRates {
  RUB: number;
  TRY: number;
  INR: number;
  lastUpdated: number;
}

interface RegionStore {
  region: Region;
  rates: ExchangeRates | null;
  isLoadingRates: boolean;
  setRegion: (region: Region) => void;
  fetchRates: () => Promise<void>;
  getPrice: (basePrice: number) => number;
  getPriceForRegion: (basePrice: number, regionCode: Region) => number;
}

const calcPrice = (basePrice: number, regionCode: Region, rates: ExchangeRates): number => {
  const discount = REGIONS[regionCode].psStoreDiscount;
  const priceInUSD = basePrice / rates.RUB;
  return Math.round(priceInUSD * discount * rates.RUB * MARKUP);
};

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
            });
          }
        } catch {
          set({ rates: { ...FALLBACK_RATES, lastUpdated: Date.now() } });
        } finally {
          set({ isLoadingRates: false });
        }
      },

      getPrice: (basePrice) => {
        const { region, rates } = get();
        if (!rates) return 0;
        return calcPrice(basePrice, region, rates);
      },

      getPriceForRegion: (basePrice, regionCode) => {
        const { rates } = get();
        if (!rates) return 0;
        return calcPrice(basePrice, regionCode, rates);
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