import { Box, InputBase, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "webstomp-client";
import { tokens } from "../../../theme";
import axios from "axios";
import Cookies from "js.cookie";
import "../../../CheckToken";

const Chat = () => {
  const ADMIN_ID = Cookies.get("userId");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [subscribed, setSubscribed] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      })
      .then((Response) => {
        setUserList(Response.data.filter((user) => !user.is_admin));
      });
    connectWebSocket();
  }, []);

  useEffect(() => {
    document.getElementById("bottom").scrollIntoView();
  }, [messages]);

  const showMessage = (id) => {
    setUserId(id);
    getMessage(id);
    if (!subscribed.includes(id)) {
      setSubscribed((prev) => [...prev, id]);
      connectWebSocket(id);
    }
  };

  const getMessage = async (userId) => {
    await axios
      .post(
        `${apiUrl}/api/chat/admin/history`,
        { userId },
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      )
      .then((result) => {
        setMessages(result.data);
      });
  };

  const connectWebSocket = (userId) => {
    if (!userId) return;
    const socket = new SockJS(`${apiUrl}/ws`);
    const stompClient = Stomp.over(socket,{debug:false}); 

    stompClient.connect({}, function () {
      stompClient.subscribe(`/topic/admin-chat/${ADMIN_ID}`, function (message) {
        const messageBody = JSON.parse(message.body);
        if (
          messageBody.sender.id === userId &&
          messageBody.receiver.id === ADMIN_ID
        ) {
          setMessages((prevMessages) => [...prevMessages, messageBody]);
        }
      });
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const requestBody = {
      adminId: Cookies.get("userId"),
      userId: userId,
      message: newMessage,
    };

    axios
      .post(`${apiUrl}/api/chat/admin/reply`, requestBody, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      })
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            messageId: response.data.messageId,
            sender: { id: Cookies.get("userId"), name: "Bạn" },
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
    <Box m="20px" className="flex flex-col md:flex-row border h-[80vh] rounded mb-4 overflow-hidden">
      {/* Sidebar with horizontal scroll on mobile */}
      <div className="w-full md:w-1/5 h-[10vh] md:h-full flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto border-r md:border-r p-2 space-x-2 md:space-x-0 md:space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 whitespace-nowrap">
        {userList.map((user) => (
          <div
            key={user.id}
            className="inline-block"
            style={{
              backgroundColor:
                userId === user.id
                  ? colors.redAccent[600]
                  : colors.greenAccent[600],
              borderRadius: 5,
            }}
          >
            <button
              className="px-4 py-2 w-full md:w-[100%] h-full"
              onClick={() => showMessage(user.id)}
            >
              {user.name}
            </button>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-4/5 h-[70vh] md:h-full flex flex-col p-2 space-y-2">
        <div className="flex-1 overflow-y-auto p-3 mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`mb-2 ${msg.sender.id === Cookies.get("userId") ? "text-right" : "text-left"}`}
            >
              <div
                className={`${
                  msg.sender.id === Cookies.get("userId")
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
                      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    })()
                  : "Invalid Date"}
              </div>
            </div>
          ))}
          <div id="bottom" className="float-left clear-both" />
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <Box
            display="flex"
            flex="1"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Enter text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
          </Box>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </Box>
  );
};

export default Chat;
