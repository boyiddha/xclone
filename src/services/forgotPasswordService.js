import { findUserByEmail } from "@/services/userService";
import { saveResetCode, updateUserPassword } from "@/repositories/userRepository";
import { PASSWORD_RESET_CODE_EXPIRATION } from "@/constants/security";
import { getExpirationTime } from "@/utils/expiresTimeUtils";
import { getOTP } from "@/utils/randomUtils";
import { generateEmailData } from "@/utils/emailTemplates";
import { sendEmail } from "@/utils/emailSender";
import { createHashPassword } from "@/helpers/passwordHelper";

export const sendResetCodeServie = async (email) => {
  try {
    // Reuse findUserByEmail function
    const userResult = await findUserByEmail(email);

    if (!userResult.success) {
      return { success: false, message:"User not found!", status: 404 };
    }

    const user = userResult.user;
    const resetCode = getOTP(8);// 8-character code
    const expiresAt = getExpirationTime(PASSWORD_RESET_CODE_EXPIRATION); // 1 hour expiration time

    await saveResetCode(email, resetCode, expiresAt);

     const emailData = generateEmailData("passwordResetVerification",email,{ userName:user.userName , resetCode });
    
     const emailSent = await sendEmail(emailData.to, emailData.subject, emailData.html);

    if (!emailSent) {
      return { success: false, message: " Failed to send email", status: 500 };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in forgotPasswordService:", error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
};


export const verifyResetCodeServie = async (email, code) => {
   // Reuse findUserByEmail function
   const res = await findUserByEmail(email);

  if (!res.user || !res.user.forgetPasswordCode || !res.user.forgetPasswordExpiresAt) {

    return { message: "Invalid reset code", status: 400 };
  }

  const isCodeExpired = new Date() > new Date(res.user.forgetPasswordExpiresAt);
  if (isCodeExpired) {
    return { message: "Reset code has expired", status: 400 };
  }

  if (res.user.forgetPasswordCode !== code) {
    return { message: "Code Didn't Match", status: 400 };
  }

  return { message: "Code verified successfully", status: 200 };
};

/**
 * Updates the user's password after verifying the email.
 * @param {string} email - The email of the user.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<{message: string, status: number}>} - The result of the operation.
 */
export const updatePasswordService = async (email, newPassword) => {
  try {
    const res = await findUserByEmail(email);

    if (!res.success) {
      return { success: false, message: "User not found!", status: 404 };
    }

    const hashedPassword = await createHashPassword(newPassword); // Assuming the function takes newPassword as argument

    await updateUserPassword(res.user, hashedPassword);

    return { message: "Password updated successfully", status: 200 };
  } catch (error) {
    console.error("Error in updatePasswordService:", error);
    return { success: false, message: error.message || "Internal Server Error", status: 500 };
  }
};



