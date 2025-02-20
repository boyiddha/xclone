"use client";

import Image from "next/image";

import styles from "./leftSide.module.css";
import xLogo from "../../../public/images/x_profile.png";

export default function LeftSidePage() {
  return (
    <div className={styles.logo}>
      <Image src={xLogo} alt="X Logo" width="345" height="345" priority />
    </div>
  );
}
