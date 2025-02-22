"use server"; 

// It is a only server side utility function
// because nodemailer worked only server side

import nodemailer from "nodemailer";

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email body (HTML format).
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASS) {
      throw new Error("Missing email credentials in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail", // Make it configurable
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email: " + error.message };
  }
};
