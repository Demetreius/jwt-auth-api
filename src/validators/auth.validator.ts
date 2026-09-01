import { z } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';
import { OTP_TYPES } from '../constants/default.js';

// 1. Registration Schema
export const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// 2. Login Schema
export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// 3. Verify OTP Schema (using .refine for custom enum error handling)
export const verifyOtpSchema = z.object({
  email: z.email('Invalid email format'),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
  type: z.enum(OTP_TYPES).refine(
    (val) => OTP_TYPES.includes(val),
    { message: 'Invalid verification type' }
  ),
});

// 4. Resend OTP Schema
export const resendOtpSchema = z.object({
  email: z.email('Invalid email format'),
  type: z.enum(OTP_TYPES).refine(
    (val) => OTP_TYPES.includes(val),
    { message: 'Invalid verification type' }
  ),
});

// Generic validation middleware factory
export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and strip out unexpected fields
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  };
};