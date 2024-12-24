import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import { AppError } from '../utils/errors';

// Validate JWT_SECRET environment variable. Throw error if not set.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

// Augment the Express Request type to include the user. This allows us to
// access the user object in other parts of the application after the user
// has been authenticated.
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

// Configure Passport JWT strategy. This strategy verifies JWTs and retrieves
// the user from the database based on the ID in the payload.  The secretOrKey
// is used to verify the signature of the JWT.
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

// Authentication middleware: verifies JWT and attaches user to request.  If
// authentication fails, an AppError is thrown with a 401 status code.  This
// middleware is used to protect routes that require authentication.
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

// Optional authentication middleware: verifies JWT but doesn't require it. If
// a valid JWT is present, the user is attached to the request.  If not, the
// request proceeds without a user object.
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (_err: Error, user: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
