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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked this post
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who reposted this post
    reposted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null, // Stores the original post ID if it's a repost
    },
    //Each reply is a separate post but references a parentPostId.
    //If parentPostId is null, it’s a normal post.
    //If parentPostId is set, it's a reply to another post.
    parentPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who commented in this post
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
