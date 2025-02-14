"use client";

import styles from "@/modules/login.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SocialSigninForm from "@/components/SocialSignupSigninForm/SocialSigninForm";
import { useState } from "react";
import Link from "next/link";

const LoginOverlay = ({ isSetEmail }) => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isButtonActive = inputValue.trim().length > 0;

  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update email state

    isSetEmail(value); // pass this email to it's parent component

    // Example: Validate Email Format
    // if (!value.includes("@")) {
    //   console.log("Invalid email format");
    // }
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
              <div className={styles.titleRow}>
                <span>Sign in to X</span>
              </div>
              <div>
                <SocialSigninForm />
              </div>
              <div className={styles.or}>
                <hr />
                <p>or</p>
                <hr />
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
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className={styles.nextBtnContainerDiv}>
                <div
                  className={`${styles.nextBtnContainerFlex} ${
                    isButtonActive ? styles.active : ""
                  }`}
                  onClick={() => {
                    if (isButtonActive) {
                      router.push("?step=inputPassword", { scroll: false });
                    }
                  }}
                >
                  <span className={styles.nextButton}>Next</span>
                </div>
              </div>
              <div className={styles.forgotBtnDiv}>
                <div
                  className={styles.forgotBtnFlex}
                  onClick={() =>
                    router.push("/password-reset", { scroll: false })
                  }
                >
                  Forgot password?
                </div>
              </div>
              <div className={styles.lastRow}>
                <span className={styles.signupTitle}>
                  Don't have and account?
                </span>
                <span className={styles.signup}>
                  <Link href="/sign-up"> Sign up</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginOverlay;
