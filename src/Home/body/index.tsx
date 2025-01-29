import Invite from "../invite";
import styles from "./index.module.css";

const Footer = () => {
  return (
    <div className={styles.body}>
      <div className={styles.title}>
        A better way
        <br />
        to enjoy every day.
      </div>
      <div className={styles.description}>
        Be the first to know when we launch.
      </div>
      <Invite />
    </div>
  );
};

export default Footer;
