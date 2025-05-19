import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, BrowserRouter  } from "react-router-dom";
import Home from "./Home.jsx";
import Admin from "./Admin.jsx";
import Dashboard from "./scenes/admin/dashboard";
import ManageUsers from "./scenes/admin/manageUsers/index.jsx";
import Bar from "./scenes/admin/bar";
import UserForm from "./scenes/admin/userForm";
import Chat from "./scenes/admin/chat";
import Cart from "./components/Cart/cart.jsx";
import Calendar from "./scenes/admin/calendar/calendar";
import BookCategoryList from "./components/BookCategoryList/BookCategoryList.jsx";
import AdminBookList from "./scenes/admin/BookList/AdminBookList.jsx";
import Books from "./components/BooksSlider/Books.jsx";
import "./CheckToken.jsx";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BookDetail from "./components/BookDetail/BookDetail.jsx";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder.jsx";
import UserDetail from "./components/UserDetail/UserDetail.jsx";
import { Car } from "lucide-react";
import BookForm from "./scenes/admin/bookForm/index.jsx";
import OrderList from "./scenes/admin/order/index.jsx";


const router = createBrowserRouter(
  [{
  path: '/',
  element: <App/>,
  children:[
    {index:true, element: <Home/>},
    {path:'books', element:<BookCategoryList/>},
    {path:'cart', element: <Cart/>},
    {path:'placeorder', element:<PlaceOrder/>},
    {path:'user-detail', element:<UserDetail/>},
    {path:'book-detail/:id', element:<BookDetail/>}
  ]
},
{path:'/admin', 
  element:<Admin />,
  children:[
    {
      index: true, element: <Dashboard/>
    },
    {path:'manageUsers', element:<ManageUsers />},
    {path:'createUser', element:<UserForm />},
    {path:'addBook', element:<BookForm/>},
    {path:'bar', element:<Bar />},
    {path:'booklist', element:<AdminBookList />},
    {path:'orderlist',element:<OrderList/>},
    {path:'chat', element: <Chat/>},
    {path:'calendar', element:<Calendar />}
  ]
}
],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }
  }
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    </React.StrictMode>
);
