"use client";

import ComposePost from "./ComposePost";
import styles from "./mainSection.module.css";
import NewsFeed from "./NewsFeed";

import { useState, useEffect } from "react";

const MainSection = () => {
  const [posts, setPosts] = useState([]);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [err, setError] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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

  // Fetch posts from the API
  const fetchAllPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        setPosts(result.posts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      setError("Failed to fetch posts " + error.message);
    } finally {
      setLoading(false);
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
      setCurrentUserId(data._id);
    } else {
      console.error("Failed to fetch Me");
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

  // Fetch posts on component mount
  useEffect(() => {
    fetchUsers();
    fetchAllPosts();
    fetchMe();
  }, []);

  return (
    <>
      <div className={styles.feed}>
        <div className={styles.head}>
          <div className={styles.you}>For you</div>
          <div className={styles.following}>Following</div>
        </div>

        <div>
          {" "}
          <ComposePost
            onPostCreated={handleNewPost}
            userImage={userImage}
          />{" "}
        </div>
        <div>
          <hr className={styles.lineBreak} />
          <br />
          <hr className={styles.lineBreak} />
        </div>
        <div>
          {loading ? (
            <div className={styles.spinner}></div> // Show spinner when loading
          ) : (
            <NewsFeed
              posts={posts}
              originalPosts={posts} // pass same posts to find originals
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              currentUserId={currentUserId}
              users={users}
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
