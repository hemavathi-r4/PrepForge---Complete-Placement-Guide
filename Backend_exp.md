# PrepForge — Backend Stage 1 Explanation
## Backend Foundation Setup

### Overview

Backend Stage 1 establishes a clean, scalable, and production-ready foundation for the **PrepForge** backend application. The backend is created in a separate directory (`/backend`), keeping it strictly isolated from the existing React frontend.

No business logic, authentication, JWT tokens, user models, or frontend-backend integrations are included in this stage. The sole objective is setting up the core Express + MongoDB application architecture.

---

### Tech Stack & Core Libraries

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
├── frontend code (root & src/)
└── backend/
    ├── config/
    │   └── db.js               # Reusable MongoDB Mongoose connection
    ├── controllers/
    │   └── healthController.js # Handles request/response logic for health route
    ├── middleware/
    │   └── errorMiddleware.js  # 404 handler and global centralized error handling
    ├── models/                 # [Placeholder] Mongoose schema models
    ├── routes/
    │   └── healthRoutes.js     # Route endpoint definitions (/api/health)
    ├── services/               # [Placeholder] Reusable business logic layer
    ├── utils/                  # [Placeholder] Utility functions
    ├── .env                    # Secret environment variables (ignored by Git)
    ├── .env.example            # Shared environment variables template
    ├── .gitignore              # Git ignore rules for backend
    ├── app.js                  # Express app setup, CORS, JSON parser, middleware
    ├── server.js               # Entry point: env loading, DB connect & listener
    └── package.json            # Node.js manifest and scripts
```

#### The Architecture Pipeline

The backend architecture follows the standard enterprise Node.js separation of concerns:

$$\text{Request} \longrightarrow \text{Route} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Model} \longrightarrow \text{MongoDB}$$

In Stage 1, we implemented the infrastructure layers for this pattern:
- **`server.js`**: Pure bootstrap entrypoint (loads environment, connects database, starts HTTP listener).
- **`app.js`**: Application layer configuration (attaches middleware, CORS, routes, 404 fallback, global error handlers).
- **`config/db.js`**: Isolated database connector function.
- **`routes/` & `controllers/`**: Separated routing declarations and handler logic.

---

### Detailed Component Implementation

#### 1. Environment Configuration (`.env` & `.env.example`)
- Secrets and runtime variables are extracted into `.env` to prevent hardcoding sensitive credentials into the codebase.
- `.env` is listed in `.gitignore` to prevent committing secrets to version control.
- Variables defined:
  - `PORT`: HTTP server port (default `5000`).
  - `MONGO_URI`: Database connection string (`mongodb://127.0.0.1:27017/prepforge`).
  - `CLIENT_ORIGIN`: Approved origin for CORS (`http://localhost:5173`).
  - `NODE_ENV`: Environment mode (`development` or `production`).

#### 2. Database Connection (`config/db.js`)
- Uses `mongoose.connect(process.env.MONGO_URI)` wrapped in an `async/await` block.
- On success: Logs connection details (`conn.connection.host`).
- On failure: Logs error message and invokes `process.exit(1)` to fail gracefully rather than leaving an unhandled promise rejection.

#### 3. Express App & Middleware Configuration (`app.js`)
- **JSON Body Parsing**: `express.json()` and `express.urlencoded({ extended: true })`.
- **CORS Setup**: Configured dynamically using `process.env.CLIENT_ORIGIN` allowing cross-origin requests from the React dev server with `credentials: true`.
- **API Routing**: Registers `/api/health` router.
- **Error Pipeline**: Attaches 404 handler (`notFound`) followed by global error handler (`errorHandler`).

#### 4. Health Check Endpoint (`controllers/healthController.js` & `routes/healthRoutes.js`)
- Endpoint: `GET /api/health`
- Response:
  ```json
  {
    "success": true,
    "message": "PrepForge API is running"
  }
  ```

#### 5. Error Handling (`middleware/errorMiddleware.js`)
- **404 Route Not Found**: Catches requests to unmapped endpoints and forwards a 404 Error object to the centralized handler.
- **Centralized Error Handler**: Formats all application errors into a standard JSON response structure:
  ```json
  {
    "success": false,
    "message": "Route not found - /api/invalid-path"
  }
  ```
- Stack traces are conditionally included only in `development` mode and suppressed in `production`.

---

### How to Run & Verify Stage 1

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server in Development Mode:**
   ```bash
   npm run dev
   ```

3. **Test Health Endpoint:**
   - URL: `http://localhost:5000/api/health`
   - Expected Output:
     ```json
     {
       "success": true,
       "message": "PrepForge API is running"
     }
     ```

4. **Test 404 Error Handler:**
   - URL: `http://localhost:5000/api/nonexistent`
   - Expected Output:
     ```json
     {
       "success": false,
       "message": "Route not found - /api/nonexistent"
     }
     ```

---

### Key Takeaways for Future Stages

1. **Clean Frontend Boundary**: All frontend files remain 100% untouched and functional.
2. **Scalability**: New feature modules (Auth, User Profiles, DSA Questions, Analytics) can be added simply by adding models, services, controllers, and routes in their respective folders.
3. **Security**: Environment variables and CORS protection are pre-configured for seamless integration in future stages.
