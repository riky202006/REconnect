-- ReConnect Campus Resource Sharing Platform SQL Schema
-- Compatible with PostgreSQL and SQLite

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  department TEXT,
  community TEXT,
  hostel TEXT,
  avatar TEXT,
  re_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Campus Member',
  joined_date TEXT,
  rating REAL DEFAULT 5.0,
  verified_student BOOLEAN DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  community TEXT,
  pickup_info TEXT,
  contact_preference TEXT,
  images TEXT DEFAULT '[]',
  posted_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_urgent BOOLEAN DEFAULT 0,
  return_period TEXT,
  return_date TEXT,
  exchange_item TEXT,
  exchange_requirements TEXT,
  food_expiry_date TEXT,
  packaging_info TEXT,
  storage_instructions TEXT,
  views_count INTEGER DEFAULT 0,
  requests_count INTEGER DEFAULT 0,
  note_color TEXT DEFAULT '#FF6FA5',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  pickup_location TEXT,
  preferred_time TEXT,
  return_date TEXT,
  returned BOOLEAN DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  transaction_code TEXT UNIQUE NOT NULL,
  resource_id TEXT,
  resource_title TEXT NOT NULL,
  resource_image TEXT,
  category TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  provider_id TEXT NOT NULL REFERENCES users(id),
  receiver_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
  points_earned INTEGER DEFAULT 0,
  community TEXT,
  pickup_details TEXT,
  return_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 5. Rewards History Table
CREATE TABLE IF NOT EXISTS rewards_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 6. User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  earned_at TEXT NOT NULL
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT,
  read BOOLEAN DEFAULT 0,
  link TEXT,
  created_at TEXT NOT NULL
);

-- 8. Community Info Table
CREATE TABLE IF NOT EXISTS community_info (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  location TEXT,
  members_count INTEGER DEFAULT 0,
  resources_listed INTEGER DEFAULT 0,
  items_exchanged_or_donated INTEGER DEFAULT 0,
  co2_saved_kg REAL DEFAULT 0.0,
  about TEXT,
  announcements TEXT DEFAULT '[]',
  coordinators TEXT DEFAULT '[]'
);

-- Indexes for high performance queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_posted_by ON resources(posted_by_id);
CREATE INDEX IF NOT EXISTS idx_requests_resource ON requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

