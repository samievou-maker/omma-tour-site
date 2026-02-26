<template>
  <div
    class="admin-full-width fixed inset-0 z-[80] overflow-y-auto bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 2xl:px-10"
    style="width:100vw;max-width:100vw;"
  >
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-700">Админ-панель</p>
      <h1 class="mt-2 font-serif text-5xl text-slate-900">Полное управление сайтом</h1>
      <p class="mt-2 text-sm text-slate-600">
        Здесь владелец может менять тексты, контакты, туры, цены, вылеты, направления, отзывы и новости без кода.
      </p>
    </div>

    <section v-if="!authenticated" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 class="text-2xl font-bold text-slate-900">Вход администратора</h2>
      <form class="mt-4 space-y-3" @submit.prevent="login">
        <label class="block text-sm font-semibold text-slate-700">
          Пароль
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-mint/40 focus:ring-2"
            required
          >
        </label>
        <button class="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white" :disabled="loading" type="submit">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <p class="mt-3 min-h-5 text-sm font-semibold text-rose-600">{{ errorMessage }}</p>
    </section>

    <section v-else class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <p class="text-sm text-slate-600">Последнее обновление: <strong>{{ updatedAtLabel }}</strong></p>
        <div class="flex flex-wrap gap-2">
          <button class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700" @click="loadContent">Обновить</button>
          <button class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white" @click="saveAll">Сохранить всё</button>
          <button class="rounded-xl border border-rose-300 px-4 py-2 text-sm font-bold text-rose-700" @click="logout">Выйти</button>
        </div>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 class="text-2xl font-bold text-slate-900">Настройки сайта</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Лого (основное)
            <input v-model="settings.brandMain" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Лого (второе слово)
            <input v-model="settings.brandSub" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Hero заголовок
            <input v-model="settings.heroTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Hero подзаголовок
            <textarea v-model="settings.heroSubtitle" rows="2" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Hero изображение (URL)
            <input v-model="settings.heroImage" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Телефон
            <input v-model="settings.contactPhone" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Email
            <input v-model="settings.contactEmail" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Адрес
            <input v-model="settings.contactAddress" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Заголовок "О нас"
            <input v-model="settings.aboutTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Текст "О нас"
            <textarea v-model="settings.aboutText" rows="3" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 class="text-2xl font-bold text-slate-900">Footer (низ сайта)</h2>
        <p class="mt-1 text-sm text-slate-600">Эта секция отображается внизу сайта и полностью редактируется отсюда.</p>

        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Заголовок контактов
            <input v-model="footer.supportTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Короткий номер
            <input v-model="footer.supportShortNumber" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Телефон
            <input v-model="footer.supportPhone" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Email
            <input v-model="footer.supportEmail" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Заголовок "Информация"
            <input v-model="footer.infoTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Заголовок "Медиа"
            <input v-model="footer.mediaTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Заголовок "Партнерам"
            <input v-model="footer.partnersTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700">Заголовок соцсетей
            <input v-model="footer.socialsTitle" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Информация (по строкам)
            <textarea v-model="infoLinksText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Медиа (по строкам)
            <textarea v-model="mediaLinksText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Партнерам (по строкам)
            <textarea v-model="partnersLinksText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Соцсети (каждая строка: Название|Ссылка)
            <textarea v-model="socialsText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label class="text-sm font-semibold text-slate-700 md:col-span-2">Нижняя строка copyright
            <input v-model="footer.copyright" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
          </label>
        </div>
      </section>

      <div class="grid gap-5">
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">Направления</h2>
            <button class="rounded-xl bg-brand-dark px-3 py-2 text-xs font-bold text-white" @click="createDestination">+ Направление</button>
          </div>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <article v-for="item in destinations" :key="item.id" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div class="grid gap-2">
                <input v-model="item.id" placeholder="id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                <input v-model="item.title" placeholder="Заголовок" class="rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold">
                <input v-model="item.tagline" placeholder="Подпись" class="rounded-lg border border-slate-300 px-2 py-1 text-sm">
                <input v-model="item.image" placeholder="URL картинки" class="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                <input v-model="item.linkedTourId" placeholder="ID тура для перехода в Подробнее" class="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                <textarea v-model="item.description" rows="2" placeholder="Описание" class="rounded-lg border border-slate-300 px-2 py-1 text-sm" />
                <button class="rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="removeDestination(item.id)">Удалить</button>
              </div>
            </article>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">Отзывы</h2>
            <button class="rounded-xl bg-brand-dark px-3 py-2 text-xs font-bold text-white" @click="createReview">+ Отзыв</button>
          </div>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <article v-for="item in reviews" :key="item.id" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input v-model="item.id" placeholder="id" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
              <input v-model="item.author" placeholder="Автор" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold">
              <textarea v-model="item.text" rows="3" placeholder="Текст отзыва" class="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm" />
              <button class="mt-2 rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="removeReview(item.id)">Удалить</button>
            </article>
          </div>
        </section>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900">Почему мы (Главная)</h2>
          <button class="rounded-xl bg-brand-dark px-3 py-2 text-xs font-bold text-white" @click="createWhyUs">+ Пункт</button>
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          <article v-for="item in whyUs" :key="item.id" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <input v-model="item.id" placeholder="id" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
            <input v-model="item.icon" placeholder="Иконка (эмодзи/символ)" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
            <input v-model="item.title" placeholder="Заголовок" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold">
            <textarea v-model="item.description" rows="3" placeholder="Описание" class="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm" />
            <button class="mt-2 rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="removeWhyUs(item.id)">Удалить</button>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-2xl font-bold text-slate-900">Туры и цены</h2>
          <button class="rounded-xl bg-brand-dark px-3 py-2 text-xs font-bold text-white" @click="createNewTour">+ Новый тур</button>
        </div>

        <div class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <button
            v-for="tour in tours"
            :key="tour.id"
            class="rounded-xl border px-3 py-2 text-left text-sm"
            :class="tour.id === selectedTourId ? 'border-brand bg-orange-50' : 'border-slate-200 bg-slate-50'"
            @click="selectTour(tour.id)"
          >
            <p class="font-bold text-slate-900">{{ tour.title }}</p>
            <p class="text-xs text-slate-500">{{ tour.id }} · от {{ tour.priceFromUsd }}$</p>
          </button>
        </div>

        <form v-if="tourForm" class="grid gap-3" @submit.prevent="saveTour">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <label class="text-sm font-semibold text-slate-700">ID
              <input v-model="tourForm.id" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Название
              <input v-model="tourForm.title" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Страна
              <input v-model="tourForm.country" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Город
              <input v-model="tourForm.city" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Бейдж
              <input v-model="tourForm.badge" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Цена от (USD)
              <input v-model.number="tourForm.priceFromUsd" type="number" min="0" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Ночей
              <input v-model.number="tourForm.durationNights" type="number" min="1" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Класс отеля
              <input v-model="tourForm.hotelClass" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Доступно с
              <input v-model="tourForm.availableFrom" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Доступно до
              <input v-model="tourForm.availableTo" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
          </div>

          <label class="text-sm font-semibold text-slate-700">Краткое описание
            <textarea v-model="tourForm.shortDescription" rows="2" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <label class="text-sm font-semibold text-slate-700">Полное описание
            <textarea v-model="tourForm.description" rows="3" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <div class="grid gap-3 md:grid-cols-2">
            <label class="text-sm font-semibold text-slate-700">Для кого тур
              <input v-model="tourForm.bestFor" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Виза
              <input v-model="tourForm.visaInfo" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Перелет
              <input v-model="tourForm.flightInfo" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700">Трансфер
              <input v-model="tourForm.transferInfo" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700 md:col-span-2">Условия отмены
              <input v-model="tourForm.cancellationPolicy" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <label class="text-sm font-semibold text-slate-700">Преимущества (по строкам)
              <textarea v-model="featuresText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700">Включено (по строкам)
              <textarea v-model="includedText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700">Не включено (по строкам)
              <textarea v-model="notIncludedText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700">Программа (по строкам)
              <textarea v-model="itineraryText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700">Важная информация (по строкам)
              <textarea v-model="importantNotesText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700">FAQ (по строкам)
              <textarea v-model="faqText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700 md:col-span-2 2xl:col-span-3">Ссылки на фото галереи (по строкам)
              <textarea v-model="galleryText" rows="4" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-semibold text-slate-700 md:col-span-2 2xl:col-span-3">Главное фото (URL)
              <input v-model="tourForm.heroImage" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>
            <label class="text-sm font-semibold text-slate-700 md:col-span-2 2xl:col-span-3">Вылеты (JSON массив)
              <textarea v-model="departuresJson" rows="8" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs" />
            </label>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white" type="submit">Сохранить тур</button>
            <button class="rounded-xl border border-rose-300 px-4 py-2 text-sm font-bold text-rose-700" type="button" @click="deleteTour">
              Удалить тур
            </button>
          </div>
        </form>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900">Новости</h2>
          <button class="rounded-xl bg-brand-dark px-3 py-2 text-xs font-bold text-white" @click="createNewsItem">+ Новость</button>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <article v-for="item in news" :key="item.id" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <input v-model="item.id" placeholder="id" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
            <input v-model="item.title" placeholder="Заголовок" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold">
            <textarea v-model="item.excerpt" rows="2" placeholder="Краткий текст" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm" />
            <input v-model="item.image" placeholder="URL картинки" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
            <input v-model="item.publishedAt" type="date" class="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs">
            <button class="rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="removeNews(item.id)">Удалить</button>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900">Управление пользователями</h2>
          <button class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700" @click="loadAdminUsers">Обновить список</button>
        </div>
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-left text-slate-600">
              <tr>
                <th class="px-3 py-2 font-bold">Имя</th>
                <th class="px-3 py-2 font-bold">Email</th>
                <th class="px-3 py-2 font-bold">Телефон</th>
                <th class="px-3 py-2 font-bold">Дата рождения</th>
                <th class="px-3 py-2 font-bold">Туры/Брони</th>
                <th class="px-3 py-2 font-bold">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminUsers" :key="user.id" class="border-t border-slate-100">
                <td class="px-3 py-2"><input v-model="user.name" class="w-44 rounded-lg border border-slate-300 px-2 py-1 text-sm"></td>
                <td class="px-3 py-2"><input v-model="user.email" class="w-56 rounded-lg border border-slate-300 px-2 py-1 text-sm"></td>
                <td class="px-3 py-2"><input v-model="user.phone" class="w-40 rounded-lg border border-slate-300 px-2 py-1 text-sm"></td>
                <td class="px-3 py-2"><input v-model="user.birthDate" type="date" class="w-36 rounded-lg border border-slate-300 px-2 py-1 text-sm"></td>
                <td class="px-3 py-2 text-xs text-slate-600">Сохранено: {{ user.savedCount }} · Брони: {{ user.bookingsCount }}</td>
                <td class="px-3 py-2">
                  <div class="flex gap-2">
                    <button class="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white" @click="saveAdminUser(user)">Сохранить</button>
                    <button class="rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="removeAdminUser(user.id)">Удалить</button>
                  </div>
                </td>
              </tr>
              <tr v-if="adminUsers.length === 0">
                <td colspan="6" class="px-3 py-6 text-center text-sm text-slate-500">Пользователи пока не зарегистрированы.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900">Бронирования и оплаты</h2>
          <button class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700" @click="loadAdminBookings">Обновить список</button>
        </div>
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-left text-slate-600">
              <tr>
                <th class="px-3 py-2 font-bold">ID / Тур</th>
                <th class="px-3 py-2 font-bold">Клиент</th>
                <th class="px-3 py-2 font-bold">Сумма</th>
                <th class="px-3 py-2 font-bold">Статусы</th>
                <th class="px-3 py-2 font-bold">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in adminBookings" :key="booking.id" class="border-t border-slate-100 align-top">
                <td class="px-3 py-2">
                  <p class="text-xs text-slate-500">{{ booking.id }}</p>
                  <p class="font-semibold text-slate-900">{{ booking.tourTitle }}</p>
                </td>
                <td class="px-3 py-2 text-xs text-slate-700">
                  <p>{{ booking.customerName }}</p>
                  <p>{{ booking.customerEmail }}</p>
                  <p>{{ booking.customerPhone }}</p>
                </td>
                <td class="px-3 py-2 font-semibold text-slate-900">${{ booking.totalUsd }}</td>
                <td class="px-3 py-2 text-xs text-slate-700">
                  <p>Заявка: <strong>{{ booking.status }}</strong></p>
                  <p>Оплата: <strong>{{ booking.paymentStatus }}</strong></p>
                  <p v-if="booking.refundAt" class="text-rose-700">Возврат: {{ formatDateTime(booking.refundAt) }}</p>
                </td>
                <td class="px-3 py-2">
                  <div class="grid gap-2">
                    <div class="flex flex-wrap gap-2">
                      <button class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700" @click="setBookingStatus(booking.id, 'Новый')">Новый</button>
                      <button class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700" @click="setBookingStatus(booking.id, 'В обработке')">В обработке</button>
                      <button class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700" @click="setBookingStatus(booking.id, 'Завершен')">Завершен</button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <button class="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white" @click="setBookingPayment(booking.id, 'Оплачено')">Отметить оплаченным</button>
                      <button class="rounded-lg border border-amber-300 px-2 py-1 text-xs font-bold text-amber-700" @click="setBookingPayment(booking.id, 'Не оплачено')">Снять оплату</button>
                      <button class="rounded-lg border border-rose-300 px-2 py-1 text-xs font-bold text-rose-700" @click="refundBooking(booking.id)">Возврат</button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="adminBookings.length === 0">
                <td colspan="5" class="px-3 py-6 text-center text-sm text-slate-500">Бронирований пока нет.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p class="min-h-5 text-sm font-semibold" :class="statusOk ? 'text-emerald-700' : 'text-rose-700'">{{ statusMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  DestinationItem,
  FooterSettings,
  NewsItem,
  ReviewItem,
  SiteContent,
  SiteSettings,
  TourPackage,
  WhyUsItem
} from '~/types/tour'

interface AdminUserItem {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  createdAt: string
  updatedAt: string
  savedCount: number
  bookingsCount: number
}

interface AdminBookingItem {
  id: string
  tourTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalUsd: number
  status: string
  paymentStatus: string
  refundAt: string
}

definePageMeta({
  layout: 'admin'
})

const authenticated = ref(false)
const loading = ref(false)
const password = ref('')
const errorMessage = ref('')
const statusMessage = ref('')
const statusOk = ref(true)

const settings = reactive<SiteSettings>({
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  aboutTitle: '',
  aboutText: ''
})
const footer = reactive<FooterSettings>({
  supportTitle: '',
  supportShortNumber: '',
  supportPhone: '',
  supportEmail: '',
  infoTitle: '',
  infoLinks: [],
  mediaTitle: '',
  mediaLinks: [],
  partnersTitle: '',
  partnersLinks: [],
  socialsTitle: '',
  socials: [],
  copyright: ''
})

const tours = ref<TourPackage[]>([])
const news = ref<NewsItem[]>([])
const destinations = ref<DestinationItem[]>([])
const reviews = ref<ReviewItem[]>([])
const whyUs = ref<WhyUsItem[]>([])
const adminUsers = ref<AdminUserItem[]>([])
const adminBookings = ref<AdminBookingItem[]>([])
const updatedAt = ref('')

const selectedTourId = ref('')
const tourForm = ref<TourPackage | null>(null)

const featuresText = ref('')
const includedText = ref('')
const notIncludedText = ref('')
const itineraryText = ref('')
const importantNotesText = ref('')
const faqText = ref('')
const galleryText = ref('')
const departuresJson = ref('[]')
const infoLinksText = ref('')
const mediaLinksText = ref('')
const partnersLinksText = ref('')
const socialsText = ref('')

const parseLines = (value: string): string[] =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

const toLines = (items: string[]): string => items.join('\n')
const toSocialLines = (items: FooterSettings['socials']): string => items.map((item) => `${item.label}|${item.href}`).join('\n')
const parseSocialLines = (value: string): FooterSettings['socials'] =>
  value
    .split('\n')
    .map((line, index) => {
      const [labelPart, hrefPart] = line.split('|')
      const label = String(labelPart ?? '').trim()
      const href = String(hrefPart ?? '').trim()

      return {
        id: `social-${index + 1}`,
        label: label || `Ссылка ${index + 1}`,
        href: href || '#'
      }
    })
    .filter((item) => item.label.length > 0)

const formatDateTime = (raw: string): string => {
  if (!raw) {
    return '-'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(raw))
}

const updatedAtLabel = computed(() => formatDateTime(updatedAt.value))

function clonePlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const makeEmptyTour = (): TourPackage => ({
  id: `tour-${Date.now()}`,
  title: 'Новый тур',
  badge: 'New',
  country: '',
  city: '',
  description: '',
  shortDescription: '',
  features: [],
  included: [],
  notIncluded: [],
  itinerary: [],
  heroImage: '',
  gallery: [],
  durationNights: 1,
  hotelClass: '',
  availableFrom: '',
  availableTo: '',
  departures: [],
  priceFromUsd: 0,
  bestFor: '',
  visaInfo: '',
  flightInfo: '',
  transferInfo: '',
  cancellationPolicy: '',
  importantNotes: [],
  faq: []
})

const applyTourToForm = (tour: TourPackage): void => {
  tourForm.value = clonePlain(tour)
  featuresText.value = toLines(tour.features)
  includedText.value = toLines(tour.included)
  notIncludedText.value = toLines(tour.notIncluded)
  itineraryText.value = toLines(tour.itinerary)
  importantNotesText.value = toLines(tour.importantNotes ?? [])
  faqText.value = toLines(tour.faq ?? [])
  galleryText.value = toLines(tour.gallery)
  departuresJson.value = JSON.stringify(tour.departures, null, 2)
}

const selectTour = (id: string): void => {
  selectedTourId.value = id
  const tour = tours.value.find((item) => item.id === id)
  if (tour) {
    applyTourToForm(tour)
  }
}

const createNewTour = (): void => {
  const tour = makeEmptyTour()
  tours.value.unshift(tour)
  selectTour(tour.id)
}

const createNewsItem = (): void => {
  news.value.unshift({
    id: `news-${Date.now()}`,
    title: 'Новая новость',
    excerpt: '',
    image: '',
    publishedAt: new Date().toISOString().slice(0, 10)
  })
}

const removeNews = (id: string): void => {
  news.value = news.value.filter((item) => item.id !== id)
}

const createDestination = (): void => {
  destinations.value.unshift({
    id: `destination-${Date.now()}`,
    title: 'Новое направление',
    tagline: '',
    image: '',
    linkedTourId: '',
    description: ''
  })
}

const removeDestination = (id: string): void => {
  destinations.value = destinations.value.filter((item) => item.id !== id)
}

const createReview = (): void => {
  reviews.value.unshift({ id: `review-${Date.now()}`, author: 'Имя клиента', text: 'Текст отзыва' })
}

const removeReview = (id: string): void => {
  reviews.value = reviews.value.filter((item) => item.id !== id)
}

const createWhyUs = (): void => {
  whyUs.value.unshift({
    id: `why-${Date.now()}`,
    title: 'Новый пункт',
    description: '',
    icon: '⭐'
  })
}

const removeWhyUs = (id: string): void => {
  whyUs.value = whyUs.value.filter((item) => item.id !== id)
}

const loadAdminUsers = async (): Promise<void> => {
  const response = await $fetch<{ users: AdminUserItem[] }>('/api/admin/users')
  adminUsers.value = response.users
}

const loadAdminBookings = async (): Promise<void> => {
  const response = await $fetch<{ bookings: AdminBookingItem[] }>('/api/admin/bookings')
  adminBookings.value = response.bookings
}

const saveAdminUser = async (user: AdminUserItem): Promise<void> => {
  try {
    await $fetch('/api/admin/users', {
      method: 'PUT',
      body: {
        action: 'update',
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate
      }
    })
    statusOk.value = true
    statusMessage.value = `Пользователь ${user.email} обновлен.`
    await loadAdminUsers()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось обновить пользователя.')
  }
}

const removeAdminUser = async (userId: string): Promise<void> => {
  try {
    await $fetch('/api/admin/users', {
      method: 'PUT',
      body: { action: 'delete', id: userId }
    })
    statusOk.value = true
    statusMessage.value = 'Пользователь удален.'
    await loadAdminUsers()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось удалить пользователя.')
  }
}

const setBookingStatus = async (bookingId: string, status: string): Promise<void> => {
  try {
    await $fetch('/api/admin/bookings', {
      method: 'PATCH',
      body: { action: 'setStatus', bookingId, status }
    })
    statusOk.value = true
    statusMessage.value = `Статус заявки обновлен: ${status}.`
    await loadAdminBookings()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось обновить статус заявки.')
  }
}

const setBookingPayment = async (bookingId: string, paymentStatus: 'Не оплачено' | 'Оплачено'): Promise<void> => {
  try {
    await $fetch('/api/admin/bookings', {
      method: 'PATCH',
      body: { action: 'setPaymentStatus', bookingId, paymentStatus }
    })
    statusOk.value = true
    statusMessage.value = `Платежный статус изменен: ${paymentStatus}.`
    await loadAdminBookings()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось обновить оплату.')
  }
}

const refundBooking = async (bookingId: string): Promise<void> => {
  try {
    await $fetch('/api/admin/bookings', {
      method: 'PATCH',
      body: {
        action: 'refund',
        bookingId,
        refundReason: 'Оформлено администратором'
      }
    })
    statusOk.value = true
    statusMessage.value = 'Возврат оформлен.'
    await loadAdminBookings()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось оформить возврат.')
  }
}

const loadContent = async (): Promise<void> => {
  const content = await $fetch<SiteContent>('/api/admin/content')

  Object.assign(settings, content.settings)
  Object.assign(footer, content.footer)
  infoLinksText.value = toLines(content.footer.infoLinks)
  mediaLinksText.value = toLines(content.footer.mediaLinks)
  partnersLinksText.value = toLines(content.footer.partnersLinks)
  socialsText.value = toSocialLines(content.footer.socials)
  tours.value = content.tours
  news.value = content.news
  destinations.value = content.destinations
  reviews.value = content.reviews
  whyUs.value = content.whyUs
  updatedAt.value = content.updatedAt

  const firstTour = tours.value[0]
  if (firstTour) {
    selectTour(selectedTourId.value || firstTour.id)
  }

  await Promise.all([loadAdminUsers(), loadAdminBookings()])
}

const saveAll = async (): Promise<void> => {
  try {
    footer.infoLinks = parseLines(infoLinksText.value)
    footer.mediaLinks = parseLines(mediaLinksText.value)
    footer.partnersLinks = parseLines(partnersLinksText.value)
    footer.socials = parseSocialLines(socialsText.value)

    const response = await $fetch<{ ok: boolean; content: SiteContent }>('/api/admin/content', {
      method: 'PUT',
      body: {
        settings,
        footer,
        tours: tours.value,
        news: news.value,
        destinations: destinations.value,
        reviews: reviews.value,
        whyUs: whyUs.value
      }
    })

    Object.assign(settings, response.content.settings)
    Object.assign(footer, response.content.footer)
    infoLinksText.value = toLines(response.content.footer.infoLinks)
    mediaLinksText.value = toLines(response.content.footer.mediaLinks)
    partnersLinksText.value = toLines(response.content.footer.partnersLinks)
    socialsText.value = toSocialLines(response.content.footer.socials)
    tours.value = response.content.tours
    news.value = response.content.news
    destinations.value = response.content.destinations
    reviews.value = response.content.reviews
    whyUs.value = response.content.whyUs
    updatedAt.value = response.content.updatedAt
    statusOk.value = true
    statusMessage.value = 'Данные успешно сохранены.'
  } catch (error) {
    statusOk.value = false
    statusMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить изменения.'
  }
}

const saveTour = async (): Promise<void> => {
  if (!tourForm.value) {
    return
  }

  try {
    const parsedDepartures = JSON.parse(departuresJson.value)

    tourForm.value.features = parseLines(featuresText.value)
    tourForm.value.included = parseLines(includedText.value)
    tourForm.value.notIncluded = parseLines(notIncludedText.value)
    tourForm.value.itinerary = parseLines(itineraryText.value)
    tourForm.value.importantNotes = parseLines(importantNotesText.value)
    tourForm.value.faq = parseLines(faqText.value)
    tourForm.value.gallery = parseLines(galleryText.value)
    tourForm.value.departures = Array.isArray(parsedDepartures) ? parsedDepartures : []

    const idx = tours.value.findIndex((item) => item.id === selectedTourId.value)
    if (idx >= 0) {
      tours.value[idx] = clonePlain(tourForm.value)
    } else {
      tours.value.unshift(clonePlain(tourForm.value))
    }

    selectedTourId.value = tourForm.value.id
    await saveAll()
  } catch {
    statusOk.value = false
    statusMessage.value = 'Проверьте JSON в поле "Вылеты".'
  }
}

const deleteTour = async (): Promise<void> => {
  if (!tourForm.value) {
    return
  }

  tours.value = tours.value.filter((item) => item.id !== tourForm.value?.id)

  const firstTour = tours.value[0]
  if (firstTour) {
    selectTour(firstTour.id)
  } else {
    tourForm.value = null
    selectedTourId.value = ''
  }

  await saveAll()
}

const login = async (): Promise<void> => {
  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value }
    })

    authenticated.value = true
    password.value = ''
    await loadContent()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ошибка входа'
  } finally {
    loading.value = false
  }
}

const logout = async (): Promise<void> => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  authenticated.value = false
  adminUsers.value = []
  adminBookings.value = []
}

const bootstrap = async (): Promise<void> => {
  const session = await $fetch<{ authenticated: boolean }>('/api/admin/session')
  authenticated.value = session.authenticated

  if (authenticated.value) {
    await loadContent()
  }
}

await bootstrap()
</script>

<style scoped>
.admin-full-width {
  min-height: calc(100vh - 1px);
  min-width: 100vw !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

.admin-full-width > * {
  width: 100% !important;
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
