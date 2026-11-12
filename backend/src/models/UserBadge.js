import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const userBadgeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('bdg')
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    badgeId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    earnedAt: {
      type: String,
      default: () => new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })
    }
  },
  {
    timestamps: true,
    collection: 'user_badges',
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

userBadgeSchema.virtual('user_id')
  .get(function () {
    return this.user && typeof this.user === 'object' ? this.user._id : this.user;
  })
  .set(function (v) { this.user = v; });

userBadgeSchema.virtual('badge_id')
  .get(function () { return this.badgeId; })
  .set(function (v) { this.badgeId = v; });

userBadgeSchema.virtual('earned_at')
  .get(function () { return this.earnedAt; })
  .set(function (v) { this.earnedAt = v; });

export const UserBadge = mongoose.model('UserBadge', userBadgeSchema);
export default UserBadge;
