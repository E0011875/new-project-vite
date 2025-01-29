import {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import styles from "./index.module.css";
import Button from "../button";
import { FormEventHandler } from "react";
import classNames from "classnames";

export interface InputProps<T extends FieldValues> {
  name: FieldPath<T>;
  type?: string;
  placeholder?: string;
  validation: RegisterOptions<T, FieldPath<T>>;
}
interface FormProps<T extends FieldValues> {
  inputs: InputProps<T>[];
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<T>;
  isLoading?: boolean;
  errors: FieldErrors<T>;
}
export const Form = <T extends FieldValues>({
  inputs,
  onSubmit,
  register,
  errors,
  isLoading,
}: FormProps<T>) => (
  <form onSubmit={onSubmit} className={styles.form}>
    {inputs.map(({ name, type, placeholder, validation }) => (
      <input
        {...register(name, validation)}
        key={name}
        type={type}
        placeholder={placeholder}
        className={classNames(styles.input, {
          [styles.inputError]: errors[name],
        })}
      />
    ))}
    <Button type="submit" label="Submit" isLoading={isLoading} />
  </form>
);
