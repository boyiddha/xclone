import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  name: { type: String, required: false },
  data: { type: String, required: false }, // Base64-encoded string (or change to Buffer if needed)
  contentType: {
    type: String,
    required: function () {
      return !!this.data;
    },
  }, // Required if data exists
});

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true, required: false }, // Trim to remove unnecessary spaces
    media: { type: MediaSchema, default: [] }, // Default to empty array (ensures consistency)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
  
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
