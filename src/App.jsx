import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App_layout from "./layout/App_layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UrlShortener from "./Components/UrlShortener";
import Redirect from "./pages/Redirect";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/r/:shortCode",
      element: <Redirect />,
    },
    {
      element: <App_layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/create-link",
          element: <UrlShortener />,
        },
        {
          path: "*",
          element: <Dashboard />,
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <div className="">
        <RouterProvider router={router}/>
      </div>
    </AuthProvider>
  );
};

export default App;
