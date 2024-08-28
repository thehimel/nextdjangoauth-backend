import App from "@/App.tsx";
import SendAuthEmail from "@/components/auth/email/SendAuthEmail.tsx";
import Signup from "@/components/auth/Signup.tsx";
import ConfirmEmail from "@/components/auth/email/ConfirmEmail.tsx";
import GoogleAuthCallback from "@/components/auth/google/GoogleAuthCallback.tsx";
import Login from "@/components/auth/Login.tsx";
import Loader from "@/apps/base/components/ui/Loader.tsx";
import PasswordUpdate from "@/components/users/PasswordUpdate.tsx";
import ProfileUpdate from "@/components/users/ProfileUpdate.tsx";
import {
  PASSWORD_CHANGE_URL,
  VERIFY_EMAIL_URL, PASSWORD_RESET_URL, GOOGLE_REDIRECT_URL,
  HOME_URL, LOADER_URL,
  LOGIN_URL,
  PROFILE_URL, PASSWORD_RESET_CONFIRM_URL,
  SIGNUP_URL,
} from "@/constants/urls.ts";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={HOME_URL} element={<App/>}>
      <Route index={true} path={HOME_URL} element={<Home/>}/>
      <Route path={LOADER_URL} element={<Loader/>}/>

      <Route path={GOOGLE_REDIRECT_URL} element={<GoogleAuthCallback/>}/>
      <Route path={LOGIN_URL} element={<Login/>}/>
      <Route path={SIGNUP_URL} element={<Signup />}/>
      <Route path={VERIFY_EMAIL_URL} element={<ConfirmEmail />}/>

      <Route path={PROFILE_URL} element={<ProfileUpdate />}/>

      <Route path={PASSWORD_RESET_URL} element={<SendAuthEmail type={"forgot_password"}/>}/>
      <Route path={PASSWORD_RESET_CONFIRM_URL} element={<PasswordUpdate type={"reset"}/>}/>
      <Route path={PASSWORD_CHANGE_URL} element={<PasswordUpdate type={"change"}/>}/>
    </Route>
  )
)
