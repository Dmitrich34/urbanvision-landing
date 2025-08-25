// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Плавный скролл к элементу по id с учётом фиксированной шапки
 * @param {string} id   - id элемента (например 'order-form')
 * @param {number} offset - отступ сверху (по умолчанию 80)
 */
export function scrollToId(id, offset = 80) {
  if (typeof window === "undefined") return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: "smooth" })
}
