import { type Request, type Response } from 'express';
import { eq, and, gt } from 'drizzle-orm';
import 'dotenv/config';
import type { VerifyPasswordResetInput } from '../../validators/auth.validator';
import { db } from '../../db';
import { usersTable, validityToken, verificationCodesTable } from '../../db/schema';
import { sendError } from '../../utils/responses.utils';
import { generateVerificationToken, OTP } from '../../utils/default';


export const verifyResetPasswordController = async (request: Request<{}, {}, VerifyPasswordResetInput>, response: Response) => {

    try {
        const { email, code, type } = request.body;
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (!user) {
            return sendError(response, 400, 'This user does not exist', 'INVALID_CREDENTIALS');
        }

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
            return sendError(response, 400, 'Invalid or expired verification code.', 'INVALID_OTP');
        }
        const token = generateVerificationToken();

        const [updatedUser] = await db
            .insert(validityToken)
            .values({
                token,
                codeId: validOtp.id,
                expiresAt: new Date(Date.now() + OTP.OTP_DURATION) // Token valid for 15 minutes
            })
            .returning({
                token: validityToken.token,
                expiresAt: validityToken.expiresAt
            });

        if (!updatedUser) {
            return sendError(response, 500, 'Failed to generate verification token.', 'TOKEN_GENERATION_FAILED');
        }

        return response.status(200).json({
            message: 'Verification successful. You can now reset your password.',
            data: {
                token: updatedUser.token,
                expiresAt: updatedUser.expiresAt
            }
        });



    } catch (error) {

    }
}