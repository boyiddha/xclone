"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./chat.module.css";
import MessageListSection from "../Messages/MessageListSection";
import Conversation from "./Conversation";
import SearchOverlay from "../Messages/SearchOverlay";
import { getLoggedInUser } from "@/app/actions/userActions";
import {
  fetchChatUsers,
  fetchOrCreateConversation,
} from "@/app/actions/chatActions";

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
  const loadChatUsers = useCallback(async () => {
    if (!loggedInUser?._id) return;
    try {
      const data = await fetchChatUsers(loggedInUser._id);
      setChatUsers(data);
    } catch (error) {
      console.error(error);
    }
  }, [loggedInUser?._id]);

  // Fetch or create conversation ID
  const loadConversation = useCallback(async () => {
    if (!loggedInUser || !user) return;
    try {
      const data = await fetchOrCreateConversation(loggedInUser._id, user._id);
      setConversationId(data.conversationId);
    } catch (error) {
      console.error(error);
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
        await loadConversation();
        await loadChatUsers();
      })();
    }
  }, [loggedInUser, loadConversation, loadChatUsers]);

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
