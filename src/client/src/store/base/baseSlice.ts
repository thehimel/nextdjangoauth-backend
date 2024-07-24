import {createSlice} from "@reduxjs/toolkit";
import {slices} from "../constants.ts";

export interface BaseState {
  darkMode: boolean;
}

const initialState: BaseState = {
  darkMode: true,
}

const baseSlice = createSlice({
  name: slices.base,
  initialState,
  reducers: {
    toggleDarkMode(state): void {
      state.darkMode = !state.darkMode;
    }
  }
});

export const baseActions = baseSlice.actions;
export const baseReducer = baseSlice.reducer;
