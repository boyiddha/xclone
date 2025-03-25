"use client";

import Image from "next/image";
import styles from "./userFollowing.module.css";
import { toggleFollow } from "@/app/actions/followActions";

import { useState } from "react";
import { useRouter } from "next/navigation";

const UserFollowing = ({ followingList, loggedInUserId }) => {
  const [hover, setHover] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const router = useRouter();

  const handleFollowToggle = async (userId) => {
    try {
      const data = await toggleFollow(loggedInUserId, userId);
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };
  return (
    <div className={styles.container}>
      {followingList.length > 0 ? (
        followingList.map((user) => (
          <div key={user._id} className={styles.userRow}>
            {/* User Image */}
            <div className={styles.column1}>
              {user.image && (
                <Image
                  src={user.image}
                  alt={`${user.fullName}'s profile`}
                  width={50}
                  height={50}
                  className={styles.profileImage}
                />
              )}
            </div>

            <div className={styles.column2}>
              <div className={styles.userInfo}>
                <span
                  className={styles.fullName}
                  onClick={() => router.push(`/${user.userName}`)}
                >
                  {user.fullName}
                </span>
                <span className={styles.userName}>@{user.userName}</span>
              </div>

              {loggedInUserId !== user._id && (
                <div className={styles.followButtonDiv}>
                  <button
                    className={`${styles.followButton} ${
                      isFollowing && hover
                        ? styles.unfollow
                        : isFollowing
                        ? styles.following
                        : ""
                    }`}
                    onClick={() => handleFollowToggle(user._id)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    {isFollowing
                      ? hover
                        ? "Unfollow"
                        : "Following"
                      : "Follow"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noFollowing}>You're not following anyone yet.</p>
      )}
    </div>
  );
};

export default UserFollowing;
