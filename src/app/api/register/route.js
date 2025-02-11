import { NextResponse } from "next/server";

//import bcrypt from "bcryptjs";
import connectDB from "@/utils/mongodb";
import { User } from "@/models/userModel";

export const POST = async (request) => {
  const { name, email, dob } = await request.json();

  console.log(name, email, dob);

  // 1. Create a DB Connection
  await connectDB();
  // 2. Encrypt the password  //=> this password saving will worked on api/savePassword
  //const hashedPassword = await bcrypt.hash(password, 5);
  // 3. Form a DB payload
  const newUser = {
    fullName: name,
    email,
    dob,
  };
  // 4. Update the DB
  try {
    await User.create(newUser);
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  return new NextResponse("User has been created", {
    status: 201,
  });
};
