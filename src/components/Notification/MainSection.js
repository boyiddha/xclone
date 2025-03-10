"use client";

import Image from "next/image";
import styles from "./mainSection.module.css";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
const MainSection = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [userId, setCurrentUserId] = useState("");
  const [userName, setUserName] = useState("");

  const fetchMe = async () => {
    setLoading(true);
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      // setFullName(data.fullName);
      setUserName(data.userName);
      // setUserImage(data.image || null);
      setCurrentUserId(data._id);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notification?userId=${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
      if (userId) {
        await fetchNotifications(); // Now fetchNotifications will run after userId is set
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className={styles.container}>
      <div className={styles.notification}>
        <div className={styles.title}>
          <div className={styles.text}>Notifications</div>
          <div className={styles.icon}>
            {" "}
            <IoSettingsOutline />{" "}
          </div>
        </div>
        <div className={styles.head}>
          <div className={styles.all}>All</div>
          <div className={styles.verified}>Verified</div>
          <div className={styles.mention}>Mentions</div>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.spinner}></div> // Show spinner when loading
        ) : (
          notifications.map((notif) => (
            <div key={notif._id} className={styles.notificationItem}>
              <div className={styles.column1}>
                {notif.type === "like" ? (
                  <AiFillHeart className={styles.likeIcon} />
                ) : notif.type === "repost" ? (
                  <BiRepost className={styles.repostIcon} />
                ) : (
                  <div>
                    {notif.sender.image && (
                      <Image
                        src={notif.sender.image}
                        width={35}
                        height={35}
                        alt="sender image"
                        className={styles.userImage}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={styles.column2}>
                <div className={styles.row1}>
                  {notif.type === "like" || notif.type === "repost" ? (
                    <div>
                      {notif.sender.image && (
                        <Image
                          src={notif.sender.image}
                          width={35}
                          height={35}
                          alt="sender image"
                          className={styles.userImage}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className={styles.fullName}>
                        {notif.sender.fullName}
                      </span>
                      <span className={styles.userName}>
                        {" "}
                        @{notif.sender.userName}
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.row2}>
                  {notif.type === "like" ? (
                    <div>
                      <span className={styles.fullName}>
                        {notif.sender.fullName}
                      </span>{" "}
                      <span className={styles.text}>liked your post</span>
                    </div>
                  ) : notif.type === "repost" ? (
                    <div>
                      <span className={styles.fullName}>
                        {notif.sender.fullName}
                      </span>{" "}
                      <span className={styles.text}>reposted your post</span>
                    </div>
                  ) : (
                    <div>
                      <span className={styles.replyText}>Replying to </span>
                      <span className={styles.replyUser}>@{userName}</span>
                    </div>
                  )}
                </div>
                <div className={styles.row3}>{notif.post.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainSection;
