# PrepForge — Complete Placement Preparation Platform

> **PrepForge** is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for campus and off-campus software engineering placement preparation. It combines structured roadmaps, competitive programming problem sets, SQL query playgrounds, CS fundamentals master sheets, company-specific interview archives, AI mock interviews, persistent progress tracking, streak monitoring, and real-time performance analytics.

---

## 🌟 Key Features

- 🔐 **JWT Authentication & Session Management**: Secure user signup, login, session persistence across page refreshes, and automatic 401 handling with password hashing via `bcryptjs`.
- 👤 **Candidate Profile & Portfolio**: User profile with bio, college details, social links, and competitive programming handles (LeetCode, Codeforces, CodeChef, GeeksforGeeks).
- 🧩 **DSA Master Roadmap**: Curated problem sets across Arrays, Strings, Trees, Graphs, DP with difficulty filters, search, optimal approach explanations, and C++/Python solution snippets.
- 🗄️ **SQL & Database Mastery**: Problem sheet with schema definitions, queries, CTEs, Window Functions, and concept deep-dives.
- 📚 **CS Fundamentals (Core Subjects)**: High-yield interview topics across DBMS, Computer Networks, OOPs, and System Design with key takeaways and top interview Q&As.
- 🏢 **Company-Wise Placement Sheets**: High-frequency problem archives categorized by top tech recruiters (Google, Amazon, Microsoft, Meta, TCS, Infosys, etc.).
- 🧮 **Aptitude & Reasoning Practice**: Quantitative, logical reasoning, and verbal aptitude with instant answer verification and step-by-step explanations.
- 🤖 **AI Mock Interview Simulator**: Real-time simulated technical and HR interview rounds with score evaluation and personalized feedback.
- ✅ **Persistent Solved Question Tracking**: Solved/unsolved state persists to MongoDB with optimistic UI updates and multi-device synchronization.
- 🔥 **Daily Streak & Activity Logging**: Streak tracking (current & longest streaks) and daily solved question timeline based on server-side UTC dates.
- 📊 **Real-Time Performance Analytics**: Dashboard powered by MongoDB Aggregation pipelines computing live overall completion, category breakdown, topic mastery, and difficulty distributions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Tooling:** React 19, Vite
- **Language:** JavaScript (ES Modules)
- **Styling & UI:** Tailwind CSS v4, Framer Motion
- **Routing:** React Router DOM v7
- **Icons:** React Icons (`react-icons`)
- **API Client:** Centralized REST client with automatic JWT header injection and 401 interceptor (`src/services/api.js`)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ORM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security & Networking:** CORS with environment-based origin validation, error-sanitizing middleware

---

## 🏗️ Architecture

```
Frontend (React 19 + Tailwind CSS)
       │
       ▼
Centralized API Service Layer (frontend/src/services/api.js)
       │
       ▼  HTTP / REST (JSON with JWT Bearer Token)
Express.js REST API Layer (backend/app.js)
       │
       ├── Middleware (authMiddleware, errorMiddleware, notFoundMiddleware)
       │
       ▼
Controllers (backend/controllers/*.js)
       │
       ▼
Services / Business Logic (backend/services/*.js)
       │
       ▼
Mongoose ODM & Aggregation Pipelines (backend/models/*.js)
       │
       ▼
MongoDB Database (Atlas or Local)
```

---

## 📁 Project Structure

```
PrepForge/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components & sheet cards
│   │   ├── context/          # AuthContext & SheetProgressContext
│   │   ├── data/             # Static curriculum templates & question banks
│   │   ├── layouts/          # MainLayout, Header, Footer
│   │   ├── pages/            # Dashboard, DSA, SQL, CS, Aptitude, Company, Profile, Auth
│   │   ├── services/         # Centralized API client & endpoint services
│   │   ├── App.jsx           # Routing & global providers
│   │   └── main.jsx          # Frontend entrypoint
│   ├── .env.example          # Frontend environment variables template
│   ├── .gitignore            # Frontend git ignore rules
│   ├── package.json          # Frontend dependencies & build scripts
│   └── vite.config.js        # Vite build configuration
│
├── backend/
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # HTTP request handlers
│   ├── middleware/           # Auth, error & 404 middleware
│   ├── models/               # Mongoose schemas (User, Question, Company, Progress, Activity)
│   ├── routes/               # Express route declarations
│   ├── scripts/              # Database seed script (seed.js)
│   ├── services/             # Core business logic & MongoDB aggregations
│   ├── scratch/              # Automated test suites
│   ├── .env.example          # Backend environment variables template
│   ├── .gitignore            # Backend git ignore rules
│   ├── API.md                # Full REST API documentation
│   ├── Backend_exp.md        # Comprehensive backend stages guide
│   ├── app.js                # Express app setup & middleware
│   ├── server.js             # Server startup entrypoint
│   └── package.json          # Backend dependencies & scripts
│
├── README.md                 # Project overview & documentation
└── .gitignore                # Root git ignore rules
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local MongoDB instance running (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` as needed:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/prepforge
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

4. Seed the database with questions & companies:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Verify `.env` contains:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`.

---

## 🧪 Testing & Verification

PrepForge includes an automated end-to-end integration and security test suite in `backend/scratch/test_stage7_integration.js`.

To run the test suite:
```bash
cd backend
node scratch/test_stage7_integration.js
```

This verifies:
- Health check endpoint (`GET /api/health`)
- User registration, login, and JWT issuance
- Unauthorized access rejection (HTTP 401)
- User profile retrieval and updating
- Password change and re-authentication with bcrypt
- Question catalog search, filtering, and pagination
- Company catalog and company question retrieval
- Persistent progress marking and retrieval
- UTC daily streak and activity logging
- Strict multi-user data isolation (User A vs User B)
- All 6 analytics aggregation endpoints
- Error formatting and invalid input handling

To run the frontend production build test:
```bash
cd frontend
npm run build
```

---

## 📖 API Documentation

Complete REST API documentation with sample request bodies, query parameters, authentication requirements, and JSON response envelopes is available in [`backend/API.md`](backend/API.md).

---

## 🌐 Production Deployment Preparation

### Frontend Deployment (e.g. Vercel, Netlify)
- **Root directory:** `frontend`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:**
  ```env
  VITE_API_URL=https://<your-deployed-backend-domain>/api
  ```

### Backend Deployment (e.g. Render, Railway, AWS ECS)
- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:**
  ```env
  PORT=5000
  NODE_ENV=production
  MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/prepforge?retryWrites=true&w=majority
  JWT_SECRET=<long-random-secret-key>
  JWT_EXPIRES_IN=7d
  FRONTEND_URL=https://<your-deployed-frontend-domain>
  CLIENT_ORIGIN=https://<your-deployed-frontend-domain>
  ```

---

## 📄 License
This project is licensed under the ISC License.
