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

          {selectedCoverFile && (
            <Cropper
              image={selectedCoverFile}
              crop={crop}
              zoom={zoom}
              aspect={3 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
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

// import { useState, useRef, useEffect, useCallback } from "react";
// import Image from "next/image";
// import Cropper from "react-easy-crop";
// import { IoCloseSharp } from "react-icons/io5";
// import { FiCamera } from "react-icons/fi";

// import getCroppedImg from "@/utils/cropImage"; // Utility to crop image
// import styles from "./editProfileOverlay.module.css";

// const EditProfileOverlay = ({
//   fullName,
//   userName,
//   userImage,
//   userCoverImage,
//   onClose,
//   onSave,
// }) => {
//   const [inputFullName, setInputFullName] = useState(fullName);
//   const [coverImage, setCoverImage] = useState(userCoverImage);
//   const [profileImage, setProfileImage] = useState(userImage);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageType, setImageType] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const fileInputRef = useRef(null);
//   const overlayRef = useRef(null);

//   const handleFileChange = (event, type) => {
//     const image = event.target.files[0];
//     if (image) {
//       setImageType(type);
//       setSelectedImage(URL.createObjectURL(image));
//     }
//   };

//   const handleCropComplete = useCallback((_, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const handleApplyCrop = async () => {
//     if (selectedImage && croppedAreaPixels) {
//       const croppedImage = await getCroppedImg(
//         selectedImage,
//         croppedAreaPixels
//       );
//       if (imageType === "cover") setCoverImage(croppedImage);
//       else setProfileImage(croppedImage);
//       setSelectedImage(null); // Close cropping modal
//     }
//   };

//   const handleSave = () => {
//     const updatedData = {
//       fullName: inputFullName,
//       coverImage,
//       profileImage,
//     };
//     onSave(updatedData);
//     onClose();
//   };

//   return (
//     <div className={styles.overlay}>
//       <div ref={overlayRef} className={styles.editProfileContainer}>
//         <div className={styles.headerRow}>
//           <IoCloseSharp className={styles.closeIcon} onClick={onClose} />
//           <span className={styles.headerText}>Edit Profile</span>
//           <div className={styles.saveButton} onClick={handleSave}>
//             Save
//           </div>
//         </div>

//         <div className={styles.coverImageRow}>
//           {coverImage && (
//             <Image
//               src={coverImage}
//               fill
//               alt="Cover Image"
//               className={styles.coverImage}
//             />
//           )}
//           <span
//             className={styles.add}
//             onClick={() => fileInputRef.current.click()}
//           >
//             <FiCamera />
//           </span>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             className={styles.hiddenInput}
//             onChange={(e) => handleFileChange(e, "cover")}
//           />
//         </div>

//         <div className={styles.profileImageRow}>
//           {profileImage && (
//             <Image
//               src={profileImage}
//               width="130"
//               height="130"
//               alt="Profile Image"
//               className={styles.profileImage}
//             />
//           )}
//           <span
//             className={styles.add}
//             onClick={() => fileInputRef.current.click()}
//           >
//             <FiCamera />
//           </span>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             className={styles.hiddenInput}
//             onChange={(e) => handleFileChange(e, "profile")}
//           />
//         </div>

//         <div className={styles.inputName}>
//           <input
//             type="text"
//             value={inputFullName}
//             onChange={(e) => setInputFullName(e.target.value)}
//           />
//         </div>
//       </div>

//       {selectedImage && (
//         <div className={styles.cropContainer}>
//           <Cropper
//             image={selectedImage}
//             crop={crop}
//             zoom={zoom}
//             aspect={imageType === "cover" ? 3 / 1 : 1 / 1}
//             onCropChange={setCrop}
//             onZoomChange={setZoom}
//             onCropComplete={handleCropComplete}
//           />
//           <button
//             onClick={handleApplyCrop}
//             style={{
//               position: "relative",
//               backgroundColor: "red",
//               height: "100px",
//               width: "100px",
//             }}
//           >
//             Apply
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditProfileOverlay;
