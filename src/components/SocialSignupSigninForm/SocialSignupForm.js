"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "@/app/actions";

import styles from "./socialSignup.module.css";

const SocialSignupForm = () => {
  return (
    <form>
      <div
        className={styles.signupFormGoogle}
        onClick={() => doSocialLogin("google")}
      >
        <div className={styles.signupFlex}>
          <FcGoogle className={styles.googleIcon} />

          <p> Sign up with Google</p>
        </div>
      </div>
      <div
        className={styles.signupFormGithub}
        onClick={() => doSocialLogin("github")}
      >
        <div className={styles.signupFlex}>
          <FaGithub className={styles.githubIcon} />

          <p>Sign up with Github</p>
        </div>
      </div>
    </form>
  );
};

export default SocialSignupForm;
