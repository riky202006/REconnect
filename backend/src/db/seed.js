import bcrypt from 'bcryptjs';
import {
  User,
  Resource,
  Request,
  Transaction,
  UserBadge,
  RewardHistory,
  Notification,
  CommunityInfo
} from '../models/index.js';

export async function seedDatabase() {
  const count = await User.countDocuments();

  if (count > 0) {
    console.log(`Database already contains ${count} users. Skipping seed.`);
    return;
  }

  console.log('Seeding initial ADTU Campus dataset into MongoDB Atlas...');

  const defaultHashedPassword = await bcrypt.hash('adtu2026pass', 10);
  const now = new Date().toISOString();

  // 1. Users
  const users = [
    {
      _id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'Faculty of Engineering & Tech (CSE - 6th Sem)',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 2, Room 304',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rePoints: 485,
      level: 'Campus Champion',
      joinedDate: 'August 2025',
      rating: 4.9,
      verifiedStudent: true
    },
    {
      _id: 'usr_002',
      name: 'Ananya Deka',
      email: 'ananya.d@adtu.edu.in',
      department: 'Faculty of Pharmaceutical Sciences',
      community: 'ADTU - Faculty of Pharmaceutical Sciences',
      hostel: 'Girls Hostel C, Room 102',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rePoints: 720,
      level: 'Eco Champion',
      joinedDate: 'July 2025',
      rating: 5.0,
      verifiedStudent: true
    },
    {
      _id: 'usr_003',
      name: 'Rohan Bordoloi',
      email: 'rohan.b@adtu.edu.in',
      department: 'Faculty of Engineering & Technology (ECE)',
      community: 'ADTU - Faculty of Engineering & Technology',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rePoints: 430,
      level: 'Resource Guru',
      joinedDate: 'September 2025',
      rating: 4.8,
      verifiedStudent: true
    },
    {
      _id: 'usr_004',
      name: 'Bikash Gogoi',
      email: 'bikash.g@adtu.edu.in',
      department: 'Faculty of Computer Science & IT',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      hostel: 'Boys Hostel Block 2, Room 210',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rePoints: 295,
      level: 'Community Hero',
      joinedDate: 'October 2025',
      rating: 4.7,
      verifiedStudent: true
    },
    {
      _id: 'usr_005',
      name: 'Snigdha Saikia',
      email: 'snigdha.s@adtu.edu.in',
      department: 'Faculty of Nursing & Allied Health',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rePoints: 645,
      level: 'Master Donor',
      joinedDate: 'June 2025',
      rating: 5.0,
      verifiedStudent: true
    },
    {
      _id: 'usr_006',
      name: 'Debojit Kalita',
      email: 'debojit.k@adtu.edu.in',
      department: 'Faculty of Management Studies',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Day Scholar',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      rePoints: 340,
      level: 'Helpful Hand',
      joinedDate: 'November 2025',
      rating: 4.8,
      verifiedStudent: true
    },
    {
      _id: 'usr_007',
      name: 'Pallavi Hazarika',
      email: 'pallavi.h@adtu.edu.in',
      department: 'Faculty of Nursing & Allied Health',
      community: 'ADTU - Faculty of Nursing & Allied Health',
      hostel: 'Girls Hostel B',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      rePoints: 390,
      level: 'Green Leader',
      joinedDate: 'September 2025',
      rating: 4.9,
      verifiedStudent: true
    },
    {
      _id: 'usr_008',
      name: 'Kallol Barman',
      email: 'kallol.b@adtu.edu.in',
      department: 'Faculty of Engineering (Mechanical)',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 3',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      rePoints: 310,
      level: 'Active Member',
      joinedDate: 'December 2025',
      rating: 4.7,
      verifiedStudent: true
    },
    {
      _id: 'usr_009',
      name: 'Dipankar Nath',
      email: 'dipankar.n@adtu.edu.in',
      department: 'ECE - 4th Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      rePoints: 120,
      level: 'Campus Member',
      joinedDate: 'January 2026',
      rating: 4.8,
      verifiedStudent: true
    },
    {
      _id: 'usr_010',
      name: 'Trishna Chaliha',
      email: 'trishna.c@adtu.edu.in',
      department: 'CSE - 6th Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel C',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      rePoints: 180,
      level: 'Campus Member',
      joinedDate: 'August 2025',
      rating: 4.9,
      verifiedStudent: true
    },
    {
      _id: 'usr_011',
      name: 'Hiren Medhi',
      email: 'hiren.m@adtu.edu.in',
      department: 'B.Pharm - 2nd Year',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      rePoints: 90,
      level: 'Campus Member',
      joinedDate: 'February 2026',
      rating: 4.6,
      verifiedStudent: true
    },
    {
      _id: 'usr_015',
      name: 'Riya Sen',
      email: 'riya.s@adtu.edu.in',
      department: 'CSE - 2nd Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rePoints: 140,
      level: 'Campus Member',
      joinedDate: 'January 2026',
      rating: 4.9,
      verifiedStudent: true
    }
  ];

  for (const u of users) {
    await User.create({
      ...u,
      password: defaultHashedPassword
    });
  }

  // 2. Badges for Priyam Sharma (usr_001)
  const badges = [
    { _id: 'b1', user: 'usr_001', badgeId: 'b1', title: 'Zero Waste Pioneer', icon: '🌱', description: 'Donated 10+ items within campus', earnedAt: 'Jan 2026' },
    { _id: 'b2', user: 'usr_001', badgeId: 'b2', title: 'Semester Saver', icon: '📚', description: 'Shared core engineering textbooks', earnedAt: 'Sep 2025' },
    { _id: 'b3', user: 'usr_001', badgeId: 'b3', title: 'Reliable Borrower', icon: '⭐', description: 'Returned all borrowed lab equipment on time', earnedAt: 'Nov 2025' },
    { _id: 'b4', user: 'usr_001', badgeId: 'b4', title: 'Speedy Dispatcher', icon: '⚡', description: 'Responded to pickup requests within 2 hours', earnedAt: 'Feb 2026' }
  ];

  for (const b of badges) {
    await UserBadge.create(b);
  }

  // 3. Rewards History for Priyam Sharma
  const rewards = [
    { _id: 'rw1', user: 'usr_001', action: 'Donated "Adv. Engineering Math"', points: 50, date: '2026-03-02', type: 'earn' },
    { _id: 'rw2', user: 'usr_001', action: 'Lent Arduino Kit to Lab Junior', points: 30, date: '2026-02-28', type: 'earn' },
    { _id: 'rw3', user: 'usr_001', action: 'Redeemed Canteen Coupon (₹100)', points: -150, date: '2026-02-20', type: 'redeem' },
    { _id: 'rw4', user_id: 'usr_001', user: 'usr_001', action: 'Completed Semester Eco-Challenge', points: 100, date: '2026-02-14', type: 'earn' },
    { _id: 'rw5', user_id: 'usr_001', user: 'usr_001', action: 'Exchanged Drafter for Scientific Calc', points: 40, date: '2026-02-05', type: 'earn' }
  ];

  for (const r of rewards) {
    await RewardHistory.create(r);
  }

  // 4. Resources
  const resources = [
    {
      _id: 'res_101',
      title: 'Advanced Engineering Mathematics by Erwin Kreyszig (10th Ed)',
      description: 'Clean copy with light pencil markings. Covers differential equations, linear algebra, and complex analysis. Essential for 3rd and 4th sem CSE, ECE and ME students at ADTU.',
      category: 'Books',
      sharingType: 'DONATE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupInfo: 'Central Library Ground Floor Lobby or Faculty Gate between 4 PM - 5:30 PM',
      contactPreference: 'Campus Email (@adtu.edu.in)',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_001',
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
      _id: 'res_102',
      title: 'White Cotton Lab Coat (Unisex, Size 40/L) - Cleaned & Pressed',
      description: 'Standard ADTU regulation white coat for Biotech, Pharmacy, and Chemistry lab practicals. Two front pockets, no chemical stains. Ready for immediate use.',
      category: 'Clothing',
      sharingType: 'BORROW',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Pharmaceutical Sciences',
      pickupInfo: 'Outside Pharmacy Lab 3 or Girls Hostel C Gate',
      contactPreference: 'Hostel Reception Gate C',
      images: ['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_002',
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
      _id: 'res_103',
      title: 'Casio FX-991EX ClassWiz Non-Programmable Scientific Calculator',
      description: 'Original Casio scientific calculator approved for university exams. High-res LCD, 552 functions, solar + battery. Want to swap for Python for Data Analysis book or similar programming reference.',
      category: 'Electronics',
      sharingType: 'EXCHANGE',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Engineering & Technology',
      pickupInfo: 'Engineering Block Foyer (Room E-204) during break',
      contactPreference: 'Campus Email (@adtu.edu.in)',
      images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_003',
      isUrgent: false,
      returnPeriod: null,
      returnDate: null,
      exchangeItem: "O'Reilly Python for Data Science or DSA textbook",
      exchangeRequirements: "Looking for O'Reilly Python Data Science Handbook or DSA textbook in C++",
      foodExpiryDate: null,
      packagingInfo: null,
      storageInstructions: null,
      viewsCount: 210,
      requestsCount: 5,
      noteColor: '#FFB04A'
    },
    {
      _id: 'res_104',
      title: 'Arduino Uno Starter Kit + Breadboard, Jumper Wires & Ultrasonic Sensor',
      description: 'Lending my IoT practical starter kit for upcoming mini-project submissions. Includes Uno R3, 830-point breadboard, resistors, LEDs, HC-SR04 sensor, and servo motor.',
      category: 'Electronics',
      sharingType: 'BORROW',
      condition: 'Good Condition',
      status: 'RESERVED',
      community: 'ADTU - Faculty of Engineering & Technology',
      pickupInfo: 'Robotics & Embedded Systems Lab or Boys Hostel 1',
      contactPreference: 'Phone / WhatsApp (+91 98765-43210)',
      images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_001',
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
      _id: 'res_105',
      title: 'Prestige 1.5L Stainless Steel Electric Kettle (Auto Shut-Off)',
      description: 'Perfect for boiling water, green tea, or making instant noodles late night in the hostel. Clean interior, fully working heating coil.',
      category: 'Household',
      sharingType: 'DONATE',
      condition: 'Good Condition',
      status: 'CLAIMED',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickupInfo: 'Block 2 Ground Floor Reception',
      contactPreference: 'Hostel Block 2 Reception',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_004',
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
      _id: 'res_106',
      title: 'Ergonomic Wooden Folding Hostel Study Table with Drawer',
      description: 'Sturdy multi-purpose wooden study desk with pre-installed cup holder and laptop riser slot. Perfect for hostel rooms with limited space. Legs fold completely flat.',
      category: 'Furniture',
      sharingType: 'DONATE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickupInfo: 'Boys Hostel Block 2, Room 304 or common quadrangle',
      contactPreference: 'Hostel Reception / Campus Meetup',
      images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_001',
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
      _id: 'res_107',
      title: 'Mini Drafter with Metal Clamp + Imperial Drawing Board (Rotring)',
      description: 'Engineering drawing essentials for 1st year B.Tech students. Sturdy scale, free rotation protractor head, smoothly slides with zero hitch.',
      category: 'Others',
      sharingType: 'DONATE',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupInfo: 'Drawing Hall D-101 or Campus Amphitheatre',
      contactPreference: 'Campus Email (@adtu.edu.in)',
      images: ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_005',
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
      _id: 'res_108',
      title: 'Factory Sealed Pack: Tata Gold Tea 500g + Britannia Marie Biscuits',
      description: 'Extra unopened pantry groceries sent from home. Expiry date verified as Nov 2026. Clean, dry, air-tight packaging. Free to any student or hostel room.',
      category: 'Food',
      sharingType: 'DONATE',
      condition: 'Brand New',
      status: 'AVAILABLE',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickupInfo: 'Block 1 common room, evening 7 PM',
      contactPreference: 'Hostel Block 1 Common Room',
      images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_001',
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
      _id: 'res_109',
      title: 'Dual-Head Stethoscope with Spare Ear Tips (Clinical Lab Practical)',
      description: 'Stainless steel chestpiece, high acoustic sensitivity. Perfect for clinical rotations and vital sign practice. Lending for current semester.',
      category: 'Others',
      sharingType: 'BORROW',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Nursing & Allied Health',
      pickupInfo: 'Nursing Skills Lab or Central Canteen',
      contactPreference: 'Nursing Faculty Foyer',
      images: ['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_007',
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
      _id: 'res_110',
      title: 'Yonex Muscle Power Badminton Racket + Pack of 3 Mavis Shuttles',
      description: 'Full graphite frame, recently re-strung at 24lbs tension. Looking to swap for table tennis paddles or outdoor basketball.',
      category: 'Others',
      sharingType: 'EXCHANGE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupInfo: 'University Sports Complex Indoor Court around 5 PM',
      contactPreference: 'Sports Complex Reception',
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'],
      postedBy: 'usr_008',
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

  for (const res of resources) {
    await Resource.create(res);
  }

  // 5. Requests
  const requests = [
    {
      _id: 'req_201',
      resource: 'res_101',
      requester: 'usr_009',
      message: 'Hey Priyam! Need this book desperately for the upcoming midterm exams on differential equations. Can collect whenever you are free around campus.',
      status: 'PENDING',
      pickupLocation: 'Central Library Ground Floor Lobby',
      preferredTime: 'Tomorrow at 4:30 PM',
      returnDate: null,
      returned: false
    },
    {
      _id: 'req_202',
      resource: 'res_104',
      requester: 'usr_010',
      message: 'Working on an automated smart irrigation sensor demo for our IoT lab assignment. Will keep it spotless and return by the 25th as promised!',
      status: 'ACCEPTED',
      pickupLocation: 'Robotics & Embedded Systems Lab',
      preferredTime: 'Friday at 2:00 PM',
      returnDate: '2026-03-25',
      returned: false
    },
    {
      _id: 'req_203',
      resource: 'res_108',
      requester: 'usr_011',
      message: 'Hostel evening tea session sorted! Can I pick it up from Block 1 common room today?',
      status: 'READY_PICKUP',
      pickupLocation: 'Block 1 common room, evening 7 PM',
      preferredTime: 'Tonight 7:15 PM',
      returnDate: null,
      returned: false
    },
    {
      _id: 'req_204',
      resource: 'res_102',
      requester: 'usr_001',
      message: 'Hi Ananya, I have an inter-departmental Chemistry lab evaluation next Tuesday. Would love to borrow your lab coat for two weeks.',
      status: 'ACCEPTED',
      pickupLocation: 'Outside Pharmacy Lab 3',
      preferredTime: 'Thursday 1:15 PM',
      returnDate: '2026-03-21',
      returned: false
    },
    {
      _id: 'req_205',
      resource: 'res_107',
      requester: 'usr_001',
      message: 'Hi Snigdha, need a mini drafter for our graphics project submission this week! Can pick it up anytime today.',
      status: 'READY_PICKUP',
      pickupLocation: 'Drawing Hall D-101 counter',
      preferredTime: 'Today at 3:00 PM',
      returnDate: null,
      returned: false
    },
    {
      _id: 'req_206',
      resource: 'res_109',
      requester: 'usr_001',
      message: 'Borrowed for mid-term numerical methods exam. Handover was smooth!',
      status: 'COMPLETED',
      pickupLocation: 'Central Library Foyer',
      preferredTime: 'Completed',
      returnDate: '2026-03-15',
      returned: false
    },
    {
      _id: 'req_207',
      resource: 'res_110',
      requester: 'usr_001',
      message: 'I have a pair of Stag 4-star Table Tennis racquets in great shape to exchange!',
      status: 'PENDING',
      pickupLocation: 'Sports Complex Indoor Court',
      preferredTime: 'Wednesday evening',
      returnDate: null,
      returned: false
    }
  ];

  for (const req of requests) {
    await Request.create(req);
  }

  // 6. Transactions
  const transactions = [
    {
      _id: 'txn_901',
      transactionCode: 'TXN-2026-0091',
      resource: 'res_105',
      resourceTitle: 'Prestige 1.5L Stainless Steel Electric Kettle',
      resourceImage: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
      category: 'Household',
      sharingType: 'DONATE',
      provider: 'usr_001',
      receiver: 'usr_004',
      date: '2026-02-28',
      status: 'COMPLETED',
      pointsEarned: 50,
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickupDetails: 'Block 2 Ground Floor Reception, 6:00 PM',
      returnDate: null,
      notes: 'Handover verified at Block 2 reception. Item inspected and operational.'
    },
    {
      _id: 'txn_902',
      transactionCode: 'TXN-2026-0084',
      resource: 'res_101',
      resourceTitle: 'Data Structures and Algorithms in C++ (Horowitz)',
      resourceImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category: 'Books',
      sharingType: 'DONATE',
      provider: 'usr_001',
      receiver: 'usr_015',
      date: '2026-02-22',
      status: 'COMPLETED',
      pointsEarned: 50,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupDetails: 'Central Library Cafe',
      returnDate: null,
      notes: 'Book donated to 2nd year student. Clean handover at Library Cafe.'
    },
    {
      _id: 'txn_903',
      transactionCode: 'TXN-2026-0103',
      resource: 'res_104',
      resourceTitle: 'Arduino Uno Starter Kit + Breadboard & Sensors',
      resourceImage: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      sharingType: 'BORROW',
      provider: 'usr_001',
      receiver: 'usr_010',
      date: '2026-03-05',
      status: 'IN_PROGRESS',
      pointsEarned: 0,
      community: 'ADTU - Faculty of Engineering & Tech',
      pickupDetails: 'Robotics & Embedded Systems Lab Counter',
      returnDate: '2026-03-25',
      notes: 'Active borrow for IoT assignment. Due for campus return by March 25th.'
    },
    {
      _id: 'txn_904',
      transactionCode: 'TXN-2026-0108',
      resource: 'res_102',
      resourceTitle: 'White Cotton Lab Coat (Unisex, Size 40/L)',
      resourceImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      category: 'Clothing',
      sharingType: 'BORROW',
      provider: 'usr_002',
      receiver: 'usr_001',
      date: '2026-03-07',
      status: 'IN_PROGRESS',
      pointsEarned: 0,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupDetails: 'Outside Pharmacy Lab 3, 1:15 PM',
      returnDate: '2026-03-21',
      notes: 'Borrowed for Chemistry evaluation. Expected return to Ananya on March 21.'
    },
    {
      _id: 'txn_905',
      transactionCode: 'TXN-2026-0112',
      resource: 'res_108',
      resourceTitle: 'Tata Gold Tea 500g + Britannia Marie Biscuits',
      resourceImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'Food',
      sharingType: 'DONATE',
      provider: 'usr_001',
      receiver: 'usr_011',
      date: '2026-03-08',
      status: 'PENDING_HANDOVER',
      pointsEarned: 0,
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickupDetails: 'Block 1 Common Room, Tonight 7:15 PM',
      returnDate: null,
      notes: 'Approved request awaiting physical collection at hostel.'
    },
    {
      _id: 'txn_906',
      transactionCode: 'TXN-2026-0078',
      resource: 'res_110',
      resourceTitle: 'Yonex Badminton Racket for TT Paddles',
      resourceImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      category: 'Others',
      sharingType: 'EXCHANGE',
      provider: 'usr_008',
      receiver: 'usr_001',
      date: '2026-02-18',
      status: 'COMPLETED',
      pointsEarned: 40,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickupDetails: 'University Sports Complex Indoor Court',
      returnDate: null,
      notes: 'Successful mutual exchange verified at sports complex.'
    }
  ];

  for (const t of transactions) {
    await Transaction.create(t);
  }

  // 7. Notifications for Priyam Sharma (usr_001)
  const notifications = [
    {
      _id: 'notif_1',
      user: 'usr_001',
      title: 'New request received',
      message: 'Dipankar requested your "Engineering Mathematics" textbook.',
      time: '10m ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      _id: 'notif_2',
      user: 'usr_001',
      title: 'Request accepted!',
      message: 'Ananya accepted your request for the White Cotton Lab Coat.',
      time: '2h ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      _id: 'notif_3',
      user: 'usr_001',
      title: '+50 RePoints Awarded',
      message: 'Your completed donation of the kettle was confirmed.',
      time: '1d ago',
      read: true,
      link: '/dashboard/profile'
    }
  ];

  for (const n of notifications) {
    await Notification.create(n);
  }

  // 8. Community Hub Info
  const announcements = [
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
  ];

  const coordinators = [
    { name: 'Dr. B. K. Sarma', role: 'Faculty Mentor (Dept of CSE)', contact: 'bksarma@adtu.edu.in' },
    { name: 'Priyam Sharma', role: 'Student Lead Coordinator', contact: 'priyam.sharma@adtu.edu.in' },
    { name: 'Ananya Deka', role: 'Sustainability Representative', contact: 'ananya.d@adtu.edu.in' }
  ];

  await CommunityInfo.create({
    _id: 'adtu_hub',
    name: 'Assam Down Town University (ADTU) Resource Hub',
    tagline: 'Empowering students and faculty to share, reuse, and eliminate campus waste.',
    location: 'Sankar Madhab Path, Gandhi Nagar, Panikhaiti, Guwahati, Assam 781026',
    membersCount: 1420,
    resourcesListed: 580,
    itemsExchangedOrDonated: 412,
    co2SavedKg: 1240.5,
    about: 'Founded in early 2026 by engineering students at Assam Down Town University, ReConnect ADTU is our premier campus circular economy initiative. Whether passing on expensive medical and engineering textbooks to juniors, lending lab aprons, or exchanging hostel appliances before semester breaks, our noticeboard ensures zero usable equipment heads to Guwahati landfills.',
    announcements,
    coordinators
  });

  console.log('✓ Successfully seeded initial ADTU Campus dataset into MongoDB Atlas.');
}

export default seedDatabase;
