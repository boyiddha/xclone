//✅  Call query function, handle logic
//❌  Ensures that controllers do not interact directly with the database.
//✅ core business logic in services folder, here handling only request/response logic.

// 🌟 🌟 Example:
// import { registerUser } from "@/services/userService";

// export async function register(req, res) {
//   try {
//     const newUser = await registerUser(req.body);
//     return res.status(201).json(newUser);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// }

import { NextResponse } from "next/server";
import { findUserByEmail } from "@/services/userService";

export const getUser = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // ✅ Get email from query params

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

//✅  Repositories = Only fetch/store data.
//✅  Services = Apply business logic.
//✅  Controllers = Handle HTTP requests/responses.

//🌟 1 ✅  front-end req => api/users/profile
//🌟 2 ✅  api routes =>

//  import {getUserProfile} from controllers/userController
//  GET(req,res) => { return getUserProfile(req,res) }

//🌟 3 ✅  controller =>

// import {getUserProfile} from service/userServie
// getUserProfile (req,res) => {
// 	const userId = req.query.id;
//   const user = await getUserProfile(userId);
// }

//🌟 4 ✅  services =>

// import { fetchUserProfile } from "@/repository/userRepository";

// export async function getUserProfile(userId) {
//   const user = await fetchUserProfile(userId);
//   if (!user) throw new Error("User not found");
//   return user;
// }

//🌟 5 ✅  repository =>

// 	import User from "@/models/userModel";

// export async function fetchUserProfile(userId) {
//   return await User.findById(userId);
// }
