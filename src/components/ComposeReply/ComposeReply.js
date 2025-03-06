"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./composeReply.module.css";

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
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerUserName, setOwnerUserName] = useState("");
  const [ownerUserImage, setOwnerUserImage] = useState(null);
  const [ownerUserId, setOwnerUserId] = useState("");
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
          // Set the ownerUserId after fetching the reposted post
          setOwnerUserId(data.post.userId);
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

  useEffect(() => {
    const fetchOwner = async () => {
      if (!ownerUserId) return; // Don't run fetchOwner until ownerUserId is set

      const res = await fetch(`/api/users/${ownerUserId}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setOwnerFullName(data.user.fullName);
        setOwnerUserName(data.user.userName);
        setOwnerUserImage(data.user.image || null);
      } else {
        console.error("Failed to fetch owner");
      }
    };

    if (ownerUserId) {
      fetchOwner(); // Now fetch owner only after ownerUserId is set
    }
  }, [ownerUserId]); // Depend on ownerUserId to trigger fetchOwner when it changes

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
        {loading ? (
          <div className={styles.spinner}></div> // Show spinner when loading
        ) : (
          <div className={styles.postContainer}>
            <div className={styles.profile}>
              {ownerUserImage && (
                <Image
                  className={styles.img}
                  src={ownerUserImage}
                  alt="user profile"
                  width="35"
                  height="35"
                />
              )}
            </div>
            <div className={styles.column2}>
              <div className={styles.name}>
                <span className={styles.fullname}>{ownerFullName}</span>

                <span className={styles.username}>{ownerUserName}</span>
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
            {ownerUserImage && (
              <Image
                className={styles.img}
                src={ownerUserImage}
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

export default ComposeRepost;
