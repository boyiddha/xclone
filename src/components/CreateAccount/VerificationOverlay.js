"use client";

import styles from "./verificationOverlay.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { useEffect, useState, useRef } from "react";

const VerificationOverlay = ({ step, email, name, dob }) => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const hasSent = useRef(false); // Track if email has already been sent

  // Function to go Back to the prev. overlay
  const goBack = () => {
    router.push("?step=createAccount", { scroll: false });
  };

  useEffect(() => {
    if (!email || hasSent.current) return; // Prevent duplicate calls
    hasSent.current = true; // Mark as sent
    const sendEmail = async () => {
      try {
        const otpResponse = await fetch("/api/auth/createOTP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), // Pass the user email
        });
        if (!otpResponse.ok) throw new Error("Failed to generate OTP");
        const { otp } = await otpResponse.json(); // Extract OTP from response

        const emailData = {
          to: email,
          subject: ` ${otp} is your X verification code`,
          html: `
          <h1> 	Confirm your email address</h1>
          <br/
          <h3>There’s one quick step you need to complete before creating your X account. 
          Let’s make sure this is the right email address for you — please confirm this 
          is the right address to use for your new account. 
          </h3>
          <br/>
          <h3>Please enter this verification code to get started on X: </h3>
          <h1> ${otp} <h1></br>
          <h3>Verification codes expire after 3 minutes.</h3>
          <br/>
          <h4>Thanks,</h4>
          <h4>X</h4>
        `,
        };
        const emailResponse = await fetch("/api/auth/nodemailer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        });

        const data = await emailResponse.json();
        setMessage(data.message);
      } catch (error) {
        console.error("✅  Error:", error);
        setMessage("Failed to send email");
      } finally {
        setLoading(false);
      }
    };
    sendEmail();
  }, [email]); // run when email props change

  const handleVerification = async () => {
    try {
      const response = await fetch("/api/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Verified User, Now complete registration
        try {
          const registerResponse = await fetch("/api/register", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              dob,
            }),
          });
          registerResponse.status === 201 && router.push("/?step=setPassword");
        } catch (e) {
          setMessage(e.message);
          console.error(e.message);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error verifying OTP: " + error);
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          {loading ? (
            <h2 className={styles.loadingData}>Sending OTP...</h2>
          ) : (
            <>
              <div className={styles.row1ContainerDiv}>
                <div className={styles.row1ContainerFlex}>
                  <div className={styles.close}>
                    <button className={styles.prevButton} onClick={goBack}>
                      <GoArrowLeft />
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
                  <span>We sent you a code</span>
                </div>
              </div>

              <div className={styles.row3ContainerDiv}>
                <div className={styles.row3ContainerFlex}>
                  <span>Enter it below to verify {email}.</span>
                  {message === "Email sent successfully!" ? (
                    ""
                  ) : (
                    <p className={styles.alertmsg}>{message}</p>
                  )}
                </div>
              </div>

              <div className={styles.row4ContainerDiv}>
                <div className={styles.row4ContainerFlex}>
                  <div className={styles.inputVerification}>
                    <input
                      type="text"
                      name="verification"
                      id="verification"
                      placeholder="Verification Code...."
                      value={verificationCode}
                      autoComplete="off"
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onClick={() => setIsClicked(true)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.row5ContainerDiv}>
                <div className={styles.row5ContainerFlex}></div>
              </div>
              <div className={styles.row6ContainerDiv}>
                <div
                  className={`${styles.row6ContainerFlex} ${
                    isClicked ? styles.active : ""
                  }`}
                  onClick={handleVerification}
                >
                  <span className={styles.nextButton}>Next</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationOverlay;
