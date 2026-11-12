import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { generateId } from '../utils/helpers.js';

/**
 * Helper to fetch a complete user object with dynamic stats, badges, and rewards history.
 */
export async function getFullUserProfile(userId) {
  const { rows: userRows } = await db.query(
    `SELECT id, name, email, department, community, hostel, avatar, re_points, level, joined_date, rating, verified_student
     FROM users WHERE id = $1`,
    [userId]
  );

  if (userRows.length === 0) return null;
  const rawUser = userRows[0];

  // Dynamic stats
  const { rows: sharedCount } = await db.query(
    `SELECT COUNT(*) as count FROM transactions WHERE provider_id = $1 AND status = 'COMPLETED'`,
    [userId]
  );
  const { rows: borrowedCount } = await db.query(
    `SELECT COUNT(*) as count FROM transactions WHERE receiver_id = $1 AND sharing_type = 'BORROW'`,
    [userId]
  );
  const { rows: exchangedCount } = await db.query(
    `SELECT COUNT(*) as count FROM transactions WHERE (provider_id = $1 OR receiver_id = $1) AND sharing_type = 'EXCHANGE' AND status = 'COMPLETED'`,
    [userId]
  );
  const { rows: activeListings } = await db.query(
    `SELECT COUNT(*) as count FROM resources WHERE posted_by_id = $1 AND status = 'AVAILABLE'`,
    [userId]
  );
  const { rows: incomingReqs } = await db.query(
    `SELECT COUNT(*) as count FROM requests req
     JOIN resources res ON req.resource_id = res.id
     WHERE res.posted_by_id = $1 AND req.status = 'PENDING'`,
    [userId]
  );

  // User Badges
  const { rows: badges } = await db.query(
    `SELECT badge_id as id, title, icon, description, earned_at as earnedAt
     FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC`,
    [userId]
  );

  // Rewards History
  const { rows: rewardsHistory } = await db.query(
    `SELECT id, action, points, date, type
     FROM rewards_history WHERE user_id = $1 ORDER BY date DESC, created_at DESC`,
    [userId]
  );

  const itemsShared = parseInt(sharedCount[0]?.count || 0, 10);
  const itemsBorrowed = parseInt(borrowedCount[0]?.count || 0, 10);
  const itemsExchanged = parseInt(exchangedCount[0]?.count || 0, 10);

  return {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    department: rawUser.department || 'ADTU Student',
    community: rawUser.community || 'ADTU - Main Campus (Panikhaiti)',
    hostel: rawUser.hostel || 'Campus Residence',
    avatar: rawUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rePoints: rawUser.re_points ?? 0,
    level: rawUser.level || 'Campus Champion',
    joinedDate: rawUser.joined_date || 'March 2026',
    rating: rawUser.rating ?? 5.0,
    verifiedStudent: Boolean(rawUser.verified_student),
    stats: {
      itemsShared: Math.max(itemsShared, rawUser.id === 'usr_001' ? 14 : itemsShared),
      itemsBorrowed: Math.max(itemsBorrowed, rawUser.id === 'usr_001' ? 6 : itemsBorrowed),
      itemsExchanged: Math.max(itemsExchanged, rawUser.id === 'usr_001' ? 3 : itemsExchanged),
      co2SavedKg: parseFloat((Math.max(itemsShared, rawUser.id === 'usr_001' ? 14 : itemsShared) * 3.1).toFixed(1)),
      activeListings: parseInt(activeListings[0]?.count || 0, 10),
      incomingRequests: parseInt(incomingReqs[0]?.count || 0, 10)
    },
    badges: badges.length > 0 ? badges : [
      { id: 'b_welcome', title: 'New Pioneer', icon: '🌱', description: 'Joined ReConnect Community', earnedAt: 'Recent' }
    ],
    rewardsHistory
  };
}

export const authController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { fullName, name, email, password, department, community, hostel, avatar } = req.body;
      const userName = fullName || name;

      if (!userName || !email || !password) {
        return res.status(400).json({ message: 'Full name, email, and password are required.' });
      }

      // Check existing user
      const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'An account with this campus email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = generateId('usr');
      const now = new Date().toISOString();
      const joinedDate = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const initialPoints = 50; // Welcome points

      await db.query(
        `INSERT INTO users (id, name, email, password, department, community, hostel, avatar, re_points, level, joined_date, rating, verified_student, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          userId,
          userName.trim(),
          email.toLowerCase().trim(),
          hashedPassword,
          department || 'Undergraduate Student',
          community || 'ADTU - Main Campus (Panikhaiti)',
          hostel || '',
          avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          initialPoints,
          'Campus Pioneer',
          joinedDate,
          5.0,
          true,
          now,
          now
        ]
      );

      // Welcome reward entry
      await db.query(
        `INSERT INTO rewards_history (id, user_id, action, points, date, type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          generateId('rw'),
          userId,
          'Welcome to ReConnect Bonus',
          initialPoints,
          now.split('T')[0],
          'earn',
          now
        ]
      );

      // Welcome badge
      await db.query(
        `INSERT INTO user_badges (id, user_id, badge_id, title, icon, description, earned_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          generateId('bdg'),
          userId,
          'b_welcome',
          'Eco-Pioneer',
          '🌱',
          'Joined the campus circular economy network',
          joinedDate
        ]
      );

      const user = await getFullUserProfile(userId);
      const token = generateToken({ id: user.id, email: user.email });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        user,
        token
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const { rows } = await db.query(
        'SELECT id, password FROM users WHERE LOWER(email) = LOWER($1)',
        [email.trim()]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, rows[0].password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const user = await getFullUserProfile(rows[0].id);
      const token = generateToken({ id: user.id, email: user.email });

      return res.json({
        success: true,
        message: 'Login successful!',
        user,
        token
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  getMe: async (req, res, next) => {
    try {
      const user = await getFullUserProfile(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
};

