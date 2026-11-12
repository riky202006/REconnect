import { Resource, User } from '../models/index.js';
import { generateId, safeJsonParse } from '../utils/helpers.js';

function formatResource(r) {
  const postedByObj = r.postedBy && typeof r.postedBy === 'object' ? r.postedBy : null;
  const images = Array.isArray(r.images) ? r.images : safeJsonParse(r.images, []);

  return {
    id: r._id || r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    sharingType: r.sharingType,
    condition: r.condition,
    status: r.status,
    community: r.community,
    pickupInfo: r.pickupInfo,
    contactPreference: r.contactPreference,
    images,
    postedBy: {
      id: postedByObj ? (postedByObj._id || postedByObj.id) : (r.postedBy || 'usr_unknown'),
      name: postedByObj?.name || 'Campus Student',
      avatar: postedByObj?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: postedByObj?.community || r.community,
      rating: postedByObj?.rating ?? 5.0,
      verifiedStudent: Boolean(postedByObj?.verifiedStudent ?? true)
    },
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
    isUrgent: Boolean(r.isUrgent),
    returnPeriod: r.returnPeriod,
    returnDate: r.returnDate,
    exchangeItem: r.exchangeItem,
    exchangeRequirements: r.exchangeRequirements,
    foodExpiryDate: r.foodExpiryDate,
    packagingInfo: r.packagingInfo,
    storageInstructions: r.storageInstructions,
    viewsCount: r.viewsCount ?? 0,
    requestsCount: r.requestsCount ?? 0,
    noteColor: r.noteColor || '#FF6FA5'
  };
}

export const resourceController = {
  // GET /api/resources
  getAll: async (req, res, next) => {
    try {
      const { category, sharingType, status, search, community, isUrgent, userId } = req.query;

      const filter = {};

      if (category && category !== 'All') {
        filter.category = new RegExp(`^${category.trim()}$`, 'i');
      }

      if (sharingType && sharingType !== 'ALL') {
        filter.sharingType = sharingType;
      }

      if (status && status !== 'ALL') {
        filter.status = status;
      }

      if (community && community !== 'All') {
        filter.community = community;
      }

      if (isUrgent === 'true' || isUrgent === true) {
        filter.isUrgent = true;
      }

      if (userId) {
        filter.postedBy = userId;
      }

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { description: regex },
          { category: regex }
        ];
      }

      const rows = await Resource.find(filter)
        .populate('postedBy', 'name avatar community rating verifiedStudent')
        .sort({ isUrgent: -1, createdAt: -1 });

      return res.json(rows.map(formatResource));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/resources/:id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const resource = await Resource.findByIdAndUpdate(
        id,
        { $inc: { viewsCount: 1 } },
        { returnDocument: 'after' }
      ).populate('postedBy', 'name avatar community rating verifiedStudent');

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      return res.json(formatResource(resource));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/resources
  create: async (req, res, next) => {
    try {
      const {
        title,
        description,
        category,
        sharingType,
        condition,
        community,
        pickupInfo,
        contactPreference,
        images,
        isUrgent,
        returnPeriod,
        returnDate,
        exchangeItem,
        exchangeRequirements,
        foodExpiryDate,
        packagingInfo,
        storageInstructions,
        noteColor
      } = req.body;

      if (!title || !description || !category || !sharingType) {
        return res.status(400).json({ message: 'Title, description, category, and sharing type are required.' });
      }

      const id = generateId('res');
      const processedImages = Array.isArray(images) ? images : safeJsonParse(images, []);

      const newResource = await Resource.create({
        _id: id,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        sharingType: sharingType.trim(),
        condition: condition || 'Good Condition',
        status: 'AVAILABLE',
        community: community || req.user.community,
        pickupInfo: pickupInfo || 'Campus Pickup Spot',
        contactPreference: contactPreference || 'Campus Email',
        images: processedImages,
        postedBy: req.user.id,
        isUrgent: Boolean(isUrgent),
        returnPeriod: returnPeriod || null,
        returnDate: returnDate || null,
        exchangeItem: exchangeItem || null,
        exchangeRequirements: exchangeRequirements || null,
        foodExpiryDate: foodExpiryDate || null,
        packagingInfo: packagingInfo || null,
        storageInstructions: storageInstructions || null,
        viewsCount: 1,
        requestsCount: 0,
        noteColor: noteColor || '#DDF247'
      });

      await newResource.populate('postedBy', 'name avatar community rating verifiedStudent');
      return res.status(201).json(formatResource(newResource));
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/resources/:id
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        category,
        sharingType,
        condition,
        community,
        pickupInfo,
        contactPreference,
        images,
        isUrgent,
        returnPeriod,
        returnDate,
        exchangeItem,
        exchangeRequirements,
        foodExpiryDate,
        packagingInfo,
        storageInstructions,
        status,
        noteColor
      } = req.body;

      const existing = await Resource.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const ownerId = existing.postedBy && typeof existing.postedBy === 'object' ? existing.postedBy._id : existing.postedBy;
      if (ownerId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to edit this listing.' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (sharingType !== undefined) updateData.sharingType = sharingType;
      if (condition !== undefined) updateData.condition = condition;
      if (community !== undefined) updateData.community = community;
      if (pickupInfo !== undefined) updateData.pickupInfo = pickupInfo;
      if (contactPreference !== undefined) updateData.contactPreference = contactPreference;
      if (images !== undefined) updateData.images = Array.isArray(images) ? images : safeJsonParse(images, []);
      if (isUrgent !== undefined) updateData.isUrgent = Boolean(isUrgent);
      if (returnPeriod !== undefined) updateData.returnPeriod = returnPeriod;
      if (returnDate !== undefined) updateData.returnDate = returnDate;
      if (exchangeItem !== undefined) updateData.exchangeItem = exchangeItem;
      if (exchangeRequirements !== undefined) updateData.exchangeRequirements = exchangeRequirements;
      if (foodExpiryDate !== undefined) updateData.foodExpiryDate = foodExpiryDate;
      if (packagingInfo !== undefined) updateData.packagingInfo = packagingInfo;
      if (storageInstructions !== undefined) updateData.storageInstructions = storageInstructions;
      if (status !== undefined) updateData.status = status;
      if (noteColor !== undefined) updateData.noteColor = noteColor;

      const updated = await Resource.findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
        .populate('postedBy', 'name avatar community rating verifiedStudent');

      return res.json(formatResource(updated));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/resources/:id/status
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }

      const existing = await Resource.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const ownerId = existing.postedBy && typeof existing.postedBy === 'object' ? existing.postedBy._id : existing.postedBy;
      if (ownerId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this listing status.' });
      }

      existing.status = status;
      await existing.save();

      return res.json({ success: true, id, status });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/resources/:id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existing = await Resource.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const ownerId = existing.postedBy && typeof existing.postedBy === 'object' ? existing.postedBy._id : existing.postedBy;
      if (ownerId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this listing.' });
      }

      await Resource.findByIdAndDelete(id);
      return res.json({ success: true, id });
    } catch (err) {
      next(err);
    }
  }
};

export default resourceController;
