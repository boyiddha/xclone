import { useState, useEffect } from "react";
import styles from "./followButton.module.css";

const FollowButton = ({
  loggedInUserId,
  userId,
  initialFollowers,
  initialFollowing,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowBack, setIsFollowBack] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setIsFollowBack(
      initialFollowing.includes(loggedInUserId) &&
        !initialFollowers.includes(loggedInUserId)
    );
  }, [initialFollowers, initialFollowing, loggedInUserId, userId]);

  const handleFollowToggle = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loggedInUserId, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setIsFollowBack(false);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  return (
    <div className={styles.followButtonDiv}>
      <button
        className={`${styles.followButton} ${
          isFollowing && hover
            ? styles.unfollow
            : isFollowing
            ? styles.following
            : ""
        }`}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isFollowing
          ? hover
            ? "Unfollow"
            : "Following"
          : isFollowBack
          ? "Follow Back"
          : "Follow"}
      </button>
    </div>

    // {isFollowing
    //   ? ( hover
    //     ? "Unfollow"
    //     : "Following")
    //   : (isFollowBack
    //   ? "Follow Back"
    //   : "Follow" )}
  );
};

export default FollowButton;
