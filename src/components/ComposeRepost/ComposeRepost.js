import { useState } from "react";

const ComposeRepost = ({ onPostCreated, repostedPost = null }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!content.trim() && !file && !repostedPost) return;

    const data = new FormData();
    if (file) data.append("file", file);
    data.append("content", content);
    if (repostedPost) data.append("repostedPostId", repostedPost._id); // Include original post ID

    try {
      const res = await fetch("/api/tweet/posts", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        onPostCreated(result.post);
        setContent("");
        setFile(null);
      } else {
        alert("Post failed");
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <>
      <h1>box</h1>
      {/* <div className={styles.postContainer}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your thoughts..."
        />

        {repostedPost && (
          <div className={styles.repostPreview}>
            <p>Reposting:</p>
            <div className={styles.repostContent}>{repostedPost.content}</div>
          </div>
        )}

        <button className={styles.postBtn} onClick={handleSubmit}>
          Post
        </button>
      </div> */}
    </>
  );
};

export default ComposeRepost;
