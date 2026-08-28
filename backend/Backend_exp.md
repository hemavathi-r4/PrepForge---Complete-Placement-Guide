# PrepForge — Backend Stage 1, Stage 2 & Stage 3 Explanation

---

## Backend Stage 1: Backend Foundation Setup

### Overview

Backend Stage 1 establishes a clean, scalable, and production-ready foundation for the **PrepForge** backend application. The backend is created in a separate directory (`/backend`), keeping it strictly isolated from the React frontend.

---

### Tech Stack & Core Libraries (Stage 1)

| Technology | Purpose |
|---|---|
| **Node.js (ES Modules)** | JavaScript runtime configured with `"type": "module"` in `package.json` |
| **Express.js** | Web application framework for routing, middleware, and HTTP response handling |
| **MongoDB & Mongoose** | NoSQL Database and Object Data Modeling (ODM) library for MongoDB connection |
| **dotenv** | Environment variable management loading configuration from `.env` |
| **cors** | Middleware enabling Cross-Origin Resource Sharing for the React frontend |
| **nodemon** | Development tool automatically restarting the server on file changes |

---

### Project Structure & Architectural Layering

```
PrepForge/
├── frontend/                   # React + Vite frontend application
└── backend/
    ├── config/
    │   └── db.js               # Reusable MongoDB Mongoose connection
    ├── controllers/
    │   ├── authController.js   # Registration, Login, and Me controller methods
    │   └── healthController.js # Health check controller method
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification middleware protecting private routes
    │   ├── errorMiddleware.js  # Centralized global error handling middleware
    │   └── notFoundMiddleware.js # 404 route handling middleware
    ├── models/
    │   └── User.js             # Mongoose User model with bcrypt pre-save hook
    ├── routes/
    │   ├── authRoutes.js       # Auth API route definitions (/api/auth)
    │   └── healthRoutes.js     # Health route definitions (/api/health)
    ├── services/
    │   └── authService.js      # Business logic layer for user registration & authentication
    ├── utils/
    │   └── generateToken.js    # Utility helper to generate signed JWT tokens
    ├── .env                    # Secret environment variables (ignored by Git)
    ├── .env.example            # Shared environment variables template
    ├── .gitignore              # Git ignore rules for backend
    ├── app.js                  # Express app setup, CORS, JSON parser, middleware
    ├── server.js               # Entry point: env loading, DB connect & listener
    └── package.json            # Node.js manifest and scripts
```

---

# Backend Stage 2: Real Authentication with JWT

## Overview & Architecture Goals

In Stage 2, PrepForge replaces simulated frontend-only `localStorage` mock authentication with real, production-ready backend authentication powered by **Node.js**, **Express**, **MongoDB**, **Mongoose**, **bcryptjs**, and **JSON Web Tokens (JWT)**.

The existing PrepForge UI (Login, Signup, Navbar, Dashboard, Profile, and Protected Routes) remains **visually identical** and **100% backward compatible**, while now being backed by real server endpoints and database persistence.

---

## Tech Stack Additions (Stage 2)

| Library | Version / Spec | Purpose |
|---|---|---|
| **bcryptjs** | `^3.0.2` | One-way password hashing using Blowfish cipher with configurable salt rounds (factor 10) |
| **jsonwebtoken** | `^9.0.2` | Compact, URL-safe standard (RFC 7519) for transmitting secure user claims as digital tokens |

---

## Architectural Separation of Concerns

Stage 2 strictly adheres to clean multi-layer software architecture:

$$\text{HTTP Request} \longrightarrow \text{Route} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Model / MongoDB}$$

1. **Routes (`routes/authRoutes.js`)**: Defines API URL paths, HTTP methods, and attaches middleware. Contains **zero business logic**.
2. **Controllers (`controllers/authController.js`)**: Handles HTTP request parsing, input validation, calls service layer functions, and sends standard JSON HTTP responses.
3. **Services (`services/authService.js`)**: Encapsulates reusable business logic (email uniqueness checks, password comparisons, user creation, JWT generation).
4. **Models (`models/User.js`)**: Defines Mongoose schema, data types, validation constraints, pre-save hashing hooks, and model methods.
5. **Middleware (`middleware/authMiddleware.js`)**: Intercepts requests to protected routes, verifies JWT headers, and attaches `req.user`.

---

## Component Deep Dive

### 1. User Model & Password Hashing (`models/User.js`)

#### Schema Definition
```javascript
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false }
}, { timestamps: true });
```

#### Key Design Decisions:
- **`lowercase: true` & `trim: true`**: Normalizes email input to avoid duplicate accounts caused by casing differences (e.g. `User@Example.com` vs `user@example.com`).
- **`select: false`**: Excludes the password hash field from all default queries (`find`, `findOne`), preventing accidental exposure in API responses.
- **Pre-save Hook**:
  ```javascript
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  ```
  Automatically hashes plain passwords before persisting into MongoDB whenever the password field is modified.

- **Password Verification Method**:
  ```javascript
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  ```

---

### 2. JWT Generation Utility (`utils/generateToken.js`)

```javascript
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```
- Encodes user ID in payload `{ id }`.
- Signed with server secret key `JWT_SECRET`.
- Configured with expiration time `JWT_EXPIRES_IN=7d`.

---

### 3. Authentication Middleware (`middleware/authMiddleware.js`)

```javascript
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};
```
- Inspects `Authorization` header formatted as `Bearer <token>`.
- Decodes token payload to retrieve `decoded.id`.
- Fetches user from MongoDB (excluding password) and binds to `req.user`.

---

### 4. API Endpoints Specification

#### A. Register New User
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Validation**:
  - `name` required.
  - `email` required & valid format.
  - `password` required & minimum length 6 characters.
  - Email uniqueness check in MongoDB.
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": {
      "id": "66c78b2e1f40d123456789ab",
      "name": "Test User",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### B. User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Process**:
  1. Validate email and password presence.
  2. Query user by normalized email (with `.select('+password')`).
  3. Compare candidate password against stored bcrypt hash using `bcrypt.compare()`.
  4. Generate signed JWT token.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "66c78b2e1f40d123456789ab",
      "name": "Test User",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Security Rule**: On authentication failure (email not found OR invalid password), returns generic 401 Unauthorized response: `"Invalid email or password"`. Does **not** leak whether the email exists.

#### C. Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Protected by `authMiddleware`)
- **Header Required**: `Authorization: Bearer <valid-jwt-token>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "66c78b2e1f40d123456789ab",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
  ```

---

### 5. Frontend Integration & Authentication Flow

#### Frontend Service (`frontend/src/services/authService.js`)
Uses `fetch` API configured with base URL `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.

#### Auth Context (`frontend/src/context/AuthContext.jsx`)
- **Page Reload / Mount Session Restoration**:
  1. Reads stored token from `localStorage.getItem('prepforge_token')`.
  2. If token exists, sends background request to `GET /api/auth/me` with `Bearer <token>` header.
  3. If valid, populates `user` state; if invalid/expired, invokes `logout()` to clear state.
- **Signup / Login**: Calls `authService.register` / `authService.login`, stores JWT token in `localStorage`, updates React context `user` state, and navigates to `/dashboard`.
- **Logout Flow**:
  1. Removes `prepforge_token` and `prepforge_current_user` from `localStorage`.
  2. Resets `user` state to `null`.
  3. Navigates user to `/login`.
  *(Note: Since JWT is stateless, logout requires zero database calls).*

---

## Detailed Interview Preparation & QA Guide

### Q1: Why do we use JWT (JSON Web Tokens) instead of server-side sessions stored in memory or Redis?
**Answer**:
JWTs provide **stateless authentication**.
- With stateful sessions, the server must store session records (in RAM, database, or Redis) and look up session IDs on every HTTP request. This creates scalability bottlenecks when horizontally scaling across multiple server instances.
- With JWTs, all necessary claims (user ID, expiration) are signed by the server's private key (`JWT_SECRET`) and stored on the client. Any backend instance can verify the signature signature cryptographically without needing session storage or DB lookups for session state.

### Q2: What is the purpose of salting in bcrypt before password hashing?
**Answer**:
A **salt** is a random string added to a plaintext password before hashing.
1. **Prevents Rainbow Table Attacks**: Precomputed tables of hashes (rainbow tables) cannot be used to reverse passwords because every user gets a unique salt.
2. **Protects Duplicate Passwords**: If two users choose the password `"password123"`, their stored hashes will be completely different because each has a distinct random salt.

### Q3: Why is `select: false` configured on the password field in the Mongoose User schema?
**Answer**:
`select: false` acts as a defense-in-depth safety mechanism. It ensures that Mongoose queries (such as `User.find()` or `User.findById()`) omit the password hash field by default. This prevents developers from accidentally serializing and returning password hashes in public API JSON responses. When password verification is explicitly required (like in `/login`), we explicitly request `.select('+password')`.

### Q4: Why do we return a generic "Invalid email or password" message on login failure?
**Answer**:
Returning distinct messages like *"Email does not exist"* vs *"Incorrect password"* creates an **account enumeration vulnerability**. Attackers could use this distinction to harvest list of valid registered user emails. A generic error message prevents attackers from discovering registered accounts.

### Q5: Is storing JWT tokens in `localStorage` completely secure? What is the production recommendation?
**Answer**:
In development, storing JWTs in `localStorage` is acceptable for convenience. However, `localStorage` is accessible to JavaScript running on the same domain, making it vulnerable to **Cross-Site Scripting (XSS)** attacks if malicious scripts are injected.

**Production Best Practice**: Store JWTs in **HTTP-only, Secure, SameSite Cookies**:
- `httpOnly`: Prevents client-side JavaScript access via `document.cookie`.
- `Secure`: Ensures cookies are only transmitted over HTTPS connections.
- `SameSite=Strict/Lax`: Protects against Cross-Site Request Forgery (CSRF) attacks.

---

## Verification & Manual Testing Checklist

1. **User Registration**:
   - Call `POST /api/auth/register` with new email.
   - Verify 201 response with user object & JWT token.
   - Verify password in MongoDB is hashed (`$2a$10$...`) and not plaintext.
2. **Duplicate Registration**:
   - Re-submit registration with same email.
   - Expect HTTP 400 Bad Request error response.
3. **User Login**:
   - Call `POST /api/auth/login` with correct credentials -> Expect HTTP 200 with JWT token.
   - Call `POST /api/auth/login` with incorrect password -> Expect HTTP 401 Unauthorized with generic message.
4. **Protected Route Verification**:
   - Call `GET /api/auth/me` with `Authorization: Bearer <valid-token>` -> Expect HTTP 200 with current user payload.
   - Call `GET /api/auth/me` without Authorization header -> Expect HTTP 401 Unauthorized.
5. **Frontend Integration**:
   - Register/login via UI -> Navigates to `/dashboard`.
   - Refresh page -> Session restored automatically via `/api/auth/me`.
   - Click Logout -> Clears stored token and redirects to `/login`.

---

# Backend Stage 3: User Profile & Account Management

## Overview & Goals

Stage 3 expands the PrepForge backend and frontend with a robust, enterprise-grade **User Profile & Account Management** system.

Authenticated users can:
1. **View their full profile**: Access personal details, academic institution, bio, avatar, and competitive programming handles (LeetCode, Codeforces, CodeChef, GeeksforGeeks, GitHub, LinkedIn).
2. **Update profile details**: Modify personal bio, college, avatar, and platform handles with strict field whitelisting (preventing mass-assignment vulnerabilities).
3. **Change passwords securely**: Authenticated password replacement with bcrypt hash verification, ensuring old password validation and strong security guarantees.
4. **View account information**: Inspect identity status, member joined date, and authentication type.

---

## Architectural Separation of Concerns (Stage 3)

Stage 3 continues the clean multi-layered software architecture:

$$\text{HTTP Request} \longrightarrow \text{Route} \longrightarrow \text{Auth Middleware} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Model} \longrightarrow \text{MongoDB}$$

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth endpoints (/api/auth)
│   ├── healthController.js   # Health check (/api/health)
│   └── userController.js     # [STAGE 3] Profile & password endpoints (/api/users)
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token protection
│   ├── errorMiddleware.js    # Global error handler
│   └── notFoundMiddleware.js # 404 handler
├── models/
│   └── User.js               # [STAGE 3] Extended with profile & CP handles
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── healthRoutes.js       # /api/health routes
│   └── userRoutes.js         # [STAGE 3] /api/users routes
├── services/
│   ├── authService.js        # Auth business logic
│   └── userService.js        # [STAGE 3] Profile & password business logic
└── app.js                    # Express app router mounting (/api/users)
```

---

## Component Deep Dive (Stage 3)

### 1. Extended User Model (`models/User.js`)

#### Schema Definition with Profile Fields:
```javascript
const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: [true, 'Name is required'], trim: true },
    email:         { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password:      { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    
    // Stage 3 Profile Fields
    college:       { type: String, default: '', trim: true },
    bio:           { type: String, default: '', trim: true },
    avatar:        { type: String, default: '', trim: true },
    github:        { type: String, default: '', trim: true },
    linkedin:      { type: String, default: '', trim: true },
    leetcode:      { type: String, default: '', trim: true },
    codeforces:    { type: String, default: '', trim: true },
    codechef:      { type: String, default: '', trim: true },
    geeksforgeeks: { type: String, default: '', trim: true }
  },
  {
    timestamps: true
  }
);
```

#### Safe JSON Serialization:
The `toJSON` transform ensures internal fields and password hashes are never exposed:
```javascript
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});
```

---

### 2. Business Logic Layer (`services/userService.js`)

#### Key Service Functions:
1. **`getUserProfile(userId)`**:
   - Queries MongoDB by authenticated user ID (`User.findById(userId)`).
   - Returns structured profile data with default string fallbacks.
2. **`updateUserProfile(userId, updateData)`**:
   - **Mass-Assignment Defense**: Whitelists only approved fields (`name`, `college`, `bio`, `avatar`, `github`, `linkedin`, `leetcode`, `codeforces`, `codechef`, `geeksforgeeks`).
   - Ignores attempts to alter `email`, `password`, `_id`, `createdAt`, or arbitrary fields.
   - Saves document and returns sanitized user object.
3. **`changeUserPassword(userId, { currentPassword, newPassword })`**:
   - Fetches user explicitly with `.select('+password')`.
   - Compares candidate `currentPassword` against stored bcrypt hash via `user.matchPassword(currentPassword)`.
   - If invalid, throws HTTP 400 error: `"Current password is incorrect"`.
   - Sets `user.password = newPassword` and executes `user.save()`.
   - The Mongoose `pre('save')` hook automatically re-hashes the new password with a fresh salt.

---

### 3. Controller Layer (`controllers/userController.js`)

1. **`getProfile(req, res, next)`**: Calls `userService.getUserProfile(req.user._id)` and returns HTTP 200 with `{ success: true, user }`.
2. **`updateProfile(req, res, next)`**: Validates that if `name` is provided, it is not blank. Calls `userService.updateUserProfile` and returns HTTP 200 with `{ success: true, message, user }`.
3. **`changePassword(req, res, next)`**: Validates presence of `currentPassword` and `newPassword`, enforces minimum password length (6 characters), calls `userService.changeUserPassword`, and returns HTTP 200 with `{ success: true, message }`.

---

### 4. Router Layer (`routes/userRoutes.js`)

```javascript
const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/change-password')
  .put(protect, changePassword);
```

Mounted in `backend/app.js` at `/api/users`.

---

## Security Architecture & Policies

1. **JWT-Bound Operations**:
   - The user ID is **never accepted from query parameters or request body** (`req.params.id` is not used).
   - The target user is derived exclusively from `req.user._id` set by `authMiddleware` via JWT token verification.
   - Cross-user profile tampering is architecturally impossible.
2. **Strict Whitelist (Mass Assignment Prevention)**:
   - Only approved fields are mutated.
   - `email` is strictly read-only for candidate profile integrity.
   - `password` cannot be modified via `PUT /api/users/profile`.
3. **Safe Password Updates**:
   - Passwords are never returned in responses.
   - Current password validation is mandatory before setting a new password.
   - Error messages do not leak server internals.

---

## API Endpoints Specification (Stage 3)

### A. Get Current User Profile
- **Endpoint**: `GET /api/users/profile`
- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "66c78b2e1f40d123456789ab",
    "name": "Candidate Name",
    "email": "candidate@example.com",
    "college": "National Institute of Technology",
    "bio": "Passionate software engineer preparing for placements.",
    "avatar": "https://example.com/avatar.jpg",
    "github": "candidate-git",
    "linkedin": "candidate-in",
    "leetcode": "candidate_lc",
    "codeforces": "candidate_cf",
    "codechef": "candidate_cc",
    "geeksforgeeks": "candidate_gfg",
    "createdAt": "2026-08-28T16:50:00.000Z"
  }
}
```

### B. Update Profile Details
- **Endpoint**: `PUT /api/users/profile`
- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "name": "Updated Name",
  "college": "Top Engineering College",
  "bio": "Placement ready full stack developer",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "github": "updated-dev",
  "linkedin": "updated-pro",
  "leetcode": "updated_leetcode",
  "codeforces": "updated_cf",
  "codechef": "updated_cc",
  "geeksforgeeks": "updated_gfg"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "66c78b2e1f40d123456789ab",
    "name": "Updated Name",
    "email": "candidate@example.com",
    "college": "Top Engineering College",
    "bio": "Placement ready full stack developer",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "github": "updated-dev",
    "linkedin": "updated-pro",
    "leetcode": "updated_leetcode",
    "codeforces": "updated_cf",
    "codechef": "updated_cc",
    "geeksforgeeks": "updated_gfg",
    "createdAt": "2026-08-28T16:50:00.000Z"
  }
}
```

### C. Change Account Password
- **Endpoint**: `PUT /api/users/change-password`
- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```
- **Error Response (400 Bad Request - Incorrect Current Password)**:
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Frontend Integration & Architecture

| Frontend Component | Path | Responsibility |
|---|---|---|
| **User Service** | `frontend/src/services/userService.js` | REST client executing `getProfile()`, `updateProfile()`, and `changePassword()` using configured `VITE_API_URL` |
| **Profile Page** | `frontend/src/pages/ProfilePage.jsx` | Full candidate profile overview, CP badges (LeetCode, CF, CC, GFG), social links, and inline edit modal |
| **Settings Page** | `frontend/src/pages/SettingsPage.jsx` | Account details, read-only email verification status, and password update form with client-side validation |
| **Auth Context** | `frontend/src/context/AuthContext.jsx` | Supplies `updateUser()` method so navbar avatar and name update immediately upon profile modification |
| **Router & Navbar** | `frontend/src/App.jsx` & `Navbar.jsx` | Protected routing for `/profile` and `/settings` with direct navigation from user menu |

---

## Interview Preparation & QA Guide (Stage 3)

### Q1: What is a Mass Assignment vulnerability, and how does Stage 3 prevent it?
**Answer**:
Mass assignment occurs when client-provided input is passed directly to an ORM/ODM update method (e.g. `User.findByIdAndUpdate(id, req.body)`). An attacker could inject malicious payload fields (e.g., `{ "isAdmin": true, "email": "hacked@evil.com", "verified": true }`).
In PrepForge Stage 3, we prevent this by explicitly whitelisting allowable profile fields (`name`, `college`, `bio`, `avatar`, `github`, `linkedin`, `leetcode`, `codeforces`, `codechef`, `geeksforgeeks`) in `userService.js`. Any unexpected field in `req.body` is discarded.

### Q2: Why is the authenticated user ID extracted from `req.user._id` instead of a URL parameter like `/api/users/:id/profile`?
**Answer**:
Using URL route parameters (such as `/api/users/:id/profile`) introduces the risk of **Broken Object Level Authorization (BOLA / IDOR)** vulnerabilities if the backend does not rigorously check whether `req.params.id === req.user._id`. By designing the route as `/api/users/profile` and binding directly to `req.user._id` from the verified JWT payload, unauthorized access or tampering with other users' profiles is impossible by design.

### Q3: Why is `select: '+password'` necessary when performing a password change?
**Answer**:
In our User schema, the password field is configured with `select: false` to protect against unintentional data leakage in standard queries. However, when changing a password, we must verify the candidate's existing password with `user.matchPassword(currentPassword)`. Calling `.select('+password')` explicitly instructs Mongoose to include the hashed password for that specific query only.

### Q4: How does Mongoose pre-save hook handle password hashing during password change?
**Answer**:
The pre-save hook checks `if (!this.isModified('password')) return next();`. When `user.password = newPassword` is set, `this.isModified('password')` evaluates to `true`. The hook generates a fresh 10-round bcrypt salt and hashes the password before writing to MongoDB. If other fields (e.g. `name`, `bio`) are saved without touching `password`, the hook skips hashing, preventing double-hashing bugs.

---

## Stage 3 Verification & Testing Checklist

1. **Get Profile (Protected)**:
   - Send `GET /api/users/profile` with `Authorization: Bearer <valid-token>`.
   - Expect HTTP 200 with full user profile fields (including default empty strings for unset CP handles).
2. **Unauthorized Access**:
   - Send `GET /api/users/profile` without token.
   - Expect HTTP 401 Unauthorized.
3. **Update Profile**:
   - Send `PUT /api/users/profile` with updated college, bio, and LeetCode handle.
   - Expect HTTP 200 with updated user JSON.
   - Verify MongoDB document reflection.
4. **Change Password - Incorrect Old Password**:
   - Send `PUT /api/users/change-password` with wrong `currentPassword`.
   - Expect HTTP 400 with `"Current password is incorrect"`.
5. **Change Password - Valid New Password**:
   - Send `PUT /api/users/change-password` with valid current password and new password (`minlength >= 6`).
   - Expect HTTP 200 with `"Password changed successfully"`.
6. **Login Verification**:
   - Attempt login with old password -> Expect HTTP 401.
   - Attempt login with new password -> Expect HTTP 200 with new JWT token.
7. **Frontend Verification**:
   - Navigate to `/profile`, edit bio and handles -> verify UI updates immediately.
   - Navigate to `/settings`, change password -> verify success message.
