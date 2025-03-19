"use client";

import styles from "./conversation.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { formatJoiningDate } from "@/utils/calendarUtils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const Conversation = ({ selectedUsers, loggedInUser }) => {
  const [joiningDateMessage, setJoiningDateMessage] = useState("");
  const router = useRouter();
  const textAreaRef = useRef(null);

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // To prevent multiple instances
  const socket = io();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const activeSend = content?.length > 0 ? true : false;

  const handleChange = (e) => {
    setContent(e.target.value);

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

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", {
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        setTransport(socketRef.current.io.engine.transport.name);

        socketRef.current.io.engine.on("upgrade", (transport) => {
          setTransport(transport.name);
        });
        console.log("✅ from front end: Connected to Socket.io");
        // Send a test message after connecting
        socketRef.current.emit("testMessage", {
          sender: "User1",
          content: "Hello from client!",
        });
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        setTransport("N/A");
        console.log("❌ from front end: Disconnected from Socket.io");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleSend = async () => {
    if (!activeSend) return;

    const newMessage = {
      sender: loggedInUser._id,
      receiver: selectedUsers._id,
      content: content.trim(),
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Send message to server via WebSocket
        socketRef.current?.emit("sendMessage", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setContent("");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
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
        <div className={styles.row2}>
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
          <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
          </div>
          <div>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  textAlign: msg.sender === loggedInUser._id ? "right" : "left",
                }}
              >
                {msg.content}
              </div>
            ))}
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
