import db from '../config/db.js';
import { generateId } from '../utils/helpers.js';

function formatTransaction(t) {
  return {
    id: t.id,
    transactionCode: t.transaction_code,
    resourceTitle: t.resource_title,
    resourceImage: t.resource_image,
    category: t.category,
    sharingType: t.sharing_type,
    provider: {
      id: t.provider_id,
      name: t.provider_name
    },
    receiver: {
      id: t.receiver_id,
      name: t.receiver_name
    },
    date: t.date,
    status: t.status,
    pointsEarned: t.points_earned ?? 0,
    community: t.community || 'ADTU - Main Campus (Panikhaiti)',
    pickupDetails: t.pickup_details || 'Campus Pickup',
    returnDate: t.return_date,
    notes: t.notes
  };
}

export const transactionController = {
  // GET /api/transactions
  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const { rows } = await db.query(
        `SELECT t.*,
                pu.name as provider_name,
                ru.name as receiver_name
         FROM transactions t
         JOIN users pu ON t.provider_id = pu.id
         JOIN users ru ON t.receiver_id = ru.id
         WHERE t.provider_id = $1 OR t.receiver_id = $1
         ORDER BY t.date DESC, t.created_at DESC`,
        [userId]
      );

      return res.json(rows.map(formatTransaction));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/transactions/:id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const { rows } = await db.query(
        `SELECT t.*,
                pu.name as provider_name,
                ru.name as receiver_name
         FROM transactions t
         JOIN users pu ON t.provider_id = pu.id
         JOIN users ru ON t.receiver_id = ru.id
         WHERE t.id = $1 OR t.transaction_code = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      return res.json(formatTransaction(rows[0]));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/transactions/:id/complete
  complete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const now = new Date().toISOString();

      await db.query(
        `UPDATE transactions
         SET status = 'COMPLETED',
             notes = COALESCE($1, notes),
             points_earned = CASE WHEN points_earned = 0 THEN 50 ELSE points_earned END,
             updated_at = $2
         WHERE id = $3 OR transaction_code = $3`,
        [notes || 'Handover verified and transaction closed on campus.', now, id]
      );

      const { rows } = await db.query(
        `SELECT t.*, pu.name as provider_name, ru.name as receiver_name
         FROM transactions t
         JOIN users pu ON t.provider_id = pu.id
         JOIN users ru ON t.receiver_id = ru.id
         WHERE t.id = $1 OR t.transaction_code = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      return res.json(formatTransaction(rows[0]));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/transactions/:id/return
  confirmReturn: async (req, res, next) => {
    try {
      const { id } = req.params;
      const now = new Date().toISOString();

      const { rows: existing } = await db.query(
        `SELECT * FROM transactions WHERE id = $1 OR transaction_code = $1`,
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      const txn = existing[0];

      await db.query(
        `UPDATE transactions
         SET status = 'COMPLETED',
             notes = 'Borrowed item return confirmed and verified on campus. Transaction closed.',
             updated_at = $1
         WHERE id = $2`,
        [now, txn.id]
      );

      // If associated resource exists, make it AVAILABLE again
      if (txn.resource_id) {
        await db.query(
          `UPDATE resources SET status = 'AVAILABLE', updated_at = $1 WHERE id = $2`,
          [now, txn.resource_id]
        );
      }

      // Award +25 RePoints to current user
      await db.query(`UPDATE users SET re_points = re_points + 25 WHERE id = $1`, [req.user.id]);

      // Record reward
      await db.query(
        `INSERT INTO rewards_history (id, user_id, action, points, date, type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          generateId('rw'),
          req.user.id,
          'Verified return of borrowed resource',
          25,
          now.split('T')[0],
          'earn',
          now
        ]
      );

      const { rows } = await db.query(
        `SELECT t.*, pu.name as provider_name, ru.name as receiver_name
         FROM transactions t
         JOIN users pu ON t.provider_id = pu.id
         JOIN users ru ON t.receiver_id = ru.id
         WHERE t.id = $1`,
        [txn.id]
      );

      return res.json({
        success: true,
        message: 'Return confirmed successfully (+25 RePoints earned)!',
        transaction: formatTransaction(rows[0])
      });
    } catch (err) {
      next(err);
    }
  }
};

