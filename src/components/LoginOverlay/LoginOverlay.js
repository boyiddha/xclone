"use client";

import styles from "@/modules/login.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
const LoginOverlay = () => {
  const router = useRouter();
  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div className={styles.close}>
                <button className={styles.closeButton} onClick={closeOverlay}>
                  X
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
              <div>
                <p>Row1</p>
              </div>
              <div>
                <p>Row2</p>
              </div>
              <div>
                <p>Row3</p>
              </div>
              <div>
                <p>Row4</p>
              </div>
              <div>
                <p>Row5</p>
              </div>
              <div>
                <p>Row6</p>
              </div>
              <div>
                <p>Row7</p>
              </div>
              <div>
                <p>Row8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginOverlay;
