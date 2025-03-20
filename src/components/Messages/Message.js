"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./message.module.css";
import MessageListSection from "./MessageListSection";
import ChatSection from "./ChatSection";
import SearchOverlay from "./SearchOverlay";

const Message = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

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

  // Fetch Logged-in User
  const fetchMe = async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setLoggedInUser(data);
      } else {
        console.error("Failed to fetch Me");
      }
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
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

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      fetchChatUsers();
    }
  }, [loggedInUser, fetchChatUsers]);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection users={chatUsers} setShowPopup={setShowPopup} />
        </div>

        <div className={`${styles.column} ${styles.chatBox}`}>
          <ChatSection setShowPopup={setShowPopup} />
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

export default Message;
