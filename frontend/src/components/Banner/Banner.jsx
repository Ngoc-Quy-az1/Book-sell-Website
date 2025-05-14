import React from "react";
// import BooksStack from "../../assets/website/books-stack.png";
import BooksStack from "../../assets/website/library.jpg";
import Vector from "../../assets/vector3.png";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { Link } from "react-router-dom";

import { FaBookOpen, FaTruck, FaCreditCard, FaGift } from "react-icons/fa";

const Banner = () => {
  const bgImage = {
    backgroundImage: `url(${Vector})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  };

  const features = [
    {
      icon: <FaBookOpen className="w-8 h-8" />,
      title: "Quality Books",
      description: "Curated collection of best-selling books",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping nationwide",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: <FaCreditCard className="w-8 h-8" />,
      title: "Easy Payment",
      description: "Multiple secure payment options",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <FaGift className="w-8 h-8" />,
      title: "Special Offers",
      description: "Regular discounts and promotions",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image section */}
          <div className="relative" data-aos="fade-right" data-aos-duration="1000">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
            <img
              src={BooksStack}
              alt="Library"
              className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/150?img=${i + 1}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">1.2k+ Happy Readers</p>
                  <p className="text-gray-500 dark:text-gray-400">Join our community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-col gap-8" data-aos="fade-left" data-aos-duration="1000">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Open a Book, Open a World.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-orange-600">
                Anytime, Anywhere.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                From academic books to entertaining stories, we bring the bookstore right to your space.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`inline-block p-3 rounded-xl ${feature.bgColor} mb-4`}>
                    <div className={feature.iconColor}>{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
              <Link to="/books">
                Start Buying Now
              </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
