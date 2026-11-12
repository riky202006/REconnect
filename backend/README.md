# ReConnect Backend API & Database (MongoDB Atlas)

Production-ready Express.js backend and MongoDB Atlas cloud database powered by **Mongoose ODM**, built for the **ReConnect** Campus Resource Sharing Platform.

---

## 🚀 Key Features

- **Primary Database: MongoDB Atlas (Mongoose ODM)**:
  - Centralized connection management with resilient connection retry and DNS fallbacks.
  - Strongly typed Mongoose schemas with validation, defaults, and relationships.
  - Server starts strictly after verifying an active MongoDB Atlas connection.
  - String-based identifiers (`usr_...`, `res_...`, `req_...`, `txn_...`) ensuring 100% backward compatibility with all frontend routes and existing client applications.
- **Auto-Initialization & Seeding**:
  - Automatically provisions schemas and indexes in MongoDB Atlas.
  - Seeds the initial ADTU (Assam Down Town University) campus dataset if collections are empty.
- **JWT Authentication & Security**:
  - Bcrypt password hashing (`salt rounds: 10`).
  - Bearer token authentication via JWT (`jsonwebtoken`).
  - Route-level middleware (`authenticate`, `optionalAuthenticate`).
- **RESTful Endpoints**:
  - Full CRUD for Resources with category/status filters, search, and image storage.
  - Complete Campus Requests lifecycle (`PENDING` -> `ACCEPTED` -> `READY_PICKUP` -> `COMPLETED`).
  - Automatic circular economy reward mechanics (+50 RePoints for completed handovers, +25 RePoints for returns).
  - Transactions log with verification codes (`TXN-YYYY-XXXX`).
  - Real-time Notifications & Impact Metrics.
  - Multipart Image Uploads via `multer`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose (`mongoose: ^9.12.1`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **File Uploads**: `multer`

---

## 📁 Project Structure

```
backend/
├── .env.example                 # Example environment variables template
├── .env                         # Active environment variables (git-ignored)
├── package.json
├── uploads/                     # Static media uploads storage
└── src/
    ├── config/
    │   ├── db.js                # Centralized MongoDB Atlas connection & health check
    │   └── env.js               # Environment variables loader
    ├── models/                  # Mongoose Schemas & Models
    │   ├── User.js              # User accounts & statistics
    │   ├── Resource.js          # Shared/borrowed/exchanged resources
    │   ├── Request.js           # Student resource pickup/borrow requests
    │   ├── Transaction.js       # Verified campus exchange transactions
    │   ├── RewardHistory.js     # Points history ledger
    │   ├── UserBadge.js         # Community recognition badges
    │   ├── Notification.js      # Student notifications & alerts
    │   ├── CommunityInfo.js     # Campus hub info & announcements
    │   └── index.js             # Unified models export
    ├── db/
    │   ├── migrate.js           # Index synchronizer
    │   └── seed.js              # Campus dataset seeder
    ├── middleware/
    │   ├── auth.js              # JWT authentication guards
    │   ├── errorHandler.js      # Error handling middleware
    │   └── upload.js            # Multer file upload handler
    ├── utils/
    │   ├── helpers.js           # ID generators, transaction code generator, JSON helpers
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
    │   └── index.js             # API router aggregator & /api/health
    ├── app.js                   # Express application setup
    └── server.js                # Server entrypoint (MongoDB connect + listen)
```

---

## ⚙️ Environment Variables

Create `.env` in the `backend/` directory:

```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# MongoDB Atlas Connection URI:
MONGODB_URI=your_mongodb_atlas_connection_string

CLIENT_URL=http://localhost:3000
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write privileges in Database Access.
3. Add your IP address (or `0.0.0.0/0`) in Network Access.
4. Copy the connection string into `backend/.env` under `MONGODB_URI`.

### 3. Run Migrations & Seed (Optional - auto-runs on start)
```bash
# Sync MongoDB indexes
npm run migrate

# Seed initial campus dataset
npm run seed
```

### 4. Start the Server
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
- `GET /api/health` - Check API and MongoDB Atlas connection status

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account (`fullName`, `email`, `password`, `community`, `department`)
- `POST /api/auth/login` - Authenticate (`email`, `password`)
- `GET /api/auth/me` - Authenticated user session with badges & history

### Resources (`/api/resources`)
- `GET /api/resources` - List resources with filtering (`category`, `sharingType`, `status`, `search`, `community`, `isUrgent`)
- `GET /api/resources/:id` - Resource details (increments views count)
- `POST /api/resources` - Post new resource (Auth required)
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
- `POST /api/transactions/:id/complete` - Mark handover complete (+50 RePoints)
- `POST /api/transactions/:id/return` - Confirm return of borrowed resource (+25 RePoints)

### Users & Community (`/api/users`, `/api/community`)
- `GET /api/users/profile` - Detailed user profile with stats & badges
- `PUT /api/users/profile` - Update profile information
- `GET /api/users/leaderboard` - Campus leaderboard rankings
- `GET /api/community` - Campus hub stats & announcements

### File Uploads (`/api/upload`)
- `POST /api/upload` - Upload image for resource / avatar (`multipart/form-data`)
