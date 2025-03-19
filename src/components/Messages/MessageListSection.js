"use client";

import { useState } from "react";
import styles from "./messageListSection.module.css";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMessage2Plus } from "react-icons/tb";
import { FaTimesCircle } from "react-icons/fa";

import { IoIosSearch } from "react-icons/io";
import Image from "next/image";

const MessageListSection = ({ users, setShowPopup }) => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.head}>
          <div className={styles.title}>
            <div className={styles.text}>Messages</div>
            <div className={styles.extraFunction}>
              <div className={styles.extraIcon}>
                <IoSettingsOutline />
              </div>
              <div
                className={styles.extraIcon}
                onClick={() => setShowPopup(true)}
              >
                <TbMessage2Plus />
              </div>
            </div>
          </div>
          <div
            className={`${styles.search} ${isFocused ? styles.active : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className={styles.icon}>
              <IoIosSearch />
            </div>
            <div className={styles.searchBox}>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search Direct Messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search.length > 0 && (
                <div className={styles.icon2} onClick={() => setSearch("")}>
                  <FaTimesCircle />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.chatUser}>
          {users.map((user) => (
            <div key={user._id} className={styles.userItem} onClick={() => {}}>
              <div>
                {user.image && (
                  <Image
                    src={user.image}
                    alt={`${user.fullName}'s profile`}
                    width={50}
                    height={50}
                    className={styles.profileImage}
                  />
                )}
              </div>
              <div className={styles.name}>
                <div>{user.fullName}</div>
                <div className={styles.userName}>@{user.userName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MessageListSection;
