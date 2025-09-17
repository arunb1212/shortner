import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
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
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/Links",
          element: (
            <ProtectedRoute>
              <Links />
            </ProtectedRoute>
          ),
        },
        {
          path: "/Links/:createUrl",
          element: (
            <ProtectedRoute>
              <Links />
            </ProtectedRoute>
          ),
        },
        {
          path:"*",
          element:<h1>Page not found</h1>
        }
      ],
    },
    // Redirect route outside of layout
    {
      path: "/r/:shortCode",
      element: <Redirect />,
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
