import { Router } from 'express';
import { registerController } from '../controllers/auth/register.controller.js';
import { loginController } from '../controllers/auth/login.controller.js';
import { verifyOtpController } from '../controllers/auth/verify-otp.controller';
import { 
  validate, 
  registerSchema, 
  loginSchema, 
  verifyOtpSchema, 
  requestPasswordResetSchema
} from '../validators/auth.validator.js';
import { resetPasswordRequestController } from '../controllers/auth/forget-password-request.controller.js';

const router: Router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), registerController);

// POST /api/auth/login
router.post('/login', validate(loginSchema), loginController);

// POST /api/auth/verify-otp
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtpController);

// POST /api/auth/request-pasword-reset
router.post('/request-password-reset', validate(requestPasswordResetSchema), resetPasswordRequestController);

export default router;