"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "@/modules/home.module.css";
import SocialSignupForm from "../SocialSignupForm/SocialSignupForm";
import CreateAccountOverlay from "../CreateAccount/CreateAccountOverlay";
import { useEffect } from "react";

export default function RightSidePage({ setOverlayState }) {
  const searchParams = useSearchParams();
  const step = searchParams.get("step"); // Get current step from URL
  const isOverlayOpened = step === "createAccount" || step === "password";
  const router = useRouter();
  useEffect(() => {
    setOverlayState(isOverlayOpened); // Send value to Parent when it changes
  }, [isOverlayOpened, setOverlayState]);

  return (
    <div className={styles.rightContainer}>
      <div className={styles.row1space}>
        <div className={styles.row1}>
          {" "}
          <span>Happening now</span>
        </div>
      </div>
      <div>
        <div className={styles.row2}>
          {" "}
          <span>Join today.</span>
        </div>
      </div>
      <div className={styles.row3}>
        <div>
          <div>
            <SocialSignupForm />
          </div>
          <div>
            <div className={styles.or}>
              <hr />
              <p>or</p>
              <hr />
            </div>
          </div>
          <div className={styles.createAccount}>
            <div className={styles.createAccountFlex}>
              <button
                onClick={() => router.push("?step=createAccount")}
                className={styles.createButton}
              >
                Create account
              </button>
              {/* Show overlay if the URL matches */}
              {isOverlayOpened && <CreateAccountOverlay step={step} />}
            </div>
          </div>
          <div className={styles.servicePolicy}>
            {"By signing up, you agree to the"}
            <Link className={styles.link} href="https://x.com/en/tos">
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link className={styles.link} href="https://x.com/en/privacy">
              Privacy Policy
            </Link>
            {", including"}
            <Link
              className={styles.link}
              href="https://help.x.com/en/rules-and-policies/x-cookies"
            >
              Cookie Use.
            </Link>
          </div>
        </div>
        <div>
          <div className={styles.firstR}> Already have an account?</div>
          <div className={styles.secondR}>
            <span className={styles.signinButton}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
