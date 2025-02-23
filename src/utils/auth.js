import { getToken } from "next-auth/jwt";

export const getAuthToken = async (request) => {
  return getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export async function refreshAccessToken(token) {
 //console.log("Refreshing access token", token);
 console.log("✅  refresh Access Token function calling...... token: ", token);
  try {
    //console.log("📤 Sending refresh token:", token.refreshToken); // Debugging
    // Debuggin: Ensure refreshToken is available before API Call
    if (!token.refreshToken) {
      //console.error("❌ refreshToken is missing before making API call!");
      return { ...token, error: "Missing refresh token" };
    }

    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.refreshToken}`,
        },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );
 // console.log(response);
    // Check if the response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server Error response:", errorText);
      return { ...token, error: "RefreshTokenExpired" };
    }

    //const tokens = await response.json();
    const text = await response.text();
    // If the response is empty, log a warning
    if (!text) {
      console.warn("Empty response received from the server.");
      return {
        ...token,
        error: "Empty response received",
      };
    }
    // Parse the response as JSON
    const tokens = JSON.parse(text);
    //console.log(tokens);
    console.log("✅  new access token is set ..... token: ");

    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken,// Fall back to old refresh token
    };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return { ...token, error: "RefreshTokenExpired" };// Indicate expired refresh token which handle in middleware
  }
};

