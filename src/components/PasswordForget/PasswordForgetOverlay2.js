import { useEffect, useState, useRef } from "react";
import styles from "./passwordForgetOverlay2.module.css";
import PasswordForgetOverlay3 from "./PasswordForgetOverlay3";
import { verifyResetCode } from "@/app/actions/authActions";

const PasswordForgetOverlay2 = ({ email, setPassword, setIsFinalOverlay }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isOverlayOpen, setIsOverlayOpened] = useState(false);

  const isTakeCode = code.trim().length > 0;
  const verifyCode = async () => {
    try {
      const data = await verifyResetCode({ email, code }); // Use the refactored function here
      setIsOverlayOpened(true); // If successful, open overlay
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  return (
    <>
      {!isOverlayOpen && (
        <>
          <div className={styles.titleRow}>
            <span>We sent you a code</span>
          </div>
          <div className={styles.titleRow2}>
            <p>
              Check your email to get your confirmation code. If you need to
              request a new code, go back and reselect a confirmation.
            </p>
          </div>
          <div className={styles.inputCode}>
            <input
              type="text"
              name="code"
              id="code"
              placeholder="Enter your code"
              value={code}
              autoComplete="off"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <br />
          {error && <h3 style={{ color: "red" }}>{error}</h3>}
          <div className={styles.button}>
            <div className={styles.nextBtnContainerDiv}>
              <div
                className={`${styles.nextBtnContainerFlex} ${
                  isTakeCode ? styles.active : ""
                }`}
                onClick={() => {
                  if (isTakeCode) {
                    verifyCode();
                  }
                }}
              >
                <span className={styles.nextButton}>Next</span>
              </div>
            </div>
          </div>
        </>
      )}
      {isOverlayOpen && (
        <PasswordForgetOverlay3
          email={email}
          setPassword={setPassword}
          setIsFinalOverlay={setIsFinalOverlay}
        />
      )}
    </>
  );
};

export default PasswordForgetOverlay2;
