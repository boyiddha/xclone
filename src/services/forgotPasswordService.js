import { findUserByEmail } from "@/services/userService";
import { saveResetCode } from "@/repositories/userRepository";
import { PASSWORD_RESET_CODE_EXPIRATION } from "@/constants/security";
import { getExpirationTime } from "@/utils/expiresTimeUtils";
import { getOTP } from "@/utils/randomUtils";
import { generateEmailData } from "@/utils/emailTemplates";
import { sendEmail } from "@/utils/emailSender";

export const forgotPasswordService = async (email) => {
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
