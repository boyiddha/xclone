export const createCommentNotification = async ({
  ownerId,
  currentUserId,
  repliedPostId,
}) => {
  try {
    const res = await fetch("/api/notification", {
      method: "POST",
      body: JSON.stringify({
        recipient: ownerId, // post owner Id
        sender: currentUserId,
        postId: repliedPostId, // main post id
        type: "comment",
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Something went wrong with the notification.");
  }
};
