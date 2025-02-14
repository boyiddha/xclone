import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/modules/passwordForget3.module.css";

const passwordForgetOverlay3 = ({ email, setIsFinalOverlay }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  //const [isOverlayOpen, setIsOverlayOpened] = useState(false);
  const router = useRouter();
  const isActive =
    newPassword.trim().length > 0 && confirmPassword.trim().length > 0;

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password didn't match");
      return;
    }

    try {
      const res = await fetch("/api/forgot-password/update", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        //setIsOverlayOpened(true);
        console.log("final overlay call ****************");
        setIsFinalOverlay(true);
      } else {
        setError(data.message); // Show error message
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <>
      <div className={styles.titleRow}>
        <span>Choose a new password</span>
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
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={styles.inputPassword}>
        <input
          type="text"
          name="fonfirmPassword"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      <div className={styles.button}>
        <div className={styles.changeBtnContainerDiv}>
          <div
            className={`${styles.changeBtnContainerFlex} ${
              isActive ? styles.active : ""
            }`}
            onClick={() => {
              if (isActive) {
                updatePassword();
              }
            }}
          >
            <span className={styles.changeButton}>Change password</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default passwordForgetOverlay3;
