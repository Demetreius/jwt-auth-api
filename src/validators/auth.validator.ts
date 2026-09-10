import { z } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';
import { sendError } from '../utils/responses.utils';

export const OTP_TYPES = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const;
export type OtpType = typeof OTP_TYPES[number];

export const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(2, 'First name must be at least 2 characters long').max(100, 'First name must be at most 100 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long').max(100, 'Last name must be at most 100 characters long'),
});

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
  email: z.email('Invalid email format'),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
  type: z.enum(OTP_TYPES),
});

export const requestPasswordForgotSchema = z.object({
  email: z.email().min(4, 'The email address is required')
})

// Infer TypeScript types from Zod schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RequestPasswordForgotInput = z.infer<typeof requestPasswordForgotSchema>;

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendError(
          res,
          400,
          'Validation failed',
          'VALIDATION_ERROR',
          error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        );
      }
      return sendError(res, 400, 'Invalid request payload', 'INVALID_PAYLOAD');
    }
  };
};