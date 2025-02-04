"use client";

import FooterPage from "@/components/Footer/page";
import LeftSidePage from "@/components/LeftSide/page";
import RightSidePage from "@/components/RigthSide/page";
import styles from "@/modules/home.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const step = searchParams.get("step");
    setIsOverlayOpen(step === "createAccount" || step === "password");
  }, [searchParams]); // Update state when URL changes

  return (
    <>
      <div className={isOverlayOpen ? styles.overlayColor : styles.container}>
        <div className={styles.firstRow}>
          <div className={styles.column1}>
            <LeftSidePage />
          </div>

          <div className={styles.column2}>
            <RightSidePage setOverlayState={setIsOverlayOpen} />
          </div>
        </div>

        <div className={styles.secondRow}>
          <FooterPage />
        </div>
      </div>
    </>
  );
}
