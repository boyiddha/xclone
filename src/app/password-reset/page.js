"use client";

import styles from "@/modules/passwordForget.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordForgetOverlay from "@/components/PasswordForget/PasswordForgetOverlay";
import PasswordForgetOverlay4 from "@/components/PasswordForget/PasswordForgetOverlay4";

const PasswordReset = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isButtonActive = inputValue.trim().length > 0;
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isFinalOverlay, setIsFinalOverlay] = useState(false);

  const handleClick = () => {
    if (isButtonActive) {
      setIsOverlayVisible(true);
    }
  };

  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  return (
    <>
      {!isFinalOverlay && (
        <>
          <div className={styles.containerDiv}>
            {!isOverlayVisible && (
              <>
                <div className={styles.containerFlex}>
                  <div className={styles.row1ContainerDiv}>
                    <div className={styles.row1ContainerFlex}>
                      <div className={styles.close}>
                        <button
                          className={styles.closeButton}
                          onClick={closeOverlay}
                        >
                          X
                        </button>
                      </div>
                      <div className={styles.space}></div>
                      <div className={styles.logo}>
                        <Image
                          src={xLogo}
                          alt="X Logo"
                          width="30"
                          height="30"
                        />
                      </div>
                      <div className={styles.space}></div>
                    </div>
                  </div>

                  <div className={styles.row2ContainerDiv}>
                    <div className={styles.row2ContainerFlex}>
                      <div className={styles.titleRow}>
                        <span>Find your X account</span>
                      </div>
                      <div className={styles.titleRow2}>
                        <span>
                          Enter the email or phone number associated with your
                          account to change your password.
                        </span>
                      </div>
                      <div className={styles.inputPhoneEmail}>
                        <div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Phone or Email"
                            value={inputValue}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={(e) => setInputValue(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className={styles.nextBtnContainerDiv}>
                        <div
                          className={`${styles.nextBtnContainerFlex} ${
                            isButtonActive ? styles.active : ""
                          }`}
                          onClick={handleClick}
                        >
                          <span className={styles.nextButton}>Next</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isOverlayVisible && (
              <PasswordForgetOverlay
                email={inputValue}
                setIsFinalOverlay={setIsFinalOverlay}
              />
            )}
          </div>
        </>
      )}
      {isFinalOverlay && <PasswordForgetOverlay4 />}
    </>
  );
};

export default PasswordReset;
