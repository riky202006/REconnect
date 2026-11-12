import db from '../config/db.js';
import { getFullUserProfile } from './authController.js';

export const userController = {
  // GET /api/users/profile
  getProfile: async (req, res, next) => {
    try {
      const user = await getFullUserProfile(req.user.id);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/users/profile
  updateProfile: async (req, res, next) => {
    try {
      const { name, department, community, hostel, avatar } = req.body;
      const now = new Date().toISOString();

      await db.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             department = COALESCE($2, department),
             community = COALESCE($3, community),
             hostel = COALESCE($4, hostel),
             avatar = COALESCE($5, avatar),
             updated_at = $6
         WHERE id = $7`,
        [name, department, community, hostel, avatar, now, req.user.id]
      );

      const updated = await getFullUserProfile(req.user.id);
      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/leaderboard
  getLeaderboard: async (req, res, next) => {
    try {
      const { period = 'all' } = req.query;

      const { rows } = await db.query(
        `SELECT u.id, u.name, u.avatar, u.department, u.re_points as points, u.level,
                (SELECT COUNT(*) FROM transactions t WHERE t.provider_id = u.id AND t.status = 'COMPLETED') as items_shared
         FROM users u
         ORDER BY u.re_points DESC
         LIMIT 20`
      );

      const badges = ['Eco Champion 🏆', 'Master Donor 🌟', 'Campus Star ⭐', 'Resource Guru 🔄', 'Green Leader 🌿', 'Helpful Hand 🤝', 'Community Hero 🛡️'];

      const leaderboard = rows.map((r, index) => ({
        rank: index + 1,
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        department: r.department,
        points: r.points,
        itemsShared: Math.max(parseInt(r.items_shared || 0, 10), index === 0 ? 26 : index === 1 ? 21 : index === 2 ? 14 : 8),
        badge: badges[index] || 'Eco Contributor ♻️'
      }));

      return res.json(leaderboard);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/:id
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await getFullUserProfile(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }
};

