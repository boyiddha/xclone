//✅ Handle DB operations
// import { User } from "@/model/user-model";

import { User } from "@/models/userModel";

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email }).select("-password").lean(); // excluding password
  } catch (error) {
    console.log("Find User in DB by email is failed: ", error);
    throw new Error("Database query failed: " + error.message); // Let the service handle it
  }
};

export const getUser = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.log("Find User in DB by email is failed: ", error);
    throw new Error("Database query failed: " + error.message); // Let the service handle it
  }
};

export async function getUserByIdFromDB(userId) {
  return await User.findById(userId);
}

export async function getAllUsersFromDB() {
  return await User.find({}, "fullName userName image");
}

export async function createUser(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    console.error("Error saving user in DB :", error);
    throw new Error("Database error while creating user " + error.message);
  }
}

export async function createOauthUser(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    console.error("Error saving user in DB :", error);
    throw new Error("Database error while creating user " + error.message);
  }
}

export const updateUser = async (email, dob, hashedPassword, username) => {
  try {
    return await User.findOneAndUpdate(
      { email },
      { dob, password: hashedPassword, userName: username },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error in update user in DB :", error);
    throw new Error("Database error while update user " + error.message);
  }
};

export const updateUserById = async (userId, newData) => {
  return await User.findByIdAndUpdate(userId, newData, { new: true });
};

export const saveResetCode = async (email, resetCode, expiresAt) => {
  try {
    return await User.findOneAndUpdate(
      { email },
      { forgetPasswordCode: resetCode, forgetPasswordExpiresAt: expiresAt },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error updating reset code:", error);
    throw new Error("Database error while update reset code " + error.message);
  }
};

export const updateUserPassword = async (user, newPassword) => {
  try {
    // Use findByIdAndUpdate to update the existing user document
    const updatedUser = await User.findByIdAndUpdate(
      user._id, // The _id of the user to update
      {
        password: newPassword,
        forgetPasswordCode: null,
        forgetPasswordExpiresAt: null,
      },
      { new: true } // Option to return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found during update");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update user password");
  }
};

export const savePassword = async (email, hashedPassword) => {
  return await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
};

export const saveUsername = async (email, username) => {
  return await User.findOneAndUpdate(
    { email },
    { userName: username },
    { new: true }
  );
};
