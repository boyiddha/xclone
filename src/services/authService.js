import { getUser} from "@/repositories/userRepository";
import { generateTokens,  generateAccessToken, verifyRefreshToken } from "@/utils/jwtUtils";
import { comparePasswords } from "@/helpers/passwordHelper";

export const loginService = async (email, password) => {
  // Find user in the database
  const user = await getUser(email);
  if (!user) {
    return { error: "Invalid credentials", status: 401 };
  }

  // Compare passwords
  const isPasswordValid = await comparePasswords(password, user.password)
  if (!isPasswordValid) {
    return { error: "Invalid credentials", status: 401 };
  }

  // Generate JWT tokens
  const { accessToken, refreshToken } = generateTokens(user);

  return {
    accessToken,
    refreshToken,
    expiresIn: 10,
    userInfo: { email: user.email },
    status: 200,
  };
};


export const refreshAccessToken = (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    //console.log("Decoded refresh token:", decoded); // Debuggin
    // refresh token verified!! done!! now Generate a new Access Token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });
    return { accessToken: newAccessToken, expiresIn: 30 }; 
    // IT just return json response to the front-end, here second parameter is just send the 
    // info to the front end how many times expirationis set. it doesn't change the actual token expiration time
  }catch (error) {
      console.log("❌ [DEBUG] Refresh Token Expired or Invalid:(this message from services/authService ) ", error.message); // Only log error message
      return null; // Instead of throwing, return null to indicate failure
    }
};
