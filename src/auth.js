import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { User } from "./models/userModel";
import connectDB from "./utils/mongodb";
import bcrypt from "bcryptjs";

import { jwtDecode } from "jwt-decode";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  //console.log("Refreshing access token", token);
  try {
    //console.log("📤 Sending refresh token:", token.refreshToken); // Debugging
    // Debuggin: Ensure refreshToken is available before API Call
    if (!token.refreshToken) {
      //console.error("❌ refreshToken is missing before making API call!");
      return { ...token, error: "Missing refresh token" };
    }
    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/refresh`,
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
      return {
        ...token,
        error: "Failed to refresh access token",
      };
    }

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

    /*const refreshedTokens = {
        "access_token": "acess-token",
        "expires_in": 2,
        "refresh_token": "refresh-token"
      }*/

    //return token;

    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
// NextAuth options configuration
export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        try {
          const res = await fetch(
            `${process.env.API_SERVER_BASE_URL}/api/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
              redirect: "manual", // Prevents fetch from following redirects
            }
          );

          if (!res.ok) {
            // credentials are invalid
            return null;
          }

          const parsedResponse = await res.json();
          // const text = await res.text(); // Read response as text first
          // console.log("Raw Response before parse::::::::: ", text);
          // const user = JSON.parse(text);
          // console.log("Response after parese:::::::::: ", user);

          // accessing the accessToken returned by server
          const accessToken = parsedResponse.accessToken;
          const refreshToken = parsedResponse.refreshToken;
          const userInfo = parsedResponse?.userInfo;

          //console.log(refreshToken);

          // You can make more request to get other information about the user eg. Profile details

          // return user credentials together with accessToken
          return {
            accessToken,
            refreshToken,
            email: userInfo?.email,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Github provides email if this account's email is public otherwise it not provide private email
    // so while sigin /sign up make sure that account's email is public otherwise it shows
    // Error: /api/auth/error?error=users%20validation%20failed%3A%20email%3A%20Path%20%60email%60%20is%20required
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "read:user user:email", // Make sure to request the `user:email` scope
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Check if user exists in your database
      // console.log("user ", user);
      // console.log("account ", account);

      await connectDB();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        // Create new user
        await User.create({
          email: user.email,
          fullName: user.name,
        });
        //console.log("Successfully Created new user..........");
      }
      // set user.name while credential log in. it helps to set session.user.name property
      // oauth=> google/github add this automatically without facing any issue
      if (account.provider === "credentials") {
        // For Credentials login, ensure `name` is fetched from the database
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          user.name = dbUser.fullName; // Set name if available in the database
        }
      }
      return true;
    },
    jwt: async ({ token, account, user }) => {
      // user parameter exist is only the first time a user signs in via a provider like Google/OAuth
      //console.log(`In jwt callback - Token is ${JSON.stringify(token)}`);

      // If an accessToken already exists, decode it to set the expiration time
      if (token.accessToken) {
        const decodedToken = jwtDecode(token.accessToken);
        //console.log(decodedToken);
        token.accessTokenExpires = decodedToken?.exp * 1000;
      }

      if (account && user) {
        //console.log(`In jwt callback - User is ${JSON.stringify(user)}`);
        //console.log(`In jwt callback - account is ${JSON.stringify(account)}`);

        // login / signup via oauth=> inside user we get name, email, id, image
        // but for credential login => we get only email if we want to set name
        // in the session so find the user and set it later

        if (account.provider === "credentials") {
          const dbUser = await User.findOne({ email: user.email });
          // if user found then set it to session
          if (dbUser) {
            user.name = dbUser.fullName;
            // user.image = dbUser.image // set image if the db has an image or like as profile pic
          }
        }

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            ...user,
            name: user.name, // Ensure `name` is set here from db
          },
        };
      }

      // Return previous token if the access token has not expired yet
      // console.log(
      //   "**** Access token expires on *****",
      //   token.accessTokenExpires,
      //   new Date(token.accessTokenExpires)
      // );

      if (Date.now() < token.accessTokenExpires) {
        //console.log("**** returning previous token ******");
        return token;
      }

      // Access token has expired, try to update it
      //console.log("**** Update Refresh token ******");
      //return token;
      // console.log("❌ before calling refreshAccessToken the token is: ", token);
      return refreshAccessToken(token);
    },
    // Session callback
    session: async ({ session, token }) => {
      //console.log(" ❌ session is: ", session);

      // Ensure the session includes the user's name from the token
      // if (token.user) {
      //   session.user.name = token.user.name;
      //   session.user.email = token.user.email;
      //   session.user.image = token.user.image;
      // }

      session.user = {
        name: token.user?.name ?? session.user.name,
        email: token.user?.email ?? session.user.email,
        image: token.user?.image ?? session.user.image,
      };

      //console.log(" ❌ after setting session is: ", session);
      return session;
    },
  },
};
// Export NextAuth handler with configuration
export default NextAuth(authOptions);
