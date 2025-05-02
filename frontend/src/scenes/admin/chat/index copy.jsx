import { Box, InputBase, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../../theme";
import axios from "axios";
import Cookies from "js.cookie"
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={"/admin"+to} />
    </MenuItem>
  );
};
const Chat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const addUser = (user) => {
    setUsers([...users, user]);
    setShowUsers(false);
    setUserId(userId);
  }
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8090/api/admin/users",{
      method:"GET",
      headers: config
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      setUserList(Response);
    })
  },[])
  const [showUsers, setShowUsers] = useState(true);
  const [userId, setUserId] = useState(18);
  const handleShowUsers = () => {
    setShowUsers(!showUsers);
  }
  const [newMessage, setNewMessage] = useState(""); // Nội dung tin nhắn mới
  const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [messages, setMessages] = useState([]);
  const getMessage = async () => {
      try {
        await fetch(
            "http://localhost:8090/api/chat/admin/history",
            
            {
              method: "POST",
              headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`, 'Content-Type' : 'application/json'},
              body: JSON.stringify({ "userId": userId }),
            }).then(response => response.json())
            .then(result => setMessages(result))
            .catch(error => console.log('error', error));
        } 

      catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Không thể tải lịch sử chat. Vui lòng thử lại sau.");
      }
    };
  
  const showMessage = (id) => {
    setUserId(id)
    getMessage();
    setShowUsers(false);
  }
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("Vui lòng nhập nội dung tin nhắn!");
      return;
    }

    const apiUrl = "http://localhost:8090/api/chat/admin/send";

    const requestBody = { senderId: Cookies.get('userId'), message: newMessage };

    axios
      .post(apiUrl, requestBody, {
        headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
      })
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            messageId: response.data.messageId,
            sender: { id: Cookies.get('userId'), name: "Bạn" },
            message: newMessage,
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi tin nhắn:", error);
        alert("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
      });
  };
  return (
    <Box m="20px" className=" overflow-y-auto flex-1 border p-3 rounded mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <Box 
      display="grid"
      gridTemplateColumns="repeat(10,minmax(40px,1fr))"
      gridAutoRows="40px"
      gap="10px"
      >
        {users.map((user) => 
        <button 
        key={user.id}>
          <Box 
          height = "40px"
          borderRadius="5px"
          gridColumn="span 1"
          backgroundColor={colors.greenAccent[600]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => showMessage(user.id)}
          >
            {user.name}
          </Box>
        </button>)}
        <Box
        height = "40px"
        borderRadius="30px"
        width="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setShowUsers(true)}>
          <AddBoxIcon />
        </Box>
      </Box>
      {showUsers ?
      <div className="h-[60vh] overflow-y-auto border p-3 rounded mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {userList.map((user) => (
        <div style={{backgroundColor:colors.greenAccent[600], borderRadius:5}}>
          <button style={{width:"100%", height:"30px"}} key={user.id} onClick={() => addUser(user)}>
            {user.name}
          </button>
        </div>
        ))}
      </div> 
      :<>
        <div className="h-[60vh] flex-1 overflow-y-auto border p-3 rounded mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`mb-2 ${msg.sender.id === Cookies.get("userId") ? "text-right" : "text-left" 
                    }`}
                >
                  <div
                    className={`${msg.sender.id === Cookies.get("userId")
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-200 text-black"
                      } p-2 rounded-lg text-sm inline-block`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.sender?.id == Cookies.get("userId") ? "Bạn" : msg.sender?.name || "Unknown" } {msg.sender.id}- {" "}
                    {msg.createdAt
                      ? (() => {
                        const date = new Date(msg.createdAt);
                        const formattedDate = date.toLocaleDateString();
                        const formattedTime = date.toLocaleTimeString();
                        return `${formattedDate} ${formattedTime}`;
                      })()
                      : "Invalid Date"}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center">
                    <Box
          display="flex"
          width="100%"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Enter text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
        </Box>
              <button 
                onClick={(handleSendMessage)}
                className="bg-blue-500 text-white px-4 py-2 ml-1 rounded hover:bg-blue-600"
              >
                Gửi
              </button>
          </div>
          </>}
      </Box>
  );
};

export default Chat;
