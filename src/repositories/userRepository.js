//✅ Handle DB operations
// import { User } from "@/model/user-model";

// export async function createUser(user) {
//   try {
//     await User.create(user);
//   } catch (e) {
//     throw new Error(e);
//   }
// }

import { User } from "@/models/userModel";

export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).select("-password").lean();
    return user; // return user or null
  } catch (error) {
    console.log("Find User in DB by email is failed: ", error);
    throw new Error("Database query failed: " + error.message);// Let the service handle it
  }
};

export async function createUser(userData) {
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
    throw new Error("Database error while update user " +error.message);
  }
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
    throw new Error("Database error while update reset code " +error.message);
  }
};

