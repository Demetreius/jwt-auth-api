import { type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import type { RequestPasswordForgotInput } from "../../validators/auth.validator"
import { db } from '../../db';
import { usersTable, verificationCodesTable } from '../../db/schema';
import { sendError, sendResponse } from '../../utils/responses.utils';
import { generateOtpCode, OTP } from '../../utils/default';
import { sendVerificationEmail } from '../../utils/auth-emails';


export const forgetPasswordRequestController = async (request: Request<{}, {}, RequestPasswordForgotInput>, response: Response) => {

    try {
        const { email } = request.body;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (!user) {
            return sendError(response, 400, 'This user does not exist', 'INVALID_CREDENTIALS');
        }

        const otpCode = generateOtpCode();
        const expiresAt = new Date(Date.now() + OTP.OTP_DURATION);

        await db.insert(verificationCodesTable).values({
            userId: user.id,
            code: otpCode,
            type: 'PASSWORD_RESET',
            expiresAt
        });

        await sendVerificationEmail(user.email, otpCode);

        return sendResponse(response, 201, 'OTP code successfully sent', {
            email: user.email,
            debugOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return sendError(response, 500, 'Internal server error', 'SERVER_ERROR');
    }
}