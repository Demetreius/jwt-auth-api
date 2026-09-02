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
    category: 'Email Verification',
  });
};
