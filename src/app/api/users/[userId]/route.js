import { getUserById } from "@/controllers/userController";
import { User } from "@/models/userModel"; // Import User model

// GET User by ID
export async function GET(req, { params }) {
  return getUserById(params.userId);
}

const fileToBase64 = async (file) => {
  try {
    const buffer = await file.arrayBuffer(); // Read file as buffer
    const base64String = Buffer.from(buffer).toString("base64");
    const fileType = file.type.split("/")[1]; // Extract file extension
    return `data:image/${fileType};base64,${base64String}`;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw new Error("File conversion failed");
  }
};

// ✅ PATCH: Update user info (including converting images to Base64)
export async function PATCH(req, { params }) {
  await dbConnect(); // Ensure database connection

  try {
    const { userId } = params;
    const formData = await req.formData();

    // Extract values from formData
    const fullName = formData.get("fullName");
    const coverImageFile = formData.get("coverImage");
    const profileImageFile = formData.get("userImage");

    let updatedData = {};

    if (fullName) updatedData.fullName = fullName;

    if (coverImageFile && coverImageFile instanceof Blob) {
      updatedData.userCoverImage = await fileToBase64(coverImageFile);
    }

    if (profileImageFile && profileImageFile instanceof Blob) {
      updatedData.userImage = await fileToBase64(profileImageFile);
    }

    // Update user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
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
