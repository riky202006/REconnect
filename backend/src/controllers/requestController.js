import db from '../config/db.js';
import { generateId, generateTransactionCode, safeJsonParse } from '../utils/helpers.js';

function formatRequest(r) {
  const images = safeJsonParse(r.resource_images, []);
  return {
    id: r.id,
    resourceId: r.resource_id,
    resourceTitle: r.resource_title,
    resourceCategory: r.resource_category,
    sharingType: r.resource_sharing_type,
    resourceImage: images.length > 0 ? images[0] : null,
    requester: {
      id: r.requester_id,
      name: r.requester_name,
      email: r.requester_email,
      department: r.requester_dept,
      avatar: r.requester_avatar
    },
    owner: {
      id: r.owner_id,
      name: r.owner_name
    },
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pickupLocation: r.pickup_location,
    preferredTime: r.preferred_time,
    returnDate: r.return_date,
    returned: Boolean(r.returned)
  };
}

export const requestController = {
  // GET /api/requests
  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const { rows } = await db.query(
        `SELECT req.*,
                res.title as resource_title, res.category as resource_category,
                res.sharing_type as resource_sharing_type, res.images as resource_images,
                res.posted_by_id as owner_id,
                owner_user.name as owner_name,
                requester_user.name as requester_name, requester_user.email as requester_email,
                requester_user.department as requester_dept, requester_user.avatar as requester_avatar
         FROM requests req
         JOIN resources res ON req.resource_id = res.id
         JOIN users owner_user ON res.posted_by_id = owner_user.id
         JOIN users requester_user ON req.requester_id = requester_user.id
         WHERE req.requester_id = $1 OR res.posted_by_id = $1
         ORDER BY req.created_at DESC`,
        [userId]
      );

      return res.json(rows.map(formatRequest));
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

      // Check resource existence and ownership
      const { rows: resourceRows } = await db.query(
        `SELECT id, title, posted_by_id, pickup_info, images FROM resources WHERE id = $1`,
        [resourceId]
      );

      if (resourceRows.length === 0) {
        return res.status(404).json({ message: 'Resource not found.' });
      }

      const resource = resourceRows[0];

      if (resource.posted_by_id === requesterId) {
        return res.status(400).json({ message: 'You cannot request your own listed resource!' });
      }

      const reqId = generateId('req');
      const now = new Date().toISOString();

      await db.query(
        `INSERT INTO requests (id, resource_id, requester_id, message, status, pickup_location, preferred_time, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          reqId,
          resourceId,
          requesterId,
          message || 'I would like to request this item for my campus studies.',
          'PENDING',
          pickupLocation || resource.pickup_info || 'Campus Pickup Spot',
          preferredTime || 'Flexible this week',
          now,
          now
        ]
      );

      // Increment requests count on resource
      await db.query(`UPDATE resources SET requests_count = requests_count + 1 WHERE id = $1`, [resourceId]);

      // Create notification for owner
      await db.query(
        `INSERT INTO notifications (id, user_id, title, message, time, read, link, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          generateId('notif'),
          resource.posted_by_id,
          'New request received',
          `${req.user.name} requested your "${resource.title.slice(0, 25)}..."`,
          'Just now',
          false,
          '/dashboard/requests',
          now
        ]
      );

      // Fetch created request
      const { rows } = await db.query(
        `SELECT req.*,
                res.title as resource_title, res.category as resource_category,
                res.sharing_type as resource_sharing_type, res.images as resource_images,
                res.posted_by_id as owner_id,
                owner_user.name as owner_name,
                requester_user.name as requester_name, requester_user.email as requester_email,
                requester_user.department as requester_dept, requester_user.avatar as requester_avatar
         FROM requests req
         JOIN resources res ON req.resource_id = res.id
         JOIN users owner_user ON res.posted_by_id = owner_user.id
         JOIN users requester_user ON req.requester_id = requester_user.id
         WHERE req.id = $1`,
        [reqId]
      );

      return res.status(201).json(formatRequest(rows[0]));
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

      const { rows: reqRows } = await db.query(
        `SELECT req.*, res.title as resource_title, res.category, res.sharing_type, res.images,
                res.posted_by_id as owner_id, owner_user.name as owner_name,
                requester_user.name as requester_name
         FROM requests req
         JOIN resources res ON req.resource_id = res.id
         JOIN users owner_user ON res.posted_by_id = owner_user.id
         JOIN users requester_user ON req.requester_id = requester_user.id
         WHERE req.id = $1`,
        [id]
      );

      if (reqRows.length === 0) {
        return res.status(404).json({ message: 'Request not found.' });
      }

      const targetReq = reqRows[0];
      const now = new Date().toISOString();

      await db.query(
        `UPDATE requests SET status = $1, updated_at = $2 WHERE id = $3`,
        [status, now, id]
      );

      // Handle lifecycle state transitions
      if (status === 'ACCEPTED') {
        await db.query(`UPDATE resources SET status = 'RESERVED', updated_at = $1 WHERE id = $2`, [now, targetReq.resource_id]);

        // Notify requester
        await db.query(
          `INSERT INTO notifications (id, user_id, title, message, time, read, link, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            generateId('notif'),
            targetReq.requester_id,
            'Request accepted!',
            `${targetReq.owner_name} accepted your request for "${targetReq.resource_title.slice(0, 25)}..."`,
            'Just now',
            false,
            '/dashboard/requests',
            now
          ]
        );
      } else if (status === 'READY_PICKUP') {
        await db.query(
          `INSERT INTO notifications (id, user_id, title, message, time, read, link, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            generateId('notif'),
            targetReq.requester_id,
            'Ready for pickup!',
            `"${targetReq.resource_title.slice(0, 25)}..." is ready for campus collection!`,
            'Just now',
            false,
            '/dashboard/requests',
            now
          ]
        );
      } else if (status === 'COMPLETED') {
        // Mark resource CLAIMED
        await db.query(`UPDATE resources SET status = 'CLAIMED', updated_at = $1 WHERE id = $2`, [now, targetReq.resource_id]);

        // Create transaction record
        const txnId = generateId('txn');
        const txnCode = generateTransactionCode();
        const images = safeJsonParse(targetReq.images, []);

        await db.query(
          `INSERT INTO transactions (
            id, transaction_code, resource_id, resource_title, resource_image, category,
            sharing_type, provider_id, receiver_id, date, status, points_earned,
            community, pickup_details, return_date, notes, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            txnId,
            txnCode,
            targetReq.resource_id,
            targetReq.resource_title,
            images.length > 0 ? images[0] : null,
            targetReq.category,
            targetReq.sharing_type,
            targetReq.owner_id,
            targetReq.requester_id,
            now.split('T')[0],
            'COMPLETED',
            50,
            'ADTU - Main Campus (Panikhaiti)',
            targetReq.pickup_location || 'Campus Pickup',
            targetReq.return_date,
            'Handover successfully completed and verified on campus.',
            now,
            now
          ]
        );

        // Award +50 RePoints to provider
        await db.query(`UPDATE users SET re_points = re_points + 50 WHERE id = $1`, [targetReq.owner_id]);

        // Record reward history
        await db.query(
          `INSERT INTO rewards_history (id, user_id, action, points, date, type, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            generateId('rw'),
            targetReq.owner_id,
            `Completed handover: "${targetReq.resource_title.slice(0, 22)}"`,
            50,
            now.split('T')[0],
            'earn',
            now
          ]
        );

        // Notify provider and requester
        await db.query(
          `INSERT INTO notifications (id, user_id, title, message, time, read, link, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            generateId('notif'),
            targetReq.owner_id,
            '+50 RePoints Awarded!',
            `Handover of "${targetReq.resource_title.slice(0, 20)}..." completed.`,
            'Just now',
            false,
            '/dashboard/profile',
            now
          ]
        );
      } else if (status === 'REJECTED') {
        // Reset resource to AVAILABLE if it was reserved
        await db.query(`UPDATE resources SET status = 'AVAILABLE', updated_at = $1 WHERE id = $2 AND status = 'RESERVED'`, [now, targetReq.resource_id]);
      }

      // Fetch updated request
      const { rows } = await db.query(
        `SELECT req.*,
                res.title as resource_title, res.category as resource_category,
                res.sharing_type as resource_sharing_type, res.images as resource_images,
                res.posted_by_id as owner_id,
                owner_user.name as owner_name,
                requester_user.name as requester_name, requester_user.email as requester_email,
                requester_user.department as requester_dept, requester_user.avatar as requester_avatar
         FROM requests req
         JOIN resources res ON req.resource_id = res.id
         JOIN users owner_user ON res.posted_by_id = owner_user.id
         JOIN users requester_user ON req.requester_id = requester_user.id
         WHERE req.id = $1`,
        [id]
      );

      return res.json(formatRequest(rows[0]));
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/requests/:id
  cancel: async (req, res, next) => {
    try {
      const { id } = req.params;
      const now = new Date().toISOString();

      await db.query(`UPDATE requests SET status = 'CANCELLED', updated_at = $1 WHERE id = $2`, [now, id]);
      return res.json({ success: true, id, status: 'CANCELLED' });
    } catch (err) {
      next(err);
    }
  }
};

