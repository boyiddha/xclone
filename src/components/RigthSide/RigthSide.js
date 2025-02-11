"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "@/modules/home.module.css";
import SocialSignupForm from "../SocialSignupSigninForm/SocialSignupForm";
import CreateAccountOverlay from "../CreateAccount/CreateAccountOverlay";
import { useEffect, useState } from "react";
import VerificationOverlay from "../CreateAccount/VerificationOverlay";
import LoginOverlay from "../LoginOverlay/LoginOverlay";
import SetPasswordOverlay from "@/components/SetPasswordOverlay/SetPasswordOverlay";
import SetUserNameOverlay from "@/components/SetUserNameOverlay/SetUserNameOverlay";

export default function RightSidePage({ setIsOverlayOpen }) {
  const [email, isSetEmail] = useState("");
  const [name, isSetName] = useState("");
  const [dob, isSetDob] = useState("");
  const searchParams = useSearchParams();
  const step = searchParams.get("step"); // Get current step from URL
  const isOverlayOpened =
    step === "createAccount" ||
    step === "verification" ||
    step === "login" ||
    step === "setPassword" ||
    step === "setUserName";
  const router = useRouter();

  useEffect(() => {
    setIsOverlayOpen(isOverlayOpened); // Send value to Parent when it changes
  }, [isOverlayOpened, setIsOverlayOpen]);

  useEffect(() => {
    const step = searchParams.get("step");
    setIsOverlayOpen(
      step === "createAccount" ||
        step === "password" ||
        step === "login" ||
        step === "setPassword" ||
        step === "setUserName"
    );
  }, [searchParams]); // Update state when URL changes

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
              {isOverlayOpened && step === "createAccount" && (
                <CreateAccountOverlay
                  step={step}
                  isSetEmail={isSetEmail}
                  isSetName={isSetName}
                  isSetDob={isSetDob}
                />
              )}
              {/* I pass the name, email, dob data to this overlay and after checking the OTP verification then allow to create a new user */}
              {isOverlayOpened && step === "verification" && (
                <VerificationOverlay
                  step={step}
                  email={email}
                  name={name}
                  dob={dob}
                />
              )}
              {isOverlayOpened && step === "login" && (
                <LoginOverlay step={step} />
              )}
              {isOverlayOpened && step === "setPassword" && (
                <SetPasswordOverlay email={email} />
              )}
              {isOverlayOpened && step === "setUserName" && (
                <SetUserNameOverlay
                  email={email}
                  setIsOverlayOpen={setIsOverlayOpen}
                />
              )}
            </div>
          </div>
          <div className={styles.servicePolicy}>
            {"By signing up, you agree to the"}
            <Link
              className={styles.link}
              href="https://x.com/en/tos"
              target="_blank"
            >
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link
              className={styles.link}
              href="https://x.com/en/privacy"
              target="_blank"
            >
              Privacy Policy
            </Link>
            {", including"}
            <Link
              className={styles.link}
              href="https://help.x.com/en/rules-and-policies/x-cookies"
              target="_blank"
            >
              Cookie Use.
            </Link>
          </div>
        </div>
        <div>
          <div className={styles.firstR}> Already have an account?</div>
          <div
            className={styles.secondR}
            onClick={() => router.push("?step=login")}
          >
            <span className={styles.signinButton}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
