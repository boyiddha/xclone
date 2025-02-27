import { useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import styles from "./newsFeedHeader.module.css";

const NewsFeedHeader = ({ fullName, userName }) => {
  const [isOpenMore, setIsOpenMore] = useState(false);
  const boxMoreRef = useRef(null);

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

  return (
    <>
      <div>
        <span className={styles.fullname}>{fullName}</span>
        <span className={styles.username}>@{userName}</span>
      </div>
      <div className={styles.containerMore}>
        <div className={styles.more} onClick={toggleMore}>
          <IoIosMore />
        </div>
        {isOpenMore && (
          <div ref={boxMoreRef}>
            <div className={styles.layoutMore}>
              <div className={styles.item1}>Delete</div>
              <div className={styles.item2}> Pin to your profile</div>
              <div className={styles.item3}>Highlight on your profile</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsFeedHeader;
