import React, { useState } from "react";

const getColorFromName = (name) => {
    const colors = ["1abc9c", "3498db", "9b59b6", "e67e22", "e74c3c"];
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

const generateAvatar = (name) => {
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    const bgColor = getColorFromName(name);
    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff`;
};

const UserDetail = () => {
    const initialUser = {
        full_name: "Nguyễn Văn A",
        name: "nguyenvana",
        phone: "0123456789",
        mail: "nguyenvana@example.com",
        address: "123 Đường ABC, Quận XYZ, TP.HCM",
        membershipLevel: "Gold",
        points: 1500,
        balance: 2000000,
    };

    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleSave = () => {
        // Tùy bạn có thể gửi API ở đây
        setIsEditing(false);
        alert("Đã lưu thông tin!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <div className="flex items-center mb-6">
                    <img
                        src={generateAvatar(user.full_name)}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg mr-6"
                    />
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                name="full_name"
                                value={user.full_name}
                                onChange={handleChange}
                                className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-3xl font-bold text-gray-800">
                                {user.full_name}
                            </h2>
                        )}
                        <p className="text-gray-500">@{user.name}</p>
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
                                value={user.phone}
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
                                value={user.address}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                            />
                        ) : (
                            <p className="text-lg text-gray-800">{user.address}</p>
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
                            {user.balance.toLocaleString()} VNĐ
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
