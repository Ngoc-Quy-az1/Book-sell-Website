import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';
import OrderItem from "./OrderItem";
import Moment from 'moment';
import qrImage from "../../assets/qr_checkout.png";
import "../../CheckToken";

export default function PlaceOrder() {
  const userId = Cookies.get('userId');
  const [selectedOrder, setSelectedOrder] = useState(-1);
  const [orderList, setOrderList] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [paymentResult, setPaymentResult] = useState({ qr: "", coin: "" });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
  const [paymentNotification, setPaymentNotification] = useState({
    type: "", // "success" or "warning"
    title: "",
    message: "",
    details: []
  });

  useEffect(() => {
    Moment.locale('en');
    getOrderList(userId);
  }, []);

  const getOrderList = async (userID) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    await axios.get(`${apiUrl}/api/order/${userID}`, {
      headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
    })
      .then((response) => {
        // Sort orders: Pending first (newest to oldest), then Completed (newest to oldest)
        const sortedOrders = response.data.sort((a, b) => {
          // Nếu cả hai đơn hàng cùng trạng thái, sắp xếp theo thời gian tạo mới nhất
          if (a.status === b.status) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // Đơn hàng Pending luôn hiển thị trước
          return a.status === "Pending" ? -1 : 1;
        });
        setOrderList(sortedOrders);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // Hàm helper để sắp xếp lại danh sách đơn hàng
  const sortOrderList = (orders) => {
    return [...orders].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.status === "Pending" ? -1 : 1;
    });
  };

  const showSection = (section) => {
    setActiveSection(section);
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

  const checkPayment = async (method) => {
    if (isCheckingPayment) return;
    setIsCheckingPayment(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const auth = { Authorization: `Bearer ${Cookies.get('authToken')}` };
    try {
      if (method === "qr") {
        const response = await axios.post(
          `${apiUrl}/api/payment/check-transfer`,
          {
            orderIds: [orderList[selectedOrder].orderId],
            userId: userId
          },
          { headers: auth }
        );
        
        if (response.data.success) {
          let message = "";
          if (response.data.paymentStatus === "exact") {
            message = "✅ Thanh toán thành công! Cảm ơn bạn đã mua hàng.";
            showPaymentNotificationModal(
              "success",
              "Thanh toán thành công!",
              "Cảm ơn bạn đã mua hàng.",
              []
            );
          } else if (response.data.paymentStatus === "excess") {
            const excessAmount = response.data.excessAmount;
            const excessCoins = response.data.excessCoins;
            message = `✅ Thanh toán thành công! 
                      Số tiền thừa: ₫${excessAmount.toLocaleString()} 
                      đã được chuyển thành ${excessCoins} xu và cộng vào tài khoản của bạn.`;
            showPaymentNotificationModal(
              "success",
              "Thanh toán thành công!",
              "Đơn hàng của bạn đã được thanh toán thành công.",
              [
                `Số tiền thừa: ₫${excessAmount.toLocaleString()}`,
                `Đã được chuyển thành ${excessCoins} xu`,
                "và cộng vào tài khoản của bạn."
              ]
            );
          } else if (response.data.paymentStatus === "partial") {
            message = `⚠️ Đã nhận được thanh toán một phần: ₫${response.data.paidAmount.toLocaleString()}. Vui lòng thanh toán thêm: ₫${response.data.remainingAmount.toLocaleString()}`;
            showPaymentNotificationModal(
              "warning",
              "Thanh toán một phần",
              "Đã nhận được thanh toán một phần cho đơn hàng của bạn.",
              [
                `Số tiền đã thanh toán: ₫${response.data.paidAmount.toLocaleString()}`,
                `Số tiền còn thiếu: ₫${response.data.remainingAmount.toLocaleString()}`,
                "Vui lòng thanh toán thêm số tiền còn thiếu để hoàn tất đơn hàng."
              ]
            );
          }
          
          setPaymentResult((prev) => ({
            ...prev,
            qr: message,
          }));

          // Chỉ cập nhật trạng thái đơn hàng nếu thanh toán đủ hoặc thừa
          if (response.data.paymentStatus === "exact" || response.data.paymentStatus === "excess") {
            const updatedOrderList = orderList.map((order, index) =>
              index === selectedOrder ? { ...order, status: "Completed" } : order
            );
            setOrderList(sortOrderList(updatedOrderList));
            setSelectedOrder(-1);
          }
        } else {
          setPaymentResult((prev) => ({
            ...prev,
            qr: `⚠️ ${response.data.message}`,
          }));
          showPaymentNotificationModal(
            "warning",
            "Thanh toán không thành công",
            response.data.message,
            []
          );
        }
      } else {
        const response = await axios.get(
          `${apiUrl}/api/payment/check-status/${orderList[selectedOrder].orderId}`,
          { headers: auth }
        );
        if (response.data.status === "Completed") {
          setPaymentResult((prev) => ({
            ...prev,
            [method]: "✅ Payment successful! Thank you.",
          }));
          // Cập nhật trạng thái và sắp xếp lại danh sách
          const updatedOrderList = orderList.map((order, index) =>
            index === selectedOrder ? { ...order, status: "Completed" } : order
          );
          setOrderList(sortOrderList(updatedOrderList));
          // Reset selected order vì đơn hàng đã chuyển xuống dưới
          setSelectedOrder(-1);
        } else {
          setPaymentResult((prev) => ({
            ...prev,
            [method]: "⚠️ Order not yet paid.",
          }));
        }
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        let notificationTitle = "Lỗi thanh toán";
        let notificationMessage = "";
        let notificationDetails = [];

        if (errorMessage.includes("không ở trạng thái chờ thanh toán")) {
          notificationMessage = "Đơn hàng này đã được thanh toán hoặc đã hoàn thành.";
          notificationDetails = ["Vui lòng kiểm tra lại trạng thái đơn hàng."];
        } else if (errorMessage.includes("Vui lòng nhập số điện thoại")) {
          notificationMessage = "Vui lòng nhập số điện thoại khi chuyển khoản.";
          notificationDetails = ["Điều này giúp chúng tôi xác nhận thanh toán của bạn."];
        } else if (errorMessage.includes("Vui lòng chuyển khoản")) {
          notificationMessage = "Vui lòng thực hiện chuyển khoản trước khi kiểm tra.";
        } else {
          notificationMessage = errorMessage;
        }

        setPaymentResult((prev) => ({
          ...prev,
          qr: `⚠️ ${notificationMessage}`,
        }));

        showPaymentNotificationModal(
          "warning",
          notificationTitle,
          notificationMessage,
          notificationDetails
        );
      } else {
        setPaymentResult((prev) => ({
          ...prev,
          [method]: "⚠️ Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.",
        }));
        showPaymentNotificationModal(
          "warning",
          "Lỗi hệ thống",
          "Không thể kiểm tra trạng thái thanh toán.",
          ["Vui lòng thử lại sau."]
        );
      }
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const payWithBalance = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const auth = { Authorization: `Bearer ${Cookies.get('authToken')}` };
    try {
      const response = await axios.post(
        `${apiUrl}/api/payment/pay-with-balance`,
        {
          orderIds: [orderList[selectedOrder].orderId],
          userId: userId,
        },
        { headers: auth }
      );
      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        setPaymentResult((prev) => ({
          ...prev,
          coin: `✅ ${response.data.message}`,
        }));
        // Cập nhật trạng thái và sắp xếp lại danh sách
        const updatedOrderList = orderList.map((order, index) =>
          index === selectedOrder ? { ...order, status: "Completed" } : order
        );
        setOrderList(sortOrderList(updatedOrderList));
        // Reset selected order vì đơn hàng đã chuyển xuống dưới
        setSelectedOrder(-1);
      } else {
        alert(`⚠️ ${response.data.message}`);
        setPaymentResult((prev) => ({
          ...prev,
          coin: `⚠️ ${response.data.message}`,
        }));
      }
    } catch (error) {
      alert("⚠️ Unable to process payment.");
      setPaymentResult((prev) => ({
        ...prev,
        coin: "⚠️ Unable to process payment.",
      }));
    }
  };

  // Thêm component Modal
  const QRModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
           onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full"
             onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              QR Code Payment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-64 h-64 lg:w-96 lg:h-96 object-contain rounded-lg shadow-lg"
            />
            <div className="mt-4 text-lg font-semibold text-red-600 dark:text-red-400">
              Price: ₫{selectedOrder !== -1 ? orderList[selectedOrder].totalAmount.toLocaleString() : '0'}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
              Click outside to close
            </p>
          </div>
        </div>
      </div>
    );
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
            {notification.message && (
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {notification.message}
              </p>
            )}
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

  // Responsive: show list above, details below on mobile; side by side on desktop
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-4 lg:gap-8 px-2 sm:px-4 lg:px-16 py-4 lg:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Order List Section */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:p-8 h-[400px] sm:h-[500px] lg:h-[calc(100vh-4rem)] flex flex-col mb-4 lg:mb-0">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6">Your Orders</h2>
        <div className="flex-1 overflow-y-auto pr-2">
          {(orderList.length === 0)
            ? <div className="text-center text-lg lg:text-xl font-semibold text-gray-600 dark:text-gray-300">You don't have any orders.</div>
            : orderList.map((order, index) => (
              <OrderItem
                key={order.orderId}
                status={order.status}
                isSelected={selectedOrder === index}
                orderId={order.orderId}
                orderCreateAt={order.createdAt}
                onClickFunc={() => {
                  setPaymentResult({ qr: "", coin: "" });
                  if (selectedOrder !== index) {
                    setSelectedOrder(index);
                  } else {
                    setSelectedOrder(-1);
                  }
                }}
              />
            ))
          }
        </div>
      </div>

      {/* Order Details Section */}
      <div
        className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:p-8
          h-auto lg:h-[calc(100vh-4rem)] flex flex-col
          sm:h-[520px]
          overflow-y-visible
          sm:overflow-y-visible
          lg:overflow-y-auto"
        style={{
          // Chỉ hiện thanh cuộn ở mobile (dưới 640px)
          maxHeight: 'none',
          ...(window.innerWidth < 640
            ? { maxHeight: '420px', overflowY: 'auto' }
            : {}),
        }}
      >
        {(selectedOrder === -1)
          ? <div className="text-center text-lg lg:text-xl font-semibold text-gray-600 dark:text-gray-300 h-full flex items-center justify-center">Select an order to view details.</div>
          : <div className="h-full flex flex-col">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Order #{orderList[selectedOrder].orderId}
              </h3>
              <span className={`text-base lg:text-lg font-semibold ${orderList[selectedOrder].status === 'Pending' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {orderList[selectedOrder].status}
              </span>
            </div>
            <div className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 lg:mb-6">
              Created on: {Moment(orderList[selectedOrder].createdAt).format("MMMM Do YYYY")}
            </div>
            <div className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-4 lg:pt-6">
              Total: <span className="text-red-500 dark:text-red-400">₫{orderList[selectedOrder].totalAmount.toLocaleString()}</span>
            </div>

            {/* Payment Section - Only show for Pending orders */}
            {orderList[selectedOrder].status === "Pending" && (
              <div className="mt-6 lg:mt-8 flex-1 overflow-y-auto">
                <h4 className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6">Choose Payment Method</h4>
                <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <button
                    onClick={() => showSection("qr")}
                    className="w-full sm:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-green-500 dark:bg-green-700 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 dark:hover:bg-green-800 transition"
                  >
                    💳 QR Code
                  </button>
                  <button
                    onClick={() => showSection("coin")}
                    className="w-full sm:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-blue-500 dark:bg-blue-700 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 transition"
                  >
                    🪙 Use Coins
                  </button>
                </div>

                {/* QR Code Section */}
                {activeSection === "qr" && (
                  <div className="animate-fade-in text-center pb-8 sm:pb-0">
                    <div 
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowQRModal(true)}
                    >
                      <img
                        src={qrImage}
                        alt="QR Code"
                        className="w-32 h-32 lg:w-48 lg:h-48 object-cover rounded-lg shadow-md mx-auto mb-4 lg:mb-6"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Click to enlarge QR code
                      </p>
                    </div>
                    <div className="text-base lg:text-xl font-semibold text-red-600 dark:text-red-400 mb-4 lg:mb-6">
                      Price: ₫{orderList[selectedOrder].totalAmount.toLocaleString()}
                    </div>
                    <button
                      onClick={() => checkPayment("qr")}
                      disabled={isCheckingPayment}
                      className={`w-full sm:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-purple-500 dark:bg-purple-700 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md transition relative
                        ${isCheckingPayment ? 'opacity-75 cursor-not-allowed' : 'hover:bg-purple-600 dark:hover:bg-purple-800'}`}
                    >
                      {isCheckingPayment ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⟳</span>
                          Checking...
                        </>
                      ) : (
                        'Check Payment'
                      )}
                    </button>
                    <div className={`mt-4 lg:mt-6 text-base lg:text-lg font-medium ${paymentResult.qr.includes("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {paymentResult.qr}
                    </div>
                  </div>
                )}

                {/* Coin Section */}
                {activeSection === "coin" && (
                  <div className="animate-fade-in text-center">
                    <div className="text-base lg:text-xl font-semibold text-red-600 dark:text-red-400 mb-4 lg:mb-6">
                      Price: {Math.round(orderList[selectedOrder].totalAmount / 1000)} Coins
                    </div>
                    <button
                      onClick={payWithBalance}
                      className="w-full sm:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-purple-500 dark:bg-purple-700 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-purple-600 dark:hover:bg-purple-800 transition"
                    >
                      Pay with Coins
                    </button>
                    <div className={`mt-4 lg:mt-6 text-base lg:text-lg font-medium ${paymentResult.coin.includes("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {paymentResult.coin}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      </div>

      {/* Add Modal Component */}
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />

      {/* Add PaymentNotificationModal */}
      <PaymentNotificationModal
        isOpen={showPaymentNotification}
        onClose={() => setShowPaymentNotification(false)}
        notification={paymentNotification}
      />
    </div>
  );
}
