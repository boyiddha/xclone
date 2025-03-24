"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./chat.module.css";
import MessageListSection from "../Messages/MessageListSection";
import Conversation from "./Conversation";
import SearchOverlay from "../Messages/SearchOverlay";
import { getLoggedInUser } from "@/app/actions/userActions";

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

  // Fetch Chat Users
  const fetchChatUsers = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/conversations?loggedInUserId=${loggedInUser._id}`
      );
      if (res.ok) {
        const data = await res.json();
        setChatUsers(data);
      } else {
        console.error("Failed to fetch chat users");
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  }, [loggedInUser?._id]);

  // Fetch or create conversation ID
  const fetchOrCreateConversation = useCallback(async () => {
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
  }, [loggedInUser, user]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setLoggedInUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      (async () => {
        await fetchOrCreateConversation(); // Then fetch or create conversation
        await fetchChatUsers(); // Wait for chat users to load
      })();
    }
  }, [loggedInUser, fetchChatUsers, fetchOrCreateConversation]);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection
            users={chatUsers}
            setShowPopup={setShowPopup}
            loggedInId={loggedInUser?._id}
            selectedUser={user}
          />
        </div>

        <div className={`${styles.column} ${styles.chatBox}`}>
          {conversationId ? (
            <Conversation
              selectedUsers={user}
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
