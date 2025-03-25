import { useState, useEffect } from "react";
import styles from "./followButton.module.css";
import { toggleFollow } from "@/app/actions/followActions";

const FollowButton = ({
  loggedInUserId,
  userId,
  initialFollowers,
  initialFollowing,
}) => {
  // initialFollowers and initialFollowing is the follower and following list of the searched user
  // not the logged in user.
  const [isFollowing, setIsFollowing] = useState(
    initialFollowers.includes(loggedInUserId)
  );
  const [isFollowBack, setIsFollowBack] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setIsFollowBack(
      !initialFollowers.includes(loggedInUserId) &&
        initialFollowing.includes(loggedInUserId)
    );
  }, [initialFollowers, initialFollowing, loggedInUserId, userId]);

  const handleFollowToggle = async () => {
    const data = await toggleFollow();
    setIsFollowing(data.isFollowing);
    setIsFollowBack(false);
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
