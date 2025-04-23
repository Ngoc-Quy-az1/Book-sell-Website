import { Box, InputBase, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../../theme";
import axios from "axios";
import Cookies from "js.cookie"
const userId = 2;
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
  const [chatMode, setChatMode] = useState("group1"); 
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // Nội dung tin nhắn mới
  const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const userId = Cookies.get('userId');
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let response;
        if (chatMode === "admin") {
          response = await axios.post(
            "http://localhost:8090/api/chat/admin/history",
            { userId: userId },
            {
              headers: config,
            }
          );
          const filteredMessages = response.data.filter(
            (msg) =>
              msg.chatType === "PRIVATE" &&
              (msg.sender.id === userId || msg.receiver?.id === userId)
          );
          setMessages(filteredMessages);
        } else if (chatMode === "group1" || chatMode === "group2") {
          const groupId = chatMode === "group1" ? 1 : 2;
          response = await axios.post(
            "http://localhost:8090/api/chat/community/history",
            { groupId: groupId },
            {
              headers: config,
            }
          );
          const filteredMessages = response.data.filter(
            (msg) =>
              msg.chatType === (chatMode === "admin" ? "PRIVATE" : "GROUP") &&
              (msg.sender.id === userId || msg.receiver?.id === userId || msg.groupId)
          );
          setMessages(filteredMessages);
        }

      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Không thể tải lịch sử chat. Vui lòng thử lại sau.");
      }
    };

    fetchMessages();
  }, [chatMode, userId]);
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("Vui lòng nhập nội dung tin nhắn!");
      return;
    }

    const apiUrl =
      chatMode === "admin"
        ? "http://localhost:8090/api/chat/admin/send"
        : "http://localhost:8090/api/chat/community/send";

    const requestBody =
      chatMode === "admin"
        ? { senderId: userId, message: newMessage }
        : { senderId: userId, message: newMessage, groupId: chatMode === "group1" ? 1 : 2 };

    axios
      .post(apiUrl, requestBody, {
        headers: config,
      })
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            messageId: response.data.messageId,
            sender: { id: userId, name: "Bạn" },
            message: newMessage,
            createdAt: new Date().toISOString(),
            groupId: chatMode === "group1" ? 1 : 2,
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
        <button>
        <Box 
        height = "40px"
        borderRadius="5px"
        gridColumn="span 1"
        backgroundColor={colors.greenAccent[600]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setChatMode("group1")}
        >
          Group chat 1
        </Box>
        </button>
        <button>
        <Box 
        height = "40px"
        borderRadius="5px"
        gridColumn="span 1"
        backgroundColor={colors.greenAccent[600]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setChatMode("group2")}
        >
          Group chat 2
        </Box>
        </button>
        <button>
        <Box 
        height = "40px"
        borderRadius="5px"
        gridColumn="span 1"
        backgroundColor={colors.greenAccent[600]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setChatMode("group2")}
        >
          {chatMode}
        </Box>
        </button>
      <Box
        height = "40px"
        borderRadius="30px"
        width="40px"
        display="flex"
        alignItems="center"
        justifyContent="center">
        <AddBoxIcon 
        onClick={() => console.log("Click")}/>
        </Box>
      </Box>
      
      <div className="h-[60vh] flex-1 overflow-y-auto border p-3 rounded mb-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
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
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 ml-1 rounded hover:bg-blue-600"
            >
              Gửi
            </button>
          </div>
      </Box>
  );
};

export default Chat;
