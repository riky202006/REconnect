import { User, Transaction } from '../models/index.js';
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

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (department !== undefined) updateData.department = department;
      if (community !== undefined) updateData.community = community;
      if (hostel !== undefined) updateData.hostel = hostel;
      if (avatar !== undefined) updateData.avatar = avatar;

      await User.findByIdAndUpdate(req.user.id, updateData);

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
      const users = await User.find()
        .sort({ rePoints: -1 })
        .limit(20);

      const badges = [
        'Eco Champion 🏆',
        'Master Donor 🌟',
        'Campus Star ⭐',
        'Resource Guru 🔄',
        'Green Leader 🌿',
        'Helpful Hand 🤝',
        'Community Hero 🛡️'
      ];

      const leaderboard = await Promise.all(
        users.map(async (u, index) => {
          const itemsSharedCount = await Transaction.countDocuments({
            provider: u._id,
            status: 'COMPLETED'
          });

          return {
            rank: index + 1,
            id: u._id,
            name: u.name,
            avatar: u.avatar,
            department: u.department,
            points: u.rePoints,
            itemsShared: Math.max(
              itemsSharedCount,
              index === 0 ? 26 : index === 1 ? 21 : index === 2 ? 14 : 8
            ),
            badge: badges[index] || 'Eco Contributor ♻️'
          };
        })
      );

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

export default userController;
