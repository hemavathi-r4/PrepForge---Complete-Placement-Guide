/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Auth Service  (src/services/api.js)
 * ─────────────────────────────────────────────────────────────
 * This module is intentionally designed to mirror a real REST
 * API contract.  Every method:
 *   • Accepts a single request-object  (mirrors fetch body)
 *   • Returns a response envelope      { success, data, error }
 *   • Uses simulated network latency   (drop-in for real fetch)
 *
 * MIGRATION GUIDE — switching to a real backend later:
 *   Replace the localStorage logic inside each function with:
 *     const res = await fetch('/api/auth/<endpoint>', { ... });
 *     const json = await res.json();
 *     return json;          ← same envelope shape, zero UI changes
 * ─────────────────────────────────────────────────────────────
 */

// ── Storage keys ─────────────────────────────────────────────
const KEYS = {
  USERS:        "prepforge_users",
  SESSION_LS:   "prepforge_session",   // localStorage  (remember me)
  SESSION_SS:   "prepforge_session",   // sessionStorage (tab-only)
};

// ── Simulated network delay ───────────────────────────────────
const simulateRequest = (ms = 700) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Response envelope helpers ─────────────────────────────────
const ok    = (data)    => ({ success: true,  data,  error: null });
const fail  = (message) => ({ success: false, data:  null, error: message });

// ── Internal helpers ──────────────────────────────────────────
const getUsers = () =>
  JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");

const saveUsers = (users) =>
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

/** Strip sensitive fields before storing in session */
const sanitizeUser = (user) => ({
  id:        user.id,
  name:      user.name,
  email:     user.email,
  role:      user.role || "student",
  joinedAt:  user.joinedAt,
});

/** Persist the current session (localStorage or sessionStorage) */
const persistSession = (user, rememberMe = false) => {
  const payload = JSON.stringify(sanitizeUser(user));
  if (rememberMe) {
    localStorage.setItem(KEYS.SESSION_LS, payload);
    sessionStorage.removeItem(KEYS.SESSION_SS);
  } else {
    sessionStorage.setItem(KEYS.SESSION_SS, payload);
    localStorage.removeItem(KEYS.SESSION_LS);
  }
};

/** Read from either storage (localStorage first, then sessionStorage) */
const readSession = () => {
  const ls = localStorage.getItem(KEYS.SESSION_LS);
  if (ls) return JSON.parse(ls);
  const ss = sessionStorage.getItem(KEYS.SESSION_SS);
  if (ss) return JSON.parse(ss);
  return null;
};

/** Clear all session data from both storages */
const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION_LS);
  sessionStorage.removeItem(KEYS.SESSION_SS);
};


// ═════════════════════════════════════════════════════════════
// AUTH SERVICE — Public API
// ═════════════════════════════════════════════════════════════
export const authService = {

  /**
   * POST /api/auth/signup
   * @param {{ name: string, email: string, password: string }} requestBody
   * @returns {Promise<{ success: boolean, data: User|null, error: string|null }>}
   */
  async signup({ name, email, password }) {
    await simulateRequest(900);

    // Validation (mirrors server-side 400 responses)
    if (!name?.trim())     return fail("Full name is required.");
    if (!email?.trim())    return fail("Email address is required.");
    if (!password)         return fail("Password is required.");
    if (password.length < 6)
      return fail("Password must be at least 6 characters.");

    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return fail("An account with this email already exists.");

    const newUser = {
      id:       `usr_${Date.now()}`,
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password, // In production: server hashes this — never stored plain
      role:     "student",
      joinedAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    // New signups always get a session-storage session (no rememberMe yet)
    persistSession(newUser, false);

    return ok(sanitizeUser(newUser));
  },

  /**
   * POST /api/auth/login
   * @param {{ email: string, password: string, rememberMe?: boolean }} requestBody
   * @returns {Promise<{ success: boolean, data: User|null, error: string|null }>}
   */
  async login({ email, password, rememberMe = false }) {
    await simulateRequest(800);

    if (!email?.trim())  return fail("Email address is required.");
    if (!password)       return fail("Password is required.");

    const users  = getUsers();
    const user   = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user || user.password !== password)
      return fail("Invalid email or password.");

    persistSession(user, rememberMe);
    return ok(sanitizeUser(user));
  },

  /**
   * POST /api/auth/logout
   * @returns {Promise<{ success: boolean, data: null, error: null }>}
   */
  async logout() {
    await simulateRequest(300);
    clearSession();
    return ok(null);
  },

  /**
   * GET /api/auth/me  — restore session on app load
   * @returns {Promise<{ success: boolean, data: User|null, error: null }>}
   */
  async getSession() {
    await simulateRequest(100);
    const user = readSession();
    return ok(user); // data is null when no session — NOT an error
  },

  /**
   * POST /api/auth/forgot-password
   * @param {{ email: string }} requestBody
   * @returns {Promise<{ success: boolean, data: { message: string }|null, error: string|null }>}
   */
  async forgotPassword({ email }) {
    await simulateRequest(700);

    if (!email?.trim()) return fail("Email address is required.");

    const users = getUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    // Security: always return success (don't leak account existence)
    return ok({
      message: exists
        ? `A password reset link has been sent to ${email}.`
        : `If an account exists for ${email}, a reset link will be sent.`,
    });
  },
};
