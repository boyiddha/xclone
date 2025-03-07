"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./composeReply.module.css";

import { RxCross2 } from "react-icons/rx";
import Image from "next/image";

const ComposeReply = ({
  onPostReplied,
  setRepliedCount,
  handleCloseReply,
  repliedPostId,
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
    const fetchRepliedPost = async () => {
      try {
        const res = await fetch(`/api/tweet/posts/${repliedPostId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
          // console.log("✅  data: ", data.post);
        } else {
          console.error("Failed to fetch reposted post");
        }
      } catch (error) {
        console.error("Error fetching reposted post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (repliedPostId) {
      fetchRepliedPost(); // Fetch reposted post first
    }
  }, [repliedPostId]); // Depend only on repostedId to fetch the reposted post

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto"; // Auto adjust textarea height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set new height based on content
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/tweet/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: repliedPostId,
          currentUserId,
          content,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Reply failed:", result.message);
        alert(result.message || "Failed to post reply");
        return;
      }

      setContent(""); // Clear content
      setFile(null); // Reset file

      setRepliedCount(result.commentCount || 0); // Ensure fallback if undefined

      // Notify parent component to update UI
      onPostReplied(result.replyPost);

      handleCloseReply();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div onClick={handleCloseReply} className={styles.closeButton}>
          <RxCross2 />
        </div>
        {loading ? (
          <div className={styles.spinner}></div> // Show spinner when loading
        ) : (
          <div className={styles.postContainer}>
            <div className={styles.profile}>
              {post?.userId?.image && (
                <Image
                  className={styles.img}
                  src={post?.userId?.image}
                  alt="user profile"
                  width="35"
                  height="35"
                />
              )}
            </div>
            <div className={styles.column2}>
              <div className={styles.name}>
                <span className={styles.fullname}>
                  {post?.userId?.fullName}
                </span>

                <span className={styles.username}>
                  {post?.userId?.userName}
                </span>
              </div>
              <div className={styles.postContent}>
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

        <div className={styles.postContainer}>
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
              placeholder="Add another post"
            />
          </div>
        </div>

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

export default ComposeReply;
