"use client";

import ComposePost from "./ComposePost";
import styles from "./mainSection.module.css";
import NewsFeed from "./NewsFeed";
import { deletePost, fetchAllPostsData } from "@/app/actions/tweetActions";
import { fetchUsersData, getLoggedInUser } from "@/app/actions/userActions";

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
      const data = await fetchUsersData(); // Get users from the API
      setUsers(data); // Set users if successfully fetched
    } catch (error) {
      console.error("Error fetching users:", error); // Handle error
    }
  };

  // Fetch posts from the API

  const fetchAllPosts = async () => {
    try {
      const posts = await fetchAllPostsData(); // Get posts from the API

      if (posts.length) {
        setPosts(posts); // Set posts if successfully fetched
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      setError("Failed to fetch posts " + error.message); // Handle error
    } finally {
      setLoading(false); // End loading state
    }
  };

  const fetchMe = async () => {
    const data = await getLoggedInUser();
    if (data) {
      setFullName(data.fullName);
      setUserName(data.userName);
      setUserImage(data.image || null);
      setCurrentUserId(data._id);
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
      //alert("You are not OWNER of this post.");
      return false;
    }

    try {
      const success = await deletePost(postId);

      if (success) {
        // Show a success toast if the post is deleted

        // Remove deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
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
