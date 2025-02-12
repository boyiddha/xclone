"use client";

import styles from "@/modules/signUp.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "@/app/actions";

const SignUp = () => {
  const router = useRouter();

  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  return (
    <>
      <div className={styles.containerDiv}>
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
              <div className={styles.titleRow}>
                <span>Join X today</span>
              </div>

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

              <div className={styles.or}>
                <hr />
                <p>or</p>
                <hr />
              </div>

              <div className={styles.createAccount}>
                <div className={styles.createAccountFlex}>
                  <button className={styles.createButton}>
                    <Link href="/?step=createAccount">Create account</Link>
                  </button>
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
              <div className={styles.lastRow}>
                <span className={styles.loginTitle}>
                  Don't have and account?
                </span>
                <span className={styles.login}>
                  <Link href="/?step=login"> Log in</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
