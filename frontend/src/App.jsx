import React from "react";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import Services from "./components/Services/Services.jsx";
import Banner from "./components/Banner/Banner.jsx";
import AppStore from "./components/AppStore/AppStore.jsx";
import Testimonial from "./components/Testimonial/Testimonial.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import OrderPopup from "./components/OrderPopup/OrderPopup.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { Outlet } from "react-router-dom";
import ChatButton from "./components/ChatButton/ChatButton.jsx";
import Cookies from "js.cookie"
import Books from "./components/BooksSlider/Books.jsx";

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

      <Navbar handleOrderPopup={handleOrderPopup} handleLoginPopup ={handleLoginPopup} />
      {/* <BookCategoryList/> */}
      {/* <Cart/> */}
        <Outlet/>
      { (Cookies.get('authToken'))?
      <>
        <ChatButton />
        <Hero handleOrderPopup={handleOrderPopup} />
        <Services handleOrderPopup={handleOrderPopup} />
        <Banner />
        <AppStore />
        <Testimonial />
      </>
      :
      <>
        <Hero handleOrderPopup={handleOrderPopup} />
        <Services handleOrderPopup={handleOrderPopup} />
        <Banner />
        <AppStore />
        <Testimonial />
      </>  
      }
      <Footer />
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} />

    </div>
  );
};

export default App;
