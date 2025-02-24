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

import xLogo from "./../../../public/images/x_profile.png";
import LogOut from "@/components/LogOut/LogOut";
import styles from "./navbar.module.css";
import { useEffect, useRef, useState } from "react";
import MoreOptions from "./MoreOptions";

const Navbar = () => {
  const [isOpenMore, setIsOpenMore] = useState(false);
  const boxRef = useRef(null);

  // Toggle function
  const toggleMore = () => {
    setIsOpenMore(true); // Open MoreOptions
  };

  // Close MoreOptions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
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
                <div className={`${styles.item} ${styles.menuContainer2}`}>
                  <div className={styles.icon}>
                    {" "}
                    <GoHome /> {/* <GoHomeFill/> use it when it active */}
                  </div>
                  <div className={styles.content}>Home</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer3}`}>
                  <div className={styles.icon}>
                    {" "}
                    <IoSearch />{" "}
                  </div>
                  <div className={styles.content}>Explore</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer4}`}>
                  <div className={styles.icon}>
                    {" "}
                    <GrNotification />{" "}
                  </div>
                  <div className={styles.content}>Notifications</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer5}`}>
                  <div className={styles.icon}>
                    {" "}
                    <MdOutlineMailOutline />{" "}
                  </div>
                  <div className={styles.content}>Messages</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer6}`}>
                  <div className={styles.icon}>
                    {" "}
                    <VscVscodeInsiders />{" "}
                  </div>
                  <div className={styles.content}>Grok</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer7}`}>
                  <div className={styles.icon}>
                    {" "}
                    <FaRegBookmark />{" "}
                  </div>
                  <div className={styles.content}>BookMarks</div>
                </div>
              </div>

              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer8}`}>
                  <div className={styles.icon}>
                    {" "}
                    <IoPeopleOutline />{" "}
                  </div>
                  <div className={styles.content}>Communities</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer9}`}>
                  <div className={styles.icon}>
                    {" "}
                    <HiOutlineBadgeCheck />{" "}
                  </div>
                  <div className={styles.content}>Premium</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer10}`}>
                  <div className={styles.icon}>
                    {" "}
                    <RxLightningBolt />{" "}
                  </div>
                  <div className={styles.content}>Verified Orgs</div>
                </div>
              </div>
              <div className={styles.effect}>
                <div className={`${styles.item} ${styles.menuContainer11}`}>
                  <div className={styles.icon}>
                    {" "}
                    <HiOutlineUser />{" "}
                  </div>
                  <div className={styles.content}>Profile</div>
                </div>
              </div>
              <div className={styles.containerMore}>
                {!isOpenMore && (
                  <div className={styles.effect} onClick={toggleMore}>
                    <div className={`${styles.item} ${styles.menuContainer12}`}>
                      <div className={styles.icon}>
                        <CiCircleMore />
                      </div>
                      <div className={styles.content}>More</div>
                    </div>
                  </div>
                )}
                {isOpenMore && (
                  <div className={styles.moreOptionsContainer} ref={boxRef}>
                    <MoreOptions />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.postItem}>
              <div className={styles.postBtn}>Post</div>
              <div className={styles.space}></div>
            </div>

            <div className={styles.accountItem}>
              <div className={styles.userImage}>
                <Image src={xLogo} alt="X Logo" width="20" height="20" />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.fullName}> Boyiddhanath Roy</div>
                <div className={styles.userName}> @boyiddha</div>
              </div>
              <div className={styles.options}>
                <IoIosMore />
              </div>
            </div>
            <div className={styles.profileItem}>
              <div style={{ color: "white" }}>
                <LogOut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
