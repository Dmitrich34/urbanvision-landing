// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Плавный скролл к элементу по id с учётом фиксированной шапки
 * @param {string} id
 * @param {number} offset - базовый отступ (по умолчанию 80)
 */
export function scrollToId(id, offset = 80) {
  if (typeof window === "undefined") return
  const el = document.getElementById(id)
  if (!el) return

  // Пытаемся взять реальную высоту шапки
  const header = document.querySelector("header")
  const headerH = header?.offsetHeight || 0

  // На мобильных браузерах часто нужно чуть больше запаса
  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  const extra = isMobile ? 16 : 0

  const top = el.getBoundingClientRect().top + window.scrollY - Math.max(offset, headerH + extra)
  window.scrollTo({ top, behavior: "smooth" })
}
