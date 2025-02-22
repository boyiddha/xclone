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
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser,updateUser } from "@/repositories/userRepository";
import { BCRYPT_SALT_ROUNDS } from "@/constants/auth";

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
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
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


