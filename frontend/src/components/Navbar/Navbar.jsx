import React from "react";
import { useState, useEffect,useRef } from "react";;
import Logo from "../../assets/website/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import {Bell, BellDot} from "lucide-react";
import DarkMode from "./DarkMode";
import { FaCaretDown } from "react-icons/fa";

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
const notiList = [
  {
    id:"1",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
  {
    id:"2",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
  {
    id:"3",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
  {
    id:"4",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
  {
    id:"5",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
  {
    id:"6",
    name: "Nguyen Quang",
    content: "Plese read this notification",
  },
];


const Navbar = ({ handleOrderPopup, handleLoginPopup }) => {
  const [haveNoti, setHaveNoti] = useState(true);
  const [showNoti, setShowNoti] = useState(false);
  const dropdownRef = useRef(null);
  //const handleShowNoti = () => setShowNoti(!showNoti);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setShowNoti(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  return (
    <>
      <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200">
        <div className="container py-3 sm:py-0">
          <div className="flex justify-between items-center">
            <div>
              <a href="#" className="font-bold text-2xl sm:text-3xl flex gap-2">
                <img src={Logo} alt="Logo" className="w-10" />
                Books
              </a>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div>
                <DarkMode />
              </div>
              <ul className="hidden sm:flex items-center gap-4">
                {Menu.map((menu) => (
                  <li key={menu.id}>
                    <a
                      href={menu.link}
                      className="inline-block py-4 px-4 hover:text-primary duration-200"
                    >
                      {menu.name}
                    </a>
                  </li>
                ))}
                {/* Simple Dropdown and Links */}
                <li className="group relative cursor-pointer">
                  <a
                    href="/#home"
                    className="flex h-[72px] items-center gap-[2px]"
                  >
                    Quick Links{" "}
                    <span>
                      <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                    </span>
                  </a>
                  <div className="absolute -left-9 z-[9999] hidden w-[150px] rounded-md bg-white p-2 text-black group-hover:block  ">
                    <ul className="space-y-3">
                      {DropdownLinks.map((data) => (
                        <li key={data.name}>
                          <a
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            href={data.link}
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
              <button
                onClick={() => handleOrderPopup()}
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
              >
                Order
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>
              <div className="flex justify-end relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNoti(!showNoti)}
              >
                {haveNoti?<BellDot color="#3e9392" size={28} />:<Bell color="#3e9392" size={28} />}
              </button>
              {showNoti && (
                <div className="absolute right-0 mt-10 w-96 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-80 overflow-y-auto">
                  {/* Dropdown items */}
                  {notiList.map((noti) => (
                    <div
                      key={noti.id}
                      className="flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <p>{noti.name}</p>
                      <div>{noti.content}</div>
                    </div>
                  ))}
                </div>
              )}
              </div>
              <button
                onClick={() => handleLoginPopup() }
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-8 rounded-full flex items-center gap-3"
              >
                Sign In
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
