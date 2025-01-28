import { selector } from "recoil";
import { numberCountAtom } from "./atoms";

export const numberCountSelector = selector<number>({
  key: "numberCountSelector",
  get: ({ get }) => get(numberCountAtom),
  set: ({ set }, updatedCount) => {
    set(numberCountAtom, updatedCount);
  },
});
