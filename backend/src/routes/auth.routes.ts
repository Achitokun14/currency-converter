// src/routes/auth.routes.ts
import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/errors';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

/**
 * @route POST /api/auth/register
 * @group Auth - Operations about user authentication
 * @summary Register a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await User.create(validatedData);
    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/login
 * @group Auth - Operations about user authentication
 * @summary Login an existing user
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Get user with password (password is not selected by default)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Remove password from response
    user.password = '';

    res.json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
