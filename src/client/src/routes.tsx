import App from "@/App.tsx";
import Signup from "@/components/Auth/Signup/Signup.tsx";
import Home from "@/Home.tsx";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index={true} path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
    </Route>
  )
)
