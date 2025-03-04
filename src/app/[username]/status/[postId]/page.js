import styles from "@/app/home/home.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainSectionUserPost from "@/components/MainSection/MainSectionUserPost";

const PostPage = () => {
  return (
    <>
      {" "}
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.navbar}`}>
          <Navbar />
        </div>
        <div className={styles.mainSidebarContainer}>
          <div className={`${styles.column} ${styles.main}`}>
            <MainSectionUserPost />
          </div>

          <div className={`${styles.column} ${styles.sidebar}`}>
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
