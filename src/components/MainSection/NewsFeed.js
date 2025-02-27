"use client";
import styles from "./newsFeed.module.css";
import user from "./../../../public/images/user.jpeg";
import Image from "next/image";

import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedFooter from "./NewsFeedFooter";

const NewsFeed = ({ posts, fullName, userName }) => {
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
                <NewsFeedHeader fullName={fullName} userName={userName} />
              </div>
              <div className={styles.mainText}>
                {post.content}
                {/* <span>{new Date(post.createdAt).toLocaleString()}</span> */}
                {post.image && (
                  <img
                    src={`data:${post.imageType};base64,${post.image.toString(
                      "base64"
                    )}`}
                    alt="Post image"
                  />
                )}
              </div>
              <div className={styles.reaction}>
                <NewsFeedFooter />
              </div>
            </div>
          </div>
          <div className={styles.row2}>
            <hr className={styles.lineBreak} />
          </div>
        </div>
      ))}

      {/* 
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
            <NewsFeedHeader fullName={fullName} userName={userName} />
          </div>
          <div className={styles.mainText}>
            <h1>main text here</h1>
          </div>
          <div className={styles.reaction}>
            <NewsFeedFooter />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default NewsFeed;
