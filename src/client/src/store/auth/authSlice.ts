import {slices} from "@/store/constants.ts";
import {clearAuthToken, setAuthToken} from "@/utils/auth/token.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface UserDataProps {
  provider: string;
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
  "provider": "",
  "user": {
    "pk": 0,
    "username": "",
    "email": "",
    "first_name": "",
    "last_name": "",
  }
}

const initialState: AuthStateProps = {
  loading: false,
  userData: initialUserData,
  rememberMe: false,
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
      setAuthToken({token: action.payload.access, rememberMe: action.payload.rememberMe});
      state.userData.provider = action.payload.provider;
      state.userData.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
      state.loggedIn = true;
    },
    setUserDetails(state, action): void {
      state.userData.user = action.payload;
    },
    logout(state): void {
      clearAuthToken();
      state.userData = initialUserData;
      state.rememberMe = false;
      state.loggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
