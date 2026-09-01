import { type Request, type Response } from 'express';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { usersTable, verificationCodesTable } from '../../db/schema.js';
import type { VerifyOtpInput } from '../../validators/auth.validator.js';
import { sendResponse, sendError } from '../../utils/responses.utils.js';
import { generateToken } from '../../utils/token.js'; // Assuming you have this helper

export const verifyOtpController = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response
) => {
  try {
    const { email, code, type } = req.body;

    // 1. Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return sendError(res, 404, 'User not found.', 'USER_NOT_FOUND');
    }

    // 2. Find valid unexpired OTP matching the user and type
    const [validOtp] = await db
      .select()
      .from(verificationCodesTable)
      .where(
        and(
          eq(verificationCodesTable.userId, user.id),
          eq(verificationCodesTable.code, code),
          eq(verificationCodesTable.type, type),
          gt(verificationCodesTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!validOtp) {
      return sendError(res, 400, 'Invalid or expired verification code.', 'INVALID_OTP');
    }

    let authToken: string | undefined = undefined;

    // 3. Handle action based on OTP type
    if (type === 'EMAIL_VERIFICATION') {
      await db
        .update(usersTable)
        .set({ isVerified: 'true', updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));

      // Optional UX bonus: Auto-generate JWT token so mobile user is logged in instantly
      authToken = generateToken(user.id);
    }

    // 4. Delete the used OTP code so it cannot be reused
    await db
      .delete(verificationCodesTable)
      .where(eq(verificationCodesTable.id, validOtp.id));

    return sendResponse(res, 200, 'Verification successful.', {
      verified: true,
      // If it was email verification, we pass the token back so the app can log them in
      ...(authToken && { token: authToken }),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return sendError(res, 500, 'Internal server error', 'SERVER_ERROR');
  }
};