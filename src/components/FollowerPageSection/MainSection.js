"use client";

import { useEffect, useState } from "react";
import styles from "./mainSection.module.css";

import { usePathname, useRouter } from "next/navigation";

import HeaderSection from "./HeaderSection";
import UserFollower from "./UserFollower";
import UserFollowing from "./UserFollowing";
import UserVerifiedFollower from "./UserVerifiedFollower";

const MainSection = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setCurrentUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [following, setFollowing] = useState(0);
  const [follower, setFollower] = useState(0);

  const basePath = pathname.split("/")[2];

  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setFullName(data.fullName);
      setUserName(data.userName);
      setUserImage(data.image || null);
      setCurrentUserId(data._id);
      setFollowing(data.following.length || 0);
      setFollower(data.followers.length || 0);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.headerSection}>
          <HeaderSection
            fullName={fullName}
            userName={userName}
            userId={userId}
            basePath={basePath}
          />
        </div>

        <div className={styles.contentSection}>
          {basePath === "verified_followers" && <UserVerifiedFollower />}
          {basePath === "followers" && <UserFollower />}
          {basePath === "following" && <UserFollowing />}
        </div>
      </div>
    </>
  );
};

export default MainSection;
