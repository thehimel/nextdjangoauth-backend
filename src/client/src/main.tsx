import Loader from "@/apps/base/components/ui/Loader.tsx";
import {router} from "@/routes.tsx";
import {ThemeProvider} from "next-themes";
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/react";
import {Provider} from "react-redux";
import {RouterProvider} from "react-router-dom";
import './index.css'
import '@/apps/base/lib/i18n.ts'
import store, {persistor} from "./store/store.ts";
import { PersistGate } from 'redux-persist/integration/react';
import React, {Suspense} from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Suspense fallback={<Loader/>}>
              <RouterProvider router={router}/>
            </Suspense>
          </ThemeProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
