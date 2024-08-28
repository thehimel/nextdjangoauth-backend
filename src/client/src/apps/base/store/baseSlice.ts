import {BASE} from "@/apps/base/store/constants.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface BaseState {
  darkMode: boolean;
}

const initialState: BaseState = {
  darkMode: true,
}

const baseSlice = createSlice({
  name: BASE,
  initialState,
  reducers: {
    toggleDarkMode(state): void {
      state.darkMode = !state.darkMode;
    }
  }
});

export const baseActions = baseSlice.actions;
export const baseReducer = baseSlice.reducer;
