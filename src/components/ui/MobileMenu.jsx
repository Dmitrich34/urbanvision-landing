import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "./button"
import { Menu, X, Phone } from "lucide-react"

export default function MobileMenu({ onCallClick }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // SSR/гидратация: портал только после монтирования
  useEffect(() => setMounted(true), [])

  // Блокируем прокрутку фона при открытом меню
  useEffect(() => {
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = "hidden"
    return () => { body.style.overflow = prev }
  }, [open])

  const close = () => setOpen(false)

  const NavLink = ({ href, children }) => (
    <a
      href={href}
      className="block rounded-lg px-3 py-3 text-base hover:bg-white/10"
      onClick={close}
    >
      {children}
    </a>
  )

  return (
    <>
      {/* Бургер в кружке с градиентом */}
      <Button
        variant="ghost"
        className="md:hidden p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:opacity-90"
        aria-label="Открыть меню"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="w-7 h-7" />
      </Button>

      {/* Портал: оверлей и панель рендерим в <body>, чтобы не обрезались шапкой */}
      {mounted && open && createPortal(
        <>
          {/* Оверлей */}
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Панель справа с градиентной подложкой на всю высоту */}
          <aside
            id="mobile-menu"
            className="fixed right-0 top-0 z-[110] h-dvh w-[84vw] max-w-xs
                       bg-gradient-to-b from-slate-900 via-blue-900 to-purple-900
                       text-white border-l border-white/10 shadow-2xl
                       animate-in slide-in-from-right duration-200 rounded-l-2xl
                       flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Хедер панели */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <div className="text-sm opacity-70">Меню</div>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full p-2"
                aria-label="Закрыть меню"
                onClick={close}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Навигация */}
            <nav className="px-4 py-6 grow overflow-y-auto">
              <ul className="space-y-1">
                <li><NavLink href="#about">О нас</NavLink></li>
                <li><NavLink href="#services">Услуги</NavLink></li>
                <li><NavLink href="#contact">Контакты</NavLink></li>
              </ul>

              {/* Блок с телефоном (подставь номер) */}
              <div className="mt-6 rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="text-xs uppercase tracking-wide opacity-70 mb-1">
                  Отдел продаж
                </div>
                <a href="tel:+7XXXXXXXXXX" className="text-lg font-medium">
                  +7 XXX XXX‑XX‑XX
                </a>
              </div>

              {/* CTA */}
              <Button
                variant="cta"
                className="mt-6 w-full shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40"
                onClick={() => { close(); onCallClick?.() }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Заказать звонок
              </Button>
            </nav>

            <div className="px-4 py-3 text-xs text-white/60 border-t border-white/10">
              © 2025 UrbanVision
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  )
}
