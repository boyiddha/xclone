"use client";

import { useState, useRef } from "react";
import styles from "./composePost.module.css";
import user from "./../../../public/images/user.jpeg";
import { BsImage } from "react-icons/bs";
import Image from "next/image";

const ComposePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Store the image preview URL
  const [imageData, setImageData] = useState(null); // Store image as Base64 string
  const textAreaRef = useRef(null);

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
        setImageData(reader.result.split(",")[1]); // Set Base64 string (remove 'data:image/png;base64,')
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageData) return; // Ensure at least content or image is provided

    const formData = new FormData();
    formData.append("content", content); // Append content
    if (imageData) {
      formData.append("image", imageData); // Append Base64 image data if exists
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newPost = await res.json();
      setContent(""); // Clear textarea after posting
      setImagePreview(null); // Clear image preview
      setImageData(null); // Clear Base64 string
      onPostCreated(newPost); // Call the parent callback to add the new post
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // Reset textarea height
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
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={handleChange}
            placeholder="What's happening?!"
            style={{ overflow: "hidden" }}
          />
          <hr className={styles.lineBreak} />
          <div className={styles.media}>
            <label className={styles.mediaIcon}>
              <BsImage />
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className={styles.tooltip}>Media</div>
            </label>
            {imagePreview && (
              <img
                className={styles.imagePreview}
                src={imagePreview}
                alt="Preview"
              />
            )}
            <div
              className={`${styles.postBtn} ${
                content.trim() || imageData ? styles.active : ""
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
