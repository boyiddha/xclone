import Image from "next/image";
import styles from "./home.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainSection from "@/components/MainSection/MainSection";

export const metadata = {
  title: "Home / X",
};

const HomePage = async () => {
  return (
    <>
      {" "}
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

export default HomePage;
