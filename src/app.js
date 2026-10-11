import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import globalErrorHandeler from './middleware/globalErrorHandeler.js';
import notFound from './middleware/notFound.js';
import router from './app/routes/index.js';
import envVars from './config/env.js';

const app = express();

// Parsers & Security Middlewares
const allowedOrigins = [
  envVars.corsOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is up and running smoothly! 🚀',
  });
});

// Main API Router
app.use('/api/v1', router);

// Error Middlewares
app.use(notFound);
app.use(globalErrorHandeler);

export default app;
