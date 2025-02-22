//✅ Reusable Small Functions=> across particular part
// When to Use helpers/:
// When a function is specific to a particular domain of your application
// (e.g., user authentication, form validation).
// When you want to reusable logic related to a specific area of the app
// but not generalized across the whole application.

import bcrypt from "bcryptjs";

import { BCRYPT_SALT_ROUNDS } from "@/constants/auth";

export async function createHashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePasswords(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash);
}
