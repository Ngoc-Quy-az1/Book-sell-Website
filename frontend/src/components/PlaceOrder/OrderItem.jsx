import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';
import Moment from 'moment';

export default function OrderItem({
  isSelected: isSelected,
  orderId: orderId, 
  orderCreateAt: orderCreateAt,
  onClickFunc: onClickFunc,
  status: status,})
{
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [bookList, setBooklist] = useState([]);
  const handleClick = async (isShow)=> {
    Moment.locale('en');
    console.log(isShow);
    if (isCollapsed){
      await axios.get(`http://localhost:8090/api/order/orderDetails?orderID=${orderId}`,{
        headers:auth,
      })
      .then((response) => {
          setBooklist(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }
  return(
    <div className={
      `flex flex-col max-w-4xl ml-60 mr-40 p-6 
      ${isSelected? 'bg-blue-300' : 'bg-slate-300'} 
      pl-6 shadow-md rounded-xl mt-10
      ${isCollapsed ? 'h-16 overflow-hidden' :'h-auto'}`
    }>
      {/* Header */}
      <div 
      className="flex flex-row justify-between border-b"
      key={orderId} onClick={async ()=>{
        if (isCollapsed || isSelected){
          setIsCollapsed(!isCollapsed);
        }
        onClickFunc();
        await handleClick(!isCollapsed);
      }}>
        <div className="text-xl font-semibold mb-4 text-purple-800">
          Order {orderId}, {Moment(orderCreateAt).format("MMMM Do YYYY")}
        </div>
        <div className={`text-xl font-semibold ${status == 'Pending'? 'text-red-500': 'text-green-600'} `}>{status}</div>
      </div>

      {/* ColumnName */}
      <div className="flex flex-row ">
        <h2 className="text-xl font-semibold mb-4">Product</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[460px]">Price</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[69px]">Amount</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[80px]">Total</h2>
      </div>

      {/* Book detail list */}
      {isCollapsed? null : bookList.map((item) => (
      <div key={item.bookName} className="flex items-center justify-between py-3 border-b">
        <div className="flex items-center gap-4">
        <span className=" text-2xl">{item.bookName}</span>
        </div>
        <div className="flex items-center">
        <span className=" text-xl mr-12 w-24 text-left">₫{item.price.toLocaleString()}</span>
        <span className=" text-lg mr-12 w-7">{item.quantity}</span>
        <span className=" text-xl w-24 text-right">₫{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
      ))}

    </div>
  );
}