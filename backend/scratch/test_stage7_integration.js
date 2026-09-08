/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Stage 7 End-to-End MERN Integration & Security Test
 * ─────────────────────────────────────────────────────────────
 * Tests complete API suite, authentication, profile management,
 * question catalog, company sheets, persistent progress tracking,
 * analytics reporting, multi-user isolation, error handling,
 * and security constraints.
 * ─────────────────────────────────────────────────────────────
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import app from '../app.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Company from '../models/Company.js';
import UserProgress from '../models/UserProgress.js';
import UserActivity from '../models/UserActivity.js';
import http from 'http';

const PORT = 5055;
let server;
const BASE_URL = `http://localhost:${PORT}/api`;

let userAToken = '';
let userBToken = '';
let userAId = '';
let userBId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n==================================================');
  console.log('🚀 PREPFORGE STAGE 7 E2E INTEGRATION & AUDIT SUITE');
  console.log('==================================================\n');

  await connectDB();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[Test Server] Listening on port ${PORT}\n`);

  // Clean up any test users from previous runs
  const testEmails = ['test_user_a_b7@example.com', 'test_user_b_b7@example.com'];
  const oldUsers = await User.find({ email: { $in: testEmails } });
  const oldUserIds = oldUsers.map((u) => u._id);
  if (oldUserIds.length > 0) {
    await User.deleteMany({ _id: { $in: oldUserIds } });
    await UserProgress.deleteMany({ user: { $in: oldUserIds } });
    await UserActivity.deleteMany({ user: { $in: oldUserIds } });
  }

  try {
    // ── 1. Health Check Endpoint ───────────────────────────────
    console.log('── 1. Health Check API ──');
    const healthRes = await request('/health');
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
    assert(healthRes.data?.success === true, 'Health check returns success: true');
    assert(healthRes.data?.message === 'PrepForge API is running', 'Health check message is correct');

    // ── 2. User A Registration & Authentication ───────────────
    console.log('\n── 2. User A Registration & Auth Flow ──');
    const regUserA = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'User A Candidate',
        email: 'test_user_a_b7@example.com',
        password: 'Password123!'
      })
    });
    assert(regUserA.status === 201, 'POST /api/auth/register User A returns HTTP 201');
    assert(!!regUserA.data?.token, 'Registration returns JWT token');
    assert(regUserA.data?.user?.email === 'test_user_a_b7@example.com', 'User A email matches');
    assert(!regUserA.data?.user?.password, 'Password hash is NOT exposed in response');
    userAToken = regUserA.data.token;
    userAId = regUserA.data.user.id || regUserA.data.user._id;

    // Duplicate registration validation
    const regDup = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'User A Duplicate',
        email: 'test_user_a_b7@example.com',
        password: 'Password123!'
      })
    });
    assert(regDup.status === 400 || regDup.status === 409, 'Duplicate registration returns 400 or 409');
    assert(regDup.data?.success === false, 'Duplicate registration success is false');

    // Login User A
    const loginUserA = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test_user_a_b7@example.com',
        password: 'Password123!'
      })
    });
    assert(loginUserA.status === 200, 'POST /api/auth/login User A returns HTTP 200');
    assert(!!loginUserA.data?.token, 'Login returns valid token');

    // GET /api/auth/me for User A
    const meUserA = await request('/auth/me', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(meUserA.status === 200, 'GET /api/auth/me User A returns HTTP 200');
    assert(meUserA.data?.user?.name === 'User A Candidate', 'GET /api/auth/me returns User A details');

    // ── 3. User B Registration & Authentication ───────────────
    console.log('\n── 3. User B Registration & Auth Flow ──');
    const regUserB = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'User B Candidate',
        email: 'test_user_b_b7@example.com',
        password: 'Password456!'
      })
    });
    assert(regUserB.status === 201, 'POST /api/auth/register User B returns HTTP 201');
    userBToken = regUserB.data.token;
    userBId = regUserB.data.user.id || regUserB.data.user._id;

    // ── 4. Unauthorized Access & 401 Handling ──────────────────
    console.log('\n── 4. Protected Route & 401 Authorization Checks ──');
    const noTokenRes = await request('/users/profile');
    assert(noTokenRes.status === 401, 'Request without token to /api/users/profile returns HTTP 401');
    assert(noTokenRes.data?.success === false, 'Unauthorized response has success: false');

    const badTokenRes = await request('/users/profile', {
      headers: { Authorization: 'Bearer invalid_fake_token_12345' }
    });
    assert(badTokenRes.status === 401, 'Request with invalid token returns HTTP 401');

    // ── 5. User Profile Management Flow ────────────────────────
    console.log('\n── 5. User Profile Management (GET / PUT /api/users/profile) ──');
    const getProfileA = await request('/users/profile', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(getProfileA.status === 200, 'GET /api/users/profile returns HTTP 200');
    assert(getProfileA.data?.user?.email === 'test_user_a_b7@example.com', 'Profile email matches');

    const updateProfileA = await request('/users/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: JSON.stringify({
        name: 'User A Updated',
        college: 'IIT Madras',
        bio: 'Aspiring Full Stack & Systems Engineer',
        leetcode: 'user_a_leetcode',
        github: 'user_a_github',
        linkedin: 'user-a-linkedin'
      })
    });
    assert(updateProfileA.status === 200, 'PUT /api/users/profile returns HTTP 200');
    assert(updateProfileA.data?.user?.college === 'IIT Madras', 'College updated in MongoDB');
    assert(updateProfileA.data?.user?.leetcode === 'user_a_leetcode', 'LeetCode handle updated in MongoDB');

    // ── 6. Change Password Flow ────────────────────────────────
    console.log('\n── 6. Password Change & Re-Authentication Flow ──');
    const changePass = await request('/users/change-password', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: JSON.stringify({
        currentPassword: 'Password123!',
        newPassword: 'NewSecurePassword789!'
      })
    });
    assert(changePass.status === 200, 'PUT /api/users/change-password returns HTTP 200');

    // Verify old password fails
    const oldPassLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test_user_a_b7@example.com',
        password: 'Password123!'
      })
    });
    assert(oldPassLogin.status === 401, 'Old password fails login with HTTP 401');

    // Verify new password succeeds
    const newPassLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test_user_a_b7@example.com',
        password: 'NewSecurePassword789!'
      })
    });
    assert(newPassLogin.status === 200, 'New password successfully logs in with HTTP 200');
    userAToken = newPassLogin.data.token; // Refresh token

    // ── 7. Question Catalog, Search, Filtering & Pagination ────
    console.log('\n── 7. Question Catalog, Filtering, Search & Pagination ──');
    const allQuestionsRes = await request('/questions');
    assert(allQuestionsRes.status === 200, 'GET /api/questions returns HTTP 200');
    assert(Array.isArray(allQuestionsRes.data?.questions), 'Questions returned as array');
    assert(!!allQuestionsRes.data?.pagination, 'Pagination metadata included');

    const dsaQuestions = await request('/questions?category=DSA&limit=5');
    assert(dsaQuestions.status === 200, 'GET /api/questions?category=DSA returns HTTP 200');
    assert(dsaQuestions.data?.questions.every((q) => q.category === 'DSA'), 'All filtered questions have category DSA');

    const sqlQuestions = await request('/questions?category=SQL');
    assert(sqlQuestions.status === 200, 'GET /api/questions?category=SQL returns HTTP 200');
    assert(sqlQuestions.data?.questions.every((q) => q.category === 'SQL'), 'All filtered questions have category SQL');

    const searchRes = await request('/questions?search=array');
    assert(searchRes.status === 200, 'GET /api/questions?search=array returns HTTP 200');

    // Single Question Fetch by ID / customId
    const firstQ = allQuestionsRes.data.questions[0];
    if (firstQ) {
      const singleQById = await request(`/questions/${firstQ._id}`);
      assert(singleQById.status === 200, `GET /api/questions/:id by ObjectId returns HTTP 200`);
      assert(singleQById.data?.question?.title === firstQ.title, 'Question title matches');

      const singleQByCustom = await request(`/questions/${firstQ.customId}`);
      assert(singleQByCustom.status === 200, `GET /api/questions/:customId returns HTTP 200`);
    }

    // ── 8. Company Catalog & Company Questions ─────────────────
    console.log('\n── 8. Company Catalog & Company Questions ──');
    const companiesRes = await request('/companies');
    assert(companiesRes.status === 200, 'GET /api/companies returns HTTP 200');
    assert(Array.isArray(companiesRes.data?.companies), 'Companies returned as array');

    if (companiesRes.data?.companies?.length > 0) {
      const testComp = companiesRes.data.companies[0];
      const compDetailRes = await request(`/companies/${testComp.slug}`);
      assert(compDetailRes.status === 200, `GET /api/companies/:slug returns HTTP 200`);

      const compQuestionsRes = await request(`/companies/${testComp.slug}/questions`);
      assert(compQuestionsRes.status === 200, `GET /api/companies/:slug/questions returns HTTP 200`);
      assert(Array.isArray(compQuestionsRes.data?.questions), 'Company questions returned as array');
    }

    // ── 9. User A Progress & Streak Tracking Flow ───────────────
    console.log('\n── 9. User A Progress Tracking, Streak & Activity ──');
    const questionsSample = allQuestionsRes.data.questions.slice(0, 3);
    const q1 = questionsSample[0]?.customId || 'dsa-arr-1';
    const q2 = questionsSample[1]?.customId || 'dsa-arr-2';
    const q3 = questionsSample[2]?.customId || 'dsa-arr-3';

    // Solve Question 1 for User A
    const solveQ1 = await request(`/progress/${q1}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: JSON.stringify({ solved: true })
    });
    assert(solveQ1.status === 200, `PUT /api/progress/${q1} solves question for User A`);
    assert(solveQ1.data?.progress?.solved === true, 'Progress state is true');

    // Solve Question 2 for User A
    const solveQ2 = await request(`/progress/${q2}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
      body: JSON.stringify({ solved: true })
    });
    assert(solveQ2.status === 200, `PUT /api/progress/${q2} solves question for User A`);

    // Verify progress list for User A
    const progListA = await request('/progress', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(progListA.status === 200, 'GET /api/progress User A returns HTTP 200');
    const solvedCountA = progListA.data?.progress?.filter((p) => p.solved).length;
    assert(solvedCountA >= 2, `User A has at least 2 solved questions in MongoDB (found ${solvedCountA})`);

    // Verify Summary & Streak for User A
    const summaryA = await request('/progress/summary', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(summaryA.status === 200, 'GET /api/progress/summary User A returns HTTP 200');
    assert(summaryA.data?.summary?.totalSolved >= 2, 'User A summary shows totalSolved >= 2');

    const streakA = await request('/progress/streak', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(streakA.status === 200, 'GET /api/progress/streak User A returns HTTP 200');
    assert(streakA.data?.streak?.current >= 1, 'User A current streak >= 1');
    assert(streakA.data?.streak?.todayActive === true, 'User A todayActive is true');

    // ── 10. User B Progress (Different Questions) ──────────────
    console.log('\n── 10. User B Progress Tracking ──');
    // User B solves question 3 only
    const solveQ3 = await request(`/progress/${q3}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userBToken}` },
      body: JSON.stringify({ solved: true })
    });
    assert(solveQ3.status === 200, `PUT /api/progress/${q3} solves question for User B`);

    const progListB = await request('/progress', {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert(progListB.status === 200, 'GET /api/progress User B returns HTTP 200');
    const solvedCountB = progListB.data?.progress?.filter((p) => p.solved).length;
    assert(solvedCountB === 1, `User B has exactly 1 solved question (found ${solvedCountB})`);

    // ── 11. Strict Multi-User Isolation Audit ──────────────────
    console.log('\n── 11. Security Audit: Multi-User Data Isolation ──');
    // Verify User A does not have q3 solved
    const checkQ3ForUserA = await request(`/progress/${q3}`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(checkQ3ForUserA.data?.progress?.solved === false, "User A cannot see User B's solved state for q3");

    // Verify User B does not have q1 or q2 solved
    const checkQ1ForUserB = await request(`/progress/${q1}`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert(checkQ1ForUserB.data?.progress?.solved === false, "User B cannot see User A's solved state for q1");

    // Verify User A and User B summaries are completely isolated
    const summaryB = await request('/progress/summary', {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert(summaryA.data?.summary?.totalSolved !== summaryB.data?.summary?.totalSolved, 'User A and User B have separate solved totals');
    assert(summaryB.data?.summary?.totalSolved === 1, 'User B totalSolved is 1');

    // Verify User Profiles are isolated
    const profileB = await request('/users/profile', {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert(profileB.data?.user?.email === 'test_user_b_b7@example.com', 'User B profile is isolated');
    assert(profileB.data?.user?.college !== 'IIT Madras', 'User B does not have User A college');

    // ── 12. Analytics Suite Endpoints Audit ────────────────────
    console.log('\n── 12. Analytics Endpoints Suite Audit ──');
    const analyticsOverviewA = await request('/analytics/overview', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsOverviewA.status === 200, 'GET /api/analytics/overview returns HTTP 200');
    assert(analyticsOverviewA.data?.overview?.totalSolved >= 2, 'Overview reflects MongoDB solved count');
    assert(typeof analyticsOverviewA.data?.overview?.overallPercentage === 'number', 'Overall percentage is a valid number');

    const analyticsCategoryA = await request('/analytics/category', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsCategoryA.status === 200, 'GET /api/analytics/category returns HTTP 200');
    assert(analyticsCategoryA.data?.categories?.length === 4, 'Returns all 4 categories (DSA, SQL, APTITUDE, CORE)');

    const analyticsTopicA = await request('/analytics/topic', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsTopicA.status === 200, 'GET /api/analytics/topic returns HTTP 200');
    assert(Array.isArray(analyticsTopicA.data?.topics), 'Topic analytics returned as array');

    const analyticsDiffA = await request('/analytics/difficulty', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsDiffA.status === 200, 'GET /api/analytics/difficulty returns HTTP 200');
    assert(Array.isArray(analyticsDiffA.data?.difficulty), 'Difficulty analytics returned as array');

    const analyticsActivityA = await request('/analytics/activity?days=7', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsActivityA.status === 200, 'GET /api/analytics/activity returns HTTP 200');
    assert(analyticsActivityA.data?.activity?.length === 7, 'Activity timeline has 7 continuous dates');

    const analyticsCompanyA = await request('/analytics/company', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(analyticsCompanyA.status === 200, 'GET /api/analytics/company returns HTTP 200');
    assert(Array.isArray(analyticsCompanyA.data?.companies), 'Company analytics returned as array');

    // ── 13. Invalid Input & Error Format Consistency ───────────
    console.log('\n── 13. Input Validation & Error Formatting ──');
    const invalidObjIdRes = await request('/questions/not-a-valid-id-123456789');
    assert(invalidObjIdRes.status === 404 || invalidObjIdRes.status === 400, 'Invalid question ID handled gracefully');
    assert(invalidObjIdRes.data?.success === false, 'Error response has success: false');

    const invalidRouteRes = await request('/non-existent-endpoint-test');
    assert(invalidRouteRes.status === 404, 'Non-existent route returns HTTP 404');
    assert(invalidRouteRes.data?.success === false, '404 route returns success: false');

    console.log('\n==================================================');
    console.log(`📊 FINAL TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
    console.log('==================================================\n');

    if (failedTests > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal Test Suite Error:', err);
    process.exitCode = 1;
  } finally {
    // Clean up test data
    if (userAId || userBId) {
      await User.deleteMany({ _id: { $in: [userAId, userBId].filter(Boolean) } });
      await UserProgress.deleteMany({ user: { $in: [userAId, userBId].filter(Boolean) } });
      await UserActivity.deleteMany({ user: { $in: [userAId, userBId].filter(Boolean) } });
    }

    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    console.log('[Cleanup] Test server closed and database connection disconnected.');
  }
}

runTests();
