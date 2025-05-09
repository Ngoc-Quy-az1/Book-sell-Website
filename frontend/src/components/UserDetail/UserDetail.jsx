import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js.cookie"
import qrImage from "../../assets/qr_checkout.png";
import { CheckToken } from "../../Service";

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

const UserDetail = () => {
  const [user, setUser] = useState(null); // Thêm state user
  const [isEditing, setIsEditing] = useState(false); // Thêm state isEditing
  const [showRechargeOptions, setShowRechargeOptions] = useState(false); // State to toggle recharge options
  const [selectedRecharge, setSelectedRecharge] = useState(null); // State to track selected recharge option
  const [customCoins, setCustomCoins] = useState(""); // State for custom coin input

  const rechargeOptions = [
    { amount: 100000, coins: 109 },
    { amount: 200000, coins: 222 },
    { amount: 500000, coins: 599 },
  ];

  useEffect(() => {
    const userId = Cookies.get('userId');
    const apiUrl = import.meta.env.VITE_API_URL;
    axios
      .get(`${apiUrl}/api/users/user-detail/${userId}`, {
        headers: {
          Authorization: `Bearer ${CheckToken()}`,
        },
      })
      .then((response) => {
        setUser(response.data); // Lưu dữ liệu người dùng vào state
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    const userId = Cookies.get('userId');
    const apiUrl = import.meta.env.VITE_API_URL;
    const updatedData = {
      full_name: user.full_name,
      address: user.address,
      phone: user.phone,
    };

    axios
      .put(`${apiUrl}/api/users/update/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${CheckToken()}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsEditing(false);
        alert("Thông tin đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        alert("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
      });
  };

  const handleRechargeOption = (option) => {
    setSelectedRecharge(option);
    setCustomCoins(""); // Clear custom input when selecting a predefined option
  };

  const handleCustomRecharge = () => {
    if (!customCoins || isNaN(customCoins) || customCoins <= 0) {
      alert("Vui lòng nhập số xu hợp lệ!");
      return;
    }
    const amount = customCoins * 1000; // Calculate price based on 1000đ = 1 xu
    setSelectedRecharge({ amount, coins: customCoins });
  };

  if (!user) {
    return <div className="text-center mt-10">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={generateAvatar(user.full_name || user.name)}
            alt="Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500 shadow-lg mb-4 sm:mb-0 sm:mr-6"
          />
          <div className="text-center sm:text-left">
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={user.full_name || ""}
                onChange={handleChange}
                className="text-xl sm:text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {user.full_name || "Chưa cập nhật"}
              </h2>
            )}
            <p className="text-gray-500">{user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-t pt-4 sm:pt-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Email</p>
            <p className="text-base sm:text-lg text-gray-800">{user.mail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số điện thoại</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm sm:text-base"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800">{user.phone}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Địa chỉ</p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={user.address || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm sm:text-base"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800">{user.address || "Chưa cập nhật"}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cấp độ thành viên</p>
            <p className="text-base sm:text-lg text-yellow-600 font-semibold">
              {user.membershipLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Điểm tích lũy</p>
            <p className="text-base sm:text-lg text-indigo-700 font-bold">{user.points}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số dư tài khoản</p>
            <p className="text-base sm:text-lg text-green-600 font-bold">
              {user.balance.toLocaleString()} Xu
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center sm:text-right flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
            >
              Lưu
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowRechargeOptions(false); // Hide "Nạp Xu" section when editing
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowRechargeOptions(!showRechargeOptions)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm sm:text-base"
              >
                Nạp Xu
              </button>
            </>
          )}
        </div>

        {/* Recharge Coins Section */}
        {showRechargeOptions && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Nạp Xu</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {rechargeOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleRechargeOption(option)}
                  className={`p-4 border rounded-lg shadow-md text-center ${
                    selectedRecharge === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <p className="text-lg font-bold">{option.amount.toLocaleString()} VND</p>
                  <p className="text-sm text-gray-600">Nhận {option.coins} Xu</p>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                min="1"
                value={customCoins}
                onChange={(e) => setCustomCoins(e.target.value)}
                placeholder="Nhập số xu muốn nạp - 1 Xu = 1000 VND"
                className="flex-1 border rounded px-3 py-2 text-sm sm:text-base"
              />
              <button
                onClick={handleCustomRecharge}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
              >
                Xác Nhận
              </button>
            </div>
            {selectedRecharge && (
              <div className="mt-4 text-center">
                <img
                  src={qrImage}
                  alt="QR Code for Recharge"
                  className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-md mx-auto mb-4"
                />
                <p className="text-lg font-bold text-gray-800">
                  Giá: {selectedRecharge.amount.toLocaleString()} VND
                </p>
                <p className="text-sm text-gray-600">
                  Bạn sẽ nhận được {selectedRecharge.coins} Xu
                </p>
                <button
                  onClick={() => alert("Đang kiểm tra giao dịch...")}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm sm:text-base"
                >
                  Check Giao Dịch
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;