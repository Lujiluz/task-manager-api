# Task Manager API

REST API untuk manajemen tugas (task) berbasis Express 5 dengan autentikasi JWT. Dibangun menggunakan Clean Architecture dengan TypeScript, Prisma ORM, dan PostgreSQL.

**Live URL:** https://luji-space-task-manager.vercel.app

---

## Tech Stack

| Kategori  | Teknologi                |
| --------- | ------------------------ |
| Runtime   | Node.js + TypeScript     |
| Framework | Express 5                |
| Database  | PostgreSQL (Neon)        |
| ORM       | Prisma 7                 |
| Auth      | JSON Web Token (JWT)     |
| Password  | bcrypt                   |
| Validasi  | Zod                      |
| Logger    | pino + pino-http         |
| Security  | helmet, cors             |
| Testing   | Vitest + Supertest       |
| API Docs  | Swagger UI (OpenAPI 3.0) |

---

## Cara Install & Run

### Prerequisites

- Node.js >= 18
- npm >= 9
- Akses ke database PostgreSQL (bisa pakai [Neon.tech](https://neon.tech) gratis)

### 1. Clone repository

```bash
git clone <repository-url>
cd task-manager-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Buat file `.env` di root project:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (wajib diisi)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# JWT (wajib diisi)
JWT_SECRET=your_strong_random_secret_here

# CORS (untuk production)
FRONTEND_URL=http://localhost:8081
```

### 4. Setup database

Lihat bagian [Cara Setup Database](#cara-setup-database) di bawah.

### 5. Jalankan server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm run start
```

Server berjalan di `http://localhost:3000`

Swagger UI tersedia di `http://localhost:3000/docs`

### Perintah lainnya

```bash
npm test                # Jalankan semua unit test
npm run test:watch      # Watch mode
npm run test:all        # Unit + integration test
npm run test:coverage   # Coverage report
```

---

## Cara Setup Database

### Menggunakan Neon (PostgreSQL cloud gratis)

1. Buat akun di [neon.tech](https://neon.tech)
2. Buat project baru dan database
3. Copy connection string dari dashboard Neon
4. Paste ke `DATABASE_URL` di file `.env`

### Menggunakan PostgreSQL lokal

1. Install PostgreSQL di mesin lokal
2. Buat database baru:
   ```sql
   CREATE DATABASE task_manager;
   ```
3. Set `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/task_manager
   ```

### Jalankan migrasi

```bash
# Buat tabel dari schema Prisma
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Verifikasi koneksi

```bash
npx prisma db push
```

Setelah berhasil, database memiliki dua tabel: `User` dan `Task`.

---

## API Endpoints Documentation

Dokumentasi interaktif (Swagger UI) tersedia di:

- **Local:** `http://localhost:3000/docs`
- **Live:** `https://task-manager-api-p5lz.onrender.com/docs`

Base URL: `http://localhost:3000/api`

Endpoint yang membutuhkan autentikasi harus menyertakan header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Health Check

| Method | Endpoint | Auth | Deskripsi    |
| ------ | -------- | ---- | ------------ |
| GET    | `/ping`  | -    | Health check |

---

### Users

| Method | Endpoint           | Auth | Deskripsi                        |
| ------ | ------------------ | ---- | -------------------------------- |
| POST   | `/users`           | -    | Registrasi user baru             |
| POST   | `/users/login`     | -    | Login dan dapatkan token JWT     |
| GET    | `/users`           | -    | Ambil semua user                 |
| GET    | `/users/:id`       | -    | Ambil user berdasarkan ID        |
| PUT    | `/users/:id`       | -    | Update data user                 |
| DELETE | `/users/:id`       | -    | Hapus user (cascade hapus tasks) |
| GET    | `/users/:id/tasks` | -    | Ambil semua tasks milik user     |

---

### Tasks

| Method | Endpoint          | Auth  | Deskripsi                             |
| ------ | ----------------- | ----- | ------------------------------------- |
| GET    | `/tasks`          | -     | Ambil semua tasks (beserta data user) |
| POST   | `/tasks`          | Wajib | Buat task baru                        |
| GET    | `/tasks/my-tasks` | Wajib | Ambil tasks milik user yang login     |
| GET    | `/tasks/:id`      | -     | Ambil task berdasarkan ID             |
| PUT    | `/tasks/:id`      | Wajib | Update task (hanya pemilik)           |
| DELETE | `/tasks/:id`      | Wajib | Hapus task (hanya pemilik)            |

---

## Contoh Request / Response

### Registrasi User

**Request**

```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response** `201 Created`

```json
{
  "id": "clxyz123abc",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Login

**Request**

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxyz123abc",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Buat Task

**Request**

```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Beli bahan makanan",
  "description": "Susu, roti, telur",
  "completed": false
}
```

**Response** `201 Created`

```json
{
  "id": "cltask456def",
  "title": "Beli bahan makanan",
  "description": "Susu, roti, telur",
  "completed": false,
  "userId": "clxyz123abc",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

### Ambil Semua Tasks

**Request**

```http
GET /api/tasks
```

**Response** `200 OK`

```json
[
  {
    "id": "cltask456def",
    "title": "Beli bahan makanan",
    "description": "Susu, roti, telur",
    "completed": false,
    "userId": "clxyz123abc",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "user": {
      "id": "clxyz123abc",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
]
```

---

### Ambil Tasks Milik User yang Login

**Request**

```http
GET /api/tasks/my-tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** `200 OK`

```json
[
  {
    "id": "cltask456def",
    "title": "Beli bahan makanan",
    "description": "Susu, roti, telur",
    "completed": false,
    "userId": "clxyz123abc",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### Update Task

**Request**

```http
PUT /api/tasks/cltask456def
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "completed": true
}
```

**Response** `200 OK`

```json
{
  "id": "cltask456def",
  "title": "Beli bahan makanan",
  "description": "Susu, roti, telur",
  "completed": true,
  "userId": "clxyz123abc",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T14:00:00.000Z"
}
```

---

### Hapus Task

**Request**

```http
DELETE /api/tasks/cltask456def
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** `204 No Content`

---

### Error Responses

| Status | Kondisi                           | Contoh Response                                                               |
| ------ | --------------------------------- | ----------------------------------------------------------------------------- |
| 400    | Validasi gagal / data tidak valid | `{ "status": "error", "message": "Validation failed" }`                       |
| 401    | Token tidak ada atau tidak valid  | `{ "status": "error", "message": "Unauthorized request" }`                    |
| 403    | Bukan pemilik task                | `{ "status": "error", "message": "Forbidden access" }`                        |
| 404    | Data tidak ditemukan              | `{ "status": "error", "message": "Task not found" }`                          |
| 409    | Email sudah terdaftar             | `{ "status": "error", "message": "A record with this value already exists" }` |
| 500    | Internal server error             | `{ "status": "error", "message": "Internal Server Error" }`                   |

> Di mode `development`, response error 500 juga menyertakan `stack` trace.

---

## Struktur Project

```
src/
├── index.ts                  # Entry point
├── config/                   # Validasi environment (Zod)
├── infrastructure/
│   ├── database/             # Prisma client & koneksi
│   └── http/                 # Express app & server bootstrap
├── presentation/
│   ├── controllers/          # HTTP request handlers
│   ├── routes/               # Definisi endpoint
│   └── middlewares/          # Auth, validasi, error handler
├── application/
│   └── services/             # Business logic
└── shared/
    ├── errors/               # AppError class
    ├── logger/               # Pino logger
    ├── utils/                # JWT & password utilities
    └── validators/           # Zod schemas

prisma/
└── schema.prisma             # Database schema

docs/
└── openapi.yaml              # OpenAPI 3.0 spec

tests/                        # Unit & integration tests
```
