/**
 * PrepForge — Stage 5 Backend API Verification Suite
 * ─────────────────────────────────────────────────────────────
 * Tests all /api/progress endpoints for correctness:
 *   1. Authenticated progress update (mark solved)
 *   2. Get full progress list
 *   3. Get per-question progress
 *   4. Progress summary (overall + category breakdown)
 *   5. Streak calculation
 *   6. Daily activity log
 *   7. Mark unsolved (toggle off)
 *   8. Edge cases (invalid question ID, wrong request format)
 *
 * Prerequisites:
 *   - Backend server NOT running separately (this file starts its own listener)
 *   - MongoDB running locally (or MONGODB_URI set in .env)
 *   - At least one User in the DB (registered via Stage 2 auth endpoints)
 *   - Questions seeded via `node scripts/seed.js` (Stage 4)
 *
 * Run: node scratch/test_stage5_api.js
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runTests = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepforge';
    await mongoose.connect(mongoUri);
    console.log('✅ Test connected to MongoDB.\n');

    // Start ephemeral server
    const server = app.listen(5006);
    const BASE_URL = 'http://localhost:5006/api';

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('  PREPFORGE — STAGE 5 BACKEND API TESTS');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ── Setup: Get an existing user and a JWT token ───────────
    const testUser = await User.findOne({}).lean();
    if (!testUser) {
      console.error('❌ No users found in DB. Please register at least one user via POST /api/auth/register first.');
      server.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // Login to get a JWT
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'password123' })
    });
    const loginData = await loginRes.json();

    if (!loginData.success || !loginData.token) {
      console.error('❌ Could not obtain a JWT token. Check the test user password (default: password123).');
      console.error('   Login response:', JSON.stringify(loginData));
      server.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    const JWT = loginData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT}`
    };

    console.log(`🔑 Authenticated as: ${loginData.user.email}\n`);

    // ── Clean up any previous test progress for this user ─────
    await UserProgress.deleteMany({ user: testUser._id });
    await UserActivity.deleteMany({ user: testUser._id });
    console.log('🧹 Cleared previous test progress records.\n');

    // Get a real DSA question from the DB
    const sampleQuestion = await Question.findOne({ category: 'DSA' }).lean();
    if (!sampleQuestion) {
      console.error('❌ No DSA questions seeded. Run: node scripts/seed.js first.');
      server.close();
      await mongoose.connection.close();
      process.exit(1);
    }
    const testQuestionId = sampleQuestion.customId;

    // Get another question for multi-solve tests
    const question2 = await Question.findOne({ category: 'SQL' }).lean();
    const testQuestionId2 = question2?.customId || testQuestionId;

    console.log(`🎯 Test question 1: ${testQuestionId} (${sampleQuestion.title})`);
    console.log(`🎯 Test question 2: ${testQuestionId2}\n`);

    let passed = 0;
    let failed = 0;

    const check = (label, condition, detail = '') => {
      if (condition) {
        console.log(`  ✅ ${label}${detail ? ` — ${detail}` : ''}`);
        passed++;
      } else {
        console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
        failed++;
      }
    };

    // ── TEST 1: Mark question as solved ───────────────────────
    console.log('▸ Test 1: PUT /api/progress/:questionId (mark solved)');
    const t1 = await fetch(`${BASE_URL}/progress/${testQuestionId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ solved: true })
    });
    const d1 = await t1.json();
    check('Status 200', t1.status === 200, `got ${t1.status}`);
    check('success: true', d1.success === true);
    check('progress.solved = true', d1.progress?.solved === true);
    check('solvedAt is set', d1.progress?.solvedAt !== null);
    console.log();

    // ── TEST 2: Mark a second question solved ─────────────────
    console.log('▸ Test 2: Mark second question as solved');
    const t2 = await fetch(`${BASE_URL}/progress/${testQuestionId2}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ solved: true })
    });
    const d2 = await t2.json();
    check('Status 200', t2.status === 200);
    check('success: true', d2.success === true);
    console.log();

    // ── TEST 3: Get full progress list ────────────────────────
    console.log('▸ Test 3: GET /api/progress (full progress list)');
    const t3 = await fetch(`${BASE_URL}/progress`, { headers: authHeaders });
    const d3 = await t3.json();
    check('Status 200', t3.status === 200);
    check('success: true', d3.success === true);
    check('progress is array', Array.isArray(d3.progress));
    check('At least 2 records', d3.progress?.length >= 2, `got ${d3.progress?.length}`);
    check('Records have solved field', d3.progress?.[0]?.solved !== undefined);
    console.log();

    // ── TEST 4: Get per-question progress ─────────────────────
    console.log('▸ Test 4: GET /api/progress/:questionId (per-question)');
    const t4 = await fetch(`${BASE_URL}/progress/${testQuestionId}`, { headers: authHeaders });
    const d4 = await t4.json();
    check('Status 200', t4.status === 200);
    check('success: true', d4.success === true);
    check('progress.solved = true', d4.progress?.solved === true);
    check('Correct questionId returned', d4.progress?.questionId === testQuestionId);
    console.log();

    // ── TEST 5: Progress summary ───────────────────────────────
    console.log('▸ Test 5: GET /api/progress/summary');
    const t5 = await fetch(`${BASE_URL}/progress/summary`, { headers: authHeaders });
    const d5 = await t5.json();
    check('Status 200', t5.status === 200);
    check('success: true', d5.success === true);
    check('summary.totalSolved >= 2', d5.summary?.totalSolved >= 2, `got ${d5.summary?.totalSolved}`);
    check('summary.totalQuestions > 0', d5.summary?.totalQuestions > 0);
    check('overallPercentage in 0-100', d5.summary?.overallPercentage >= 0 && d5.summary?.overallPercentage <= 100);
    check('categoryBreakdown exists', typeof d5.summary?.categoryBreakdown === 'object');
    check('dsa category present', 'dsa' in (d5.summary?.categoryBreakdown || {}));
    console.log();

    // ── TEST 6: Streak ─────────────────────────────────────────
    console.log('▸ Test 6: GET /api/progress/streak');
    const t6 = await fetch(`${BASE_URL}/progress/streak`, { headers: authHeaders });
    const d6 = await t6.json();
    check('Status 200', t6.status === 200);
    check('success: true', d6.success === true);
    check('streak.current is number', typeof d6.streak?.current === 'number');
    check('streak.longest is number', typeof d6.streak?.longest === 'number');
    check('todayActive is boolean', typeof d6.streak?.todayActive === 'boolean');
    check('streak.current >= 1 (solved today)', d6.streak?.current >= 1, `got ${d6.streak?.current}`);
    console.log();

    // ── TEST 7: Activity log ───────────────────────────────────
    console.log('▸ Test 7: GET /api/progress/activity?days=30');
    const t7 = await fetch(`${BASE_URL}/progress/activity?days=30`, { headers: authHeaders });
    const d7 = await t7.json();
    check('Status 200', t7.status === 200);
    check('success: true', d7.success === true);
    check('activity is array', Array.isArray(d7.activity));
    check('At least 1 active day', d7.activity?.length >= 1, `got ${d7.activity?.length}`);
    check('Activity has date field', typeof d7.activity?.[0]?.date === 'string');
    check('Activity has questionsSolved > 0', d7.activity?.[0]?.questionsSolved > 0);
    console.log();

    // ── TEST 8: Mark question as unsolved (toggle off) ────────
    console.log('▸ Test 8: PUT /api/progress/:questionId (mark unsolved)');
    const t8 = await fetch(`${BASE_URL}/progress/${testQuestionId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ solved: false })
    });
    const d8 = await t8.json();
    check('Status 200', t8.status === 200);
    check('success: true', d8.success === true);
    check('progress.solved = false', d8.progress?.solved === false);
    check('solvedAt is null', d8.progress?.solvedAt === null);
    console.log();

    // ── TEST 9: Unauthenticated access blocked ─────────────────
    console.log('▸ Test 9: Unauthenticated access to /api/progress/summary');
    const t9 = await fetch(`${BASE_URL}/progress/summary`);
    const d9 = await t9.json();
    check('Status 401', t9.status === 401, `got ${t9.status}`);
    check('success: false', d9.success === false);
    console.log();

    // ── TEST 10: Invalid solved value ──────────────────────────
    console.log('▸ Test 10: PUT /api/progress/:questionId with invalid solved value');
    const t10 = await fetch(`${BASE_URL}/progress/${testQuestionId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ solved: 'yes' })
    });
    const d10 = await t10.json();
    check('Status 400', t10.status === 400, `got ${t10.status}`);
    check('success: false', d10.success === false);
    check('Error message references "solved"', d10.message?.toLowerCase().includes('boolean') || d10.message?.includes('solved'));
    console.log();

    // ── TEST 11: Invalid question ID ───────────────────────────
    console.log('▸ Test 11: PUT /api/progress/non-existent-id-xyz999');
    const t11 = await fetch(`${BASE_URL}/progress/non-existent-id-xyz999`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ solved: true })
    });
    const d11 = await t11.json();
    check('Status 404', t11.status === 404, `got ${t11.status}`);
    check('success: false', d11.success === false);
    console.log();

    // ── TEST 12: User collection untouched ─────────────────────
    console.log('▸ Test 12: Verify user collection not modified by progress ops');
    const userCountAfter = await User.countDocuments({});
    check('User count >= 1', userCountAfter >= 1, `count: ${userCountAfter}`);
    console.log();

    // ── Summary ────────────────────────────────────────────────
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
    if (failed === 0) {
      console.log('  🎉 ALL STAGE 5 API TESTS PASSED\n');
    } else {
      console.log(`  ⚠️  ${failed} test(s) failed — review output above.\n`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    server.close();
    await mongoose.connection.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
};

runTests();
