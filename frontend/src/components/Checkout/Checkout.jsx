import React, { useState, useEffect } from "react";
import qrImage from "../../assets/qr_checkout.png";
import axios from "axios";
import Cookies from "js.cookie"; // Import Cookies để lấy token

const Checkout = () => {
  const [activeSection, setActiveSection] = useState(null); // Quản lý phần hiển thị (QR hoặc Coin)
  const [paymentResult, setPaymentResult] = useState({ qr: "", coin: "" }); // Kết quả thanh toán
  const [order, setOrder] = useState(null); // Lưu thông tin đơn hàng
  const [orderId, setOrderId] = useState(1); // Lưu orderId, mặc định là 1 để test
  const apiUrl = import.meta.env.VITE_API_URL; // Lấy URL API từ biến môi trường
  const userId = Cookies.get("userId"); // Lấy userId từ cookie

  // Hiển thị phần tương ứng
  const showSection = (section) => {
    setActiveSection(section);
  };

  // Lấy thông tin đơn hàng từ API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/payment/pending-orders`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("Cookies.get('authToken')")}`,
            },
          }
        );
        console.log("Pending Orders:", response.data);

        // Lấy đơn hàng có orderId = orderId (mặc định là 1)
        const selectedOrder = response.data.find((order) => order.orderId === orderId);
        if (selectedOrder) {
          setOrder(selectedOrder);
        } else {
          console.error(`Không tìm thấy đơn hàng với orderId = ${orderId}`);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      }
    };

    fetchOrder();
  }, [orderId]); // Thêm orderId vào dependency để cập nhật khi thay đổi

  // Kiểm tra trạng thái thanh toán
  const checkPayment = async (method) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/payment/check-status/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Cookies.get('authToken')")}`,
          },
        }
      );
      console.log("Payment Status:", response.data);

      if (response.data.status === "Completed") {
        setPaymentResult((prev) => ({
          ...prev,
          [method]: "✅ Thanh toán thành công! Cảm ơn bạn.",
        }));
      } else {
        setPaymentResult((prev) => ({
          ...prev,
          [method]: "⚠️ Đơn hàng chưa được thanh toán.",
        }));
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      setPaymentResult((prev) => ({
        ...prev,
        [method]: "⚠️ Không thể kiểm tra trạng thái thanh toán.",
      }));
    }
  };

  // Thanh toán bằng xu
  const payWithBalance = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/payment/pay-with-balance`,
        {
          orderIds: [orderId], // Lấy từ biến orderId
          userId: userId, // Lấy từ cookie
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Cookies.get('authToken')")}`,
          },
        }
      );
      console.log("Payment Response:", response.data);
  
      if (response.data.success) {
        // Hiển thị thông báo thành công và số dư còn lại
        alert(`✅ ${response.data.message}\nSố dư còn lại: ${response.data.remainingBalance.toLocaleString("vi-VN")} xu`);
        setPaymentResult((prev) => ({
          ...prev,
          coin: `✅ ${response.data.message}`,
        }));
      } else {
        // Hiển thị thông báo thất bại
        alert(`⚠️ ${response.data.message}`);
        setPaymentResult((prev) => ({
          ...prev,
          coin: `⚠️ ${response.data.message}`,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán bằng xu:", error);
      alert("⚠️ Không thể thực hiện thanh toán bằng xu.");
      setPaymentResult((prev) => ({
        ...prev,
        coin: "⚠️ Không thể thực hiện thanh toán.",
      }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[480px] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Chọn phương thức thanh toán
        </h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => showSection("qr")}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            💳 QR Code
          </button>
          <button
            onClick={() => showSection("coin")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            🪙 Dùng Xu
          </button>
        </div>

        {/* QR Code Section */}
        {activeSection === "qr" && order && (
          <div className="animate-fade-in">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-60 h-60 object-cover rounded-lg shadow-md mx-auto mb-4"
            />
            <div className="text-lg font-semibold text-red-600 mb-4">
              Giá: {parseFloat(order.amount).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </div>
            <button
              onClick={() => checkPayment("qr")}
              className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
            >
              Kiểm tra thanh toán
            </button>
            <div
              className={`mt-4 text-sm font-medium ${
                paymentResult.qr.includes("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {paymentResult.qr}
            </div>
          </div>
        )}

        {/* Coin Section */}
        {activeSection === "coin" && order && (
          <div className="animate-fade-in">
            <div className="text-lg font-semibold text-red-600 mb-4">
              Giá: {Math.round(parseFloat(order.amount) / 1000)} Xu
            </div>
            <button
              onClick={payWithBalance}
              className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
            >
              Thanh toán
            </button>
            <div
              className={`mt-4 text-sm font-medium ${
                paymentResult.coin.includes("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {paymentResult.coin}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;