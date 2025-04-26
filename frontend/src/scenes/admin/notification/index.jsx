
import React, { useState, useEffect, useRef } from "react";
import { FaExpand, FaCompress, FaComments } from "react-icons/fa";
import { Box, useTheme } from "@mui/material";
import axios from "axios";
import Cookies from "js.cookie"
import { tokens } from "../../../theme";
export default Notification = ({notification, handleNotification}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState([]);
  useEffect(() => {
    handleNotice();
  },[])
  const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}

  const handleNotice = () => {
    fetch("http://localhost:8090/api/notification/show?userId="+Cookies.get("userId"), {
        headers:config
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      setNotice(Response);
    })
  }
  const clearAll = () => {
    notice.map((message) => {
      if (!message.is_read) markAsRead(message.id);
    }
    )
  }
  const markAsRead = (msgId) => {
    fetch("http://localhost:8090/api/notification/mark-read?notificationId="+msgId,{
        method: "PUT", headers:config
    }) .then((response) => {
      if (!response.ok) console.error("Fail");
    }).then((data) => {
    });
  }
  return (
    <div 
    >
      {notification && (
        <Box
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
                {msg.is_read ? "" : <Box className="flex-1 w-[10px] h-[10px] p-1 rounded-lg" 
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