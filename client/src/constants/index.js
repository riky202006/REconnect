export const APP_NAME = 'ReConnect';
export const APP_TAGLINE = 'Give More. Waste Less. Connect Better.';
export const APP_SUBTITLE = 'Pin what you don\'t need. Find what you do. Join a community where resources get a second life.';
export const APP_HERO_HEADING = 'YOUR UNUSED THINGS CAN BECOME SOMEONE\'S NEW BEGINNING.';

export const SHARING_TYPES = {
  DONATE: {
    id: 'DONATE',
    label: 'Donate',
    badgeText: 'FREE DONATE',
    color: '#FF6FA5',
    bgClass: 'bg-brand-pink',
    borderClass: 'border-brand-black',
    description: 'Give away completely free to someone who needs it'
  },
  BORROW: {
    id: 'BORROW',
    label: 'Borrow',
    badgeText: 'BORROW & RETURN',
    color: '#8FD3F4',
    bgClass: 'bg-brand-blue',
    borderClass: 'border-brand-black',
    description: 'Lend temporarily with a designated return date'
  },
  EXCHANGE: {
    id: 'EXCHANGE',
    label: 'Exchange',
    badgeText: 'SWAP / EXCHANGE',
    color: '#FFB04A',
    bgClass: 'bg-brand-orange',
    borderClass: 'border-brand-black',
    description: 'Swap for something else you need or skill barter'
  }
};

export const CATEGORIES = [
  'All Categories',
  'Books',
  'Electronics',
  'Clothing',
  'Furniture',
  'Food',
  'Household',
  'Others'
];

export const ITEM_CONDITIONS = [
  'Brand New',
  'Like New',
  'Good Condition',
  'Fair Condition',
  'Heavily Used'
];

export const COMMUNITIES = [
  'All Communities',
  'ADTU - Main Campus (Panikhaiti)',
  'ADTU - Faculty of Engineering & Technology',
  'ADTU - Faculty of Nursing & Allied Health',
  'ADTU - Faculty of Pharmaceutical Sciences',
  'ADTU - Faculty of Management & Commerce',
  'ADTU - Boys Hostel (Blocks 1-3)',
  'ADTU - Girls Hostel (Blocks A-D)',
  'ADTU - Off-Campus & Day Scholars Guwahati'
];

export const REQUEST_STATUSES = {
  PENDING: { label: 'Pending Review', color: '#FFB04A', bgClass: 'bg-brand-orange' },
  ACCEPTED: { label: 'Accepted', color: '#DDF247', bgClass: 'bg-brand-chartreuse' },
  READY_PICKUP: { label: 'Ready for Pickup', color: '#8FD3F4', bgClass: 'bg-brand-blue' },
  COMPLETED: { label: 'Completed', color: '#E5E6E1', bgClass: 'bg-brand-paper' },
  REJECTED: { label: 'Declined', color: '#FF5A36', bgClass: 'bg-brand-urgent text-white' },
  CANCELLED: { label: 'Cancelled', color: '#E5E6E1', bgClass: 'bg-brand-paper' }
};

export const LISTING_STATUSES = {
  AVAILABLE: { label: 'Available', color: '#DDF247', bgClass: 'bg-brand-chartreuse' },
  RESERVED: { label: 'Reserved', color: '#FFB04A', bgClass: 'bg-brand-orange' },
  CLAIMED: { label: 'Claimed', color: '#FF6FA5', bgClass: 'bg-brand-pink' },
  UNAVAILABLE: { label: 'Unavailable', color: '#E5E6E1', bgClass: 'bg-brand-paper' }
};
