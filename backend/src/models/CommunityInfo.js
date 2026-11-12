import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String },
    tag: { type: String },
    urgent: { type: Boolean, default: false }
  },
  { _id: false }
);

const coordinatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    contact: { type: String }
  },
  { _id: false }
);

const communityInfoSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: 'adtu_hub'
    },
    name: {
      type: String,
      required: true
    },
    tagline: {
      type: String
    },
    location: {
      type: String
    },
    membersCount: {
      type: Number,
      default: 0
    },
    resourcesListed: {
      type: Number,
      default: 0
    },
    itemsExchangedOrDonated: {
      type: Number,
      default: 0
    },
    co2SavedKg: {
      type: Number,
      default: 0.0
    },
    about: {
      type: String
    },
    announcements: [announcementSchema],
    coordinators: [coordinatorSchema]
  },
  {
    timestamps: true,
    collection: 'community_info',
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

export const CommunityInfo = mongoose.model('CommunityInfo', communityInfoSchema);
export default CommunityInfo;
