import {slices} from "@/store/constants.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface AuthStateProps {
  loading: boolean;
}

const initialState: AuthStateProps = {
  loading: false,
}

const authSlice = createSlice({
  name: slices.auth,
  initialState,
  reducers: {
    setAuthLoading(state, action): void {
      state.loading = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
