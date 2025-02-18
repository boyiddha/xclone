import { useState } from "react";

import styles from "@/modules/newUserSetPassword.module.css";

const NewUserSetPassword = ({
  setPassword,
  setUserNameOverlay,
  setPasswordOverlay,
}) => {
  const [newPassword, setNewPassword] = useState("");

  const handleClick = () => {
    setPassword(newPassword);
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
        <input
          type="text"
          name="newPassword"
          id="newPassword"
          placeholder="Enter password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className={styles.nextBtnContainerDiv}>
        <div
          className={`${styles.nextBtnContainerFlex} ${
            newPassword ? styles.active : ""
          }`}
          onClick={handleClick}
        >
          <span className={styles.nextButton}>Next</span>
        </div>
      </div>
    </>
  );
};

export default NewUserSetPassword;
