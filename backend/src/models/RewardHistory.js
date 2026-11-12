import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const rewardHistorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('rw')
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    type: {
      type: String,
      enum: ['earn', 'redeem'],
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'rewards_history',
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

rewardHistorySchema.virtual('user_id')
  .get(function () {
    return this.user && typeof this.user === 'object' ? this.user._id : this.user;
  })
  .set(function (v) { this.user = v; });

export const RewardHistory = mongoose.model('RewardHistory', rewardHistorySchema);
export default RewardHistory;
