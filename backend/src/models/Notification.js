import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const notificationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('notif')
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: 'Just now'
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    link: {
      type: String,
      default: '/dashboard'
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

notificationSchema.virtual('user_id')
  .get(function () {
    return this.user && typeof this.user === 'object' ? this.user._id : this.user;
  })
  .set(function (v) { this.user = v; });

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
