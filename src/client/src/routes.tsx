import App from "@/App.tsx";
import Auth from "@/components/Auth/Auth.tsx";
import ConfirmEmail from "@/components/Auth/ConfirmEmail.tsx";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index={true} path="/" element={<Home/>}/>
      <Route path="/signup/" element={<Auth pageType="signup" headline="Create your account to get started" />}/>
      <Route path="/signup/confirm-email/:key/" element={<ConfirmEmail />}/>
    </Route>
  )
)
