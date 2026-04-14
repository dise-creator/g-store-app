export type LoyaltyLevel = "Новичок" | "Игрок" | "Про" | "Легенда";

export interface LoyaltyInfo {
  level: LoyaltyLevel;
  discount: number;
  nextLevel: LoyaltyLevel | null;
  nextLevelThreshold: number;
  progress: number; // 0-100%
}

export function getLoyaltyInfo(totalSpent: number): LoyaltyInfo {
  if (totalSpent >= 25000) {
    return { level: "Легенда", discount: 15, nextLevel: null, nextLevelThreshold: 25000, progress: 100 };
  } else if (totalSpent >= 10000) {
    return { level: "Про", discount: 7, nextLevel: "Легенда", nextLevelThreshold: 25000, progress: Math.round((totalSpent - 10000) / 150) };
  } else if (totalSpent >= 3000) {
    return { level: "Игрок", discount: 3, nextLevel: "Про", nextLevelThreshold: 10000, progress: Math.round((totalSpent - 3000) / 70) };
  } else {
    return { level: "Новичок", discount: 0, nextLevel: "Игрок", nextLevelThreshold: 3000, progress: Math.round(totalSpent / 30) };
  }
}

export const levelColors: Record<LoyaltyLevel, string> = {
  "Новичок": "#ffffff",
  "Игрок": "#63f3f7",
  "Про": "#a855f7",
  "Легенда": "#f59e0b",
};

export const levelEmoji: Record<LoyaltyLevel, string> = {
  "Новичок": "🥉",
  "Игрок": "🥈",
  "Про": "🥇",
  "Легенда": "💎",
};