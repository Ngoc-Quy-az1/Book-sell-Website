import React, { useState } from "react";
import axios from "axios";
import Cookies from "js.cookie";
import Moment from "moment";

export default function OrderItem({
  isSelected,
  orderId,
  orderCreateAt,
  onClickFunc,
  status,
}) {
  const auth = { Authorization: `Bearer ${Cookies.get('authToken')}` };
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [bookList, setBooklist] = useState([]);

  const handleClick = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (isCollapsed) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/order/orderDetails?orderID=${orderId}`,
          { headers: auth }
        );
        setBooklist(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsCollapsed(!isCollapsed);
    onClickFunc();
  };

  const totalAmount = bookList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const statusIcon =
    status === "Pending" ? (
      <svg className="inline w-5 h-5 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/>
      </svg>
    ) : (
      <svg className="inline w-5 h-5 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
      </svg>
    );

  return (
    <div
      className={`flex flex-col w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300
        ${isSelected ? "border-4 border-blue-500 scale-105 dark:border-blue-400" : "border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-102"}
        cursor-pointer`}
      style={{ boxShadow: isSelected ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)" : undefined }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        onClick={handleClick}
      >
        <div>
          <h3 className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 tracking-wide flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-lg text-base font-semibold mr-2">#{orderId}</span>
            <span>Order</span>
          </h3>
          <p className="text-md text-gray-500 dark:text-gray-300 mt-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400 dark:text-blue-300 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6m-7 4h8M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {Moment(orderCreateAt).format("MMMM Do YYYY")}
          </p>
        </div>
        <span
          className={`text-lg font-semibold flex items-center px-4 py-2 rounded-xl shadow-sm
            ${status === "Pending"
              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"}`}
        >
          {statusIcon}
          {status}
        </span>
      </div>

      {/* Book List */}
      {!isCollapsed && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-inner p-6 transition-all duration-300">
          {/* Bọc bảng trong div cho phép cuộn ngang */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-4 text-base font-bold text-blue-700 dark:text-blue-200 border-b border-blue-100 dark:border-gray-700 pb-4 mb-2">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {bookList.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-8">No items found.</div>
                ) : (
                  bookList.map((item) => (
                    <div
                      key={item.bookName}
                      className="grid grid-cols-4 text-base text-gray-800 dark:text-gray-200 py-3 border-b border-blue-100 dark:border-gray-700 last:border-b-0 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <span className="truncate">{item.bookName}</span>
                      <span className="text-center text-blue-600 dark:text-blue-300 font-semibold">
                        ₫{item.price.toLocaleString()}
                      </span>
                      <span className="text-center">{item.quantity}</span>
                      <span className="text-right text-blue-700 dark:text-blue-200 font-bold">
                        ₫{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Tổng tiền */}
        </div>
      )}
    </div>
  );
}