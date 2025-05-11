import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import OrderPopup from "./components/OrderPopup/OrderPopup.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { Outlet } from "react-router-dom";
import ChatButton from "./components/ChatButton/ChatButton.jsx";
import Cookies from "js.cookie";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  const [loginPopup, setLoginPopup] = React.useState(false);
  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/*Cookies.remove('authToken')}
      {Cookies.remove("userId")*/}
      <Navbar handleOrderPopup={handleOrderPopup} handleLoginPopup ={handleLoginPopup} />
      {/* <BookCategoryList/> */}
      {/* <Cart/> */}
        <Outlet/>
      { (Cookies.get('authToken') && Cookies.get('userId')!=16)?
      <>
        <ChatButton />
      </>
      :<></>
      
      }
      <>
      </>  
      <Footer />
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} />

    </div>
  );
};

export default App;
