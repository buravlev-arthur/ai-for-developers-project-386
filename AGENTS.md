# Проект: "Календарь событий"

Это календарь событий - проект, где гости могут бронировать время события. А один единственный владелец календаря может создавать типы событий и просматривать в календаре созданные брони гостей.

OpenAPI-спецификация хранится в: `docs/openapi.yaml`.
Исходные файлы TypeSpec-спецификации и API-контракта хранятся в: `api/main.tsp`.

## Фронтенд

Фронтенд-часть расположена в директории `client/`.

### Структура

```
client/
├── public/
│   └── mockServiceWorker.js   # MSW Service Worker (генер. npx msw init)
├── src/
│   ├── api/                   # Слой работы с API
│   │   ├── client.ts          # axios-инстанс (baseURL: /api)
│   │   ├── endpoints.ts       # Функции для каждого эндпоинта
│   │   └── types.ts           # TypeScript-интерфейсы (из openapi.yaml)
│   ├── components/            # Переиспользуемые компоненты
│   │   ├── AppHeader.tsx      # Шапка с логотипом CalMe и навигацией
│   │   ├── GuestLayout.tsx    # Layout для гостевой страницы (AppHeader + контент)
│   │   └── OwnerLayout.tsx    # Layout панели владельца (AppHeader + Sider)
│   ├── mocks/                 # MSW-заглушки
│   │   ├── browser.ts         # Инициализация MSW worker
│   │   └── handlers.ts        # Хендлеры на все эндпоинты API
│   ├── pages/                 # Страницы приложения
│   │   ├── OwnerCalendarPage.tsx    # Календарь с бронями (владелец)
│   │   ├── EventTypesPage.tsx       # CRUD типов событий (владелец)
│   │   ├── HomePage.tsx              # Приветственная страница (гость)
│   │   └── GuestBookingPage.tsx     # Бронирование времени (гость)
│   ├── App.tsx                # Роутинг (React Router)
 │   ├── main.tsx               # Точка входа (инициализация MSW + React)
 │   ├── index.css              # Глобальные стили (сброс body margin)
 │   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Команды

```bash
# Запуск dev-сервера фронтенда
npm run client:dev

# Сборка фронтенда
npm run client:build
```

### Стек технологий

- Основная фронтенд-библиотека: **React 18+**;
- Ротутер: **React Router 7+**;
- Типизация: **TypeScript**;
- Сборщик: **Vite**;
- Библиотека **Day.js**;
- UI-библиотека **Ant Design (antd)**;
- Mock-сервис: **MSW (Mock Service Worker)**;
- Работа с API-запросами: **axios**.
