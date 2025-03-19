"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import MessageListSection from "../Messages/MessageListSection";
import Conversation from "./Conversation";
import SearchOverlay from "../Messages/SearchOverlay";

const Chat = ({ user }) => {
  const [chatUsers, setChatUsers] = useState([user]);
  const [loggedInUser, setLoggedInUser] = useState("");

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
  // Fetch posts on component mount
  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.messageList}`}>
          <MessageListSection users={chatUsers} setShowPopup={setShowPopup} />
        </div>

        <div className={`${styles.column} ${styles.chatBox}`}>
          <Conversation selectedUsers={user} loggedInUser={loggedInUser} />
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
