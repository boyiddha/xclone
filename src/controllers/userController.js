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

// ✅ Handles HTTP response (returns NextResponse.json()).

import { NextResponse } from "next/server";
import {
  findUserByEmail,
  createUserService,
  updateUserService,
  savePasswordService,
  saveUsernameService,
  findUserById,
  findAllUsers,
  updateUserProfileService,
} from "@/services/userService";
import { getAuthToken } from "@/utils/auth";

// when send email with get req params
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

    const result = await findUserByEmail(email);

    if (!result.success) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// when send email as session
export const getMe = async (req, session) => {
  try {
    const { email } = session.user;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const result = await findUserByEmail(email);

    if (!result.success) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    //console.log("✅  user is: ", result.user);
    return NextResponse.json(result.user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export async function getUserById(userId) {
  try {
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching user" },
      { status: 500 }
    );
  }
}

export async function getAllUsers() {
  try {
    const users = await findAllUsers();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

export async function registerUser(req) {
  try {
    const body = await req.json();
    const { name, email, dob } = body;

    if (!name || !email || !dob) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await createUserService(name, email, dob);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User has been created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const updateUser = async (request) => {
  try {
    const { dob, password, username } = await request.json();

    // Get token from request
    const token = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const email = token.email;

    // Delegate user update logic to the service layer
    const result = await updateUserService(email, dob, password, username);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: result.message, user: result.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updateUser controller:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const savePassword = async (req) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await findUserByEmail(email);

    if (!res.success) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const result = await savePasswordService(email, password);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export const saveUsername = async (req) => {
  try {
    const { email, username } = await req.json();

    if (!email || !username) {
      return NextResponse.json(
        { message: "Email and username are required" },
        { status: 400 }
      );
    }

    const res = await findUserByEmail(email);

    if (!res.success) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const result = await saveUsernameService(email, username);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export async function updateUserProfile(req, params) {
  try {
    const { userId } = await params;

    const { fullName, coverImage, profileImage } = await req.json();

    const updatedUser = await updateUserProfileService(userId, {
      fullName,
      coverImage,
      image: profileImage,
    });

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

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
