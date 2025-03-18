"use client";

import { useState } from "react";
import styles from "./message.module.css";
import MessageListSection from "./MessageListSection";
import ChatSection from "./ChatSection";
import SearchOverlay from "./SearchOverlay";

const Message = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleUserSelect = (user) => {
    setSelectedUsers((prev) => {
      // Check if the user is already in the selectedUsers array based on userName or any unique identifier
      if (!prev.some((selectedUser) => selectedUser._id === user._id)) {
        return [...prev, user]; // If user is not in the array, add them
      }
      // If user is already selected, do nothing
      return prev;
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection
            selectedUsers={selectedUsers}
            setShowPopup={setShowPopup}
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
