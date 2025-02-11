import { revalidatePath } from "next/cache";

import { signIn, signOut } from "next-auth/react";

export const doSocialLogin = async (provider) => {
  await signIn(provider, { redirectTo: "/home" });
};

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData) {
  console.log("formData", formData);

  try {
    const e = formData.get("email");
    const p = formData.get("password");

    const response = await signIn("credentials", {
      email: e,
      password: p,
      redirect: false,
    });
    revalidatePath("/home");

    return response;
  } catch (err) {
    throw err;
  }
}
