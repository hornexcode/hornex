import { Tournament } from './models/Tournament';
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

export const combineDateAndTime = (
  date: string,
  time: string,
  isZeroTimezone: boolean = true
): Date => new Date(`${date}T${time}${isZeroTimezone ? 'Z' : ''}`);

export function isCheckInOpen(tournament: Tournament): boolean {
  const now = +new Date();
  const checkInClosesAt = +combineDateAndTime(
    tournament.start_date,
    tournament.start_time
  );
  const checkInOpensAt =
    checkInClosesAt - tournament.check_in_duration * 60 * 1000;

  return checkInOpensAt < now && checkInClosesAt > now;
}

export function isCheckInClosed(tournament: Tournament): boolean {
  const now = +new Date();
  const checkInClosesAt = +combineDateAndTime(
    tournament.start_date,
    tournament.start_time
  );

  return checkInClosesAt < now;
}

export function getCheckInCountdownValue(tournament: Tournament): number {
  return +combineDateAndTime(tournament.start_date, tournament.start_time);
}
