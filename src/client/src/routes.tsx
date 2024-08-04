import App from "@/App.tsx";
import Auth from "@/components/auth/Auth.tsx";
import ConfirmEmail from "@/components/auth/ConfirmEmail.tsx";
import Loader from "@/components/screens/Loader.tsx";
import UpdatePassword from "@/components/user/UpdatePassword.tsx";
import Profile from "@/components/user/Profile.tsx";
import SendAuthEmail from "@/components/auth/SendAuthEmail.tsx";
import {
  CHANGE_PASSWORD_URL,
  CONFIRM_EMAIL_URL, FORGOT_PASSWORD_URL,
  HOME_URL, LOADER_URL,
  LOGIN_URL,
  PROFILE_URL, RESET_PASSWORD_URL,
  SIGNUP_URL,
} from "@/constants/urls.ts";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={HOME_URL} element={<App/>}>
      <Route index={true} path={HOME_URL} element={<Home/>}/>
      <Route path={SIGNUP_URL} element={<Auth pageType="signup"/>}/>
      <Route path={LOGIN_URL} element={<Auth pageType="login"/>}/>
      <Route path={CONFIRM_EMAIL_URL} element={<ConfirmEmail />}/>
      <Route path={PROFILE_URL} element={<Profile />}/>
      <Route path={FORGOT_PASSWORD_URL} element={<SendAuthEmail requestType={"forgot_password"}/>}/>
      <Route path={CHANGE_PASSWORD_URL} element={<UpdatePassword isChangePassword/>}/>
      <Route path={RESET_PASSWORD_URL} element={<UpdatePassword isResetPassword/>}/>
      <Route path={LOADER_URL} element={<Loader/>}/>
    </Route>
  )
)
