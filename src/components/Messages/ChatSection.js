"use client";

import styles from "./chatSection.module.css";

const ChatSection = ({ setShowPopup }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.largeText}>
          <h1>Select a message</h1>
        </div>
        <div className={styles.smallText}>
          <div>Choose from your existing conversations, start a </div>
          <div>new one, or just keep swimming.</div>
        </div>
        <div>
          <div className={styles.button} onClick={() => setShowPopup(true)}>
            New Message
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSection;
