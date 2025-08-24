import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export default function MobileMenu({ onCallClick }) {
  const [open, setOpen] = useState(false)

  // блокируем прокрутку фона, когда меню открыто
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => (document.body.style.overflow = "")
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* Кнопка-бургер — видна ТОЛЬКО на мобилке */}
      <Button
        variant="ghost"
        className="md:hidden text-white hover:bg-white/10"
        aria-label="Открыть меню"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Оверлей + панель */}
      {open && (
        <>
          {/* Полупрозрачный фон */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          {/* Панель справа */}
          <aside
            id="mobile-menu"
            className="fixed right-0 top-0 z-50 h-full w-[84vw] max-w-xs bg-slate-900 text-white border-l border-white/10 shadow-2xl
                       animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <div className="text-sm opacity-70">Меню</div>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                aria-label="Закрыть меню"
                onClick={close}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="px-4 py-6">
              <ul className="space-y-4 text-base">
                <li>
                  <a
                    href="#about"
                    className="block rounded-lg px-3 py-2 hover:bg-white/10"
                    onClick={close}
                  >
                    О нас
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="block rounded-lg px-3 py-2 hover:bg-white/10"
                    onClick={close}
                  >
                    Услуги
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="block rounded-lg px-3 py-2 hover:bg-white/10"
                    onClick={close}
                  >
                    Контакты
                  </a>
                </li>
              </ul>

              {/* блок с телефоном (по желанию — подставь номер) */}
              <div className="mt-6 rounded-xl border border-white/10 p-4">
                <div className="text-xs uppercase tracking-wide opacity-60 mb-1">
                  Отдел продаж
                </div>
                <a href="tel:+7XXXXXXXXXX" className="text-lg font-medium">
                  +7 XXX XXX‑XX‑XX
                </a>
              </div>

              {/* CTA — тот же variant="cta" */}
              <Button
                variant="cta"
                className="mt-6 w-full"
                onClick={() => {
                  close()
                  onCallClick?.()
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Заказать звонок
              </Button>
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
