"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "@/app/actions/logInOutActions";

import styles from "./socialSignin.module.css";

const SocialSignupForm = () => {
  return (
    <form>
      <div
        className={styles.signupFormGoogle}
        onClick={() => doSocialLogin("google")}
      >
        <div className={styles.signupFlex}>
          <FcGoogle className={styles.googleIcon} />

          <p> Sign in with Google</p>
        </div>
      </div>
      <div
        className={styles.signupFormGithub}
        onClick={() => doSocialLogin("github")}
      >
        <div className={styles.signupFlex}>
          <FaGithub className={styles.githubIcon} />

          <p>Sign in with Github</p>
        </div>
      </div>
    </form>
  );
};

export default SocialSignupForm;
