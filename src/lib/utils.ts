import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountPkr: number): string {
  return `₨ ${Math.round(amountPkr).toLocaleString()}`;
}

export function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return 'Expired';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
