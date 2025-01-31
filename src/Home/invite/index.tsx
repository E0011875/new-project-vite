import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { createPortal } from "react-dom";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { DEFAULT_FIELD_VALUES, SUBMIT_STATUS } from "./constants";
import { useForm } from "react-hook-form";
import Status from "./status";
import Button from "./button";
import { useRecoilState } from "recoil";
import { registeredAccountSelector } from "../../recoil/selectors";
import { Form, InputProps } from "./form";
import { fetchPost } from "../../utils";

type DefaultFieldValues = typeof DEFAULT_FIELD_VALUES;

interface ModalProps {
  isOpen?: boolean;
  onModalClose: () => void;
}
const Modal = ({ isOpen, onModalClose }: ModalProps) => {
  const [submitState, setSubmitState] = useState<SUBMIT_STATUS>(
    SUBMIT_STATUS.NONE
  );
  const [serverError, setServerError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    watch,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors, // clear error on re-attempt
    reset,
    trigger,
  } = useForm({ defaultValues: DEFAULT_FIELD_VALUES });

  const email = watch("email"); // reference against email confirmation
  const [associatedAcc, setAssociatedAcc] = useRecoilState(
    registeredAccountSelector(email)
  );

  const submitHandler = useCallback(
    async (data: DefaultFieldValues) => {
      const { fullName, email } = data;
      const isValid = await trigger();
      if (isValid) {
        try {
          setIsLoading(true);
          await fetchPost({
            url: "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth",
            payload: { name: fullName, email },
          });
          setAssociatedAcc({ fullName, email });
          return setSubmitState(SUBMIT_STATUS.SUCCESS);
        } catch (error) {
          if (error instanceof Error) {
            setServerError(error.message);
          }
          return setSubmitState(SUBMIT_STATUS.FAILED);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [setAssociatedAcc, trigger]
  );

  const modalCloseHandler = useCallback(() => {
    // close modal as long as there is no issue
    if ([SUBMIT_STATUS.SUCCESS, SUBMIT_STATUS.NONE].includes(submitState)) {
      reset();
      onModalClose();
    }
    // reset submit state
    clearErrors();
    setServerError(undefined);
    setSubmitState(SUBMIT_STATUS.NONE);
  }, [clearErrors, onModalClose, reset, submitState]);

  const formInputs = useMemo<InputProps<DefaultFieldValues>[]>(
    () => [
      {
        name: "fullName",
        placeholder: "Full name",
        validation: {
          required: "Full name is required",
          minLength: {
            value: 3,
            message: "Full name must be at least 3 characters long",
          },
        },
      },
      {
        name: "email",
        type: "email",
        placeholder: "Email",
        validation: {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/, message: "Invalid email format" },
          validate: (value: string | undefined) =>
            value !== associatedAcc?.email || "Email already registered",
        },
      },
      {
        name: "confirmEmail",
        type: "email",
        placeholder: "Confirm email",
        validation: {
          validate: (value: string | undefined) =>
            value
              ? value === getValues("email") || "Emails do not match"
              : "Please confirm email",
        },
      },
    ],
    [associatedAcc?.email, getValues]
  );

  useEffect(() => {
    // close modal on esc
    window.addEventListener("keydown", ({ key }) =>
      isOpen && key === "Escape" ? modalCloseHandler() : null
    );
  }, [modalCloseHandler, isOpen]);

  return (
    <div
      style={{ visibility: isOpen ? "visible" : "hidden" }}
      data-testid="modal"
    >
      <div className={styles.mask} onClick={modalCloseHandler} />
      <div
        className={styles.modal}
        style={{
          visibility: submitState === SUBMIT_STATUS.NONE ? "inherit" : "hidden",
        }}
        data-testid="form"
      >
        <div
          data-testid="close"
          onClick={modalCloseHandler}
          className={styles.close}
        >
          <CloseIcon />
        </div>
        <div className={styles.title}>Request an invite</div>
        <div className={styles.divider} />
        <Form<DefaultFieldValues>
          inputs={formInputs}
          onSubmit={handleSubmit(submitHandler)}
          register={register}
          isLoading={isLoading}
          errors={errors}
        />
        <div className={styles.errors}>
          {Object.entries(errors).map(([key, error]) => (
            <div
              key={key}
              className={styles.error}
            >{`* ${error?.message}`}</div>
          ))}
        </div>
      </div>
      <Status
        status={submitState}
        onConfirm={modalCloseHandler}
        error={serverError}
      />
    </div>
  );
};
const Invite = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      {createPortal(
        <Modal isOpen={isOpen} onModalClose={() => setIsOpen(false)} />,
        document.body
      )}
      <Button label="Request an invite" onClick={() => setIsOpen(true)} />
    </>
  );
};

export default Invite;
