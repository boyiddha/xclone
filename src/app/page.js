"use client";

import FooterPage from "@/components/Footer/Footer";
import LeftSidePage from "@/components/LeftSide/LeftSide";
import RightSidePage from "@/components/RigthSide/RigthSide";
import styles from "@/modules/home.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const step = searchParams.get("step");
    if (
      step === "createAccount" ||
      step === "verification" ||
      step === "login" ||
      step === "setPassword" ||
      step === "setUserName" ||
      step === "inputPassword"
    ) {
      setIsOverlayOpen(true);
    } else {
      setIsOverlayOpen(false);
    }
  }, [searchParams]); // Update state when URL changes

  // add body background color class when isOverlayOpen is True
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.classList.add("overlayActive"); // Add class when open
    } else {
      document.body.classList.remove("overlayActive"); // Remove class when closed
    }
  }, [isOverlayOpen]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.firstRow}>
          <div className={styles.column1}>
            <LeftSidePage />
          </div>

          <div className={styles.column2}>
            <RightSidePage setIsOverlayOpen={setIsOverlayOpen} />
          </div>
        </div>

        <div className={styles.secondRow}>
          <FooterPage />
        </div>
      </div>
    </>
  );
}
