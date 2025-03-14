"use client";

import styles from "./headerSection.module.css";
import { IoArrowBackSharp } from "react-icons/io5";

import { useRouter } from "next/navigation";

const HeaderSection = ({ fullName, userName, userId, basePath, loading }) => {
  const router = useRouter();

  return (
    <>
      <div className={styles.head}>
        <div className={styles.back}>
          <span
            className={styles.backIcon}
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <IoArrowBackSharp />
          </span>
        </div>

        {loading ? (
          <div className={styles.spinner}></div> // Show spinner when loading
        ) : (
          <div className={styles.name}>
            <div className={styles.fullName}>{fullName}</div>
            <div className={styles.userName}>@{userName}</div>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <div className={styles.pages}>
        <div
          className={`${styles.pageItem} ${
            basePath === "verified_followers" ? styles.active : ""
          }`}
          onClick={() => router.push(`/${userName}/verified_followers`)}
        >
          Verified Followers
        </div>
        <div
          className={`${styles.pageItem} ${
            basePath === "followers" ? styles.active : ""
          }`}
          onClick={() => router.push(`/${userName}/followers`)}
        >
          Followers
        </div>
        <div
          className={`${styles.pageItem} ${
            basePath === "following" ? styles.active : ""
          }`}
          onClick={() => router.push(`/${userName}/following`)}
        >
          Following
        </div>
      </div>
    </>
  );
};

export default HeaderSection;
