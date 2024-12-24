import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import helmet from 'helmet';
import dotenv from 'dotenv';

import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/errors';

// Load environment variables
// throws error if .env file is not found
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Create Express application
// initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware
// use helmet, cors, express.json and express.urlencoded middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
// use routes from ./routes
app.use('/api', routes);

// Health check
// health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler as any);

// Handle unhandled routes
// handle 404 error
app.use('*', (req, _res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// start server on port 5000 or the port specified in .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
