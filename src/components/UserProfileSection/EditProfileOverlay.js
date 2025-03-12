import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { IoCloseSharp } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";

import styles from "./editProfileOverlay.module.css";

const EditProfileOverlay = ({
  fullName,
  userName,
  userImage,
  userCoverImage,
  onClose,
  onSave,
}) => {
  const [inputFullName, setInputFullName] = useState("");
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(userCoverImage);
  const [profileImage, setProfileImage] = useState(userImage);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedCoverImage, setCroppedCoverImage] = useState(null);
  const [croppedProfileImage, setCroppedProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);

  const handleFileChange = (event, type) => {
    const image = event.target.files[0];
    if (image) {
      setFile(image);
      const objectUrl = URL.createObjectURL(image);
      if (type === "cover") {
        setSelectedCoverFile(image);
        setCoverImage(objectUrl);
      } else {
        setSelectedProfileFile(image);
        setProfileImage(objectUrl);
      }
    }
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    // Placeholder for actual cropping function
    console.log("Cropped area pixels:", croppedAreaPixels);
  };

  const handleSave = () => {
    if (!inputFullName.trim() && !file) return; // Ensure at least content or image is provided

    const updatedData = {
      fullName,
      coverImage: croppedCoverImage,
      profileImage: croppedProfileImage,
    };
    onSave(updatedData);
    if (overlayRef.current) {
      onClose();
    }
  };

  // Handle click outside of the edit profile container to close overlay
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div ref={overlayRef} className={styles.editProfileContainer}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.close}>
            <IoCloseSharp className={styles.closeIcon} onClick={onClose} />
          </div>
          <div>
            <span className={styles.headerText}>Edit Profile</span>
          </div>
          <div>
            <div
              className={`${styles.saveButton} ${
                inputFullName.trim() || file ? styles.active : ""
              }`}
              onClick={handleSave}
            >
              Save
            </div>
          </div>
        </div>

        {/* Cover Image Row */}
        <div className={styles.coverImageRow}>
          {coverImage && (
            <Image
              src={coverImage}
              fill // Makes the image take full width & height of its parent
              alt={"user Cover Image"}
              className={styles.coverImage}
            />
          )}

          <div className={styles.action}>
            <span
              className={styles.add}
              onClick={() => fileInputRef.current.click()}
            >
              <FiCamera />
            </span>
            {coverImage && (
              <span
                className={styles.remove}
                onClick={() => setCoverImage(null)}
              >
                <IoCloseSharp className={styles.closeIcon} />
              </span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={(e) => handleFileChange(e, "cover")}
          />
        </div>

        {/* Profile Image Row */}
        <div className={styles.profileImageRow}>
          {profileImage && (
            <Image
              src={profileImage}
              width="130"
              height="130"
              alt="User profile image"
              className={styles.profileImage}
            />
          )}
          <div className={styles.action}>
            <span
              className={styles.add}
              onClick={() => fileInputRef.current.click()}
            >
              <FiCamera />
            </span>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={(e) => handleFileChange(e, "profile")}
          />
        </div>

        {/* Name Input Row */}

        <div className={styles.inputName}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={fullName}
            value={inputFullName}
            autoComplete="off"
            onChange={(e) => setInputFullName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileOverlay;
