import {createBrowserRouter, RouterProvider,  Outlet,} from "react-router";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Home from "../pages/Home";
import Watch from "../pages/Watch";
import Register from "../pages/Register";
import Login from "../pages/Login";

function Layout() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar />

      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "watch/:id", element: <Watch /> },
    ],
  },
  {
    path:"/register", element:<Register />
  },
  {
    path:"/login", element:<Login />
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
