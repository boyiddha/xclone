"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import styles from "@/modules/home.module.css";

//import { doSocialSignup } from "@/app/actions";

const SocialSignupForm = () => {
  return (
    <form>
      <div className={styles.signupForm}>
        <div className={styles.signupFlex}>
          <button
            className={styles.signupButton}
            onClick={(e) => handleProvider(e, "google")}
          >
            <FcGoogle />
          </button>
          <p> Sign up with Google</p>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button onClick={(e) => handleProvider(e, "github")}>
            {" "}
            <FaGithub style={{}} />
            {"Sign up with Github "}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SocialSignupForm;
