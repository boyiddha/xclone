"use client";

import Image from "next/image";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearch, IoBriefcaseOutline, IoPeopleOutline } from "react-icons/io5";
import { GrNotification } from "react-icons/gr";
import { MdOutlineMailOutline } from "react-icons/md";
import { VscVscodeInsiders } from "react-icons/vsc";
import { FaRegBookmark } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { RxLightningBolt } from "react-icons/rx";
import { HiOutlineUser } from "react-icons/hi2";
import { CiCircleMore } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { SiAppwrite } from "react-icons/si";
import { BsThreeDots } from "react-icons/bs";

import xLogo from "./../../../public/images/x_profile.png";
import LogOut from "@/components/LogOut/LogOut";
import styles from "./navbar.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import MoreOptions from "./MoreOptions";
import AccountOptions from "./AccountOptions";
import { useRouter } from "next/navigation";

const Navbar = ({ fromNotificationPage = false }) => {
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userId, setUserId] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const boxMoreRef = useRef(null);
  const boxAccountRef = useRef(null);
  const accountItemRef = useRef(null);
  const router = useRouter();

  // Toggle function
  const toggleMore = () => {
    setIsOpenMore(true); // Open MoreOptions
  };
  // Toggle menu when clicking the account item
  const toggleAccount = () => {
    setIsOpenAccount((prev) => !prev);
  };

  const handleNotificationClick = async () => {
    // Navigate to the notifications page
    router.push("/notifications");
  };

  // Close MoreOptions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxMoreRef.current && !boxMoreRef.current.contains(event.target)) {
        setIsOpenMore(false); // Close MoreOptions when clicking outside
      }
    };

    if (isOpenMore) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMore]);

  // Close menu when clicking outside both the togglebox + accountClickDiv(which ref is => accountItemRef)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        boxAccountRef.current &&
        !boxAccountRef.current.contains(event.target) &&
        accountItemRef.current &&
        !accountItemRef.current.contains(event.target)
      ) {
        setIsOpenAccount(false);
      }
    };

    if (isOpenAccount) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenAccount]);

  const fetchMe = async () => {
    const resMe = await fetch("/api/me", {
      method: "GET",
    });
    if (resMe.ok) {
      const dataMe = await resMe.json();
      setFullName(dataMe.fullName);
      setUserName(dataMe.userName);
      setUserImage(dataMe.image);
      setUserId(dataMe._id);
    } else {
      console.error("Failed to fetch Me");
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/notification?userId=${userId}`);

      const dataNotifications = await res.json();
      // Check if there are any unread notifications
      const hasUnread = dataNotifications?.some(
        (notification) => !notification.isRead
      );
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userId]); // `userId` is a dependency

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe(); // Ensure fetchMe completes before proceeding
      if (userId) {
        await fetchNotifications(); // Now fetchNotifications will run after userId is set
      }
      // remove notification sign
      if (fromNotificationPage) setHasUnreadNotifications(false);
    };

    fetchData();
  }, [fetchNotifications, userId, fromNotificationPage]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.column1}></div>
        <div className={styles.column2}>
          <div className={styles.container}>
            <div className={styles.menuItem}>
              <div className={`${styles.effect} ${styles.menuContainer1}`}>
                <div className={styles.logo}>
                  {" "}
                  <Image src={xLogo} alt="X Logo" width="30" height="30" />
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer2}`}
                  data-tooltip="Home"
                  onClick={() => router.push("/home")}
                >
                  <div className={styles.icon}>
                    {" "}
                    <GoHome /> {/* <GoHomeFill/> use it when it active */}
                  </div>
                  <div className={styles.content}>Home</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer3}`}
                  data-tooltip="Explore"
                >
                  <div className={styles.icon}>
                    {" "}
                    <IoSearch />{" "}
                  </div>
                  <div className={styles.content}>Explore</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer4}`}
                  data-tooltip="Notifications"
                  onClick={() => handleNotificationClick()}
                >
                  <div className={styles.icon}>
                    {" "}
                    <GrNotification
                      className={
                        hasUnreadNotifications ? styles.unreadIcon : ""
                      }
                    />
                    {hasUnreadNotifications && (
                      <span className={styles.unreadDot}></span> // Blue dot indicator
                    )}
                  </div>
                  <div className={styles.content}>Notifications</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer5}`}
                  data-tooltip="Messages"
                >
                  <div className={styles.icon}>
                    {" "}
                    <MdOutlineMailOutline />{" "}
                  </div>
                  <div className={styles.content}>Messages</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer6}`}
                  data-tooltip="Grok"
                >
                  <div className={styles.icon}>
                    {" "}
                    <VscVscodeInsiders />{" "}
                  </div>
                  <div className={styles.content}>Grok</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer7}`}
                  data-tooltip="BookMarks"
                >
                  <div className={styles.icon}>
                    {" "}
                    <FaRegBookmark />{" "}
                  </div>
                  <div className={styles.content}>BookMarks</div>
                </div>
              </div>

              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer8}`}
                  data-tooltip="Communities"
                >
                  <div className={styles.icon}>
                    {" "}
                    <IoPeopleOutline />{" "}
                  </div>
                  <div className={styles.content}>Communities</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer9}`}
                  data-tooltip="Premium"
                >
                  <div className={styles.icon}>
                    {" "}
                    <HiOutlineBadgeCheck />{" "}
                  </div>
                  <div className={styles.content}>Premium</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer10}`}
                  data-tooltip="Verified Orgs"
                >
                  <div className={styles.icon}>
                    {" "}
                    <RxLightningBolt />{" "}
                  </div>
                  <div className={styles.content}>Verified Orgs</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div
                  className={`${styles.item} ${styles.menuContainer11}`}
                  data-tooltip="Profile"
                  onClick={() => router.push(`/${userName}`)}
                >
                  <div className={styles.icon}>
                    {" "}
                    <HiOutlineUser />{" "}
                  </div>
                  <div className={styles.content}>Profile</div>
                </div>
              </div>
              <div className={styles.containerMore}>
                <div className={styles.effect} onClick={toggleMore}>
                  <div
                    className={`${styles.item} ${styles.menuContainer12}`}
                    data-tooltip="More"
                  >
                    <div className={styles.icon}>
                      <CiCircleMore />
                    </div>
                    <div className={styles.content}>More</div>
                  </div>
                </div>

                {isOpenMore && (
                  <div ref={boxMoreRef}>
                    <MoreOptions />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.postItem}>
              <div className={styles.postBtn}>Post</div>
              <div className={styles.postIconWrapper} data-tooltip="Post">
                <SiAppwrite className={`${styles.postIcon} hidden-icon`} />
              </div>
              <div className={styles.space}></div>
            </div>

            <div className={styles.containerMore}>
              <div
                className={`${styles.accountItem} ${
                  isOpenAccount ? styles.disabledHover : ""
                }`}
                ref={accountItemRef}
                onClick={toggleAccount}
              >
                <div className={styles.userImage} data-tooltip="Accounts">
                  {userImage && (
                    <Image
                      className={styles.img}
                      src={userImage}
                      alt="user Profile"
                      width="30"
                      height="30"
                    />
                  )}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.fullName}> {fullName}</div>
                  <div className={styles.userName}> @{userName}</div>
                </div>
                <div className={styles.options}>
                  <IoIosMore />
                </div>
              </div>

              {isOpenAccount && (
                <div ref={boxAccountRef}>
                  <AccountOptions
                    fullName={fullName}
                    userName={userName}
                    userImage={userImage}
                  />
                </div>
              )}
            </div>
            {/* <div className={styles.profileItem}>
              <div style={{ color: "white" }}>
                <LogOut />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
