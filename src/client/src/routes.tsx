import App from "@/App.tsx";
import Auth from "@/components/Auth/Auth.tsx";
import ConfirmEmail from "@/components/Auth/ConfirmEmail.tsx";
import ChangePassword from "@/components/User/ChangePassword.tsx";
import Profile from "@/components/User/Profile.tsx";
import {
  CHANGE_PASSWORD_URL,
  CONFIRM_EMAIL_URL,
  HOME_URL,
  LOGIN_URL,
  PROFILE_URL,
  SIGNUP_URL,
} from "@/constants/urls.ts";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={HOME_URL} element={<App/>}>
      <Route index={true} path={HOME_URL} element={<Home/>}/>
      <Route path={SIGNUP_URL} element={<Auth pageType="signup" headline="Create your account to get started." />}/>
      <Route path={LOGIN_URL} element={<Auth pageType="login" headline="Log in to your account to continue." />}/>
      <Route path={CONFIRM_EMAIL_URL} element={<ConfirmEmail />}/>
      <Route path={PROFILE_URL} element={<Profile />}/>
      <Route path={CHANGE_PASSWORD_URL} element={<ChangePassword />}/>
    </Route>
  )
)
