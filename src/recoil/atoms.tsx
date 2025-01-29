import { atomFamily } from "recoil";
import { Account } from "./constants";

export const registeredAccountAtom = atomFamily<Account | undefined, string>({
  key: "registeredAccounts_ATOM",
  default: undefined,
});
