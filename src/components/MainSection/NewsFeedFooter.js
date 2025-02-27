import { LuMessageCircle } from "react-icons/lu";
import { BiRepost } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";

import styles from "./newsFeedFooter.module.css";

const NewsFeedFooter = () => {
  return (
    <>
      <div className={`${styles.icon} ${styles.icon1}`}>
        <LuMessageCircle />
        <div className={styles.tooltip}>Reply</div>
      </div>
      <div className={`${styles.icon} ${styles.icon2}`}>
        <BiRepost />
        <div className={styles.tooltip}>Repost</div>
      </div>
      <div className={`${styles.icon} ${styles.icon3}`}>
        <CiHeart />
        <div className={styles.tooltip}>Like</div>
      </div>
      <div className={`${styles.icon} ${styles.icon4}`}>
        <RiBarChartGroupedLine />
        <div className={styles.tooltip}>View</div>
      </div>
      <div>
        <span
          className={`${styles.icon} ${styles.icon1}`}
          style={{ marginRight: "12px" }}
        >
          <CiBookmark />
          <div className={styles.tooltip}>Bookmark</div>
        </span>
        <span className={`${styles.icon} ${styles.icon1}`}>
          <MdOutlineFileUpload />
          <div className={styles.tooltip}>Share</div>
        </span>
      </div>
    </>
  );
};

export default NewsFeedFooter;
