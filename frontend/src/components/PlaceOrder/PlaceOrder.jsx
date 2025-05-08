import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';
import OrderItem from "./OrderItem";
import { selectClasses } from "@mui/material";
import Moment from 'moment';
import qrImage from "../../assets/qr_checkout.png"; // Import QR image

export default function PlaceOrder() {
  const userId = Cookies.get('userId');
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [selectedOrder, setSelectedOrder] = useState(-1);
  const [orderList, setOrderList] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // Manage payment section visibility
  const [paymentResult, setPaymentResult] = useState({ qr: "", coin: "" }); // Payment result
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // Selected order details

  useEffect( () => {
    Moment.locale('en');
    getOrderList(userId);
  }, []);

  const getOrderList = async (userID)=>{
    const apiUrl = import.meta.env.VITE_API_URL;
    await axios.get(`${apiUrl}/api/order/${userID}`,{
      headers:auth,
    })
    .then((response) => {
        setOrderList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  const showSection = (section) => {
    setActiveSection(section);
  };

  const checkPayment = async (method) => {
    const apiUrl = import.meta.env.VITE_API_URL;
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
        // Update order status to "Completed"
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
        // Update order status to "Completed"
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

  //const total = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = 3;
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-4 lg:gap-8 px-4 lg:px-16 py-4 lg:py-8 bg-gray-100 min-h-screen">
      {/* Order List Section */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-4 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Your Orders</h2>
        {(orderList.length === 0)
          ? <div className="text-center text-lg lg:text-xl font-semibold text-gray-600">You don't have any orders.</div>
          : orderList.map((order, index) => (
              <OrderItem
                key={order.orderId}
                status={order.status}
                isSelected={selectedOrder === index}
                orderId={order.orderId}
                orderCreateAt={order.createdAt}
                onClickFunc={() => {
                  // Reset paymentResult when switching orders
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

      {/* Order Details Section */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4 lg:p-8 relative">
        {(selectedOrder === -1)
          ? <div className="text-center text-lg lg:text-xl font-semibold text-gray-600">Select an order to view details.</div>
          : <div>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-800">
                  Order #{orderList[selectedOrder].orderId}
                </h3>
                <span className={`text-base lg:text-lg font-semibold ${orderList[selectedOrder].status === 'Pending' ? 'text-red-500' : 'text-green-500'}`}>
                  {orderList[selectedOrder].status}
                </span>
              </div>
              <div className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">
                Created on: {Moment(orderList[selectedOrder].createdAt).format("MMMM Do YYYY")}
              </div>
              <div className="text-lg lg:text-2xl font-bold text-gray-800 border-t pt-4 lg:pt-6">
                Total: <span className="text-red-500">₫{orderList[selectedOrder].totalAmount.toLocaleString()}</span>
              </div>

              {/* Payment Section */}
              <div className="mt-6 lg:mt-8">
                <h4 className="text-lg lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Choose Payment Method</h4>
                <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <button
                    onClick={() => showSection("qr")}
                    className="w-full lg:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-green-500 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                  >
                    💳 QR Code
                  </button>
                  <button
                    onClick={() => showSection("coin")}
                    className="w-full lg:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-blue-500 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                  >
                    🪙 Use Coins
                  </button>
                </div>

                {/* QR Code Section */}
                {activeSection === "qr" && (
                  <div className="animate-fade-in text-center">
                    <img
                      src={qrImage}
                      alt="QR Code"
                      className="w-32 h-32 lg:w-48 lg:h-48 object-cover rounded-lg shadow-md mx-auto mb-4 lg:mb-6"
                    />
                    <div className="text-base lg:text-xl font-semibold text-red-600 mb-4 lg:mb-6">
                      Price: ₫{orderList[selectedOrder].totalAmount.toLocaleString()}
                    </div>
                    <button
                      onClick={() => checkPayment("qr")}
                      className="w-full lg:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-purple-500 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
                    >
                      Check Payment
                    </button>
                    <div className={`mt-4 lg:mt-6 text-base lg:text-lg font-medium ${paymentResult.qr.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                      {paymentResult.qr}
                    </div>
                  </div>
                )}

                {/* Coin Section */}
                {activeSection === "coin" && (
                  <div className="animate-fade-in text-center">
                    <div className="text-base lg:text-xl font-semibold text-red-600 mb-4 lg:mb-6">
                      Price: {Math.round(orderList[selectedOrder].totalAmount / 1000)} Coins
                    </div>
                    <button
                      onClick={payWithBalance}
                      className="w-full lg:w-auto px-4 lg:px-8 py-3 lg:py-4 bg-purple-500 text-white text-base lg:text-lg font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
                    >
                      Pay with Coins
                    </button>
                    <div className={`mt-4 lg:mt-6 text-base lg:text-lg font-medium ${paymentResult.coin.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                      {paymentResult.coin}
                    </div>
                  </div>
                )}
              </div>
            </div>
        }
      </div>
    </div>
  );
}
