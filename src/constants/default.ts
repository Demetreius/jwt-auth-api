// Define allowed OTP types as a constant array
export const OTP_TYPES = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const;

// Create a TypeScript type from it for strict typing
export type OtpType = typeof OTP_TYPES[number];