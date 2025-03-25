"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./message.module.css";
import MessageListSection from "./MessageListSection";
import ChatSection from "./ChatSection";
import SearchOverlay from "./SearchOverlay";
import { getLoggedInUser } from "@/app/actions/userActions";
import { fetchChatUsers } from "@/app/actions/chatActions";

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
    const data = await getLoggedInUser();
    setLoggedInUser(data);
  };

  // Fetch Chat Users
  const fetchUsers = useCallback(async () => {
    const data = await fetchChatUsers(loggedInUser._id);
    if (data) {
      setChatUsers(data);
    } else {
      console.error("Failed to fetch chat users");
    }
  }, [loggedInUser?._id]);

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      fetchUsers();
    }
  }, [loggedInUser, fetchUsers]);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection
            users={chatUsers}
            setShowPopup={setShowPopup}
            loggedInId={loggedInUser?._id}
          />
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
