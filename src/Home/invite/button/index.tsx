import classNames from "classnames";
import styles from "./index.module.css";
import { FaSpinner } from "react-icons/fa";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
}
const Button = (props: ButtonProps) => {
  const { label, disabled, isLoading, ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      disabled={disabled || isLoading}
      className={classNames(styles.button, {
        [styles.buttonDisabled]: disabled || isLoading,
      })}
      data-testid="button"
    >
      {isLoading && (
        <FaSpinner className={styles.spinner} data-testid="button-spinner" />
      )}
      <div className={styles.label}>{label}</div>
    </button>
  );
};

export default Button;
