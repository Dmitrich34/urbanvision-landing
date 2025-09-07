import React, { useState, useEffect } from "react";

// Конфиги
import { TEL_LINK, MAILTO_LINK, TELEGRAM_URL, PHONE, EMAIL, TELEGRAM_HANDLE } from "./config/contacts";

// UI и утилиты
import { cn, scrollToId } from "@/lib/utils";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import MobileMenu from "./components/ui/MobileMenu";

// Иконки
import {
  Eye,
  Target,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Play,
  BarChart3,
  Zap,
  Send,
  Star,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

// Ассеты
import urbanvisionLogo from "./assets/urbanvision-logo.webp";
import lobbySignage from "./assets/lobby-signage01.jpg";
import mallSignage from "./assets/mall-signage01.jpg";
import videoStand from "./assets/video-stand01.jpg";

// Стили
import "./App.css";

// ✅ Функция для определения рабочего времени и статуса ответа
const getResponseTimeData = () => {
  const now = new Date();
  const msk = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
  const hour = msk.getHours();
  const day = msk.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота

  // Выходные (суббота и воскресенье)
  if (day === 0 || day === 6) {
    return {
      time: "Ответим в понедельник",
      emoji: "📅",
      status: "weekend",
      statusText: "Выходной",
      statusColor: "bg-gray-500/20 text-gray-300"
    };
  }

  // Рабочее время (9:00 - 18:00)
  if (hour >= 9 && hour < 18) {
    return {
      time: "2 часа",
      emoji: "⏱️",
      status: "online",
      statusText: "Онлайн",
      statusColor: "bg-green-500/20 text-green-300"
    };
  }

  // Близко к рабочему времени (6:00 - 9:00 и 18:00 - 22:00)
  if ((hour >= 6 && hour < 9) || (hour >= 18 && hour < 22)) {
    return {
      time: "Ответим через 3-5 часов",
      emoji: "🕒",
      status: "soon",
      statusText: "Скоро",
      statusColor: "bg-yellow-500/20 text-yellow-300"
    };
  }

  // Поздний вечер/ночь (22:00 - 6:00)
  return {
    time: "Ответим завтра утром",
    emoji: "🌙",
    status: "night",
    statusText: "Ночь",
    statusColor: "bg-blue-500/20 text-blue-300"
  };
};

// ✅ Компонент живого времени ответа
const LiveResponseTime = () => {
  const [responseData, setResponseData] = useState(getResponseTimeData());
  
  useEffect(() => {
    // Обновляем каждую минуту
    const interval = setInterval(() => {
      setResponseData(getResponseTimeData());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-center p-4 bg-black/20 rounded-xl border border-cyan-500/20">
      <div className="text-cyan-400 text-2xl font-bold">
        {responseData.emoji} {responseData.time}
      </div>
      <div className="text-gray-300 text-sm">Среднее время ответа</div>
    </div>
  );
};

// ✅ модалка «Заказать рекламу»
function App() {
  // ↑ комментарий оставлен без изменений
  const handleOrderClick = () => scrollToId("order-form", 96); // точный скролл на мобиле

  // ⬇️ добавляем хелперы для плавного скролла пунктов хедера
  // Прокрутка к первому существующему id из списка (учёт шапки)
  const scrollToCandidates = (ids, offset = 96) => {
    for (const id of ids) {
      if (document.getElementById(id)) {
        scrollToId(id, offset);
        return true;
      }
    }
    return false;
  };

  // Обработчик для пунктов хедера (предотвращаем "рывок" якоря)
  const handleNav = (ids) => (e) => {
    e.preventDefault();
    if (!scrollToCandidates(ids, 96)) {
      // fallback на первый id
      scrollToId(ids[0], 96);
    }
  };

  // состояние модалки звонка
  // логика кнопки «Заказать рекламу»: мобила -> tel:, десктоп -> модалка
  const handleCallClick = () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = TEL_LINK;
      return;
    }
    setCallDialogOpen(true);
  };

  // ✅ Состояние для живого времени ответа
  const [responseData, setResponseData] = useState(getResponseTimeData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseData(getResponseTimeData());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
// ==== BEGIN: ORDER FORM BLOCK (state/logic) ====

// чтобы не было ошибки при вызове setCallDialogOpen(true)
const [callDialogOpen, setCallDialogOpen] = useState(false);

// фиксированный префикс телефона
const PHONE_PREFIX = "+7";

// начальное состояние формы (удобно для сброса)
const initialForm = {
  name: "",
  phone: PHONE_PREFIX + " ", // показываем только +7; остальное форматируется по вводу
  email: "",
  company: "",
  hasVideo: "no",
  city: "",
  comment: "",
  consent: false,
};

// форма «Заказать рекламу»
const [ofForm, setOfForm] = useState(initialForm);
const [ofErrors, setOfErrors] = useState({});
const [ofSubmitting, setOfSubmitting] = useState(false);
const [ofSubmitted, setOfSubmitted] = useState(false);

const ofCities = ["Волгоград", "Волжский", "Другой"];

// URL политики (положи файл как /public/privacy.pdf или укажи свой путь)
const PRIVACY_URL = "/privacy.pdf";

// ── Телефон: парсинг/формат/валидация ─────────────────────────────────────────
const extractPhoneDigits = (s) =>
  (s || "").replace(/\D/g, "").replace(/^7/, "").slice(0, 10);

// +7 (123) 456-78-90 — формат по мере ввода (без подчёркиваний)
const formatPhonePartial = (digits) => {
  let out = PHONE_PREFIX;
  if (digits.length > 0) {
    out += " (" + digits.slice(0, 3);
    if (digits.length >= 3) out += ")";
  }
  if (digits.length > 3) out += " " + digits.slice(3, 6);
  if (digits.length > 6) out += "-" + digits.slice(6, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  return out + (digits.length === 0 ? " " : "");
};

const validPhone = (masked) => extractPhoneDigits(masked).length === 10;

// обработчик ввода телефона (без обращения к внешнему ofErrors)
const ofHandlePhone = (e) => {
  const digits = extractPhoneDigits(e.target.value);
  const nextPhone = formatPhonePartial(digits);
  setOfForm((s) => ({ ...s, phone: nextPhone }));
  setOfErrors((prev) => {
    if (validPhone(nextPhone) && prev.phone) {
      const n = { ...prev };
      delete n.phone;
      return n;
    }
    return prev;
  });
};
// ──────────────────────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Удаляет любые пробелы И невидимые форматирующие символы
const sanitizeEmail = (s) =>
  (s ?? "")
    .normalize('NFKC')
    .replace(/[\s\u00A0\u1680-\u200A\u2028\u2029\u202F\u205F\u3000\u00AD\u200B-\u200F\u061C\u2066-\u2069\uFEFF]+/g, "");
// удаляет только ведущие пробелы
const stripLeading = (s) => (s ?? "").replace(/^\s+/,
 "");

const nameRegex = /^[A-Za-zА-Яа-яЁё]+(?:\s[A-Za-zА-Яа-яЁё]+){0,2}$/; // буквы + до 2 пробелов (3 слова)

const ofHandleName = (e) => {
  let v = e.target.value || "";

  // оставить только буквы (ru/en) и пробел
  v = v.replace(/[^A-Za-zА-Яа-яЁё\s]/g, "");

  // убрать ведущие пробелы, чтобы начиналось с буквы
  v = v.replace(/^\s+/, "");

  // схлопнуть повторяющиеся пробелы
  v = v.replace(/\s{2,}/g, " ");

  // не больше двух пробелов И сохраняем «висящий» пробел, если он один из двух
  const spaces = (v.match(/ /g) || []).length;
  if (spaces > 2) {
    let keep = 2, out = "";
    for (const ch of v) {
      if (ch === " ") {
        if (keep) { out += ch; keep--; }
      } else {
        out += ch;
      }
    }
    v = out;
  }

  setOfForm((s) => ({ ...s, name: v }));

  // мягко снять ошибку, если текущее значение валидно (без учёта хвостового пробела)
  setOfErrors((errs) => {
    const n = { ...errs };
    if (nameRegex.test(v.trim())) delete n.name;
    return n;
  });
};

const ofHandleChange = (e) => {
  const { name, value, type, checked } = e.target;
  let nextValue = type === "checkbox" ? checked : value;

  // ⬇️ запрет пробелов для email
  if (name === "email") {
    nextValue = sanitizeEmail(nextValue);
  }
  // (как и раньше) убираем ведущие пробелы там, где нужно
  else if (name === "company" || name === "comment") {
    nextValue = (nextValue ?? "").replace(/^\s+/, "");
  }

  setOfForm((s) => ({ ...s, [name]: nextValue }));

  // мягкая очистка ошибок (оставь как было)
  setOfErrors((errs) => {
    const n = { ...errs };
    if (name === "name" && String(nextValue).trim()) delete n.name;
    if (name === "email") {
      const v = String(nextValue).trim();
      if (!v || emailRegex.test(v)) delete n.email;
    }
    if (name === "consent" && nextValue === true) delete n.consent;
    if (name === "company" && String(nextValue).trim()) delete n.company;
    return n;
  });
};

// Срез пробелов у email при потере фокуса (на случай автозаполнения/вставки)
const ofHandleBlur = (e) => {
  if (e.target.name === "email") {
    const v = sanitizeEmail(e.target.value);
    if (v !== e.target.value) {
      e.target.value = v;                // мгновенно почистить в UI
      setOfForm((s) => ({ ...s, email: v }));
    }
  }
};

const ofEmailKeyDown = (e) => {
  if (e.key === " " || e.code === "Space" || e.key === "Spacebar") {
    e.preventDefault();
  }
};

const ofEmailPaste = (e) => {
  if (e.target.name !== "email") return;
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData("text") || "";
  const v = sanitizeEmail(text);
  setOfForm((s) => ({ ...s, email: v }));
};

const ofValidate = () => {
  const next = {};
  const nameTrim = ofForm.name.trim();
  if (!nameTrim) next.name = "Введите имя";
  else if (!nameRegex.test(nameTrim)) next.name = "Только буквы и до двух пробелов";
  if (!validPhone(ofForm.phone)) next.phone = "Введите номер полностью";
  const emailTrim = sanitizeEmail(ofForm.email || "");
  if (emailTrim && !emailRegex.test(emailTrim)) next.email = "Неверный формат email";
  if (!ofForm.consent) next.consent = "Необходимо согласие";
  setOfErrors(next);
  return Object.keys(next).length === 0;
};

const ofSubmit = (e) => {
  e.preventDefault();
  if (!ofValidate()) return;
  setOfSubmitting(true);
  // TODO: интеграция (n8n/Telegram/Sheets)
  setTimeout(() => {
    setOfSubmitting(false);
    setOfSubmitted(true); // меняем подпись кнопки
  }, 500);
};

// кнопка «Заявка отправлена»: очистить форму и вернуться к началу страницы
const ofResetAndExit = () => {
  setOfSubmitted(false);
  setOfErrors({});
  setOfForm({ ...initialForm });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// общие классы инпутов (могут не использоваться — ок)
const inputBase =
  "w-full rounded-xl border bg-white/90 px-4 py-3 outline-none transition placeholder:text-neutral-400 dark:bg-neutral-900/80";
const inputOk =
  "border-neutral-200 focus-visible:ring-2 focus-visible:ring-pink-500/40 dark:border-neutral-800";
const inputErr =
  "border-rose-400 ring-2 ring-rose-400/40 focus-visible:ring-rose-500/40";

// ==== END: ORDER FORM BLOCK ====

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={urbanvisionLogo} alt="UrbanVision" className="w-20 h-20 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">UrbanVision</h1>
              <p className="text-cyan-300 text-sm">Ваш бизнес в центре внимания</p>
            </div>
          </div>

          {/* Десктоп-меню */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#services" onClick={handleNav(['services'])} className="text-white hover:text-cyan-300 transition-colors">Услуги</a>
            <a href="#about" onClick={handleNav(['about'])} className="text-white hover:text-cyan-300 transition-colors">О нас</a>
            <a href="#contacts-footer" onClick={handleNav(['contacts-footer', 'contacts', 'contact-info', 'contact'])} className="text-white hover:text-cyan-300 transition-colors">Контакты</a>
            {/* CTA: скроллим к форме */}
            <Button variant="cta" onClick={handleOrderClick}>
              ЗАКАЗАТЬ РЕКЛАМУ
            </Button>
          </div>

          {/* Мобильное меню (бургер) */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  Indoor-реклама нового поколения
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Ваша реклама, которую 
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}невозможно пропустить!
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Городская реклама, которая работает.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Оставляем ОДНУ основную CTA в Hero */}
                <Button 
                  size="lg"
                  variant="cta"
                  className="text-lg px-8 py-6"
                  onClick={() => scrollToId("order-form", 96)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Узнать, как увеличить продажи
                </Button>
              </div>

              {/* За неимением достаточной аналитики данные пока скрыты */}
              {/* <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">65+</div>
                  <div className="text-gray-300 text-sm">Городов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">18M</div>
                  <div className="text-gray-300 text-sm">Охват в день</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">49.5M</div>
                  <div className="text-gray-300 text-sm">Показов в месяц</div>
                </div>
              </div> */} 
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
              <img 
                src={videoStand} 
                alt="Видеостойка UrbanVision" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"                
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black/20 backdrop-blur-sm scroll-mt-24 md:scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Почему UrbanVision?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Мы – команда экспертов в области indoor-рекламы, которая помогает бизнесу любого масштаба достигать своих целей
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">Быстрый запуск</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Готовый видеоролик за 3 дня, размещение в тот же день
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">Точное попадание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Размещение в местах с высокой проходимостью вашей ЦА
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">100% внимание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Реклама, которую нельзя пропустить или отключить
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">Полная отчетность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">
                  Фото-отчеты по каждому размещению и аналитика показов
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 scroll-mt-24 md:scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наши решения для вашего бизнеса</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Комплексные услуги по indoor-рекламе на видеостойках
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Размещение на видеостойках</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Мы предлагаем размещение рекламы на современных видеостойках в местах с большим трафиком Вашей целевой аудитории. 
                Информация о Вашем бизнесе будет доступнее для потенциальных клиентов.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Торговые и бизнес-центры
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Жилые комплексы и лифты
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Фитнес-клубы и спортивные объекты
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Аэропорты и вокзалы
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src={lobbySignage} 
                alt="Реклама в бизнес-центре" 
                className="w-full h-auto rounded-2xl shadow-2xl"                
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src={mallSignage} 
                alt="Реклама в торговом центре" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-white">Создание видеороликов</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Наша команда разработает для вас яркий и запоминающийся видеоролик, который максимально эффективно 
                донесет ваше сообщение до целевой аудитории.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Профессиональная разработка контента
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Адаптация под различные форматы экранов
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  A/B тестирование креативов
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Оптимизация для максимального воздействия
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Простой путь к эффективной рекламе</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Всего 4 шага до запуска вашей рекламной кампании
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Оставьте заявку</h3>
              <p className="text-gray-300">
                Заполните форму на сайте или позвоните нам
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Консультация</h3>
              <p className="text-gray-300">
                Обсуждаем ваши цели и предлагаем оптимальное решение
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Разработка</h3>
              <p className="text-gray-300">
                Создаем ролик, подбираем локации и запускаем кампанию
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Отчетность</h3>
              <p className="text-gray-300">
                Получаете полный фото-отчет и аналитику показаов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
<section id="contact" className="py-20 scroll-mt-24 md:scroll-mt-28">
  {/* оставляем вспомогательный якорь для CTA */}
  <div id="order-form" className="sr-only" />
  <div className="container mx-auto px-4">
    {/* Сохраняем текущий заголовок секции */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Начните продвижение уже сегодня</h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Свяжитесь с нами для бесплатной консультации и расчета стоимости
      </p>
    </div>

    {/* === Новый единый блок "Заказать рекламу" === */}
    <div className="max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm shadow-2xl transition-all duration-300">
  <CardHeader className="text-center pb-4">
    <CardTitle className="text-white text-2xl">Заказать рекламу</CardTitle>
    <CardDescription className="text-gray-300 text-lg">
      Выберите удобный способ связи для заказа рекламы
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Градиентные кнопки связи (с иконками) */}
    <div className="grid gap-3 md:grid-cols-3">
      <Button asChild size="lg" variant="cta" className="w-full justify-center">
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
          <FaTelegramPlane className="mr-2 h-5 w-5" aria-hidden="true" />
          Написать в Telegram
        </a>
      </Button>

      <Button asChild size="lg" variant="cta" className="w-full justify-center">
        <a href={MAILTO_LINK}>
          <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
          Написать на E-Mail
        </a>
      </Button>

      <Button asChild size="lg" variant="cta" className="w-full justify-center">
        <a href={TEL_LINK}>
          <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
          Позвонить по телефону
        </a>
      </Button>
    </div>

    {/* Политика и график — улучшенная типографика */}
    <div className="space-y-4 text-center">
      <a
        href="/privacy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base md:text-lg font-medium text-cyan-300 hover:text-white underline decoration-cyan-400/40 underline-offset-4 transition-colors"
      >
        Политика конфиденциальности
      </a>

      {/* тонкий разделитель, чтобы текст не сливался */}
      <div className="mx-auto h-px w-24 bg-white/10"></div>

      <div className="space-y-2 text-sm md:text-base leading-relaxed text-white/80 max-w-2xl mx-auto">
        <p>Оставляя заявку, вы соглашаетесь на обработку ваших персональных данных</p>
        <p>Заявки обрабатываются в будние дни в рабочее время.</p>
        <p className="font-medium text-white/90">График работы: 9:00 — 18:00 МСК</p>
      </div>
    </div>
  </CardContent>
</Card>
    </div>
  </div>
</section>

      {/* Footer */}
<footer id="contacts-footer" className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 scroll-mt-28 md:scroll-mt-32">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <img src={urbanvisionLogo} alt="UrbanVision" className="w-18 h-18 rounded-lg" />
          <div>
            <h3 className="text-xl font-bold text-white">UrbanVision</h3>
            <p className="text-cyan-300 text-sm">Ваш бизнес в центре внимания</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          Эффективная indoor-реклама на видеостойках в самых проходимых местах города.
        </p>
      </div>
    
      <div>
        <h4 className="text-white font-semibold mb-4">Услуги</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>Размещение на видеостойках</li>
          <li>Создание видеороликов</li>
          <li>Аналитика и отчетность</li>
          <li>Консультации по рекламе</li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-4">Контакты</h4>
        <div className="space-y-2 text-gray-300 text-sm">
          <p>
            Telegram:{" "}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              @{TELEGRAM_HANDLE}
            </a>
          </p>
          <p>
            Телефон:{" "}
            <a href={TEL_LINK} className="hover:text-white transition-colors">
              {PHONE}
            </a>
          </p>
          <p>
            Email:{" "}
            <a href={MAILTO_LINK} className="hover:text-white transition-colors">
              {EMAIL}
            </a>
          </p>
          <p>
            Сайт:{" "}
            <a
              href="https://urban-vision.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              urban-vision.ru
            </a>
          </p>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 mt-8 pt-8 text-center">
      <p className="text-gray-400 text-sm">
        © 2025 UrbanVision. Все права защищены.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}

export default App;