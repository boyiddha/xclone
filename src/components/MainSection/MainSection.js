import styles from "./mainSection.module.css";

const MainSection = () => {
  return (
    <>
      <div className={styles.feed}>
        <div className={styles.head}>
          <div className={styles.you}>For you</div>
          <div className={styles.following}>Following</div>
        </div>
        <div>
          <hr className={styles.lineBreak} />
        </div>
        <div>Post</div>
        <div>
          <h1>Main Section</h1>
        </div>
      </div>
    </>
  );
};

export default MainSection;
