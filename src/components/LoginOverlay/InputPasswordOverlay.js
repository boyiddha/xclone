"use client";

import styles from "@/modules/inputPassword.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { doCredentialLogin } from "@/app/actions";

const InputPasswordOverlay = ({ loginEmail }) => {
  const [password, setPassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };

  const handleLogin = async () => {
    try {
      const response = await doCredentialLogin(loginEmail, password);

      if (!!response.error) {
        console.error(response.error);
        setError(response.error.message);
      } else {
        router.push("/home");
        //router.push("products");
      }
    } catch (e) {
      console.error(e);
      setError("Check your Credentials");
    }
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
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
              <div className={styles.inputTitle}>
                <span>Enter your password</span>
              </div>
              <div>
                <div className={styles.loginEmail}>
                  <p>Email</p>
                  <p>{loginEmail}</p>
                </div>
              </div>
              <div className={styles.err}>{error}</div>
              <div className={styles.inputPassword}>
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => setIsClicked(true)}
                />
              </div>
              <div className={styles.loginContainerDiv}>
                <div
                  className={`${styles.loginContainerFlex} ${
                    isClicked ? styles.active : ""
                  }`}
                  onClick={handleLogin}
                >
                  <span className={styles.loginButton}>Log in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputPasswordOverlay;
