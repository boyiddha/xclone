
"use server";

import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/emailSender";
import { generateEmailData } from "@/utils/emailTemplates";

export async function POST(req) {
  try {
    const { type, email, data } = await req.json();

    // Generate email data based on type (e.g., emailVerification, resetPassword)
    const emailData = generateEmailData(type, email, data);

    // Send the email
    await sendEmail(emailData.to, emailData.subject, emailData.html);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}

