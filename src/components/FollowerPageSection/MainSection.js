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
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [loggedInFullName, setLoggedInFullName] = useState("");
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [loggedInUserImage, setLoggedInUserImage] = useState(null);

  const [userId, setUserId] = useState("");
  const [fullName, setUserFullName] = useState("");
  const [userName, setUserUserName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [following, setUserFollowing] = useState([]);
  const [follower, setUserFollower] = useState([]);

  const basePath = pathname.split("/")[2];
  const username = pathname.split("/")[1];

  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setLoggedInFullName(data.fullName);
      setLoggedInUserName(data.userName);
      setLoggedInUserImage(data.image || null);
      setLoggedInUserId(data._id);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUserFullName(data.user.fullName);
        setUserUserName(data.user.userName);
        setUserImage(data.user.image || null);
        setUserId(data.user._id);
        setUserFollowing(data?.user?.following);
        setUserFollower(data?.user?.followers);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
      setLoading(false);
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
            loading={loading}
          />
        </div>

        <div className={styles.contentSection}>
          {basePath === "verified_followers" && <UserVerifiedFollower />}
          {basePath === "followers" &&
            (loading ? (
              <div className={styles.spinner}></div> // Show spinner when loading
            ) : (
              <UserFollower
                followerList={follower}
                followingList={following}
                loggedInUserId={loggedInUserId}
              />
            ))}

          {basePath === "following" &&
            (loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <UserFollowing
                followingList={following}
                loggedInUserId={loggedInUserId}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default MainSection;
