import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const getMailtrapConfig = () => {
  const token = process.env.MAILTRAP_API_TOKEN ?? process.env.API_TOKEN;
  const senderAddress = process.env.MAILTRAP_SENDER_EMAIL;
  const senderName = process.env.MAILTRAP_SENDER_NAME;

  if (!token || !senderAddress || !senderName) {
    throw new Error(
      'Mailtrap configuration is incomplete. Set MAILTRAP_API_TOKEN (or API_TOKEN), MAILTRAP_SENDER_EMAIL, and MAILTRAP_SENDER_NAME.'
    );
  }

  return { token, senderAddress, senderName };
};

export const sendMail = async ( {
  recipientEmail,
  subject,
  text,
  html,
  category,
}: {
  recipientEmail: string[];
  subject: string;
  text?: string;
  html?: string;
  category?: string;
} ) => {

  const { token, senderAddress, senderName } = getMailtrapConfig();
  const transport = Nodemailer.createTransport(MailtrapTransport({ token }));

  await transport.sendMail({
    from: { address: senderAddress, name: senderName },
    to: recipientEmail,
    subject,
    text,
    html,
    category,
  });
} 