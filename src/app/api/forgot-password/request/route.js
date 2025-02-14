import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // get user username
    const userName = user.userName;

    const resetCode = crypto.randomBytes(4).toString("hex"); // 8-character code
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration

    user.forgetPasswordCode = resetCode;
    user.forgetPasswordExpiresAt = expiresAt;
    await user.save();
    // Call the existing nodemailer API to send the email
    const emailResponse = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/nodemailer`,
      {
        method: "POST",
        body: JSON.stringify({
          to: email,
          subject: "Password reset request",
          html: `
          <h1> 	Reset your password?</h1>
          <br/
          <h3>If you requested a password reset for @${userName}, use the confirmation code below to complete the process. 
          If you didn't make this request, ignore this email.
          </h3>
          <br/><br/>
           <h2>${resetCode}</h2>
           <br/>
          <h3>Verification codes expire after 1 hour.</h3>
          <br/>
          <h4>Thanks,</h4>
          <h4>X</h4>
          
          `,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!emailResponse.ok) {
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Reset code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
