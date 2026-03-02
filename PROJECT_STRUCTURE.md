# Структура проекта — Портфолио Константина Илюхина

## Дерево файлов

```
/
├── index.html                  Единственная HTML-страница
├── package.json                npm-конфигурация, скрипты dev/build/preview
├── vite.config.js              Конфигурация сборщика Vite
├── TECH_STACK.md               Описание технического стека
├── PROJECT_STRUCTURE.md        Этот файл
│
├── src/
│   ├── styles/
│   │   ├── main.css            Точка входа CSS: импорты, reset, base-стили
│   │   ├── variables.css       Дизайн-токены: цвета, отступы, типографика, сетка
│   │   ├── hero.css            Стили Hero-секции
│   │   ├── cases.css           Стили кейс-блоков (тип A и B)
│   │   ├── gallery.css         Стили полноэкранной галереи
│   │   └── nav.css             Стили sticky-навигации
│   │
│   ├── js/
│   │   ├── main.js             Точка входа JS: инициализация всех модулей
│   │   ├── ascii-glitch.js     Модуль глитч-эффекта ASCII-арта
│   │   ├── gallery.js          Модуль полноэкранной галереи
│   │   └── sticky-nav.js       Модуль sticky-навигации
│   │
│   ├── data/
│   │   └── cases.json          Контент всех кейсов (тексты, ссылки, пути к картинкам)
│   │
│   └── assets/
│       └── images/             Изображения проектов (WebP/AVIF)
│
├── public/                     (планируется) Статика: favicon.svg, og.png, шрифты
│
└── dist/                       Результат сборки (генерируется `npm run build`)
    ├── index.html
    └── assets/
        ├── index-*.css         Минифицированный CSS (~1.8 KB gzip)
        └── index-*.js          Минифицированный JS (~1.13 KB gzip)
```

---

## Корневые файлы

### `index.html`

Единственная HTML-страница сайта. Содержит:

- **`<head>`** — мета-теги (charset, viewport, description), Open Graph (og:title, og:description, og:image), favicon, подключение CSS
- **`<nav class="sticky-nav">`** — sticky-навигация, скрыта атрибутом `hidden` до инициализации JS
- **`<section class="hero">`** — Hero-секция с тремя зонами: left, center, right
- **`<div id="cases">`** — контейнер, в который JS рендерит кейс-блоки из `cases.json`
- **`<div class="gallery">`** — полноэкранная галерея (overlay), скрыта через `aria-hidden="true"`
- **`<script type="module">`** — подключение JS через ES-модули

Разметка Hero-секции построена по данным из Figma-макета:
- Левая колонка: вертикальный декоративный элемент из юникод-символов, подпись «Lead Product Designer», ссылки PDF и TG
- Центральная колонка: имя «константин илюхин», декоративные слэши, описание, разделитель, индикатор скролла ▽
- Правая половина: акцентная полоса, два слоя ASCII-арта (подставляются из JS)

### `package.json`

Единственная зависимость — Vite. Скрипты:
- `npm run dev` — локальный dev-сервер с HMR
- `npm run build` — продакшн-сборка в `dist/`
- `npm run preview` — превью собранной версии

### `vite.config.js`

Минимальная конфигурация:
- `root: '.'` — корень проекта
- `build.outDir: 'dist'` — выходная папка
- `server.open: true` — автооткрытие браузера при `npm run dev`

---

## CSS (`src/styles/`)

Все стили — чистый CSS без препроцессоров. Vite склеивает и минифицирует при сборке.

### `main.css` — точка входа

Порядок импортов:
1. `variables.css` — токены
2. `nav.css` — навигация
3. `hero.css` — Hero-секция
4. `cases.css` — кейс-блоки
5. `gallery.css` — галерея

Содержит:
- **CSS reset** — обнуление margin/padding, border-box
- **Base-стили** — body (шрифт, цвет фона, сглаживание), ссылки, изображения
- **`body.gallery-open`** — блокирует скролл страницы при открытой галерее (`overflow: hidden`)
- **`prefers-reduced-motion`** — отключает все анимации для пользователей с соответствующей настройкой ОС

### `variables.css` — дизайн-токены

Все значения — CSS Custom Properties в `:root`.

**Цвета** (извлечены из Figma-макета):
| Токен | Значение | Роль |
|---|---|---|
| `--c-bg` | `#0D0C0D` | Фон (почти чёрный) |
| `--c-accent` | `#DEF511` | Акцент (кислотный жёлто-зелёный) |
| `--c-muted` | `#646364` | Вторичный (тёмно-серый) |
| `--c-text` | `#FFFFFF` | Текст (белый) |

**Отступы** (шкала на основе 8px, fluid через `clamp()`):
`--space-xs` (4–8px) → `--space-s` (8–16px) → `--space-m` (16–32px) → `--space-l` (32–64px) → `--space-xl` (48–96px) → `--space-2xl` (64–128px)

**Сетка**:
- `--grid-margin` — внешние отступы контейнера (16–45px)
- `--grid-gap` — расстояние между колонками (8–18px)

**Типографика** (fluid через `clamp()`):
Шкала от `--text-xs` (10–12px) до `--text-hero` (40–112px). Два font-stack: `--font-family` (системный sans-serif) и `--font-mono` (Courier New).

**Анимации**:
- `--ease-out` — кривая cubic-bezier(0.25, 0, 0.25, 1)
- Длительности: `--duration-fast` (150ms), `--duration-normal` (300ms), `--duration-slow` (600ms)

**Z-index**: `--z-nav` (100), `--z-gallery` (200)

### `hero.css` — Hero-секция

Сетка: `grid-template-columns: var(--grid-margin) 1fr 1fr var(--grid-margin)` — четырёхколоночная, с margin-колонками по краям.

- `.hero__left` — занимает колонки 1–3, содержит вертикальный декор (`writing-mode: vertical-lr`), роль, ссылки
- `.hero__center` — колонка 2, flex-column с gap: имя, слэши, описание, разделитель, индикатор скролла
- `.hero__right` — колонки 3–4, position: relative для абсолютно спозиционированной акцентной полосы и ASCII-арта
- `.hero__ascii-art` — моноширинный шрифт, `white-space: pre`, fluid font-size (0.15–0.3rem)

**Адаптив (≤800px)**: перестраивается в одну колонку, три строки (left → center → right)

### `cases.css` — кейс-блоки

Та же четырёхколоночная сетка. Два типа лейаута:
- **Тип A** (`.case-section`) — текст слева (колонка 2), изображение справа (колонка 3)
- **Тип B** (`.case-section--alt`) — зеркально: изображение слева, текст справа

Изображение кликабельное (`cursor: pointer`), при hover — `scale(1.02)`.

**Адаптив (≤800px)**: одна колонка, текст сверху, изображение на всю ширину снизу.

### `gallery.css` — полноэкранная галерея

- `position: fixed; inset: 0` — полноэкранный overlay
- По умолчанию сдвинута за правый край (`transform: translateX(100%)`)
- При `aria-hidden="false"` — выезжает на экран с CSS-transition (600ms)
- `.gallery__track` — горизонтальный flex-контейнер с `scroll-snap-type: x mandatory` и скрытым скроллбаром
- `.gallery__slide` — `scroll-snap-align: center`, изображения масштабируются по высоте (`max-height: 80vh`)

### `nav.css` — sticky-навигация

- `position: fixed; top: 0` — фиксирована сверху
- По умолчанию скрыта за верхний край (`transform: translateY(-100%)`)
- Класс `.is-visible` — выдвигает на экран (`translateY(0)`)
- Transition: 300ms

---

## JavaScript (`src/js/`)

Все модули — ES Modules, без зависимостей. Точка входа `main.js` импортирует и инициализирует три модуля по событию `DOMContentLoaded`.

### `main.js` — точка входа

Импортирует `initAsciiGlitch`, `initGallery`, `initStickyNav` и вызывает их при загрузке DOM.

### `ascii-glitch.js` — глитч-эффект ASCII-арта

**Состояние**: массив `ASCII_FRAMES` (текстовые фреймы), индекс текущего фрейма, ссылка на DOM-контейнер.

**Логика**:
1. Находит `.hero__ascii-art`
2. Загружает фреймы (TODO: источник данных — файлы из `src/data/`)
3. Показывает первый фрейм
4. Каждые 4 секунды (`FRAME_INTERVAL`) запускает смену: добавляет CSS-класс `glitching`, через 150ms (`GLITCH_DURATION`) подставляет текст следующего фрейма и снимает класс

**Экспорт**: `initAsciiGlitch()`

### `gallery.js` — полноэкранная галерея

**Открытие** (`openGallery(images)`):
1. Очищает трек
2. Создаёт слайды (`div.gallery__slide > img`) для каждого URL из массива
3. Переключает `aria-hidden` на `false`
4. Добавляет `body.gallery-open` (блокирует скролл страницы)
5. Фокусирует кнопку закрытия

**Закрытие** (`closeGallery()`):
- `aria-hidden="true"`, снимает `body.gallery-open`

**Привязка событий**:
- Клик по `.gallery__close` → закрыть
- Клик по оверлею (фону) → закрыть
- Клавиша Escape → закрыть
- Делегированный клик по `.case-section__screens` → прочитать `data-gallery`, распарсить JSON, открыть галерею

**Экспорт**: `initGallery()`

### `sticky-nav.js` — sticky-навигация

**Логика**: паттерн «show on scroll up, hide on scroll down».

Два механизма:
1. **IntersectionObserver** на `#hero` (threshold: 0.1) — определяет, видна ли Hero-секция. Если да — навигация всегда скрыта.
2. **Scroll listener** (passive) — сравнивает текущий `scrollY` с предыдущим. Если скролл вверх и Hero не видна — класс `is-visible`. Если скролл вниз — класс снимается.

**Экспорт**: `initStickyNav()`

---

## Данные (`src/data/`)

### `cases.json`

Массив объектов, каждый описывает один кейс:

```json
{
  "id": "case-1",
  "type": "a",            // "a" — стандартный лейаут, "b" — альтернативный (зеркальный)
  "title": "...",
  "description": "...",
  "links": [
    { "label": "Behance", "url": "https://..." }
  ],
  "preview": "/src/assets/images/case-1-preview.webp",
  "gallery": [
    "/src/assets/images/case-1-01.webp",
    "/src/assets/images/case-1-02.webp"
  ]
}
```

Сейчас содержит 6 заглушек (5 типа A, 1 типа B). Заполнится реальным контентом по макетам Figma.

---

## Ассеты (`src/assets/`)

### `images/`

Пока пуста. Сюда пойдут оптимизированные изображения кейсов в формате WebP/AVIF. Именование: `case-{N}-preview.webp` (превью), `case-{N}-{NN}.webp` (слайды галереи).

---

## Сборка (`dist/`)

Генерируется командой `npm run build`. Содержит:
- `index.html` — с инлайн-ссылками на хешированные ассеты
- `assets/index-*.css` — один минифицированный CSS-файл (~6.2 KB / ~1.8 KB gzip)
- `assets/index-*.js` — один минифицированный JS-файл (~2.6 KB / ~1.1 KB gzip)

Папка `dist/` целиком копируется на сервер при деплое.

---

## Именование CSS-классов

Используется методология **BEM**:
- Блок: `.hero`, `.case-section`, `.gallery`, `.sticky-nav`
- Элемент: `.hero__name`, `.gallery__track`, `.sticky-nav__inner`
- Модификатор: `.case-section--alt`, `.sticky-nav.is-visible`

Состояния управляются через:
- CSS-классы (`is-visible`, `glitching`, `gallery-open`)
- ARIA-атрибуты (`aria-hidden="true/false"`)

---

## Потоки данных

```
cases.json
    ↓  (JS читает при загрузке)
main.js → рендерит секции в #cases
    ↓
Клик по .case-section__screens
    ↓  (читает data-gallery атрибут)
gallery.js → открывает галерею с нужными изображениями
```

```
Скролл страницы
    ↓
sticky-nav.js → IntersectionObserver (Hero видна?)
              → scroll listener (направление?)
              → toggleClass('is-visible')
```

```
setInterval (4с)
    ↓
ascii-glitch.js → addClass('glitching')
               → 150ms → подмена текста → removeClass('glitching')
```
