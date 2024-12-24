/**
 * @file This file defines the main router for the application.
 * It uses express.Router to mount other routers.
 */
import express from 'express';
import authRoutes from './auth.routes';
import conversionRoutes from './conversion.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/conversions', conversionRoutes);

export default router;
