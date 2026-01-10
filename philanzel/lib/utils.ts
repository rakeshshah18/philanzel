import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = "https://philanzel-backend.onrender.com/api";
export const NEXT_PUBLIC_API_BASE_URL = "https://philanzel-backend.onrender.com/api";
export const NEXT_PUBLIC_API_URL = "https://philanzel-backend.onrender.com/api";

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    // credentials: 'include', // Uncomment if you need cookies
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// Usage example (in a component or page):
// const data = await fetchFromApi('/services');
