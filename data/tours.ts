import type { TourPackage } from '~/types/tour'

export const TOUR_PACKAGES: readonly TourPackage[] = [
  {
    id: 'turkey-premium',
    title: 'Турция Premium',
    badge: 'Хит продаж',
    country: 'Турция',
    city: 'Анталья',
    shortDescription: '7 ночей, отели 5★, all inclusive и семейный отдых у моря.',
    description:
      'Комфортный тур в Анталью с прямым перелетом, отелем у первой линии и сервисом all inclusive. Отлично подходит для семей и пар.',
    features: ['Перелет + багаж', 'Отель у моря', 'Страховка включена'],
    included: ['Авиаперелет туда-обратно', 'Проживание 7 ночей в отеле 5★', 'Питание all inclusive', 'Трансфер аэропорт-отель-аэропорт', 'Медицинская страховка'],
    notIncluded: ['Личные расходы', 'Индивидуальные экскурсии', 'Повышенный класс номера по запросу'],
    itinerary: ['День 1: Вылет и заселение', 'День 2-6: Пляжный отдых и опциональные экскурсии', 'День 7: Свободный день и шопинг', 'День 8: Выселение и обратный вылет'],
    heroImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 7,
    hotelClass: '5★',
    availableFrom: '2026-06-01',
    availableTo: '2026-10-31',
    departures: [
      { date: '2026-06-16', nights: 7, hotel: 'Sea Star Resort 5★', mealPlan: 'All inclusive', seatsLeft: 9, priceFromUsd: 790 },
      { date: '2026-07-04', nights: 7, hotel: 'Blue Wave Hotel 5★', mealPlan: 'All inclusive', seatsLeft: 6, priceFromUsd: 845 },
      { date: '2026-08-12', nights: 8, hotel: 'Antalya Grand 5★', mealPlan: 'Ultra all inclusive', seatsLeft: 4, priceFromUsd: 910 }
    ],
    priceFromUsd: 790
  },
  {
    id: 'dubai-city-lights',
    title: 'Дубай City Lights',
    badge: 'Премиум',
    country: 'ОАЭ',
    city: 'Дубай',
    shortDescription: 'Город будущего, сафари, пляжи и шопинг в одном туре.',
    description:
      'Премиальный тур в Дубай с отелями 4-5★, удобной логистикой и подбором активностей под ваш стиль отдыха.',
    features: ['Трансфер 24/7', 'Экскурсия по городу', 'Отели 4-5★'],
    included: ['Авиаперелет', 'Проживание 6 ночей', 'Трансфер и встреча', 'Обзорная экскурсия по Дубаю', 'Страховка'],
    notIncluded: ['Входные билеты в парки', 'Личные расходы', 'Дополнительные экскурсии'],
    itinerary: ['День 1: Заселение и Dubai Marina', 'День 2: Обзорный city-tour', 'День 3: Пляж и Burj Khalifa', 'День 4: Desert Safari', 'День 5: Свободный день', 'День 6: Шопинг и отдых', 'День 7: Обратный вылет'],
    heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 6,
    hotelClass: '4-5★',
    availableFrom: '2026-05-15',
    availableTo: '2026-11-20',
    departures: [
      { date: '2026-06-20', nights: 6, hotel: 'Marina Bay 4★', mealPlan: 'Breakfast', seatsLeft: 7, priceFromUsd: 980 },
      { date: '2026-07-11', nights: 6, hotel: 'Skyline Downtown 5★', mealPlan: 'Breakfast', seatsLeft: 5, priceFromUsd: 1090 },
      { date: '2026-09-02', nights: 7, hotel: 'Palm Jumeirah View 5★', mealPlan: 'Half board', seatsLeft: 3, priceFromUsd: 1240 }
    ],
    priceFromUsd: 980
  },
  {
    id: 'egypt-red-sea',
    title: 'Египет Red Sea',
    badge: 'Выгодно',
    country: 'Египет',
    city: 'Шарм-эш-Шейх',
    shortDescription: 'Красное море, дайвинг и солнце круглый год.',
    description:
      'Тур для любителей теплого моря и активного отдыха: дайвинг, снорклинг и экскурсии к историческим местам.',
    features: ['5 ночей и более', 'Удобные вылеты', 'Детские зоны'],
    included: ['Перелет туда-обратно', 'Отель 4-5★', 'Питание all inclusive', 'Групповой трансфер', 'Базовая страховка'],
    notIncluded: ['Расширенная страховка', 'Индивидуальные активности', 'Дайвинг-пакеты PRO'],
    itinerary: ['День 1: Прилет и заселение', 'День 2-3: Море и экскурсии', 'День 4: Поездка к историческим объектам', 'День 5-6: Отдых на территории отеля', 'День 7: Вылет домой'],
    heroImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 6,
    hotelClass: '4-5★',
    availableFrom: '2026-04-01',
    availableTo: '2026-12-15',
    departures: [
      { date: '2026-05-30', nights: 6, hotel: 'Coral Beach 4★', mealPlan: 'All inclusive', seatsLeft: 12, priceFromUsd: 650 },
      { date: '2026-06-25', nights: 7, hotel: 'Sun Reef 5★', mealPlan: 'All inclusive', seatsLeft: 8, priceFromUsd: 720 },
      { date: '2026-09-18', nights: 6, hotel: 'Royal Red Sea 5★', mealPlan: 'All inclusive', seatsLeft: 5, priceFromUsd: 790 }
    ],
    priceFromUsd: 650
  },
  {
    id: 'europe-weekend',
    title: 'Европа Weekend',
    badge: 'Short trip',
    country: 'Европа',
    city: 'Прага / Будапешт / Вена',
    shortDescription: 'Короткие поездки в атмосферные европейские города.',
    description:
      'Идеальный формат на 2-4 ночи: исторические центры, архитектура, кафе и комфортные перелеты.',
    features: ['2-4 ночи', 'Виза-поддержка', 'Центр города'],
    included: ['Авиаперелет', 'Проживание в отеле 4★', 'Завтраки', 'Помощь с визой', 'Базовый трансфер'],
    notIncluded: ['Консульские сборы', 'Музеи и билеты', 'Личные расходы'],
    itinerary: ['День 1: Прилет и вечерняя прогулка', 'День 2: Исторический центр и экскурсия', 'День 3: Свободный день', 'День 4: Вылет'],
    heroImage: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1471623817296-aa07ae5c9f47?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 3,
    hotelClass: '4★',
    availableFrom: '2026-03-10',
    availableTo: '2026-12-20',
    departures: [
      { date: '2026-04-12', nights: 3, hotel: 'Central Prague 4★', mealPlan: 'Breakfast', seatsLeft: 10, priceFromUsd: 520 },
      { date: '2026-05-21', nights: 3, hotel: 'Budapest City 4★', mealPlan: 'Breakfast', seatsLeft: 7, priceFromUsd: 560 },
      { date: '2026-09-03', nights: 4, hotel: 'Vienna Palace 4★', mealPlan: 'Breakfast', seatsLeft: 4, priceFromUsd: 640 }
    ],
    priceFromUsd: 520
  },
  {
    id: 'bali-relax-escape',
    title: 'Бали Relax Escape',
    badge: 'Instagram spot',
    country: 'Индонезия',
    city: 'Бали',
    shortDescription: 'Виллы у океана, серфинг и авторские маршруты по острову.',
    description:
      'Тур для тех, кто хочет совместить премиальный отдых, природу и яркие эмоции. Подходит для медового месяца и digital detox.',
    features: ['8 ночей', 'Фото-локации', 'Персональный гид'],
    included: ['Перелет', 'Проживание на вилле', 'Трансфер по маршруту', '2 экскурсии', 'Страховка'],
    notIncluded: ['Личные траты', 'Доп. экскурсии', 'SPA и private-опции'],
    itinerary: ['День 1: Прилет и релакс', 'День 2: Ubud и рисовые террасы', 'День 3: Пляж и серфинг', 'День 4: Waterfalls', 'День 5: Свободный день', 'День 6: Храмовый маршрут', 'День 7-8: Отдых', 'День 9: Вылет'],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518544866330-4e1f5e853f03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 8,
    hotelClass: '4-5★ villa',
    availableFrom: '2026-05-01',
    availableTo: '2026-11-30',
    departures: [
      { date: '2026-06-08', nights: 8, hotel: 'Ocean Ubud Villa', mealPlan: 'Breakfast', seatsLeft: 5, priceFromUsd: 1190 },
      { date: '2026-07-19', nights: 8, hotel: 'Nusa Retreat 5★', mealPlan: 'Breakfast', seatsLeft: 4, priceFromUsd: 1290 },
      { date: '2026-10-01', nights: 9, hotel: 'Bali Private Resort', mealPlan: 'Half board', seatsLeft: 2, priceFromUsd: 1440 }
    ],
    priceFromUsd: 1190
  },
  {
    id: 'georgia-taste-mountains',
    title: 'Грузия Taste & Mountains',
    badge: 'Гастротур',
    country: 'Грузия',
    city: 'Тбилиси + Кахетия',
    shortDescription: 'Горы, винодельни, теплая атмосфера и локальная кухня.',
    description:
      'Комбинированный тур для тех, кто любит гастрономию и красивые пейзажи. Оптимален для дружеских и корпоративных поездок.',
    features: ['Перелет + отель', 'Винный маршрут', 'Групповые туры'],
    included: ['Авиаперелет', 'Отель 4★', 'Завтраки', 'Групповой винный тур', 'Трансфер'],
    notIncluded: ['Личные расходы', 'Индивидуальный гид', 'Ужины вне программы'],
    itinerary: ['День 1: Прилет и старый Тбилиси', 'День 2: Кахетия и дегустации', 'День 3: Горы и фотолокации', 'День 4: Свободный день', 'День 5: Возвращение'],
    heroImage: 'https://images.unsplash.com/photo-1565004602744-1cbf6b286da4?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561988590-6f4f99de7f2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    ],
    durationNights: 4,
    hotelClass: '4★',
    availableFrom: '2026-04-10',
    availableTo: '2026-10-25',
    departures: [
      { date: '2026-05-17', nights: 4, hotel: 'Tbilisi Old Town 4★', mealPlan: 'Breakfast', seatsLeft: 9, priceFromUsd: 680 },
      { date: '2026-06-28', nights: 5, hotel: 'Kakheti Wine Inn', mealPlan: 'Breakfast', seatsLeft: 6, priceFromUsd: 740 },
      { date: '2026-09-14', nights: 4, hotel: 'Mountain View 4★', mealPlan: 'Breakfast', seatsLeft: 5, priceFromUsd: 710 }
    ],
    priceFromUsd: 680
  }
] as const

export const getTourById = (id: string): TourPackage | undefined =>
  TOUR_PACKAGES.find((tour) => tour.id === id)
