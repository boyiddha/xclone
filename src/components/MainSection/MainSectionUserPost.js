"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./mainSectionUserPost.module.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";

import UserPostFooter from "./UserPostFooter";
import UserPostHeader from "./UserPostHeader";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { BiRepost } from "react-icons/bi";
import CommentSection from "../CommentSection/CommentSection";
import Image from "next/image";

const MainSectionUserPost = () => {
  const { username, postId } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/tweet/posts/${postId}`, {
          method: "GET",
        });
        const result = await response.json();

        if (response.ok) {
          setPost(result.post); // Stores the full post object (includes userId & comments)
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Determine actual post content and user info if reposted
  const actualPost = post?.reposted ? post.reposted : post;
  const parentPost = post?.parentPostId;

  return (
    <div className={styles.postContainer}>
      {/* Back Button */}
      <div className={styles.back}>
        <span
          className={styles.backIcon}
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <IoArrowBackSharp />
        </span>
        <span className={styles.backTitle}>Post</span>
      </div>

      {/* Error or Loading State */}
      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <div className={styles.spinner}></div>
      ) : (
        <div className={styles.content}>
          {/* if it is a commented post then show parnet post data  */}
          {parentPost && (
            <div className={styles.parentPost}>
              <div className={styles.column1}>
                <div className={styles.profileImg}>
                  {parentPost?.userId?.image && (
                    <Image
                      className={styles.img}
                      src={parentPost?.userId?.image}
                      alt="user profile"
                      width="35"
                      height="35"
                    />
                  )}
                </div>
                <div className={styles.verticalLine}></div>
              </div>
              <div className={styles.column2}>
                <div className={styles.profileName}>
                  <div>
                    <span className={styles.fullName}>
                      {parentPost?.userId?.fullName}
                    </span>
                    <span className={styles.userName}>
                      {parentPost?.userId?.userName}
                    </span>
                  </div>
                  <div className={styles.more}>
                    <IoIosMore />
                  </div>
                </div>
                <div className={styles.contentDiv}>{parentPost?.content}</div>
                <div className={styles.reaction}>
                  <UserPostFooter post={parentPost} postId={parentPost?._id} />
                </div>
              </div>
              {/* <UserPostHeader
                fullName={parentPost?.userId?.fullName}
                userName={parentPost?.userId?.userName}
                ownerImage={parentPost?.userId?.image}
                postId={parentPost?._id}
              />
              <div className={styles.mainText}>{parentPost?.content}</div>
              <UserPostFooter post={parentPost} postId={parentPost?._id} /> */}
            </div>
          )}

          {/* Repost Indicator */}
          {post?.reposted && (
            <div className={styles.repostedText}>
              <BiRepost className={styles.repostedIcon} />
              <span>You reposted</span>
            </div>
          )}

          {/* Post Header (User Info) */}
          <UserPostHeader
            fullName={actualPost?.userId?.fullName}
            userName={actualPost?.userId?.userName}
            ownerImage={actualPost?.userId?.image}
            postId={postId}
          />

          {/* Post Content */}
          <div className={styles.mainText}>
            {actualPost?.content && (
              <div className={styles.postContent}>{actualPost.content}</div>
            )}
            {actualPost?.media?.data && (
              <div>
                {actualPost.media.contentType.startsWith("image/") ? (
                  <img
                    src={`data:${actualPost.media.contentType};base64,${actualPost.media.data}`}
                    alt="Uploaded Image"
                    className={styles.media}
                  />
                ) : actualPost.media.contentType.startsWith("audio/") ? (
                  <audio controls className={styles.media}>
                    <source
                      src={`data:${actualPost.media.contentType};base64,${actualPost.media.data}`}
                      type={actualPost.media.contentType}
                    />
                    Your browser does not support the audio element.
                  </audio>
                ) : actualPost.media.contentType.startsWith("video/") ? (
                  <video controls className={styles.media}>
                    <source
                      src={`data:${actualPost.media.contentType};base64,${actualPost.media.data}`}
                      type={actualPost.media.contentType}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>Unsupported file type: {actualPost.media.contentType}</p>
                )}
              </div>
            )}
          </div>

          {/* View Post Engagement */}
          <div className={styles.row2}>
            <hr className={styles.lineBreak} />
          </div>
          <div className={styles.view}>
            <RiBarChartGroupedLine className={styles.viewIcon} />
            View post engagements
          </div>

          {/* Post Footer (Reactions, Comments, etc.) */}
          <div className={styles.row2}>
            <hr className={styles.lineBreak} />
          </div>
          <UserPostFooter
            post={post}
            postId={postId}
            replyCount={post?.comments?.length || 0}
          />

          {/* Comment Section */}
          <div className={styles.row2}>
            <hr className={styles.lineBreak} />
          </div>
          {post?.comments?.length > 0 && (
            <CommentSection comments={post.comments} />
          )}
        </div>
      )}
    </div>
  );
};

export default MainSectionUserPost;
