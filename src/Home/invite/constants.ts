export enum SUBMIT_STATUS {
  SUCCESS = "success",
  FAILED = "failed",
  NONE = "none",
}

export const StatusDetails: Record<SUBMIT_STATUS, {
    title: string;
    message: string;
    additional: string;
    cta: string;
  }> = {
  [SUBMIT_STATUS.SUCCESS]: {
    title: "Requested",
    message:
      "You have successfully requested an invite and are on the list to receive exclusive updates.",
    additional:
      "We will keep you updated with the latest news and developments.",
    cta: "Got it",
  },
  [SUBMIT_STATUS.FAILED]: {
    title: "Something went wrong",
    message:
      "There was a problem processing your request. Please try again later.",
    additional:
      "If the problem persist, please contact our support team for assistance.",
    cta: "Back",
  },
  [SUBMIT_STATUS.NONE]: {
    title: "",
    message: "",
    additional: "",
    cta: "",
  },
};

export const DEFAULT_FIELD_VALUES = {
  fullName: "",
  email: "",
  confirmEmail: "",
};
