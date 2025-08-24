import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CallRequestDialog({ open, onOpenChange }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  // очищаем форму при закрытии
  useEffect(() => {
    if (!open) {
      setName("")
      setPhone("")
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      source: "call_request_modal",
      ts_iso: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }

    // === ЗДЕСЬ «отправка» — лог в консоль ===
    console.log("[UrbanVision] Call request:", payload)

    // Закрываем модалку
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 text-white border border-white/10">
        <DialogHeader>
          <DialogTitle>Заказать звонок</DialogTitle>
          <DialogDescription className="text-gray-400">
            Оставьте свои контакты — мы свяжемся с вами в ближайшее время.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Ваше имя"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="tel"
            inputMode="tel"
            placeholder="Телефон"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <DialogFooter className="mt-2">
            <Button variant="cta" className="w-full" type="submit">
              Отправить заявку
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
