"use client";

import styles from "./userLike.module.css";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { IoMdLock } from "react-icons/io";

import NewsFeedHeader from "../MainSection/NewsFeedHeader";
import NewsFeedFooter from "../MainSection/NewsFeedFooter";
import { useRouter } from "next/navigation";

const UserLike = ({
  posts,
  userId,
  users,
  fullName,
  userName,
  userImage,
  onDeletePost,
  onPostReposted,
  handlePostRemoved,
}) => {
  // Filter posts liked by the logged-in user
  const likedPosts = posts.filter((post) => post.likes.includes(userId));
  const router = useRouter();

  return (
    <>
      <div className={styles.message}>
        <div className={styles.messageTitle}>
          <IoMdLock />
          <span className={styles.messageText}>
            Your likes are private. Only you can see them.
          </span>
        </div>
      </div>
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => {
          // Find the author of the post
          const author = users.find((user) => user._id === post.userId) || {};

          return (
            <div key={post?._id} className={styles.mainDiv}>
              <div className={styles.postContainer}>
                <div className={styles.profile}>
                  {author.image && (
                    <Image
                      className={styles.img}
                      src={author?.image}
                      alt="user profile"
                      width="35"
                      height="35"
                    />
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <NewsFeedHeader
                      fullName={author.fullName}
                      userName={author.userName}
                      postId={post?._id}
                      onDeletePost={onDeletePost}
                    />
                  </div>
                  {/* <div>
                    <span className={styles.time}>
                      • {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div> */}

                  <div
                    className={styles.mainContentDiv}
                    onClick={() =>
                      router.push(`/${author?.userName}/status/${post?._id}`)
                    }
                  >
                    {post?.content && (
                      <div className={styles.postContent}>{post?.content}</div>
                    )}
                    {/* Display Media File (if exists) */}
                    {post?.media?.data && (
                      <div>
                        {post?.media.contentType.startsWith("image/") ? (
                          <img
                            src={`data:${post?.media.contentType};base64,${post?.media.data}`}
                            alt={post?.media.name || "Uploaded Image"}
                            className={styles.media}
                          />
                        ) : post?.media.contentType.startsWith("audio/") ? (
                          <audio controls className={styles.media}>
                            <source
                              src={`data:${post?.media.contentType};base64,${post?.media.data}`}
                              type={post?.media.contentType}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) : post?.media.contentType.startsWith("video/") ? (
                          <video controls className={styles.media}>
                            <source
                              src={`data:${post?.media.contentType};base64,${post?.media.data}`}
                              type={post?.media.contentType}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p>
                            Unsupported file type: {post?.media.contentType}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.reaction}>
                    <NewsFeedFooter
                      postId={post?._id}
                      likes={post?.likes}
                      reposts={post?.reposts}
                      comments={post?.comments}
                      onPostReposted={onPostReposted}
                      onPostRemove={handlePostRemoved}
                      userImage={userImage}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.row2}>
                <hr className={styles.lineBreak} />
              </div>
            </div>
          );
        })
      ) : (
        <p className={styles.noLikesMessage}>
          You haven't liked any posts yet.
        </p>
      )}
    </>
  );
};

export default UserLike;
