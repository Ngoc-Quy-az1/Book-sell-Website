import React,{ useState, useEffect,useRef } from "react";
import Logo from "../../assets/website/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import {Bell, BellDot} from "lucide-react";
import DarkMode from "./DarkMode";
import { FaCaretDown } from "react-icons/fa";
import Cookies from "js.cookie";
import {Link} from "react-router-dom";
import "../../CheckToken";
import axios from "axios";

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
  {
    name: "Order",
    link: "/placeorder",
  },
];

  const apiUrl = import.meta.env.VITE_API_URL;
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNoti, setShowNoti] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const dropdownRef = useRef(null);
  const notiRef = useRef(null);

  useEffect(() => {
    fetchData();
    // Fetch unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    if (Cookies.get("authToken")) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/notification/unread-count?userId=${Cookies.get("userId")}`,
          {
            headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
          }
        );
        setUnreadCount(response.data);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }
  };

  const fetchData = async () => {
    if (Cookies.get("authToken")) {
      try {
        const [userResponse, noticeResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/users/user-detail/${Cookies.get("userId")}`, {
            headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
          }),
          axios.get(`${apiUrl}/api/notification/show?userId=${Cookies.get("userId")}`, {
            headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
          })
        ]);
        setUser(userResponse.data);
        setNotice(noticeResponse.data);
        fetchUnreadCount();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/notification/delete-all?userId=${Cookies.get("userId")}`,
        {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
        }
      );
      setNotice([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const markAsRead = async (msgId) => {
    try {
      await axios.put(
        `${apiUrl}/api/notification/mark-read?notificationId=${msgId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
        }
      );
      const updatedNotice = notice.map(n => 
        n.id === msgId ? { ...n, is_read: true } : n
      );
      setNotice(updatedNotice);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (msgId) => {
    try {
      await axios.delete(
        `${apiUrl}/api/notification/delete?notificationId=${msgId}`,
        {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
        }
      );
      // Remove the deleted notification from state
      setNotice(prevNotice => prevNotice.filter(n => n.id !== msgId));
      // Update unread count if the deleted notification was unread
      const deletedNoti = notice.find(n => n.id === msgId);
      if (deletedNoti && !deletedNoti.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSignOut = async () =>{
    axios.post(`${apiUrl}/api/users/logout/${Cookies.get("userId")}`,
    {token: `${Cookies.get('authToken')}`},
    {
      headers: {      
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
    })
    .then((response) => {
      console.log(response.data);
      Cookies.remove('authToken');
      location.assign('/');
    });
  }
  const [user, setUser] = useState({'full_name':""});
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
              <Link
                to="/books"
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
              >
                Order
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </Link>
              <div className="flex justify-end relative" ref={dropdownRef}>
              
              {Cookies.get('authToken') ? 
              <>
                <div className="relative mr-6" ref={notiRef}>
                  <button
                    onClick={() => setShowNoti(!showNoti)}
                    className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    {unreadCount > 0 ? (
                      <BellDot className="text-primary" size={28} />
                    ) : (
                      <Bell className="text-gray-600 dark:text-gray-400" size={28} />
                    )}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNoti && (
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 transform transition-all duration-200 ease-out">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <div className="flex gap-2">
                          {notice.length > 0 && (
                            <>
                              <button
                                onClick={clearAll}
                                className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
                              >
                                Mark all as read
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete all notifications?')) {
                                    clearAll();
                                  }
                                }}
                                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              >
                                Delete all
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notice.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No notifications
                          </div>
                        ) : (
                          notice.toReversed().map((noti) => (
                            <div
                              key={noti.id}
                              className={`group p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                !noti.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                                    !noti.is_read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                  }`} 
                                />
                                <div className="flex-1" onClick={() => markAsRead(noti.id)}>
                                  <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {noti.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(noti.created_at).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this notification?')) {
                                      deleteNotification(noti.id);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all duration-200"
                                  title="Delete notification"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={()=>setShowOption(!showOption)} className="w-14 h-14">
                  <img
                  src={generateAvatar(user.full_name || user.name)}
                  alt="Avatar"
                  className=" rounded-full border-4 border-indigo-500 shadow-lg"/>
                  <div className="absolute -left-9 z-[9999] w-[150px] rounded-md bg-white dark:bg-black dark:text-white  p-2 text-black group-hover:block  " hidden={!showOption}>
                      <ul className="space-y-3">
                          <li >
                            <Link
                              className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                              to={`/user-detail`}
                            >
                              User Detail
                            </Link>
                            {Cookies.get("userId")==16 ?
                            <Link
                              className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                              to={`/admin`}
                            >
                              Admin Page
                            </Link>: <></>}
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
