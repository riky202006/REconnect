import { Transaction, Resource, User, RewardHistory } from '../models/index.js';
import { generateId } from '../utils/helpers.js';

function formatTransaction(t) {
  const providerObj = t.provider && typeof t.provider === 'object' ? t.provider : null;
  const receiverObj = t.receiver && typeof t.receiver === 'object' ? t.receiver : null;

  return {
    id: t._id || t.id,
    transactionCode: t.transactionCode,
    resourceTitle: t.resourceTitle,
    resourceImage: t.resourceImage,
    category: t.category,
    sharingType: t.sharingType,
    provider: {
      id: providerObj ? (providerObj._id || providerObj.id) : (t.provider || 'usr_unknown'),
      name: providerObj?.name || 'Campus Member'
    },
    receiver: {
      id: receiverObj ? (receiverObj._id || receiverObj.id) : (t.receiver || 'usr_unknown'),
      name: receiverObj?.name || 'Campus Member'
    },
    date: t.date,
    status: t.status,
    pointsEarned: t.pointsEarned ?? 0,
    community: t.community || 'ADTU - Main Campus (Panikhaiti)',
    pickupDetails: t.pickupDetails || 'Campus Pickup',
    returnDate: t.returnDate,
    notes: t.notes
  };
}

export const transactionController = {
  // GET /api/transactions
  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const transactions = await Transaction.find({
        $or: [{ provider: userId }, { receiver: userId }]
      })
        .populate('provider', 'name email avatar')
        .populate('receiver', 'name email avatar')
        .sort({ date: -1, createdAt: -1 });

      return res.json(transactions.map(formatTransaction));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/transactions/:id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findOne({
        $or: [{ _id: id }, { transactionCode: id }]
      })
        .populate('provider', 'name email avatar')
        .populate('receiver', 'name email avatar');

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      const providerId = transaction.provider && typeof transaction.provider === 'object' ? transaction.provider._id : transaction.provider;
      const receiverId = transaction.receiver && typeof transaction.receiver === 'object' ? transaction.receiver._id : transaction.receiver;

      if (req.user.id !== providerId && req.user.id !== receiverId) {
        return res.status(403).json({ message: 'You are not authorized to view this transaction.' });
      }

      return res.json(formatTransaction(transaction));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/transactions/:id/complete
  complete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const target = await Transaction.findOne({
        $or: [{ _id: id }, { transactionCode: id }]
      });

      if (!target) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      const providerId = target.provider && typeof target.provider === 'object' ? target.provider._id : target.provider;
      const receiverId = target.receiver && typeof target.receiver === 'object' ? target.receiver._id : target.receiver;

      if (req.user.id !== providerId && req.user.id !== receiverId) {
        return res.status(403).json({ message: 'You are not authorized to complete this transaction.' });
      }

      if (target.status === 'COMPLETED') {
        await target.populate('provider', 'name email avatar');
        await target.populate('receiver', 'name email avatar');
        return res.json(formatTransaction(target));
      }

      target.status = 'COMPLETED';
      if (notes) target.notes = notes;
      target.pointsEarned = 50;
      await target.save();

      await target.populate('provider', 'name email avatar');
      await target.populate('receiver', 'name email avatar');

      return res.json(formatTransaction(target));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/transactions/:id/return
  confirmReturn: async (req, res, next) => {
    try {
      const { id } = req.params;

      const txn = await Transaction.findOne({
        $or: [{ _id: id }, { transactionCode: id }]
      });

      if (!txn) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      const providerId = txn.provider && typeof txn.provider === 'object' ? txn.provider._id : txn.provider;
      const receiverId = txn.receiver && typeof txn.receiver === 'object' ? txn.receiver._id : txn.receiver;

      if (req.user.id !== providerId && req.user.id !== receiverId) {
        return res.status(403).json({ message: 'You are not authorized to confirm return on this transaction.' });
      }

      if (txn.status === 'COMPLETED' && txn.notes && txn.notes.includes('return confirmed')) {
        return res.status(400).json({ message: 'Return has already been confirmed for this transaction.' });
      }

      txn.status = 'COMPLETED';
      txn.notes = 'Borrowed item return confirmed and verified on campus. Transaction closed.';
      await txn.save();

      // If associated resource exists, make it AVAILABLE again
      if (txn.resource) {
        await Resource.findByIdAndUpdate(txn.resource, { status: 'AVAILABLE' });
      }

      // Award +25 RePoints to current user
      await User.findByIdAndUpdate(req.user.id, { $inc: { rePoints: 25 } });

      // Record reward
      const now = new Date().toISOString();
      await RewardHistory.create({
        _id: generateId('rw'),
        user: req.user.id,
        action: 'Verified return of borrowed resource',
        points: 25,
        date: now.split('T')[0],
        type: 'earn'
      });

      await txn.populate('provider', 'name email avatar');
      await txn.populate('receiver', 'name email avatar');

      return res.json({
        success: true,
        message: 'Return confirmed successfully (+25 RePoints earned)!',
        transaction: formatTransaction(txn)
      });
    } catch (err) {
      next(err);
    }
  }
};

export default transactionController;
