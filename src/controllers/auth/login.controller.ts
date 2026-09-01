import { type Request, type Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index';
import { usersTable } from '../../db/schema';
import { type LoginInput } from '../../validators/auth.validator';
import { sendResponse, sendError } from '../../utils/responses.utils';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

export const loginController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return sendError(res, 401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user.id);

    return sendResponse(res, 200, 'Login successful', {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Internal server error', 'SERVER_ERROR');
  }
};