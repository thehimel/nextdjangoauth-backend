import App from "@/App.tsx";
import Auth from "@/components/Auth/Auth.tsx";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index={true} path="/" element={<Home/>}/>
      <Route path="/signup/" element={<Auth pageType="signup" />}/>
      <Route path="/signup/confirm-email/:key/" element={<Auth pageType="confirm-email" />}/>
    </Route>
  )
)
