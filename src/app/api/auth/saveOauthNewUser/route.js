import { updateUser } from "@/controllers/userController";
import { getToken } from "next-auth/jwt";
export const POST = async (request) => {
  const res = await updateUser(request);
  return res;
};

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NextResponse } from "next/server";
// import { updateUser } from "@/controllers/userController";

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Save new user details in DB
//     await updateUser(req);

//     // Force token update by clearing session token
//     const response = NextResponse.json({ success: true }, { status: 200 });
//     response.headers.set(
//       "Set-Cookie",
//       "next-auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure;"
//     );

//     return response;
//   } catch (error) {
//     console.error("Error in saveOuthNewUser:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
