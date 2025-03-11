"use client";

import { useEffect, useState } from "react";
import styles from "./mainSection.module.css";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { formatJoiningDate } from "@/utils/calendarUtils";
import HeaderSection from "./HeaderSection";
import UserPost from "./UserPost";
import UserReply from "./UserReply";
import UserLike from "./UserLike";

const MainSection = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [userId, setCurrentUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [userCoverImage, setUserCoverImage] = useState(null);
  const [joiningDateMessage, setJoiningDateMessage] = useState("");
  const [following, setFollowing] = useState(0);
  const [follower, setFollower] = useState(0);

  const justChangeURL = (page) => {
    const basePath = pathname.split("/")[1];
    const newUrl = page === "posts" ? `/${basePath}` : `/${basePath}/${page}`;
    window.history.pushState(null, "", newUrl);
  };

  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setFullName(data.fullName);
      setUserName(data.userName);
      setUserImage(data.image || null);
      setUserCoverImage(data.coverImage || null);
      setCurrentUserId(data._id);
      setFollowing(data.following.length || 0);
      setFollower(data.followers.length || 0);

      const joiningDate = formatJoiningDate(data.createdAt);
      setJoiningDateMessage(joiningDate);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/tweet/posts`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching user post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
      if (userId) {
        await fetchPosts(); // Now fetchNotifications will run after userId is set
      }
    };

    fetchData();
  }, [userId]);

  return (
    <>
      <div className={styles.profileContainer}>
        <div>
          <HeaderSection
            totalPost={posts.length || 0}
            loading={loading}
            fullName={fullName}
            userName={userName}
            userImage={userImage}
            userCoverImage={userCoverImage}
            joiningDateMessage={joiningDateMessage}
            following={following}
            follower={follower}
          />
        </div>
        {/* Page Navigation */}
        <div className={styles.pages}>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("posts")}
          >
            Posts
          </div>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}/ReplyPage` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("ReplyPage")}
          >
            Replies
          </div>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}/LikePage` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("LikePage")}
          >
            Likes
          </div>
          <div className={styles.pageItem}>Highlights</div>
          <div className={styles.pageItem}>Media</div>
        </div>

        <div className={styles.contentSection}>
          {pathname === `/${userName}` && <UserPost />}
          {pathname === `/${userName}/ReplyPage` && <UserReply />}
          {pathname === `/${userName}/LikePage` && <UserLike />}
        </div>
      </div>
    </>
  );
};

export default MainSection;
