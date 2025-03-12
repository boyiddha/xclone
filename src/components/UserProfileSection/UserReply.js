"use client";
import styles from "./userReply.module.css";
import Image from "next/image";
import NewsFeedHeader from "../MainSection/NewsFeedHeader";
import NewsFeedFooter from "../MainSection/NewsFeedFooter";
import { useRouter } from "next/navigation";

const UserReply = ({
  posts,
  originalPosts, // Contains all posts to find original post if needed
  users,
  fullName,
  userName,
  userImage,
  onDeletePost,
  onPostReposted,
  handlePostRemoved,
}) => {
  const router = useRouter();

  return (
    <>
      {posts
        .filter((post) => post.parentPostId) // Only include replied posts
        .map((post) => {
          const mainPost = originalPosts.find(
            (p) => p._id === post.parentPostId
          );
          const ownerUserId = mainPost?.userId;
          const postOwner = ownerUserId
            ? users.find((u) => u._id === ownerUserId)
            : null;
          const replyToUserName = postOwner?.userName || "";

          return (
            <div key={post?._id} className={styles.mainDiv}>
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
                <div className={styles.content}>
                  <div className={styles.header}>
                    <NewsFeedHeader
                      fullName={fullName}
                      userName={userName}
                      postId={post?._id}
                      onDeletePost={onDeletePost}
                    />
                  </div>
                  <div className={styles.replyToDiv}>
                    <span className={styles.replyTotext}>Replying to </span>
                    <span className={styles.replyTo}>@{replyToUserName}</span>
                  </div>
                  <div
                    className={styles.mainContentDiv}
                    onClick={() =>
                      router.push(`/${post.userName}/status/${post?._id}`)
                    }
                  >
                    {post?.content && (
                      <div className={styles.postContent}>{post?.content}</div>
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
        })}
    </>
  );
};

export default UserReply;
