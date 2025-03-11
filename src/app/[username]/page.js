import styles from "./profilePage.module.css";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainSection from "@/components/UserProfileSection/MainSection";

const UserProfilePage = async ({ params }) => {
  const { username } = await params;
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.navbar}`}>
          <Navbar />
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

export default UserProfilePage;
