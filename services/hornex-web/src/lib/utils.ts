import { Tournament } from './models';
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
  return buyIn * players * (1 - rake);
}

export function toCurrency(num: number): string {
  return `${(num / 100).toFixed(2)}`;
}

export function stringToDate(date: string): Date {
  return new Date(date);
}

export function isCheckInOpen(tournament: Tournament): boolean {
  const now = +new Date();
  return (
    +new Date(tournament.check_in_opens_at) < now &&
    +new Date(tournament.check_in_closes_at) > now
  );
}

export function isCheckInClosed(tournament: Tournament): boolean {
  const now = +new Date();
  return (
    +new Date(tournament.check_in_opens_at) < now &&
    +new Date(tournament.check_in_closes_at) < now
  );
}
