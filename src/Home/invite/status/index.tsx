import Button from "../button";
import { StatusDetails, SUBMIT_STATUS } from "../constants";
import styles from "./index.module.css";

interface StatusProps {
  status: SUBMIT_STATUS;
  onConfirm?: () => void;
  error?: string;
}
const Status = ({ status, onConfirm, error }: StatusProps) => {
  return (
    <div
      className={styles.status}
      style={{
        visibility: status === SUBMIT_STATUS.NONE ? "hidden" : "visible",
      }}
      data-testid="status"
    >
      <div className={styles.title}>{StatusDetails[status].title}</div>
      <div className={styles.message}>
        {StatusDetails[status].message}
        <br />
        {StatusDetails[status].additional}
      </div>
      {error && <div className={styles.error}>{`* ${error}`}</div>}
      <Button label={StatusDetails[status].cta} onClick={onConfirm} />
    </div>
  );
};

export default Status;
