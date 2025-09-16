import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App_layout from "./layout/App_layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
import Links from "./pages/Links";
const App = () => {
  const router = createBrowserRouter([
    {
      element: <App_layout />,
      children: [
        {
          path: "/",
          element: <Home />,
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
           path: "/:id",
          element: <Redirect />,
         },
        {
          path:"/Links/:id",
          element:<Links/>
        },
        {
          path:"*",
          element:<h1>wrong</h1>
        }
      ],
    },
  ]);

  return <div className="">{
    <RouterProvider router={router}/>
  }</div>;
};

export default App;
