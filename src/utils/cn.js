import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class lists and resolve Tailwind conflicts.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
