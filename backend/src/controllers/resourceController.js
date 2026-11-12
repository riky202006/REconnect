import db from '../config/db.js';
import { generateId, safeJsonParse } from '../utils/helpers.js';

function formatResource(r) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    sharingType: r.sharing_type,
    condition: r.condition,
    status: r.status,
    community: r.community,
    pickupInfo: r.pickup_info,
    contactPreference: r.contact_preference,
    images: safeJsonParse(r.images, []),
    postedBy: {
      id: r.posted_by_id,
      name: r.owner_name || 'Campus Student',
      avatar: r.owner_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: r.owner_community || r.community,
      rating: r.owner_rating ?? 5.0,
      verifiedStudent: Boolean(r.owner_verified ?? true)
    },
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    isUrgent: Boolean(r.is_urgent),
    returnPeriod: r.return_period,
    returnDate: r.return_date,
    exchangeItem: r.exchange_item,
    exchangeRequirements: r.exchange_requirements,
    foodExpiryDate: r.food_expiry_date,
    packagingInfo: r.packaging_info,
    storageInstructions: r.storage_instructions,
    viewsCount: r.views_count ?? 0,
    requestsCount: r.requests_count ?? 0,
    noteColor: r.note_color || '#FF6FA5'
  };
}

export const resourceController = {
  // GET /api/resources
  getAll: async (req, res, next) => {
    try {
      const { category, sharingType, status, search, community, isUrgent, userId } = req.query;

      let sql = `
        SELECT r.*,
               u.name as owner_name, u.avatar as owner_avatar,
               u.community as owner_community, u.rating as owner_rating,
               u.verified_student as owner_verified
        FROM resources r
        JOIN users u ON r.posted_by_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramIdx = 1;

      if (category && category !== 'All') {
        sql += ` AND LOWER(r.category) = LOWER($${paramIdx++})`;
        params.push(category);
      }

      if (sharingType && sharingType !== 'ALL') {
        sql += ` AND r.sharing_type = $${paramIdx++}`;
        params.push(sharingType);
      }

      if (status && status !== 'ALL') {
        sql += ` AND r.status = $${paramIdx++}`;
        params.push(status);
      }

      if (community && community !== 'All') {
        sql += ` AND r.community = $${paramIdx++}`;
        params.push(community);
      }

      if (isUrgent === 'true' || isUrgent === true) {
        sql += ` AND r.is_urgent = $${paramIdx++}`;
        params.push(true);
      }

      if (userId) {
        sql += ` AND r.posted_by_id = $${paramIdx++}`;
        params.push(userId);
      }

      if (search) {
        sql += ` AND (LOWER(r.title) LIKE $${paramIdx} OR LOWER(r.description) LIKE $${paramIdx} OR LOWER(r.category) LIKE $${paramIdx})`;
        params.push(`%${search.toLowerCase()}%`);
        paramIdx++;
      }

      sql += ` ORDER BY r.is_urgent DESC, r.created_at DESC`;

      const { rows } = await db.query(sql, params);
      return res.json(rows.map(formatResource));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/resources/:id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Increment views count
      await db.query(`UPDATE resources SET views_count = views_count + 1 WHERE id = $1`, [id]);

      const { rows } = await db.query(
        `SELECT r.*,
                u.name as owner_name, u.avatar as owner_avatar,
                u.community as owner_community, u.rating as owner_rating,
                u.verified_student as owner_verified
         FROM resources r
         JOIN users u ON r.posted_by_id = u.id
         WHERE r.id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      return res.json(formatResource(rows[0]));
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
      const now = new Date().toISOString();
      const imagesJson = JSON.stringify(images || []);

      await db.query(
        `INSERT INTO resources (
          id, title, description, category, sharing_type, condition, status, community,
          pickup_info, contact_preference, images, posted_by_id, is_urgent, return_period,
          return_date, exchange_item, exchange_requirements, food_expiry_date, packaging_info,
          storage_instructions, views_count, requests_count, note_color, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
        [
          id,
          title,
          description,
          category,
          sharingType,
          condition || 'Good Condition',
          'AVAILABLE',
          community || req.user.community,
          pickupInfo || 'Campus Pickup Spot',
          contactPreference || 'Campus Email',
          imagesJson,
          req.user.id,
          Boolean(isUrgent),
          returnPeriod || null,
          returnDate || null,
          exchangeItem || null,
          exchangeRequirements || null,
          foodExpiryDate || null,
          packagingInfo || null,
          storageInstructions || null,
          1,
          0,
          noteColor || '#DDF247',
          now,
          now
        ]
      );

      const { rows } = await db.query(
        `SELECT r.*,
                u.name as owner_name, u.avatar as owner_avatar,
                u.community as owner_community, u.rating as owner_rating,
                u.verified_student as owner_verified
         FROM resources r
         JOIN users u ON r.posted_by_id = u.id
         WHERE r.id = $1`,
        [id]
      );

      return res.status(201).json(formatResource(rows[0]));
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

      // Verify ownership
      const { rows: existing } = await db.query('SELECT posted_by_id FROM resources WHERE id = $1', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (existing[0].posted_by_id !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to edit this listing.' });
      }

      const now = new Date().toISOString();
      const imagesJson = images ? JSON.stringify(images) : undefined;

      await db.query(
        `UPDATE resources
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             sharing_type = COALESCE($4, sharing_type),
             condition = COALESCE($5, condition),
             community = COALESCE($6, community),
             pickup_info = COALESCE($7, pickup_info),
             contact_preference = COALESCE($8, contact_preference),
             images = COALESCE($9, images),
             is_urgent = COALESCE($10, is_urgent),
             return_period = COALESCE($11, return_period),
             return_date = COALESCE($12, return_date),
             exchange_item = COALESCE($13, exchange_item),
             exchange_requirements = COALESCE($14, exchange_requirements),
             food_expiry_date = COALESCE($15, food_expiry_date),
             packaging_info = COALESCE($16, packaging_info),
             storage_instructions = COALESCE($17, storage_instructions),
             status = COALESCE($18, status),
             note_color = COALESCE($19, note_color),
             updated_at = $20
         WHERE id = $21`,
        [
          title,
          description,
          category,
          sharingType,
          condition,
          community,
          pickupInfo,
          contactPreference,
          imagesJson,
          isUrgent !== undefined ? Boolean(isUrgent) : null,
          returnPeriod,
          returnDate,
          exchangeItem,
          exchangeRequirements,
          foodExpiryDate,
          packagingInfo,
          storageInstructions,
          status,
          noteColor,
          now,
          id
        ]
      );

      const { rows } = await db.query(
        `SELECT r.*,
                u.name as owner_name, u.avatar as owner_avatar,
                u.community as owner_community, u.rating as owner_rating,
                u.verified_student as owner_verified
         FROM resources r
         JOIN users u ON r.posted_by_id = u.id
         WHERE r.id = $1`,
        [id]
      );

      return res.json(formatResource(rows[0]));
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

      const now = new Date().toISOString();
      await db.query(`UPDATE resources SET status = $1, updated_at = $2 WHERE id = $3`, [status, now, id]);

      return res.json({ success: true, id, status });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/resources/:id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const { rows } = await db.query('SELECT posted_by_id FROM resources WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (rows[0].posted_by_id !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this listing.' });
      }

      await db.query('DELETE FROM resources WHERE id = $1', [id]);
      return res.json({ success: true, id });
    } catch (err) {
      next(err);
    }
  }
};

