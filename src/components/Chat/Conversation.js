"use client";

import styles from "./conversation.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { formatJoiningDate } from "@/utils/calendarUtils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const Conversation = ({ selectedUsers }) => {
  const [joiningDateMessage, setJoiningDateMessage] = useState("");
  const router = useRouter();
  const [content, setContent] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (selectedUsers) {
      setJoiningDateMessage(formatJoiningDate(selectedUsers.createdAt));
    }
  }, [selectedUsers]);

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.head}>
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
              <span>{selectedUsers.userName}</span>
            </div>
            <div className={styles.joiningText}>
              {joiningDateMessage}
              {" - "}
              {selectedUsers?.followers?.length} Followers
            </div>
          </div>
          <div></div>
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
              <AiOutlineSend />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
