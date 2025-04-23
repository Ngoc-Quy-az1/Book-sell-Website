import React, { useState } from "react";
import qrImage from "../../assets/qr_checkout.png";

const Checkout = () => {
  const [activeSection, setActiveSection] = useState(null); // Quản lý phần hiển thị (QR hoặc Coin)
  const [paymentResult, setPaymentResult] = useState({ qr: "", coin: "" }); // Kết quả thanh toán

  // Hiển thị phần tương ứng
  const showSection = (section) => {
    setActiveSection(section);
  };

  // Kiểm tra thanh toán
  const checkPayment = (method) => {
    const paid = window.confirm("Bạn đã hoàn tất thanh toán chưa?");
    if (paid) {
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
        {activeSection === "qr" && (
          <div className="animate-fade-in">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-60 h-60 object-cover rounded-lg shadow-md mx-auto mb-4"
            />
            <div className="text-lg font-semibold text-red-600 mb-4">
              Giá: 200.000đ
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
        {activeSection === "coin" && (
          <div className="animate-fade-in">
            <div className="text-lg font-semibold text-red-600 mb-4">
              Giá: 500 Xu
            </div>
            <button
              onClick={() => checkPayment("coin")}
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