import { NextResponse } from "next/server";
import { forgotPasswordService } from "@/services/forgotPasswordService";

export const forgotPasswordController = async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const result = await forgotPasswordService(email);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status:result.status });
    }

    return NextResponse.json({ message: "Reset code sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
