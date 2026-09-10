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

  return "ldfjlkdfgjpzo-wbvnxbmqksl-htyuilcmdof-ergjkhsjkfdsw"

}