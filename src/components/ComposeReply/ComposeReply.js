"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./composeReply.module.css";
import { postReply, fetchPost } from "@/app/actions/tweetActions";
import { createNotification } from "@/app/actions/notificationActions";

import { RxCross2 } from "react-icons/rx";
import Image from "next/image";

const ComposeReply = ({
  onPostReplied,
  setRepliedCount,
  handleCloseReply,
  repliedPostId,
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
    const getRepliedPost = async () => {
      if (!repliedPostId) return;
      const post = await fetchPost(repliedPostId);
      setPost(post);
      setLoading(false);
    };

    getRepliedPost();
  }, [repliedPostId]);

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto"; // Auto adjust textarea height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set new height based on content
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      // Post the reply
      const { result, res } = await postReply({
        repliedPostId,
        currentUserId,
        content,
      });

      if (!res.ok) {
        console.error("Reply failed:", result.message);
        alert(result.message || "Failed to post reply");
        return;
      }

      setContent(""); // Clear content
      setFile(null); // Reset file

      // if the user commented on the post create a notification
      await createNotification({
        recipient: ownerId, // post owner Id
        sender: currentUserId,
        postId: repliedPostId,
        type: "comment",
      });

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
                      <Image
                        src={`data:${post?.media.contentType};base64,${post.media.data}`}
                        alt={post?.media.name || "Uploaded Image"}
                        className={styles.media}
                        loader={base64Loader}
                        width={500}
                        height={300}
                        unoptimized
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
