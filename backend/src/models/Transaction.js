import mongoose from 'mongoose';
import { generateId, generateTransactionCode } from '../utils/helpers.js';

const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('txn')
    },
    transactionCode: {
      type: String,
      default: () => generateTransactionCode(),
      unique: true,
      index: true
    },
    resource: {
      type: String,
      ref: 'Resource',
      default: null,
      index: true
    },
    resourceTitle: {
      type: String,
      required: true
    },
    resourceImage: {
      type: String,
      default: null
    },
    category: {
      type: String,
      required: true
    },
    sharingType: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    receiver: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    status: {
      type: String,
      enum: ['PENDING_HANDOVER', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'IN_PROGRESS',
      index: true
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    community: {
      type: String,
      default: 'ADTU - Main Campus (Panikhaiti)'
    },
    pickupDetails: {
      type: String,
      default: 'Campus Pickup'
    },
    returnDate: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual aliases
transactionSchema.virtual('transaction_code')
  .get(function () { return this.transactionCode; })
  .set(function (v) { this.transactionCode = v; });

transactionSchema.virtual('resource_id')
  .get(function () {
    return this.resource && typeof this.resource === 'object' ? this.resource._id : this.resource;
  })
  .set(function (v) { this.resource = v; });

transactionSchema.virtual('resource_title')
  .get(function () { return this.resourceTitle; })
  .set(function (v) { this.resourceTitle = v; });

transactionSchema.virtual('resource_image')
  .get(function () { return this.resourceImage; })
  .set(function (v) { this.resourceImage = v; });

transactionSchema.virtual('sharing_type')
  .get(function () { return this.sharingType; })
  .set(function (v) { this.sharingType = v; });

transactionSchema.virtual('provider_id')
  .get(function () {
    return this.provider && typeof this.provider === 'object' ? this.provider._id : this.provider;
  })
  .set(function (v) { this.provider = v; });

transactionSchema.virtual('receiver_id')
  .get(function () {
    return this.receiver && typeof this.receiver === 'object' ? this.receiver._id : this.receiver;
  })
  .set(function (v) { this.receiver = v; });

transactionSchema.virtual('points_earned')
  .get(function () { return this.pointsEarned; })
  .set(function (v) { this.pointsEarned = v; });

transactionSchema.virtual('pickup_details')
  .get(function () { return this.pickupDetails; })
  .set(function (v) { this.pickupDetails = v; });

transactionSchema.virtual('return_date')
  .get(function () { return this.returnDate; })
  .set(function (v) { this.returnDate = v; });

export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
