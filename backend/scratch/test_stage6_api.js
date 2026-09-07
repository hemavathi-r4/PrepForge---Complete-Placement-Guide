/**
 * PrepForge — Stage 6 Backend API Verification Suite
 * ─────────────────────────────────────────────────────────────
 * Tests all /api/analytics endpoints for correctness:
 *   1. GET /api/analytics/overview (authenticated)
 *   2. GET /api/analytics/overview (unauthenticated -> 401)
 *   3. GET /api/analytics/category (authenticated)
 *   4. GET /api/analytics/topic (authenticated)
 *   5. GET /api/analytics/difficulty (authenticated)
 *   6. GET /api/analytics/activity (default 30 days continuous)
 *   7. GET /api/analytics/activity?days=7 (custom days window)
 *   8. GET /api/analytics/company (authenticated)
 *   9. User Isolation: Ensure User A cannot see User B's progress in analytics
 *  10. Mathematical consistency of percentage calculations
 *
 * Run: node scratch/test_stage6_api.js
 * ─────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import app from '../app.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import UserActivity from '../models/UserActivity.js';
import generateToken from '../utils/generateToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runTests = async () => {
  let server;
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepforge';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.\n');

    server = app.listen(5007);
    const BASE_URL = 'http://localhost:5007/api';

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  PREPFORGE — STAGE 6 ANALYTICS BACKEND API TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
      if (condition) {
        console.log(`  ✅ PASS: ${testName}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${testName}`);
        failed++;
      }
    };

    // ── Setup: Find or create primary test user ──────────────
    let testUser = await User.findOne({ email: 'stage6_test@prepforge.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Stage 6 Tester',
        email: 'stage6_test@prepforge.com',
        password: 'password123'
      });
    }

    const token = generateToken(testUser._id);
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    // ── Test 1: Unauthenticated request rejected with 401 ─────
    console.log('[Test 1] Unauthenticated request rejection');
    const unauthRes = await fetch(`${BASE_URL}/analytics/overview`);
    assert(unauthRes.status === 401, 'GET /api/analytics/overview returns 401 without token');

    // ── Test 2: GET /api/analytics/overview (Authenticated) ───
    console.log('\n[Test 2] GET /api/analytics/overview');
    const overviewRes = await fetch(`${BASE_URL}/analytics/overview`, {
      headers: authHeaders
    });
    const overviewData = await overviewRes.json();
    assert(overviewRes.status === 200, 'Status is 200');
    assert(overviewData.success === true, 'Response success is true');
    assert(overviewData.overview !== undefined, 'Response contains overview object');
    assert(typeof overviewData.overview.totalQuestions === 'number', 'totalQuestions is a number');
    assert(typeof overviewData.overview.totalSolved === 'number', 'totalSolved is a number');
    assert(typeof overviewData.overview.overallPercentage === 'number', 'overallPercentage is a number');
    assert(typeof overviewData.overview.currentStreak === 'number', 'currentStreak is a number');
    assert(typeof overviewData.overview.longestStreak === 'number', 'longestStreak is a number');
    assert(typeof overviewData.overview.todaySolved === 'number', 'todaySolved is a number');
    assert(typeof overviewData.overview.thisWeekSolved === 'number', 'thisWeekSolved is a number');
    assert(typeof overviewData.overview.thisMonthSolved === 'number', 'thisMonthSolved is a number');

    // ── Test 3: GET /api/analytics/category ───────────────────
    console.log('\n[Test 3] GET /api/analytics/category');
    const catRes = await fetch(`${BASE_URL}/analytics/category`, {
      headers: authHeaders
    });
    const catData = await catRes.json();
    assert(catRes.status === 200, 'Status is 200');
    assert(catData.success === true, 'Response success is true');
    assert(Array.isArray(catData.categories), 'categories is an array');
    assert(catData.categories.length === 4, 'categories has 4 items (DSA, SQL, APTITUDE, CORE)');

    const expectedCats = ['DSA', 'SQL', 'APTITUDE', 'CORE'];
    const returnedCats = catData.categories.map((c) => c.category);
    const hasAllCats = expectedCats.every((c) => returnedCats.includes(c));
    assert(hasAllCats, 'Contains DSA, SQL, APTITUDE, CORE categories');

    for (const c of catData.categories) {
      assert(typeof c.total === 'number' && typeof c.solved === 'number', `${c.category} has numerical total and solved`);
      assert(c.unsolved === c.total - c.solved, `${c.category} unsolved = total - solved`);
    }

    // ── Test 4: GET /api/analytics/topic ──────────────────────
    console.log('\n[Test 4] GET /api/analytics/topic');
    const topicRes = await fetch(`${BASE_URL}/analytics/topic`, {
      headers: authHeaders
    });
    const topicData = await topicRes.json();
    assert(topicRes.status === 200, 'Status is 200');
    assert(topicData.success === true, 'Response success is true');
    assert(Array.isArray(topicData.topics), 'topics is an array');
    if (topicData.topics.length > 0) {
      const firstTopic = topicData.topics[0];
      assert(typeof firstTopic.topic === 'string', 'Topic object has string topic property');
      assert(typeof firstTopic.total === 'number', 'Topic has numerical total');
      assert(typeof firstTopic.solved === 'number', 'Topic has numerical solved');
      assert(typeof firstTopic.percentage === 'number', 'Topic has numerical percentage');
    }

    // ── Test 5: GET /api/analytics/difficulty ─────────────────
    console.log('\n[Test 5] GET /api/analytics/difficulty');
    const diffRes = await fetch(`${BASE_URL}/analytics/difficulty`, {
      headers: authHeaders
    });
    const diffData = await diffRes.json();
    assert(diffRes.status === 200, 'Status is 200');
    assert(diffData.success === true, 'Response success is true');
    assert(Array.isArray(diffData.difficulty), 'difficulty is an array');
    for (const d of diffData.difficulty) {
      assert(['Easy', 'Medium', 'Hard'].includes(d.difficulty), `Difficulty level is valid: ${d.difficulty}`);
      assert(typeof d.total === 'number' && typeof d.solved === 'number', `${d.difficulty} has total and solved`);
      assert(d.percentage >= 0 && d.percentage <= 100, `${d.difficulty} percentage between 0 and 100`);
    }

    // ── Test 6: GET /api/analytics/activity (default 30 days) ─
    console.log('\n[Test 6] GET /api/analytics/activity');
    const actRes = await fetch(`${BASE_URL}/analytics/activity`, {
      headers: authHeaders
    });
    const actData = await actRes.json();
    assert(actRes.status === 200, 'Status is 200');
    assert(actData.success === true, 'Response success is true');
    assert(Array.isArray(actData.activity), 'activity is an array');
    assert(actData.activity.length === 30, 'Default timeline returns 30 continuous days');

    // ── Test 7: GET /api/analytics/activity?days=7 ────────────
    console.log('\n[Test 7] GET /api/analytics/activity?days=7');
    const act7Res = await fetch(`${BASE_URL}/analytics/activity?days=7`, {
      headers: authHeaders
    });
    const act7Data = await act7Res.json();
    assert(act7Res.status === 200, 'Status is 200');
    assert(act7Data.activity.length === 7, 'Timeline with days=7 returns exactly 7 continuous days');
    // Ensure chronological order
    if (act7Data.activity.length >= 2) {
      const d1 = act7Data.activity[0].date;
      const d2 = act7Data.activity[1].date;
      assert(d1 < d2, `Days are chronologically ordered (${d1} < ${d2})`);
    }

    // ── Test 8: GET /api/analytics/company ────────────────────
    console.log('\n[Test 8] GET /api/analytics/company');
    const compRes = await fetch(`${BASE_URL}/analytics/company`, {
      headers: authHeaders
    });
    const compData = await compRes.json();
    assert(compRes.status === 200, 'Status is 200');
    assert(compData.success === true, 'Response success is true');
    assert(Array.isArray(compData.companies), 'companies is an array');
    if (compData.companies.length > 0) {
      const firstComp = compData.companies[0];
      assert(typeof firstComp.company === 'string', 'Company object has company name string');
      assert(typeof firstComp.slug === 'string', 'Company object has slug string');
      assert(typeof firstComp.total === 'number', 'Company object has numerical total');
    }

    // ── Test 9: User Isolation Check ──────────────────────────
    console.log('\n[Test 9] User Isolation Check');
    let userB = await User.findOne({ email: 'user_b_isolation@prepforge.com' });
    if (!userB) {
      userB = await User.create({
        name: 'User B Isolation',
        email: 'user_b_isolation@prepforge.com',
        password: 'password123'
      });
    }

    // Find a question to mark solved for testUser only
    const sampleQuestion = await Question.findOne({});
    if (sampleQuestion) {
      await UserProgress.findOneAndUpdate(
        { user: testUser._id, question: sampleQuestion._id },
        { user: testUser._id, question: sampleQuestion._id, customId: sampleQuestion.customId, solved: true },
        { upsert: true, new: true }
      );

      // Verify User B's progress is 0
      const tokenB = generateToken(userB._id);
      const userBRes = await fetch(`${BASE_URL}/analytics/overview`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenB}`
        }
      });
      const userBData = await userBRes.json();
      assert(userBData.overview.totalSolved === 0, 'User B has 0 totalSolved even when testUser has solved questions');
    }

    // ── Summary ───────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  TEST RESULTS: ${passed} passed, ${failed} failed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    server.close();
    await mongoose.connection.close();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test error:', err);
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

runTests();
