# Portfolio Backend (NestJS)

REST API for the Portfolio Creator app: auth (JWT), portfolios (one per user), MySQL + TypeORM.

## Features

- **MySQL + TypeORM:** `users`, `portfolios`, `portfolio_details` (per-locale content).
- **Auth:** POST `/api/auth/register`, POST `/api/auth/login` → `access_token` + `user`.
- **Portfolios:** GET `/api/portfolios/:slug` (public), GET `/api/portfolios/me` (Bearer token), PUT `/api/portfolios/:id` (owner only). One portfolio is created per user on register.
- **Swagger:** `/api/docs`. DTOs validated with class-validator.

## Configuration

Create `.env` (see `.env.example`):

```env
PORT=10001
APP_CORS_ORIGINS=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio
JWT_SECRET=your-secret-key-change-in-production
```

Create the MySQL database:

```sql
CREATE DATABASE portfolio;
```

## Run

```bash
npm install
npm run start:dev
```

- **API:** http://localhost:10001/api  
- **Swagger:** http://localhost:10001/api/docs  

Optional seed (user + sample portfolio):

```bash
npm run seed
```

## Endpoints

| Method | Path                    | Auth  | Description                |
|--------|-------------------------|-------|----------------------------|
| POST   | /api/auth/register      | No    | Register (email, password) |
| POST   | /api/auth/login         | No    | Login → access_token       |
| GET    | /api/portfolios/me      | Bearer| Current user's portfolio   |
| GET    | /api/portfolios/:slug   | No    | Public portfolio by slug   |
| PUT    | /api/portfolios/:id     | Bearer| Update (owner only)        |

Query `?locale=en` or `?locale=vi` on GET portfolio endpoints for localized content.

## Frontend integration

- **CORS:** Set `APP_CORS_ORIGINS` (e.g. `http://localhost:5173`).
- **Base URL:** Frontend uses `VITE_API_URL=http://localhost:10001`.
- **Auth:** Send `Authorization: Bearer <access_token>` for protected routes.
