import { useState, useRef, useEffect } from "react";
import styles from "./composePost.module.css";
import user from "./../../../public/images/user.jpeg";
import { BsImage } from "react-icons/bs";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { MdOutlineGifBox } from "react-icons/md";
import { VscVscodeInsiders } from "react-icons/vsc";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";



const ComposePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null); // Store image preview
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null); // Create a reference for the file input

  const handleChange = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleMediaChange = (e) => {
    const selectedFile = e.target.files?.[0];

    // If the selected file is the same as the previous one, reset the input
    if (selectedFile && selectedFile.name === file?.name) {
      e.target.value = ""; // Reset file input value
      setFile(null);
      setMediaPreview(null);
      return;
    }

    if (selectedFile) {
      setFile(selectedFile);

      // Convert file to Base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result); // Store the preview for images, audio, or video
      };
      reader.readAsDataURL(selectedFile); // Reads the file as a Base64 string
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !file) return; // Ensure at least content or image is provided

    const data = new FormData();
    data.append("file", file);
    data.append("content", content);

    try {
      const res = await fetch("/api/tweet/posts", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        //alert("File Uploaded Successfully");
        console.log("resultpost :  ", result.post);
        onPostCreated(result.post);
        // Reset form
        setFile(null);
        setContent("");
        setMediaPreview(null);
        // Reset file input to allow re-selection of the same file
        fileInputRef.current.value = ""; // This allows selecting the same file again
      } else {
        alert("File Upload Failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
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
            style={{ overflow: "hidden", resize: "none", width: "100%" }}
          />
          {mediaPreview && (
            <div className={styles.mediaPreviewContainer}>
              <button
                className={styles.removePreviewBtn}
                onClick={() => {
                  setFile(null); // Remove the selected file
                  setMediaPreview(null); // Clear the preview
                }}
              >
                <ImCross />
              </button>

              {file?.type.startsWith("image/") && (
                <img
                  src={mediaPreview}
                  alt="Media preview"
                  className={styles.mediaPreview}
                />
              )}

              {file?.type.startsWith("video/") && (
                <video controls className={styles.mediaPreview}>
                  <source src={mediaPreview} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}

              {file?.type.startsWith("audio/") && (
                <div>
                  <p>Audio Preview:</p>
                  <audio
                    controls
                    src={mediaPreview}
                    className={styles.mediaPreview}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}

          <hr className={styles.lineBreak} />
          <div className={styles.media}>
            <label>
              <span className={styles.mediaIcon}>
              <BsImage className={styles.icon} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*, audio/*, video/*"
                onChange={handleMediaChange}
              />
              <div className={styles.tooltip}>Media</div>
              </span>
             

              <MdOutlineGifBox className={styles.icon} />
              <VscVscodeInsiders className={styles.icon} />
              <HiOutlineAdjustmentsHorizontal className={styles.icon} />
              <MdEmojiEmotions className={styles.icon} />
              <RiCalendarScheduleLine className={styles.icon} />
              <CiLocationOn className={styles.icon} />
            </label>

            <div
              className={`${styles.postBtn} ${
                content.trim() || file ? styles.active : ""
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
