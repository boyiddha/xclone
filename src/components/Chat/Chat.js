"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import MessageListSection from "../Messages/MessageListSection";
import Conversation from "./Conversation";
import SearchOverlay from "../Messages/SearchOverlay";

const Chat = ({ user }) => {
  const [chatUsers, setChatUsers] = useState([user]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const handleUserSelect = (user) => {
    setChatUsers((prev) => {
      // Check if the user is already in the selectedUsers array based on userName or any unique identifier
      if (!prev.some((selectedUser) => selectedUser._id === user._id)) {
        return [...prev, user]; // If user is not in the array, add them
      }
      // If user is already selected, do nothing
      return prev;
    });
  };
  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setLoggedInUser(data);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  // Fetch or create conversation ID
  const fetchOrCreateConversation = async () => {
    if (!loggedInUser || !user) return;

    const receiver = user; // Assuming one-on-one chat

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedInUser._id,
          receiverId: receiver._id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversationId);
      } else {
        console.error("❌ Failed to fetch or create conversation.");
      }
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      fetchOrCreateConversation();
    }
  }, [loggedInUser, user]);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection users={chatUsers} setShowPopup={setShowPopup} />
        </div>

        <div className={`${styles.column} ${styles.chatBox}`}>
          {conversationId ? (
            <Conversation
              selectedUsers={chatUsers[0]}
              loggedInUser={loggedInUser}
              conversationId={conversationId}
            />
          ) : (
            <div className={styles.spinner}></div>
          )}
        </div>
      </div>
      {showPopup && (
        <SearchOverlay
          setShowPopup={setShowPopup}
          onUserSelect={handleUserSelect}
        />
      )}
    </>
  );
};

export default Chat;
