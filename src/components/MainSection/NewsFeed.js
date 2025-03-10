"use client";
import styles from "./newsFeed.module.css";

import Image from "next/image";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedFooter from "./NewsFeedFooter";
import { BiRepost } from "react-icons/bi";
import { useRouter } from "next/navigation";

const NewsFeed = ({
  posts,
  originalPosts, // Contains all posts to find original post if needed
  fullName,
  userName,
  userImage,
  currentUserId,
  users,
  onDeletePost,
  onPostReposted,
  handlePostRemoved,
}) => {
  const router = useRouter();

  return (
    <>
      {posts.map((post) => {
        // Find the original post if it's a repost
        const isRepost = !!post?.reposted;
        const isRepostWithText = post?.reposted && post?.content;

        const originalPost = isRepost
          ? originalPosts.find((p) => p._id === post?.reposted)
          : post; // If not a repost, use the post itself

        // Find original post owner info if it's a repost with text
        let ownerFullName = "";
        let ownerUserName = "";
        let ownerImage = null;
        let ownerId = "";

        const owner = users?.find((user) => user._id === originalPost?.userId);
        ownerFullName = owner?.fullName || "Unknown";
        ownerUserName = owner?.userName || "Unknown";
        ownerImage = owner?.image || null;
        ownerId = owner?._id;

        const isReplyPost = post?.parentPostId;

        // Find the original post if it's a reply
        const mainPost = isReplyPost
          ? originalPosts.find((p) => p._id === post.parentPostId)
          : null;

        // Get the owner user ID from the original post
        const ownerUserId = mainPost?.userId;

        // Find the owner user object to get the username
        const postOwner = ownerUserId
          ? users.find((u) => u._id === ownerUserId)
          : null;

        // Extract the username (or default to an empty string)
        const replyToUserName = postOwner?.userName || "";

        return (
          <div key={post?._id} className={styles.mainDiv}>
            {/* Show "You reposted" if it's a repost */}
            {isRepost && !isRepostWithText && (
              <div className={styles.repostedText}>
                <span>
                  <BiRepost className={styles.repostedIcon} />
                </span>
                <span>You reposted</span>
              </div>
            )}

            <div className={styles.postContainer}>
              <div className={styles.profile}>
                {isRepostWithText
                  ? userImage && (
                      <Image
                        className={styles.img}
                        src={userImage}
                        alt="user profile"
                        width="35"
                        height="35"
                      />
                    )
                  : ownerImage && (
                      <Image
                        className={styles.img}
                        src={ownerImage}
                        alt="user profile"
                        width="35"
                        height="35"
                      />
                    )}
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <NewsFeedHeader
                    fullName={isRepostWithText ? fullName : ownerFullName}
                    userName={isRepostWithText ? userName : ownerUserName}
                    postId={post?._id}
                    onDeletePost={onDeletePost}
                  />
                </div>
                {isReplyPost && (
                  <div className={styles.replyToDiv}>
                    <span className={styles.replyTotext}>Replying to </span>
                    <span className={styles.replyTo}>@{replyToUserName}</span>
                  </div>
                )}
                <div className={styles.mainText}>
                  {isRepostWithText ? (
                    <div>
                      {post?.content && (
                        <div className={styles.postContent}>
                          {post?.content}
                        </div>
                      )}
                      <div
                        className={styles.ownerPostContainer}
                        onClick={() =>
                          router.push(
                            `/${ownerUserName}/status/${originalPost?._id}`
                          )
                        }
                      >
                        <div className={styles.ownerContentDiv}>
                          <div className={styles.ownerPostHeader}>
                            {ownerImage && (
                              <Image
                                className={styles.img}
                                src={ownerImage}
                                alt="user profile"
                                width="35"
                                height="35"
                              />
                            )}

                            <span className={styles.ownerFullname}>
                              {ownerFullName}
                            </span>

                            <span className={styles.ownerUsername}>
                              {ownerUserName}
                            </span>
                          </div>
                          <div className={styles.ownerPostContent}>
                            {/* Display Content */}
                            {originalPost?.content && (
                              <div className={styles.ownerPostText}>
                                {originalPost?.content}
                              </div>
                            )}

                            {/* Display Media File (if exists) */}
                            {originalPost?.media?.data && (
                              <div>
                                {originalPost?.media.contentType.startsWith(
                                  "image/"
                                ) ? (
                                  <img
                                    src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                                    alt={
                                      originalPost?.media.name ||
                                      "Uploaded Image"
                                    }
                                    className={styles.media}
                                  />
                                ) : originalPost?.media.contentType.startsWith(
                                    "audio/"
                                  ) ? (
                                  <audio controls className={styles.media}>
                                    <source
                                      src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                                      type={originalPost?.media.contentType}
                                    />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                ) : originalPost?.media.contentType.startsWith(
                                    "video/"
                                  ) ? (
                                  <video controls className={styles.media}>
                                    <source
                                      src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                                      type={originalPost?.media.contentType}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <p>
                                    Unsupported file type:{" "}
                                    {originalPost?.media.contentType}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.mainContentDiv}
                      onClick={() =>
                        router.push(`/${ownerUserName}/status/${post?._id}`)
                      }
                    >
                      {originalPost?.content && (
                        <div className={styles.postContent}>
                          {originalPost?.content}
                        </div>
                      )}
                      {/* Display Media File (if exists) */}
                      {originalPost?.media?.data && (
                        <div>
                          {originalPost?.media.contentType.startsWith(
                            "image/"
                          ) ? (
                            <img
                              src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                              alt={originalPost?.media.name || "Uploaded Image"}
                              className={styles.media}
                            />
                          ) : originalPost?.media.contentType.startsWith(
                              "audio/"
                            ) ? (
                            <audio controls className={styles.media}>
                              <source
                                src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                                type={originalPost?.media.contentType}
                              />
                              Your browser does not support the audio element.
                            </audio>
                          ) : originalPost?.media.contentType.startsWith(
                              "video/"
                            ) ? (
                            <video controls className={styles.media}>
                              <source
                                src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                                type={originalPost?.media.contentType}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <p>
                              Unsupported file type:{" "}
                              {originalPost?.media.contentType}
                            </p>
                          )}
                        </div>
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
                    ownerId={ownerId}
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

export default NewsFeed;
