import { useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import styles from "./newsFeedHeader.module.css";
import { useRouter } from "next/navigation";

const NewsFeedHeader = ({ fullName, userName, postId, onDeletePost }) => {
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const boxMoreRef = useRef(null);
  const router = useRouter();

  // Toggle function
  const toggleMore = () => {
    setIsOpenMore(true); // Open MoreOptions
  };

  // Close MoreOptions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxMoreRef.current && !boxMoreRef.current.contains(event.target)) {
        setIsOpenMore(false); // Close MoreOptions when clicking outside
      }
    };

    if (isOpenMore) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMore]);

  // Open the delete confirmation popup
  const openDeletePopup = () => {
    setIsDeletePopupOpen(true);
    setIsOpenMore(false); // Close the MoreOptions menu
  };

  // Close the delete confirmation popup
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };

  // Handle Delete Post
  const handleDelete = () => {
    onDeletePost(postId); // Call the passed delete function
    setIsDeletePopupOpen(false); // Close the popup
  };

  return (
    <>
      <div>
        <span
          className={styles.fullname}
          onClick={() => router.push(`/${userName}`)}
        >
          {fullName}
        </span>
        <span className={styles.username}>@{userName}</span>
      </div>
      <div className={styles.containerMore}>
        <div className={styles.more} onClick={toggleMore}>
          <IoIosMore />
        </div>
        {isOpenMore && (
          <div ref={boxMoreRef}>
            <div className={styles.layoutMore}>
              <div className={styles.item1} onClick={openDeletePopup}>
                Delete
              </div>
              <div className={styles.item2}> Edit</div>

              <div className={styles.item3}> Pin to your profile</div>
              <div className={styles.item4}>Highlight on your profile</div>
              <div className={styles.item5}>Change who can reply</div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay Popup */}
      {isDeletePopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.title}>Delete Post?</div>
            <div className={styles.description}>
              This can’t be undone and it will be removed from your profile, the
              timeline of any accounts that follow you, and from search results.
            </div>
            <div className={styles.popupButton1}>
              <button className={styles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
            <div className={styles.popupButton2}>
              <button className={styles.cancelBtn} onClick={closeDeletePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsFeedHeader;
