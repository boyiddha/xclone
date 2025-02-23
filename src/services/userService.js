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

import { getUserByEmail, createUser,updateUser,savePassword,saveUsername } from "@/repositories/userRepository";
import { createHashPassword } from "@/helpers/passwordHelper";

export const findUserByEmail = async (email) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false };
    }
    return { success: true, user };
  } catch (error) {
        throw new Error(error); // Let the controller handle errors
  }
};

export async function createUserService(name, email, dob) {
  try {
    // Call the repository function to save user
    await createUser({ fullName: name, email, dob });
    return { success: true };
  } catch (error) {
    return { success: false, message:error };
  }
}

export const updateUserService = async (email, dob, password, username) => {
  try {
    // Hash the password
    const hashedPassword = await createHashPassword(password);
    // Call repository function to update the user
    const updatedUser = await updateUser(email, dob, hashedPassword, username);

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "User updated successfully", user: updatedUser };
  } catch (error) {
    return { success: false, message: `Failed to update user ${error.message}`  };
  }
};


export const savePasswordService = async (email, password) => {

  // Hash the password
  const hashedPassword = await createHashPassword(password);

  // Update user password
  const updatedUser = await savePassword(email, hashedPassword);

  if (!updatedUser) {
    return { message: "Failed to update password", status: 500 };
  }

  return { message: "Password updated successfully", status: 200 };
};

export const saveUsernameService = async (email, username) => {

  // Update user password
  const updatedUser = await saveUsername(email, username);

  if (!updatedUser) {
    return { message: "Failed to update username", status: 500 };
  }

  return { message: "Username updated successfully", status: 200 };
};


