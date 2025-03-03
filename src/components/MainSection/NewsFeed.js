// "use client";
// import styles from "./newsFeed.module.css";
// import user from "./../../../public/images/user.jpeg";
// import Image from "next/image";

// import NewsFeedHeader from "./NewsFeedHeader";
// import NewsFeedFooter from "./NewsFeedFooter";

// const NewsFeed = ({
//   posts,
//   originalPosts, // contain all posts to find original post of a a repost
//   fullName,
//   userName,
//   onDeletePost,
//   onPostReposted,
//   handlePostRemoved,
// }) => {
//   return (
//     <>
//       {posts.map((post) => (
//         <div key={post._id} className={styles.mainDiv}>
//           <div className={styles.postContainer}>
//             <div className={styles.profile}>
//               <Image
//                 className={styles.img}
//                 src={user}
//                 alt="user profile"
//                 width="35"
//                 height="35"
//               />
//             </div>
//             <div className={styles.content}>
//               <div className={styles.header}>
//                 <NewsFeedHeader
//                   fullName={fullName}
//                   userName={userName}
//                   postId={post._id}
//                   onDeletePost={onDeletePost}
//                 />
//               </div>
//               <div className={styles.mainText}>
//                 {/* Display Text Content */}
//                 {post.content && (
//                   <div className={styles.postContent}>{post.content}</div>
//                 )}

//                 {/* Display Media File (if exists) */}
//                 {post.media && post.media.data && (
//                   <div>
//                     {post.media.contentType.startsWith("image/") ? (
//                       <img
//                         src={`data:${post.media.contentType};base64,${post.media.data}`}
//                         alt={post.media.name || "Uploaded Image"}
//                         className={styles.media}
//                       />
//                     ) : post.media.contentType.startsWith("audio/") ? (
//                       <audio controls className={styles.media}>
//                         <source
//                           src={`data:${post.media.contentType};base64,${post.media.data}`}
//                           type={post.media.contentType}
//                         />
//                         Your browser does not support the audio element.
//                       </audio>
//                     ) : post.media.contentType.startsWith("video/") ? (
//                       <video controls className={styles.media}>
//                         <source
//                           src={`data:${post.media.contentType};base64,${post.media.data}`}
//                           type={post.media.contentType}
//                         />
//                         Your browser does not support the video tag.
//                       </video>
//                     ) : (
//                       <p>Unsupported file type: {post.media.contentType}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className={styles.reaction}>
//                 <NewsFeedFooter
//                   postId={post._id}
//                   likes={post.likes}
//                   reposts={post.reposts}
//                   onPostReposted={onPostReposted}
//                   onPostRemove={handlePostRemoved}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className={styles.row2}>
//             <hr className={styles.lineBreak} />
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default NewsFeed;

"use client";
import styles from "./newsFeed.module.css";
import user from "./../../../public/images/user.jpeg";
import Image from "next/image";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedFooter from "./NewsFeedFooter";
import { BiRepost } from "react-icons/bi";

const NewsFeed = ({
  posts,
  originalPosts, // Contains all posts to find original post if needed
  fullName,
  userName,
  onDeletePost,
  onPostReposted,
  handlePostRemoved,
}) => {
  return (
    <>
      {posts.map((post) => {
        // Find the original post if it's a repost
        const isRepost = !!post.reposted;
        const originalPost = isRepost
          ? originalPosts.find((p) => p._id === post.reposted)
          : post; // If not a repost, use the post itself

        return (
          <div key={post._id} className={styles.mainDiv}>
            {/* Show "You reposted" if it's a repost */}
            {isRepost && (
              <div className={styles.repostedText}>
                <span>
                  <BiRepost className={styles.repostedIcon} />
                </span>
                <span>You reposted</span>
              </div>
            )}

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
                  {/* Display Content */}
                  {originalPost.content && (
                    <div className={styles.postContent}>
                      {originalPost.content}
                    </div>
                  )}

                  {/* Display Media File (if exists) */}
                  {originalPost.media?.data && (
                    <div>
                      {originalPost.media.contentType.startsWith("image/") ? (
                        <img
                          src={`data:${originalPost.media.contentType};base64,${originalPost.media.data}`}
                          alt={originalPost.media.name || "Uploaded Image"}
                          className={styles.media}
                        />
                      ) : originalPost.media.contentType.startsWith(
                          "audio/"
                        ) ? (
                        <audio controls className={styles.media}>
                          <source
                            src={`data:${originalPost.media.contentType};base64,${originalPost.media.data}`}
                            type={originalPost.media.contentType}
                          />
                          Your browser does not support the audio element.
                        </audio>
                      ) : originalPost.media.contentType.startsWith(
                          "video/"
                        ) ? (
                        <video controls className={styles.media}>
                          <source
                            src={`data:${originalPost.media.contentType};base64,${originalPost.media.data}`}
                            type={originalPost.media.contentType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p>
                          Unsupported file type:{" "}
                          {originalPost.media.contentType}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.reaction}>
                  <NewsFeedFooter
                    postId={post._id}
                    likes={post.likes}
                    reposts={post.reposts}
                    onPostReposted={onPostReposted}
                    onPostRemove={handlePostRemoved}
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
