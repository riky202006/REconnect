import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('usr')
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    department: {
      type: String,
      default: 'ADTU Student',
      trim: true
    },
    community: {
      type: String,
      default: 'ADTU - Main Campus (Panikhaiti)',
      trim: true
    },
    hostel: {
      type: String,
      default: '',
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    rePoints: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      default: 'Campus Member'
    },
    joinedDate: {
      type: String,
      default: () => new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
    },
    rating: {
      type: Number,
      default: 5.0
    },
    verifiedStudent: {
      type: Boolean,
      default: true
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

// Virtual aliases for compatibility
userSchema.virtual('re_points')
  .get(function () { return this.rePoints; })
  .set(function (v) { this.rePoints = v; });

userSchema.virtual('joined_date')
  .get(function () { return this.joinedDate; })
  .set(function (v) { this.joinedDate = v; });

userSchema.virtual('verified_student')
  .get(function () { return this.verifiedStudent; })
  .set(function (v) { this.verifiedStudent = v; });

export const User = mongoose.model('User', userSchema);
export default User;
