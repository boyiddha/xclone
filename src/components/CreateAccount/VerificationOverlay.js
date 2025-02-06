"use client";

import styles from "@/modules/verification.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { useEffect, useState } from "react";

const VerificationOverlay = ({ step, email }) => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  // Function to go Back to the prev. overlay
  const goBack = () => {
    router.push("?step=createAccount", { scroll: false });
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div className={styles.close}>
                <button className={styles.prevButton} onClick={goBack}>
                  <GoArrowLeft />
                </button>
              </div>
              <div className={styles.space}></div>
              <div className={styles.logo}>
                <Image src={xLogo} alt="X Logo" width="30" height="30" />
              </div>
              <div className={styles.space}></div>
            </div>
          </div>

          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <span>We sent you a code</span>
            </div>
          </div>

          <div className={styles.row3ContainerDiv}>
            <div className={styles.row3ContainerFlex}>
              <span>Enter it below to verify {email}.</span>
            </div>
          </div>

          <div className={styles.row4ContainerDiv}>
            <div className={styles.row4ContainerFlex}>
              <div className={styles.inputVerification}>
                <input
                  type="text"
                  name="verification"
                  id="verification"
                  placeholder="Verification Code...."
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  onClick={() => setIsClicked(true)}
                />
              </div>
            </div>
          </div>

          <div className={styles.row5ContainerDiv}>
            <div className={styles.row5ContainerFlex}></div>
          </div>
          <div className={styles.row6ContainerDiv}>
            <div
              className={`${styles.row6ContainerFlex} ${
                isClicked ? styles.active : ""
              }`}
              onClick={() => {
                if (isClicked) {
                  router.push("?step=ok", { scroll: false });
                }
              }}
            >
              <span className={styles.nextButton}>Next</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationOverlay;
