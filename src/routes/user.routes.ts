import { Router } from 'express';
import { deleteAccountController } from '../controllers/user/delete-account.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Protected route: Deletes the currently logged-in user
router.delete('/me', authenticateToken, deleteAccountController);

export default router;