import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
// import { AppError } from '../utils/errors';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

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

// Login route
// router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const validatedData = loginSchema.parse(req.body);

//     const user = await User.findOne({ email: validatedData.email });
//     if (!user) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Invalid credentials',
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(validatedData.password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Invalid credentials',
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET!,
//       { expiresIn: '1d' }
//     );

//     return res.status(200).json({
//       status: 'success',
//       token,
//       data: {
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name,
//         },
//       },
//     });
//   } catch (error) {
//     next(error); // Pass error to the error-handling middleware
//   }
// });

export default router;