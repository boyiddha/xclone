"use client";

import styles from "./conversation.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { formatJoiningDate } from "@/utils/calendarUtils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const Conversation = ({ selectedUsers, loggedInUser, conversationId }) => {
  const [joiningDateMessage, setJoiningDateMessage] = useState("");
  const router = useRouter();
  const textAreaRef = useRef(null);

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null); // To prevent multiple instances

  const activeSend = content?.length > 0 ? true : false;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChange = (e) => {
    setContent(e.target.value);
    handleTyping();
    // Reset height to auto first to get correct scroll height
    e.target.style.height = "auto";

    // Set height only up to max-height (20vh)
    const maxHeight = window.innerHeight * 0.2; // 20vh
    if (e.target.scrollHeight > maxHeight) {
      e.target.style.height = `${maxHeight}px`; // Stop growing beyond max-height
      e.target.style.overflowY = "auto"; // Enable scrolling inside inputBox
    } else {
      e.target.style.height = `${e.target.scrollHeight}px`; // Allow natural growth
      e.target.style.overflowY = "hidden"; // Hide scroll if not needed
    }
  };

  useEffect(() => {
    if (selectedUsers) {
      setJoiningDateMessage(formatJoiningDate(selectedUsers.createdAt));
    }
  }, [selectedUsers]);

  // fetch older message
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}&loggedInUserId=${loggedInUser._id}`,
          {
            method: "GET",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
          // Notify sender about seen messages
          const unseenMessages = data.messages.filter(
            (msg) => msg.receiver === loggedInUser._id && !msg.seen
          );

          if (unseenMessages.length > 0) {
            socketRef.current.emit("markAsSeenBulk", {
              messageIds: unseenMessages.map((msg) => msg._id),
              senderId: unseenMessages[0]?.sender, // Notify the sender
            });
          }
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId, loggedInUser._id]);

  //   ✅ Display messages in real-time.
  // ✅ Show a typing indicator.
  // ✅ Mark messages as seen.
  // ✅ Fetch older messages from MongoDB.

  // Real Time update
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.emit("userConnected", loggedInUser._id);

    socketRef.current.on("receiveMessage", (newMessage) => {
      if (newMessage.sender !== newMessage.receiver) {
        // fot self chat not update UI instantly
        setMessages((prev) => [...prev, newMessage]);
      }
      // If message was sent to logged-in user, mark it as seen
      socketRef.current.emit("markAsSeen", {
        messageId: newMessage._id,
        receiverId: newMessage.sender,
      });
    });
    // ✅ Real-time update for "seen" status
    socketRef.current.on("messageSeen", (seenMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === seenMessage._id ? { ...msg, seen: true } : msg
        )
      );
    });

    socketRef.current.on("messageSeenBulk", ({ messageIds }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
        )
      );
    });

    socketRef.current.on("typing", ({ sender }) => {
      if (sender === selectedUsers._id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [loggedInUser, selectedUsers]);

  const handleSend = async () => {
    if (!content.trim()) return;

    const newMessage = {
      sender: loggedInUser._id,
      receiver: selectedUsers._id,
      content: content.trim(),
      conversationId: conversationId,
      seen: false, // Initially unseen
    };

    setContent("");

    // Send message to server and wait for the response
    socketRef.current.emit("sendMessage", newMessage, (savedMessage) => {
      // ✅ Use the server-saved message with _id
      setMessages((prev) => [...prev, savedMessage]);
    });
  };

  const handleTyping = () => {
    socketRef.current.emit("userTyping", {
      sender: loggedInUser._id,
      receiver: selectedUsers._id,
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.row1}>
          <div>
            <span>{selectedUsers.fullName}</span>
          </div>
          <div className={styles.moreIcon}>
            <IoMdInformationCircleOutline />
          </div>
        </div>
        <div className={styles.row2} ref={messagesEndRef}>
          <div
            className={styles.profile}
            onClick={() => {
              router.push(`/${selectedUsers.userName}`);
            }}
          >
            <div className={styles.profileImg}>
              {selectedUsers?.image && (
                <Image
                  src={selectedUsers.image}
                  alt={selectedUsers.fullName}
                  width={50}
                  height={50}
                  className={styles.profileImage}
                />
              )}
            </div>
            <div>
              <h3>{selectedUsers.fullName}</h3>
            </div>
            <div className={styles.username}>
              <span>@{selectedUsers.userName}</span>
            </div>
            <div className={styles.joiningText}>
              {joiningDateMessage}
              {" - "}
              {selectedUsers?.followers?.length} Followers
            </div>
          </div>
          <div className={styles.message}>
            {messages.map((msg) => (
              <div key={msg._id} className={styles.msg}>
                <div
                  className={
                    msg.sender === loggedInUser._id
                      ? styles.sentText
                      : styles.receivedText
                  }
                >
                  {msg.content}
                </div>
                {msg.sender === loggedInUser._id && (
                  <div
                    className={
                      msg.seen ? styles.seenStatus : styles.unseenStatus
                    }
                  >
                    {msg.seen ? "Seen" : "Unseen"}
                  </div>
                )}
              </div>
            ))}
            {typing && <div className={styles.typing}>Typing...</div>}
          </div>
        </div>
        <div className={styles.row3}>
          <div className={styles.chatBox}>
            <div className={styles.inputBox}>
              <textarea
                ref={textAreaRef}
                value={content}
                onChange={handleChange}
                placeholder="Start a new message..."
                style={{ overflow: "hidden", resize: "none", width: "100%" }}
              />
            </div>
            <div className={styles.sendIcon}>
              <span
                className={` ${activeSend ? styles.sendActive : ""}`}
                onClick={activeSend ? handleSend : undefined}
              >
                <AiOutlineSend className={``} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
