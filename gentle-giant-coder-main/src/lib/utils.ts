import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHallDisplayName(name: "man" | "women") {
  return name === "man" ? "سالن اقایون" : "سالن  خانوم ها";
}
