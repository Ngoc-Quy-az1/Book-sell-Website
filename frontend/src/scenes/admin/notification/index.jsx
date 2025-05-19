
import React, { useState, useEffect, useRef } from "react";
import { FaExpand, FaCompress, FaComments } from "react-icons/fa";
import { Box, useTheme } from "@mui/material";
import axios from "axios";
import Cookies from "js.cookie"
import { tokens } from "../../../theme";
import "../../../CheckToken";
export default Notification = ({notification, handleNotification}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [notice, setNotice] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    handleNotice();
  },[])

  const handleNotice = async () => {
    await axios.get(`${apiUrl}/api/notification/show?userId=`+Cookies.get("userId"), {
        headers:{'Authorization': `Bearer ${Cookies.get('authToken')}`}
    })
    .then(Response => {
      //console.log(Response.data)
      setNotice(Response.data);
    })
  }
  const clearAll = () => {
    notice.forEach((message) => {
      if (!message.is_read) markAsRead(message.id);
    }
    )
  }
  const markAsRead = async (msgId) => {
    await axios.put(`${apiUrl}/api/notification/mark-read?notificationId=`+msgId,{},{
       headers:{'Authorization': `Bearer ${Cookies.get('authToken')}`}
    }) .then(() => {
      const t = notice.map(n => n.id === msgId ? { ...n, is_read: true } : n);
      setNotice(t);
    });
  }
  const ref=useRef();
  


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleNotification(); 
        //console.log("Cl")
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div 
    >
      {notification && (
        <Box ref={ref}
          className={`fixed top-16 right-5 w-80 rounded-lg shadow-lg border transition-all flex flex-col`}
          backgroundColor={colors.primary[400]}
          borderColor={colors.primary[300]}
        > 
          <button onClick={clearAll}> 
            <Box
                className={ `ml-auto p-2 rounded-lg text-sm inline-block mb-2`}
                display="flex"
                justifyContent="center"
                alignItems="center"
                backgroundColor={colors.primary[400]}
                color={colors.primary[100]}
                style={{ borderWidth:"1px"}}
                borderColor={colors.primary[300]}
              >
              Mark All as read
            </Box>
            </button>
          <div className="flex-1 overflow-y-auto p-3 rounded max-h-[60vh] space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {notice.toReversed().map((msg) => (
              <Box
                className={ `ml-auto p-2 rounded-lg text-sm inline-block mb-2`}
                display="flex"
                justifyContent="center"
                alignItems="center"
                backgroundColor={colors.primary[400]}
                color={colors.primary[100]}
                key={msg.id}
                style={{ borderWidth:"1px"}}
                borderColor={colors.primary[300]}
                onClick={(() => markAsRead(msg.id))}
              >
                {msg.message}
                {msg.is_read ? <></> : <Box className="flex-1 w-[10px] h-[10px] p-1 rounded-lg" 
                  backgroundColor="blue" 
                  display="flex"/>}
              </Box>
            ))}
          </div>
        </Box>
      )}
    </div>
  );
}