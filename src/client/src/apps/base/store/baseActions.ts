import {AppDispatch} from "@/core/store/store.ts";
import {baseActions} from "./baseSlice.ts";

export const toggleDarkMode = () => {
  return (dispatch: AppDispatch) => {
    dispatch(baseActions.toggleDarkMode());
  };
};
