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
    // Query the database to find the user by email
    const user = await User.findOne({ email }).select("-password").lean();
    return user;
  } catch (error) {
    throw new Error("Error in repository: " + error.message);
  }
};
