"use client";

import styles from "@/modules/newUserDateOfBirth.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";

const PasswordReset = () => {
  return (
    <>
      <div className={styles.containerDiv}>
        <div className={styles.containerFlex}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div className={styles.logo}>
                <Image src={xLogo} alt="X Logo" width="40" height="40" />
              </div>
            </div>
          </div>

          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <div className={styles.titleRow}>
                <span>What's your birth date?</span>
              </div>
              <div className={styles.titleRow2}>
                <span>This won't be public.</span>
              </div>
              <div className={styles.nextBtnContainerDiv}>
                <div className={styles.nextBtnContainerFlex}>
                  <span className={styles.nextButton}>Next</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
