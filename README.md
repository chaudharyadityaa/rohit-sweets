# ROHIT SWEETS — Online Ordering Platform

A real-world online ordering website for ROHIT SWEETS, a local sweet shop in Baraut, Uttar Pradesh. Customers browse sweets, add to cart, check out, and send their order to the shop via WhatsApp. The shop owner manages products and orders through a password-protected admin panel.

**Live site:** https://rohit-sweets.netlify.app
**Admin panel:** https://rohit-sweets.netlify.app/admin/login

## Business workflow

CUSTOMER
↓
Visits website → Browses sweets → Adds to cart → Checkout
↓
Order saved in database, gets a real order number (RS-1001, RS-1002, ...)
↓
WhatsApp opens with the order pre-filled
↓
Customer sends the message to ROHIT SWEETS
↓
Shop sees the order on WhatsApp AND in the admin dashboard
↓
Shop updates order status as it's prepared and delivered
↓
Customer pays Cash on Delivery


## Tech stack

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Hosted on Netlify (free tier)

**Backend**
- Java 21 + Spring Boot (modular monolith, no microservices)
- Spring Security + JWT authentication
- Spring Data JPA + Flyway migrations
- Hosted on Railway (free tier)

**Database**
- PostgreSQL, hosted on Neon (free tier)

**Other**
- BCrypt password hashing
- Bucket4j rate limiting (login + order creation)
- WhatsApp click-to-chat (`wa.me`) — no paid WhatsApp Business API used
- No paid APIs anywhere in this project (maps, SMS, AI, payments)

## Features

### Customer-facing
- Browse sweets by category, search by name
- Product detail pages with quantity selection
- Cart persisted in the browser (survives refresh)
- Checkout with delivery-distance band selection (0–3 / 3–5 / 5–7 km)
- Server-calculated pricing — the frontend never decides the final price
- WhatsApp order handoff with a real, sequential order number
- Mobile-first responsive design

### Admin panel (JWT-protected)
- Dashboard: today's orders, status breakdown, today's sales
- Product management: add, edit, toggle availability, soft-delete, restore
- Order management: search, filter by status, view full order detail, update status
- All writes require login; public storefront browsing does not

### Security
- Passwords hashed with BCrypt — never stored in plaintext
- JWT-based admin authentication, 12-hour token expiry
- Every price and total recalculated server-side on order creation — the client's numbers are never trusted
- Rate limiting on login (5/min per IP) and order creation (20/min per IP)
- CORS restricted to the known frontend origin only
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)

## Project structure

rohit-sweets/
├── frontend/ React + TypeScript + Vite storefront and admin UI
├── backend/ Spring Boot REST API
├── docker-compose.yml Local PostgreSQL for development
├── .env.example Template for local environment variables
├── README.md This file
├── DEPLOYMENT.md How the live site is hosted
└── OPERATIONS.md Non-technical guide for running the shop day-to-day


## Local development setup

### Prerequisites
- Node.js 20.19+ or 22.12+
- Java 21 (JDK)
- Docker Desktop (for local PostgreSQL)
- Maven (bundled via `mvnw`, no separate install needed)

### 1. Clone and configure

git clone https://github.com/chaudharyadityaa/rohit-sweets.git
cd rohit-sweets
copy .env.example .env


Edit `.env` and set a real `DB_PASSWORD`.

### 2. Start the database

docker compose up -d


### 3. Start the backend

cd backend
$env:DB_PASSWORD = "your-password-from-.env"
$env:JWT_SECRET = "generate one — see Environment Variables below"
$env:ADMIN_PASSWORD = "choose a password for your first login"
.\mvnw.cmd spring-boot:run


Backend runs on `http://localhost:8080`.

### 4. Start the frontend

cd frontend
npm install
npm run dev


Frontend runs on `http://localhost:5173`.

### 5. Log in to admin

Visit `http://localhost:5173/admin/login`, username `admin`, password whatever you set as `ADMIN_PASSWORD` the first time the backend ran (the account is only created once, when `admin_users` is empty).

## Environment variables

### Backend (`backend`, set as environment variables — never committed)

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | Production only | Full JDBC connection string. Local dev uses a default pointing at Docker. |
| `DB_USER` | Production only | Database username. Defaults to `rohit_sweets` locally. |
| `DB_PASSWORD` | **Yes, always** | Database password. No default — must be set. |
| `JWT_SECRET` | **Yes, always** | Random base64 string, 32+ bytes, used to sign admin login tokens. |
| `JWT_EXPIRATION_MINUTES` | No | Defaults to 720 (12 hours). |
| `ADMIN_USERNAME` | No | Defaults to `admin`. |
| `ADMIN_PASSWORD` | Only on first run | Creates the first admin account. Leave unset after the account exists. |
| `CORS_ALLOWED_ORIGINS` | **Yes, always** | Comma-separated list of frontend URLs allowed to call the API. |

### Frontend (`frontend`, set in `.env.local` for dev, or the hosting platform's dashboard for production)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes, always** | The backend's URL. Local: `http://localhost:8080`. Production: the Railway URL. |

### Generating a new `JWT_SECRET`

$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.Convert]::ToBase64String($bytes)


## API reference (summary)

Full detail is in the controller source files under `backend/src/main/java/com/rohitsweets/`. Quick reference:

### Public
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List active products (supports `?category=`, `?q=`) |
| GET | `/api/products/{id}` | Single product |
| POST | `/api/orders` | Place an order (server calculates all prices) |
| GET | `/api/orders/{orderNumber}` | Look up an order by its RS-number |
| POST | `/api/auth/login` | Admin login, returns a JWT |

### Admin (requires `Authorization: Bearer <token>`)
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| PATCH | `/api/products/{id}/availability` | Toggle orderability |
| PATCH | `/api/products/{id}/reactivate` | Restore a soft-deleted product |
| DELETE | `/api/products/{id}` | Soft-delete a product |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/{id}/status` | Change an order's status |

## Database schema

Tables (full definitions in `backend/src/main/resources/db/migration/`):

- `products` — catalogue, with nullable `price` (null = not yet priced by the owner)
- `orders` — one row per order, server-calculated totals, status enum
- `order_items` — line items, with a **snapshot** of product name/price at order time (so a later price change never rewrites history)
- `delivery_bands` — distance-based delivery charges, editable data (not hardcoded)
- `delivery_settings` — single-row table for the delivery radius
- `admin_users` — BCrypt password hashes only

Schema changes always go through a new Flyway migration file (`V3__...sql`, `V4__...sql`, etc.) — never edit an already-applied migration.

## Testing
Backend

cd backend
$env:DB_PASSWORD = "..."; $env:JWT_SECRET = "..."; $env:ADMIN_PASSWORD = "..."
.\mvnw.cmd clean test

Frontend

cd frontend
npm run test


## Known limitations / honest tradeoffs

- **Free-tier hosting means cold starts.** The backend sleeps after ~15 minutes idle; the first request after that takes 30-60 seconds. A paid tier (~$5-7/month) removes this.
- **No automated database backups configured yet** — see `OPERATIONS.md` for a manual backup method until this is automated.
- **No order confirmation beyond WhatsApp** — the shop currently has no automated "order confirmed" message back to the customer; that's a manual WhatsApp reply from the owner.
- **No payment gateway** — Cash on Delivery only, by design (spec requirement).
- **No automated distance/delivery-area verification** — the customer self-reports which delivery band they're in; the shop verifies the address manually.

## Future roadmap (not built, possible next steps)

- Real product photography (owner-provided, hosted via Cloudinary or similar — see `OPERATIONS.md`)
- A "resend WhatsApp message" button for a specific order in the admin panel
- Configurable delivery radius and bands from the admin UI (currently edited via SQL)
- Email or SMS order confirmations
- A refresh-token flow so admins aren't logged out every 12 hours
- A paid hosting tier to remove backend cold starts, once order volume justifies it
- A custom domain (currently on free `.netlify.app` / `.up.railway.app` subdomains)