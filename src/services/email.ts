import Nodemailer from 'nodemailer';
import { OTP } from '../utils/default';

export const sendMail = async ({
  recipientEmail,
  subject,
  text,
  html,
}: {
  recipientEmail: string[];
  subject: string;
  text?: string;
  html?: string;
  category?: string;
}) => {
  try {
    // 1. Create a test account (or you can cache this if you want a static test inbox)
    const testAccount = await Nodemailer.createTestAccount();

    const transporter = Nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 2. Send the mail
    const info = await transporter.sendMail({
      from: '"Mobile Auth API" <no-reply@auth.local>',
      to: recipientEmail.join(', '),
      subject,
      text,
      html,
    });

    console.log('--------------------------------------------------');
    console.log(`[Email Service] OTP Email sent successfully to: ${recipientEmail.join(', ')}`);
    // This gives you the direct URL to click and view the email in your browser!
    console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    throw new Error('EMAIL_SEND_FAILED');
  }
};