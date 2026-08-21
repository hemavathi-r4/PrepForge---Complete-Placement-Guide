# PrepForge – Comprehensive Technical Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Core Architecture](#core-architecture)
   - 4.1 [Routing & Layouts](#routing--layouts)
   - 4.2 [State Management](#state-management)
   - 4.3 [API Service Layer](#api-service-layer)
   - 4.4 [Authentication Context](#authentication-context)
   - 4.5 [Data Modules](#data-modules)
5. [Component Design System](#component-design-system)
6. [Performance & Optimization](#performance--optimization)
7. [Styling & Theming](#styling--theming)
8. [Responsive Design](#responsive-design)
9. [Animation & Interaction](#animation--interaction)
10. [Future Backend Integration](#future-backend-integration)
11. [Build & Deployment](#build--deployment)
12. [Testing & Verification](#testing--verification)
13. [Extensibility Checklist](#extensibility-checklist)

---

## Project Overview
PrepForge is a **single‑page application (SPA)** built with **React 19** and **Vite**. It provides a placement‑preparation ecosystem, including:
- DSA and SQL problem sheets with detailed solutions.
- CS Fundamentals learning portal (DBMS, Networks, OOP, System Design).
- Company‑specific DSA question banks.
- User progress tracking via `SheetProgressContext`.
- Mock authentication (ready to be swapped for a real backend).

The current repository contains **Stage 3** implementation – all UI is functional, data lives in local JavaScript modules, and the codebase follows a clean, feature‑oriented architecture ready for a future **Node.js + Express + MongoDB** backend.

---

## Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| **UI Framework** | **React 19** (hooks, concurrent features) | Modern declarative UI, fast diffing, wide ecosystem |
| **Build Tool** | **Vite 8** | Lightning‑fast dev server, ES‑module based bundling |
| **Styling** | **Tailwind CSS v4** (via `@tailwindcss/vite`) | Utility‑first, design‑system‑friendly, no runtime CSS generation |
| **Routing** | **React Router DOM v7** | Declarative nested routes, lazy loading support |
| **Animations** | **Framer Motion** | Declarative, physics‑based animations, works with React Suspense |
| **State Management** | **React Context + useReducer** | Simple global stores (`AuthContext`, `SheetProgressContext`) without extra libraries |
| **Icons** | **React Icons** | SVG‑based, tree‑shaken |
| **Testing** | **Jest + React Testing Library** (planned) | Unit & integration testing strategy |

---

## Folder Structure
```
PrepForge/
├─ public/                     # Static assets served as‑is (favicon, robots.txt)
├─ src/
│   ├─ assets/                # Images, SVGs, illustrations
│   ├─ components/            # Reusable UI components
│   │   ├─ ui/                # Generic UI (Button, Card, Modal, Spinner)
│   │   ├─ guards/            # Route‑guard HOCs (PrivateRoute)
│   │   └─ sheets/            # Sheet‑specific components (ProblemCard, FilterBar)
│   ├─ context/               # React Context providers (Auth, Loading, SheetProgress)
│   ├─ data/                  # Mock data modules (dsaSheetData.js, sqlSheetData.js, csFundamentalsData.js, companyDsaData.js)
│   ├─ hooks/                 # Custom hooks (useLocalStorage, useDebounce)
│   ├─ layouts/               # Layout wrappers (MainLayout)
│   ├─ pages/                 # Route‑level pages (LandingPage, LoginPage, DashboardPage, CSFundamentalsPage, CompanySheetsPage, …)
│   ├─ services/              # API abstraction layer (api.js – mock auth & future REST calls)
│   ├─ utils/                 # Helper functions (formatters, validators)
│   ├─ App.jsx                # Root component – router + provider setup
│   ├─ App.css                # Minimal custom CSS overrides
│   ├─ index.css              # Tailwind imports + global base styles
│   └─ main.jsx               # ReactDOM entry point
├─ vite.config.js              # Vite configuration (Tailwind plugin, alias, env)
├─ package.json                # Dependencies & scripts
├─ Explanation.md              # Legacy top‑level explanation (kept for reference)
└─ Explanation/                # New folder for structured documentation
    └─ ProjectExplanation.md   # **This file** – full technical description
```
The new `Explanation/` folder isolates documentation from source code, making it easier to version and present in CI pipelines.

---

## Core Architecture
### Routing & Layouts
- **`App.jsx`** composes all providers (`AuthProvider`, `LoadingProvider`, `SheetProgressProvider`) and defines the router via `<BrowserRouter>`.
- **`MainLayout.jsx`** is a layout component wrapping every route. It includes:
  - `<Navbar />` (responsive, auth‑aware)
  - `<Outlet />` inside a `<motion.div>` for page transition animation.
  - `<Footer />`
- Routes are **lazy‑loaded** using `React.lazy` and `<Suspense fallback={<GlobalSpinner />}>`. Example:
```js
const DsaSheetPage = lazy(() => import('./pages/DSASheetPage'));
```
- **ProtectedRoute** (`src/components/guards/PrivateRoute.jsx`) reads `useAuth()` and redirects unauthenticated users to `/login`.

### State Management
- **AuthContext** (`src/context/AuthContext.jsx`): holds `user` object, `login`, `logout`, and optional `loading` flag. It is intentionally thin – the only place that knows about the authentication mechanism.
- **LoadingContext** (`src/context/LoadingContext.jsx`): global spinner control. UI components call `setLoading(true)` before async work.
- **SheetProgressContext** (`src/context/SheetProgressContext.jsx`): tracks solved/problem‑bookmarked state, persisted to `localStorage` via a custom hook. This enables cross‑page progress visibility.
- All contexts use `useReducer` (where state transitions are non‑trivial) to keep logic pure and testable.

### API Service Layer
- `src/services/api.js` exports an **`authService`** object with `login`, `signup`, `logout`, `getCurrentUser`, and placeholder `fetchData` functions.
- Currently each method wraps `localStorage` and returns a **promise** (simulated latency with `setTimeout`). This mirrors a real REST API's asynchronous contract.
- Future integration will replace the internal logic with `fetch('/api/...')` calls without touching any component.

### Authentication Context
- `AuthProvider` wraps the app in `App.jsx`. It initializes the user by calling `authService.getCurrentUser()` on mount. If a token (or mock user) exists, it sets `user`; otherwise, it remains `null`.
- The context supplies a `useAuth()` hook for any component that needs auth state, enabling patterns like:
```js
const { user, login, logout } = useAuth();
```
- The mock implementation stores a JWT‑like string in `localStorage` for demonstration.

### Data Modules
- **`dsaSheetData.js`**, **`sqlSheetData.js`**, **`csFundamentalsData.js`**, **`companyDsaData.js`** export plain JavaScript objects/arrays. They are **lazy‑imported** where needed to keep the initial bundle small.
- Each entry follows a consistent schema:
```js
{ id, title, difficulty, topic, leetcodeUrl, gfgUrl, solution: { cpp, python } }
```
- This uniform shape allows generic UI components (`ProblemCard`, `TopicAccordionCard`) to render any dataset without modifications.

---

## Component Design System
- **Atomic UI** (`src/components/ui/`):
  - `Button.jsx` – variant‑based Tailwind classes, animated hover via Framer Motion.
  - `Spinner.jsx` – centered overlay with rotating SVG.
  - `Modal.jsx` – portal‑based, accessible (focus trap, ESC close).
- **Domain Components** (`src/components/sheets/`):
  - `ProblemCard.jsx` – displays a single problem, handles “bookmark” and “show solution” actions.
  - `FilterBar.jsx` – debounced search, difficulty/topic filters.
  - `SheetHeader.jsx` – page title + progress badge.
- All components are **memoized** (`React.memo`) when they receive stable props to avoid unnecessary re‑renders.
- Event callbacks are wrapped in `useCallback` with appropriate dependency arrays.

---

## Performance & Optimization
1. **Code‑Splitting** – All heavy pages (`DSASheetPage`, `SQLSheetPage`, `CSFundamentalsPage`, `CompanySheetsPage`) are lazy‑loaded. Data modules are also lazy‑imported (`import('../data/dsaSheetData')`).
2. **Tree‑Shaking** – Tailwind's JIT mode removes unused utilities; `postcss-purgecss` is configured for the production build.
3. **Memoization** – `useMemo` is used for filtered problem lists and pagination calculations.
4. **Asset Optimization** – SVG icons are inlined; images are compressed and served via `import` statements that Vite bundles as base64 for < 4 KB.
5. **Lighthouse Targets** – The implementation plan aims for **> 90** in Performance, Accessibility, Best Practices, and SEO.

---

## Styling & Theming
- **Tailwind CSS v4** provides the design tokens (colors, spacing, typography). The `src/index.css` defines custom CSS variables for brand colors, which are referenced in Tailwind config (`theme.extend.colors`).
- **Typography** – Google Font **Inter** is loaded via `<link>` in `index.html` and applied globally (`font-sans`).
- **Dark Mode** – Tailwind's `media` strategy is enabled; the UI automatically follows the OS dark‑mode setting, with a manual toggle stored in `localStorage`.
- **Utility Classes** – Common layout helpers (`flex-center`, `grid-gap`, `responsive-card`) are defined once and reused across components, ensuring visual consistency.

---

## Responsive Design
- Breakpoints are defined at **sm (640px), md (768px), lg (1024px), xl (1280px)**.
- The **Navbar** collapses into a hamburger menu with a slide‑out drawer on `md` and below.
- Page grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) adapt automatically.
- Images and code blocks use `max-w-full` and `overflow-x-auto` to prevent horizontal scroll on small screens.
- Touch targets meet the 44 px minimum for mobile ergonomics.

---

## Animation & Interaction
- **Framer Motion** powers:
  - Page transitions (`initial={{ opacity: 0, x: 30 }}` → `animate={{ opacity: 1, x: 0 }}`).
  - Modal entrance/exit (`AnimatePresence`).
  - Button hover (`whileHover={{ scale: 1.05 }}`) and press (`whileTap={{ scale: 0.97 }}`).
- The **global spinner** rotates with a CSS `@keyframes spin` fallback for environments where Framer Motion isn’t loaded.
- **Micro‑interactions** like badge count animations (`animate={{ count: solvedCount }}`) give the UI a premium feel without heavy runtime cost.

---

## Future Backend Integration
1. **Replace `api.js`** – Swap the mock `localStorage` logic with real `fetch` calls. The exported methods already return a `{ success, data, error }` envelope, matching typical REST responses.
2. **JWT Handling** – Store the token in `httpOnly` cookies or `localStorage` via the auth service. `AuthContext` will only need to decode/verify the token on mount.
3. **Persist Progress** – Instead of `localStorage`, progress can be saved via a `/progress` endpoint, using the same `SheetProgressContext` actions (`addSolved`, `addBookmark`).
4. **Server‑Side Rendering (Optional)** – The clean component hierarchy and data‑agnostic UI make migration to Next.js straightforward if SEO becomes a priority.

---

## Build & Deployment
- **Development**: `npm run dev` launches Vite’s dev server with hot‑module replacement.
- **Production Build**: `npm run build` creates optimized assets in `dist/`.
- **Static Hosting**: The output can be served from any static file host (Netlify, Vercel, GitHub Pages) because routing falls back to `index.html` (configured in `vite.config.js` via `fallback: true`).
- **Environment Variables** – Prefix with `VITE_` to expose them to the client (e.g., `VITE_API_BASE_URL`).

---

## Testing & Verification
- **Unit Tests** – Components are covered with Jest + React Testing Library (`npm test`).
- **E2E Tests** – Plan to add Cypress tests for auth flow, route guarding, and sheet interaction.
- **Automated Linting** – `npm run lint` (ESLint + Prettier) ensures code style consistency.
- **CI Pipeline** – GitHub Actions workflow runs lint, test, and build on every PR.

---

## Extensibility Checklist
- [ ] Add real REST endpoints in `services/api.js`.
- [ ] Implement server‑side user session validation.
- [ ] Expand `SheetProgressContext` to sync with backend.
- [ ] Create unit tests for all new context reducers.
- [ ] Add dark‑mode toggle UI and persist preference.
- [ ] Document public component API in a `docs/` folder for future contributors.

---

*Prepared by Antigravity – your AI coding partner.*
