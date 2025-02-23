import { useState } from "react";

import styles from "./newUserSetPassword.module.css";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const NewUserSetPassword = ({
  setPassword,
  setUserNameOverlay,
  setPasswordOverlay,
}) => {
  const [password, setNewPassword] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const handleClick = () => {
    setPassword(password);
    setPasswordOverlay(false);
    setUserNameOverlay(true);
  };
  return (
    <>
      <div className={styles.titleRow}>
        <span>Set your password</span>
      </div>
      <div className={styles.titleRow2}>
        <p>
          Make sure your new password is 8 characters or more. Try including
          numbers, letters, and punctuation marks for a{" "}
          <span className={styles.strongPassword}>strong password</span>
        </p>
        <br />
      </div>

      <div className={styles.inputPassword}>
        <div className={styles.passwordBtn}>
          <input
            type={isVisible ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Set your Password"
            value={password}
            autoComplete="off"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.eyeDiv}>
          {!isVisible && (
            <IoEye
              className={styles.eyeBtn}
              onClick={() => setIsVisible(!isVisible)}
            />
          )}
          {isVisible && (
            <IoEyeOff
              className={styles.eyeBtn}
              onClick={() => setIsVisible(!isVisible)}
            />
          )}
        </div>
      </div>

      <div className={styles.nextBtnContainerDiv}>
        <div
          className={`${styles.nextBtnContainerFlex} ${
            password ? styles.active : ""
          }`}
          
          onClick={password ? handleClick : undefined}
        >
          <span className={styles.nextButton}>Next</span>
        </div>
      </div>
    </>
  );
};

export default NewUserSetPassword;
