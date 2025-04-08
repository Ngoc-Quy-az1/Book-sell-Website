import React, { useState } from "react";
import { FaExpand, FaCompress, FaComments } from "react-icons/fa";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState("admin");

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
          className={`fixed ${
            isFullscreen
              ? "top-16 left-0 w-full h-[calc(100%-4rem)]"
              : "bottom-16 right-5 w-80"
          } bg-white p-4 rounded-lg shadow-lg border transition-all flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={switchToAdminChat}
                className={`px-3 py-1 rounded ${
                  chatMode === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Chat với Admin
              </button>
              <button
                onClick={switchToGroupChat}
                className={`px-3 py-1 rounded ${
                  chatMode === "group"
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
                {/* Tin nhắn từ admin */}
                <div className="mb-2">
                  <div className="bg-gray-200 p-2 rounded-lg text-sm inline-block text-black text-left">
                    Xin chào! Tôi có thể giúp gì cho bạn?
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Admin - 10:00 AM</div>
                </div>

                {/* Tin nhắn từ client */}
                <div className="mb-2 text-right">
                  <div className="bg-blue-500 text-white p-2 rounded-lg text-sm inline-block ml-auto text-left">
                    Tôi muốn hỏi về sản phẩm. Tôi muốn hỏi về sản phẩm. Tôi muốn hỏi về sản phẩm.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Bạn - 10:01 AM</div>
                </div>
              </>
            ) : (
              <>
                {/* Tin nhắn nhóm */}
                <div className="mb-2">
                  <div className="bg-gray-200 p-2 rounded-lg text-sm inline-block text-black text-left">
                    Đây là tin nhắn trong nhóm.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Người dùng A - 10:05 AM</div>
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