import { getToken } from "next-auth/jwt";

export const getAuthToken = async (request) => {
  return getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
};
