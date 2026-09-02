import { type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { usersTable, verificationCodesTable } from '../../db/schema.js';
import { sendResponse, sendError } from '../../utils/responses.utils.js';

export const deleteAccountController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, 401, 'Unauthorized request', 'UNAUTHORIZED');
    }

    // 1. Verify user exists
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return sendError(res, 404, 'User account not found', 'USER_NOT_FOUND');
    }

    // 2. Delete associated records first (e.g., OTP codes) to respect foreign key constraints
    await db
      .delete(verificationCodesTable)
      .where(eq(verificationCodesTable.userId, userId));

    // 3. Delete the user account
    await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId));

    return sendResponse(res, 200, 'Account deleted successfully', null);
  } catch (error) {
    console.error('Delete account error:', error);
    return sendError(res, 500, 'Internal server error', 'SERVER_ERROR');
  }
};