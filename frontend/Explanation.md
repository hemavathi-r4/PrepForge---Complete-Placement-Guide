# PrepForge — Stage 1 Explanation

## Overview

Stage 1 builds the **complete frontend skeleton** of PrepForge — a professional placement preparation web application. This stage establishes all the foundational infrastructure: project setup, routing, layouts, components, pages, and a mock service layer that is designed to be seamlessly replaced by real REST APIs in future stages.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + Vite** | UI framework and fast development build tool |
| **Tailwind CSS v4** | Utility-first CSS, integrated natively via `@tailwindcss/vite` |
| **React Router DOM v7** | Client-side routing for SPA navigation |
| **React Icons** | Icon library (Font Awesome, Heroicons, etc.) |
| **Framer Motion** | Animations — page transitions, entrance effects, hover states |

---

## Project Structure

```
PrepForge/frontend/
├── public/
├── src/
│   ├── assets/            # Static images, SVGs, etc.
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx     # Top navigation bar (responsive, auth-aware)
│   │   └── Footer.jsx     # Site footer with links and branding
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx  # Global auth state (login, signup, logout, user)
│   │   └── SheetProgressContext.jsx # Global progress & bookmark tracker
│   ├── data/              # Local mock JSON-like data modules
│   │   ├── mockQuestions.js      # PrepForge module + mock test data
│   │   ├── aptitudeQuestions.js  # Aptitude question datasets
│   │   └── interviewQuestions.js # AI Mock Interview question sets & engine
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.js # Persist state to localStorage
│   ├── layouts/           # Page layout wrappers
│   │   └── MainLayout.jsx  # Navbar + animated <Outlet> + Footer
│   ├── pages/             # Route-level page components
│   │   ├── LandingPage.jsx  # Public landing page with hero + modules
│   │   ├── LoginPage.jsx    # Login form with mock authentication
│   │   ├── SignupPage.jsx   # Registration form with validation
│   │   ├── DashboardPage.jsx # Protected dashboard with stats & modules
│   │   ├── DSASheetPage.jsx # DSA roadmap
│   │   ├── SQLSheetPage.jsx # SQL roadmap
│   │   ├── CSFundamentalsPage.jsx # CS subjects roadmap
│   │   ├── CompanySheetsPage.jsx # Company-wise DSA sheets
│   │   ├── AptitudePage.jsx # Aptitude & Reasoning practice portal
│   │   └── AIMockInterviewPage.jsx # Protected AI Mock Interview portal
│   ├── services/          # API abstraction layer
│   │   └── api.js         # Mock auth service
│   ├── utils/             # Helper/utility functions
│   │   └── formatters.js  # Date formatting, text helpers
│   ├── App.jsx            # Root component, router + provider setup
│   ├── App.css            # App-level custom styles
│   ├── index.css          # Tailwind import + global base styles
│   └── main.jsx           # React DOM entry point
├── vite.config.js         # Vite config with Tailwind CSS v4 plugin
├── package.json
└── Explanation.md
```

---

## Architecture Decisions

### 1. Folder Structure by Feature Area
The `src/` folder is organized into clearly separated concerns: `pages/` for route-level views, `components/` for shared UI, `layouts/` for structural wrappers, `context/` for global state, `services/` for API calls, `hooks/` for reusable logic, `data/` for mock data, and `utils/` for helper functions.

### 2. Mock API Service Layer (`src/services/api.js`)
All data fetching and authentication logic flows through `services/api.js`. Currently it uses `localStorage` to persist users, simulating real network calls using artificial delays (`setTimeout`). 

### 3. AuthContext — Global Auth State
`AuthContext.jsx` wraps the entire app (via `AuthProvider` in `App.jsx`) and exposes `user`, `isAuthenticated`, `login()`, `signup()`, `logout()`, `error`, `clearError()`, `forgotPassword()`, and `loading` to all components via the `useAuth()` hook.

### 4. Protected Routes
The `ProtectedRoute` wrapper in `App.jsx` guards `/dashboard` and `/ai-interview`. If a user is not authenticated, they are redirected to `/login`.

---

# Stage 4 — Aptitude Preparation & AI Mock Interview Extensions

## Overview

Stage 4 extends PrepForge with two major placement preparation tracks:
1. **Aptitude Preparation (`/aptitude`)**: Covers Quantitative Aptitude, Logical Reasoning, and Verbal Ability with structured topic breakdowns, question banks, progress tracking, and step-by-step mathematical/logical explanations.
2. **AI Mock Interview (`/ai-interview`)**: Protected real-time mock interview simulator supporting Technical, HR/Behavioral, and Full Mock interview rounds with live timers, candidate response logging, automated score evaluation, strengths/weaknesses breakdown, and AI feedback reports.

---

## Component & Data Architecture

### 1. Aptitude Data Engine (`aptitudeQuestions.js` & `AptitudePage.jsx`)
- **Categories**:
  - **Quantitative Aptitude**: Percentages, Profit & Loss, Ratio & Proportion, Averages, Time & Work, Time, Speed & Distance, Simple & Compound Interest, Permutation & Combination, Probability.
  - **Logical Reasoning**: Number Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms, Seating Arrangement, Logical Puzzles.
  - **Verbal Ability**: Reading Comprehension, Sentence Correction, Para Jumbles, Vocabulary, Grammar.
- **Interactive Practice Interface**:
  - Category Overview Cards displaying total question count, topics count, progress percentage bars, and "Practice Now" buttons.
  - Multiple-Choice Question card with question progress counter (`Question X of Y`), difficulty badges, and option selectors.
  - Instant submission feedback (✓ Correct / ✗ Incorrect) and step-by-step mathematical derivation cards.

### 2. AI Mock Interview Engine (`interviewQuestions.js` & `AIMockInterviewPage.jsx`)
- **Protected Access**: Enforced via `<ProtectedRoute>` requiring login.
- **Modes**:
  - **Technical Interview (~20 mins)**: DSA, OOP, DBMS, OS, Computer Networks.
  - **HR / Behavioral Interview (~15 mins)**: Self introduction, teamwork, conflict resolution, leadership, career goals.
  - **Full Mock Interview (~30 mins)**: Technical + HR combined.
- **Workflow State Engine**:
  - `landing`: Mode Selection cards with target badges and topics.
  - `setup`: Modal configuration for Target Role, Experience Level, Difficulty, and Question count.
  - `interview`: Live interview screen featuring AI Interviewer avatar with speech bubbles, live countdown timer, and answer textareas.
  - `report`: Post-interview report card displaying overall score, sub-scores (Technical Knowledge, Communication, Clarity, Confidence), key strengths, improvement areas, and AI performance summary.

### 3. Extended Progress Tracking (`SheetProgressContext.jsx`)
- Persists `solvedAptitudeIds` into `localStorage` (`prepforge_solved_aptitude_ids`).
- Persists `interviewHistory` records into `localStorage` (`prepforge_interview_history`).
- Exposes `getInterviewStats()` used by `DashboardPage.jsx` to render live interview completion counts, average scores, and top attempt metrics.

### 4. Routing & Navbar Integration
- Registered public route `/aptitude` and protected route `/ai-interview` in `App.jsx`.
- Navbar navigation menu updated for both desktop and mobile layouts.
- Updated `PREP_MODULES` paths in `mockQuestions.js` and landing page icons.
