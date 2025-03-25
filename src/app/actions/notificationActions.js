export const createNotification = async ({
  recipient, // post owner Id
  sender,
  postId,
  type,
}) => {
  try {
    const res = await fetch("/api/notification", {
      method: "POST",
      body: JSON.stringify({
        recipient, // post owner Id
        sender,
        postId, // main post id
        type, // type: comment/reply, like, repost
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Something went wrong with the notification.");
  }
};

export const fetchNotificationsData = async (userId) => {
  try {
    const res = await fetch(`/api/notification?userId=${userId}`);
    const dataNotifications = await res.json();

    // Check if there are any unread notifications
    const hasUnread = dataNotifications?.some(
      (notification) => !notification.isRead
    );
    return { dataNotifications, hasUnread };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Throw error to be handled on the frontend
  }
};

export const fetchUnseenMessagesNotifications = async (userId) => {
  try {
    const response = await fetch(`/api/messages/has-unseen?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    return data; // Return the data received from the API
  } catch (error) {
    console.error("Failed to fetch unseen messages:", error);
    throw error; // Throw error to be handled on the frontend
  }
};

// app/actions/notificationActions.js

export const markNotificationAsRead = async (notifId) => {
  try {
    const response = await fetch(`/api/notification?notifId=${notifId}`, {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to update notification");

    return await response.json(); // Optionally return response if needed
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error; // Throw error to be handled on the frontend
  }
};
