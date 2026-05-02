export interface CardSet {
  value: number;
  quantity: number;
}

const DENOMINATIONS = [5000, 3000, 2000, 1000, 500, 250];

export function selectCards(price: number): CardSet[] {
  const result: Map<number, number> = new Map();
  let remaining = price;

  for (const denom of DENOMINATIONS) {
    if (remaining <= 0) break;
    const qty = Math.floor(remaining / denom);
    if (qty > 0) {
      result.set(denom, qty);
      remaining -= denom * qty;
    }
  }

  if (remaining > 0) {
    const covering = [...DENOMINATIONS].reverse().find((d: number) => d >= remaining);
    if (covering) {
      result.set(covering, (result.get(covering) || 0) + 1);
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const [denom, qty] of result.entries()) {
      if (qty >= 2) {
        const bigger = DENOMINATIONS.find((d: number) => d === denom * 2);
        if (bigger) {
          result.set(denom, qty - 2);
          result.set(bigger, (result.get(bigger) || 0) + 1);
          if (result.get(denom) === 0) result.delete(denom);
          changed = true;
          break;
        }
      }
    }
  }

  return Array.from(result.entries())
    .filter(([, qty]) => qty > 0)
    .sort((a, b) => b[0] - a[0])
    .map(([value, quantity]) => ({ value, quantity }));
}

export function getTotalCards(cards: CardSet[]): number {
  return cards.reduce((sum, c) => sum + c.value * c.quantity, 0);
}

export function getCardsHint(price: number): string {
  const cards = selectCards(price);
  return cards
    .map(c => c.quantity > 1 ? `${c.quantity}× ${c.value.toLocaleString()} ₽` : `${c.value.toLocaleString()} ₽`)
    .join(" + ");
}