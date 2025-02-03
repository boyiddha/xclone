import FooterPage from "@/components/Footer/page";
import LeftSidePage from "@/components/LeftSide/page";
import RightSidePage from "@/components/RigthSide/page";
import styles from "@/modules/home.module.css";
export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.firstRow}>
          <div className={styles.column}>
            <LeftSidePage />
          </div>

          <div className={styles.column}>
            <RightSidePage />
          </div>
        </div>

        <div className={styles.secondRow}>
          <FooterPage />
        </div>
      </div>
    </>
  );
}
