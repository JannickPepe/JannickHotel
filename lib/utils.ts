import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn is Shadcn functions and we return twMerge which is tailwind merge with classes as inputs ect
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
