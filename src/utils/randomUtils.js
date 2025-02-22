import { randomInt } from "crypto";
import crypto from "crypto";
/**
 * Generates a secure random OTP of n digits
 * @param {number} n - Number of digits in OTP
 * @returns {string} - Generated OTP
 */
export const generateSecureOTP = (n) =>{
  const min = 10 ** (n - 1);
  const max = 10 ** n - 1;
  return randomInt(min, max).toString();
}

// It includes small english letter also
export const getOTP = (length = 8) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"; // Allowed characters
  const bytes = crypto.randomBytes(length); // Generate secure random bytes
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += characters[bytes[i] % characters.length]; // Map random bytes to allowed characters
  }

  return otp;
};
