// src/config/contacts.js
export const PHONE = '+7XXXXXXXXXX'           // ← подставим позже
export const EMAIL = 'info@urban-vision.ru'   // можно сразу реальный
export const TELEGRAM_HANDLE = 'urbanvision_tg' // ← без @, подставим позже

// Ссылки (используем в компонентах)
export const TEL_LINK = `tel:${PHONE}`
export const MAILTO_LINK = `mailto:${EMAIL}`

// Универсальная ссылка на профиль/чат в Telegram.
// Работает в браузере и приложении:
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`
// (при желании можно для мобильных сделать tg://resolve?domain=…)
