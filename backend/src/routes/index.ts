import express from 'express';
import authRoutes from './auth.routes';
import conversionRoutes from './conversion.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/conversions', conversionRoutes);

export default router;