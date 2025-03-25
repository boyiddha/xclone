"use client";

import styles from "./headerSection.module.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";

import { useRouter } from "next/navigation";
import Image from "next/image";
import EditProfileOverlay from "./EditProfileOverlay";
import { useState } from "react";
import FollowButton from "./FollowButton";
import { updateUserAPI } from "@/app/actions/userActions";

const HeaderSection = ({
  totalPost,
  loading,
  fullName,
  userName,
  userImage,
  userCoverImage,
  joiningDateMessage,
  following,
  follower,
  followingList,
  followerList,
  userId,
  loggedInUserId,
  setFullName,
  setUserImage,
  setUserCoverImage,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const followerIds = followerList?.map((user) => user._id) || [];
  const followingIds = followingList?.map((user) => user._id) || [];

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedData) => {
    try {
      const updatedUser = await updateUserAPI(userId, updatedData);

      setFullName(updatedUser.fullName);
      setUserImage(updatedUser.image);
      setUserCoverImage(updatedUser.coverImage);

      setIsEditing(false); // Close overlay
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <div className={styles.profileContainer}>
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
          <div className={styles.name}>
            <div className={styles.fullName}>{fullName}</div>
            <div className={styles.totalPost}>{totalPost} posts</div>
          </div>
        </div>
        <div>
          {loading ? (
            <div className={styles.spinner}></div> // Show spinner when loading
          ) : (
            <div className={styles.mainDiv}>
              <div className={styles.profileInfo}>
                <div className={styles.coverImageContainer}>
                  {userCoverImage && (
                    <Image
                      src={userCoverImage}
                      fill // Makes the image take full width & height of its parent
                      alt={"user Cover Image"}
                      className={styles.coverImage}
                    />
                  )}
                </div>
                <div className={styles.profileData}>
                  <div className={styles.profileImageButton}>
                    <div className={styles.profileImageContainer}>
                      {userImage && (
                        <Image
                          src={userImage}
                          width="100"
                          height="100"
                          alt="User profile image"
                          className={styles.profileImage}
                        />
                      )}
                    </div>
                    {userId === loggedInUserId && (
                      <div className={styles.editButton}>
                        <div
                          className={styles.button}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit profile
                        </div>
                      </div>
                    )}
                    {userId !== loggedInUserId && (
                      <FollowButton
                        loggedInUserId={loggedInUserId}
                        userId={userId}
                        initialFollowers={followerIds}
                        initialFollowing={followingIds}
                      />
                    )}
                  </div>

                  {isEditing && (
                    <EditProfileOverlay
                      fullName={fullName}
                      userName={userName}
                      userImage={userImage}
                      userCoverImage={userCoverImage}
                      onClose={handleClose}
                      onSave={handleSave}
                    />
                  )}

                  <div className={styles.headerName}>
                    <div className={styles.name}>
                      <div className={styles.fullName}>{fullName}</div>
                      <div className={styles.userName}>@{userName}</div>
                    </div>
                    <div className={styles.badges}>
                      <div className={styles.badgesTitle}>
                        <RiVerifiedBadgeFill className={styles.badgesIcon} />{" "}
                        Get verified
                      </div>
                    </div>
                  </div>
                  <div className={styles.joiningDate}>
                    <span>
                      {" "}
                      <FaCalendarAlt />
                      {"  "}
                      {joiningDateMessage}
                    </span>
                  </div>
                  <div className={styles.follow}>
                    <span
                      className={styles.following}
                      onClick={() => router.push(`/${userName}/following`)}
                    >
                      <span className={styles.totalText}>{following}</span>{" "}
                      {" Following"}
                    </span>
                    <span
                      className={styles.follower}
                      onClick={() =>
                        router.push(`/${userName}/verified_followers`)
                      }
                    >
                      <span className={styles.totalText}>{follower}</span>{" "}
                      {" Follower"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderSection;
