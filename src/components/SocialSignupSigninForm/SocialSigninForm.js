"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import styles from "@/modules/socialSignin.module.css";

//import { doSocialSignup } from "@/app/actions";

const SocialSignupForm = () => {
  return (
    <form>
      <div className={styles.signupFormGoogle}>
        <div className={styles.signupFlex}>
          <button
            className={styles.signupButton}
            onClick={(e) => handleProvider(e, "google")}
          >
            <FcGoogle />
          </button>
          <p> Sign in with Google</p>
        </div>
      </div>
      <div className={styles.signupFormGithub}>
        <div className={styles.signupFlex}>
          <button
            className={styles.signupButton}
            onClick={(e) => handleProvider(e, "github")}
          >
            {" "}
            <FaGithub />
          </button>
          <p>Sign in with Github</p>
        </div>
      </div>
    </form>
  );
};

export default SocialSignupForm;
