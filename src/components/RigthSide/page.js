"use client";

import styles from "@/modules/home.module.css";
import SocialSignupForm from "../SocialSignupForm/page";

export default function RightSidePage() {
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
          </div>{" "}
          <div>
            <span>Create Account</span>
          </div>
          <div>
            <span>
              By signing up, you agree to the Terms of Service and Privacy
              Policy, including Cookie Use.
            </span>
          </div>
        </div>
        <div>
          <div>Already have an account?</div>
          <span>Sign in</span>
        </div>
      </div>
    </div>
  );
}
