"use client";

import styles from "./conversation.module.css";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { formatJoiningDate } from "@/utils/calendarUtils";
import Image from "next/image";
import { useState } from "react";

const conversation = ({ selectedUsers }) => {
  // const [joiningDateMessage, setJoiningDateMessage] = useState("");
  // if (selectedUsers)
  //   setJoiningDateMessage(formatJoiningDate(selectedUsers.createdAt));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.head}>
          <div>
            <span>fullname</span>
          </div>
          <div>
            <IoMdInformationCircleOutline />
          </div>
        </div>
        <div className={styles.profile}>
          <div className={styles.profileImg}>
            {selectedUsers?.image && (
              <Image
                src={selectedUsers.image}
                alt={selectedUsers.fullName}
                width={50}
                height={50}
                className={styles.profileImage}
              />
            )}
          </div>
          <div>
            <h3>fullname</h3>
          </div>
          <div>
            <span className={styles.username}>username</span>
          </div>
          <div>joining date mesage</div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default conversation;
