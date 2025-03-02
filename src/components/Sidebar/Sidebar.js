"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { IoIosSearch } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { RiVerifiedBadgeFill } from "react-icons/ri";


import sachin from "./../../../public/images/sachin.jpg";
import somoytv from "./../../../public/images/somoytv.jpg";
import dailystar from "./../../../public/images/dailystar.jpg";
import Link from "next/link";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className={styles.sidebarContainer}>
        <div
          className={`${styles.search} ${isFocused ? styles.active : ""}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div className={styles.icon}>
            <IoIosSearch />
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search.length > 0 && (
              <div className={styles.icon2} onClick={() => setSearch("")}>
                <FaTimesCircle />
              </div>
            )}
          </div>
        </div>
        <div className={styles.subscribe}>
          <div className={styles.titlePr}>Subscribe to Premium</div>
          <div className={styles.textPr}>
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </div>
          <div className={styles.buttonPrDiv}>
            <span className={styles.buttonPr}>Subscribe</span>
          </div>
        </div>
        <div className={styles.trends}>
          <div className={styles.titleTrnds}>What's happending</div>
          <div className={styles.trends1}>
            <div className={styles.trendsContainer}>
              <div className={styles.place}>Technology - Trending</div>
              <div className={styles.icon}>
                {" "}
                <BiDotsHorizontalRounded />{" "}
              </div>
            </div>

            <div className={styles.tag}>#WebDevelopMent</div>
          </div>
          <div className={styles.trends1}>
            <div className={styles.trendsContainer}>
              <div className={styles.place}>Business & finance - Trending</div>
              <div className={styles.icon}>
                {" "}
                <BiDotsHorizontalRounded />{" "}
              </div>
            </div>
            <div className={styles.tag}>#Picoiin</div>
            <div className={styles.posts}>10K posts</div>
          </div>
          <div className={styles.trends1}>
            <div className={styles.trendsContainer}>
              <div className={styles.place}>Trending in Bangladesh</div>
              <div className={styles.icon}>
                {" "}
                <BiDotsHorizontalRounded />{" "}
              </div>
            </div>
            <div className={styles.tag}>#Cricket</div>
            <div className={styles.posts}>3,018 posts</div>
          </div>
          <div className={styles.trends1}>
            <div className={styles.trendsContainer}>
              <div className={styles.place}>Trending in Bangladesh</div>
              <div className={styles.icon}>
                {" "}
                <BiDotsHorizontalRounded />{" "}
              </div>
            </div>
            <div className={styles.tag}>#Pinterest</div>
            <div className={styles.posts}>25.6K posts</div>
          </div>
          <div className={styles.show}>Show more</div>
        </div>
        <div className={styles.follows}>
          <div className={styles.titleFollow}>Who to follow</div>
          <div className={styles.follow1}>
            <div className={styles.userImg}>
              <Image src={sachin}
               alt="sachin profile"
                width="35"
                 height="35" 
                className={styles.img}
              
              />
            </div>
            <div className={styles.name}>
              <div className={styles.fullName}>Sachin Tendeulkar
              <RiVerifiedBadgeFill className={styles.badges}/>

              </div>
              <div className={styles.userName}>@sachin_rt</div>
            </div>
            <div className={styles.followButton}>Follow</div>
          </div>
          <div className={styles.follow1}>
            <div className={styles.userImg}>
              <Image
                src={somoytv}
                alt="somoytv profile"
                width="35"
                height="35"
                className={styles.img}
                
              />
            </div>
            <div className={styles.name}>
              <div className={styles.fullName}>Somoy TV
              <RiVerifiedBadgeFill className={styles.badges}/>

              </div>
              <div className={styles.userName}>@somoytv</div>
            </div>
            <div className={styles.followButton}>Follow</div>
          </div>
          <div className={styles.follow1}>
            <div className={styles.userImg}>
              <Image
                src={dailystar}
                alt="The daily starprofile"
                width="35"
                height="35"
                className={styles.img}
              />
            </div>
            <div className={styles.name}>
              <div className={styles.fullName}>The Daily Star 
                  <RiVerifiedBadgeFill className={styles.badges}/>
                
              </div>
              <div className={styles.userName}>@dailystarnews</div>
            </div>
            <div className={styles.followButton}>Follow</div>
          </div>
          <div className={styles.show}>Show more</div>
        </div>
        <div className={styles.more}>
          <div>

            
        <Link
          className={styles.item}
          href="https://x.com/en/tos "
          target="_blank"
        >
          Terms of Service
        </Link>
        <Link
          className={styles.item}
          href="https://x.com/en/privacy"
          target="_blank"
        >
          Privacy Policy
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en/rules-and-policies/x-cookies "
          target="_blank"
        >
          Cookie Policy
        </Link>
          </div>
          <div>
          <Link
          className={styles.item}
          href="https://help.x.com/en/resources/accessibility "
          target="_blank"
        >
          Accessibility
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en/help/troubleshooting/how-x-ads-work "
          target="_blank"
        >
          Ads info
        </Link>
       
        <Link
          className={styles.item}
          style={{ cursor: "default", pointerEvents: "none" }}
          href=""
        >
          @2025 X Corp.
        </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
