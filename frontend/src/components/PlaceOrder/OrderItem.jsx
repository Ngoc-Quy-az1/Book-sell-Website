import React, { useState, useEffect } from "react";
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
  const auth = { Authorization: `Bearer ${Cookies.get("Cookies.get('authToken')")}` };
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

  return (
    <div
      className={`flex flex-col w-full bg-white rounded-lg shadow-md p-6 mb-6 transition-all ${
        isSelected ? "border-4 border-blue-500" : "border border-gray-300"
      }`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleClick}
      >
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Order #{orderId}
          </h3>
          <p className="text-lg text-gray-600">
            {Moment(orderCreateAt).format("MMMM Do YYYY")}
          </p>
        </div>
        <span
          className={`text-lg font-semibold ${
            status === "Pending" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Book List */}
      {!isCollapsed && (
        <div className="mt-6">
          <div className="grid grid-cols-4 text-lg font-bold text-gray-600 border-b pb-4">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>
          {bookList.map((item) => (
            <div
              key={item.bookName}
              className="grid grid-cols-4 text-lg text-gray-800 py-4 border-b"
            >
              <span>{item.bookName}</span>
              <span className="text-center">
                ₫{item.price.toLocaleString()}
              </span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-right">
                ₫{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}