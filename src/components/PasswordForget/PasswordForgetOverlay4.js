import Link from "next/link";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import styles from "./passwordForgetOverlay4.module.css";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/app/actions";

const PasswordForgetOverlay4 = ({ email, password }) => {
  const router = useRouter();
  // doCredentialLogin to save user session data
  const handleContinue = async () => {
    try {
      const response = await doCredentialLogin(email, password);

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
      <div className={styles.containerDiv}>
        <div className={styles.containerFlex}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div className={styles.logo}>
                <Image src={xLogo} alt="X Logo" width="35" height="35" />
              </div>
            </div>
          </div>
          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <div className={styles.titleRow}>
                <h3>Your are all set</h3>
              </div>
              <div className={styles.titleRow2}>
                <p>You're successfully changed your password</p>
                <br />
                <p>
                  Add an extra layer of security to your account with{" "}
                  <Link
                    className={styles.link}
                    href="https://help.x.com/en/managing-your-account/two-factor-authentication"
                    target="_blank"
                  >
                    two-factor authentication.
                  </Link>{" "}
                  Enable it in yoursettings to help make sure that you. and only
                  you, can access your account.
                </p>
              </div>

              <div className={styles.nextBtnContainerDiv}>
                <div
                  className={styles.nextBtnContainerFlex}
                  onClick={handleContinue}
                >
                  <span className={styles.nextButton}>continue to X</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordForgetOverlay4;
