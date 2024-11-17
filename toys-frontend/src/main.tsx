import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./context/UserContext.tsx";
import { MantineProvider } from "@mantine/core";
import ErrorPage from "./pages/Error/ErrorPage.tsx";
import { DatesProvider } from '@mantine/dates';

import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "./main.css"

const mainRouter = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <ErrorPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookiesProvider>
      <UserProvider>
        <MantineProvider>
            <RouterProvider router={mainRouter} />
        </MantineProvider>
      </UserProvider>
    </CookiesProvider>
  </React.StrictMode>,
)