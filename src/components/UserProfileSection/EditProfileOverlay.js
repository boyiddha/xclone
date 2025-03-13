import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { IoCloseSharp } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";
import { HiMiniMagnifyingGlassMinus } from "react-icons/hi2";
import { HiMagnifyingGlassPlus } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa6";

import getCroppedImg from "@/utils/cropImage";
import styles from "./editProfileOverlay.module.css";
import { fileURLToBase64 } from "@/utils/imageUtils";

const EditProfileOverlay = ({
  fullName,
  userName,
  userImage,
  userCoverImage,
  onClose,
  onSave,
}) => {
  const [inputFullName, setInputFullName] = useState(fullName);
  const [coverImage, setCoverImage] = useState(userCoverImage);
  const [profileImage, setProfileImage] = useState(userImage);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputCoverRef = useRef(null);
  const fileInputProfileRef = useRef(null);

  const handleFileChange = (event, type) => {
    const image = event.target.files[0];
    if (image) {
      setImageType(type);
      setSelectedImage(URL.createObjectURL(image));
      // free up memory, revoke the URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Stores the cropped area in pixels
  //_ is a placeholder for the first parameter (croppedArea in percentages), which is not needed here
  //croppedAreaPixels contains the exact pixel coordinates { x, y, width, height } of the cropped section.

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels); // store these pixel values
  }, []);

  const handleApplyCrop = async () => {
    if (selectedImage && croppedAreaPixels) {
      // getCropeedImg function process the image and return a cropeed version image URL
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );
      if (imageType === "cover") setCoverImage(croppedImage);
      else setProfileImage(croppedImage);
      setSelectedImage(null);
    }
  };

  const handleSave = async () => {
    let base64CoverImage = coverImage
      ? await fileURLToBase64(coverImage)
      : null;
    let base64ProfileImage = profileImage
      ? await fileURLToBase64(profileImage)
      : null;

    const updatedData = {
      fullName: inputFullName,
      coverImage: base64CoverImage,
      profileImage: base64ProfileImage,
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      {!selectedImage && (
        <div className={styles.editProfileContainer}>
          <div className={styles.headerRow}>
            <IoCloseSharp className={styles.closeIcon} onClick={onClose} />
            <span className={styles.headerText}>Edit Profile</span>
            <div className={styles.saveButton} onClick={handleSave}>
              Save
            </div>
          </div>

          <div className={styles.coverImageRow}>
            {coverImage && (
              <Image
                src={coverImage}
                fill
                alt="Cover Image"
                className={styles.coverImage}
              />
            )}
            <div className={styles.action}>
              <span
                className={styles.add}
                onClick={() => fileInputCoverRef.current.click()}
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
              ref={fileInputCoverRef}
              className={styles.hiddenInput}
              onChange={(e) => handleFileChange(e, "cover")}
            />
          </div>

          <div className={styles.profileImageRow}>
            {profileImage && (
              <Image
                src={profileImage}
                width="130"
                height="130"
                alt="Profile Image"
                className={styles.profileImage}
              />
            )}
            <div className={styles.actionProfilePhoto}>
              <span
                className={styles.addProfilePhoto}
                onClick={() => fileInputProfileRef.current.click()}
              >
                <FiCamera />
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputProfileRef}
              className={styles.hiddenInput}
              onChange={(e) => handleFileChange(e, "profile")}
            />
          </div>

          <div className={styles.inputName}>
            <input
              type="text"
              value={inputFullName}
              onChange={(e) => setInputFullName(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Full-screen cropping overlay */}
      {selectedImage && (
        <div className={styles.cropContainer}>
          <div className={styles.cropWrapper}>
            {/* First Row: Buttons */}
            <div className={styles.cropActions}>
              <div className={styles.backIconDiv}>
                <FaArrowLeft
                  onClick={() => setSelectedImage(null)}
                  className={styles.backIcon}
                />
              </div>
              <div>
                <span className={styles.editText}> Edit Media</span>
              </div>
              <div className={styles.applyButton} onClick={handleApplyCrop}>
                Apply
              </div>
            </div>

            {/* Second Row: Cropper */}
            <div className={styles.cropArea}>
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={imageType === "cover" ? 3 / 1 : 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={false}
                classes={{
                  cropAreaClassName: styles.cropSelection,
                }} /* Custom CSS */
              />
            </div>

            {/* Third Row: Zoom Control */}
            <div className={styles.zoomControls}>
              <span className={styles.zoomIn}>
                {" "}
                <HiMiniMagnifyingGlassMinus />{" "}
              </span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <span className={styles.zoomOut}>
                {" "}
                <HiMagnifyingGlassPlus />{" "}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileOverlay;
