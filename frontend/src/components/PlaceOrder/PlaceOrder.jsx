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
        // Sort orders: Pending first, then Completed, and within each group sort by creation date (newest first)
        const sortedOrders = response.data.sort((a, b) => {
          if (a.status === "Pending" && b.status !== "Pending") return -1;
          if (a.status !== "Pending" && b.status === "Pending") return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrderList(sortedOrders);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const showSection = (section) => {
    setActiveSection(section);
  };

  const checkPayment = async (method) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const auth = { Authorization: `Bearer ${Cookies.get('authToken')}` };
    try {
      const response = await axios.get(
        `${apiUrl}/api/payment/check-status/${orderList[selectedOrder].orderId}`,
        { headers: auth }
      );
      if (response.data.status === "Completed") {
        setPaymentResult((prev) => ({
          ...prev,
          [method]: "✅ Payment successful! Thank you.",
        }));
        const updatedOrderList = orderList.map((order, index) =>
          index === selectedOrder ? { ...order, status: "Completed" } : order
        );
        setOrderList(updatedOrderList);
      } else {
        setPaymentResult((prev) => ({
          ...prev,
          [method]: "⚠️ Order not yet paid.",
        }));
      }
    } catch (error) {
      setPaymentResult((prev) => ({
        ...prev,
        [method]: "⚠️ Unable to check payment status.",
      }));
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
        const updatedOrderList = orderList.map((order, index) =>
          index === selectedOrder ? { ...order, status: "Completed" } : order
        );
        setOrderList(updatedOrderList);
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
                    <img
                      src={qrImage}
                      alt="QR Code"
                      className="w-32 h-32 lg:w-48 lg:h-48 object-cover rounded-lg shadow-md mx-auto mb-4 lg:mb-6"
                    />
                    <div className="text-base lg:text-xl font-semibold text-red-600 dark:text-red-400 mb-4 lg:mb-6">
                      Price: ₫{orderList[selectedOrder].totalAmount.toLocaleString()}
                    </div>
                    <button
                      onClick={() => checkPayment("qr")}
                      className="w-full sm:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-purple-500 dark:bg-purple-700 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-purple-600 dark:hover:bg-purple-800 transition"
                    >
                      Check Payment
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
    </div>
  );
}
