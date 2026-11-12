import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const requestSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('req')
    },
    resource: {
      type: String,
      ref: 'Resource',
      required: true,
      index: true
    },
    requester: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'READY_PICKUP', 'COMPLETED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    pickupLocation: {
      type: String,
      default: 'Campus Pickup Spot'
    },
    preferredTime: {
      type: String,
      default: 'Flexible this week'
    },
    returnDate: {
      type: String,
      default: null
    },
    returned: {
      type: Boolean,
      default: false
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
requestSchema.virtual('resource_id')
  .get(function () {
    return this.resource && typeof this.resource === 'object' ? this.resource._id : this.resource;
  })
  .set(function (v) { this.resource = v; });

requestSchema.virtual('requester_id')
  .get(function () {
    return this.requester && typeof this.requester === 'object' ? this.requester._id : this.requester;
  })
  .set(function (v) { this.requester = v; });

requestSchema.virtual('pickup_location')
  .get(function () { return this.pickupLocation; })
  .set(function (v) { this.pickupLocation = v; });

requestSchema.virtual('preferred_time')
  .get(function () { return this.preferredTime; })
  .set(function (v) { this.preferredTime = v; });

requestSchema.virtual('return_date')
  .get(function () { return this.returnDate; })
  .set(function (v) { this.returnDate = v; });

export const Request = mongoose.model('Request', requestSchema);
export default Request;
