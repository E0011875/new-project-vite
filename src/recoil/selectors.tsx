import { DefaultValue, selectorFamily } from "recoil";
import { registeredAccountAtom } from "./atoms";
import { Account } from "./constants";

export const registeredAccountSelector = selectorFamily<
  Account | undefined,
  string
>({
  key: "numberCountSelector",
  get:
    (email: string) =>
    ({ get }) =>
      get(registeredAccountAtom(email)),
  set:
    (email: string) =>
    ({ set, reset }, accountDetails) => {
      if (accountDetails instanceof DefaultValue) {
        reset(registeredAccountAtom(email));
      } else {
        set(registeredAccountAtom(email), accountDetails);
      }
    },
});
