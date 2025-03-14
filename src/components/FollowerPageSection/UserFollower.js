"use client";

import Image from "next/image";
import FollowButton from "./FollowButton";
import styles from "./userFollower.module.css";
import { useRouter } from "next/navigation";

const UserFollower = ({ followerList, followingList, loggedInUserId }) => {
  const router = useRouter();

  const followerIds = followerList?.map((user) => user._id) || [];
  const followingIds = followingList?.map((user) => user._id) || [];

  return (
    <div className={styles.container}>
      {followerList.length > 0 ? (
        followerList.map((user) => (
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
                <FollowButton
                  loggedInUserId={loggedInUserId}
                  userId={user._id}
                  initialFollowers={followerIds}
                  initialFollowing={followingIds}
                />
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

export default UserFollower;
