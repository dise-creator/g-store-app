import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Region = 'RU' | 'TR' | 'IN';

export interface RegionInfo {
  code: Region;
  name: string;
  flag: string;
  coefficient: number; // множитель цены
}

export const REGIONS: Record<Region, RegionInfo> = {
  RU: {
    code: 'RU',
    name: 'Россия',
    flag: '🇷🇺',
    coefficient: 1, // базовая цена
  },
  TR: {
    code: 'TR',
    name: 'Турция',
    flag: '🇹🇷',
    coefficient: 0.11, // 10% + 10% посредник
  },
  IN: {
    code: 'IN',
    name: 'Индия',
    flag: '🇮🇳',
    coefficient: 0.11, // 10% + 10% посредник
  },
};

interface RegionStore {
  region: Region;
  setRegion: (region: Region) => void;
  getPrice: (basePrice: number) => number;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      region: 'RU',
      setRegion: (region) => set({ region }),
      getPrice: (basePrice: number) => {
        const { region } = get();
        const coefficient = REGIONS[region].coefficient;
        return Math.round(basePrice * coefficient);
      },
    }),
    {
      name: 'clic-region-storage',
    }
  )
);