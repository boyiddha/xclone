import { getUserById } from "@/controllers/userController";
import { updateUserProfile } from "@/controllers/userController";

// GET User by ID
export async function GET(req, { params }) {
  return getUserById(params.userId);
}

export async function PATCH(req, { params }) {
  return updateUserProfile(req, params);
}

// export async function PATCH(req, { params }) {
//   try {
//     const { userId } = await params;
//     const { fullName, coverImage, profileImage } = await req.json();

//     let newData = {
//       fullName: fullName,
//       coverImage: coverImage, // ✅ Already Base64
//       image: profileImage, // ✅ Already Base64
//     };

//     // Update user in MongoDB
//     const updatedUser = await User.findByIdAndUpdate(userId, newData, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     return new Response(JSON.stringify(updatedUser), { status: 200 });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//     });
//   }
// }
