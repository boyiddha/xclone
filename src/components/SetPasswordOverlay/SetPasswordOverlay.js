/* eslint-disable react/no-unescaped-entities */
"use client";

import styles from "./setPasswordOverlay.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { savePasswordAPI } from "@/app/actions/authActions";

const SetPasswordOverlay = ({ email, isSetPassword }) => {
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const handleSignup = async () => {
    try {
      const saveResponse = await savePasswordAPI({ email, password }); // Call the refactored API function
      isSetPassword(password);
      if (saveResponse.status === 200) {
        router.push("/?step=setUserName");
      }
    } catch (e) {
      console.error("Error during signup:", e.message);
      setError(e.message); // Handle error if needed
    }
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div>
                <Image src={xLogo} alt="X Logo" width="30" height="30" />
              </div>
            </div>
          </div>
          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <div>
                <h1>You'll need a password</h1>
              </div>
              <div className={styles.title}>
                <p>Make sure it's 8 characters or more.</p>
              </div>

              <div className={styles.inputPassword}>
                <div className={styles.passwordBtn}>
                  <input
                    type={isVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    onClick={() => setIsSignup(true)}
                  />
                </div>
                <div className={styles.eyeDiv}>
                  {!isVisible && (
                    <IoEye
                      className={styles.eyeBtn}
                      onClick={() => setIsVisible(!isVisible)}
                    />
                  )}
                  {isVisible && (
                    <IoEyeOff
                      className={styles.eyeBtn}
                      onClick={() => setIsVisible(!isVisible)}
                    />
                  )}
                </div>
              </div>

              <div className={styles.row4ContainerDiv}>
                <div className={styles.row4ContainerFlex}>
                  <p>
                    By signing up, you agree to the{" "}
                    <Link
                      className={styles.item}
                      href="https://x.com/en/tos#new"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      className={styles.item}
                      href="https://x.com/en/privacy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    ,{" "}
                    <Link
                      className={styles.item}
                      href="https://help.x.com/en/rules-and-policies/x-cookies"
                      target="_blank"
                    >
                      Cookie Use
                    </Link>
                    including . X may use your contact information, including
                    your email address and phone number for purposes outlined in
                    our Privacy Policy, like keeping your account secure and
                    personalizing our services, including ads.{" "}
                    <Link
                      className={styles.item}
                      href="https://x.com/en/privacy"
                      target="_blank"
                    >
                      Learn more
                    </Link>
                    . Others will be able to find you by email or phone number,
                    when provided, unless you choose otherwise here.
                  </p>
                </div>
              </div>
              <div className={styles.row5ContainerDiv}>
                <div
                  className={`${styles.row5ContainerFlex} ${
                    isSignup ? styles.active : ""
                  }`}
                  onClick={handleSignup}
                >
                  <span className={styles.nextButton}>Sign up</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPasswordOverlay;
