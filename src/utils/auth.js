import { fetchNewAccessToken } from "@/app/actions/authActions";
import { getToken } from "next-auth/jwt";

export const getAuthToken = async (request) => {
  return getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

export const refreshAccessToken = async (token) => {
  //console.log("✅  refresh Access Token function calling...... token: ", token);

  try {
    const tokens = await fetchNewAccessToken(token.refreshToken);

    if (tokens.error) {
      return { ...token, error: tokens.error };
    }

    //console.log("✅  new access token is set ..... token: ");

    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return { ...token, error: "RefreshTokenExpired" }; // Indicate expired refresh token which handle in middleware
  }
};
