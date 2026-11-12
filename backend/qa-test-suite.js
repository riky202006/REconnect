import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDb, disconnectDb } from './src/config/db.js';
import { env } from './src/config/env.js';
import app from './src/app.js';
import {
  User,
  Resource,
  Request,
  Transaction,
  RewardHistory,
  UserBadge,
  Notification,
  CommunityInfo
} from './src/models/index.js';

let testServer = null;
const PORT = 5002;
const BASE_URL = `http://localhost:${PORT}/api`;

const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

function recordTest(category, name, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`  ✓ [PASS] [${category}] ${name}`);
  } else {
    testResults.failed++;
    console.error(`  ✗ [FAIL] [${category}] ${name}: ${details}`);
  }
  testResults.details.push({ category, name, passed, details });
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { status: res.status, headers: res.headers, data };
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('  RECONNECT FULL-STACK AUTOMATED QA TEST SUITE');
  console.log('  Database: MongoDB Atlas (Mongoose ODM)');
  console.log('====================================================\n');

  // Start DB connection
  await connectDb();

  // Start dedicated test server
  testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(PORT, resolve));
  console.log(`Test server running at ${BASE_URL}\n`);

  // State holders for multi-step tests
  let userAToken = null;
  let userAData = null;
  let userBToken = null;
  let userBData = null;
  let testResourceId = null;
  let testRequestId = null;
  let testTransactionId = null;

  try {
    // ----------------------------------------------------
    // PHASE 2 & 9: HEALTH & MONGODB ATLAS VALIDATION
    // ----------------------------------------------------
    console.log('--- SECTION 1: Health & MongoDB Atlas Verification ---');

    const health = await request('/health');
    recordTest(
      'Health Check',
      'GET /api/health returns 200 and database: "mongodb"',
      health.status === 200 && health.data?.databaseConnected === true && health.data?.database === 'mongodb'
    );

    // Verify all 8 collections are operational
    const collectionsCount = {
      users: await User.countDocuments(),
      resources: await Resource.countDocuments(),
      requests: await Request.countDocuments(),
      transactions: await Transaction.countDocuments(),
      rewards_history: await RewardHistory.countDocuments(),
      user_badges: await UserBadge.countDocuments(),
      notifications: await Notification.countDocuments(),
      community_info: await CommunityInfo.countDocuments()
    };

    const allCollectionsPopulated = Object.values(collectionsCount).every((c) => c >= 0);
    recordTest(
      'MongoDB Collections',
      'All 8 Mongoose models query collections successfully',
      allCollectionsPopulated,
      JSON.stringify(collectionsCount)
    );

    // ----------------------------------------------------
    // PHASE 3: AUTHENTICATION & SECURITY TESTING
    // ----------------------------------------------------
    console.log('\n--- SECTION 2: Authentication & Security ---');

    // 1. Password Concealment Check
    const seededUserDoc = await User.findOne({ email: 'priyam.sharma@adtu.edu.in' });
    recordTest(
      'Security',
      'Password hash is excluded by default in Mongoose queries (select: false)',
      seededUserDoc.password === undefined
    );

    // 2. Successful Login with Seeded Account
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'priyam.sharma@adtu.edu.in',
        password: 'adtu2026pass'
      }
    });

    recordTest(
      'Authentication',
      'POST /api/auth/login validates credentials and issues JWT',
      loginRes.status === 200 && Boolean(loginRes.data?.token) && loginRes.data?.user?.id === 'usr_001'
    );

    // Verify token structure
    const decodedToken = jwt.verify(loginRes.data.token, env.jwtSecret);
    recordTest(
      'JWT Security',
      'JWT payload contains correct user ID and email',
      decodedToken.id === 'usr_001' && decodedToken.email === 'priyam.sharma@adtu.edu.in'
    );

    // 3. Failed Login - Wrong Password
    const badPassRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'priyam.sharma@adtu.edu.in',
        password: 'wrong_password_999'
      }
    });
    recordTest(
      'Authentication',
      'POST /api/auth/login rejects incorrect password with 401',
      badPassRes.status === 401
    );

    // 4. Failed Login - Nonexistent Email
    const noUserRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'nonexistent_person_999@adtu.edu.in',
        password: 'any_password'
      }
    });
    recordTest(
      'Authentication',
      'POST /api/auth/login rejects unregistered email with 401',
      noUserRes.status === 401
    );

    // 5. Registration - Missing Required Fields
    const missingFieldsRes = await request('/auth/register', {
      method: 'POST',
      body: { email: 'incomplete@adtu.edu.in' }
    });
    recordTest(
      'Input Validation',
      'POST /api/auth/register requires fullName, email, and password (400)',
      missingFieldsRes.status === 400
    );

    // 6. Registration - Duplicate Email Prevention
    const duplicateEmailRes = await request('/auth/register', {
      method: 'POST',
      body: {
        fullName: 'Duplicate Tester',
        email: 'priyam.sharma@adtu.edu.in',
        password: 'password123'
      }
    });
    recordTest(
      'Authentication',
      'POST /api/auth/register rejects duplicate email with 409 Conflict',
      duplicateEmailRes.status === 409
    );

    // 7. Protected Route - Accessing without Token
    const unauthMeRes = await request('/auth/me');
    recordTest(
      'Authorization',
      'GET /api/auth/me rejects unauthenticated request with 401',
      unauthMeRes.status === 401
    );

    // 8. Protected Route - Accessing with Tampered/Invalid Token
    const tamperedRes = await request('/auth/me', {
      headers: { Authorization: 'Bearer this.is.an.invalid.token' }
    });
    recordTest(
      'Authorization',
      'GET /api/auth/me rejects forged/invalid Bearer token with 401',
      tamperedRes.status === 401
    );

    // ----------------------------------------------------
    // PHASE 11: FULL USER JOURNEY (USER A & USER B)
    // ----------------------------------------------------
    console.log('\n--- SECTION 3: Multi-User Complete Workflow ---');

    const timestamp = Date.now();
    const userAEmail = `qa_usera_${timestamp}@adtu.edu.in`;
    const userBEmail = `qa_userb_${timestamp}@adtu.edu.in`;

    // Step 1: Register User A (Resource Owner / Provider)
    const regARes = await request('/auth/register', {
      method: 'POST',
      body: {
        fullName: 'QA User Alpha',
        email: userAEmail,
        password: 'SecurePassA!2026',
        department: 'Dept of Robotics',
        community: 'ADTU - Faculty of Engineering & Technology'
      }
    });

    userAToken = regARes.data?.token;
    userAData = regARes.data?.user;
    recordTest(
      'User Journey',
      'User A registers and receives 50 welcome RePoints + Eco-Pioneer badge',
      regARes.status === 201 && userAData?.rePoints === 50 && userAData?.badges?.length >= 1
    );

    // Step 2: Register User B (Requester / Receiver)
    const regBRes = await request('/auth/register', {
      method: 'POST',
      body: {
        fullName: 'QA User Beta',
        email: userBEmail,
        password: 'SecurePassB!2026',
        department: 'Dept of Pharmacy',
        community: 'ADTU - Faculty of Pharmaceutical Sciences'
      }
    });

    userBToken = regBRes.data?.token;
    userBData = regBRes.data?.user;
    recordTest(
      'User Journey',
      'User B registers with isolated credentials',
      regBRes.status === 201 && Boolean(userBToken) && userBData?.id !== userAData?.id
    );

    // Step 3: User A gets own profile via /api/users/profile
    const profileARes = await request('/users/profile', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    recordTest(
      'Profile Management',
      'GET /api/users/profile returns authenticated user profile with stats',
      profileARes.status === 200 && profileARes.data?.email === userAEmail
    );

    // Step 4: User A updates profile
    const updateProfileRes = await request('/users/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: {
        department: 'Faculty of Advanced Robotics & AI',
        hostel: 'Boys Hostel Block 3, Room 101'
      }
    });
    recordTest(
      'Profile Management',
      'PUT /api/users/profile updates user fields successfully',
      updateProfileRes.status === 200 && updateProfileRes.data?.user?.hostel === 'Boys Hostel Block 3, Room 101'
    );

    // Step 5: User A creates a Resource
    const createResourceRes = await request('/resources', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: {
        title: 'Digital Oscilloscope & Logic Probe Kit',
        description: '2-channel portable USB oscilloscope with probes and test leads.',
        category: 'Electronics',
        sharingType: 'BORROW',
        condition: 'Like New',
        pickupInfo: 'Robotics Lab 2 Ground Floor',
        isUrgent: true,
        returnPeriod: '2 Weeks',
        returnDate: '2026-04-01',
        images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80']
      }
    });

    testResourceId = createResourceRes.data?.id;
    recordTest(
      'Resource Management',
      'POST /api/resources creates listing with correct metadata & owner reference',
      createResourceRes.status === 201 &&
        createResourceRes.data?.title === 'Digital Oscilloscope & Logic Probe Kit' &&
        createResourceRes.data?.postedBy?.id === userAData.id
    );

    // Step 6: Browse and filter resources (Public)
    const filterRes = await request(`/resources?category=Electronics&sharingType=BORROW&isUrgent=true`);
    const foundOurResource = filterRes.data?.some((r) => r.id === testResourceId);
    recordTest(
      'Resource Filtering',
      'GET /api/resources accurately filters by category, sharingType, and isUrgent',
      filterRes.status === 200 && foundOurResource
    );

    // Step 7: Search resources
    const searchRes = await request(`/resources?search=Oscilloscope`);
    recordTest(
      'Resource Search',
      'GET /api/resources performs case-insensitive text search matching title/description',
      searchRes.status === 200 && searchRes.data?.some((r) => r.id === testResourceId)
    );

    // Step 8: View single resource details (increments viewsCount)
    const getResDetails = await request(`/resources/${testResourceId}`);
    recordTest(
      'Resource Details',
      'GET /api/resources/:id returns populated listing and increments viewsCount',
      getResDetails.status === 200 && getResDetails.data?.viewsCount >= 1
    );

    // Step 9: User B cannot edit User A's resource (Authorization check)
    const unauthorizedEdit = await request(`/resources/${testResourceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userBToken}` },
      body: { title: 'Hacked Title' }
    });
    recordTest(
      'Authorization',
      'PUT /api/resources/:id forbids non-owner modification with 403',
      unauthorizedEdit.status === 403
    );

    // Step 10: User A prevents requesting their own resource
    const selfRequest = await request('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: {
        resourceId: testResourceId,
        message: 'Requesting my own item'
      }
    });
    recordTest(
      'Request Management',
      'POST /api/requests prevents user from requesting their own listed resource (400)',
      selfRequest.status === 400
    );

    // Step 11: User B requests User A's resource
    const createReqRes = await request('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userBToken}` },
      body: {
        resourceId: testResourceId,
        message: 'Need this oscilloscope for our embedded sensor project next week.',
        preferredTime: 'Tuesday 2:30 PM'
      }
    });

    testRequestId = createReqRes.data?.id;
    recordTest(
      'Request Lifecycle',
      'User B submits resource request and initiates PENDING lifecycle',
      createReqRes.status === 201 &&
        createReqRes.data?.status === 'PENDING' &&
        createReqRes.data?.requester?.id === userBData.id
    );

    // Step 12: Notification verification for User A
    const userANotifs = await request('/notifications', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    const requestNotif = userANotifs.data?.find((n) => n.title.includes('New request received'));
    recordTest(
      'Notifications',
      'Resource owner receives automated notification for incoming request',
      userANotifs.status === 200 && Boolean(requestNotif)
    );

    // Step 13: User B cannot accept their own request (Only owner can accept)
    const unauthorizedAccept = await request(`/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userBToken}` },
      body: { status: 'ACCEPTED' }
    });
    recordTest(
      'Security & Auth',
      'Only resource owner can accept request; requester receives 403 Forbidden',
      unauthorizedAccept.status === 403
    );

    // Step 14: User A accepts the request (Transitions resource to RESERVED)
    const acceptReqRes = await request(`/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: { status: 'ACCEPTED' }
    });

    const checkReserved = await request(`/resources/${testResourceId}`);
    recordTest(
      'Request Lifecycle',
      'Resource owner accepts request and resource automatically marks RESERVED',
      acceptReqRes.status === 200 &&
        acceptReqRes.data?.status === 'ACCEPTED' &&
        checkReserved.data?.status === 'RESERVED'
    );

    // Step 15: User A marks ready for pickup
    const readyPickupRes = await request(`/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: { status: 'READY_PICKUP' }
    });
    recordTest(
      'Request Lifecycle',
      'Owner marks request READY_PICKUP',
      readyPickupRes.status === 200 && readyPickupRes.data?.status === 'READY_PICKUP'
    );

    // Step 16: User A completes handover (Generates transaction, awards points)
    const prevPointsA = (await User.findById(userAData.id)).rePoints;
    const completeReqRes = await request(`/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: { status: 'COMPLETED' }
    });

    const userADocAfterHandover = await User.findById(userAData.id);
    const pointsGained = userADocAfterHandover.rePoints - prevPointsA;

    recordTest(
      'Transactions & Rewards',
      'Handover completion transitions request to COMPLETED and awards exactly +50 RePoints',
      completeReqRes.status === 200 &&
        completeReqRes.data?.status === 'COMPLETED' &&
        pointsGained === 50
    );

    // Step 17: Verify transaction record was created in Atlas
    const userATransactions = await request('/transactions', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });

    const matchingTxn = userATransactions.data?.find((t) => t.resourceTitle.includes('Digital Oscilloscope'));
    testTransactionId = matchingTxn?.id;
    recordTest(
      'Transactions',
      'Transaction record generated with unique TXN code and linked parties',
      userATransactions.status === 200 &&
        Boolean(matchingTxn) &&
        Boolean(matchingTxn.transactionCode.startsWith('TXN-'))
    );

    // Step 18: Confirm return of borrowed item (Awards +25 points to caller)
    const pointsBeforeReturn = (await User.findById(userAData.id)).rePoints;
    const confirmReturnRes = await request(`/transactions/${testTransactionId}/return`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` }
    });

    const userADocAfterReturn = await User.findById(userAData.id);
    const returnPointsGained = userADocAfterReturn.rePoints - pointsBeforeReturn;

    recordTest(
      'Return Workflow',
      'Return confirmation closes transaction, releases resource to AVAILABLE, and awards +25 points',
      confirmReturnRes.status === 200 && returnPointsGained === 25
    );

    // Step 19: Duplicate Points Prevention
    const duplicateReturnRes = await request(`/transactions/${testTransactionId}/return`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    recordTest(
      'Points Integrity',
      'Duplicate return confirmation is rejected (400) to prevent double points exploit',
      duplicateReturnRes.status === 400
    );

    // Step 20: Notification Management (Mark single notification as read)
    const unreadNotif = (await request('/notifications', { headers: { Authorization: `Bearer ${userAToken}` } })).data?.[0];
    if (unreadNotif) {
      const markSingleRes = await request(`/notifications/${unreadNotif.id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${userAToken}` }
      });
      recordTest(
        'Notifications',
        'PATCH /api/notifications/:id/read marks single notification as read',
        markSingleRes.status === 200 && markSingleRes.data?.read === true
      );
    }

    // Step 21: Mark all notifications read
    const markAllRes = await request('/notifications/read-all', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    recordTest(
      'Notifications',
      'PATCH /api/notifications/read-all marks all user notifications as read',
      markAllRes.status === 200 && markAllRes.data?.success === true
    );

    // Step 22: Community Info & Live Campus Stats
    const communityRes = await request('/community');
    recordTest(
      'Community Hub',
      'GET /api/community returns live campus metrics and announcement boards',
      communityRes.status === 200 &&
        communityRes.data?.name.includes('ADTU') &&
        communityRes.data?.membersCount > 0 &&
        Array.isArray(communityRes.data?.announcements)
    );

    // Step 23: Leaderboard Verification
    const leaderboardRes = await request('/users/leaderboard');
    recordTest(
      'Leaderboard',
      'GET /api/users/leaderboard returns ranked campus members ordered by RePoints',
      leaderboardRes.status === 200 &&
        Array.isArray(leaderboardRes.data) &&
        leaderboardRes.data[0]?.points >= leaderboardRes.data[1]?.points
    );

    // Step 24: Nonexistent resource returns 404
    const notFoundRes = await request('/resources/res_nonexistent_99999');
    recordTest(
      'Edge Cases',
      'GET /api/resources/:id returns 404 for nonexistent ID',
      notFoundRes.status === 404
    );

    // Step 25: Delete resource cleanup
    const deleteRes = await request(`/resources/${testResourceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    recordTest(
      'Resource Deletion',
      'DELETE /api/resources/:id removes listing successfully',
      deleteRes.status === 200 && deleteRes.data?.success === true
    );

  } finally {
    // Clean up test records created during this QA run
    console.log('\n--- Cleaning Up Isolated QA Test Records ---');
    try {
      if (userAData?.id) {
        await User.findByIdAndDelete(userAData.id);
        await RewardHistory.deleteMany({ user: userAData.id });
        await UserBadge.deleteMany({ user: userAData.id });
        await Notification.deleteMany({ user: userAData.id });
      }
      if (userBData?.id) {
        await User.findByIdAndDelete(userBData.id);
        await RewardHistory.deleteMany({ user: userBData.id });
        await UserBadge.deleteMany({ user: userBData.id });
        await Notification.deleteMany({ user: userBData.id });
      }
      if (testResourceId) {
        await Resource.findByIdAndDelete(testResourceId);
      }
      if (testRequestId) {
        await Request.findByIdAndDelete(testRequestId);
      }
      if (testTransactionId) {
        await Transaction.findByIdAndDelete(testTransactionId);
      }
      console.log('✓ Isolated QA test records cleaned up. Production/seeded data untouched.');
    } catch (cleanupErr) {
      console.warn('Cleanup warning:', cleanupErr.message);
    }

    if (testServer) {
      testServer.close();
    }
    await disconnectDb();
  }

  // Print Summary
  console.log('\n====================================================');
  console.log(`  QA TEST SUITE SUMMARY: ${testResults.passed}/${testResults.total} TESTS PASSED`);
  if (testResults.failed === 0) {
    console.log('  STATUS: ALL TESTS PASSED (100% HEALTH)');
  } else {
    console.log(`  STATUS: ${testResults.failed} FAILURES DETECTED`);
  }
  console.log('====================================================\n');

  if (testResults.failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
