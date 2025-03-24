export const fetchChatUsers = async (loggedInUserId) => {
  try {
    const res = await fetch(
      `/api/conversations?loggedInUserId=${loggedInUserId}`
    );
    if (!res.ok) throw new Error("Failed to fetch chat users");
    return await res.json();
  } catch (error) {
    console.error("Error fetching chat users:", error);
    throw error;
  }
};

export const fetchOrCreateConversation = async (loggedInUserId, receiverId) => {
  try {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: loggedInUserId, receiverId }),
    });

    if (!res.ok) throw new Error("Failed to fetch or create conversation");
    return await res.json();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const fetchChatMessages = async (conversationId, loggedInUserId) => {
  try {
    const res = await fetch(
      `/api/messages?conversationId=${conversationId}&loggedInUserId=${loggedInUserId}`,
      {
        method: "GET",
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data.messages;
    } else {
      console.error("Failed to fetch messages");
      return [];
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
