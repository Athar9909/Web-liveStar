import { selector } from "recoil";
import { textState, CartCount, searchKey } from "./atom";

export const charCountState = selector({
  key: "charCountState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(CartCount);
    return text;
  },
});

export const charSearchKey = selector({
  key: "charSearchKey", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(searchKey);
    return text;
  },
});
