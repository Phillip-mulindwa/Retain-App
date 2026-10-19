# Retain

**Live app:** https://retain-app-sigma.vercel.app
**Backend API:** https://retain-backend-rewp.onrender.com (health check: [/api/health](https://retain-backend-rewp.onrender.com/api/health))

**Demo admin login**

- Email: `admin@retain.app`
- Password: `Admin123!`

The backend is on Render's free plan, so it goes to sleep when nobody is using it. If the first request is slow or the login seems to hang, give it about a minute to wake up and try again.

---

Retain is an expense and budget tracker I built for my summative project. You log what you spend, give each expense a category and a payment method, and set a budget for the month. The app then tells you whether you're within budget, getting close to it, or over it. Admins get an extra dashboard where they can manage the categories everyone uses and see how the platform is being used overall.

The frontend is React + TypeScript (Vite) and the backend is Express + MongoDB. Auth is handled with React Context and the expense filters use Redux Toolkit.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Design decisions](#design-decisions)
- [Deployment](#deployment)

## Features

### For any signed-in user

- Sign up, log in and log out. You stay logged in after a page refresh, and you get sent back to the login page when your token expires.
- Add, view, edit and delete your own expenses. Each expense has a title, amount, category, date, payment method and optional notes.
- Search expenses by title or notes, filter by category, payment method, date range and amount range, sort by date or amount, and page through the results. All of this filter state lives in Redux Toolkit.
- Set a monthly budget (or change it) and see how much you've spent, how much is left, and a status of **within**, **approaching** or **over**.
- A dashboard for the selected month showing total spend, budget status, your biggest single expense, spending per category and your 5 most recent expenses.

### For admins

The first account created on an empty database is made an admin automatically. The seed script also creates the demo admin listed above.

- Create, rename, recolour and delete expense categories. When you delete a category that still has expenses, those expenses get moved to a protected "Uncategorized" category so nothing is left without a category.
- Platform insights: total users, total expenses, total amount recorded, expenses added this month, spend per category, the top 5 and bottom 5 categories by usage, recent expenses and recently registered users.

## Tech stack

**Frontend:** React 19, TypeScript, Vite, Material UI (with a custom teal/amber theme), React Router, Redux Toolkit for expense filtering, React Context for auth, Axios.

**Backend:** Node.js, Express, MongoDB with Mongoose, JWT for auth, bcrypt for hashing passwords.

**Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database).

## Project structure

```
Retain-App/
  frontend/     React app (pages, components, feature folders under src/)
  backend/      Express API (models, routes, controllers, middleware, seed script)
  render.yaml   Render blueprint for the backend
```

The frontend and backend each have their own `package.json` and are deployed separately. I kept them in one repo so all the history is in one place.

## Running it locally

You need Node.js 18 or newer and a MongoDB database. A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works, or you can run `mongod` locally.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm run seed            # adds the starter categories and the demo admin
npm run dev             # API runs on http://localhost:5000
```

You can run the seed script more than once. It only adds what's missing, so it won't create duplicates.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL should point at the backend
npm run dev             # app runs on http://localhost:5173
```

Then either sign up for a new account or log in with the demo admin to go straight to the admin dashboard.

### 3. Production build

```bash
cd frontend && npm run build   # runs tsc, then builds with Vite
cd backend && npm start        # no build step, it's plain Node
```

### Troubleshooting

If the backend fails with `querySrv ECONNREFUSED` when connecting to Atlas, your DNS server can't resolve the `mongodb+srv://` address. Changing your network DNS to `8.8.8.8` or `1.1.1.1` fixes it. You can also use the standard `mongodb://` connection string from the Atlas "Connect" screen.

## Environment variables

**backend/.env**

| Variable     | What it's for                                    |
|--------------|--------------------------------------------------|
| `MONGO_URI`  | MongoDB connection string                        |
| `JWT_SECRET` | Long random string used to sign auth tokens      |
| `PORT`       | Port the API listens on (defaults to `5000`)     |
| `CLIENT_URL` | Frontend URL allowed through CORS                |

**frontend/.env**

| Variable       | What it's for                                                  |
|----------------|----------------------------------------------------------------|
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api`          |

## API reference

Every route starts with `/api`.

- **Auth** means you need an `Authorization: Bearer <token>` header.
- **Admin** means you also need to be logged in as an admin.

| Method | Route                | Access | Description |
|--------|----------------------|--------|-------------|
| GET    | `/health`            | Public | Check that the API is up |
| POST   | `/auth/signup`       | Public | Create an account (the first account becomes admin) |
| POST   | `/auth/login`        | Public | Log in and get a JWT back |
| GET    | `/auth/me`           | Auth   | Get the current user |
| GET    | `/expenses`          | Auth   | List your expenses. Query params: `search`, `category`, `paymentMethod`, `dateFrom`, `dateTo`, `amountMin`, `amountMax`, `sortBy` (`date` or `amount`), `sortDir` (`asc` or `desc`), `page`, `limit` |
| POST   | `/expenses`          | Auth   | Create an expense |
| GET    | `/expenses/:id`      | Auth   | Get one of your expenses |
| PUT    | `/expenses/:id`      | Auth   | Update one of your expenses |
| DELETE | `/expenses/:id`      | Auth   | Delete one of your expenses |
| GET    | `/budgets/:month`    | Auth   | Get your budget for a month (`YYYY-MM`) |
| PUT    | `/budgets/:month`    | Auth   | Set or update your budget for a month |
| GET    | `/dashboard/summary` | Auth   | Dashboard data for `?month=YYYY-MM` (defaults to this month) |
| GET    | `/categories`        | Auth   | List all categories |
| POST   | `/categories`        | Admin  | Create a category |
| PUT    | `/categories/:id`    | Admin  | Rename or recolour a category |
| DELETE | `/categories/:id`    | Admin  | Delete a category (its expenses move to Uncategorized) |
| GET    | `/admin/insights`    | Admin  | Platform-wide stats |

## Design decisions

**Context and Redux each do one job.** Everything to do with auth lives in `AuthContext`: the user, the token, login, signup, logout, and the protected and admin-only routes. The expense search, filters, sorting and pagination live in a Redux Toolkit slice. The expenses themselves never go into Redux, only the filter settings do. The list gets fetched again from the API whenever a filter changes, so there's no second copy of the data to keep in sync.

**Deleting a category doesn't break expenses.** The "Uncategorized" category is protected and can't be deleted. When any other category is deleted, its expenses are moved to Uncategorized first.

**Users can only touch their own data, and the server checks it.** Hiding other people's data in the UI isn't enough on its own. Every expense and budget query on the backend filters by the user ID from the verified JWT, so guessing someone else's expense ID gets you nothing.

**Shared TypeScript types.** The types for users, expenses, budgets, categories, dashboard data and admin insights are all in `frontend/src/types/index.ts`. The API functions, Redux slice, Context and components all use them, and there's no `any` anywhere in the frontend.

**It works on phones too.** On desktop the sidebar stays open. On smaller screens it turns into a slide-out menu, and the pages, forms and filters stack into a single column.

**Errors get shown, not swallowed.** On the backend, every route passes errors to one error handler in `backend/src/middleware/errorHandler.js`. It turns validation errors, duplicate emails and bad IDs into clear 4xx messages. On the frontend, those messages show up as alerts in the forms and pages. An Axios interceptor logs you out and sends you to the login page if your token expires.

## Deployment

- **Database:** MongoDB Atlas
- **Backend:** Render, set up from `render.yaml`. `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` are entered in the Render dashboard so they're never committed. `CLIENT_URL` is set to the Vercel URL so CORS lets the frontend through.
- **Frontend:** Vercel, with `VITE_API_URL` set to `https://retain-backend-rewp.onrender.com/api`. `frontend/vercel.json` sends every route to `index.html` so refreshing a page like `/expenses` doesn't return a 404.

**Note:** the demo admin password is in the seed script, which is public in this repo. It's fine for a demo, but change it before using this for anything real.
