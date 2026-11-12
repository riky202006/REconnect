# ReConnect Backend API & Database

Production-ready Express.js backend and dual-engine SQL database (PostgreSQL / SQLite) built for the **ReConnect** Campus Resource Sharing Platform.

---

## 🚀 Key Features

- **Dual-Engine SQL Database Support**:
  - **Zero-Config Local Development**: Automatically boots embedded SQLite (`node:sqlite`) with zero external database dependencies.
  - **Production PostgreSQL Support**: Set `DATABASE_URL` to connect to PostgreSQL (e.g. Supabase, Neon, AWS RDS, Docker, local Postgres) using `pg.Pool`.
  - **Unified Query Layer**: All models and controllers run through a database abstraction (`src/config/db.js`) supporting standard SQL with parameterized queries.
- **Auto-Migration & Seeding**:
  - Automatically provisions schemas (`schema.sql`) and indexes on boot.
  - Automatically seeds realistic campus data for ADTU (Assam Down Town University) on first launch.
- **JWT Authentication & Security**:
  - Bcrypt password hashing (`salt rounds: 10`).
  - Bearer token authentication via JWT (`jsonwebtoken`).
  - Route-level middleware (`authenticate`, `optionalAuthenticate`).
- **RESTful Endpoints**:
  - Full CRUD for Resources with category/status filters, search, and image storage.
  - Tear-off Campus Requests lifecycle (`PENDING` -> `ACCEPTED` -> `READY_PICKUP` -> `COMPLETED`).
  - Automatic circular economy reward mechanics (+50 RePoints for completed handovers, +25 RePoints for returns).
  - Transactions log with verification codes (`TXN-YYYY-XXXX`).
  - Real-time Notifications & Impact Metrics.
  - Multipart Image Uploads via `multer`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL (`pg`) / SQLite (`node:sqlite`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **File Uploads**: `multer`

---

## 📁 Project Structure

```
backend/
├── .env.example
├── .env
├── package.json
├── uploads/                     # Static media storage
├── data/                        # SQLite data store (when using SQLite)
│   └── reconnect.db
└── src/
    ├── config/
    │   ├── db.js                # Unified database connector (Postgres / SQLite)
    │   └── env.js               # Environment variables loader
    ├── db/
    │   ├── schema.sql           # SQL DDL table definitions & indexes
    │   ├── migrate.js           # Migration runner
    │   └── seed.js              # Campus dataset seeder
    ├── middleware/
    │   ├── auth.js              # JWT authentication guards
    │   ├── errorHandler.js      # Error handling middleware
    │   └── upload.js            # Multer file upload handler
    ├── utils/
    │   ├── helpers.js           # IDs, transaction code generator, JSON helpers
    │   └── jwt.js               # JWT signing & verification
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── resourceController.js
    │   ├── requestController.js
    │   ├── transactionController.js
    │   ├── notificationController.js
    │   └── communityController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── resourceRoutes.js
    │   ├── requestRoutes.js
    │   ├── transactionRoutes.js
    │   ├── notificationRoutes.js
    │   ├── communityRoutes.js
    │   ├── uploadRoutes.js
    │   └── index.js             # API router aggregator & health check
    ├── app.js                   # Express application setup
    └── server.js                # Server entrypoint (db init + listen)
```

---

## ⚙️ Environment Variables

Create `.env` in the `backend/` directory:

```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Database:
# - To use PostgreSQL:
#   DATABASE_URL=postgresql://postgres:password@localhost:5432/reconnect
# - Leave unset to run with embedded SQLite automatically:
DB_TYPE=auto

CLIENT_URL=http://localhost:3000
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
# Production mode
npm start

# Development mode (with file watcher)
npm run dev
```

From the root workspace:
```bash
# Run backend
npm run dev:backend

# Run frontend
npm run dev:frontend
```

---

## 📡 API Reference

### Health & Status
- `GET /api/health` - Check API and Database status

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account (`fullName`, `email`, `password`, `community`)
- `POST /api/auth/login` - Authenticate (`email`, `password`)
- `GET /api/auth/me` - Authenticated user session

### Resources (`/api/resources`)
- `GET /api/resources` - List resources with filtering (`category`, `sharingType`, `status`, `search`, `community`, `isUrgent`)
- `GET /api/resources/:id` - Resource details (increments views count)
- `POST /api/resources` - Pin resource (Auth required)
- `PUT /api/resources/:id` - Update resource (Owner only)
- `PATCH /api/resources/:id/status` - Update status (`AVAILABLE`, `RESERVED`, `CLAIMED`)
- `DELETE /api/resources/:id` - Delete resource (Owner only)

### Requests (`/api/requests`)
- `GET /api/requests` - User's incoming & sent resource requests (Auth required)
- `POST /api/requests` - Request a resource (Auth required)
- `PATCH /api/requests/:id/status` - Update request status (`ACCEPTED`, `REJECTED`, `READY_PICKUP`, `COMPLETED`)
- `DELETE /api/requests/:id` - Cancel request

### Transactions (`/api/transactions`)
- `GET /api/transactions` - User transactions (Auth required)
- `GET /api/transactions/:id` - Transaction details
- `POST /api/transactions/:id/complete` - Mark handover complete
- `POST /api/transactions/:id/return` - Confirm return of borrowed resource (+25 RePoints)

### Users & Community (`/api/users`, `/api/community`)
- `GET /api/users/profile` - Detailed user profile with stats & badges
- `PUT /api/users/profile` - Update profile information
- `GET /api/users/leaderboard` - Campus leaderboard rankings
- `GET /api/community` - Campus hub stats & announcements

### File Uploads (`/api/upload`)
- `POST /api/upload` - Upload image for resource / avatar (`multipart/form-data`)

