"use client";
import styles from "./newsFeed.module.css";
import user from "./../../../public/images/user.jpeg";
import Image from "next/image";

import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedFooter from "./NewsFeedFooter";

const NewsFeed = ({ posts, fullName, userName, onDeletePost }) => {
  return (
    <>
      {posts.map((post) => (
        <div key={post._id} className={styles.mainDiv}>
          <div className={styles.postContainer}>
            <div className={styles.profile}>
              <Image
                className={styles.img}
                src={user}
                alt="user profile"
                width="35"
                height="35"
              />
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <NewsFeedHeader
                  fullName={fullName}
                  userName={userName}
                  postId={post._id}
                  onDeletePost={onDeletePost}
                />
              </div>
              <div className={styles.mainText}>
                {/* Display Text Content */}
                {post.content && (
                  <div className={styles.postContent}>{post.content}</div>
                )}

                {/* Display Media File (if exists) */}
                {post.media && post.media.data && (
                  <div>
                    {post.media.contentType.startsWith("image/") ? (
                      <img
                        src={`data:${post.media.contentType};base64,${post.media.data}`}
                        alt={post.media.name || "Uploaded Image"}
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
              <div className={styles.reaction}>
                <NewsFeedFooter  postId={post._id} likes={post.likes}/>
              </div>
            </div>
          </div>
          <div className={styles.row2}>
            <hr className={styles.lineBreak} />
          </div>
        </div>
      ))}
    </>
  );
};

export default NewsFeed;
