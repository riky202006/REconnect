import mongoose from 'mongoose';
import { generateId } from '../utils/helpers.js';

const resourceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => generateId('res')
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    sharingType: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    condition: {
      type: String,
      default: 'Good Condition'
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'CLAIMED', 'UNAVAILABLE'],
      default: 'AVAILABLE',
      index: true
    },
    community: {
      type: String,
      default: 'ADTU - Main Campus (Panikhaiti)',
      index: true
    },
    pickupInfo: {
      type: String,
      default: 'Campus Pickup Spot'
    },
    contactPreference: {
      type: String,
      default: 'Campus Email'
    },
    images: {
      type: [String],
      default: []
    },
    postedBy: {
      type: String,
      ref: 'User',
      required: true,
      index: true
    },
    isUrgent: {
      type: Boolean,
      default: false,
      index: true
    },
    returnPeriod: {
      type: String,
      default: null
    },
    returnDate: {
      type: String,
      default: null
    },
    exchangeItem: {
      type: String,
      default: null
    },
    exchangeRequirements: {
      type: String,
      default: null
    },
    foodExpiryDate: {
      type: String,
      default: null
    },
    packagingInfo: {
      type: String,
      default: null
    },
    storageInstructions: {
      type: String,
      default: null
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    requestsCount: {
      type: Number,
      default: 0
    },
    noteColor: {
      type: String,
      default: '#FF6FA5'
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

// Compatibility virtuals for snake_case queries if needed
resourceSchema.virtual('sharing_type')
  .get(function () { return this.sharingType; })
  .set(function (v) { this.sharingType = v; });

resourceSchema.virtual('pickup_info')
  .get(function () { return this.pickupInfo; })
  .set(function (v) { this.pickupInfo = v; });

resourceSchema.virtual('contact_preference')
  .get(function () { return this.contactPreference; })
  .set(function (v) { this.contactPreference = v; });

resourceSchema.virtual('posted_by_id')
  .get(function () {
    return this.postedBy && typeof this.postedBy === 'object' ? this.postedBy._id : this.postedBy;
  })
  .set(function (v) { this.postedBy = v; });

resourceSchema.virtual('is_urgent')
  .get(function () { return this.isUrgent; })
  .set(function (v) { this.isUrgent = v; });

resourceSchema.virtual('return_period')
  .get(function () { return this.returnPeriod; })
  .set(function (v) { this.returnPeriod = v; });

resourceSchema.virtual('return_date')
  .get(function () { return this.returnDate; })
  .set(function (v) { this.returnDate = v; });

resourceSchema.virtual('exchange_item')
  .get(function () { return this.exchangeItem; })
  .set(function (v) { this.exchangeItem = v; });

resourceSchema.virtual('exchange_requirements')
  .get(function () { return this.exchangeRequirements; })
  .set(function (v) { this.exchangeRequirements = v; });

resourceSchema.virtual('food_expiry_date')
  .get(function () { return this.foodExpiryDate; })
  .set(function (v) { this.foodExpiryDate = v; });

resourceSchema.virtual('packaging_info')
  .get(function () { return this.packagingInfo; })
  .set(function (v) { this.packagingInfo = v; });

resourceSchema.virtual('storage_instructions')
  .get(function () { return this.storageInstructions; })
  .set(function (v) { this.storageInstructions = v; });

resourceSchema.virtual('views_count')
  .get(function () { return this.viewsCount; })
  .set(function (v) { this.viewsCount = v; });

resourceSchema.virtual('requests_count')
  .get(function () { return this.requestsCount; })
  .set(function (v) { this.requestsCount = v; });

resourceSchema.virtual('note_color')
  .get(function () { return this.noteColor; })
  .set(function (v) { this.noteColor = v; });

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
