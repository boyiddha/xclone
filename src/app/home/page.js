import Image from "next/image";
import styles from "./home.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

export const metadata = {
  title: "Home / X",
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
          <Navbar />
        </div>
        <div className={styles.mainSidebarContainer}>
          <div className={`${styles.column} ${styles.main}`}>
            <h1>Main Section</h1>
           
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
