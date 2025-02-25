import styles from "./moreOptions.module.css";

import { PiListFill } from "react-icons/pi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { RiArrowRightUpBoxLine } from "react-icons/ri";
import { TbSpaces } from "react-icons/tb";
import { TbSettings } from "react-icons/tb";
import { IoBriefcaseOutline } from "react-icons/io5";

const MoreOptions = () => {
  return (
    <>
      <div className={styles.layoutMore}>
        <div className={styles.firstItem}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <PiListFill />{" "}
            </div>
            <div className={styles.content}>List</div>
          </div>
        </div>
        <div className={styles.effect}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <FaMoneyCheckDollar />{" "}
            </div>
            <div className={styles.content}>MoneTization</div>
          </div>
        </div>
        <div className={styles.effect}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <RiArrowRightUpBoxLine />{" "}
            </div>
            <div className={styles.content}>Adds</div>
          </div>
        </div>
        <div className={styles.effect}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <IoBriefcaseOutline />{" "}
            </div>
            <div className={styles.content}>Jobs</div>
          </div>
        </div>
        <div className={styles.effect}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <TbSpaces />{" "}
            </div>
            <div className={styles.content}>Create your Space</div>
          </div>
        </div>
        <div className={styles.effect}>
          <div className={styles.item}>
            <div className={styles.icon}>
              {" "}
              <TbSettings />{" "}
            </div>
            <div className={styles.content}>Settings and privacy</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreOptions;
