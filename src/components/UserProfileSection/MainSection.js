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
  const [users, setUsers] = useState([]);

  const justChangeURL = (page) => {
    const basePath = pathname.split("/")[1];
    const newUrl = page === "posts" ? `/${basePath}` : `/${basePath}/${page}`;
    window.history.pushState(null, "", newUrl);
  };

  // fetch all users (fullName, userName)
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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

  // Handle new post submission and add it to the posts list
  const handleNewPost = async (newPost) => {
    setPosts([newPost, ...posts]); // Add new post at the top
  };

  const handlePostRemoved = (repostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== repostId)); // Remove repost
  };

  const handleDeletePost = async (postId) => {
    // Find the post by its ID
    const postToDelete = posts.find((post) => post._id === postId);

    // Check if the current user is the owner of the post
    if (!postToDelete || postToDelete.userId !== currentUserId) {
      alert("You are not OWNER of this post.");
      return;
    }
    try {
      const response = await fetch(`/api/tweet/posts/${postId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        // Remove deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        console.error(result.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
      await fetchUsers();
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
            userId={userId}
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
              pathname === `/${userName}/with_replies` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("with_replies")}
          >
            Replies
          </div>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}/likes` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("likes")}
          >
            Likes
          </div>
          <div className={styles.pageItem}>Highlights</div>
          <div className={styles.pageItem}>Media</div>
        </div>

        <div className={styles.contentSection}>
          {pathname === `/${userName}` && (
            <UserPost
              posts={posts}
              originalPosts={posts} // pass same posts to find originals
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              currentUserId={userId}
              users={users}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
          {pathname === `/${userName}/with_replies` && (
            <UserReply
              posts={posts}
              originalPosts={posts} // Contains all posts to find original post if needed
              users={users}
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
          {pathname === `/${userName}/likes` && (
            <UserLike
              posts={posts}
              userId={userId}
              users={users}
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainSection;
