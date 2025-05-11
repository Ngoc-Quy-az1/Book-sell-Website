import React, { useState, useEffect } from "react";
import { FaExpand, FaCompress, FaComments } from "react-icons/fa";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "webstomp-client";
import axios from "axios";
import Cookies from "js.cookie"
import "../../CheckToken.jsx";

const apiUrl = import.meta.env.VITE_API_URL;
const socket = new SockJS(`${apiUrl}/ws`);
let stompClient = Stomp.over(socket);
const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState("admin"); // admin, group1, group2
  const [userId, setUserId] = useState(Cookies.get('userId'));
  const [newMessage, setNewMessage] = useState(""); // Nội dung tin nhắn mới
  const userToken = localStorage.getItem("token");
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // ✅ Gọi API lấy lịch sử tin nhắn
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    
    const bottom = document.getElementById("bottom");
    if (bottom) {
      bottom.scrollIntoView({ behavior: "smooth" }); // Added smooth scrolling
    }
  }, [messages])
  
  useEffect(() => {
    fetchMessages(chatMode);
  }, [chatMode]);
  useEffect(() => {

    connectWebSocket();
  }, [])
  const ADMIN_ID = 16;  
  const connectWebSocket = () => {
    stompClient.connect({}, function (frame) {
      let channel = '';
      if (chatMode == "admin") channel = "/topic/user-chat/"+ userId;
      else channel = '/topic/group-chat/'+ groupId;
      // Subscribe kênh admin chat
      stompClient.subscribe("/topic/user-chat/"+ userId, function (message) {
        const messageBody = JSON.parse(message.body);
        if (messageBody.chatGroup==null)
          setMessages(messages => [...messages, messageBody])
      });
      stompClient.subscribe("/topic/group-chat/1", function (message) {
        const messageBody = JSON.parse(message.body);
          if (messageBody.chatGroup.groupId==1)
            setMessages(messages => [...messages, messageBody]);
      });
      stompClient.subscribe("/topic/group-chat/2", function (message) {
        const messageBody = JSON.parse(message.body);
          if (messageBody.chatGroup.groupId==2)
            setMessages(messages => [...messages, messageBody]);
      });
      fetchMessages();
    })
  }
  const fetchMessages = async () => {
    try {
      let response;
      if (chatMode == "admin") {
        response = await axios.post(
          `${apiUrl}/api/chat/admin/history`,
          { userId: userId },
          {
            headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
          }
        );
      } else if (chatMode == "group1" || chatMode == "group2") {
        const groupId = chatMode == "group1" ? 1 : 2;
        console.log("Chat Mode:", chatMode);
        console.log("Group ID:", groupId);

        response = await axios.post(
          `${apiUrl}/api/chat/community/history`,
          { groupId: groupId },
          {
            headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
          }
        );
      }
      console.log("Response Data:", response.data);

      const filteredMessages = response.data.filter((msg) => {
        if (chatMode == "admin") {
          return (
            msg.chatType == "PRIVATE" &&
            (msg.sender.id == userId || msg.receiver?.id === userId)
          );
        } else {
          return (
            msg.chatType == "GROUP"            
          );
        }
      });

      console.log("Filtered Messages:", filteredMessages);
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      }
      alert("Không thể tải lịch sử chat. Vui lòng thử lại sau.");
    }
  };

  // ✅ Gửi tin nhắn
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("Vui lòng nhập nội dung tin nhắn!");
      return;
    }
  
    const apiUrl1 =
      chatMode === "admin"
        ? `${apiUrl}/api/chat/admin/send`
        : `${apiUrl}/api/chat/community/send`;
  
    const requestBody =
      chatMode === "admin"
        ? { senderId: userId, message: newMessage }
        : { senderId: userId, message: newMessage, groupId: chatMode == "group1" ? 1 : 2 };
  
    axios
      .post(apiUrl1, requestBody, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
      })
      .then((response) => {
        console.log("Response Data:", response.data);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi tin nhắn:", error);
      });
  };
  return (
    <div>
      {/* Nút mở chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
      >
        <FaComments size={20} />
      </button>

      {/* Giao diện khung chat */}
      {isOpen && (
        <div
          className={`fixed ${isFullscreen
              ? "top-16 left-0 w-full h-[calc(90%)]"
              : "bottom-[4.5rem] right-5 w-[20rem] lg:w-[24rem] lg:bottom-[4.5rem] lg:right-5 h-[70vh]" // Minimized mode: 50vh
            } bg-white p-4 rounded-lg shadow-none border transition-all flex flex-col justify-between`}
          style={{ overflow: "hidden" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setChatMode("admin")}
                className={`px-3 py-1 rounded ${chatMode == "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                  }`}
              >
                Chat với Admin
              </button>
              <button
                onClick={() => setChatMode("group1")}
                className={`px-3 py-1 rounded ${chatMode == "group1"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                  }`}
              >
                Nhóm Chat 1
              </button>
              <button
                onClick={() => setChatMode("group2")}
                className={`px-3 py-1 rounded ${chatMode == "group2"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                  }`}
              >
                Nhóm Chat 2
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="text-blue-500 hover:text-blue-700 p-2" // Thêm padding cho icon
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>

          {/* Tin nhắn */}
          <div className={`flex-1 overflow-y-auto border p-3 rounded mb-4 ${isFullscreen ? "max-h-[80vh]" : "max-h-[50vh]"} space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}>
            {messages.map((msg) => (
              <div
                key={msg.messageId}
                className={`mb-2 ${msg.sender.id === userId ? "text-right" : "text-left"
                  }`}
              >
                <div
                  className={`${msg.sender.id === userId
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black"
                    } p-2 rounded-lg text-sm inline-block`}
                >
                  {msg.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {msg.sender?.id === userId ? "Bạn" : msg.sender?.name || "Unknown"} -{" "}
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
            <div id="bottom" style={{ clear: "both" }}></div> {/* Ensure proper scroll target */}
          </div>

          {/* Nhập tin nhắn */}
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 border rounded p-2 mr-2 text-black lg:mr-4 lg:rounded-lg"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 lg:px-6 lg:py-2 lg:rounded-lg flex-shrink-0"
              style={{ height: "100%" }} // Ensure button matches input height
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;