import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import { AppError } from '../utils/errors';

// Add validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Configure JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any) => {
    if (err) {
      return next(new AppError(401, 'Authentication failed'));
    }
    if (!user) {
      return next(new AppError(401, 'Please log in to access this resource'));
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Optional authentication middleware
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (_err: Error, user: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
