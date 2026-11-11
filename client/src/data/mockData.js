// Realistic mock data tailored for ADTU (Assam Down Town University) community
export const mockCurrentUser = {
  id: 'usr_001',
  name: 'Priyam Sharma',
  email: 'priyam.sharma@adtu.edu.in',
  department: 'Faculty of Engineering & Tech (CSE - 6th Sem)',
  community: 'ADTU - Main Campus (Panikhaiti)',
  hostel: 'Boys Hostel Block 2, Room 304',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  rePoints: 485,
  level: 'Campus Champion',
  joinedDate: 'August 2025',
  stats: {
    itemsShared: 14,
    itemsBorrowed: 6,
    itemsExchanged: 3,
    co2SavedKg: 42.8,
    activeListings: 4,
    incomingRequests: 3
  },
  badges: [
    { id: 'b1', title: 'Zero Waste Pioneer', icon: '🌱', description: 'Donated 10+ items within campus', earnedAt: 'Jan 2026' },
    { id: 'b2', title: 'Semester Saver', icon: '📚', description: 'Shared core engineering textbooks', earnedAt: 'Sep 2025' },
    { id: 'b3', title: 'Reliable Borrower', icon: '⭐', description: 'Returned all borrowed lab equipment on time', earnedAt: 'Nov 2025' },
    { id: 'b4', title: 'Speedy Dispatcher', icon: '⚡', description: 'Responded to pickup requests within 2 hours', earnedAt: 'Feb 2026' }
  ],
  rewardsHistory: [
    { id: 'rw1', action: 'Donated "Adv. Engineering Math"', points: 50, date: '2026-03-02', type: 'earn' },
    { id: 'rw2', action: 'Lent Arduino Kit to Lab Junior', points: 30, date: '2026-02-28', type: 'earn' },
    { id: 'rw3', action: 'Redeemed Canteen Coupon (₹100)', points: -150, date: '2026-02-20', type: 'redeem' },
    { id: 'rw4', action: 'Completed Semester Eco-Challenge', points: 100, date: '2026-02-14', type: 'earn' },
    { id: 'rw5', action: 'Exchanged Drafter for Scientific Calc', points: 40, date: '2026-02-05', type: 'earn' }
  ]
};

export const initialMockResources = [
  {
    id: 'res_101',
    title: 'Advanced Engineering Mathematics by Erwin Kreyszig (10th Ed)',
    description: 'Clean copy with light pencil markings. Covers differential equations, linear algebra, and complex analysis. Essential for 3rd and 4th sem CSE, ECE and ME students at ADTU.',
    category: 'Books',
    sharingType: 'DONATE',
    condition: 'Good Condition',
    status: 'AVAILABLE',
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupInfo: 'Central Library Ground Floor Lobby or Faculty Gate between 4 PM - 5:30 PM',
    contactPreference: 'Campus Email (@adtu.edu.in)',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 4.9,
      verifiedStudent: true
    },
    createdAt: '2026-03-05T10:30:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 142,
    requestsCount: 3,
    noteColor: '#FF6FA5'
  },
  {
    id: 'res_102',
    title: 'White Cotton Lab Coat (Unisex, Size 40/L) - Cleaned & Pressed',
    description: 'Standard ADTU regulation white coat for Biotech, Pharmacy, and Chemistry lab practicals. Two front pockets, no chemical stains. Ready for immediate use.',
    category: 'Clothing',
    sharingType: 'BORROW',
    condition: 'Like New',
    status: 'AVAILABLE',
    community: 'ADTU - Faculty of Pharmaceutical Sciences',
    pickupInfo: 'Outside Pharmacy Lab 3 or Girls Hostel C Gate',
    contactPreference: 'Hostel Reception Gate C',
    images: [
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_002',
      name: 'Ananya Deka',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Faculty of Pharmaceutical Sciences',
      rating: 5.0,
      verifiedStudent: true
    },
    createdAt: '2026-03-06T09:15:00Z',
    isUrgent: true,
    returnPeriod: 'Current Semester (~5 Weeks)',
    returnDate: '2026-04-15',
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 88,
    requestsCount: 2,
    noteColor: '#8FD3F4'
  },
  {
    id: 'res_103',
    title: 'Casio FX-991EX ClassWiz Non-Programmable Scientific Calculator',
    description: 'Original Casio scientific calculator approved for university exams. High-res LCD, 552 functions, solar + battery. Want to swap for Python for Data Analysis book or similar programming reference.',
    category: 'Electronics',
    sharingType: 'EXCHANGE',
    condition: 'Like New',
    status: 'AVAILABLE',
    community: 'ADTU - Faculty of Engineering & Technology',
    pickupInfo: 'Engineering Block Foyer (Room E-204) during break',
    contactPreference: 'Campus Email (@adtu.edu.in)',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_003',
      name: 'Rohan Bordoloi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Faculty of Engineering & Technology',
      rating: 4.8,
      verifiedStudent: true
    },
    createdAt: '2026-03-07T14:20:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: 'O\'Reilly Python for Data Science or DSA textbook',
    exchangeRequirements: 'Looking for O\'Reilly Python Data Science Handbook or DSA textbook in C++',
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 210,
    requestsCount: 5,
    noteColor: '#FFB04A'
  },
  {
    id: 'res_104',
    title: 'Arduino Uno Starter Kit + Breadboard, Jumper Wires & Ultrasonic Sensor',
    description: 'Lending my IoT practical starter kit for upcoming mini-project submissions. Includes Uno R3, 830-point breadboard, resistors, LEDs, HC-SR04 sensor, and servo motor.',
    category: 'Electronics',
    sharingType: 'BORROW',
    condition: 'Good Condition',
    status: 'RESERVED',
    community: 'ADTU - Faculty of Engineering & Technology',
    pickupInfo: 'Robotics & Embedded Systems Lab or Boys Hostel 1',
    contactPreference: 'Phone / WhatsApp (+91 98765-43210)',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 4.9,
      verifiedStudent: true
    },
    createdAt: '2026-03-01T11:00:00Z',
    isUrgent: false,
    returnPeriod: '3 Weeks',
    returnDate: '2026-03-25',
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 304,
    requestsCount: 6,
    noteColor: '#8FD3F4'
  },
  {
    id: 'res_105',
    title: 'Prestige 1.5L Stainless Steel Electric Kettle (Auto Shut-Off)',
    description: 'Perfect for boiling water, green tea, or making instant noodles late night in the hostel. Clean interior, fully working heating coil.',
    category: 'Household',
    sharingType: 'DONATE',
    condition: 'Good Condition',
    status: 'CLAIMED',
    community: 'ADTU - Boys Hostel (Blocks 1-3)',
    pickupInfo: 'Block 2 Ground Floor Reception',
    contactPreference: 'Hostel Block 2 Reception',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_004',
      name: 'Bikash Gogoi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      rating: 4.7,
      verifiedStudent: true
    },
    createdAt: '2026-02-26T16:45:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 195,
    requestsCount: 4,
    noteColor: '#DDF247'
  },
  {
    id: 'res_106',
    title: 'Ergonomic Wooden Folding Hostel Study Table with Drawer',
    description: 'Sturdy multi-purpose wooden study desk with pre-installed cup holder and laptop riser slot. Perfect for hostel rooms with limited space. Legs fold completely flat.',
    category: 'Furniture',
    sharingType: 'DONATE',
    condition: 'Good Condition',
    status: 'AVAILABLE',
    community: 'ADTU - Boys Hostel (Blocks 1-3)',
    pickupInfo: 'Boys Hostel Block 2, Room 304 or common quadrangle',
    contactPreference: 'Hostel Reception / Campus Meetup',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 4.9,
      verifiedStudent: true
    },
    createdAt: '2026-03-08T14:00:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 120,
    requestsCount: 2,
    noteColor: '#DDF247'
  },
  {
    id: 'res_107',
    title: 'Mini Drafter with Metal Clamp + Imperial Drawing Board (Rotring)',
    description: 'Engineering drawing essentials for 1st year B.Tech students. Sturdy scale, free rotation protractor head, smoothly slides with zero hitch.',
    category: 'Others',
    sharingType: 'DONATE',
    condition: 'Like New',
    status: 'AVAILABLE',
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupInfo: 'Drawing Hall D-101 or Campus Amphitheatre',
    contactPreference: 'Campus Email (@adtu.edu.in)',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_005',
      name: 'Snigdha Saikia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 5.0,
      verifiedStudent: true
    },
    createdAt: '2026-03-08T08:00:00Z',
    isUrgent: true,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 176,
    requestsCount: 7,
    noteColor: '#FF6FA5'
  },
  {
    id: 'res_108',
    title: 'Factory Sealed Pack: Tata Gold Tea 500g + Britannia Marie Biscuits',
    description: 'Extra unopened pantry groceries sent from home. Expiry date verified as Nov 2026. Clean, dry, air-tight packaging. Free to any student or hostel room.',
    category: 'Food',
    sharingType: 'DONATE',
    condition: 'Brand New',
    status: 'AVAILABLE',
    community: 'ADTU - Boys Hostel (Blocks 1-3)',
    pickupInfo: 'Block 1 common room, evening 7 PM',
    contactPreference: 'Hostel Block 1 Common Room',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 4.9,
      verifiedStudent: true
    },
    createdAt: '2026-03-08T15:30:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: '2026-11-20',
    packagingInfo: 'Factory vacuum sealed in original cartons, unopened',
    storageInstructions: 'Store in dry pantry away from direct moisture',
    viewsCount: 65,
    requestsCount: 1,
    noteColor: '#FF6FA5'
  },
  {
    id: 'res_109',
    title: 'Dual-Head Stethoscope with Spare Ear Tips (Clinical Lab Practical)',
    description: 'Stainless steel chestpiece, high acoustic sensitivity. Perfect for clinical rotations and vital sign practice. Lending for current semester.',
    category: 'Others',
    sharingType: 'BORROW',
    condition: 'Like New',
    status: 'AVAILABLE',
    community: 'ADTU - Faculty of Nursing & Allied Health',
    pickupInfo: 'Nursing Skills Lab or Central Canteen',
    contactPreference: 'Nursing Faculty Foyer',
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_007',
      name: 'Pallavi Hazarika',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Faculty of Nursing & Allied Health',
      rating: 4.9,
      verifiedStudent: true
    },
    createdAt: '2026-03-04T13:10:00Z',
    isUrgent: false,
    returnPeriod: 'Full Semester (~2 Months)',
    returnDate: '2026-05-10',
    exchangeItem: null,
    exchangeRequirements: null,
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 189,
    requestsCount: 4,
    noteColor: '#8FD3F4'
  },
  {
    id: 'res_110',
    title: 'Yonex Muscle Power Badminton Racket + Pack of 3 Mavis Shuttles',
    description: 'Full graphite frame, recently re-strung at 24lbs tension. Looking to swap for table tennis paddles or outdoor basketball.',
    category: 'Others',
    sharingType: 'EXCHANGE',
    condition: 'Good Condition',
    status: 'AVAILABLE',
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupInfo: 'University Sports Complex Indoor Court around 5 PM',
    contactPreference: 'Sports Complex Reception',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: {
      id: 'usr_008',
      name: 'Kallol Barman',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      community: 'ADTU - Main Campus (Panikhaiti)',
      rating: 4.7,
      verifiedStudent: true
    },
    createdAt: '2026-03-03T18:00:00Z',
    isUrgent: false,
    returnPeriod: null,
    returnDate: null,
    exchangeItem: 'Stag 4-Star Table Tennis Paddle',
    exchangeRequirements: 'Swap with Stag 4-star Table Tennis Racquet or Spalding Basketball',
    foodExpiryDate: null,
    packagingInfo: null,
    storageInstructions: null,
    viewsCount: 140,
    requestsCount: 2,
    noteColor: '#FFB04A'
  }
];

export const initialMockRequests = [
  {
    id: 'req_201',
    resourceId: 'res_101',
    resourceTitle: 'Advanced Engineering Mathematics by Erwin Kreyszig (10th Ed)',
    resourceCategory: 'Books',
    sharingType: 'DONATE',
    requester: {
      id: 'usr_009',
      name: 'Dipankar Nath',
      email: 'dipankar.n@adtu.edu.in',
      department: 'ECE - 4th Sem',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_001',
      name: 'Priyam Sharma'
    },
    message: 'Hey Priyam! Need this book desperately for the upcoming midterm exams on differential equations. Can collect whenever you are free around campus.',
    status: 'PENDING',
    createdAt: '2026-03-07T11:45:00Z',
    pickupLocation: 'Central Library Ground Floor Lobby',
    preferredTime: 'Tomorrow at 4:30 PM'
  },
  {
    id: 'req_202',
    resourceId: 'res_104',
    resourceTitle: 'Arduino Uno Starter Kit + Breadboard, Jumper Wires & Ultrasonic Sensor',
    resourceCategory: 'Electronics',
    sharingType: 'BORROW',
    requester: {
      id: 'usr_010',
      name: 'Trishna Chaliha',
      email: 'trishna.c@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_001',
      name: 'Priyam Sharma'
    },
    message: 'Working on an automated smart irrigation sensor demo for our IoT lab assignment. Will keep it spotless and return by the 25th as promised!',
    status: 'ACCEPTED',
    createdAt: '2026-03-05T14:10:00Z',
    pickupLocation: 'Robotics & Embedded Systems Lab',
    preferredTime: 'Friday at 2:00 PM'
  },
  {
    id: 'req_203',
    resourceId: 'res_108',
    resourceTitle: 'Factory Sealed Pack: Tata Gold Tea 500g + Britannia Marie Biscuits',
    resourceCategory: 'Food',
    sharingType: 'DONATE',
    requester: {
      id: 'usr_011',
      name: 'Hiren Medhi',
      email: 'hiren.m@adtu.edu.in',
      department: 'B.Pharm - 2nd Year',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_001',
      name: 'Priyam Sharma'
    },
    message: 'Hostel evening tea session sorted! Can I pick it up from Block 1 common room today?',
    status: 'READY_PICKUP',
    createdAt: '2026-03-08T16:00:00Z',
    pickupLocation: 'Block 1 common room, evening 7 PM',
    preferredTime: 'Tonight 7:15 PM'
  },
  {
    id: 'req_204',
    resourceId: 'res_102',
    resourceTitle: 'White Cotton Lab Coat (Unisex, Size 40/L) - Cleaned & Pressed',
    resourceCategory: 'Clothing',
    sharingType: 'BORROW',
    resourceImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_002',
      name: 'Ananya Deka'
    },
    message: 'Hi Ananya, I have an inter-departmental Chemistry lab evaluation next Tuesday. Would love to borrow your lab coat for two weeks.',
    status: 'ACCEPTED',
    createdAt: '2026-03-07T08:30:00Z',
    updatedAt: '2026-03-07T10:15:00Z',
    pickupLocation: 'Outside Pharmacy Lab 3',
    preferredTime: 'Thursday 1:15 PM'
  },
  {
    id: 'req_205',
    resourceId: 'res_107',
    resourceTitle: 'Mini Drafter with Metal Clamp + Imperial Drawing Board (Rotring)',
    resourceCategory: 'Others',
    sharingType: 'DONATE',
    resourceImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_005',
      name: 'Snigdha Saikia'
    },
    message: 'Hi Snigdha, need a mini drafter for our graphics project submission this week! Can pick it up anytime today.',
    status: 'READY_PICKUP',
    createdAt: '2026-03-08T09:15:00Z',
    updatedAt: '2026-03-08T11:30:00Z',
    pickupLocation: 'Drawing Hall D-101 counter',
    preferredTime: 'Today at 3:00 PM'
  },
  {
    id: 'req_206',
    resourceId: 'res_109',
    resourceTitle: 'Casio fx-991EX ClassWiz Scientific Calculator (Non-Programmable)',
    resourceCategory: 'Electronics',
    sharingType: 'BORROW',
    resourceImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_006',
      name: 'Debojit Kalita'
    },
    message: 'Borrowed for mid-term numerical methods exam. Handover was smooth!',
    status: 'COMPLETED',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-03T17:00:00Z',
    returnDate: '2026-03-15',
    returned: false,
    pickupLocation: 'Central Library Foyer',
    preferredTime: 'Completed'
  },
  {
    id: 'req_207',
    resourceId: 'res_110',
    resourceTitle: 'Yonex Muscle Power Badminton Racket + Pack of 3 Mavis Shuttles',
    resourceCategory: 'Others',
    sharingType: 'EXCHANGE',
    resourceImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_008',
      name: 'Kallol Barman'
    },
    message: 'I have a pair of Stag 4-star Table Tennis racquets in great shape to exchange!',
    status: 'PENDING',
    createdAt: '2026-03-08T15:20:00Z',
    updatedAt: '2026-03-08T15:20:00Z',
    pickupLocation: 'Sports Complex Indoor Court',
    preferredTime: 'Wednesday evening'
  },
  {
    id: 'req_208',
    resourceId: 'res_103',
    resourceTitle: 'Stethoscope & Blood Pressure Monitor (Sphygmomanometer)',
    resourceCategory: 'Electronics',
    sharingType: 'BORROW',
    resourceImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_003',
      name: 'Pallavi Hazarika'
    },
    message: 'Requested for college blood donation camp screening volunteer work.',
    status: 'REJECTED',
    createdAt: '2026-02-27T11:00:00Z',
    updatedAt: '2026-02-28T09:00:00Z',
    pickupLocation: 'Nursing Faculty Block',
    preferredTime: 'Morning'
  },
  {
    id: 'req_209',
    resourceId: 'res_106',
    resourceTitle: 'Ergonomic Wooden Folding Hostel Study Table with Drawer',
    resourceCategory: 'Furniture',
    sharingType: 'DONATE',
    resourceImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    requester: {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'CSE - 6th Sem',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    owner: {
      id: 'usr_004',
      name: 'Bikash Gogoi'
    },
    message: 'Looking for a table for my roommate.',
    status: 'CANCELLED',
    createdAt: '2026-02-25T14:00:00Z',
    updatedAt: '2026-02-26T10:00:00Z',
    pickupLocation: 'Boys Hostel 2',
    preferredTime: 'Evening'
  }
];

export const initialMockTransactions = [
  {
    id: 'txn_901',
    transactionCode: 'TXN-2026-0091',
    resourceTitle: 'Prestige 1.5L Stainless Steel Electric Kettle',
    resourceImage: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
    category: 'Household',
    sharingType: 'DONATE',
    provider: { name: 'Priyam Sharma', id: 'usr_001' },
    receiver: { name: 'Bikash Gogoi', id: 'usr_004' },
    date: '2026-02-28',
    status: 'COMPLETED',
    pointsEarned: 50,
    community: 'ADTU - Boys Hostel (Blocks 1-3)',
    pickupDetails: 'Block 2 Ground Floor Reception, 6:00 PM',
    returnDate: null,
    notes: 'Handover verified at Block 2 reception. Item inspected and operational.'
  },
  {
    id: 'txn_902',
    transactionCode: 'TXN-2026-0084',
    resourceTitle: 'Data Structures and Algorithms in C++ (Horowitz)',
    resourceImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'Books',
    sharingType: 'DONATE',
    provider: { name: 'Priyam Sharma', id: 'usr_001' },
    receiver: { name: 'Riya Sen', id: 'usr_015' },
    date: '2026-02-22',
    status: 'COMPLETED',
    pointsEarned: 50,
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupDetails: 'Central Library Cafe',
    returnDate: null,
    notes: 'Book donated to 2nd year student. Clean handover at Library Cafe.'
  },
  {
    id: 'txn_903',
    transactionCode: 'TXN-2026-0103',
    resourceTitle: 'Arduino Uno Starter Kit + Breadboard & Sensors',
    resourceImage: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    sharingType: 'BORROW',
    provider: { name: 'Priyam Sharma', id: 'usr_001' },
    receiver: { name: 'Trishna Chaliha', id: 'usr_010' },
    date: '2026-03-05',
    status: 'IN_PROGRESS',
    pointsEarned: 0,
    community: 'ADTU - Faculty of Engineering & Tech',
    pickupDetails: 'Robotics & Embedded Systems Lab Counter',
    returnDate: '2026-03-25',
    notes: 'Active borrow for IoT assignment. Due for campus return by March 25th.'
  },
  {
    id: 'txn_904',
    transactionCode: 'TXN-2026-0108',
    resourceTitle: 'White Cotton Lab Coat (Unisex, Size 40/L)',
    resourceImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
    sharingType: 'BORROW',
    provider: { name: 'Ananya Deka', id: 'usr_002' },
    receiver: { name: 'Priyam Sharma', id: 'usr_001' },
    date: '2026-03-07',
    status: 'IN_PROGRESS',
    pointsEarned: 0,
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupDetails: 'Outside Pharmacy Lab 3, 1:15 PM',
    returnDate: '2026-03-21',
    notes: 'Borrowed for Chemistry evaluation. Expected return to Ananya on March 21.'
  },
  {
    id: 'txn_905',
    transactionCode: 'TXN-2026-0112',
    resourceTitle: 'Tata Gold Tea 500g + Britannia Marie Biscuits',
    resourceImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    sharingType: 'DONATE',
    provider: { name: 'Priyam Sharma', id: 'usr_001' },
    receiver: { name: 'Hiren Medhi', id: 'usr_011' },
    date: '2026-03-08',
    status: 'PENDING_HANDOVER',
    pointsEarned: 0,
    community: 'ADTU - Boys Hostel (Blocks 1-3)',
    pickupDetails: 'Block 1 Common Room, Tonight 7:15 PM',
    returnDate: null,
    notes: 'Approved request awaiting physical collection at hostel.'
  },
  {
    id: 'txn_906',
    transactionCode: 'TXN-2026-0078',
    resourceTitle: 'Yonex Badminton Racket for TT Paddles',
    resourceImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    category: 'Others',
    sharingType: 'EXCHANGE',
    provider: { name: 'Kallol Barman', id: 'usr_008' },
    receiver: { name: 'Priyam Sharma', id: 'usr_001' },
    date: '2026-02-18',
    status: 'COMPLETED',
    pointsEarned: 40,
    community: 'ADTU - Main Campus (Panikhaiti)',
    pickupDetails: 'University Sports Complex Indoor Court',
    returnDate: null,
    notes: 'Successful mutual exchange verified at sports complex.'
  }
];

export const mockLeaderboard = [
  { rank: 1, name: 'Ananya Deka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', department: 'Faculty of Pharmacy', points: 720, itemsShared: 26, badge: 'Eco Champion 🏆' },
  { rank: 2, name: 'Snigdha Saikia', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', department: 'Nursing & Allied Health', points: 645, itemsShared: 21, badge: 'Master Donor 🌟' },
  { rank: 3, name: 'Priyam Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', department: 'Faculty of Engineering (CSE)', points: 485, itemsShared: 14, badge: 'Campus Star ⭐' },
  { rank: 4, name: 'Rohan Bordoloi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', department: 'Faculty of Engineering (ECE)', points: 430, itemsShared: 12, badge: 'Resource Guru 🔄' },
  { rank: 5, name: 'Pallavi Hazarika', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', department: 'Faculty of Nursing', points: 390, itemsShared: 11, badge: 'Green Leader 🌿' },
  { rank: 6, name: 'Debojit Kalita', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', department: 'Faculty of Management', points: 340, itemsShared: 9, badge: 'Helpful Hand 🤝' },
  { rank: 7, name: 'Bikash Gogoi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', department: 'Boys Hostel Block 2', points: 295, itemsShared: 8, badge: 'Community Hero 🛡️' }
];

export const mockCommunityInfo = {
  name: 'Assam Down Town University (ADTU) Resource Hub',
  tagline: 'Empowering students and faculty to share, reuse, and eliminate campus waste.',
  location: 'Sankar Madhab Path, Gandhi Nagar, Panikhaiti, Guwahati, Assam 781026',
  membersCount: 1420,
  resourcesListed: 580,
  itemsExchangedOrDonated: 412,
  co2SavedKg: 1240,
  about: 'Founded in early 2026 by engineering students at Assam Down Town University, ReConnect ADTU is our premier campus circular economy initiative. Whether passing on expensive medical and engineering textbooks to juniors, lending lab aprons, or exchanging hostel appliances before semester breaks, our noticeboard ensures zero usable equipment heads to Guwahati landfills.',
  announcements: [
    {
      id: 'ann_1',
      title: '🚨 End-Semester Book Drop Campaign 2026',
      content: 'Passing out or moving to next semester? Drop your syllabus books and mini drafters at Central Library counter to earn 100 bonus RePoints!',
      date: 'March 8, 2026',
      tag: 'Urgent',
      urgent: true
    },
    {
      id: 'ann_2',
      title: '🎉 Campus Eco-Fair Next Friday',
      content: 'Showcase your sustainable projects and swap sports gear & electronics at the Panikhaiti Amphitheatre from 2 PM to 6 PM.',
      date: 'March 4, 2026',
      tag: 'Event',
      urgent: false
    },
    {
      id: 'ann_3',
      title: '⚡ Verified Student Badge Update',
      content: 'Make sure your ADTU institutional email (@adtu.edu.in) is linked to receive instant request approval privileges.',
      date: 'February 28, 2026',
      tag: 'Notice',
      urgent: false
    }
  ],
  coordinators: [
    { name: 'Dr. B. K. Sarma', role: 'Faculty Mentor (Dept of CSE)', contact: 'bksarma@adtu.edu.in' },
    { name: 'Priyam Sharma', role: 'Student Lead Coordinator', contact: 'priyam.sharma@adtu.edu.in' },
    { name: 'Ananya Deka', role: 'Sustainability Representative', contact: 'ananya.d@adtu.edu.in' }
  ]
};
