# PrepForge — Complete Backend Architecture (Stages 1–6)

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

---

# Backend Stage 4: Learning Content & Question APIs

## Overview & Architecture Goals

Stage 4 transitions PrepForge's learning content (DSA Questions, SQL Challenges, Aptitude Problems, CS Fundamentals Core Subjects, and Company-Wise DSA Sheets) from static frontend JSON files into MongoDB collections.

The learning endpoints are exposed as **Public REST APIs** that support search, multi-parameter filtering, and pagination.

---

## Technical Specifications & Models

### 1. Models Created

#### `Company` Model (`backend/models/Company.js`)
- `slug`: String (unique, lowercase, indexed, e.g. `"google"`, `"amazon"`)
- `name`: String (e.g. `"Google"`, `"Amazon"`)
- `tier`: String (e.g. `"MAANG / FAANG"`)
- `description`: String
- `totalQuestions`: Number
- `difficultyBreakdown`: `{ easy, medium, hard }`

#### `Question` Model (`backend/models/Question.js`)
- `customId`: String (unique, indexed, e.g. `"dsa-arr-1"`, `"sql-b-1"`)
- `title`: String (indexed for text search)
- `topic`: String (indexed)
- `category`: Enum `["DSA", "SQL", "APTITUDE", "CORE"]` (indexed)
- `difficulty`: Enum `["Easy", "Medium", "Hard"]` (indexed)
- `statement`: String
- `approach`: String
- `complexity`: `{ time, space }`
- `code`: `{ cpp, python }`
- `externalLinks`: `{ leetcode, gfg }`
- `companies`: Array of `ObjectId` refs to `Company`
- `companySlugs`: Array of Strings (indexed)
- `tags`: Array of Strings
- SQL Specific: `schemaText`, `solutionQuery`, `explanation`, `keyConcept`
- Aptitude Specific: `aptitudeCategory`, `options`, `correctAnswer`, `explanation`
- CORE Specific: `shortName`, `summary`, `keyConcepts`, `interviewQAs`, `codeSnippet`, `gfgHubUrl`
- Company Specific: `frequency`

---

## Services & Controllers Created

### 1. Question Layer
- **`services/questionService.js`**: `getQuestionsService(queryParams)` and `getQuestionByIdService(id)`.
  - Supports query filters: `category`, `topic`, `difficulty`, `search`, `company`, `page`, `limit`.
  - Performs case-insensitive search across `title`, `topic`, `tags`, and `statement`.
- **`controllers/questionController.js`**: `getQuestions` (`GET /api/questions`) and `getQuestionById` (`GET /api/questions/:id`).
- **`routes/questionRoutes.js`**: Mounted at `/api/questions`.

### 2. Company Layer
- **`services/companyService.js`**: `getAllCompaniesService()`, `getCompanyByIdService(companyId)`, and `getCompanyQuestionsService(companyId, queryParams)`.
- **`controllers/companyController.js`**: `getCompanies` (`GET /api/companies`), `getCompanyById` (`GET /api/companies/:companyId`), and `getCompanyQuestions` (`GET /api/companies/:companyId/questions`).
- **`routes/companyRoutes.js`**: Mounted at `/api/companies`.

---

## Seeding Mechanism (`backend/scripts/seed.js`)

- Command: `node scripts/seed.js` (or `npm run seed`)
- **Safety Rule Enforced**: Clears ONLY `Question` and `Company` collections. `User` collection and authentication data remain completely untouched.
- Migrates static frontend datasets from `frontend/src/data/`:
  - `dsaSheetData.js`
  - `sqlSheetData.js`
  - `aptitudeQuestions.js`
  - `csFundamentalsData.js`
  - `companyDsaData.js`

### Migration Metrics
- **Companies Migrated**: 5 (`google`, `amazon`, `microsoft`, `tcs`, `infosys`)
- **Questions Migrated**: 125 total
  - `DSA`: 68
  - `SQL`: 34
  - `CORE`: 13
  - `APTITUDE`: 10

---

## API Endpoints Reference

| Endpoint | Method | Public / Auth | Query Parameters | Description |
|---|---|---|---|---|
| `/api/questions` | GET | Public | `category`, `topic`, `difficulty`, `search`, `company`, `page`, `limit` | Paginated question search & filtering |
| `/api/questions/:id` | GET | Public | None | Question details by `_id` or `customId` |
| `/api/companies` | GET | Public | None | List of all tagged recruiters/companies |
| `/api/companies/:companyId` | GET | Public | None | Company details by `_id` or `slug` |
| `/api/companies/:companyId/questions` | GET | Public | `topic`, `difficulty`, `search`, `page`, `limit` | Questions tagged for specific company |

---

## Frontend Files Integration

| Frontend Service / Page | File Location | Responsibilities |
|---|---|---|
| **Question Service** | `frontend/src/services/questionService.js` | Client API wrapper for `fetchQuestions` and `fetchQuestionById` using `VITE_API_URL` |
| **Company Service** | `frontend/src/services/companyService.js` | Client API wrapper for `fetchCompanies`, `fetchCompanyById`, and `fetchCompanyQuestions` |
| **DSA Sheet Page** | `frontend/src/pages/DSASheetPage.jsx` | Consumes `/api/questions?category=DSA`, groups by topic accordion, handles search & filters |
| **SQL Sheet Page** | `frontend/src/pages/SQLSheetPage.jsx` | Consumes `/api/questions?category=SQL`, renders SQL schema & queries |
| **Aptitude Page** | `frontend/src/pages/AptitudePage.jsx` | Consumes `/api/questions?category=APTITUDE`, provides MCQ practice workflow |
| **CS Fundamentals Page** | `frontend/src/pages/CSFundamentalsPage.jsx` | Consumes `/api/questions?category=CORE`, groups by CS domain |
| **Company Sheets Page** | `frontend/src/pages/CompanySheetsPage.jsx` | Consumes `/api/companies` and `/api/companies/:companyId/questions` |

---

## How to Run Seed & Test APIs

1. **Seed Learning Data**:
   ```bash
   node scripts/seed.js
   ```
2. **Run Backend API Verification Suite**:
   ```bash
   node scratch/test_stage4_api.js
   ```


---

# Backend Stage 5: User Progress Sync & Analytics

## Overview & Goals

Stage 5 completes the transition from **localStorage-only progress tracking** to a fully **MongoDB-backed, per-user progress persistence** system. Authenticated users' progress (which questions they have solved) is now stored in MongoDB and synced in real-time between devices. The Dashboard displays live analytics: overall completion %, category-wise breakdowns, current streak, and longest streak — all computed dynamically from the database.

---

## Architectural Separation of Concerns (Stage 5)

$$\text{HTTP Request} \longrightarrow \text{Route} \longrightarrow \text{Auth Middleware} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Model} \longrightarrow \text{MongoDB}$$

```
backend/
├── models/
│   ├── UserProgress.js       # [STAGE 5] Per-question solved/unsolved record per user
│   └── UserActivity.js       # [STAGE 5] Daily activity log (questions solved per UTC date)
├── services/
│   └── progressService.js    # [STAGE 5] Business logic: mark solved, summary, streak, activity
├── controllers/
│   └── progressController.js # [STAGE 5] HTTP handler layer for /api/progress
└── routes/
    └── progressRoutes.js     # [STAGE 5] Route definitions, mounted at /api/progress
```

---

## Data Models (Stage 5)

### 1. `UserProgress` Model (`models/UserProgress.js`)

Stores one document per (user, question) pair. Tracks solved status and timestamp.

```javascript
const userProgressSchema = new mongoose.Schema({
  user:     { type: ObjectId, ref: 'User',     required: true, index: true },
  question: { type: ObjectId, ref: 'Question', required: true, index: true },
  customId: { type: String,   required: true,  trim: true,     index: true },
  solved:   { type: Boolean,  required: true,  default: false },
  solvedAt: { type: Date,     default: null }
}, { timestamps: true });

// Compound unique: one record per user per question
userProgressSchema.index({ user: 1, question: 1 }, { unique: true });
userProgressSchema.index({ user: 1, customId: 1 });
userProgressSchema.index({ user: 1, solved: 1 });
```

**Key design decisions:**
- `customId` is denormalized for fast lookup by frontend question ID strings without always joining `Question`.
- `findOneAndUpdate` with `{ upsert: true }` guarantees **atomic idempotent** mark-solved operations.
- The compound unique index on `{ user, question }` prevents duplicate progress records.

---

### 2. `UserActivity` Model (`models/UserActivity.js`)

Stores one document per (user, UTC date) pair for streak calculation.

```javascript
const userActivitySchema = new mongoose.Schema({
  user:            { type: ObjectId, ref: 'User', required: true, index: true },
  date:            { type: String,   required: true, trim: true },  // "YYYY-MM-DD" UTC
  questionsSolved: { type: Number,   default: 0,    min: 0 }
}, { timestamps: true });

// One activity record per user per day
userActivitySchema.index({ user: 1, date: 1 }, { unique: true });
```

**Key design decisions:**
- `date` is stored as a `"YYYY-MM-DD"` string (UTC) to completely avoid timezone boundary bugs.
- `$inc: { questionsSolved: 1 }` with `upsert: true` creates the day's record atomically on the first solve.
- Only increments when a question transitions from **unsolved → solved** (no double-counting).

---

## Business Logic Layer (`services/progressService.js`)

### `markQuestionSolvedService(userId, questionId, solved)`

1. Resolves `questionId` — accepts both MongoDB `_id` and `customId` string.
2. Checks if the question was already solved (to avoid double-counting activity).
3. **Upserts** `UserProgress` atomically.
4. If newly becoming solved, increments today's `UserActivity` via `$inc`.

### `getProgressSummaryService(userId)`

Runs two **parallel MongoDB aggregations**:
1. `Question.aggregate` → total question count per category.
2. `UserProgress.aggregate` with `$lookup` → solved count per category for this user.

Returns: `{ totalSolved, totalQuestions, overallPercentage, dsaSolved, sqlSolved, aptitudeSolved, coreSolved, categoryBreakdown }`.

### `getStreakService(userId)`

Computes streak by building a `Set` of active UTC date strings, then walking backward from today:
- **Current streak**: Consecutive days ending today.
- **Longest streak**: Maximum consecutive run across all active dates.

Returns: `{ current: number, longest: number, todayActive: boolean }`.

---

## API Endpoints Specification (Stage 5)

All endpoints require `Authorization: Bearer <token>` header.

| Endpoint | Method | Description |
|---|---|---|
| `/api/progress` | GET | Full progress list (all questions, solved + unsolved) |
| `/api/progress/:questionId` | PUT | Mark question solved/unsolved |
| `/api/progress/:questionId` | GET | Progress status for a single question |
| `/api/progress/summary` | GET | Overall + category-wise progress summary |
| `/api/progress/streak` | GET | Current streak, longest streak, today active |
| `/api/progress/activity` | GET | Recent daily activity log (`?days=30`) |

### PUT `/api/progress/:questionId`

**Request Body:** `{ "solved": true }`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Question marked as solved",
  "progress": {
    "questionId": "dsa-arr-1",
    "solved": true,
    "solvedAt": "2026-09-07T10:15:00.000Z"
  }
}
```

**Validation errors:**
- `"solved"` must be a boolean → HTTP 400
- Invalid `questionId` → HTTP 404

### GET `/api/progress/summary`

**Success Response (200):**
```json
{
  "success": true,
  "summary": {
    "totalSolved": 12,
    "totalQuestions": 125,
    "overallPercentage": 10,
    "categoryBreakdown": {
      "dsa":      { "solved": 8,  "total": 68, "percentage": 12 },
      "sql":      { "solved": 3,  "total": 34, "percentage": 9  },
      "aptitude": { "solved": 1,  "total": 10, "percentage": 10 },
      "core":     { "solved": 0,  "total": 13, "percentage": 0  }
    }
  }
}
```

---

## Route Configuration (`routes/progressRoutes.js`)

```javascript
router.use(protect);  // All routes require JWT

// Named routes MUST come before :questionId to avoid conflicts
router.get('/summary',  getProgressSummary);
router.get('/streak',   getStreak);
router.get('/activity', getActivity);

router.get('/',              getUserProgress);
router.put('/:questionId',   updateQuestionProgress);
router.get('/:questionId',   getQuestionProgress);
```

> **Critical**: `/summary`, `/streak`, `/activity` must be declared **before** `/:questionId`. Otherwise Express interprets the literal strings as a `questionId` parameter value.

---

## Frontend Integration (Stage 5)

### Files Modified/Created

| File | Change | Responsibility |
|---|---|---|
| `frontend/src/services/progressService.js` | **[NEW]** | REST client for all `/api/progress` endpoints |
| `frontend/src/context/SheetProgressContext.jsx` | **[MODIFIED]** | Backend sync on mount + on toggleSolved |
| `frontend/src/pages/DashboardPage.jsx` | **[MODIFIED]** | Live stats from backend (summary, streak) |
| `frontend/src/data/mockQuestions.js` | **[MODIFIED]** | Added `category` field to PREP_MODULES |

### `SheetProgressContext.jsx` — Stage 5 Upgrade

**On Mount** (`syncProgressFromBackend`):
- Calls `GET /api/progress`.
- Merges solved `customId`s into `solvedIds` (union — no data lost).
- Safely no-ops when unauthenticated.

**On `toggleSolved(id)`**:
1. Immediately updates `solvedIds` state and `localStorage` (**optimistic update**).
2. If authenticated, fires a background `PUT /api/progress/:id` (fire-and-forget).
3. Backend failure is non-fatal: local state stays correct.

**Unauthenticated users**: localStorage remains sole source of truth (zero behavior change from Stage 4).

### `DashboardPage.jsx` — Stage 5 Upgrade

Fetches `getProgressSummary()` and `getStreak()` in parallel on mount. Shows skeleton shimmer while loading, then renders:
- Live **Problems Solved** count and **overall %**
- Live **Current Streak** badge
- **Category Breakdown** section with animated progress bars
- **Module cards** enriched with live `%` from `categoryBreakdown`

---

## Security Architecture (Stage 5)

1. **User isolation via JWT**: All queries filter by `req.user._id` from the verified JWT. Cross-user progress access is architecturally impossible.
2. **No userId in URL**: User identity comes exclusively from the verified JWT token — no BOLA/IDOR risk.
3. **Atomic upsert**: `findOneAndUpdate` with `upsert: true` prevents race condition duplicates.
4. **UTC-normalized dates**: Streak calculations use UTC midnight strings to avoid server/client timezone mismatches.

---

## Interview Preparation & QA Guide (Stage 5)

### Q1: Why store `customId` redundantly in `UserProgress` when there is already a `question` ObjectId reference?
**Answer:**
This is deliberate **denormalization** for performance. Frontend questions are identified by `customId` strings (e.g. `"dsa-arr-1"`). Without `customId`, every string-based lookup requires two queries: find `Question` by `customId`, then find `UserProgress`. By storing `customId` directly with a compound index `{ user, customId }`, we achieve single-query O(log n) lookups.

### Q2: What happens if a user marks the same question solved twice? Does the activity counter double-increment?
**Answer:**
No. The service records `wasAlreadySolved` before the upsert, and only calls `$inc` on `UserActivity` when a question transitions from **unsolved → solved**, not on subsequent re-marking. The upsert itself is idempotent by the unique compound index.

### Q3: Why use a UTC date string (`"YYYY-MM-DD"`) instead of a Date object for activity records?
**Answer:**
MongoDB `Date` objects require timezone-aware aggregation (`$dateToString` with `timezone` parameter). A fixed UTC string makes streak comparison completely unambiguous, portable across servers in any timezone, and trivially comparable with JavaScript `===`.

### Q4: What is optimistic updating, and why is it used in `SheetProgressContext`?
**Answer:**
Optimistic updating means updating local UI state immediately before receiving server confirmation, eliminating perceived network latency. If the backend call fails, the local state is not rolled back — next mount will reconcile from MongoDB. This provides a smooth UX without blocking interactions on network latency.

### Q5: How does `getStreakService` handle a user who missed yesterday but solved today?
**Answer:**
The backward-walking cursor starts from today. If today has activity, `currentStreak` starts at 1 and walks back to yesterday, the day before, etc. If yesterday had no activity, the walk stops immediately. The streak resets to 0 for days with no activity, matching the conventional definition: a streak requires at least one solve on each consecutive day including today.

---

## Stage 5 Verification Checklist

1. **Mark Solved (Backend Persisted)**:
   - Login, open DSA Sheet, check a problem → Verify `UserProgress` document in MongoDB with `solved: true`.
2. **Progress Summary**:
   - `GET /api/progress/summary` with valid JWT → Expect `totalSolved`, `overallPercentage`, all 4 categories.
3. **Streak**:
   - Solve at least one question → `GET /api/progress/streak` → Expect `streak.current >= 1`, `todayActive: true`.
4. **Dashboard Live Data**:
   - Navigate to `/dashboard` → Stats row shows real `totalSolved`.
   - Category Breakdown section visible with correct percentages.
5. **Backend Test Suite**:
   ```bash
   node scratch/test_stage5_api.js
   ```
   Expect: `46 passed, 0 failed`.
6. **Unauthenticated Fallback**:
   - Logout, open DSA Sheet → Progress tracked in localStorage only.
   - Protected routes return HTTP 401.
7. **Cross-Device Sync**:
   - Mark questions solved on device A. Login on device B → Progress synced from backend on mount.

---

# Backend Stage 6: Analytics & Dashboard Backend (B6)

## Overview & Architecture Goals

Stage 6 delivers high-performance, user-specific analytics and dashboard reporting for **PrepForge**. Rather than storing redundant, precomputed metrics that can fall out of sync, Stage 6 leverages **on-demand MongoDB Aggregation Pipelines** and derived computations over existing B5 data collections (`UserProgress`, `UserActivity`, `Question`, `Company`).

### Core Architectural Principles
1. **Zero Duplicate Storage**: No redundant analytics tables or duplicated progress metrics stored in MongoDB. Metrics are computed dynamically from primary records.
2. **Reuse Existing B5 Logic**: Reuses `getStreakService` and `getActivityService` from `progressService.js` directly, preventing duplicate logic and drift.
3. **Strict User Isolation**: All aggregation pipelines and queries filter strictly by `req.user._id` from verified JWTs. No `userId` is accepted from query parameters, request bodies, or route params.
4. **Mathematical Safety**: All percentage calculations use safe division guards (`safePct`) to prevent `NaN` or `Infinity` when totals are zero, with rounding to two decimal places.
5. **Continuous Timeline Normalization**: Activity analytics automatically backfills zero-activity calendar days, giving clients continuous time-series data suitable for charts without client-side gap filling.
6. **100% Backward Compatible UI/UX**: The existing React dashboard visual structure, components, and layout remain preserved while being seamlessly powered by real analytics APIs.

---

## Tech Stack & Aggregation Capabilities (Stage 6)

| Technology | Purpose |
|---|---|
| **MongoDB Aggregation Framework** | Multi-stage data processing pipelines (`$match`, `$lookup`, `$unwind`, `$group`, `$sort`) |
| **Express.js Router** | Dedicated `/api/analytics` route group protected with JWT auth middleware |
| **Mongoose ODM** | Schema modeling, multi-collection aggregation queries, and lean document querying |
| **Native Fetch API** | Frontend REST service layer (`analyticsService.js`) |

---

## Architectural Layering

$$\text{HTTP Request} \longrightarrow \text{analyticsRoutes.js} \xrightarrow{\text{protect}} \text{analyticsController.js} \longrightarrow \text{analyticsService.js} \longrightarrow \text{MongoDB Pipelines}$$

1. **Routes (`routes/analyticsRoutes.js`)**:
   - Applies `protect` middleware globally to all analytics endpoints.
   - Maps HTTP GET endpoints to controller handlers.
2. **Controllers (`controllers/analyticsController.js`)**:
   - Extracts authenticated user ID from `req.user._id`.
   - Dispatches requests to service functions.
   - Formats responses with standard dual-key output (`{ success: true, [resourceName], data }`).
3. **Services (`services/analyticsService.js`)**:
   - Executes aggregation pipelines and queries.
   - Enforces business logic, safe percentages, and activity timeline generation.
   - Imports B5 streak calculation logic directly.

---

## Analytics Endpoints Specification

All endpoints are prefixed with `/api/analytics` and require `Authorization: Bearer <token>`.

### 1. Overview Analytics (`GET /api/analytics/overview`)
Returns high-level summary metrics for the authenticated user's dashboard.

#### Aggregation & Computation:
- `Question.countDocuments({})`: Total questions cataloged in the system.
- `UserProgress.countDocuments({ user: userId, solved: true })`: Total solved by user.
- `getStreakService(userId)`: Reused streak computation (current & longest).
- `UserActivity`: Dynamic window calculation for `todaySolved`, `thisWeekSolved` (7-day window), and `thisMonthSolved` (30-day window).
- `safePct(solved, total)`: Safe percentage with 2 decimal precision.

#### Sample Response:
```json
{
  "success": true,
  "overview": {
    "totalQuestions": 125,
    "totalSolved": 12,
    "overallPercentage": 9.6,
    "currentStreak": 2,
    "longestStreak": 5,
    "todaySolved": 3,
    "thisWeekSolved": 8,
    "thisMonthSolved": 12
  }
}
```

---

### 2. Category Analytics (`GET /api/analytics/category`)
Returns progress breakdowns for all 4 primary curriculum categories (`DSA`, `SQL`, `APTITUDE`, `CORE`).

#### Aggregation Pipeline:
```javascript
// Solved questions per category via UserProgress + Question lookup
UserProgress.aggregate([
  { $match: { user: new mongoose.Types.ObjectId(userId), solved: true } },
  {
    $lookup: {
      from: 'questions',
      localField: 'question',
      foreignField: '_id',
      as: 'q'
    }
  },
  { $unwind: '$q' },
  { $group: { _id: '$q.category', solved: { $sum: 1 } } }
]);
```

#### Sample Response:
```json
{
  "success": true,
  "count": 4,
  "categories": [
    { "category": "DSA", "total": 68, "solved": 8, "unsolved": 60, "percentage": 11.76 },
    { "category": "SQL", "total": 34, "solved": 3, "unsolved": 31, "percentage": 8.82 },
    { "category": "APTITUDE", "total": 10, "solved": 1, "unsolved": 9, "percentage": 10 },
    { "category": "CORE", "total": 13, "solved": 0, "unsolved": 13, "percentage": 0 }
  ]
}
```

---

### 3. Topic Analytics (`GET /api/analytics/topic`)
Returns progress metrics broken down by individual topic (e.g. Arrays, Dynamic Programming, Joins, Normalization).

#### Aggregation Pipeline:
- Aggregates all distinct topics and counts from `Question`.
- Aggregates user's solved question counts per topic from `UserProgress` via `$lookup`.
- Combines metrics into an array sorted by total questions descending.

#### Sample Response:
```json
{
  "success": true,
  "count": 18,
  "topics": [
    { "topic": "Arrays", "total": 15, "solved": 4, "unsolved": 11, "percentage": 26.67 },
    { "topic": "Strings", "total": 12, "solved": 2, "unsolved": 10, "percentage": 16.67 },
    { "topic": "Trees", "total": 10, "solved": 1, "unsolved": 9, "percentage": 10.0 }
  ]
}
```

---

### 4. Difficulty Analytics (`GET /api/analytics/difficulty`)
Returns question completion metrics categorized by difficulty tiers (`Easy`, `Medium`, `Hard`).

#### Sample Response:
```json
{
  "success": true,
  "difficulty": [
    { "difficulty": "Easy", "total": 45, "solved": 7, "unsolved": 38, "percentage": 15.56 },
    { "difficulty": "Medium", "total": 60, "solved": 4, "unsolved": 56, "percentage": 6.67 },
    { "difficulty": "Hard", "total": 20, "solved": 1, "unsolved": 19, "percentage": 5.0 }
  ]
}
```

---

### 5. Activity Timeline Analytics (`GET /api/analytics/activity?days=30`)
Returns a continuous, gap-free daily activity history for charting and streak tracking.

#### Continuous Date Normalization:
Even if the user was inactive on certain days, the service generates a complete calendar date array spanning the requested window (`1` to `365` days, default `30`) and populates `questionsSolved: 0` for days without records.

#### Sample Response:
```json
{
  "success": true,
  "days": 7,
  "activity": [
    { "date": "2026-09-01", "questionsSolved": 0 },
    { "date": "2026-09-02", "questionsSolved": 2 },
    { "date": "2026-09-03", "questionsSolved": 0 },
    { "date": "2026-09-04", "questionsSolved": 1 },
    { "date": "2026-09-05", "questionsSolved": 0 },
    { "date": "2026-09-06", "questionsSolved": 3 },
    { "date": "2026-09-07", "questionsSolved": 2 }
  ]
}
```

---

### 6. Company Analytics (`GET /api/analytics/company`)
Returns solved vs. total metrics for individual target companies (Google, Amazon, Microsoft, etc.).

#### Aggregation Strategy:
- Questions store associated companies in `companySlugs: ['google', 'amazon', ...]`.
- Pipeline unwinds `companySlugs`, groups by slug to count totals.
- Matches user's solved question IDs against questions with matching slugs.
- Resolves official company names from the `Company` collection.

#### Sample Response:
```json
{
  "success": true,
  "count": 6,
  "companies": [
    { "company": "Amazon", "slug": "amazon", "total": 28, "solved": 5, "unsolved": 23, "percentage": 17.86 },
    { "company": "Google", "slug": "google", "total": 24, "solved": 3, "unsolved": 21, "percentage": 12.5 },
    { "company": "Microsoft", "slug": "microsoft", "total": 22, "solved": 4, "unsolved": 18, "percentage": 18.18 }
  ]
}
```

---

## Frontend Integration (Stage 6)

### Files Modified/Created

| File | Change | Responsibility |
|---|---|---|
| `frontend/src/services/analyticsService.js` | **[NEW]** | Client API wrapper for all 6 `/api/analytics` routes |
| `frontend/src/pages/DashboardPage.jsx` | **[MODIFIED]** | Connects to `getAnalyticsOverview`, updates stats row without UI disruption |
| `backend/services/analyticsService.js` | **[NEW]** | Core analytics aggregation pipelines and business computations |
| `backend/controllers/analyticsController.js` | **[NEW]** | HTTP controller endpoints for analytics routes |
| `backend/routes/analyticsRoutes.js` | **[NEW]** | Express router mounted at `/api/analytics` |
| `backend/app.js` | **[MODIFIED]** | Mounted `/api/analytics` route handler |
| `backend/scratch/test_stage6_api.js` | **[NEW]** | Automated test suite verifying all 6 endpoints |

---

## Interview Preparation & QA Guide (Stage 6)

### Q1: Why use MongoDB Aggregation pipelines instead of storing precomputed analytics numbers on the User document?
**Answer:**
Storing precomputed counters (e.g., `user.dsaSolvedCount`) introduces severe **data anomalies and synchronization bugs**. If a question's category is edited, a solved question is deleted, or a transaction fails halfway, the cached counters become corrupted. Deriving metrics on-demand via `$match` and `$group` guarantees **single-source-of-truth accuracy**, eliminating write anomalies.

### Q2: How does the analytics service prevent Division by Zero when computing percentages?
**Answer:**
Through the helper function `safePct(solved, total)`:
```javascript
const safePct = (solved, total) =>
  total > 0 ? Math.round((solved / total) * 10000) / 100 : 0;
```
If a category or topic currently has 0 questions (`total === 0`), it immediately returns `0` instead of JavaScript's `NaN` or `Infinity`, and rounds values to two decimal places.

### Q3: Why does `getActivityAnalyticsService` fill in missing dates with `questionsSolved: 0`?
**Answer:**
Sparse activity logs (storing only days when questions were solved) are space-efficient in the database. However, frontend charts (line charts, heatmaps, bar charts) require a continuous time series. Backfilling zeroes on the backend guarantees chronological continuity, eliminates client-side timezone bugs, and reduces frontend complexity.

### Q4: How is User Isolation enforced across all analytics queries?
**Answer:**
User identity is never accepted from the request body, URL path, or query string. Instead, the `protect` JWT middleware decodes the token from the `Authorization` header and attaches the verified user to `req.user`. Every database query and aggregation pipeline begins with `{ $match: { user: req.user._id } }`. It is architecturally impossible for one user to query another user's analytics.

### Q5: How does the Company Analytics aggregation handle questions mapped to multiple companies?
**Answer:**
Questions contain an array of company slugs (`companySlugs: ['google', 'amazon']`). The aggregation pipeline utilizes the `$unwind: '$companySlugs'` stage to deconstruct the array into individual documents per slug before grouping. This allows a single multi-company question to accurately contribute to each respective company's statistics.

---

## Stage 6 Verification Checklist

1. **Automated Test Suite**:
   ```bash
   node scratch/test_stage6_api.js
   ```
   *Verified: 58 passed, 0 failed.*
2. **Regression Test Suite (Stage 5)**:
   ```bash
   node scratch/test_stage5_api.js
   ```
   *Verified: 46 passed, 0 failed.*
3. **Frontend Production Build**:
   ```bash
   npm.cmd run build
   ```
   *Verified: Built successfully with 0 errors.*
4. **Security & Authentication**:
   - Requesting any `/api/analytics/*` endpoint without token returns HTTP 401.
   - User A and User B maintain completely isolated analytics data.
5. **Continuous Activity Timeline**:
   - `GET /api/analytics/activity?days=30` returns 30 consecutive calendar days in chronological order.

---

# Backend Stage 7: Final Frontend ↔ Backend Integration, Production Readiness & Deployment Preparation (B7)

## Overview & Mission

Stage 7 completes the development lifecycle of **PrepForge**, transitioning the platform from individual modular backend stages (B1–B6) into a unified, secure, configurable, and production-ready full-stack MERN application.

### Key Goals & Non-Negotiables
1. **Full Architectural Cohesion**: Guarantee strict architectural layering:
   $$\text{React UI} \longrightarrow \text{Centralized API Client} \longrightarrow \text{Express REST API} \longrightarrow \text{Middleware} \longrightarrow \text{Controllers} \longrightarrow \text{Services} \longrightarrow \text{Mongoose} \longrightarrow \text{MongoDB}$$
2. **Centralized Frontend API Client (`api.js`)**: Replaced scattered fetch calls and legacy mocks with a unified HTTP client that manages environment resolution (`VITE_API_URL`), automatic Bearer token injection, request body serialization, and centralized 401 Unauthorized handling.
3. **Multi-User Data Isolation**: Validated through rigorous automated tests that User A cannot view, modify, or leak into User B's progress, activity history, streaks, profile data, or analytics.
4. **Error Format Normalization**: Standardized all error responses to `{ success: false, message: string }`, gracefully handling Mongoose `CastError` (invalid ObjectIds), duplicate keys (`E11000`), schema validation errors, and JWT expiration.
5. **Security & Production Hardening**:
   - Password hashing via `bcryptjs` with salt rounds.
   - Zero credentials or secrets committed; comprehensive `.gitignore` coverage.
   - Environment-driven CORS origin validation supporting both production domains and local development.
   - `x-powered-by` header disabled.
   - Production readiness for Vercel/Netlify (Frontend) + Render/Railway (Backend) + MongoDB Atlas.

---

## 1. Centralized Frontend API Architecture (`src/services/api.js`)

### Design & Mechanics

Instead of instantiating ad-hoc `fetch` or multiple Axios configurations across individual services, `api.js` serves as the single source of truth for all network communication:

```javascript
export const apiRequest = async (endpoint, options = {}) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const config = { ...options, headers: defaultHeaders, body };

  try {
    const response = await fetch(url, config);

    // Centralized 401 Unauthorized Interception
    if (response.status === 401) {
      clearAuthStorage();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prepforge:unauthorized'));
      }
    }

    const data = await response.json();
    return response.ok ? { success: true, ...data } : { success: false, ...data };
  } catch (error) {
    return {
      success: false,
      error: 'Unable to connect to PrepForge server.',
      isNetworkError: true
    };
  }
};
```

### Automatic 401 Interception & AuthContext Synchronization
When the backend rejects a request due to an expired or malformed JWT token (HTTP 401):
1. `api.js` immediately clears `prepforge_token` and `prepforge_current_user` from `localStorage`.
2. Dispatches a custom window event: `prepforge:unauthorized`.
3. `AuthContext` receives the event and resets `user` state to `null`.
4. Protected routes (`ProtectedRoute`) automatically redirect the user to `/login`.

---

## 2. Refactored Frontend Service Layer

All modular frontend services now route through the centralized API client while preserving 100% backward compatibility with existing React UI components:

| Service File | Refactored Endpoints | Responsibility |
|---|---|---|
| `authService.js` | `/auth/register`, `/auth/login`, `/auth/me` | JWT registration, login, session restoration & client logout |
| `userService.js` | `/users/profile`, `/users/change-password` | Profile retrieval, competitive handles update, bcrypt password change |
| `questionService.js` | `/questions`, `/questions/:id` | Catalog queries with category, difficulty, search, and pagination |
| `companyService.js` | `/companies`, `/companies/:id`, `/companies/:id/questions` | Company catalog and company-tagged interview questions |
| `progressService.js` | `/progress`, `/progress/:id`, `/progress/summary`, `/progress/streak`, `/progress/activity` | Mark solved/unsolved, get summary, UTC streaks, and daily activity logs |
| `analyticsService.js` | `/analytics/overview`, `/analytics/category`, `/analytics/topic`, `/analytics/difficulty`, `/analytics/activity`, `/analytics/company` | Real-time MongoDB Aggregation-powered dashboard statistics |

---

## 3. Global Error Handling & Input Validation Hardening

### Enhanced Backend Error Middleware (`backend/middleware/errorMiddleware.js`)

The global error handler intercepts and formats all system and database exceptions into a consistent structure:

```javascript
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // 1. Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
  }

  // 2. Duplicate key (MongoDB E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `A record with that ${field} already exists`;
  }

  // 3. Schema validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // 4. JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## 4. Multi-User Isolation & Security Verification

Stage 7 includes an end-to-end automated verification script (`backend/scratch/test_stage7_integration.js`) comprising **77 distinct assertions**.

### Tested Security Vector Assertions
1. **User A vs User B Isolation**:
   - User A solving `dsa-arr-1` and `dsa-arr-2` does not mark them solved for User B.
   - User B solving `dsa-arr-9` does not mark it solved for User A.
   - User A and User B maintain distinct streak calculations and daily activity logs.
   - Overview analytics (`GET /api/analytics/overview`) accurately compute totals isolated to `req.user._id`.
2. **Bcrypt Security**:
   - Stored passwords are cryptographically hashed with salt rounds before saving.
   - Password hashes are excluded from all query projections (`select('-password')`).
   - Changing password invalidates the previous password and permits login only with the newly hashed password.
3. **Route Protection**:
   - Missing or malformed Bearer tokens consistently yield HTTP 401.
   - Non-existent routes return HTTP 404 with standard envelope formatting.

---

## 5. Deployment Readiness Architecture

### Environment Configurations

#### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/prepforge?retryWrites=true&w=majority
JWT_SECRET=<strong-random-jwt-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://prepforge-frontend.vercel.app
FRONTEND_URL=https://prepforge-frontend.vercel.app
```

#### Frontend (`frontend/.env.example`)
```env
VITE_API_URL=https://prepforge-backend.onrender.com/api
```

### Production Build Verification
- Frontend Vite production build executes with 0 errors (`npm.cmd run build` -> `dist/`).
- Backend starts cleanly via `node server.js` without dependency on `nodemon`.

---

## 6. Interview QA Guide (Stage 7)

### Q1: How does PrepForge handle token expiration and automatic logout across multiple tabs?
**Answer:**
When an API request returns HTTP 401, the centralized `api.js` client intercepts the response, clears `localStorage` credentials, and broadcasts a `prepforge:unauthorized` window event. `AuthContext` listens to this event and resets the authenticated user state to `null`. Any protected route instantly redirects the user to the login screen without requiring individual page components to catch or handle 401 errors.

### Q2: Why is Mongoose CastError handling important for production security and reliability?
**Answer:**
When a client passes an arbitrary string (such as `"abc"` or an invalid ID) into a route expecting a MongoDB ObjectId (e.g. `/api/questions/:id`), Mongoose throws a `CastError`. Without centralized interception, Express would treat this as an unhandled 500 Internal Server Error, potentially leaking server internals or filling error logs. Intercepting `CastError` converts it into a clean 400 Bad Request with a clear error message.

### Q3: How do we prevent Cross-Origin Resource Sharing (CORS) vulnerabilities in production?
**Answer:**
Rather than setting `origin: '*'` or allowing unrestricted origins, PrepForge reads allowed origins dynamically from `FRONTEND_URL` and `CLIENT_ORIGIN` environment variables. In production, only the verified frontend deployment domain is permitted to access the API with credentials.

### Q4: How is Multi-User Isolation verified in automated testing?
**Answer:**
The test suite creates two distinct user accounts (User A and User B), generates independent JWT tokens, performs progress updates on separate questions, and asserts that User A's queries return only User A's progress and analytics. Furthermore, checking User B's questions with User A's token verifies that User B's progress returns `solved: false` for User A.

---

## Stage 7 Verification Summary

| Verification Category | Target | Result |
|---|---|---|
| E2E Integration Test Suite | `node scratch/test_stage7_integration.js` | **77 / 77 Passed (0 Failed)** |
| Frontend Production Build | `npm.cmd run build` | **Build completed in 1.30s (0 Errors)** |
| Centralized API Client | `frontend/src/services/api.js` | **Integrated & Verified** |
| Multi-User Data Isolation | User A vs User B | **100% Isolated & Verified** |
| API Documentation | `backend/API.md` | **Complete Specification Created** |
| Project README | `README.md` | **Updated & Deployment Ready** |
| Git Cleanliness | No secrets, `.env`, or build logs committed | **Clean & Verified** |

