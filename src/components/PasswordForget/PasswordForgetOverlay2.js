import { useEffect, useState, useRef } from "react";
import styles from "@/modules/passwordForget2.module.css";
import PasswordForgetOverlay3 from "@/components/PasswordForget/passwordForgetOverlay3";

const PasswordForgetOverlay2 = ({ email, setIsFinalOverlay }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isOverlayOpen, setIsOverlayOpened] = useState(false);

  const isTakeCode = code.trim().length > 0;

  // useEffect(() => {
  //   if (!email) return;

  //   const sendResetCode = async () => {
  //     try {
  //       setError("");

  //       const response = await fetch("/api/forgot-password/request", {
  //         method: "POST",
  //         body: JSON.stringify({ email }),
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       const data = await response.json();
  //       if (!response.ok) {
  //         throw new Error(data.message || "Failed to send reset code");
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   sendResetCode();
  // }, [email]); // Only depend on `email`, not `emailSent`

  const verifyCode = async () => {
    const res = await fetch("/api/forgot-password/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      setIsOverlayOpened(true);
    } else {
      alert(data.message);
      setError(data.message);
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
          setIsFinalOverlay={setIsFinalOverlay}
        />
      )}
    </>
  );
};

export default PasswordForgetOverlay2;
