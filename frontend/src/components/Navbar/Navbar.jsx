import React,{ useState, useEffect,useRef } from "react";
import Logo from "../../assets/website/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import {Bell, BellDot} from "lucide-react";
import DarkMode from "./DarkMode";
import { FaCaretDown } from "react-icons/fa";
import Cookies from "js.cookie";
import {Link} from "react-router-dom";
import { CheckToken } from "../../Service";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
];

const DropdownLinks = [
  {
    name: "Books List",
    link: "/books",
  },
  {
    name: "Cart",
    link: "/cart",
  },
];

const getColorFromName = (name) => {
  const colors = ["1abc9c", "3498db", "9b59b6", "e67e22", "e74c3c"];
  const hash = Array.from(name || "").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const generateAvatar = (name) => {
  const initials = (name || "NA")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const bgColor = getColorFromName(name);
  return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff`;
};
const Navbar = ({ handleOrderPopup, handleLoginPopup }) => {
  
  const [notice, setNotice] = useState([]);
  useEffect(() => {
    handleNotice();
  },[])

  const handleNotice = () => {
    if (Cookies.get("authToken")!=null)
    fetch("http://localhost:8090/api/notification/show?userId="+Cookies.get("userId"), {
        headers:{'Authorization': `Bearer ${CheckToken()}`}
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      setNotice(Response);
    console.log(Response)
    })
  }
  const clearAll = () => {
    notice.forEach((message) => {
      if (!message.is_read) markAsRead(message.id);
    }
    )
  }
  const markAsRead = (msgId) => {
    fetch("http://localhost:8090/api/notification/mark-read?notificationId="+msgId,{
        method: "PUT", headers:{'Authorization': `Bearer ${CheckToken()}`}
    }) .then((response) => {
      if (!response.ok) console.error("Fail");
      const id = notice.indexOf(notice.find((e) => e.id == msgId));
      let t = notice;
      t[id].is_read = true;
      setNotice(t);
    });
  }
  const handleSignOut = () =>{
    fetch("http://localhost:8090/api/users/logout/"+Cookies.get("userId"),{
      method:"POST",      
      headers: {      
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CheckToken()}`
        },
      body: JSON.stringify({"token": `${CheckToken()}`})
    }) .then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      Cookies.remove('authToken');
      location.assign('/');
    });
  }
  const fetchUser = () => {

  }
  const [user, setUser] = useState({'full_name':""});
  useEffect(() => {
    if (Cookies.get("authToken")!=null)
    fetch("http://localhost:8090/api/users/user-detail/"+Cookies.get("userId"),
  {
    headers: {'Authorization': `Bearer ${CheckToken()}`}
  })
    .then((response) => {
      return response.json();
    }).then((data) => {
      setUser(data);
    })},[]
  )
  const [showNoti, setShowNoti] = useState(false);
  const [showOption, setShowOption] = useState(false);
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
              <a href="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
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
                    className="flex h-[72px] items-center gap-[2px]"
                  >
                    Quick Links{" "}
                    <span>
                      <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                    </span>
                  </a>
                  <div className="absolute -left-9 z-[9999] hidden w-[150px] rounded-md bg-white dark:bg-black p-2 text-black group-hover:block  ">
                    <ul className="space-y-3 dark:text-white">
                      {DropdownLinks.map((data) => (
                        <li key={data.name}>
                          <Link
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            to={data.link}
                          >
                            {data.name}
                          </Link>
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
              <div className="flex justify-end relative " ref={dropdownRef}>
              
              {CheckToken() ? 
              <>
                <button className="mr-6"
                  onClick={() => setShowNoti(!showNoti)}
                >
                    <BellDot color="#3e9392" size={28} />
                </button>
                {showNoti && (
                  <div className="absolute items-center right-0 mt-10 w-96 bg-white dark:bg-black border border-gray-200 rounded shadow-lg z-10 max-h-80 overflow-y-auto">
                    <div className="flex justify-center">
                      <button onClick={clearAll}> 
                        <div
                            className="flex items-center ml-auto p-2 rounded-lg mb-2 border"
                          >
                          Mark All as read
                        </div>
                      </button>
                    </div>
                    {/* Dropdown items */}
                    {notice.toReversed().map((noti) => (
                      <div
                        key={noti.id}
                        className="border flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer bg-white dark:bg-black hover:dark:bg-gray"
                        onClick={() => markAsRead(noti.id)}
                      >
                        <div className="flex ml-auto p-2 rounded-lg inline-block mb-2 items-center">{noti.message}
                          {noti.is_read ? <></> : <p className="flex-1 w-[8px] h-[8px] ml-3 p-1 rounded-lg bg-[blue]" ></p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={()=>setShowOption(!showOption)} className="w-14 h-14">
                  <img
                  src={generateAvatar(user.full_name || user.name)}
                  alt="Avatar"
                  className=" rounded-full border-4 border-indigo-500 shadow-lg"/>
                  <div className="absolute -left-9 z-[9999] w-[150px] rounded-md bg-white dark:bg-black dark:text-white  p-2 text-black group-hover:block  " hidden={!showOption}>
                      <ul className="space-y-3">
                          <li >
                            <a
                              className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                              href={`/user-detail/${user.id}`}
                            >
                              User Detail
                            </a>
                            {Cookies.get("userId")==16 ?
                            <a
                              className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                              href={`/admin`}
                            >
                              Admin Page
                            </a>: <></>}
                            <a
                              className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                              onClick={handleSignOut}
                            >
                              Log Out
                            </a>
                          </li>
                      </ul>
                    </div>
                </button>
              </>
              :
              <button
                onClick={() => handleLoginPopup() }
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-8 rounded-full flex items-center gap-3"
              >
                Sign In
              </button>
              }
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
