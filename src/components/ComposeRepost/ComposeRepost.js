"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./composeRepost.module.css";

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
}) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [post, setPost] = useState(null); // To store fetched reposted post info
  const textAreaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchRepostedPost = async () => {
      try {
        const res = await fetch(`/api/tweet/posts/${repostedId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          console.error("Failed to fetch reposted post");
        }
      } catch (error) {
        console.error("Error fetching reposted post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (repostedId) {
      fetchRepostedPost(); // Fetch reposted post first
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
      let postId = repostedId;
      const res = await fetch("/api/tweet/repost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, currentUserId, content }),
      });
      if (res.ok) {
        const result = await res.json();

        setContent(""); // Clear content
        setFile(null); // Reset file

        setReposted(result.reposted);
        setRepostedCount(result.reposts);
        if (result.reposted) {
          // do an repost
          // update the posts in <MainSection/> to get the updated result in NewsFeed
          onPostReposted(result.newPost);
        } else {
          // remove repost
          // update the posts in parent
          //console.log("removed reposted id : ", data.removedRepostedId);
          onPostRemove(result.removedRepostedId);
        }

        handleCloseRepost();
      } else {
        alert("Repost failed");
      }
    } catch (error) {
      console.error("Error posting:", error);
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
