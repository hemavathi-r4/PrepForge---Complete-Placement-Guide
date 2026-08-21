# PrepForge — Placement Preparation Platform

PrepForge is a comprehensive web application for placement preparation, featuring DSA sheets, SQL challenges, CS fundamentals, company-wise problem sets, and mock assessments.

---

## Project Structure

PrepForge currently contains:

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Routing:** React Router DOM v7

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ORM

```
PrepForge/
├── frontend code (root & src/)
├── backend/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # Controller handlers (healthController.js)
│   ├── middleware/      # Global middleware (errorMiddleware.js)
│   ├── models/          # Mongoose schema models
│   ├── routes/          # API route definitions (healthRoutes.js)
│   ├── services/        # Business logic services
│   ├── utils/           # Helper utility functions
│   ├── .env             # Local environment variables
│   ├── .env.example     # Environment variable template
│   ├── app.js           # Express app instance setup & middleware
│   ├── server.js        # Backend entrypoint (DB connection & HTTP listener)
│   └── package.json     # Node.js dependencies & scripts
└── README.md
```

---

## How to Run the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your connection details:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `PORT`: Port number for the Express server (default: `5000`)
   - `MONGO_URI`: MongoDB connection URI (e.g., `mongodb://127.0.0.1:27017/prepforge` or MongoDB Atlas URI)
   - `CLIENT_ORIGIN`: Allowed frontend origin for CORS (default: `http://localhost:5173`)
   - `NODE_ENV`: Environment mode (`development` or `production`)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Health Check Endpoint

- **Endpoint:** `GET http://localhost:5000/api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "PrepForge API is running"
  }
  ```

---

## How to Run the Frontend

1. From the project root directory:
   ```bash
   npm install
   npm run dev
   ```
