import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware: Request Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: CORS Configuration
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// API Routes
app.use('/api/health', healthRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
