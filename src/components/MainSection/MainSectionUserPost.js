"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./mainSectionUserPost.module.css";
import { IoArrowBackSharp } from "react-icons/io5";
import UserPostFooter from "./UserPostFooter";
import UserPostHeader from "./UserPostHeader";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { BiRepost } from "react-icons/bi";

const MainSectionUserPost = () => {
  const { username, postId } = useParams(); // Get dynamic parameters
  const router = useRouter(); // Initialize router for navigation
  const [post, setPost] = useState(null);
  const [isRepost, setIsRepost] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async (id) => {
      try {
        const response = await fetch(`/api/tweet/posts/${id}`, {
          method: "GET",
        });
        const result = await response.json();
        if (result.success) {
          return result.post;
        } else {
          setError("Post not found");
          return null;
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error fetching post");
        return null;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const postData = await fetchPost(postId);

      if (postData?.reposted) {
        // Fetch the original post if this is a repost
        const originalPost = await fetchPost(postData.reposted);
        if (originalPost) {
          setPost(originalPost);
        }
        setIsRepost(true);
      } else {
        setPost(postData);
      }

      setLoading(false);
    };

    const fetchMe = async () => {
      const res = await fetch("/api/me", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setFullName(data.fullName);
      } else {
        console.error("Failed to fetch Me");
      }
    };

    fetchData();
    fetchMe();
  }, [postId]);

  return (
    <>
      <div className={styles.postContainer}>
        <div className={styles.back}>
          <span
            className={styles.backIcon}
            onClick={() => router.back()}
            aria-label="Go back to previous page"
          >
            <IoArrowBackSharp />
          </span>
          <span className={styles.backTitle}>Post</span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          <div className={styles.content}>
            {isRepost && (
              <div className={styles.repostedText}>
                <span>
                  <BiRepost className={styles.repostedIcon} />
                </span>
                <span>You reposted</span>
              </div>
            )}

            <div className={styles.header}>
              <UserPostHeader
                fullName={fullName}
                userName={username}
                postId={postId}
              />
            </div>

            <div className={styles.mainText}>
              {post.content && (
                <div className={styles.postContent}>{post.content}</div>
              )}

              {post.media?.data && (
                <div>
                  {post.media.contentType.startsWith("image/") ? (
                    <img
                      src={`data:${post.media.contentType};base64,${post.media.data}`}
                      alt="Uploaded Image"
                      className={styles.media}
                    />
                  ) : post.media.contentType.startsWith("audio/") ? (
                    <audio controls className={styles.media}>
                      <source
                        src={`data:${post.media.contentType};base64,${post.media.data}`}
                        type={post.media.contentType}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : post.media.contentType.startsWith("video/") ? (
                    <video controls className={styles.media}>
                      <source
                        src={`data:${post.media.contentType};base64,${post.media.data}`}
                        type={post.media.contentType}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p>Unsupported file type: {post.media.contentType}</p>
                  )}
                </div>
              )}
            </div>

            <div className={styles.row2}>
              <hr className={styles.lineBreak} />
            </div>

            <div className={styles.view}>
              <RiBarChartGroupedLine className={styles.viewIcon} />
              View post engagements
            </div>

            <div className={styles.row2}>
              <hr className={styles.lineBreak} />
            </div>

            <div className={styles.reactions}>
              <UserPostFooter post={post} postId={post._id} />
            </div>

            <div className={styles.row2}>
              <hr className={styles.lineBreak} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainSectionUserPost;
