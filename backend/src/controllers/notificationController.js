import db from '../config/db.js';

export const notificationController = {
  // GET /api/notifications
  getAll: async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `SELECT id, title, message, time, read, link, created_at as createdAt
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      return res.json(rows.map((n) => ({ ...n, read: Boolean(n.read) })));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/notifications/read-all
  markAllRead: async (req, res, next) => {
    try {
      await db.query(`UPDATE notifications SET read = 1 WHERE user_id = $1`, [req.user.id]);
      return res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/notifications/:id/read
  markRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      await db.query(`UPDATE notifications SET read = 1 WHERE id = $1 AND user_id = $2`, [id, req.user.id]);
      return res.json({ success: true, id, read: true });
    } catch (err) {
      next(err);
    }
  }
};

