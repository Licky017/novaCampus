# School Management System — Backend API

Node.js + Express + MongoDB (Mongoose) REST API for the School Management ERP.
JWT-secured, role-based access control (Super Admin / Teacher / Student), full CRUD across all modules.

## Tech Stack

- **Runtime:** Node.js >= 18
- **Framework:** Express.js 4
- **Database:** MongoDB Atlas via Mongoose 8
- **Auth:** JWT (access + refresh tokens), bcryptjs password hashing
- **Security:** helmet, cors, express-rate-limit
- **Validation:** express-validator
- **Uploads:** multer
- **Logging:** morgan
- **Email:** nodemailer (forgot/reset password)

## Getting Started

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
npm run dev             # nodemon, auto-restarts on change
# or
npm start                # plain node
```

The API will be available at `http://localhost:5000/api`.
Health check: `GET /api/health`

## Folder Structure

```
backend/
├── config/db.js              MongoDB Atlas connection
├── controllers/               One file per resource — thin HTTP layer
├── middleware/
│   ├── authMiddleware.js      JWT verification (protect)
│   ├── roleMiddleware.js      Role-based access guard (authorize)
│   ├── validate.js            express-validator error formatter
│   ├── errorHandler.js        Global error handler + 404
│   └── upload.js              Multer file upload config
├── models/                    9 Mongoose schemas (User, Student, Teacher,
│                               Class, Subject, Attendance, Grade, Fee,
│                               Announcement)
├── routes/                    One router per resource, mounted under /api
├── services/                  Business logic layer (DB queries, aggregation)
├── utils/                      asyncHandler, sendResponse, generateToken,
│                               generateId, calculateGrade, sendEmail
├── uploads/                    Multer upload destination (gitignored contents)
├── server.js                   App entry point
└── Procfile                    Render.com deploy: `web: node server.js`
```

## API Response Shape

Every endpoint returns:

```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [ /* ... */ ],
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

`pagination` is only present on paginated list endpoints.

## Auth Flow

1. `POST /api/auth/login` → returns `{ user, accessToken, refreshToken }` and also sets an httpOnly `token` cookie.
2. Send `Authorization: Bearer <accessToken>` on every subsequent request (or rely on the cookie).
3. `POST /api/auth/refresh-token` with `{ refreshToken }` → returns a new access token once the old one expires.
4. `POST /api/auth/logout` clears the stored refresh token and the cookie.

## Roles

| Role | Can do |
|---|---|
| `superadmin` | Full CRUD on every module |
| `teacher` | Mark attendance, enter grades, post announcements, view assigned classes |
| `student` | Read-only: own profile, grades, attendance, fees, announcements |

## Endpoints Overview

| Resource | Base path |
|---|---|
| Auth | `/api/auth` |
| Students | `/api/students` |
| Teachers | `/api/teachers` |
| Classes | `/api/classes` |
| Subjects | `/api/subjects` |
| Attendance | `/api/attendance` |
| Grades | `/api/grades` |
| Fees | `/api/fees` |
| Announcements | `/api/announcements` |
| Dashboard | `/api/dashboard` |

See the master prompt / Postman collection for the full per-route breakdown.

## Deployment (Render.com)

1. Push this `backend/` folder to its own repo (or a monorepo subfolder).
2. On Render: New → Web Service → connect repo.
3. Build command: `npm install`. Start command: `node server.js` (or rely on the included `Procfile`).
4. Add all variables from `.env.example` to Render's environment settings — especially `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `FRONTEND_URL` (set this to your deployed Netlify frontend URL for CORS).
5. In MongoDB Atlas, whitelist `0.0.0.0/0` (or Render's static IPs) under Network Access.

## Notes

- Bootstrap is **not** used anywhere in this backend (it's a frontend concern) — this matches the corrected brief. The frontend, when built, will use Tailwind CSS instead.
- Student/Teacher records are **soft-deleted** (`isDeleted: true`) rather than removed, to preserve historical grade/attendance/fee data.
- Letter grades (A+/A/B+/B/C/D/F) are auto-computed on every Grade save.
- Fee `status` automatically flips `pending` → `overdue` once `dueDate` has passed (checked on every `GET /api/fees/overdue` call), and a receipt number is auto-generated the moment a fee is marked `paid`.
