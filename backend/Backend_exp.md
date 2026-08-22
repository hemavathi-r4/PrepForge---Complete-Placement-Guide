# PrepForge — Backend Stage 1 & Stage 2 Explanation

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
