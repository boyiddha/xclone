import Notification from "@/models/notificationModel";
import Post from "@/models/postModel";
import { User } from "@/models/userModel";

export const createNotification = async (data) => {
  const newNotification = new Notification(data);
  return await newNotification.save();
};

export const findNotificationsByRecipient = async (recipientId) => {
  return await Notification.find({ recipient: recipientId })
    .populate("sender", "fullName userName image")
    .populate("post", "content")
    .sort({ createdAt: -1 });
};

export const findPostById = async (postId) => {
  return await Post.findById(postId);
};

export const updateNotificationStatus = async (notifId, isRead) => {
  return await Notification.findByIdAndUpdate(
    notifId,
    { isRead },
    { new: true }
  );
};
