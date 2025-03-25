/* eslint-disable react/no-unescaped-entities */
"use client";

import styles from "./passwordForgetOverlay.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PasswordForgetOverlay2 from "@/components/PasswordForget/PasswordForgetOverlay2";
import { requestPasswordReset } from "@/app/actions/authActions";

const PasswordForgetOverlay = ({ email, setPassword, setIsFinalOverlay }) => {
  const router = useRouter();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      setError("");
      const data = await requestPasswordReset(email); // Use the refactored function here
      // If API call is successful, show the overlay
      setIsOverlayVisible(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.containerFlex}>
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
          {!isOverlayVisible && (
            <>
              {loading ? (
                <h2 className={styles.loadingData}>
                  Sending Code to your Email...
                </h2>
              ) : (
                <>
                  <div className={styles.titleRow}>
                    <span>Wherer should we send a confirmation code?</span>
                  </div>
                  <div className={styles.titleRow2}>
                    <p>
                      Before you can change your password, we need to make sure
                      it's really you.
                    </p>
                    <br />
                    <p>
                      Start by choosing where to send a confirmation code.
                    </p>{" "}
                    <br />
                  </div>
                  <div className={styles.emailTitle}>
                    Send and email to{" "}
                    <span className={styles.email}>{email}</span>
                  </div>
                  <br />
                  <div className={styles.supportTitle}>
                    Contact{" "}
                    <Link
                      className={styles.item}
                      href="https://help.x.com/en/forms/account-access/regain-access"
                      target="_blank"
                    >
                      X support
                    </Link>{" "}
                    if you don't have access
                  </div>
                  <br />
                  {error && <h3 style={{ color: "red" }}>{error}</h3>}
                  <div className={styles.button}>
                    <div
                      className={styles.nextBtnContainerDiv}
                      onClick={handleClick}
                    >
                      <div className={styles.nextBtnContainerFlex}>
                        <span className={styles.nextButton}>Next</span>
                      </div>
                    </div>

                    <div className={styles.cancelBtnDiv}>
                      <div
                        className={styles.cancelBtnFlex}
                        onClick={() => router.push("/", { scroll: false })}
                      >
                        <Link href="/password-reset">Cancel</Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {isOverlayVisible && (
            <PasswordForgetOverlay2
              email={email}
              setPassword={setPassword}
              setIsFinalOverlay={setIsFinalOverlay}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordForgetOverlay;
