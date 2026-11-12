import { Notification } from '../models/index.js';

export const notificationController = {
  // GET /api/notifications
  getAll: async (req, res, next) => {
    try {
      const rows = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

      return res.json(
        rows.map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: n.time,
          read: Boolean(n.read),
          link: n.link,
          createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString()
        }))
      );
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/notifications/read-all
  markAllRead: async (req, res, next) => {
    try {
      await Notification.updateMany({ user: req.user.id }, { read: true });
      return res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/notifications/:id/read
  markRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const notif = await Notification.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { read: true },
        { returnDocument: 'after' }
      );
      if (!notif) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      return res.json({ success: true, id, read: true });
    } catch (err) {
      next(err);
    }
  }
};

export default notificationController;
