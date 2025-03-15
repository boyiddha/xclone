import styles from "./notification.module.css";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainSection from "@/components/Notification/MainSection";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Notification / X",
};

const HomePage = async () => {
  //Get session using getServerSession() and your authOptions
  // const session = await getServerSession(authOptions);
  // console.log("✅  session home page : , ", session);

  return (
    <>
      {" "}
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.navbar}`}>
          <Navbar fromNotificationPage={true} />
        </div>
        <div className={styles.mainSidebarContainer}>
          <div className={`${styles.column} ${styles.main}`}>
            <MainSection />
          </div>

          <div className={`${styles.column} ${styles.sidebar}`}>
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
