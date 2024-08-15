import App from "@/App.tsx";
import SendAuthEmail from "@/components/auth/email/SendAuthEmail.tsx";
import Signup from "@/components/auth/Signup.tsx";
import ConfirmEmail from "@/components/auth/email/ConfirmEmail.tsx";
import GoogleAuthCallback from "@/components/auth/google/GoogleAuthCallback.tsx";
import Login from "@/components/auth/Login.tsx";
import Loader from "@/components/screens/Loader.tsx";
import UpdatePassword from "@/components/user/UpdatePassword.tsx";
import UpdateProfile from "@/components/user/UpdateProfile.tsx";
import {
  CHANGE_PASSWORD_URL,
  CONFIRM_EMAIL_URL, FORGOT_PASSWORD_URL, GOOGLE_REDIRECT_URL,
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
      <Route path={SIGNUP_URL} element={<Signup />}/>
      <Route path={LOGIN_URL} element={<Login/>}/>
      <Route path={CONFIRM_EMAIL_URL} element={<ConfirmEmail />}/>
      <Route path={PROFILE_URL} element={<UpdateProfile />}/>
      <Route path={FORGOT_PASSWORD_URL} element={<SendAuthEmail type={"forgot_password"}/>}/>
      <Route path={CHANGE_PASSWORD_URL} element={<UpdatePassword type={"change"}/>}/>
      <Route path={RESET_PASSWORD_URL} element={<UpdatePassword type={"reset"}/>}/>
      <Route path={LOADER_URL} element={<Loader/>}/>
      <Route path={GOOGLE_REDIRECT_URL} element={<GoogleAuthCallback/>}/>
    </Route>
  )
)
