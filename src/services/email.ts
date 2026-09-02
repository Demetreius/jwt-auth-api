import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';


interface MailTransportOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailConfig {
  transportOptions: MailTransportOptions;
  origin: {
    address: string;
    name: string;
  } | string
}


const getMailConfig = async (): Promise<MailConfig> => {

  const token = process.env.MAILTRAP_API_TOKEN ?? process.env.API_TOKEN;
  const senderAddress = process.env.MAILTRAP_SENDER_EMAIL;
  const senderName = process.env.MAILTRAP_SENDER_NAME;

  if (!token || !senderAddress || !senderName) {
    throw new Error(
      'Mailtrap configuration is incomplete. Set MAILTRAP_API_TOKEN (or API_TOKEN), MAILTRAP_SENDER_EMAIL, and MAILTRAP_SENDER_NAME.'
    );
  }

  const testAccount = await Nodemailer.createTestAccount();

  return {
    transportOptions: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    },
    origin: {
      address: senderAddress,
      name: senderName,
    }
  }
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

  const { transportOptions, origin } = await getMailConfig();


  const transport = Nodemailer.createTransport(transportOptions);

  await transport.sendMail({
    from: origin,
    to: recipientEmail,
    subject,
    text,
    html,
  });
} 