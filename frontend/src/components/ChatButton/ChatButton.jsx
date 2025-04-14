import React, { useState, useEffect } from "react";
import { FaExpand, FaCompress, FaComments } from "react-icons/fa";
import axios from "axios";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState("admin");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(2);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const switchToAdminChat = () => {
    setChatMode("admin");
  };

  const switchToGroupChat = () => {
    setChatMode("group");
  };

  // Gọi API để lấy tin nhắn
  useEffect(() => {
    if (chatMode === "admin") {
      axios
        .post("http://localhost:8090/api/chat/admin/history", {
          userId: userId, // Gửi userId nếu cần
        })
        .then((response) => {
          const filteredMessages = response.data.filter(
            (msg) =>
              msg.chatType === "PRIVATE" &&
              (msg.sender.id === userId || msg.receiver.id === userId)
          );
          setMessages(filteredMessages);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
          alert("Không thể tải lịch sử chat. Vui lòng kiểm tra lại API hoặc thử lại sau.");
        });
    }
  }, [chatMode, userId]);

  return (
    <div>
      {/* Nút bấm nổi */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
      >
        <FaComments size={20} />
      </button>

      {/* Popup chat */}
      {isOpen && (
        <div
          className={`fixed ${isFullscreen
              ? "top-16 left-0 w-full h-[calc(100%-4rem)]"
              : "bottom-16 right-5 w-80"
            } bg-white p-4 rounded-lg shadow-lg border transition-all flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={switchToAdminChat}
                className={`px-3 py-1 rounded ${chatMode === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                  }`}
              >
                Chat với Admin
              </button>
              <button
                onClick={switchToGroupChat}
                className={`px-3 py-1 rounded ${chatMode === "group"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                  }`}
              >
                Chat nhóm
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="text-blue-500 hover:text-blue-700"
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto border p-2 rounded mb-4">
            {chatMode === "admin" ? (
              <>
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
                      {msg.sender.id === userId
                        ? "Bạn"
                        : msg.sender.name}{" "}
                      - {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="mb-2">
                  <div className="bg-gray-200 p-2 rounded-lg text-sm inline-block text-black text-left">
                    Đây là tin nhắn trong nhóm.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Người dùng A - 10:05 AM
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input gửi tin nhắn */}
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 border rounded p-2 mr-2 text-black"
              placeholder="Nhập tin nhắn..."
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;