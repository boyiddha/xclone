//✅  Contains core business logic (validation, calculations, transformations).
//🌟   Calls the repository functions to fetch/store data.
//🌟  Ensures that controllers focus on request/response handling only.
// 🌟  🌟 Example:
// import { createUser, getUserByEmail } from "@/repository/userRepository";

// export async function registerUser(userData) {
//   const existingUser = await getUserByEmail(userData.email);
//   if (existingUser) {
//     throw new Error("User already exists");
//   }

//   return await createUser(userData);
// }

import { getUserByEmail } from "@/repository/userRepository";

export const findUserByEmail = async (email) => {
  try {
    // Call the repository to fetch the user data by email
    const user = await getUserByEmail(email);
    return user;
  } catch (error) {
    throw new Error("Error in service layer: " + error.message);
  }
};
