"use client";

import ComposePost from "./ComposePost";
import styles from "./mainSection.module.css";
import NewsFeed from "./NewsFeed";

import { useState, useEffect } from "react";

const MainSection = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the API
  const fetchPosts = async () => {
    const res = await fetch("/api/posts", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(data); // Update posts state
    } else {
      console.error("Failed to fetch posts");
    }
  };

  // Handle new post submission and add it to the posts list
  const handleNewPost = async (newPost) => {
    setPosts([newPost, ...posts]); // Add new post at the top
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className={styles.feed}>
        <div className={styles.head}>
          <div className={styles.you}>For you</div>
          <div className={styles.following}>Following</div>
        </div>
        <div>
          <hr className={styles.lineBreak} />
        </div>
        <div>
          {" "}
          <ComposePost onPostCreated={handleNewPost} />{" "}
        </div>
        <div>
          <hr className={styles.lineBreak} />
          <br />
          <hr className={styles.lineBreak} />
        </div>
        <div>
          <NewsFeed posts={posts} />
        </div>
      </div>
    </>
  );
};

export default MainSection;
