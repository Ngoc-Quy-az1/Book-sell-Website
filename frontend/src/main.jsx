import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserDetail from "./components/UserDetail/UserDetail.jsx";
import "./index.css";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Admin from "./admin.jsx";
import Dashboard from "./scenes/admin/dashboard";
import Team from "./scenes/admin/team";
import Invoices from "./scenes/admin/invoices";
import Contacts from "./scenes/admin/contacts";
import Bar from "./scenes/admin/bar";
import Form from "./scenes/admin/form";
import Line from "./scenes/admin/line";
import Pie from "./scenes/admin/pie";
import FAQ from "./scenes/admin/faq";
import Geography from "./scenes/admin/geography";
import Calendar from "./scenes/admin/calendar/calendar";
import BookCategoryList from "./components/BookCategoryList/BookCategory.jsx";
import AdminBookCategoryList from "./scenes/admin/BookCategoryList/BookCategory.jsx";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const router = createBrowserRouter([{
  path: '/',
  element: <App/>,
},
{
  path: "/user-detail",
  element: (
    <>
      <App />
      <UserDetail />
    </>
  ),
},
{path:'/admin', 
  element:<Admin />,
  children:[{
    index:true, element: <Dashboard/>
  },
    {path:'team', element:<Team />},
    {path:'contacts', element:<Contacts />},
    {path:'invoices', element:<Invoices />},
    {path:'form', element:<Form />},
    {path:'bar', element:<Bar />},
    {path:'pie', element:<Pie />},
    {path:'line', element:<Line />},
    {path:'booklist', element:<AdminBookCategoryList />},
    {path:'faq', element: <FAQ/>},
    {path:'calendar', element:<Calendar />},
    {path:'geography', element:<Geography />}]
}
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
