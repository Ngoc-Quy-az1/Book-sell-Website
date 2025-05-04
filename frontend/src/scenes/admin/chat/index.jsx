import { Box, InputBase, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "webstomp-client";
import { tokens } from "../../../theme";
import axios from "axios";
import Cookies from "js.cookie"
const Chat = () => {
  const ADMIN_ID = Cookies.get("userId");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState();
  const [newMessage, setNewMessage] = useState(""); // Nội dung tin nhắn mới
  const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [messages, setMessages] = useState([]); 
  const [subscribed, setSubscribed] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8090/api/admin/users",{
      method:"GET",
      headers: config
    })
    .then(Response => {
      return Response.json();
    }) 
    .then(Response => {
      setUserList(Response.filter((user) => !user.is_admin));
    })
    connectWebSocket();
  },[])
  useEffect(() => 
    document.getElementById("bottom").scrollIntoView(),[messages])
  const showMessage = (id) => {
    setUserId(id);
    getMessage(id);
    if (!subscribed.includes(id)) {
      setSubscribed(subscribed => [...subscribed, id]);
      connectWebSocket();
    }
  }
  const getMessage = (userId) => {
  fetch(
    "http://localhost:8090/api/chat/admin/history",
    
    {
      method: "POST",
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`, 'Content-Type' : 'application/json'},
      body: JSON.stringify({ "userId": userId }),
    }).then(response => response.json())
    .then(result => {setMessages(result); console.log(result);})
    .catch(error => console.log('error', error));
  }

  const connectWebSocket = () => {

    const socket = new SockJS('http://localhost:8090/ws');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      // Subscribe kênh admin chat
      stompClient.subscribe('/topic/admin-chat/' + ADMIN_ID, function (message) {
        const messageBody = JSON.parse(message.body);
        console.log(messageBody);

        if (
          (messageBody.sender.id == userId && messageBody.receiver.id == ADMIN_ID) ||
          (messageBody.sender.id == ADMIN_ID && messageBody.receiver.id == userId)
        ) {
          setMessages(messages => [...messages, messageBody])
        }
      });
      getMessage(userId);
  })}

  
 

  
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }

    const apiUrl = "http://localhost:8090/api/chat/admin/reply";

    const requestBody = { adminId: Cookies.get('userId'), userId: userId, message: newMessage };

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
    <Box m="20px" className="flex-1 border h-[80vh] rounded mb-4">
      <div className="inline-block w-1/5 h-full overflow-y-auto flex-1 border-r p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {userList.map((user) => (
        <div style={{backgroundColor:userId == user.id ?colors.redAccent[600] : colors.greenAccent[600], borderRadius:5}} key={user.id}>
          <button style={{width:"100%", height:"30px"}} key={user.id} onClick={() => showMessage(user.id)}>
            {user.name}
          </button>
        </div>
        ))}
      </div> 
      <div className="inline-block w-4/5 h-full overflow-y-auto flex-1 p-3 space-y-2 ">
        <div className="float h-[90%] flex-1 overflow-y-auto  p-3 mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`mb-2 ${msg.sender.id === Cookies.get("userId") ? "text-right" : "text-left"}`}
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
        <div style={{ float:"left", clear: "both" }}
             id="bottom"> 
        </div>
        </div>
        <div className="flex items-center">
          <Box
            display="flex"
            width="100%"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <InputBase 
            sx={{ ml: 2, flex: 1 }} 
            placeholder="Enter text" 
            value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleSendMessage();
              }}
            />
          </Box>
          <button 
            onClick={(handleSendMessage)}
            className="bg-blue-500 text-white px-4 py-2 ml-1 rounded hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </Box>
  );
};

export default Chat;
