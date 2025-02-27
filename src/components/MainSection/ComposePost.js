"use client";

import styles from "./composePost.module.css";
import user from "./../../../public/images/user.jpeg";
import { BsImage } from "react-icons/bs";

import { useRef, useState } from "react";
import Image from "next/image";

const ComposePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const textAreaRef = useRef(null); // Reference for textarea
  const handleChange = (e) => {
    setContent(e.target.value);
    // Adjust the textarea height to fit the content
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const newPost = await res.json();
      setContent(""); // Clear textarea after posting
      onPostCreated(newPost); // Call the parent callback to add the new post

      // Reset textarea height after posting
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // Set to initial height
      }
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <>
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
        <div className={styles.textArea}>
          <div>
            <textarea
              ref={textAreaRef} // Attach ref to textarea
              value={content}
              onChange={handleChange}
              placeholder="What is happening?!"
              style={{ overflow: "hidden" }}
            />
            <hr className={styles.lineBreak} />
          </div>
          <div className={styles.media}>
            <div className={styles.mediaIcon}>
              <BsImage />
              <div className={styles.tooltip}>Media</div>
            </div>
            <div
              className={`${styles.postBtn} ${
                content.trim() ? styles.active : ""
              }`}
              onClick={handleSubmit}
            >
              Post
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposePost;
