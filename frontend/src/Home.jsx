import React from "react";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services.jsx";
import Banner from "./components/Banner/Banner.jsx";
import AppStore from "./components/AppStore/AppStore.jsx";
import Testimonial from "./components/Testimonial/Testimonial.jsx";
import "aos/dist/aos.css";
import Books from "./components/BooksSlider/Books.jsx";

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-x-hidden">
      <Hero />
      <Services />
      <Books/>
      <Banner />
      {/* <AppStore /> */}
      <Testimonial />
    </div>
  );
};

export default Home;
