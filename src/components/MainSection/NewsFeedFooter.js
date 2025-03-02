"use client";

import { LuMessageCircle } from "react-icons/lu";
import { BiRepost } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";

import styles from "./newsFeedFooter.module.css";
import { useState } from "react";
import { useSession } from "next-auth/react";

const NewsFeedFooter = ({postId, likes}) => {
  const [likeCount, setLikeCount] = useState(likes?.length || 0);

  const { data: session } = useSession();
  console.log(" ✅ session is Newsfeedfooter : ", session);
  const currentUserId = session?.user?.id;

  const [liked, setLiked] = useState(currentUserId ? likes.includes(currentUserId) : false);


  const handleLike = async () => {
    const res = await fetch("/api/tweet/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
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
        <LuMessageCircle />
        <div className={styles.tooltip}>Reply</div>
      </div>
      <div className={`${styles.icon} ${styles.icon2}`}>
        <BiRepost /> 
        <div className={styles.tooltip}>Repost</div>
      </div>
      <div className={`${styles.icon} ${styles.icon3}`} onClick={handleLike} style={{ color: liked ? "red" : "blue" }}>
        <CiHeart />
        <span>{likeCount}</span>

        <div className={styles.tooltip}>{liked ? "Unlike" : "Like"}</div>
      </div>
      <div className={`${styles.icon} ${styles.icon4}`}>
        <RiBarChartGroupedLine />
        <div className={styles.tooltip}>View</div>
      </div>
      <div>
        <span
          className={`${styles.icon} ${styles.icon1}`}
          style={{ marginRight: "12px" }}
        >
          <CiBookmark />
          <div className={styles.tooltip}>Bookmark</div>
        </span>
        <span className={`${styles.icon} ${styles.icon1}`}>
          <MdOutlineFileUpload />
          <div className={styles.tooltip}>Share</div>
        </span>
      </div>
    </>
  );
};

export default NewsFeedFooter;
