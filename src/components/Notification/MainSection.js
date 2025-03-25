"use client";

import Image from "next/image";
import styles from "./mainSection.module.css";
import { useEffect, useState, useCallback } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { getLoggedInUser } from "@/app/actions/userActions";
import {
  fetchNotificationsData,
  markNotificationAsRead,
} from "@/app/actions/notificationActions";

const MainSection = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [userId, setCurrentUserId] = useState("");
  const [userName, setUserName] = useState("");

  // Fetch user data
  const fetchMe = async () => {
    setLoading(true);

    const data = await getLoggedInUser();
    if (data) {
      setUserName(data.userName);
      setCurrentUserId(data._id);
    } else {
      console.error("Failed to fetch user data");
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    const { dataNotifications, hasUnread } = await fetchNotificationsData(
      userId
    );
    setNotifications(dataNotifications);

    setLoading(false);
  }, [userId]);

  // Mark notification as read when hovered

  const markAsRead = async (notifId) => {
    // Update local state to mark the notification as read
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notifId ? { ...notif, isRead: true } : notif
      )
    );

    try {
      await markNotificationAsRead(notifId);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe();
      await fetchNotifications();
    };
    fetchData();
  }, [fetchNotifications]);

  return (
    <div className={styles.container}>
      <div className={styles.notification}>
        <div className={styles.title}>
          <div className={styles.text}>Notifications</div>
          <div className={styles.icon}>
            <IoSettingsOutline />
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
          <div className={styles.spinner}></div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`${styles.notificationItem} ${
                notif.isRead
                  ? styles.notificationItemRead
                  : styles.notificationItemUnread
              }`}
              onMouseEnter={() => !notif.isRead && markAsRead(notif._id)}
            >
              <div className={styles.column1}>
                {notif.type === "like" ? (
                  <AiFillHeart className={styles.likeIcon} />
                ) : notif.type === "repost" ? (
                  <BiRepost className={styles.repostIcon} />
                ) : (
                  notif.sender.image && (
                    <Image
                      src={notif.sender.image}
                      width={35}
                      height={35}
                      alt="sender image"
                      className={styles.userImage}
                    />
                  )
                )}
              </div>
              <div className={styles.column2}>
                <div className={styles.row1}>
                  {notif.type === "like" || notif.type === "repost" ? (
                    notif.sender.image && (
                      <Image
                        src={notif.sender.image}
                        width={35}
                        height={35}
                        alt="sender image"
                        className={styles.userImage}
                      />
                    )
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
                      </span>
                      <span className={styles.text}> liked your post</span>
                    </div>
                  ) : notif.type === "repost" ? (
                    <div>
                      <span className={styles.fullName}>
                        {notif.sender.fullName}
                      </span>
                      <span className={styles.text}> reposted your post</span>
                    </div>
                  ) : (
                    <div>
                      <span className={styles.replyText}>Replying to </span>
                      <span className={styles.replyUser}>@{userName}</span>
                    </div>
                  )}
                </div>
                <div className={styles.row3}>{notif?.post?.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainSection;
