import crypto from 'node:crypto';

/**
 *  Helper to generate a random 6-digit OTP
 *  */
export const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const OTP = {
  OTP_DURATION_LABEL: '10 minutes',
  OTP_DURATION: 10 * 60 * 1000 // OTP validity duration in milliseconds (10 minutes)
};



export const generateVerificationToken = () => {

  const buffer = crypto.randomBytes(32);
  const hex = buffer.toString('hex');

  const blockSize = Math.ceil(hex.length / 4);
  const regex = new RegExp(`.{1,${blockSize}}`, 'g');

  return hex.match(regex)?.join('-') ?? "";
}

