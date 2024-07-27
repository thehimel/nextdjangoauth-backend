import {slices} from "@/store/constants.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface AuthStateProps {
  loading: boolean;
  signup: {
    success: boolean;
    errors: {
      email: string | null;
      password: string | null;
    };
  };
}

const initialState: AuthStateProps = {
  loading: false,
  signup : {
    success: false,
    errors: {
      email: null,
      password: null,
    }
  }
}

const authSlice = createSlice({
  name: slices.auth,
  initialState,
  reducers: {
    setAuthLoading(state, action): void {
      state.loading = action.payload;
    },
    setSignupSuccess(state, action): void {
      state.signup.success = action.payload;
      if (action.payload === true) {
        state.signup.errors.email = null;
        state.signup.errors.password = null;
      }
      state.loading = false;
    },
    setSignupErrors(state, action): void {
      state.signup.errors.email = action.payload.email?.[0] ?? null;
      state.signup.errors.password = action.payload.password1?.[0] ?? null;
      state.loading = false;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
