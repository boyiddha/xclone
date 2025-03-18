import Navbar from "@/components/Navbar/Navbar";
import Message from "@/components/Messages/Message";
import styles from "./message.module.css";

export const metadata = {
  title: "Messages / X",
};

const MessagePage = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={`$styles.column} ${styles.navbar}`}>
          <Navbar />
        </div>

        <div className={styles.message}>
          <Message />
        </div>
      </div>
    </>
  );
};

export default MessagePage;
