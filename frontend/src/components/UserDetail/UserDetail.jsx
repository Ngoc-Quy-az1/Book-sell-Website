import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js.cookie"

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

  useEffect(() => {
    const userId = Cookies.get('userId');
    axios
      .get(`http://localhost:8090/api/users/user-detail/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
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
    const updatedData = {
      full_name: user.full_name,
      address: user.address,
      phone: user.phone,
    };

    axios
      .put(`http://localhost:8090/api/users/update/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
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

  if (!user) {
    return <div className="text-center mt-10">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <img
            src={generateAvatar(user.full_name || user.name)}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg mr-6"
          />
          <div>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={user.full_name || ""}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-800">
                {user.full_name || "Chưa cập nhật"}
              </h2>
            )}
            <p className="text-gray-500">{user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t pt-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Email</p>
            <p className="text-lg text-gray-800">{user.mail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số điện thoại</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-lg text-gray-800">{user.phone}</p>
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
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-lg text-gray-800">{user.address || "Chưa cập nhật"}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cấp độ thành viên</p>
            <p className="text-lg text-yellow-600 font-semibold">
              {user.membershipLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6 border-t pt-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Điểm tích lũy</p>
            <p className="text-lg text-indigo-700 font-bold">{user.points}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số dư tài khoản</p>
            <p className="text-lg text-green-600 font-bold">
              {user.balance.toLocaleString()} Xu
            </p>
          </div>
        </div>

        <div className="mt-6 text-right">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Lưu
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;