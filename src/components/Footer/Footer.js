"use client";

import Link from "next/link";

import styles from "@/modules/footer.module.css";

export default function FooterPage() {
  return (
    <>
      <div className={styles.flexContainer}>
        <Link
          className={styles.item}
          href="https://about.x.com/en"
          target="_blank"
        >
          About
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en/using-x/download-the-x-app "
          target="_blank"
        >
          Download the X app
        </Link>

        <Link
          className={styles.item}
          href="https://help.x.com/en "
          target="_blank"
        >
          Help Center
        </Link>

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
          href="https://blog.x.com/ "
          target="_blank"
        >
          Blog
        </Link>

        <Link
          className={styles.item}
          href="https://careers.x.com/en "
          target="_blank"
        >
          Careers
        </Link>

        <Link
          className={styles.item}
          href="https://about.x.com/en/who-we-are/brand-toolkit "
          target="_blank"
        >
          Brand Resources
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en/advertising?ref=gl-tw-tw-twitter-advertise"
          target="_blank"
        >
          Advertising
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en/advertising?ref=gl-tw-tw-twitter-advertise "
          target="_blank"
        >
          Marketing
        </Link>

        <Link
          className={styles.item}
          href="https://business.x.com/en "
          target="_blank"
        >
          X for business
        </Link>

        <Link
          className={styles.item}
          href="https://developer.x.com/en "
          target="_blank"
        >
          Developers
        </Link>

        <Link
          className={styles.item}
          href="https://x.com/i/directory/profiles"
          target="_blank"
        >
          Directory
        </Link>

        <Link
          className={styles.item}
          href="https://x.com/settings/account/personalization"
          target="_blank"
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
