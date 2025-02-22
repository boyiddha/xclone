export const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret"; 
export const JWT_EXPIRATION = "7d"; // Token expiration time
export const JWT_REFRESH_EXPIRATION = "30d"; // Refresh token expiration
