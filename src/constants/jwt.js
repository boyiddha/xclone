export const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret"; 
export const JWT_ACCESS_EXPIRATION = "30s"; // Access Token expiration time
export const JWT_REFRESH_EXPIRATION = "1m"; // Refresh token expiration
