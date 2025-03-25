"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./composeRepost.module.css";
import { fetchPost, repostTweet } from "@/app/actions/tweetActions";
import { createNotification } from "@/app/actions/notificationActions";

import { RxCross2 } from "react-icons/rx";
import Image from "next/image";

const ComposeRepost = ({
  onPostReposted,
  setReposted,
  setRepostedCount,
  handleCloseRepost,
  repostedId,
  userImage,
  currentUserId,
  ownerId,
}) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [post, setPost] = useState(null); // To store fetched reposted post info
  const textAreaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const getRepostedPost = async () => {
      if (!repostedId) return;
      const post = await fetchPost(repostedId);
      setPost(post);
      setLoading(false);
    };

    if (repostedId) {
      getRepostedPost(); // Fetch reposted post first
    }
  }, [repostedId]); // Depend only on repostedId to fetch the reposted post

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto"; // Auto adjust textarea height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set new height based on content
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const result = await repostTweet({ repostedId, currentUserId, content });

      setContent(""); // Clear content
      setFile(null); // Reset file

      setReposted(result.reposted);
      setRepostedCount(result.reposts);

      if (result.reposted) {
        // If the user reposted the post, create a notification
        await createNotification({
          recipient: ownerId, // post owner Id
          sender: currentUserId,
          postId: repostedId,
          type: "repostWithQuote",
        });

        // Update posts in <MainSection/> to reflect the repost
        onPostReposted(result.newPost);
      } else {
        // Remove repost
        onPostRemove(result.removedRepostedId);
      }

      handleCloseRepost();
    } catch (error) {
      console.error("Repost failed:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div onClick={handleCloseRepost} className={styles.closeButton}>
          <RxCross2 />
        </div>
        <div className={styles.inputField}>
          <div className={styles.profile}>
            {userImage && (
              <Image
                className={styles.img}
                src={userImage}
                alt="user profile"
                width="35"
                height="35"
              />
            )}
          </div>
          <div className={styles.textArea}>
            <textarea
              ref={textAreaRef}
              value={content}
              onChange={handleChange}
              placeholder="Add a comment"
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.spinner}></div> // Show spinner when loading
        ) : (
          <div className={styles.postContainer}>
            <div className={styles.contentDiv}>
              <div className={styles.postHeader}>
                {post?.userId?.image && (
                  <Image
                    className={styles.img}
                    src={post?.userId?.image}
                    alt="user profile"
                    width="35"
                    height="35"
                  />
                )}

                <span className={styles.fullname}>
                  {post?.userId?.fullName}
                </span>

                <span className={styles.username}>
                  {post?.userId?.userName}
                </span>
              </div>
              <div className={styles.postContent}>
                {/* Display Content */}
                {post?.content && (
                  <div className={styles.postContentText}>{post?.content}</div>
                )}

                {/* Display Media File (if exists) */}
                {post?.media?.data && (
                  <div>
                    {post?.media.contentType.startsWith("image/") ? (
                      <img
                        src={`data:${post?.media.contentType};base64,${post.media.data}`}
                        alt={post?.media.name || "Uploaded Image"}
                        className={styles.media}
                      />
                    ) : post?.media.contentType.startsWith("audio/") ? (
                      <audio controls className={styles.media}>
                        <source
                          src={`data:${post?.media.contentType};base64,${post.media.data}`}
                          type={post?.media.contentType}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    ) : post?.media.contentType.startsWith("video/") ? (
                      <video controls className={styles.media}>
                        <source
                          src={`data:${post?.media.contentType};base64,${post.media.data}`}
                          type={post?.media.contentType}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <p>Unsupported file type: {post?.media.contentType}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className={`${styles.postButton} ${isActive ? styles.active : ""}`}
          onClick={() => {
            if (isActive) {
              handleSubmit();
            }
          }}
        >
          Post
        </div>
      </div>
    </div>
  );
};

export default ComposeRepost;
