import React, { useState } from 'react';
import { TEL_LINK, MAILTO_LINK, TELEGRAM_URL, PHONE, EMAIL, TELEGRAM_HANDLE } from './config/contacts'
import MobileMenu from './components/ui/MobileMenu';
import './App.css';
import { scrollToId } from "@/lib/utils";
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
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
  Send
} from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa';
import urbanvisionLogo from './assets/urbanvision-logo.webp';
import lobbySignage from './assets/lobby-signage.jpg';
import mallSignage from './assets/mall-signage.jpg';
import videoStand from './assets/video-stand.jpeg';

// ✅ модалка «Заказать рекламу»
function App() {
  // ↑ комментарий оставлен без изменений
  const handleOrderClick = () => scrollToId("order-form", 96); // точный скролл на мобиле

  // состояние модалки звонка
  // логика кнопки «Заказать рекламу»: мобила -> tel:, десктоп -> модалка
  const handleCallClick = () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = TEL_LINK;
      return;
    }
    setCallDialogOpen(true);
  };

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
            <a href="#services" className="text-white hover:text-cyan-300 transition-colors">Услуги</a>
            <a href="#about" className="text-white hover:text-cyan-300 transition-colors">О нас</a>
            <a href="#contact" className="text-white hover:text-cyan-300 transition-colors">Контакты</a>
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
                  Фото-отчеты по каждому размещению
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
                Получаете полный фото-отчет
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 scroll-mt-24 md:scroll-mt-28">
        {/* оставляем вспомогательный якорь для CTA (если где-то ещё используется) */}
        <div id="order-form" className="sr-only" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Начните продвижение уже сегодня</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Свяжитесь с нами для бесплатной консультации и расчета стоимости
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Заказать рекламу</CardTitle>
                <CardDescription className="text-gray-300">
                  Заполните форму, и мы свяжемся с вами в течение 24 часов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Ваше имя" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input 
                  placeholder="Телефон" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input 
                  placeholder="Email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Textarea 
                  placeholder="Расскажите о вашем проекте" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  rows={4}
                />
                <Button variant="cta" className="w-full">
                  Отправить заявку
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h3
                  id="contact-info"
                  className="text-2xl font-bold text-white mb-6 scroll-mt-24 md:scroll-mt-28"
                >
                  Контактная информация
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaTelegramPlane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Telegram</p>
                      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors">
                        @{TELEGRAM_HANDLE}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Телефон</p>
                      <a href={TEL_LINK} className="text-gray-300 hover:text-white transition-colors">
                        {PHONE}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <a href={MAILTO_LINK} className="text-gray-300 hover:text-white transition-colors">
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">География</p>
                      <p className="text-gray-300">Вся Россия</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-4">Преимущества работы с нами</h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Бесплатная консультация
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Расчет стоимости за 1 час
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Запуск кампании за 3 дня
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    100% фото-отчет
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
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
