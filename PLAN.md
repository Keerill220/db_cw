# PLAN.md — Інформаційна система для бронювання музичних студій та репетиційних баз

> Курсова робота з дисципліни «Бази даних», ПЗ-34. Виконавець: Пономаренко К. В.
>
> Цей документ — єдиний контракт реалізації для агентів **Backend Implementer** (`Back/`) та **Frontend Implementer** (`Front/`). Усі рішення нижче відповідають вимогам `Description.pdf`, `Task.docx` та схемі `uml.jpeg`.

---

## 0. Структура репозиторію

```
db_cw/
├── Back/                         # ASP.NET Core 8 Web API (StudioBooking.Api)
├── Front/                        # React 18 + Vite + TS SPA
├── .github/agents/               # Документація, моки, агентські інструкції
│   ├── Docs/                     # Task.docx, Description.pdf, uml.jpeg, Etalon.md
│   └── Mocks/Create wireframes for pages/   # Figma-моки (тільки як референс)
├── PLAN.md                       # Цей файл
└── README.md
```

---

## 1. Технічний стек

### Backend (`Back/StudioBooking.Api`)
- .NET 8, ASP.NET Core Web API
- EF Core 8 + `Npgsql.EntityFrameworkCore.PostgreSQL`
- PostgreSQL (нова БД `studio_booking`, поряд з уже існуючою на `localhost:5432`)
- JWT-автентифікація (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- BCrypt.Net-Next для хешування паролів
- FluentValidation для DTO-валідації
- Serilog (опц.) або вбудований `ILogger`
- Swashbuckle (Swagger UI) у Development

### Frontend (`Front/`)
- React 18 + TypeScript (strict)
- Vite 6, Tailwind CSS v4
- react-router v7
- Radix UI primitives + shadcn-style обгортки + lucide-react
- Axios + інтерцептор для JWT
- react-hook-form + zod
- recharts (графіки), sonner (toasts), date-fns

---

## 2. Архітектура backend (детально)

Один проект `StudioBooking.Api` з чітким N-шаровим розбиттям по теках. Залежності йдуть **тільки вниз** і **тільки через інтерфейси**:

```
Controllers → Services (Interfaces) → Repositories (Interfaces) → ApplicationDbContext → PostgreSQL
                       ↘ Mappers / Validators / Auth / Common ↙
```

### Структура тек
```
Back/StudioBooking.Api/
├── Controllers/
│   ├── AuthController.cs
│   ├── StudiosController.cs
│   ├── RoomsController.cs
│   ├── BookingsController.cs
│   ├── EquipmentController.cs
│   ├── AdminController.cs
│   └── ReportsController.cs
├── Services/
│   ├── Interfaces/  (IAuthService, IStudioService, IRoomService, IBookingService, IEquipmentService, IReportService, IPasswordHasher, IJwtTokenService)
│   ├── AuthService.cs
│   ├── StudioService.cs
│   ├── RoomService.cs
│   ├── BookingService.cs
│   ├── EquipmentService.cs
│   └── ReportService.cs
├── Repositories/
│   ├── Interfaces/  (IStudioRepository, IRoomRepository, IBookingRepository, IClientRepository, IAdministratorRepository, IEquipmentRepository)
│   └── *Repository.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   ├── Configurations/   (Fluent API per entity)
│   ├── Migrations/
│   ├── Seeders/          (DataSeeder.cs — 1000+ Clients, 1000+ Rooms, 1000+ Equipment, 1000+ Bookings)
│   └── Sql/              (triggers/procedures/indexes — застосовуються через MigrationBuilder.Sql)
│       ├── 001_indexes.sql
│       ├── 002_trigger_no_overlap.sql
│       ├── 003_trigger_calc_total_price.sql
│       ├── 004_trigger_equipment_price_snapshot.sql
│       ├── 005_trigger_updated_at.sql
│       └── 006_proc_occupancy_report.sql
├── Models/
│   └── Entities/   (Administrator, Studio, Room, Client, Equipment, Booking, BookingEquipment, City, EquipmentType)
├── DTOs/
│   ├── Auth/       (LoginRequest, RegisterRequest, AuthResponse)
│   ├── Studios/    (StudioDto, StudioDetailDto, StudioCreateDto, StudioUpdateDto)
│   ├── Rooms/      (RoomDto, RoomDetailDto, RoomCreateDto, ...)
│   ├── Bookings/   (BookingDto, BookingCreateDto, BookingItemDto)
│   ├── Equipment/  (EquipmentDto, EquipmentCreateDto, ...)
│   └── Common/     (PagedResult<T>, PageQuery, ProblemResponse)
├── Mappers/        (StudioMapper, RoomMapper, BookingMapper, ...)
├── Validators/     (FluentValidation: BookingCreateValidator, StudioCreateValidator, ...)
├── Auth/
│   ├── JwtTokenService.cs
│   ├── PasswordHasher.cs
│   ├── CurrentUser.cs / ICurrentUser.cs
│   └── Roles.cs    (constants: "superadmin", "owner", "client")
├── Common/
│   ├── Exceptions/ (NotFoundException, ConflictException, ValidationException, ForbiddenException)
│   ├── Pagination/
│   └── Constants/
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── appsettings.json
├── appsettings.Development.json   # gitignored — містить пароль БД
├── Program.cs
└── StudioBooking.Api.csproj
```

### Правила залежностей
- `Controllers/` приймають DTO, повертають DTO; ніколи не звертаються до `DbContext` напряму.
- `Services/` містять бізнес-логіку та координують транзакції; не знають про HTTP.
- `Repositories/` інкапсулюють усі LINQ/SQL-запити; повертають Entities або проєкції.
- `Models/Entities/` — EF Core моделі; нікуди не «протікають» вище `Services/`.
- DI: усі сервіси/репозиторії реєструються через інтерфейси у `Program.cs` (`AddScoped<IStudioService, StudioService>` тощо).

---

## 3. База даних

### 3.1. Підключення (КРИТИЧНО)
- На машині вже працює інша PostgreSQL-БД — **НЕ ЧІПАТИ**.
- Сервер: `localhost:5432`. Нова БД: **`studio_booking`**.
- Connection string у `appsettings.Development.json` (gitignored):
  ```
  Host=localhost;Port=5432;Database=studio_booking;Username=postgres;Password=<ask user>
  ```
- При першому запуску: `CREATE DATABASE studio_booking` (ідемпотентно через перевірку `pg_database`). **Заборонено** `DROP DATABASE`/`DROP SCHEMA public CASCADE` будь-якої іншої БД.

### 3.2. Сутності (з `uml.jpeg`)
7 основних із UML + 2 довідники для виконання вимоги «8–12 таблиць»:
1. `Administrator` (admin_id, email UNIQUE, password_hash, first_name, last_name, phone, role enum('owner','superadmin'), created_at, updated_at)
2. `Studio` (studio_id, admin_id FK, name, **city_id FK → City**, address, description, photo_url, is_active, created_at, updated_at)
3. `Room` (room_id, studio_id FK, name, area_sqm, price_per_hour, is_available, description, photo_url)
4. `Client` (client_id, email UNIQUE, password_hash, first_name, last_name, phone, created_at, updated_at)
5. `Equipment` (equipment_id, room_id FK, name, **type_id FK → EquipmentType**, condition, price_per_hour)
6. `Booking` (booking_id, client_id FK, room_id FK, date, start_time, end_time, total_price, status enum, created_at, note)
7. `BookingEquipment` (booking_equipment_id, booking_id FK, equipment_id FK, price_snapshot)
8. **`City`** (city_id, name UNIQUE, country) — довідник міст; задовольняє «довідники міст і країн» з `Description.pdf`.
9. **`EquipmentType`** (type_id, name UNIQUE, description) — довідник типів обладнання.

Всі таблиці у 3НФ. Жодна таблиця не має > 10 полів.

### 3.3. Індекси (3–5)
| Індекс | Таблиця/поля | Обґрунтування |
|---|---|---|
| `idx_studio_city_id` | `Studio(city_id)` | Фільтр студій за містом на `/studios` |
| `idx_room_studio_id` | `Room(studio_id)` | Запит «всі кімнати студії» на `/studios/:id` |
| `idx_booking_room_date` | `Booking(room_id, date)` | Перевірка вільних слотів і `BookingsListPage` |
| `idx_booking_client_id` | `Booking(client_id)` | «Мої бронювання» клієнта |
| `idx_equipment_room_id` | `Equipment(room_id)` | Виведення обладнання для кімнати |

### 3.4. Тригери / процедури (3–5)
1. **`trg_booking_no_overlap`** — `BEFORE INSERT/UPDATE` на `Booking`: перевіряє відсутність перетину інтервалів `[start_time, end_time)` для того ж `room_id` та `date` зі статусами `pending`/`confirmed`. Якщо є перетин — `RAISE EXCEPTION`.
2. **`trg_booking_calc_total_price`** — `BEFORE INSERT/UPDATE` на `Booking`: перераховує `total_price = (end_time-start_time у годинах) × Room.price_per_hour + COALESCE(Σ BookingEquipment.price_snapshot,0) × тривалість`.
3. **`trg_be_price_snapshot`** — `BEFORE INSERT` на `BookingEquipment`: якщо `price_snapshot IS NULL`, бере `Equipment.price_per_hour`.
4. **`trg_set_updated_at`** — `BEFORE UPDATE` на `Studio`, `Administrator`, `Client`: виставляє `updated_at = now()`.
5. **`sp_studio_occupancy_report(months int)`** — процедура: повертає завантаженість студій за останні N місяців (для `ReportsController`).

Скрипти зберігаються в `Data/Sql/` і застосовуються в EF-міграції через `migrationBuilder.Sql(File.ReadAllText(...))`.

### 3.5. Початкові дані (≥1000 записів у 3–5 таблицях)
Реалізовано у `DataSeeder.cs` (запускається після `Database.MigrateAsync()` якщо БД порожня):
- `City` ~ 30 записів (реальні українські міста + міжнародні).
- `EquipmentType` ~ 10 (Drums, Guitar Amp, Mic, Keyboard, Mixer, ...).
- `Administrator` ~ 50 (включно з `superadmin@local`).
- `Studio` ~ 200.
- `Room` **≥ 1000**.
- `Equipment` **≥ 1000**.
- `Client` **≥ 1000**.
- `Booking` **≥ 1000** (зі статусами та датами за останні 7 місяців → щоб звіти мали дані).
- `BookingEquipment` ~ 1500.

Дефолтний superadmin: `superadmin@local` / `Admin123!` — пароль виводиться в консоль після успішного сидингу.

### 3.6. Транзакції
Кожна багатокрокова операція обгортається у `DbContext.Database.BeginTransactionAsync()`. Приклади:
- Створення `Booking` + N `BookingEquipment` → одна транзакція.
- Видалення `Studio` → видалення Rooms/Equipment/Bookings (через `OnDelete(Cascade)` + перевірка активних бронювань) → одна транзакція.
- Реєстрація клієнта + видача JWT → одна транзакція (запис у `Client` + лог).

---

## 4. Ролі та авторизація

| Роль | Джерело | Доступ |
|---|---|---|
| `superadmin` | `Administrator.role='superadmin'` | Все: керує адміністраторами, усіма студіями, бачить системні звіти |
| `owner` | `Administrator.role='owner'` | Тільки **свої** студії/кімнати/обладнання та бронювання своїх кімнат |
| `client` | `Client` (окрема таблиця) | Свій профіль; перегляд каталогу; створення/скасування своїх бронювань |

JWT-claims: `sub` (admin_id або client_id), `role`, `email`, `account_type` (`admin` / `client`), `exp`.

Енд-поінти автентифікації:
- `POST /api/auth/login/client` — логін клієнта.
- `POST /api/auth/login/admin` — логін адміністратора (owner або superadmin).
- `POST /api/auth/register` — реєстрація **тільки клієнта**.
- Адміністраторів створює `superadmin` через `POST /api/admin/administrators`.

Авторизація на контролерах — `[Authorize(Roles = "...")]`. Перевірка «owner може тільки своє» — у сервісах через `ICurrentUser`.

---

## 5. REST API (контракт для frontend)

Всі списки повертають `PagedResult<T>`:
```json
{ "page": 1, "pageSize": 20, "total": 137, "data": [...] }
```

| Метод | Шлях | Роль | Опис |
|---|---|---|---|
| POST | `/api/auth/login/client` | public | Логін клієнта → JWT |
| POST | `/api/auth/login/admin` | public | Логін адміністратора → JWT |
| POST | `/api/auth/register` | public | Реєстрація клієнта |
| GET  | `/api/auth/me` | auth | Поточний користувач |
| GET  | `/api/cities` | public | Довідник міст |
| GET  | `/api/equipment-types` | public | Довідник типів обладнання |
| GET  | `/api/studios?page&pageSize&cityId&minPrice&maxPrice&q` | public | Каталог студій |
| GET  | `/api/studios/{id}` | public | Студія + кімнати |
| POST | `/api/studios` | owner, superadmin | Створити студію |
| PUT  | `/api/studios/{id}` | owner(own), superadmin | Оновити |
| DELETE | `/api/studios/{id}` | owner(own), superadmin | Видалити |
| GET  | `/api/rooms/{id}?date=YYYY-MM-DD` | public | Кімната + обладнання + зайняті слоти на дату |
| POST/PUT/DELETE | `/api/rooms[/{id}]` | owner(own studio), superadmin | CRUD |
| POST/PUT/DELETE | `/api/equipment[/{id}]` | owner(own room), superadmin | CRUD |
| POST | `/api/bookings` | client | Створити бронювання (сервер рахує `total_price`) |
| GET  | `/api/bookings/mine?page&pageSize&from&to&status` | client | Мої бронювання |
| GET  | `/api/bookings?page&pageSize&studioId&roomId&clientId&from&to&status` | owner, superadmin | Бронювання, що в зоні відповідальності |
| PATCH | `/api/bookings/{id}/cancel` | client(own), owner(own room), superadmin | Скасування |
| PATCH | `/api/bookings/{id}/confirm` | owner(own room), superadmin | Підтвердження |
| GET  | `/api/admin/administrators` | superadmin | Список адмінів |
| POST | `/api/admin/administrators` | superadmin | Створити owner/superadmin |
| GET  | `/api/reports/occupancy` | owner, superadmin | Завантаженість за останні 7 міс |
| GET  | `/api/reports/revenue` | owner, superadmin | Виручка за останні 7 міс |
| GET  | `/api/reports/top-rooms` | owner, superadmin | Топ кімнат |

Помилки → RFC 7807 `application/problem+json` (через `ExceptionHandlingMiddleware`).

---

## 6. Frontend — сторінки (з моків)

Маршрути беруться з `Mocks/.../src/app/routes.tsx`:

| Шлях | Сторінка | Доступ | Що робить |
|---|---|---|---|
| `/` | `HomePage` | public | Лендінг + KPI dashboard (для авторизованих) |
| `/studios` | `StudiosPage` | public | Список студій + фільтри (city, price, є вільні слоти) + пагінація |
| `/studios/:id` | `StudioDetailPage` | public | Інфо студії, перелік кімнат, обладнання, фото |
| `/booking` | `BookingPage` | client | Форма створення бронювання (room, date, start/end, equipment) |
| `/bookings` | `BookingsListPage` | client / owner / superadmin | Таблиця бронювань з фільтром по даті/статусу/студії |
| `/profile` | `ProfilePage` | будь-який авторизований | Свій профіль, зміна пароля |
| `/admin` | `AdminPage` | owner, superadmin | CRUD студій/кімнат/обладнання + графіки звітів (recharts) |
| `/login` | `LoginPage` | public | Один екран із вкладками «Я клієнт / Я адміністратор» |
| `/register` | `RegisterPage` | public | Реєстрація клієнта |

Структура `Front/src/`:
```
api/         (client.ts, types.ts, auth.ts, studios.ts, rooms.ts, bookings.ts, equipment.ts, reports.ts)
pages/       (HomePage.tsx, ...)
components/  (Layout, Navbar, RoleGuard, Pagination, DataTable, BookingForm, ...)
hooks/       (useAuth, usePaginatedQuery, useApi)
context/     (AuthContext.tsx)
lib/         (formatters, zod schemas, api error helpers)
styles/      (Tailwind globals)
```

---

## 7. Чек-лист відповідності `Description.pdf`

- [ ] 6–8 повʼязаних сутностей у предметній області (маємо 7 + 2 довідники = 9).
- [ ] Хоча б 1 сутність відповідає події з датою/часом і числовою метрикою → `Booking`.
- [ ] 3-рівнева клієнт-серверна архітектура з бізнес-логікою на сервері.
- [ ] ≥ 3 ролі: `superadmin`, `owner`, `client`.
- [ ] 8–12 таблиць (маємо 9), не більше 10 полів у таблиці.
- [ ] 3–5 тригерів/процедур (маємо 5).
- [ ] 3–5 індексів (маємо 5) з обґрунтуванням.
- [ ] Початкові дані ≥ 1000 у 3–5 таблицях (Rooms/Equipment/Clients/Bookings).
- [ ] CRUD з валідацією та повідомленнями про помилки в UI.
- [ ] Модульний інтерфейс (за сторінками).
- [ ] Табличне подання з фільтром за датою (`BookingsListPage`).
- [ ] Панель показників з переходом на повʼязані сторінки (`HomePage`/`AdminPage`).
- [ ] Аналітичні графіки з часовим діапазоном (`AdminPage`, recharts, останні 7 міс).
- [ ] Адаптація UI за роллю + JWT-автентифікація.
- [ ] Транзакції в багатокрокових операціях.
- [ ] Стабільна обробка помилок (ProblemDetails + toasts).

**Додаткова функція (на вибір — п. 9 з `Description.pdf`):** алгоритм планування — авто-підбір вільного слоту в кімнаті за тривалістю та бажаним діапазоном дати/часу (`POST /api/bookings/suggest-slot`).

---

## 8. Фази реалізації

### Phase 0 — Підготовка (узгодити з користувачем)
- [ ] Підтвердити пароль PostgreSQL.
- [ ] Підтвердити, що БД `studio_booking` відсутня або порожня.
- [ ] Підтвердити порти: backend `5200`, frontend `5173`.

### Phase 1 — Backend: фундамент
- [ ] `dotnet new webapi -n StudioBooking.Api -f net8.0` у `Back/`.
- [ ] Додати NuGet: EFCore.PostgreSQL, JwtBearer, BCrypt.Net-Next, FluentValidation, Swashbuckle.
- [ ] `Program.cs`: DI, EF, JWT, CORS, Swagger, ExceptionMiddleware.
- [ ] Створити Entities + Fluent API конфігурації + `ApplicationDbContext`.
- [ ] Перша міграція (без сидингу).

### Phase 2 — Backend: БД-логіка
- [ ] Скрипти у `Data/Sql/` (індекси, тригери, процедура звіту) + міграція що їх застосовує.
- [ ] `DataSeeder` з 1000+ записів.
- [ ] Прогнати `dotnet ef database update`, переконатись що тригери працюють (інтеграційний smoke-test).

### Phase 3 — Backend: Auth
- [ ] `IPasswordHasher`, `IJwtTokenService`, `ICurrentUser`.
- [ ] `AuthController` + `AuthService` + DTO + валідатори.
- [ ] Інтеграційні перевірки логіну для всіх 3 ролей.

### Phase 4 — Backend: каталог (read-only)
- [ ] `CitiesController`, `EquipmentTypesController`, `StudiosController` (GET), `RoomsController` (GET з вільними слотами).

### Phase 5 — Backend: бронювання
- [ ] `BookingsController` + `BookingService` (з транзакцією, перевіркою прав, розрахунком total_price на сервері).
- [ ] Скасування/підтвердження.

### Phase 6 — Backend: адмін-CRUD
- [ ] CRUD для Studios/Rooms/Equipment з перевіркою «owner лише своє».
- [ ] `POST /api/admin/administrators` для superadmin.

### Phase 7 — Backend: звіти
- [ ] `ReportsController` (occupancy, revenue, top-rooms за 7 міс) — викликає процедуру/aggregate.

### Phase 8 — Frontend: фундамент
- [ ] `pnpm create vite Front --template react-ts`.
- [ ] Tailwind v4, Radix, lucide, react-router 7, axios, react-hook-form, zod, recharts, sonner, date-fns.
- [ ] `vite.config.ts` proxy `/api → http://localhost:5200`.
- [ ] Перенести `Layout` та базові UI-компоненти з моків.
- [ ] `AuthContext`, `RoleGuard`, axios interceptor з токеном `sb_token`.

### Phase 9 — Frontend: auth + каталог
- [ ] LoginPage, RegisterPage, StudiosPage, StudioDetailPage.

### Phase 10 — Frontend: бронювання
- [ ] BookingPage (форма + перевірка слотів), BookingsListPage (таблиця з фільтрами, пагінація).

### Phase 11 — Frontend: profile + admin
- [ ] ProfilePage, AdminPage (CRUD таблиці + recharts звіти).

### Phase 12 — Frontend: home + полірування
- [ ] HomePage з KPI dashboard, що лінкується на сторінки.
- [ ] Loading skeletons, toasts, обробка 401/403/422.

### Phase 13 — Інтеграція та перевірка
- [ ] E2E smoke: реєстрація клієнта → бронювання → скасування → звіт у superadmin.
- [ ] Перевірка чек-листа з §7.

---

## 9. Команди запуску (dev)

```bash
# Backend
cd Back/StudioBooking.Api
dotnet ef database update
dotnet run                # http://localhost:5200, Swagger: /swagger

# Frontend
cd Front
pnpm install
pnpm dev                  # http://localhost:5173
```

Default креденшли після сидингу (вивести в консолі):
- superadmin: `superadmin@local` / `Admin123!`
- демо-owner: `owner@local` / `Owner123!`
- демо-client: `client@local` / `Client123!`
