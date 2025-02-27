import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: false },
    image: { type: Buffer }, // Store image as Buffer  (Base64 Encoding)
  },
  { timestamps: true } // by default This adds `createdAt` and `updatedAt` fields
);

export default mongoose.models.posts || mongoose.model("posts", PostSchema);
