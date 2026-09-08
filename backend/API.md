# PrepForge — REST API Documentation

This document outlines the complete REST API specification for the **PrepForge** MERN stack placement preparation platform.

---

## Base URL & Authentication

- **Base URL:** `http://localhost:5000/api` (Development) or `https://<your-backend-domain>/api` (Production)
- **Authentication Scheme:** JSON Web Token (JWT) transmitted via HTTP header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```
- **Standard Error Response:**
  ```json
  {
    "success": false,
    "message": "Error description here"
  }
  ```

---

## 1. System Health API

### Health Check
- **Method:** `GET`
- **Endpoint:** `/health`
- **Authentication:** Public (None)
- **Description:** Verifies backend server health and deployment availability.
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "PrepForge API is running"
  }
  ```

---

## 2. Authentication APIs (`/api/auth`)

### Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Authentication:** Public (None)
- **Request Body:**
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Example Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": {
      "id": "67cd4a12bc98fe001a4e1234",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Authentication:** Public (None)
- **Request Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "67cd4a12bc98fe001a4e1234",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Restore Current Session / User Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "67cd4a12bc98fe001a4e1234",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "student",
      "createdAt": "2026-09-08T09:00:00.000Z"
    }
  }
  ```

---

## 3. User Management APIs (`/api/users`)

### Get User Profile
- **Method:** `GET`
- **Endpoint:** `/users/profile`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "67cd4a12bc98fe001a4e1234",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "college": "National Institute of Technology",
      "bio": "Competitive programmer & Full Stack enthusiast",
      "avatar": "https://example.com/avatar.jpg",
      "github": "alexjohnson",
      "linkedin": "alex-johnson",
      "leetcode": "alex_lc",
      "codeforces": "alex_cf",
      "codechef": "alex_cc",
      "geeksforgeeks": "alex_gfg"
    }
  }
  ```

### Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/users/profile`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "name": "Alex Johnson",
    "college": "IIT Bombay",
    "bio": "Placed at Google SDE-1",
    "leetcode": "alex_leetcode"
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "_id": "67cd4a12bc98fe001a4e1234",
      "name": "Alex Johnson",
      "college": "IIT Bombay",
      "bio": "Placed at Google SDE-1",
      "leetcode": "alex_leetcode"
    }
  }
  ```

### Change Password
- **Method:** `PUT`
- **Endpoint:** `/users/change-password`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "currentPassword": "SecurePassword123!",
    "newPassword": "NewStrongPassword456!"
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

---

## 4. Question APIs (`/api/questions`)

### List Questions (With Filters & Pagination)
- **Method:** `GET`
- **Endpoint:** `/questions`
- **Authentication:** Public (None)
- **Query Parameters:**
  - `category` (optional): `DSA` | `SQL` | `APTITUDE` | `CORE`
  - `topic` (optional): e.g. `Arrays`, `Joins`, `DBMS`
  - `difficulty` (optional): `Easy` | `Medium` | `Hard`
  - `company` (optional): company slug (e.g. `google`, `amazon`)
  - `search` (optional): text search keyword
  - `page` (optional): page number (default: `1`)
  - `limit` (optional): items per page (default: `10`, max: `100`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "questions": [
      {
        "_id": "67cc4e89123456789abcdef1",
        "customId": "dsa-arr-1",
        "title": "Two Sum",
        "category": "DSA",
        "topic": "Arrays",
        "difficulty": "Easy",
        "statement": "Given an array of integers nums and an integer target, return indices of the two numbers...",
        "approach": "Use a hash map to look up complements in O(1) time.",
        "complexity": { "time": "O(N)", "space": "O(N)" },
        "code": { "cpp": "...", "python": "..." },
        "externalLinks": { "leetcode": "https://leetcode.com/problems/two-sum/", "gfg": "..." },
        "companySlugs": ["google", "amazon", "meta"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 125,
      "totalPages": 13
    }
  }
  ```

### Get Question by ID or Custom ID
- **Method:** `GET`
- **Endpoint:** `/questions/:id` (e.g. `/questions/dsa-arr-1` or `/questions/67cc4e89...`)
- **Authentication:** Public (None)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "question": {
      "_id": "67cc4e89123456789abcdef1",
      "customId": "dsa-arr-1",
      "title": "Two Sum",
      "category": "DSA",
      "topic": "Arrays",
      "difficulty": "Easy"
    }
  }
  ```

---

## 5. Company APIs (`/api/companies`)

### List All Companies
- **Method:** `GET`
- **Endpoint:** `/companies`
- **Authentication:** Public (None)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "companies": [
      {
        "_id": "67cc4e890000000000000001",
        "name": "Google",
        "slug": "google",
        "tier": "Tier-1 Product",
        "description": "FAANG giant with heavy focus on complex DSA, dynamic programming, and system scalability.",
        "totalQuestions": 15
      }
    ]
  }
  ```

### Get Company Details
- **Method:** `GET`
- **Endpoint:** `/companies/:companyId` (slug or ObjectId)
- **Authentication:** Public (None)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "company": {
      "_id": "67cc4e890000000000000001",
      "name": "Google",
      "slug": "google",
      "tier": "Tier-1 Product"
    }
  }
  ```

### Get Company Questions
- **Method:** `GET`
- **Endpoint:** `/companies/:companyId/questions`
- **Authentication:** Public (None)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "company": { "name": "Google", "slug": "google" },
    "questions": [ ... ],
    "pagination": { "page": 1, "limit": 50, "total": 15, "totalPages": 1 }
  }
  ```

---

## 6. Progress Tracking APIs (`/api/progress`)

### Mark Question Solved / Unsolved
- **Method:** `PUT`
- **Endpoint:** `/progress/:questionId`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "solved": true
  }
  ```
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Question marked as solved",
    "progress": {
      "questionId": "dsa-arr-1",
      "solved": true,
      "solvedAt": "2026-09-08T09:15:00.000Z"
    }
  }
  ```

### Get User Full Progress List
- **Method:** `GET`
- **Endpoint:** `/progress`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "progress": [
      {
        "_id": "...",
        "customId": "dsa-arr-1",
        "solved": true,
        "solvedAt": "2026-09-08T09:15:00.000Z",
        "question": {
          "title": "Two Sum",
          "category": "DSA",
          "difficulty": "Easy"
        }
      }
    ]
  }
  ```

### Get Progress Summary
- **Method:** `GET`
- **Endpoint:** `/progress/summary`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "summary": {
      "totalSolved": 12,
      "totalQuestions": 125,
      "overallPercentage": 10,
      "dsaSolved": 8,
      "sqlSolved": 3,
      "aptitudeSolved": 1,
      "coreSolved": 0,
      "categoryBreakdown": {
        "dsa": { "solved": 8, "total": 68, "percentage": 12 },
        "sql": { "solved": 3, "total": 34, "percentage": 9 },
        "aptitude": { "solved": 1, "total": 10, "percentage": 10 },
        "core": { "solved": 0, "total": 13, "percentage": 0 }
      }
    }
  }
  ```

### Get User Streak
- **Method:** `GET`
- **Endpoint:** `/progress/streak`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "streak": {
      "current": 3,
      "longest": 7,
      "todayActive": true
    }
  }
  ```

### Get Recent Daily Activity
- **Method:** `GET`
- **Endpoint:** `/progress/activity?days=30`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "activity": [
      { "date": "2026-09-08", "questionsSolved": 2 },
      { "date": "2026-09-07", "questionsSolved": 1 }
    ]
  }
  ```

---

## 7. Analytics APIs (`/api/analytics`)

### Get Dashboard Overview Analytics
- **Method:** `GET`
- **Endpoint:** `/analytics/overview`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "overview": {
      "totalQuestions": 125,
      "totalSolved": 12,
      "overallPercentage": 9.6,
      "currentStreak": 3,
      "longestStreak": 7,
      "todaySolved": 2,
      "thisWeekSolved": 8,
      "thisMonthSolved": 12
    }
  }
  ```

### Get Category Breakdown Analytics
- **Method:** `GET`
- **Endpoint:** `/analytics/category`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
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

### Get Topic Analytics
- **Method:** `GET`
- **Endpoint:** `/analytics/topic`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 18,
    "topics": [
      { "topic": "Arrays", "total": 15, "solved": 4, "unsolved": 11, "percentage": 26.67 },
      { "topic": "Strings", "total": 12, "solved": 2, "unsolved": 10, "percentage": 16.67 }
    ]
  }
  ```

### Get Difficulty Analytics
- **Method:** `GET`
- **Endpoint:** `/analytics/difficulty`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
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

### Get Continuous Activity Analytics Timeline
- **Method:** `GET`
- **Endpoint:** `/analytics/activity?days=7`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "days": 7,
    "activity": [
      { "date": "2026-09-02", "questionsSolved": 0 },
      { "date": "2026-09-03", "questionsSolved": 1 },
      { "date": "2026-09-04", "questionsSolved": 0 },
      { "date": "2026-09-05", "questionsSolved": 0 },
      { "date": "2026-09-06", "questionsSolved": 3 },
      { "date": "2026-09-07", "questionsSolved": 2 },
      { "date": "2026-09-08", "questionsSolved": 2 }
    ]
  }
  ```

### Get Company Analytics
- **Method:** `GET`
- **Endpoint:** `/analytics/company`
- **Authentication:** Required (`Bearer <token>`)
- **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 6,
    "companies": [
      { "company": "Amazon", "slug": "amazon", "total": 28, "solved": 5, "unsolved": 23, "percentage": 17.86 },
      { "company": "Google", "slug": "google", "total": 24, "solved": 3, "unsolved": 21, "percentage": 12.5 }
    ]
  }
  ```
