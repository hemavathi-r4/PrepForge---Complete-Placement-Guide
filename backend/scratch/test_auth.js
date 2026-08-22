/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Backend Auth API Test Suite (scratch/test_auth.js)
 * ─────────────────────────────────────────────────────────────
 * Tests real authentication endpoints on http://localhost:5000/api
 *
 * Test Coverage:
 *  1. POST /api/auth/register (New User Registration)
 *  2. POST /api/auth/login    (Valid User Login)
 *  3. GET  /api/auth/me       (Protected Route with valid JWT)
 *  4. POST /api/auth/login    (Invalid Password Login Failure)
 *  5. GET  /api/auth/me       (Unauthorized Request without JWT)
 * ─────────────────────────────────────────────────────────────
 */

const BASE_URL = 'http://localhost:5000/api';

async function runAuthTests() {
  const testUser = {
    name: 'PrepForge Test User',
    email: `test_${Date.now()}@prepforge.com`,
    password: 'password123'
  };

  console.log('==================================================');
  console.log(' PREPFORGE AUTHENTICATION API TEST SUITE');
  console.log('==================================================\n');

  try {
    // ── 1. REGISTER NEW USER ─────────────────────────────────
    console.log('▶ TEST 1: Register New User (POST /api/auth/register)');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();

    console.log(`  HTTP Status: ${regRes.status}`);
    console.log(`  Response:`, JSON.stringify(regData, null, 2));

    if (!regRes.ok || !regData.token) {
      throw new Error('Registration test failed!');
    }
    console.log('  ✔ Registration test passed!\n');

    const authToken = regData.token;

    // ── 2. LOGIN USER ─────────────────────────────────────────
    console.log('▶ TEST 2: Login Existing User (POST /api/auth/login)');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const loginData = await loginRes.json();

    console.log(`  HTTP Status: ${loginRes.status}`);
    console.log(`  Response:`, JSON.stringify(loginData, null, 2));

    if (!loginRes.ok || !loginData.token) {
      throw new Error('Login test failed!');
    }
    console.log('  ✔ Login test passed!\n');

    // ── 3. GET CURRENT USER WITH JWT ──────────────────────────
    console.log('▶ TEST 3: Get Current User with JWT (GET /api/auth/me)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    const meData = await meRes.json();

    console.log(`  HTTP Status: ${meRes.status}`);
    console.log(`  Response:`, JSON.stringify(meData, null, 2));

    if (!meRes.ok || !meData.user) {
      throw new Error('Get current user test failed!');
    }
    console.log('  ✔ Get current user with JWT test passed!\n');

    // ── 4. INVALID LOGIN ATTEMPT ──────────────────────────────
    console.log('▶ TEST 4: Invalid Login - Wrong Password (POST /api/auth/login)');
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrong_password_123'
      })
    });
    const invalidLoginData = await invalidLoginRes.json();

    console.log(`  HTTP Status: ${invalidLoginRes.status} (Expected: 401)`);
    console.log(`  Response:`, JSON.stringify(invalidLoginData, null, 2));

    if (invalidLoginRes.status !== 401 || invalidLoginData.success !== false) {
      throw new Error('Invalid login handling test failed!');
    }
    console.log('  ✔ Invalid login handling test passed!\n');

    // ── 5. UNAUTHORIZED /me REQUEST ────────────────────────────
    console.log('▶ TEST 5: Unauthorized Request without JWT (GET /api/auth/me)');
    const unauthRes = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const unauthData = await unauthRes.json();

    console.log(`  HTTP Status: ${unauthRes.status} (Expected: 401)`);
    console.log(`  Response:`, JSON.stringify(unauthData, null, 2));

    if (unauthRes.status !== 401 || unauthData.success !== false) {
      throw new Error('Unauthorized request test failed!');
    }
    console.log('  ✔ Unauthorized request handling test passed!\n');

    console.log('==================================================');
    console.log(' ALL 5 AUTHENTICATION API TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ Test execution error:', error.message);
  }
}

runAuthTests();
