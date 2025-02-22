import { NextResponse } from "next/server";
import { verifyResetCodeServie, updatePasswordService, sendResetCodeServie } from "@/services/forgotPasswordService";

export const sendResetCode = async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const result = await sendResetCodeServie(email);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status:result.status });
    }

    return NextResponse.json({ message: "Reset code sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};



export const verifyResetCode = async (req) => {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    const response = await verifyResetCodeServie(email, code);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

/**
 * Handles the password update request.
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (req, res) => {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
   
    }

    const response =  await updatePasswordService(email, newPassword);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
}
};

