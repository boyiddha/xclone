import { useState } from "react";

import styles from "./newUserSetUsername.module.css";
import { useRouter } from "next/navigation";
import { saveNewOauthUser } from "@/app/actions/updateUser";

const NewUserSetUsername = ({ dob, password }) => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    try {
      console.log("chandle clock");
      const saveResponse = await saveNewOauthUser({ dob,password,username,});
      //console.log("===================",saveResponse.status);
      saveResponse.status === 200 && router.push("/home");
    } catch (e) {
      console.error(e.message);
    }
  };
  return (
    <>
      <div className={styles.titleRow}>
        <span>What should we call you?</span>
      </div>
      <div className={styles.titleRow2}>
        <p>Your @username is unique. You can always change it later</p>
        <br />
      </div>
      <div className={styles.inputUsername}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          value={username}
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className={styles.nextBtnContainerDiv}>
        <div
          className={`${styles.nextBtnContainerFlex} ${
            username ? styles.active : ""
          }`}
          onClick={username ? handleClick : undefined}

        >
          <span className={styles.nextButton}>Next</span>
        </div>
      </div>
    </>
  );
};

export default NewUserSetUsername;
