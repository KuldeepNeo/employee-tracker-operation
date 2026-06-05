import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import employeeRouter from './routes/employee.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Security Headers hardening
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin
}));

// Body parser
app.use(express.json());

// Routes configuration
app.use('/employee', employeeRouter);

// Undefined Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Centralized error middleware
app.use(errorMiddleware);

export default app;
