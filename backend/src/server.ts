import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { corsMiddleware } from './middleware/cors.js';
import healthRouter from './routes/health.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/health', healthRouter);

// Import upload routes
import uploadRouter from './routes/upload.js';
app.use('/api/upload', uploadRouter);

// Import files routes
import filesRouter from './routes/files.js';
app.use('/api/files', filesRouter);

// Import projects routes
import projectsRouter from './routes/projects.js';
app.use('/api/projects', projectsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
