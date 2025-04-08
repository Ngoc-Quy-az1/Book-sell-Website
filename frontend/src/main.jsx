import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserDetail from "./components/UserDetail/UserDetail.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./admin.jsx";
import Dashboard from "./scenes/admin/dashboard";
import ManageUsers from "./scenes/admin/manageUsers/index.jsx";
import Bar from "./scenes/admin/bar";
import Form from "./scenes/admin/form";
import Line from "./scenes/admin/line";
import Pie from "./scenes/admin/pie";
import FAQ from "./scenes/admin/faq";
import Geography from "./scenes/admin/geography";
import Calendar from "./scenes/admin/calendar/calendar";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const router = createBrowserRouter([{
  path: '/',
  element: <App/>,
},
{
  path: '/user-detail',
  element: <UserDetail />
},
{path:'/admin', 
  element:<Admin />,
  children:[{
    index:true, element: <Dashboard/>
  },
    {path:'manageUsers', element:<ManageUsers />},
    {path:'form', element:<Form />},
    {path:'bar', element:<Bar />},
    {path:'pie', element:<Pie />},
    {path:'line', element:<Line />},
    {path:'faq', element:<FAQ />},
    {path:'calendar', element:<Calendar />},
    {path:'geography', element:<Geography />}
  ]
}
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>

  </React.StrictMode>
);
