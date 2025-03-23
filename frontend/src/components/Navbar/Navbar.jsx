import React from "react";

<<<<<<< Updated upstream
const Navbar = ({ handleLoginPopup }) => {
=======
const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/#",
  },
  {
    id: 2,
    name: "Best Seller",
    link: "/#services",
  },
];

const DropdownLinks = [
  {
    name: "Trending Books",
    link: "/#",
  },
  {
    name: "Best Selling",
    link: "/#",
  },
  {
    name: "Authors",
    link: "/#",
  },
];

const Navbar = ({ handleLoginPopup, handleOrderPopup } ) => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  return (
    <>
      <main className="shadow-lg bg-white/70 backdrop-blur-sm">
        <div className="container">
          <nav className="flex justify-between items-center">
            <a
              href="#"
              className="text-gray-800 text-3xl font-bold flex justify-center items-center"
            >
              Logo
            </a>
            <div className="hidden sm:block">
              <ul className="flex font-semibold justify-center items-center gap-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 px-4 py-4 inline-block select-none"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 px-4 py-4 inline-block select-none"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 px-4 py-4 inline-block select-none"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handleLoginPopup}
                    className="text-gray-700 hover:text-gray-900 px-4 py-4 inline-block select-none"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>

            {/* hamburger menu */}
            <div className="block sm:hidden">
              <button
                onClick={handleLoginPopup}
                className="text-gray-700 text-xl font-semibold hover:text-gray-900 px-4 py-4 inline-block"
              >
<<<<<<< Updated upstream
                Login
=======
                Order
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>
              <button
                onClick={() => handleLoginPopup()}
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-8 rounded-full flex items-center gap-3"
              >
                Sign In
>>>>>>> Stashed changes
              </button>
            </div>
          </nav>
        </div>
      </main>
    </>
  );
};

export default Navbar;
