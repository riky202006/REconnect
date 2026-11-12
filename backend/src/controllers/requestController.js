import { Request, Resource, User, Notification, Transaction, RewardHistory } from '../models/index.js';
import { generateId, generateTransactionCode, safeJsonParse } from '../utils/helpers.js';

function formatRequest(r) {
  const resObj = r.resource && typeof r.resource === 'object' ? r.resource : null;
  const requesterObj = r.requester && typeof r.requester === 'object' ? r.requester : null;
  const ownerObj = resObj && resObj.postedBy && typeof resObj.postedBy === 'object' ? resObj.postedBy : null;
  const images = resObj?.images ? (Array.isArray(resObj.images) ? resObj.images : safeJsonParse(resObj.images, [])) : [];

  return {
    id: r._id || r.id,
    resourceId: resObj ? (resObj._id || resObj.id) : (r.resource || r.resource_id),
    resourceTitle: resObj?.title || r.resource_title || 'Campus Resource',
    resourceCategory: resObj?.category || r.resource_category || 'General',
    sharingType: resObj?.sharingType || r.sharing_type || 'DONATE',
    resourceImage: images.length > 0 ? images[0] : null,
    requester: {
      id: requesterObj ? (requesterObj._id || requesterObj.id) : (r.requester || r.requester_id),
      name: requesterObj?.name || 'Campus Member',
      email: requesterObj?.email || '',
      department: requesterObj?.department || 'ADTU Student',
      avatar: requesterObj?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: ownerObj ? (ownerObj._id || ownerObj.id) : (resObj?.postedBy || 'usr_unknown'),
      name: ownerObj?.name || 'Campus Student'
    },
    message: r.message,
    status: r.status,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
    pickupLocation: r.pickupLocation,
    preferredTime: r.preferredTime,
    returnDate: r.returnDate,
    returned: Boolean(r.returned)
  };
}

export const requestController = {
  // GET /api/requests
  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const userResourceIds = await Resource.find({ postedBy: userId }).distinct('_id');

      const requests = await Request.find({
        $or: [
          { requester: userId },
          { resource: { $in: userResourceIds } }
        ]
      })
        .populate({
          path: 'resource',
          populate: { path: 'postedBy', select: 'name email avatar department community rating verifiedStudent' }
        })
        .populate('requester', 'name email avatar department community rating verifiedStudent')
        .sort({ createdAt: -1 });

      return res.json(requests.map(formatRequest));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/requests
  create: async (req, res, next) => {
    try {
      const { resourceId, message, preferredTime, pickupLocation } = req.body;
      const requesterId = req.user.id;

      if (!resourceId) {
        return res.status(400).json({ message: 'Resource ID is required.' });
      }

      const resource = await Resource.findById(resourceId).populate('postedBy');
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found.' });
      }

      const ownerId = resource.postedBy && typeof resource.postedBy === 'object' ? resource.postedBy._id : resource.postedBy;
      if (ownerId === requesterId) {
        return res.status(400).json({ message: 'You cannot request your own listed resource!' });
      }

      const reqId = generateId('req');
      const now = new Date().toISOString();

      const newRequest = await Request.create({
        _id: reqId,
        resource: resourceId,
        requester: requesterId,
        message: message || 'I would like to request this item for my campus studies.',
        status: 'PENDING',
        pickupLocation: pickupLocation || resource.pickupInfo || 'Campus Pickup Spot',
        preferredTime: preferredTime || 'Flexible this week'
      });

      // Increment requests count on resource
      await Resource.findByIdAndUpdate(resourceId, { $inc: { requestsCount: 1 } });

      // Create notification for owner
      await Notification.create({
        _id: generateId('notif'),
        user: ownerId,
        title: 'New request received',
        message: `${req.user.name} requested your "${resource.title.slice(0, 25)}..."`,
        time: 'Just now',
        read: false,
        link: '/dashboard/requests'
      });

      const populatedRequest = await Request.findById(reqId)
        .populate({
          path: 'resource',
          populate: { path: 'postedBy', select: 'name email avatar department community rating verifiedStudent' }
        })
        .populate('requester', 'name email avatar department community rating verifiedStudent');

      return res.status(201).json(formatRequest(populatedRequest));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/requests/:id/status
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }

      const targetReq = await Request.findById(id)
        .populate({
          path: 'resource',
          populate: { path: 'postedBy' }
        })
        .populate('requester');

      if (!targetReq) {
        return res.status(404).json({ message: 'Request not found.' });
      }

      const resource = targetReq.resource;
      const owner = resource?.postedBy;
      const ownerId = owner && typeof owner === 'object' ? owner._id : owner;
      const requesterId = targetReq.requester && typeof targetReq.requester === 'object' ? targetReq.requester._id : targetReq.requester;

      // Ownership authorization check
      if (req.user.id !== ownerId && req.user.id !== requesterId) {
        return res.status(403).json({ message: 'You are not authorized to modify this request.' });
      }

      // Owner-only transitions
      if (['ACCEPTED', 'REJECTED', 'READY_PICKUP'].includes(status) && req.user.id !== ownerId) {
        return res.status(403).json({ message: 'Only the resource owner can accept, reject, or mark ready for pickup.' });
      }

      targetReq.status = status;
      await targetReq.save();

      const now = new Date().toISOString();
      const requesterName = targetReq.requester?.name || 'Campus Student';
      const ownerName = owner?.name || 'Campus Student';
      const resourceTitle = resource?.title || 'Resource';

      // State transitions
      if (status === 'ACCEPTED') {
        if (resource) {
          await Resource.findByIdAndUpdate(resource._id, { status: 'RESERVED' });
        }

        // Notify requester
        await Notification.create({
          _id: generateId('notif'),
          user: requesterId,
          title: 'Request accepted!',
          message: `${ownerName} accepted your request for "${resourceTitle.slice(0, 25)}..."`,
          time: 'Just now',
          read: false,
          link: '/dashboard/requests'
        });
      } else if (status === 'READY_PICKUP') {
        await Notification.create({
          _id: generateId('notif'),
          user: requesterId,
          title: 'Ready for pickup!',
          message: `"${resourceTitle.slice(0, 25)}..." is ready for campus collection!`,
          time: 'Just now',
          read: false,
          link: '/dashboard/requests'
        });
      } else if (status === 'COMPLETED') {
        if (resource) {
          await Resource.findByIdAndUpdate(resource._id, { status: 'CLAIMED' });
        }

        // Create transaction record
        const txnId = generateId('txn');
        const txnCode = generateTransactionCode();
        const images = resource?.images ? (Array.isArray(resource.images) ? resource.images : safeJsonParse(resource.images, [])) : [];

        await Transaction.create({
          _id: txnId,
          transactionCode: txnCode,
          resource: resource?._id || null,
          resourceTitle: resourceTitle,
          resourceImage: images.length > 0 ? images[0] : null,
          category: resource?.category || 'General',
          sharingType: resource?.sharingType || 'DONATE',
          provider: ownerId,
          receiver: requesterId,
          date: now.split('T')[0],
          status: 'COMPLETED',
          pointsEarned: 50,
          community: 'ADTU - Main Campus (Panikhaiti)',
          pickupDetails: targetReq.pickupLocation || 'Campus Pickup',
          returnDate: targetReq.returnDate,
          notes: 'Handover successfully completed and verified on campus.'
        });

        // Award +50 RePoints to provider
        await User.findByIdAndUpdate(ownerId, { $inc: { rePoints: 50 } });

        // Record reward history
        await RewardHistory.create({
          _id: generateId('rw'),
          user: ownerId,
          action: `Completed handover: "${resourceTitle.slice(0, 22)}"`,
          points: 50,
          date: now.split('T')[0],
          type: 'earn'
        });

        // Notify provider
        await Notification.create({
          _id: generateId('notif'),
          user: ownerId,
          title: '+50 RePoints Awarded!',
          message: `Handover of "${resourceTitle.slice(0, 20)}..." completed.`,
          time: 'Just now',
          read: false,
          link: '/dashboard/profile'
        });
      } else if (status === 'REJECTED') {
        if (resource && resource.status === 'RESERVED') {
          await Resource.findByIdAndUpdate(resource._id, { status: 'AVAILABLE' });
        }
      }

      const updatedReq = await Request.findById(id)
        .populate({
          path: 'resource',
          populate: { path: 'postedBy', select: 'name email avatar department community rating verifiedStudent' }
        })
        .populate('requester', 'name email avatar department community rating verifiedStudent');

      return res.json(formatRequest(updatedReq));
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/requests/:id
  cancel: async (req, res, next) => {
    try {
      const { id } = req.params;

      const targetReq = await Request.findById(id).populate('resource');
      if (!targetReq) {
        return res.status(404).json({ message: 'Request not found.' });
      }

      const resource = targetReq.resource;
      const ownerId = resource?.postedBy && typeof resource.postedBy === 'object' ? resource.postedBy._id : resource?.postedBy;
      const requesterId = targetReq.requester && typeof targetReq.requester === 'object' ? targetReq.requester._id : targetReq.requester;

      if (req.user.id !== ownerId && req.user.id !== requesterId) {
        return res.status(403).json({ message: 'You are not authorized to cancel this request.' });
      }

      targetReq.status = 'CANCELLED';
      await targetReq.save();

      // If resource was RESERVED by this request, release it back to AVAILABLE
      if (resource && resource.status === 'RESERVED') {
        await Resource.findByIdAndUpdate(resource._id, { status: 'AVAILABLE' });
      }

      return res.json({ success: true, id, status: 'CANCELLED' });
    } catch (err) {
      next(err);
    }
  }
};

export default requestController;
