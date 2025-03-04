import { IoIosMore } from "react-icons/io";
import styles from "./userPostHeader.module.css";
import user from "./../../../public/images/user.jpeg";
import Image from "next/image";

const UserPostHeader = ({ fullName, userName, postId }) => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.profileImg}>
            <Image
              className={styles.img}
              src={user}
              alt="user profile"
              width="35"
              height="35"
            />
          </div>
          <div className={styles.profileName}>
            <div className={styles.fullname}>{fullName}</div>
            <div className={styles.username}>@{userName}</div>
          </div>
        </div>

        <div className={styles.containerMore}>
          <div className={styles.more}>
            <IoIosMore />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPostHeader;
