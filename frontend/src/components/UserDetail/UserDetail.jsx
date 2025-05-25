import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js.cookie"
import qrImage from "../../assets/qr_checkout.png";
import  "../../CheckToken";
import discountCodeImage from "../../components/Cart/ExampleImage/ahihi.png";

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
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
  const [paymentNotification, setPaymentNotification] = useState({
    type: "", // "success" or "warning"
    title: "",
    message: "",
    details: []
  });
  const [activeTab, setActiveTab] = useState('recharge'); // 'recharge' or 'redeem'
  const [selectedRedemptionType, setSelectedRedemptionType] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedemptionNotification, setShowRedemptionNotification] = useState(false);
  const [redemptionNotification, setRedemptionNotification] = useState({
    type: "",
    title: "",
    message: "",
    details: []
  });

  const rechargeOptions = [
    { amount: 100000, coins: 100, voucher: "giảm 10%" },
    { amount: 200000, coins: 200, voucher: "giảm 20%" },
    { amount: 500000, coins: 500, voucher: "giảm 30%" },
  ];

  useEffect(() => {
    const userId = Cookies.get('userId');
    const apiUrl = import.meta.env.VITE_API_URL;
    axios
      .get(`${apiUrl}/api/users/user-detail/${userId}`, {
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
    const apiUrl = import.meta.env.VITE_API_URL;
    const updatedData = {
      full_name: user.full_name,
      address: user.address,
      phone: user.phone,
    };

    axios
      .put(`${apiUrl}/api/users/update/${userId}`, updatedData, {
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

  const showPaymentNotificationModal = (type, title, message, details = []) => {
    setPaymentNotification({
      type,
      title,
      message,
      details
    });
    setShowPaymentNotification(true);
  };

  const handleCheckPayment = async () => {
    if (isCheckingPayment) return;
    setIsCheckingPayment(true);

    const userId = Cookies.get('userId');
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/update/balance/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );

      // Kiểm tra nếu có số dư mới trong response, nghĩa là giao dịch thành công
      if (response.data.newBalance !== undefined) {
        // Cập nhật số dư người dùng
        setUser((prevUser) => ({
          ...prevUser,
          balance: response.data.newBalance,
        }));

        // Hiển thị thông báo thành công
        showPaymentNotificationModal(
          "success",
          "Nạp xu thành công!",
          "Giao dịch của bạn đã được xử lý thành công.",
          [
            `Số xu đã nạp: ${response.data.amount.toLocaleString()} xu`,
            `Số dư mới: ${response.data.newBalance.toLocaleString()} xu`,
            response.data.paymentStatus === "exact" 
              ? "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!"
              : "Số tiền thừa đã được chuyển thành xu và cộng vào tài khoản của bạn."
          ]
        );

        // Reset trạng thái nạp xu
        setSelectedRecharge(null);
        setShowRechargeOptions(false);
      } else if (response.data.success === false) {
        // Nếu backend trả về success: false
        showPaymentNotificationModal(
          "warning",
          "Nạp xu không thành công",
          response.data.message || "Không thể xử lý giao dịch. Vui lòng thử lại sau.",
          []
        );
      }
    } catch (error) {
      let notificationTitle = "Lỗi nạp xu";
      let notificationMessage = "";
      let notificationDetails = [];

      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("Vui lòng nhập số điện thoại")) {
          notificationMessage = "Vui lòng nhập số điện thoại khi chuyển khoản.";
          notificationDetails = ["Điều này giúp chúng tôi xác nhận giao dịch của bạn."];
        } else if (errorMessage.includes("Vui lòng chuyển khoản")) {
          notificationMessage = "Vui lòng thực hiện chuyển khoản trước khi kiểm tra.";
          notificationDetails = ["Hãy chắc chắn rằng bạn đã chuyển khoản thành công."];
        } else if (errorMessage.includes("Không tìm thấy người dùng")) {
          notificationMessage = "Không tìm thấy thông tin người dùng.";
          notificationDetails = ["Vui lòng đăng nhập lại để tiếp tục."];
        } else {
          notificationMessage = errorMessage || "Có lỗi xảy ra khi xử lý giao dịch.";
          notificationDetails = ["Vui lòng thử lại sau."];
        }
      } else {
        notificationMessage = "Không thể kết nối đến máy chủ.";
        notificationDetails = [
          "Vui lòng kiểm tra kết nối internet của bạn.",
          "Nếu vấn đề vẫn tiếp tục, hãy thử lại sau."
        ];
      }

      showPaymentNotificationModal(
        "warning",
        notificationTitle,
        notificationMessage,
        notificationDetails
      );
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (isRedeeming || !selectedRedemptionType || !pointsToRedeem) return;
    setIsRedeeming(true);

    const userId = Cookies.get('userId');
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/${userId}/redeem-points`,
        {
          type: selectedRedemptionType,
          pointsToRedeem: parseInt(pointsToRedeem)
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );

      if (response.data.success) {
        // Cập nhật số điểm của user
        setUser(prevUser => ({
          ...prevUser,
          points: response.data.remainingPoints,
          balance: selectedRedemptionType === 'XU' 
            ? prevUser.balance + response.data.xuAmount 
            : prevUser.balance
        }));

        // Hiển thị thông báo thành công
        setRedemptionNotification({
          type: "success",
          title: "Quy đổi thành công!",
          message: response.data.message,
          details: selectedRedemptionType === 'DISCOUNT_CODE' 
            ? [
                `Mã giảm giá: ${response.data.code}`,
                `Giảm giá: ${response.data.discountPercentage}%`,
                `Điểm còn lại: ${response.data.remainingPoints}`
              ]
            : [
                `Số xu nhận được: ${response.data.xuAmount}`,
                `Điểm còn lại: ${response.data.remainingPoints}`
              ]
        });
      } else {
        setRedemptionNotification({
          type: "warning",
          title: "Quy đổi không thành công",
          message: response.data.message,
          details: []
        });
      }
    } catch (error) {
      setRedemptionNotification({
        type: "warning",
        title: "Lỗi quy đổi",
        message: error.response?.data?.message || "Có lỗi xảy ra khi quy đổi điểm",
        details: []
      });
    } finally {
      setIsRedeeming(false);
      setShowRedemptionNotification(true);
      setSelectedRedemptionType(null);
      setPointsToRedeem('');
    }
  };

  // Thêm component PaymentNotificationModal
  const PaymentNotificationModal = ({ isOpen, onClose, notification }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
           onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full transform transition-all"
             onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${
              notification.type === "success" 
                ? "text-green-600 dark:text-green-400" 
                : "text-yellow-600 dark:text-yellow-400"
            }`}>
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {notification.message}
            </p>
            {notification.details.map((detail, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-400">
                {detail}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                notification.type === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Thêm component RedemptionNotificationModal
  const RedemptionNotificationModal = ({ isOpen, onClose, notification }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
           onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full transform transition-all"
             onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${
              notification.type === "success" 
                ? "text-green-600 dark:text-green-400" 
                : "text-yellow-600 dark:text-yellow-400"
            }`}>
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {notification.message}
            </p>
            {notification.details.map((detail, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-400">
                {detail}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                notification.type === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return <div className="text-center mt-10">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={generateAvatar(user.full_name || user.name)}
            alt="Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-500 dark:border-indigo-400 shadow-lg mb-4 sm:mb-0 sm:mr-6"
          />
          <div className="text-center sm:text-left">
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={user.full_name || ""}
                onChange={handleChange}
                className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {user.full_name || "Chưa cập nhật"}
              </h2>
            )}
            <p className="text-gray-500 dark:text-gray-400">{user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Email</p>
            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200">{user.mail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Số điện thoại</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200">{user.phone}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Địa chỉ</p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={user.address || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200">{user.address || "Chưa cập nhật"}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cấp độ thành viên</p>
            <p className="text-base sm:text-lg text-yellow-600 dark:text-yellow-400 font-semibold">
              {user.membershipLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Điểm tích lũy</p>
            <p className="text-base sm:text-lg text-indigo-700 dark:text-indigo-400 font-bold">{user.points}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Số dư tài khoản</p>
            <p className="text-base sm:text-lg text-green-600 dark:text-green-400 font-bold">
              {user.balance.toLocaleString()} Xu
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center sm:text-right flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base"
            >
              Lưu
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowRechargeOptions(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowRechargeOptions(!showRechargeOptions);
                  setActiveTab('recharge');
                }}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Nạp Xu & Quy đổi
              </button>
            </>
          )}
        </div>

        {/* Tabs for Recharge and Redemption */}
        {showRechargeOptions && (
          <div className="mt-4 sm:mt-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                className={`px-4 py-2 font-medium text-sm sm:text-base ${
                  activeTab === 'recharge'
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('recharge')}
              >
                Nạp Xu
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm sm:text-base ${
                  activeTab === 'redeem'
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('redeem')}
              >
                Quy đổi điểm
              </button>
            </div>

            {activeTab === 'recharge' ? (
              // Existing recharge section
              <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Nạp Xu</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {rechargeOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleRechargeOption(option)}
                  className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center transition-colors ${
                    selectedRecharge === option
                      ? "bg-blue-500 dark:bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <p className="text-lg font-bold">{option.amount.toLocaleString()} VND</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nhận {option.coins} Xu và Voucher {option.voucher}</p>
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
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                onClick={handleCustomRecharge}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Xác Nhận
              </button>
            </div>
            {/* Hướng dẫn chuyển khoản */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                Hướng dẫn chuyển khoản
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>Vui lòng chuyển khoản đúng số tiền được hiển thị</li>
                <li>
                  Ghi nội dung chuyển khoản theo cú pháp:{" "}
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    [Họ và tên] + Số điện thoại đã đăng ký
                  </span>
                </li>
                <li>
                  Ví dụ:{" "}
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    NguyenVanA 0987654321
                  </span>
                </li>
                <li>
                  Chuyển khoản với các nội dung trên xong, nhấn nút "Kiểm tra giao dịch" để kiểm tra thanh toán
                </li>
                <li>Thời gian xử lý: 30s -1 phút sau khi chuyển khoản</li>
              </ul>
            </div>
            {selectedRecharge && (
              <div className="mt-4 text-center">
                <img
                  src={qrImage}
                  alt="QR Code for Recharge"
                  className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-md mx-auto mb-4 bg-white p-2"
                />
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  Giá: {selectedRecharge.amount.toLocaleString()} VND
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bạn sẽ nhận được {selectedRecharge.coins} Xu
                </p>
                <button
                      onClick={handleCheckPayment}
                      disabled={isCheckingPayment}
                      className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-colors ${
                        isCheckingPayment
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      } text-white`}
                    >
                      {isCheckingPayment ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang kiểm tra...
                        </span>
                      ) : (
                        "Kiểm tra giao dịch"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // New redemption section
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Quy đổi điểm</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Discount Code Redemption */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4">
                      Quy đổi mã giảm giá
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { points: 20, discount: 10 },
                          { points: 35, discount: 20 },
                          { points: 50, discount: 30 },
                          { points: 65, discount: 40 },
                          { points: 80, discount: 50 }
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedRedemptionType('DISCOUNT_CODE');
                              setPointsToRedeem(option.points.toString());
                            }}
                            className={`p-3 rounded-lg border transition-all ${
                              selectedRedemptionType === 'DISCOUNT_CODE' && 
                              pointsToRedeem === option.points.toString()
                                ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                            }`}
                          >
                            <div className="text-center">
                              <p className="font-bold text-purple-700 dark:text-purple-400">
                                {option.discount}%
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {option.points} điểm
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <img
                          src={discountCodeImage}
                          alt="Mẫu phiếu giảm giá"
                          className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                        />  
                      </div>
                    </div>
                  </div>

                  {/* Xu Redemption */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
                      Quy đổi xu
                    </h4>
                    <div className="space-y-4">
                      {[
                        { points: 10, xu: 10, vnd: "10.000" },
                        { points: 50, xu: 50, vnd: "50.000" },
                        { points: 100, xu: 100, vnd: "100.000" }
                      ].map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedRedemptionType('XU');
                            setPointsToRedeem(option.points.toString());
                          }}
                          className={`w-full p-4 rounded-lg border transition-all ${
                            selectedRedemptionType === 'XU' && 
                            pointsToRedeem === option.points.toString()
                              ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-green-700 dark:text-green-400">
                                {option.xu} Xu
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {option.vnd} VND
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {option.points} điểm
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Redemption Action Button */}
                {selectedRedemptionType && pointsToRedeem && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleRedeemPoints}
                      disabled={isRedeeming}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isRedeeming
                          ? 'bg-gray-400 cursor-not-allowed'
                          : selectedRedemptionType === 'DISCOUNT_CODE'
                            ? 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
                            : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                      } text-white`}
                    >
                      {isRedeeming ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </span>
                      ) : (
                        `Quy đổi ${pointsToRedeem} điểm`
                      )}
                </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payment Notification Modal */}
        <PaymentNotificationModal
          isOpen={showPaymentNotification}
          onClose={() => setShowPaymentNotification(false)}
          notification={paymentNotification}
        />

        {/* Redemption Notification Modal */}
        <RedemptionNotificationModal
          isOpen={showRedemptionNotification}
          onClose={() => setShowRedemptionNotification(false)}
          notification={redemptionNotification}
        />
      </div>
    </div>
  );
};

export default UserDetail;