"use client";
import styles from "./userVerifiedFollower.module.css";
const UserVerifiedFollower = () => {
  return (
    <>
      <div className={styles.textContainer}>
        <div className={styles.largeTitle}>
          <span>You don’t have any verified followers yet</span>
        </div>
        <div className={styles.smallTitle}>
          <span>
            When a verified account follows you, you’ll see them here.
          </span>
        </div>
      </div>
    </>
  );
};

export default UserVerifiedFollower;
