export type SiteLanguage = 'ru' | 'en' | 'oz'

const STORAGE_KEY = 'omma-language'

const messages = {
  ru: {
    menu: 'Меню',
    navHome: 'Главная',
    navTours: 'Туры',
    navNews: 'Новости',
    navAbout: 'О нас',
    navContact: 'Контакты',
    authLogin: 'Вход',
    myProfile: 'Мой профиль',
    accountProfile: 'Профиль',
    accountTrips: 'Поездки',
    accountPayments: 'Платежи',
    accountSupport: 'Поддержка',
    accountSettings: 'Настройки',
    leaveRequest: 'Оставить заявку',
    catalog: 'Каталог',
    allTours: 'Все туры',
    found: 'Найдено',
    direction: 'Направление',
    budget: 'Бюджет',
    month: 'Месяц',
    any: 'Любой',
    from700: 'до 700$',
    from700to1000: '700$ - 1000$',
    from1000: '1000$+',
    findTour: 'Найти тур',
    where: 'Куда',
    tourists: 'Туристы',
    details: 'Подробнее',
    from: 'от',
    contacts: 'Контакты',
    contactUs: 'Свяжитесь с нами',
    contactSubtitle: 'Оставьте заявку, и менеджер свяжется с вами в течение 15 минут.',
    aboutCompany: 'О компании',
    newsTitle: 'Новости и обновления'
  },
  en: {
    menu: 'Menu',
    navHome: 'Home',
    navTours: 'Tours',
    navNews: 'News',
    navAbout: 'About',
    navContact: 'Contacts',
    authLogin: 'Login',
    myProfile: 'My Profile',
    accountProfile: 'Profile',
    accountTrips: 'Trips',
    accountPayments: 'Payments',
    accountSupport: 'Support',
    accountSettings: 'Settings',
    leaveRequest: 'Leave a request',
    catalog: 'Catalog',
    allTours: 'All tours',
    found: 'Found',
    direction: 'Destination',
    budget: 'Budget',
    month: 'Month',
    any: 'Any',
    from700: 'up to 700$',
    from700to1000: '700$ - 1000$',
    from1000: '1000$+',
    findTour: 'Find tour',
    where: 'Where',
    tourists: 'Travelers',
    details: 'Details',
    from: 'from',
    contacts: 'Contacts',
    contactUs: 'Contact us',
    contactSubtitle: 'Leave a request and our manager will contact you within 15 minutes.',
    aboutCompany: 'About company',
    newsTitle: 'News and updates'
  },
  oz: {
    menu: 'Menyu',
    navHome: 'Bosh sahifa',
    navTours: 'Turlar',
    navNews: 'Yangiliklar',
    navAbout: 'Biz haqimizda',
    navContact: 'Aloqa',
    authLogin: 'Kirish',
    myProfile: 'Mening profilim',
    accountProfile: 'Profil',
    accountTrips: 'Sayohatlar',
    accountPayments: 'To`lovlar',
    accountSupport: 'Yordam',
    accountSettings: 'Sozlamalar',
    leaveRequest: 'So`rov qoldirish',
    catalog: 'Katalog',
    allTours: 'Barcha turlar',
    found: 'Topildi',
    direction: 'Yo`nalish',
    budget: 'Byudjet',
    month: 'Oy',
    any: 'Istalgan',
    from700: '700$ gacha',
    from700to1000: '700$ - 1000$',
    from1000: '1000$+',
    findTour: 'Turni topish',
    where: 'Qayerga',
    tourists: 'Sayohatchilar',
    details: 'Batafsil',
    from: 'dan',
    contacts: 'Aloqa',
    contactUs: 'Biz bilan bog`laning',
    contactSubtitle: 'So`rov qoldiring, menejer 15 daqiqa ichida sizga bog`lanadi.',
    aboutCompany: 'Kompaniya haqida',
    newsTitle: 'Yangiliklar va yangilanishlar'
  }
} as const

type MessageKey = keyof typeof messages.ru

export const useSiteLanguage = () => {
  const language = useState<SiteLanguage>('site-language', () => 'ru')

  const setLanguage = (next: SiteLanguage): void => {
    language.value = next
  }

  const t = (key: MessageKey): string => messages[language.value][key]

  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'en' || saved === 'oz') {
      language.value = saved
    }

    watch(language, (next) => {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next === 'oz' ? 'uz' : next
    }, { immediate: true })
  }

  return {
    language,
    setLanguage,
    t
  }
}
