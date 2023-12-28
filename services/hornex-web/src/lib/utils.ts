import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcPrizePool(
  buyIn: number,
  players: number,
  rake: number
): number {
  return Math.floor(buyIn * players * (1 - rake));
}

export function toCurrency(num: number): string {
  return `${num.toLocaleString()}`;
}
