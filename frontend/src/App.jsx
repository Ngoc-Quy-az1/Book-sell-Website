import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
<<<<<<< Updated upstream
import LoginPopup from "./components/LoginPopup/LoginPopup";
import BgImage from "./assets/sunrise.jpg";
import Hero from "./components/Hero/Hero";
=======
import Services from "./components/Services/Services.jsx";
import Banner from "./components/Banner/Banner.jsx";
import AppStore from "./components/AppStore/AppStore.jsx";
import Testimonial from "./components/Testimonial/Testimonial.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import OrderPopup from "./components/OrderPopup/OrderPopup.jsx";
import Books from "./components/BooksSlider/Books.jsx";
>>>>>>> Stashed changes

const App = () => {
  const [loginPopup, setLoginPopup] = useState(false);
  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };
  const [loginPopup, setLoginPopup] = React.useState(false);
  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };

  const bgImage = {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${BgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
  return (
<<<<<<< Updated upstream
    <>
      <main style={bgImage}>
        <Navbar handleLoginPopup={handleLoginPopup} />
        <Hero />
      </main>

      {/* Login Popup */}
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} />
    </>
=======
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleLoginPopup={handleLoginPopup} handleOrderPopup={handleOrderPopup} />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Services handleOrderPopup={handleOrderPopup} />
      <Banner />
      {/* <CoverBanner /> */}
      <AppStore />
      {/* <PdfReader /> */}
      <Books />
      <Testimonial />
      <Footer />
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />      
      {/* Login Popup */}
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} />
      
    </div>
>>>>>>> Stashed changes
  );
};

export default App;
