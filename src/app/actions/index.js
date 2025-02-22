
import { signIn, signOut } from "next-auth/react";

export const doSocialLogin = async (provider) => {
  await signIn(provider, {
    redirect: true, // This triggers the redirection after successful sign-in
    callbackUrl: "/home", // This sets the desired redirection URL after login
  });
};

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(loginEmail, password) {
  try {
    const e = loginEmail;
    const p = password;
    const response = await signIn("credentials", {
      email: e,
      password: p,

      redirect: true, // This triggers the redirection after successful sign-in
      callbackUrl: "/home", // This sets the desired redirection URL after login
    });

    return response;
  } catch (err) {
    throw err;
  }
}
