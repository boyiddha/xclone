import { JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } from "@/constants/jwt";
import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRATION } // Access token expires in 30 seconds
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

