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

import {
  getUserByEmail,
  createUser,
  createOauthUser,
  updateUser,
  updateUserById,
  savePassword,
  saveUsername,
  getUserByIdFromDB,
  getUserByUserNameFromDB,
  getAllUsersFromDB,
  updateUserFollowers,
  getUsersBySearchQuery,
} from "@/repositories/userRepository";
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

export async function findUserById(userId) {
  return await getUserByIdFromDB(userId);
}
export async function findUserByUsername(username) {
  return await getUserByUserNameFromDB(username);
}

export async function createUserService(name, email, dob) {
  try {
    // Call the repository function to save user
    await createUser({ fullName: name, email, dob });
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
}

export async function findAllUsers() {
  return await getAllUsersFromDB();
}

export async function createUserOuathService(email, name) {
  try {
    // Call the repository function to save user
    await createOauthUser({ fullName: name, email });
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
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

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update user ${error.message}`,
    };
  }
};

export const updateUserProfileService = async (userId, newData) => {
  return await updateUserById(userId, newData);
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

export async function followUserService(loggedInUserId, userId) {
  const loggedInUser = await getUserByIdFromDB(loggedInUserId);
  const targetUser = await getUserByIdFromDB(userId);

  if (!loggedInUser || !targetUser) {
    return null;
  }

  const isFollowing = loggedInUser.following.includes(userId);

  if (isFollowing) {
    // Unfollow logic
    loggedInUser.following.pull(userId);
    targetUser.followers.pull(loggedInUserId);
  } else {
    // follow logic
    loggedInUser.following.push(userId);
    targetUser.followers.push(loggedInUserId);
  }

  await updateUserFollowers(loggedInUser);
  await updateUserFollowers(targetUser);

  return { isFollowing: !isFollowing };
}

export async function findUsersByQuery(query) {
  try {
    if (!query) {
      throw { message: "Query parameter is required", status: 400 };
    }

    // Fetch users from the repository
    const users = await getUsersBySearchQuery(query);

    return users;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}
