"use client";

import Link from "next/link";

import styles from "@/modules/footer.module.css";

export default function FooterPage() {
  return (
    <>
      <div className={styles.flexContainer}>
        <Link className={styles.item} href="https://about.x.com/en">
          About
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en/using-x/download-the-x-app "
        >
          Download the X app
        </Link>

        <Link className={styles.item} href="https://help.x.com/en ">
          Help Center
        </Link>

        <Link className={styles.item} href="https://x.com/en/tos ">
          Terms of Service
        </Link>

        <Link className={styles.item} href="https://x.com/en/privacy">
          Privacy Policy
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en/rules-and-policies/x-cookies "
        >
          Cookie Policy
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en/resources/accessibility "
        >
          Accessibility
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en/help/troubleshooting/how-x-ads-work "
        >
          Ads info
        </Link>

        <Link className={styles.item} href="https://blog.x.com/ ">
          Blog
        </Link>

        <Link className={styles.item} href="https://careers.x.com/en ">
          Careers
        </Link>

        <Link
          className={styles.item}
          href="https://about.x.com/en/who-we-are/brand-toolkit "
        >
          Brand Resources
        </Link>

        <Link className={styles.item} href="">
          Advertising
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en/advertising?ref=gl-tw-tw-twitter-advertise "
        >
          Marketing
        </Link>

        <Link className={styles.item} href="https://business.x.com/en ">
          X for business
        </Link>

        <Link className={styles.item} href="https://developer.x.com/en ">
          Developers
        </Link>

        <Link className={styles.item} href="https://x.com/i/directory/profiles">
          Directory
        </Link>

        <Link
          className={styles.item}
          href="https://x.com/settings/account/personalization"
        >
          Settings
        </Link>

        <Link
          className={styles.item}
          style={{ cursor: "default", pointerEvents: "none" }}
          href=""
        >
          @2025 X Corp.
        </Link>
      </div>
    </>
  );
}
