import { sendMail } from "../services/email";
import { OTP } from "./default";

export const sendVerificationEmail = async (
  recipientEmail: string,
  otpCode: string
): Promise<void> => {
  await sendMail({
    recipientEmail: [recipientEmail],
    subject: 'Verify your email address',
    text: `Your verification code is ${otpCode}. It expires in ${OTP.OTP_DURATION_LABEL}.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4f46e5; letter-spacing: 3px;">${otpCode}</h1>
        <p>It expires in ${OTP.OTP_DURATION_LABEL}.</p>
      </div>
    `,
    category: 'Email Verification',
  });
};
