"use client";

import { LuMessageCircle } from "react-icons/lu";
import { BiRepost } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";

import styles from "./newsFeedFooter.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const NewsFeedFooter = ({ postId, likes }) => {
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch("api/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const userId = data._id.toString();
          setCurrentUserId(userId);

          setLiked(likes.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [session, likes]);

  const handleLike = async () => {
    const res = await fetch("/api/tweet/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, currentUserId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likes);
    }
  };

  return (
    <>
      <div className={`${styles.icon} ${styles.icon1}`}>
        <span className={styles.iconRVBS}>
          <LuMessageCircle />
        </span>
        <div className={styles.tooltip}>Reply</div>
      </div>
      <div className={`${styles.icon} ${styles.icon2}`}>
        <span className={styles.iconRepost}>
          {" "}
          <BiRepost />
        </span>
        <div className={styles.tooltip}>Repost</div>
      </div>
      <div
        className={`${styles.icon} ${styles.icon3}`}
        onClick={handleLike}
        style={{ color: liked ? "rgb(238, 49, 128)" : "" }}
      >
        <span className={styles.iconLike}>
          {liked ? <FaHeart /> : <CiHeart />}
        </span>
        <span>{likeCount > 0 ? likeCount : ""}</span>
        <div className={styles.tooltip}>{liked ? "Unlike" : "Like"}</div>
      </div>
      <div className={`${styles.icon} ${styles.icon1}`}>
        <span className={styles.iconRVBS}>
          {" "}
          <RiBarChartGroupedLine />{" "}
        </span>
        <div className={styles.tooltip}>View</div>
      </div>
      <div>
        <span
          className={`${styles.icon} ${styles.icon1} `}
          style={{ marginRight: "12px" }}
        >
          <span className={styles.iconRVBS}>
            {" "}
            <CiBookmark />{" "}
          </span>
          <div className={styles.tooltip}>Bookmark</div>
        </span>
        <span className={`${styles.icon} ${styles.icon1}`}>
          <span className={styles.iconRVBS}>
            {" "}
            <MdOutlineFileUpload />
          </span>
          <div className={styles.tooltip}>Share</div>
        </span>
      </div>
    </>
  );
};

export default NewsFeedFooter;
