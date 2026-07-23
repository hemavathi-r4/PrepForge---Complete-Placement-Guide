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
PrepForge/
├── public/
├── src/
│   ├── assets/            # Static images, SVGs, etc.
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx     # Top navigation bar (responsive, auth-aware)
│   │   └── Footer.jsx     # Site footer with links and branding
│   ├── context/           # React Context providers
│   │   └── AuthContext.jsx  # Global auth state (login, signup, logout, user)
│   ├── data/              # Local mock JSON-like data modules
│   │   └── mockQuestions.js # PrepForge module + mock test data
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.js # Persist state to localStorage
│   ├── layouts/           # Page layout wrappers
│   │   └── MainLayout.jsx  # Navbar + animated <Outlet> + Footer
│   ├── pages/             # Route-level page components
│   │   ├── LandingPage.jsx  # Public landing page with hero + modules
│   │   ├── LoginPage.jsx    # Login form with mock authentication
│   │   ├── SignupPage.jsx   # Registration form with validation
│   │   └── DashboardPage.jsx # Protected dashboard with "Coming Soon" banner
│   ├── services/          # API abstraction layer
│   │   └── api.js         # Mock auth service (login, signup, logout, getCurrentUser)
│   ├── utils/             # Helper/utility functions
│   │   └── formatters.js  # Date formatting, text helpers
│   ├── App.jsx            # Root component, router + provider setup
│   ├── App.css            # App-level custom styles (minimal)
│   ├── index.css          # Tailwind import + global base styles
│   └── main.jsx           # React DOM entry point
├── vite.config.js         # Vite config with Tailwind CSS v4 plugin
├── package.json
└── stage1_explanation.md  # ← This file
```

---

## Architecture Decisions

### 1. Folder Structure by Feature Area
The `src/` folder is organized into clearly separated concerns: `pages/` for route-level views, `components/` for shared UI, `layouts/` for structural wrappers, `context/` for global state, `services/` for API calls, `hooks/` for reusable logic, `data/` for mock data, and `utils/` for helper functions.

This makes the codebase immediately navigable and scalable for future stages.

### 2. Mock API Service Layer (`src/services/api.js`)
All data fetching and authentication logic flows through `services/api.js`. Currently it uses `localStorage` to persist users, simulating real network calls using artificial delays (`setTimeout`). 

**Future REST API integration requires only changing this file** — no UI component needs to change.

### 3. AuthContext — Global Auth State
`AuthContext.jsx` wraps the entire app (via `AuthProvider` in `App.jsx`) and exposes `user`, `login()`, `signup()`, `logout()`, and `loading` to all components via the `useAuth()` hook. This avoids prop-drilling auth state to deeply nested components.

### 4. Protected Routes
The `ProtectedRoute` wrapper in `App.jsx` guards `/dashboard`. If a user is not authenticated, they are redirected to `/login`. This pattern is backend-ready — when real JWT tokens are used, only the `getCurrentUser()` check in `AuthContext` needs to change.

### 5. Tailwind CSS v4 Integration
Tailwind v4 is loaded directly via the `@tailwindcss/vite` plugin in `vite.config.js`. Configuration is minimal — no `tailwind.config.js` needed. The global theme (indigo primary, white backgrounds, gray accents) is applied via Tailwind utility classes throughout all components.

### 6. Framer Motion Page Transitions
`MainLayout.jsx` wraps the `<Outlet />` (the active page) inside Framer Motion's `AnimatePresence` + `motion.div`. This gives every route transition a smooth fade-slide effect, making the app feel polished and premium.

---

## Pages Summary

### `/` — Landing Page
- **Hero section**: Headline, subtitle, CTA buttons (Get Started / Explore Curriculum), stats row (50K+ students, 95% placement rate, 180+ hiring partners)
- **Mock assessment visual**: A fake test card showing a simulated coding problem UI
- **Modules grid**: 6 PrepForge preparation areas rendered from `mockQuestions.js`
- **CTA section**: Full-width indigo banner with a call to register

### `/login` — Login Page
- Card layout with email/password fields and icon decorations
- Validation: requires both fields, shows error messages
- **"Autofill Demo Credentials"** button pre-registers and autofills a demo account for quick testing
- Redirects to `/dashboard` on success

### `/signup` — Signup Page
- Card layout with name, email, password, confirm password fields
- Validation: all fields required, passwords must match, minimum 6 characters
- Saves new user to `localStorage` via `authService.signup()`
- Redirects to `/dashboard` on success

### `/dashboard` — Dashboard Page *(Protected)*
- **"Coming Soon"** hero banner announcing Stage 2 features
- **Stats row**: 4 mock stat cards (problems solved, mock tests, score, days active)
- **Modules grid**: Same 6 modules with per-module progress bars
- **Mock tests list**: 3 sample assessments with status badges (Available / In Progress / Completed)
- All interactive items show a 🔒 "Locked" indicator for Stage 2 features

---

## Routing Configuration

```
/ (public)           → LandingPage
/login (public)      → LoginPage
/signup (public)     → SignupPage
/dashboard (protected) → DashboardPage  [requires login]
/* (any other path)  → Redirects to /
```

All routes are wrapped in `MainLayout`, which renders `Navbar` → animated page → `Footer`.

---

## Design System

| Token | Value |
|---|---|
| **Primary Color** | Indigo 600 (`#4f46e5`) |
| **Background** | White + Slate-50 |
| **Text** | Gray-900 (headings), Gray-500 (body), Gray-400 (muted) |
| **Cards** | White, `rounded-2xl`, `shadow-sm`, `border border-gray-100` |
| **Accents** | Amber (popular badges, streaks), Green (success), Red (errors) |
| **Typography** | System sans-serif stack via Tailwind defaults |
| **Spacing** | Generous padding, high whitespace — premium feel |

---

## What Stage 2 Builds

Stage 2 delivers the complete authentication system — rebuilt from scratch over Stage 1's skeleton.

---

---

# Stage 2 — Authentication System

## What This Stage Is About

Stage 2 is all about making authentication production-grade. Stage 1 had a basic login and signup card — functional, but simple. Stage 2 replaces those with a proper auth system that any real SaaS product would have: a service layer designed like a REST API, a richer context, protected and guest-only routing, and a completely redesigned UI.

The goal was to build it in a way where, when we eventually connect a real backend, we change zero UI code — only the internals of the service layer.

---

## The Service Layer — `api.js`

The biggest architectural change in Stage 2 is how `authService` is structured. Instead of each function accepting positional arguments like `login(email, password)`, every method now accepts a single **request object** — `login({ email, password, rememberMe })`. That's exactly how you'd call a real `fetch()` with a JSON body.

Every method also returns a **response envelope**: `{ success, data, error }`. So callers never deal with try/catch for expected failures like "wrong password" — they just check `res.success`. Unexpected exceptions are still caught at the context level.

This means when we plug in a real backend, we literally replace the `localStorage` logic inside each function with a `fetch()` call and return the JSON. The shape is already identical. Nothing else changes.

**Remember Me** was also added here. If the user checks "Remember Me", the session goes into `localStorage` and survives browser close. If not, it goes into `sessionStorage` — tab-only, auto-cleared when the tab closes. The session restore on app load checks `localStorage` first, then falls back to `sessionStorage`.

**Forgot Password** is a stub that always returns a success message regardless of whether the email exists — which is actually the correct security behaviour. You never want to confirm whether an email is registered or not, since that leaks account information.

---

## AuthContext

The context was upgraded to match the new service API. It now exposes `isAuthenticated` as a clean boolean derived from `user !== null` — so components don't have to write `user !== null` everywhere. There's also a `clearError()` function that form components call whenever the user starts typing, so stale error messages from a previous failed attempt don't linger on screen. `forgotPassword` was also promoted to the context so any component in the tree can trigger it.

The session restore on mount now calls `getSession()` instead of `getCurrentUser()`, which returns a proper `{ success, data }` envelope rather than throwing.

---

## ProtectedRoute and GuestRoute

In Stage 1, `ProtectedRoute` was just an inline function inside `App.jsx`. In Stage 2 it was extracted into its own file — `src/components/ProtectedRoute.jsx` — because it has real logic now: it reads from `AuthContext`, shows a full-screen spinner while the session is being restored, and passes `location.state.from` when redirecting to login, so after login the user is sent back to wherever they were originally trying to go.

We also added a `GuestRoute` inside `App.jsx` for the opposite case — if a logged-in user tries to navigate to `/login` or `/signup`, they're immediately redirected to `/dashboard`. No point letting them see the auth pages again.

---

## Login Page Redesign

The login page was completely rebuilt as a split-screen layout. The left panel is a rich indigo gradient panel — branding, a list of PrepForge features, and a testimonial card. It's purely decorative but it signals quality. The right panel is the clean form.

The form itself has a few meaningful upgrades:

- **Per-field inline validation** that only shows an error after the user has blurred that field (so it doesn't shout at you before you've finished typing). On submit, all fields are touched at once if there are errors.
- **Password visibility toggle** — the eye icon next to the password field toggles between `type="password"` and `type="text"`.
- **Remember Me** is a custom-styled checkbox (not a plain HTML checkbox) that toggles a boolean passed to `authService.login()`.
- **Forgot Password** is a link next to the password label that opens a modal. The modal collects an email, calls `authService.forgotPassword()`, and shows the response message. It's self-contained — opening and closing it doesn't affect the login form state at all.
- Animated error messages using `AnimatePresence` — errors fade in, and fade out when the user fixes the field.

---

## Signup Page Redesign

The signup page mirrors the login layout — same split-screen structure with a slightly different left panel (benefits checklist and stats instead of a testimonial).

The form adds two things beyond basic validation:

- **Password strength indicator** — a 3-segment bar that scores the password on length, uppercase, numbers, and special characters. It turns red (Weak), amber (Fair), or green (Strong) in real time as you type.
- **Confirm password match indicator** — as soon as you start typing in the confirm field, it shows "✓ Passwords match" or "✗ Passwords do not match" inline, without waiting for blur or submit.

Both password fields have independent visibility toggles.

---

## What Stays the Same

Everything from Stage 1 that wasn't auth-related was left untouched — the Navbar, Footer, MainLayout, LandingPage, DashboardPage, and all mock data. Stage 2 is purely a vertical slice through the auth system.

---

## Stage 3 Delivered Features

Stage 3 builds out the full placement preparation ecosystem: CS Fundamentals, Company-Wise DSA Sheets, expanded DSA & SQL sheets, and integrated progress tracking.

---

---

# Stage 3 — Placement Resource Ecosystem & Track Expansion (DSA, SQL, CS Fundamentals, Company Sheets)

## What This Stage Is About

Stage 3 transforms PrepForge into a complete, placement-ready learning ecosystem. It introduces:
1. **CS Fundamentals Portal (`/cs-fundamentals`)**: Comprehensive tracks for DBMS, Computer Networks, OOPs, and System Design with embedded GeeksforGeeks (GFG) references, concept rule summaries, interview Q&As, and architecture/code snippet readers.
2. **Company-Wise DSA Sheet Section (`/company-sheets`)**: Targeted question banks for top recruitment companies (Google, Amazon, Microsoft, Meta, TCS, Infosys, Wipro, Flipkart, Uber, Adobe, Apple, Goldman Sachs, Paytm) featuring difficulty filters, frequency metrics, embedded GFG & LeetCode links, and full C++/Python solution modals.
3. **Comprehensive DSA & SQL Sheets**: 13 DSA topics and 10 SQL topics with structured data schemas, LeetCode links, GFG links, complexity bounds, and DDL/DML queries.
4. **Interactive State Management**: Global tracking of solved problems and bookmarked questions via `SheetProgressContext`.

---

## Technical Architecture & Component Breakdown

### 1. CS Fundamentals Data & Portal Engine (`csFundamentalsData.js` & `CSFundamentalsPage.jsx`)
- **Data Structure**: `CS_FUNDAMENTALS_CATEGORIES` contains structured data objects for:
  - `dbms`: ER Modeling, Relational Schema, Normalization (1NF to BCNF), Indexing & B+ Trees, ACID Properties & Transactions, Concurrency Control, SQL vs NoSQL.
  - `cn`: OSI 7-Layer & TCP/IP 4-Layer models, Subnetting & IP Routing, TCP 3-Way Handshake vs UDP, HTTP/HTTPS, SSL/TLS, DNS Resolution.
  - `oops`: 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), Access Specifiers, Vtables & Dynamic Dispatch, SOLID Principles.
  - `system-design`: HLD (Load Balancers, Caching - Redis/Memcached, Database Sharding/Replication, Message Queues - Kafka, CAP Theorem) and LLD Design Patterns.
- **Embedded External References**: Every topic links directly to authoritative GeeksforGeeks tutorials via `gfgUrl` and category-level `gfgHubUrl`.
- **UI & Micro-Interactions**:
  - Filterable search bar querying across topic titles, summaries, and key concept rules.
  - Category selector tabs with Framer Motion animations.
  - Interactive Interview Q&A drawers and copy-to-clipboard code snippet boxes.

### 2. Company-Wise DSA Sheet Engine (`companyDsaData.js` & `CompanySheetsPage.jsx`)
- **Recruiter Question Datasets**: `COMPANY_DSA_LIST` covers top placement companies (Google, Amazon, Microsoft, Meta, TCS, Infosys, Wipro, Flipkart, Uber, Adobe, Apple, Goldman Sachs, Paytm).
- **Metadata**: Each question records title, topic tag, difficulty, frequency metric (e.g., "Asked 42+ times"), embedded `leetcodeUrl`, and embedded `gfgUrl`.
- **Solution Modal (`AnimatePresence`)**:
  - Displays problem statement, optimal approach breakdown, and exact time/space complexities.
  - Tabbed syntax-highlighted C++ and Python solution code editor with copy capability.

### 3. Integrated Progress Context (`SheetProgressContext.jsx`)
- Extends global app state to persist solved problems and bookmarked items into `localStorage`.
- Syncs seamlessly between DSA Sheets (`/dsa-sheet`), SQL Sheets (`/sql-sheet`), and Company-Wise DSA Sheets (`/company-sheets`).

### 4. Routing & Navigation Update
- **`Navbar.jsx`**: Updated top navigation header with desktop and mobile responsive links for **CS Fundamentals** and **Company Sheets**.
- **`App.jsx`**: Registered `/cs-fundamentals` and `/company-sheets` routes wrapped inside `MainLayout`.
- **`LandingPage.jsx` & `DashboardPage.jsx`**: Updated feature cards to provide quick navigation directly to the newly implemented tracks.

---

## Build & Production Verification

- **Vite Build Command**: `npm run build`
- **Modules Transformed**: 458 modules transformed with 0 errors.
- **Assets Bundled**: `index.html`, `index.css` (72.9 kB), `index.js` (573.7 kB).

