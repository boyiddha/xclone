import Image from "next/image";
import xLogo from "./../../../public/images/x_profile.png";
import styles from "./accountOptions.module.css";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { doLogout } from "@/app/actions";

const AccountOptions = () => {
  const handleLogOut = async () => {
    await doLogout();
  };

  return (
    <>
      <div className={styles.layoutMore}>
        <div className={styles.accounts}>
          <div className={styles.accountItem}>
            <div className={styles.userImage}>
              <Image src={xLogo} alt="X Logo" width="20" height="20" />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.fullName}> Boyiddhanath Roy</div>
              <div className={styles.userName}> @boyiddha</div>
            </div>
            <div className={styles.activeCheck}>
              <CiCircleCheck />
              {/* <IoIosCheckmarkCircle style={{ color: "green" }} /> used this when
              account is logged in */}
            </div>
          </div>
        </div>
        <div className={styles.options}>
          <div className={styles.item}>Add an existing account</div>
          <div className={styles.item}>Manage accounts</div>
          <div className={styles.item} onClick={handleLogOut}>
            Log out @boyiddha
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountOptions;
