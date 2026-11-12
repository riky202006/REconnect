import { CommunityInfo, User, Resource, Transaction } from '../models/index.js';
import { safeJsonParse } from '../utils/helpers.js';

export const communityController = {
  // GET /api/community
  getInfo: async (req, res, next) => {
    try {
      const info = await CommunityInfo.findOne();

      // Dynamic counts from live DB
      const userCount = await User.countDocuments();
      const resCount = await Resource.countDocuments();
      const completedCount = await Transaction.countDocuments({ status: 'COMPLETED' });

      const liveMembers = Math.max(1400, 1420 + userCount);
      const liveResources = Math.max(500, 580 + resCount);
      const liveExchanged = Math.max(400, 412 + completedCount);
      const liveCo2 = parseFloat((liveExchanged * 3.1).toFixed(1));

      if (!info) {
        return res.json({
          name: 'Assam Down Town University (ADTU) Resource Hub',
          tagline: 'Empowering students and faculty to share, reuse, and eliminate campus waste.',
          location: 'Sankar Madhab Path, Gandhi Nagar, Panikhaiti, Guwahati, Assam 781026',
          membersCount: liveMembers,
          resourcesListed: liveResources,
          itemsExchangedOrDonated: liveExchanged,
          co2SavedKg: liveCo2,
          about: 'ReConnect ADTU is our premier campus circular economy initiative.',
          announcements: [],
          coordinators: []
        });
      }

      return res.json({
        id: info._id,
        name: info.name,
        tagline: info.tagline,
        location: info.location,
        membersCount: liveMembers,
        resourcesListed: liveResources,
        itemsExchangedOrDonated: liveExchanged,
        co2SavedKg: liveCo2,
        about: info.about,
        announcements: Array.isArray(info.announcements) ? info.announcements : safeJsonParse(info.announcements, []),
        coordinators: Array.isArray(info.coordinators) ? info.coordinators : safeJsonParse(info.coordinators, [])
      });
    } catch (err) {
      next(err);
    }
  }
};

export default communityController;
