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

## What's Next (Stage 2 Preview)

Stage 2 will build the actual dashboard features:
- ✅ Coding module with curated question sets
- ✅ Aptitude practice with timer
- ✅ User profile & progress tracking
- ✅ Mock test engine
- ✅ Navigation between modules
- ✅ Connecting to real REST APIs (replace `src/services/api.js` mock implementations)
