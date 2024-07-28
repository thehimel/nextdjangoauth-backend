import {slices} from "@/store/constants.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface UserDataProps {
  access: string;
  refresh: string;
  user: {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface AuthStateProps {
  loading: boolean;
  userData: UserDataProps;
  rememberMe: boolean;
  loggedIn: boolean;
}

const initialUserData = {
    "access": "",
    "refresh": "",
    "user": {
        "pk": 0,
        "username": "",
        "email": "",
        "first_name": "",
        "last_name": ""
    }
}

const initialState: AuthStateProps = {
  loading: false,
  userData: initialUserData,
  rememberMe: true,
  loggedIn: false,
}

const authSlice = createSlice({
  name: slices.auth,
  initialState,
  reducers: {
    setAuthLoading(state, action): void {
      state.loading = action.payload;
    },
    setUserData(state, action): void {
      state.userData = action.payload;
      state.loggedIn = true;
    },
    setUserDetails(state, action): void {
      state.userData.user = action.payload;
    },
    setRememberMe(state, action): void {
      state.rememberMe = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
