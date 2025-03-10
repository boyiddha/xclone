import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user who receives the notification
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user who triggers the notification (liking, reposting, etc.)
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true, // The post that the notification is related to
    },
    type: {
      type: String,
      enum: ["like", "comment", "repost"],
      required: true, // Type of notification
    },
    isRead: {
      type: Boolean,
      default: false, // If the notification has been read
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
