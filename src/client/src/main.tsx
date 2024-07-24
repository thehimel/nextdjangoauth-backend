import {router} from "@/routes.tsx";
import {ThemeProvider} from "next-themes";
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/react";
import {Provider} from "react-redux";
import {RouterProvider} from "react-router-dom";
import './index.css'
import store, {persistor} from "./store/store.ts";
import { PersistGate } from 'redux-persist/integration/react';
import React from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <RouterProvider router={router}/>
          </ThemeProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
