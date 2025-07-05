import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge CSS classes with Tailwind CSS class precedence
 * @param inputs - CSS class names or conditional class objects
 * @returns Merged CSS class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
