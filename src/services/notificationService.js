import * as notificationRepository from "@/repositories/notificationRepository";

export const createNotificationService = async ({
  recipient,
  sender,
  postId,
  type,
}) => {
  if (recipient.toString() === sender.toString()) {
    throw new Error("Users cannot notify themselves");
  }

  const postExists = await notificationRepository.findPostById(postId);
  if (!postExists) {
    throw new Error("Post not found");
  }

  return await notificationRepository.createNotification({
    recipient,
    sender,
    post: postId,
    type,
  });
};

export const getNotificationsService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return await notificationRepository.findNotificationsByRecipient(userId);
};

export const updateNotificationService = async (notifId, isRead) => {
  if (!notifId) {
    throw new Error("Notification ID is required");
  }

  const updatedNotification =
    await notificationRepository.updateNotificationStatus(notifId, isRead);
  if (!updatedNotification) {
    throw new Error("Notification not found");
  }

  return updatedNotification;
};
