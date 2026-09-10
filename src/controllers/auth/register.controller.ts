import { type Request, type Response } from 'express';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index';
import 'dotenv/config';
import { usersTable, verificationCodesTable } from '../../db/schema';
import { registerSchema, type RegisterInput } from '../../validators/auth.validator';
import { sendResponse, sendError } from '../../utils/responses.utils';
import { OTP } from '../../utils/default';
import { sendVerificationEmail } from '../../utils/auth-emails';

const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerController = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  try {
    // req.body is now strictly typed as RegisterInput
    const { email, password, firstName, lastName } = registerSchema.parse(req.body);

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser) {
      return sendError(res, 400, 'Email is already in use.', 'EMAIL_EXISTS');
    }

    const hashedPassword = await argon2.hash(password);

    const [newUser] = await db
      .insert(usersTable)
      .values({ email, password: hashedPassword, firstName, lastName })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        createdAt: usersTable.createdAt,
      });

    if(!newUser) {
      return sendError(res, 500, 'Failed to create user.', 'USER_CREATION_FAILED');
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP.OTP_DURATION); // Set expiration time for the OTP

    await db.insert(verificationCodesTable).values({
      userId: newUser.id,
      code: otpCode,
      type: 'EMAIL_VERIFICATION',
      expiresAt,
    });

    await sendVerificationEmail(newUser.email, otpCode);

    return sendResponse(res, 201, 'User registered successfully. Please verify your email.', {
      user: newUser,
      debugOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return sendError(res, 500, 'Internal server error', 'SERVER_ERROR');
  }
};