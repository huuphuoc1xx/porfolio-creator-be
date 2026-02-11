# Portfolio Backend (NestJS)

API cho app portfolio: đăng ký/đăng nhập (JWT), tạo/sửa portfolio theo user, lưu MySQL.

- **MySQL** + **TypeORM**: bảng `users`, `portfolios`.
- **Auth**: POST `/api/auth/register`, POST `/api/auth/login` → trả về `access_token` + `user`.
- **Portfolios**: GET `/api/portfolios/:slug` (public), GET `/api/portfolios/me` (cần Bearer token), PUT/DELETE (chỉ owner). Portfolio được tạo tự động khi đăng ký.
- **class-validator** + **Swagger**: `/api/docs`.

## Cấu hình

Tạo file `.env` (xem `.env.example`):

```env
PORT=10001
APP_CORS_ORIGINS=http://localhost:10002
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio
JWT_SECRET=your-secret-key-change-in-production
```

Tạo database MySQL:

```sql
CREATE DATABASE portfolio;
```

## Chạy

```bash
yarn
yarn start:dev
```

- API: `http://localhost:10001/api`
- Swagger: `http://localhost:10001/api/docs`

## Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| POST | /api/auth/register | - | Đăng ký (email, password) |
| POST | /api/auth/login | - | Đăng nhập → access_token |
| GET | /api/portfolios/me | Bearer | Portfolio của user đang đăng nhập |
| GET | /api/portfolios/:slug | - | Xem portfolio công khai (link chia sẻ) |
| PUT | /api/portfolios/:id | Bearer | Cập nhật (chỉ owner) |
| DELETE | /api/portfolios/:id | Bearer | Xóa (chỉ owner) |

`synchronize: true` khi NODE_ENV !== production (tự tạo/cập nhật bảng). Production nên dùng migration.

## Integration với frontend

- **CORS**: Cấu hình `APP_CORS_ORIGINS` (ví dụ `http://localhost:10002`) để cho phép frontend (Vite) gọi API. Để trống = cho phép mọi origin (dev).
- **Base URL**: Frontend dùng `VITE_API_URL=http://localhost:10001` (không slash cuối).
- **Auth**: Gửi header `Authorization: Bearer <access_token>` cho các route cần đăng nhập. Token trả về từ `/api/auth/register` và `/api/auth/login`.
- **Locale**: GET `/api/portfolios/:slug` và GET `/api/portfolios/me` hỗ trợ query `?locale=en` hoặc `?locale=vi` để chỉ lấy nội dung theo ngôn ngữ.
- **Swagger**: `http://localhost:10001/api/docs` để xem và thử API.
