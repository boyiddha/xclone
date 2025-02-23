import { NextResponse } from "next/server";
import { loginService,refreshAccessToken } from "@/services/authService";
import { getCookie } from "cookies-next";

export const loginController = async (req) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Call the service layer
    const result = await loginService(email, password);

    // Create a response object
    const response = NextResponse.json(result, { status: result.status });
    // Set the refresh token in an HttpOnly cookie
    if (result.refreshToken) {
      response.cookies.set("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
};

export const handleRefreshToken = async (req, res) => {
  try {
    const body = await req.json();
    // Try getting the refresh token from the request body or cookies
    const refreshToken = body.refreshToken || getCookie("refreshToken", { req, res });

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { error: "Refresh token missing" },
        { status: 401 }
      );
    }
    //console.log("Received refresh token:", refreshToken); // Debugging
    const tokenData = refreshAccessToken(refreshToken);
    
    if (!tokenData) {
      console.log("❌ [DEBUG] Invalid or expired refresh token. Logging out...");
      const response = NextResponse.json(
        { error: "Invalid or expired refresh token. Logging out..." },
        { status: 403 }
      );
    // Delete refresh token cookie if invalid
      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),// expire immediately
        path: "/",
      });

      return response;
    }

    return NextResponse.json(tokenData);
  } catch (error) {
    console.log("❌ [DEBUG] Unexpected Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};



