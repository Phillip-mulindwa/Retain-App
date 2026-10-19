# Retain

A personal expense & budget manager. Log what you spend, tag it by
category and payment method, set a monthly budget and watch — in real
time, colour-coded — whether you're within it, approaching it, or over
it. Admins get a second dashboard for managing the shared category
list and keeping an eye on platform-wide usage.

Built as a summative project: React + TypeScript + Vite on the
frontend, Express + MongoDB on the backend, Context for auth, Redux
Toolkit for expense filtering.

**Live app:** _not yet deployed — see [Deployment](#deployment) below for how this gets hosted once it's live._

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started locally](#getting-started-locally)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Design notes](#design-notes)
- [Deployment](#deployment)

---

## Features

**Everyone (signed-in users)**
- Sign up, sign in, sign out — session persists across a refresh
- Create, view, edit and delete your own expenses (title, amount,
  category, date, payment method, optional notes)
- Search expenses by title/notes, filter by category, payment method,
  date range and amount range, sort by date or amount, paginate through
  results — all backed by Redux Toolkit state
- Set or update a monthly budget and see, live: total spent, remaining
  budget, and a **within / approaching / over** status
- A dashboard summarising the selected month: total spend, budget
  status, highest single expense, spending broken down by category,
  and the 5 most recent expenses

**Admins only** (first account ever created becomes admin automatically)
- Create, rename and delete expense categories — deleting a category
  that still has expenses reassigns them to a protected "Uncategorized"
  default rather than orphaning them
- Platform insights: total registered users, total expenses recorded,
  total value recorded, expenses recorded this month, spend per
  category, top 5 and bottom 5 categories by usage, recently added
  expenses, recently registered users

## Tech stack

**Frontend** — React 19 + TypeScript, Vite, Material UI (custom teal/amber
theme), React Router, Redux Toolkit (expense filtering only), React
Context (authentication only), Axios.

**Backend** — Node.js, Express, MongoDB with Mongoose, JSON Web Tokens
for auth, bcrypt for password hashing.

## Project structure

```
Retain-App/
  frontend/     Vite + React + TypeScript app (see frontend/src for feature folders)
  backend/      Express API (models, routes, controllers, middleware)
```

Each has its own `package.json` — they're deployed separately but live
in one repo so the project's history stays in one timeline.

## Getting started locally

You'll need Node.js 18+ and a MongoDB connection (a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster works fine, or a
local `mongod`).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm run seed              # creates the Uncategorized default category + a demo admin
npm run dev                # starts the API on http://localhost:5000
```

The seed script prints a demo admin login (`admin@retain.app` /
`Admin123!` at the time of writing — check the script's console output,
and change it immediately in any real deployment).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL should point at the backend above
npm run dev                # starts the app on http://localhost:5173
```

Sign up for a new account (the first account created on a fresh
database becomes an admin automatically), or log in with the seeded
demo admin to see the admin dashboard right away.

### 3. Build for production

```bash
# frontend
cd frontend && npm run build   # type-checks with tsc, then bundles with vite

# backend - no build step, it's plain Node
cd backend && npm start
```

## Environment variables

**backend/.env**

| Variable      | Description                                               |
|---------------|-------------------------------------------------------------|
| `MONGO_URI`   | MongoDB connection string                                   |
| `JWT_SECRET`  | Long random string used to sign/verify auth tokens           |
| `PORT`        | Port the API listens on (default `5000`)                     |
| `CLIENT_URL`  | Frontend origin allowed through CORS                          |

**frontend/.env**

| Variable         | Description                        |
|------------------|-------------------------------------|
| `VITE_API_URL`   | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## API reference

All routes below are prefixed with `/api`. Routes marked 🔒 require a
`Authorization: Bearer <token>` header; 🔒👑 additionally requires the
signed-in user to have the `admin` role.

| Method | Route                  | Description                                               |
|--------|-------------------------|-------------------------------------------------------------|
| GET    | `/health`               | Liveness check                                              |
| POST   | `/auth/signup`          | Create an account (first account ever = admin)                |
| POST   | `/auth/login`           | Sign in, returns a JWT                                        |
| GET    | `/auth/me`              | 🔒 Current user                                                |
| GET    | `/expenses`             | 🔒 List your expenses — supports `search`, `category`, `paymentMethod`, `dateFrom`, `dateTo`, `amountMin`, `amountMax`, `sortBy` (`date`\|`amount`), `sortDir` (`asc`\|`desc`), `page`, `limit` |
| POST   | `/expenses`             | 🔒 Create an expense                                           |
| GET    | `/expenses/:id`         | 🔒 Get one of your expenses                                    |
| PUT    | `/expenses/:id`         | 🔒 Update one of your expenses                                 |
| DELETE | `/expenses/:id`         | 🔒 Delete one of your expenses                                 |
| GET    | `/budgets/:month`       | 🔒 Get your budget for a `YYYY-MM` month                        |
| PUT    | `/budgets/:month`       | 🔒 Set/update your budget for a `YYYY-MM` month                 |
| GET    | `/dashboard/summary`    | 🔒 Dashboard summary for `?month=YYYY-MM` (defaults to current) |
| GET    | `/categories`           | 🔒 List all categories                                          |
| POST   | `/categories`           | 🔒👑 Create a category                                          |
| PUT    | `/categories/:id`       | 🔒👑 Rename/recolour a category                                 |
| DELETE | `/categories/:id`       | 🔒👑 Delete a category (reassigns its expenses to Uncategorized) |
| GET    | `/admin/insights`       | 🔒👑 Platform-wide stats                                        |

## Design notes

A few deliberate choices worth calling out:

- **Context vs. Redux is a hard boundary.** Authentication (user,
  token, login/signup/logout, protected/admin routes) lives entirely in
  `AuthContext`. Expense search/filter/sort/pagination lives entirely in
  a Redux Toolkit slice. Neither touches the other's job, and the
  expense *data* itself is never duplicated into Redux — only the
  filter state is, with the actual list fetched fresh on every change.
- **Deleting a category never orphans data.** A seeded "Uncategorized"
  category is protected from deletion; deleting any other category
  reassigns its expenses to it first.
- **Ownership is enforced server-side**, not just hidden in the UI —
  every expense/budget route filters by `req.user._id` from the
  verified JWT, so there's no way to read or modify another user's data
  by guessing an id.

## Deployment

Planned setup: MongoDB Atlas (database) → Render (backend API) →
Vercel (frontend), with the frontend's `VITE_API_URL` pointed at the
Render service and the backend's `CLIENT_URL` pointed at the Vercel
domain for CORS. This section gets filled in with the live URLs once
deployed.
