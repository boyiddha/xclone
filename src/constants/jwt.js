export const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret";
export const JWT_ACCESS_EXPIRATION = "15m"; // Access Token expiration time
export const JWT_REFRESH_EXPIRATION = "7d"; // Refresh token expiration
