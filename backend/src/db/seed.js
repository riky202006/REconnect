import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export async function seedDatabase() {
  const { rows } = await db.query('SELECT COUNT(*) as count FROM users');
  const count = parseInt(rows[0]?.count ?? 0, 10);

  if (count > 0) {
    console.log(`Database already contains ${count} users. Skipping seed.`);
    return;
  }

  console.log('Seeding initial ADTU Campus dataset into database...');

  const defaultHashedPassword = await bcrypt.hash('adtu2026pass', 10);
  const now = new Date().toISOString();

  // 1. Users
  const users = [
    {
      id: 'usr_001',
      name: 'Priyam Sharma',
      email: 'priyam.sharma@adtu.edu.in',
      department: 'Faculty of Engineering & Tech (CSE - 6th Sem)',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 2, Room 304',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      re_points: 485,
      level: 'Campus Champion',
      joined_date: 'August 2025',
      rating: 4.9,
      verified_student: true
    },
    {
      id: 'usr_002',
      name: 'Ananya Deka',
      email: 'ananya.d@adtu.edu.in',
      department: 'Faculty of Pharmaceutical Sciences',
      community: 'ADTU - Faculty of Pharmaceutical Sciences',
      hostel: 'Girls Hostel C, Room 102',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      re_points: 720,
      level: 'Eco Champion',
      joined_date: 'July 2025',
      rating: 5.0,
      verified_student: true
    },
    {
      id: 'usr_003',
      name: 'Rohan Bordoloi',
      email: 'rohan.b@adtu.edu.in',
      department: 'Faculty of Engineering & Technology (ECE)',
      community: 'ADTU - Faculty of Engineering & Technology',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      re_points: 430,
      level: 'Resource Guru',
      joined_date: 'September 2025',
      rating: 4.8,
      verified_student: true
    },
    {
      id: 'usr_004',
      name: 'Bikash Gogoi',
      email: 'bikash.g@adtu.edu.in',
      department: 'Faculty of Computer Science & IT',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      hostel: 'Boys Hostel Block 2, Room 210',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      re_points: 295,
      level: 'Community Hero',
      joined_date: 'October 2025',
      rating: 4.7,
      verified_student: true
    },
    {
      id: 'usr_005',
      name: 'Snigdha Saikia',
      email: 'snigdha.s@adtu.edu.in',
      department: 'Faculty of Nursing & Allied Health',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      re_points: 645,
      level: 'Master Donor',
      joined_date: 'June 2025',
      rating: 5.0,
      verified_student: true
    },
    {
      id: 'usr_006',
      name: 'Debojit Kalita',
      email: 'debojit.k@adtu.edu.in',
      department: 'Faculty of Management Studies',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Day Scholar',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      re_points: 340,
      level: 'Helpful Hand',
      joined_date: 'November 2025',
      rating: 4.8,
      verified_student: true
    },
    {
      id: 'usr_007',
      name: 'Pallavi Hazarika',
      email: 'pallavi.h@adtu.edu.in',
      department: 'Faculty of Nursing & Allied Health',
      community: 'ADTU - Faculty of Nursing & Allied Health',
      hostel: 'Girls Hostel B',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      re_points: 390,
      level: 'Green Leader',
      joined_date: 'September 2025',
      rating: 4.9,
      verified_student: true
    },
    {
      id: 'usr_008',
      name: 'Kallol Barman',
      email: 'kallol.b@adtu.edu.in',
      department: 'Faculty of Engineering (Mechanical)',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 3',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      re_points: 310,
      level: 'Active Member',
      joined_date: 'December 2025',
      rating: 4.7,
      verified_student: true
    },
    {
      id: 'usr_009',
      name: 'Dipankar Nath',
      email: 'dipankar.n@adtu.edu.in',
      department: 'ECE - 4th Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      re_points: 120,
      level: 'Campus Member',
      joined_date: 'January 2026',
      rating: 4.8,
      verified_student: true
    },
    {
      id: 'usr_010',
      name: 'Trishna Chaliha',
      email: 'trishna.c@adtu.edu.in',
      department: 'CSE - 6th Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel C',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      re_points: 180,
      level: 'Campus Member',
      joined_date: 'August 2025',
      rating: 4.9,
      verified_student: true
    },
    {
      id: 'usr_011',
      name: 'Hiren Medhi',
      email: 'hiren.m@adtu.edu.in',
      department: 'B.Pharm - 2nd Year',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      hostel: 'Boys Hostel Block 1',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      re_points: 90,
      level: 'Campus Member',
      joined_date: 'February 2026',
      rating: 4.6,
      verified_student: true
    },
    {
      id: 'usr_015',
      name: 'Riya Sen',
      email: 'riya.s@adtu.edu.in',
      department: 'CSE - 2nd Sem',
      community: 'ADTU - Main Campus (Panikhaiti)',
      hostel: 'Girls Hostel A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      re_points: 140,
      level: 'Campus Member',
      joined_date: 'January 2026',
      rating: 4.9,
      verified_student: true
    }
  ];

  for (const u of users) {
    await db.query(
      `INSERT INTO users (id, name, email, password, department, community, hostel, avatar, re_points, level, joined_date, rating, verified_student, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        u.id,
        u.name,
        u.email,
        defaultHashedPassword,
        u.department,
        u.community,
        u.hostel,
        u.avatar,
        u.re_points,
        u.level,
        u.joined_date,
        u.rating,
        u.verified_student,
        now,
        now
      ]
    );
  }

  // 2. Badges for Priyam Sharma (usr_001)
  const badges = [
    { id: 'b1', user_id: 'usr_001', badge_id: 'b1', title: 'Zero Waste Pioneer', icon: '🌱', description: 'Donated 10+ items within campus', earned_at: 'Jan 2026' },
    { id: 'b2', user_id: 'usr_001', badge_id: 'b2', title: 'Semester Saver', icon: '📚', description: 'Shared core engineering textbooks', earned_at: 'Sep 2025' },
    { id: 'b3', user_id: 'usr_001', badge_id: 'b3', title: 'Reliable Borrower', icon: '⭐', description: 'Returned all borrowed lab equipment on time', earned_at: 'Nov 2025' },
    { id: 'b4', user_id: 'usr_001', badge_id: 'b4', title: 'Speedy Dispatcher', icon: '⚡', description: 'Responded to pickup requests within 2 hours', earned_at: 'Feb 2026' }
  ];

  for (const b of badges) {
    await db.query(
      `INSERT INTO user_badges (id, user_id, badge_id, title, icon, description, earned_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [b.id, b.user_id, b.badge_id, b.title, b.icon, b.description, b.earned_at]
    );
  }

  // 3. Rewards History for Priyam Sharma
  const rewards = [
    { id: 'rw1', user_id: 'usr_001', action: 'Donated "Adv. Engineering Math"', points: 50, date: '2026-03-02', type: 'earn' },
    { id: 'rw2', user_id: 'usr_001', action: 'Lent Arduino Kit to Lab Junior', points: 30, date: '2026-02-28', type: 'earn' },
    { id: 'rw3', user_id: 'usr_001', action: 'Redeemed Canteen Coupon (₹100)', points: -150, date: '2026-02-20', type: 'redeem' },
    { id: 'rw4', user_id: 'usr_001', action: 'Completed Semester Eco-Challenge', points: 100, date: '2026-02-14', type: 'earn' },
    { id: 'rw5', user_id: 'usr_001', action: 'Exchanged Drafter for Scientific Calc', points: 40, date: '2026-02-05', type: 'earn' }
  ];

  for (const r of rewards) {
    await db.query(
      `INSERT INTO rewards_history (id, user_id, action, points, date, type, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [r.id, r.user_id, r.action, r.points, r.date, r.type, now]
    );
  }

  // 4. Resources
  const resources = [
    {
      id: 'res_101',
      title: 'Advanced Engineering Mathematics by Erwin Kreyszig (10th Ed)',
      description: 'Clean copy with light pencil markings. Covers differential equations, linear algebra, and complex analysis. Essential for 3rd and 4th sem CSE, ECE and ME students at ADTU.',
      category: 'Books',
      sharing_type: 'DONATE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_info: 'Central Library Ground Floor Lobby or Faculty Gate between 4 PM - 5:30 PM',
      contact_preference: 'Campus Email (@adtu.edu.in)',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_001',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 142,
      requests_count: 3,
      note_color: '#FF6FA5',
      created_at: '2026-03-05T10:30:00Z',
      updated_at: '2026-03-05T10:30:00Z'
    },
    {
      id: 'res_102',
      title: 'White Cotton Lab Coat (Unisex, Size 40/L) - Cleaned & Pressed',
      description: 'Standard ADTU regulation white coat for Biotech, Pharmacy, and Chemistry lab practicals. Two front pockets, no chemical stains. Ready for immediate use.',
      category: 'Clothing',
      sharing_type: 'BORROW',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Pharmaceutical Sciences',
      pickup_info: 'Outside Pharmacy Lab 3 or Girls Hostel C Gate',
      contact_preference: 'Hostel Reception Gate C',
      images: JSON.stringify(['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_002',
      is_urgent: true,
      return_period: 'Current Semester (~5 Weeks)',
      return_date: '2026-04-15',
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 88,
      requests_count: 2,
      note_color: '#8FD3F4',
      created_at: '2026-03-06T09:15:00Z',
      updated_at: '2026-03-06T09:15:00Z'
    },
    {
      id: 'res_103',
      title: 'Casio FX-991EX ClassWiz Non-Programmable Scientific Calculator',
      description: 'Original Casio scientific calculator approved for university exams. High-res LCD, 552 functions, solar + battery. Want to swap for Python for Data Analysis book or similar programming reference.',
      category: 'Electronics',
      sharing_type: 'EXCHANGE',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Engineering & Technology',
      pickup_info: 'Engineering Block Foyer (Room E-204) during break',
      contact_preference: 'Campus Email (@adtu.edu.in)',
      images: JSON.stringify(['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_003',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: "O'Reilly Python for Data Science or DSA textbook",
      exchange_requirements: "Looking for O'Reilly Python Data Science Handbook or DSA textbook in C++",
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 210,
      requests_count: 5,
      note_color: '#FFB04A',
      created_at: '2026-03-07T14:20:00Z',
      updated_at: '2026-03-07T14:20:00Z'
    },
    {
      id: 'res_104',
      title: 'Arduino Uno Starter Kit + Breadboard, Jumper Wires & Ultrasonic Sensor',
      description: 'Lending my IoT practical starter kit for upcoming mini-project submissions. Includes Uno R3, 830-point breadboard, resistors, LEDs, HC-SR04 sensor, and servo motor.',
      category: 'Electronics',
      sharing_type: 'BORROW',
      condition: 'Good Condition',
      status: 'RESERVED',
      community: 'ADTU - Faculty of Engineering & Technology',
      pickup_info: 'Robotics & Embedded Systems Lab or Boys Hostel 1',
      contact_preference: 'Phone / WhatsApp (+91 98765-43210)',
      images: JSON.stringify(['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_001',
      is_urgent: false,
      return_period: '3 Weeks',
      return_date: '2026-03-25',
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 304,
      requests_count: 6,
      note_color: '#8FD3F4',
      created_at: '2026-03-01T11:00:00Z',
      updated_at: '2026-03-01T11:00:00Z'
    },
    {
      id: 'res_105',
      title: 'Prestige 1.5L Stainless Steel Electric Kettle (Auto Shut-Off)',
      description: 'Perfect for boiling water, green tea, or making instant noodles late night in the hostel. Clean interior, fully working heating coil.',
      category: 'Household',
      sharing_type: 'DONATE',
      condition: 'Good Condition',
      status: 'CLAIMED',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickup_info: 'Block 2 Ground Floor Reception',
      contact_preference: 'Hostel Block 2 Reception',
      images: JSON.stringify(['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_004',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 195,
      requests_count: 4,
      note_color: '#DDF247',
      created_at: '2026-02-26T16:45:00Z',
      updated_at: '2026-02-26T16:45:00Z'
    },
    {
      id: 'res_106',
      title: 'Ergonomic Wooden Folding Hostel Study Table with Drawer',
      description: 'Sturdy multi-purpose wooden study desk with pre-installed cup holder and laptop riser slot. Perfect for hostel rooms with limited space. Legs fold completely flat.',
      category: 'Furniture',
      sharing_type: 'DONATE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickup_info: 'Boys Hostel Block 2, Room 304 or common quadrangle',
      contact_preference: 'Hostel Reception / Campus Meetup',
      images: JSON.stringify(['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_001',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 120,
      requests_count: 2,
      note_color: '#DDF247',
      created_at: '2026-03-08T14:00:00Z',
      updated_at: '2026-03-08T14:00:00Z'
    },
    {
      id: 'res_107',
      title: 'Mini Drafter with Metal Clamp + Imperial Drawing Board (Rotring)',
      description: 'Engineering drawing essentials for 1st year B.Tech students. Sturdy scale, free rotation protractor head, smoothly slides with zero hitch.',
      category: 'Others',
      sharing_type: 'DONATE',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_info: 'Drawing Hall D-101 or Campus Amphitheatre',
      contact_preference: 'Campus Email (@adtu.edu.in)',
      images: JSON.stringify(['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_005',
      is_urgent: true,
      return_period: null,
      return_date: null,
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 176,
      requests_count: 7,
      note_color: '#FF6FA5',
      created_at: '2026-03-08T08:00:00Z',
      updated_at: '2026-03-08T08:00:00Z'
    },
    {
      id: 'res_108',
      title: 'Factory Sealed Pack: Tata Gold Tea 500g + Britannia Marie Biscuits',
      description: 'Extra unopened pantry groceries sent from home. Expiry date verified as Nov 2026. Clean, dry, air-tight packaging. Free to any student or hostel room.',
      category: 'Food',
      sharing_type: 'DONATE',
      condition: 'Brand New',
      status: 'AVAILABLE',
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickup_info: 'Block 1 common room, evening 7 PM',
      contact_preference: 'Hostel Block 1 Common Room',
      images: JSON.stringify(['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_001',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: '2026-11-20',
      packaging_info: 'Factory vacuum sealed in original cartons, unopened',
      storage_instructions: 'Store in dry pantry away from direct moisture',
      views_count: 65,
      requests_count: 1,
      note_color: '#FF6FA5',
      created_at: '2026-03-08T15:30:00Z',
      updated_at: '2026-03-08T15:30:00Z'
    },
    {
      id: 'res_109',
      title: 'Dual-Head Stethoscope with Spare Ear Tips (Clinical Lab Practical)',
      description: 'Stainless steel chestpiece, high acoustic sensitivity. Perfect for clinical rotations and vital sign practice. Lending for current semester.',
      category: 'Others',
      sharing_type: 'BORROW',
      condition: 'Like New',
      status: 'AVAILABLE',
      community: 'ADTU - Faculty of Nursing & Allied Health',
      pickup_info: 'Nursing Skills Lab or Central Canteen',
      contact_preference: 'Nursing Faculty Foyer',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_007',
      is_urgent: false,
      return_period: 'Full Semester (~2 Months)',
      return_date: '2026-05-10',
      exchange_item: null,
      exchange_requirements: null,
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 189,
      requests_count: 4,
      note_color: '#8FD3F4',
      created_at: '2026-03-04T13:10:00Z',
      updated_at: '2026-03-04T13:10:00Z'
    },
    {
      id: 'res_110',
      title: 'Yonex Muscle Power Badminton Racket + Pack of 3 Mavis Shuttles',
      description: 'Full graphite frame, recently re-strung at 24lbs tension. Looking to swap for table tennis paddles or outdoor basketball.',
      category: 'Others',
      sharing_type: 'EXCHANGE',
      condition: 'Good Condition',
      status: 'AVAILABLE',
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_info: 'University Sports Complex Indoor Court around 5 PM',
      contact_preference: 'Sports Complex Reception',
      images: JSON.stringify(['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80']),
      posted_by_id: 'usr_008',
      is_urgent: false,
      return_period: null,
      return_date: null,
      exchange_item: 'Stag 4-Star Table Tennis Paddle',
      exchange_requirements: 'Swap with Stag 4-star Table Tennis Racquet or Spalding Basketball',
      food_expiry_date: null,
      packaging_info: null,
      storage_instructions: null,
      views_count: 140,
      requests_count: 2,
      note_color: '#FFB04A',
      created_at: '2026-03-03T18:00:00Z',
      updated_at: '2026-03-03T18:00:00Z'
    }
  ];

  for (const res of resources) {
    await db.query(
      `INSERT INTO resources (
        id, title, description, category, sharing_type, condition, status, community,
        pickup_info, contact_preference, images, posted_by_id, is_urgent, return_period,
        return_date, exchange_item, exchange_requirements, food_expiry_date, packaging_info,
        storage_instructions, views_count, requests_count, note_color, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
      [
        res.id,
        res.title,
        res.description,
        res.category,
        res.sharing_type,
        res.condition,
        res.status,
        res.community,
        res.pickup_info,
        res.contact_preference,
        res.images,
        res.posted_by_id,
        res.is_urgent,
        res.return_period,
        res.return_date,
        res.exchange_item,
        res.exchange_requirements,
        res.food_expiry_date,
        res.packaging_info,
        res.storage_instructions,
        res.views_count,
        res.requests_count,
        res.note_color,
        res.created_at,
        res.updated_at
      ]
    );
  }

  // 5. Requests
  const requests = [
    {
      id: 'req_201',
      resource_id: 'res_101',
      requester_id: 'usr_009',
      message: 'Hey Priyam! Need this book desperately for the upcoming midterm exams on differential equations. Can collect whenever you are free around campus.',
      status: 'PENDING',
      pickup_location: 'Central Library Ground Floor Lobby',
      preferred_time: 'Tomorrow at 4:30 PM',
      return_date: null,
      returned: false,
      created_at: '2026-03-07T11:45:00Z',
      updated_at: '2026-03-07T11:45:00Z'
    },
    {
      id: 'req_202',
      resource_id: 'res_104',
      requester_id: 'usr_010',
      message: 'Working on an automated smart irrigation sensor demo for our IoT lab assignment. Will keep it spotless and return by the 25th as promised!',
      status: 'ACCEPTED',
      pickup_location: 'Robotics & Embedded Systems Lab',
      preferred_time: 'Friday at 2:00 PM',
      return_date: '2026-03-25',
      returned: false,
      created_at: '2026-03-05T14:10:00Z',
      updated_at: '2026-03-05T14:10:00Z'
    },
    {
      id: 'req_203',
      resource_id: 'res_108',
      requester_id: 'usr_011',
      message: 'Hostel evening tea session sorted! Can I pick it up from Block 1 common room today?',
      status: 'READY_PICKUP',
      pickup_location: 'Block 1 common room, evening 7 PM',
      preferred_time: 'Tonight 7:15 PM',
      return_date: null,
      returned: false,
      created_at: '2026-03-08T16:00:00Z',
      updated_at: '2026-03-08T16:00:00Z'
    },
    {
      id: 'req_204',
      resource_id: 'res_102',
      requester_id: 'usr_001',
      message: 'Hi Ananya, I have an inter-departmental Chemistry lab evaluation next Tuesday. Would love to borrow your lab coat for two weeks.',
      status: 'ACCEPTED',
      pickup_location: 'Outside Pharmacy Lab 3',
      preferred_time: 'Thursday 1:15 PM',
      return_date: '2026-03-21',
      returned: false,
      created_at: '2026-03-07T08:30:00Z',
      updated_at: '2026-03-07T10:15:00Z'
    },
    {
      id: 'req_205',
      resource_id: 'res_107',
      requester_id: 'usr_001',
      message: 'Hi Snigdha, need a mini drafter for our graphics project submission this week! Can pick it up anytime today.',
      status: 'READY_PICKUP',
      pickup_location: 'Drawing Hall D-101 counter',
      preferred_time: 'Today at 3:00 PM',
      return_date: null,
      returned: false,
      created_at: '2026-03-08T09:15:00Z',
      updated_at: '2026-03-08T11:30:00Z'
    },
    {
      id: 'req_206',
      resource_id: 'res_109',
      requester_id: 'usr_001',
      message: 'Borrowed for mid-term numerical methods exam. Handover was smooth!',
      status: 'COMPLETED',
      pickup_location: 'Central Library Foyer',
      preferred_time: 'Completed',
      return_date: '2026-03-15',
      returned: false,
      created_at: '2026-03-01T10:00:00Z',
      updated_at: '2026-03-03T17:00:00Z'
    },
    {
      id: 'req_207',
      resource_id: 'res_110',
      requester_id: 'usr_001',
      message: 'I have a pair of Stag 4-star Table Tennis racquets in great shape to exchange!',
      status: 'PENDING',
      pickup_location: 'Sports Complex Indoor Court',
      preferred_time: 'Wednesday evening',
      return_date: null,
      returned: false,
      created_at: '2026-03-08T15:20:00Z',
      updated_at: '2026-03-08T15:20:00Z'
    }
  ];

  for (const req of requests) {
    await db.query(
      `INSERT INTO requests (id, resource_id, requester_id, message, status, pickup_location, preferred_time, return_date, returned, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        req.id,
        req.resource_id,
        req.requester_id,
        req.message,
        req.status,
        req.pickup_location,
        req.preferred_time,
        req.return_date,
        req.returned,
        req.created_at,
        req.updated_at
      ]
    );
  }

  // 6. Transactions
  const transactions = [
    {
      id: 'txn_901',
      transaction_code: 'TXN-2026-0091',
      resource_id: 'res_105',
      resource_title: 'Prestige 1.5L Stainless Steel Electric Kettle',
      resource_image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
      category: 'Household',
      sharing_type: 'DONATE',
      provider_id: 'usr_001',
      receiver_id: 'usr_004',
      date: '2026-02-28',
      status: 'COMPLETED',
      points_earned: 50,
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickup_details: 'Block 2 Ground Floor Reception, 6:00 PM',
      return_date: null,
      notes: 'Handover verified at Block 2 reception. Item inspected and operational.'
    },
    {
      id: 'txn_902',
      transaction_code: 'TXN-2026-0084',
      resource_id: 'res_101',
      resource_title: 'Data Structures and Algorithms in C++ (Horowitz)',
      resource_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category: 'Books',
      sharing_type: 'DONATE',
      provider_id: 'usr_001',
      receiver_id: 'usr_015',
      date: '2026-02-22',
      status: 'COMPLETED',
      points_earned: 50,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_details: 'Central Library Cafe',
      return_date: null,
      notes: 'Book donated to 2nd year student. Clean handover at Library Cafe.'
    },
    {
      id: 'txn_903',
      transaction_code: 'TXN-2026-0103',
      resource_id: 'res_104',
      resource_title: 'Arduino Uno Starter Kit + Breadboard & Sensors',
      resource_image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      sharing_type: 'BORROW',
      provider_id: 'usr_001',
      receiver_id: 'usr_010',
      date: '2026-03-05',
      status: 'IN_PROGRESS',
      points_earned: 0,
      community: 'ADTU - Faculty of Engineering & Tech',
      pickup_details: 'Robotics & Embedded Systems Lab Counter',
      return_date: '2026-03-25',
      notes: 'Active borrow for IoT assignment. Due for campus return by March 25th.'
    },
    {
      id: 'txn_904',
      transaction_code: 'TXN-2026-0108',
      resource_id: 'res_102',
      resource_title: 'White Cotton Lab Coat (Unisex, Size 40/L)',
      resource_image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      category: 'Clothing',
      sharing_type: 'BORROW',
      provider_id: 'usr_002',
      receiver_id: 'usr_001',
      date: '2026-03-07',
      status: 'IN_PROGRESS',
      points_earned: 0,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_details: 'Outside Pharmacy Lab 3, 1:15 PM',
      return_date: '2026-03-21',
      notes: 'Borrowed for Chemistry evaluation. Expected return to Ananya on March 21.'
    },
    {
      id: 'txn_905',
      transaction_code: 'TXN-2026-0112',
      resource_id: 'res_108',
      resource_title: 'Tata Gold Tea 500g + Britannia Marie Biscuits',
      resource_image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'Food',
      sharing_type: 'DONATE',
      provider_id: 'usr_001',
      receiver_id: 'usr_011',
      date: '2026-03-08',
      status: 'PENDING_HANDOVER',
      points_earned: 0,
      community: 'ADTU - Boys Hostel (Blocks 1-3)',
      pickup_details: 'Block 1 Common Room, Tonight 7:15 PM',
      return_date: null,
      notes: 'Approved request awaiting physical collection at hostel.'
    },
    {
      id: 'txn_906',
      transaction_code: 'TXN-2026-0078',
      resource_id: 'res_110',
      resource_title: 'Yonex Badminton Racket for TT Paddles',
      resource_image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      category: 'Others',
      sharing_type: 'EXCHANGE',
      provider_id: 'usr_008',
      receiver_id: 'usr_001',
      date: '2026-02-18',
      status: 'COMPLETED',
      points_earned: 40,
      community: 'ADTU - Main Campus (Panikhaiti)',
      pickup_details: 'University Sports Complex Indoor Court',
      return_date: null,
      notes: 'Successful mutual exchange verified at sports complex.'
    }
  ];

  for (const t of transactions) {
    await db.query(
      `INSERT INTO transactions (
        id, transaction_code, resource_id, resource_title, resource_image, category,
        sharing_type, provider_id, receiver_id, date, status, points_earned,
        community, pickup_details, return_date, notes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        t.id,
        t.transaction_code,
        t.resource_id,
        t.resource_title,
        t.resource_image,
        t.category,
        t.sharing_type,
        t.provider_id,
        t.receiver_id,
        t.date,
        t.status,
        t.points_earned,
        t.community,
        t.pickup_details,
        t.return_date,
        t.notes,
        now,
        now
      ]
    );
  }

  // 7. Notifications for Priyam Sharma (usr_001)
  const notifications = [
    {
      id: 'notif_1',
      user_id: 'usr_001',
      title: 'New request received',
      message: 'Dipankar requested your "Engineering Mathematics" textbook.',
      time: '10m ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      id: 'notif_2',
      user_id: 'usr_001',
      title: 'Request accepted!',
      message: 'Ananya accepted your request for the White Cotton Lab Coat.',
      time: '2h ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      id: 'notif_3',
      user_id: 'usr_001',
      title: '+50 RePoints Awarded',
      message: 'Your completed donation of the kettle was confirmed.',
      time: '1d ago',
      read: true,
      link: '/dashboard/profile'
    }
  ];

  for (const n of notifications) {
    await db.query(
      `INSERT INTO notifications (id, user_id, title, message, time, read, link, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [n.id, n.user_id, n.title, n.message, n.time, n.read, n.link, now]
    );
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

  await db.query(
    `INSERT INTO community_info (id, name, tagline, location, members_count, resources_listed, items_exchanged_or_donated, co2_saved_kg, about, announcements, coordinators)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      'adtu_hub',
      'Assam Down Town University (ADTU) Resource Hub',
      'Empowering students and faculty to share, reuse, and eliminate campus waste.',
      'Sankar Madhab Path, Gandhi Nagar, Panikhaiti, Guwahati, Assam 781026',
      1420,
      580,
      412,
      1240.5,
      'Founded in early 2026 by engineering students at Assam Down Town University, ReConnect ADTU is our premier campus circular economy initiative. Whether passing on expensive medical and engineering textbooks to juniors, lending lab aprons, or exchanging hostel appliances before semester breaks, our noticeboard ensures zero usable equipment heads to Guwahati landfills.',
      JSON.stringify(announcements),
      JSON.stringify(coordinators)
    ]
  );

  console.log('✓ Successfully seeded initial ADTU Campus dataset.');
}

export default seedDatabase;

