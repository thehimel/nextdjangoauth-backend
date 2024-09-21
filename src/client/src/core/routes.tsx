import {authRoutes} from "@/apps/auth/routes/authRoutes.tsx";
import App from "@/core/App.tsx";
import Loader from "@/apps/base/components/ui/Loader.tsx";
import Home from "@/apps/base/pages/Home.tsx";
import {HOME_URL, LOADER_URL} from "@/apps/base/urls/client.ts";
import {createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={HOME_URL} element={<App/>}>
      <Route index={true} path={HOME_URL} element={<Home/>}/>
      <Route path={LOADER_URL} element={<Loader/>}/>
      {authRoutes}
    </Route>
  )
)
