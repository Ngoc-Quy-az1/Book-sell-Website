import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';
import OrderItem from "./OrderItem";
import { selectClasses } from "@mui/material";
import Moment from 'moment';

export default function PlaceOrder() {
  const userId = Cookies.get('userId');
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [selectedOrder, setSelectedOrder] = useState(-1);
  const [orderList, setOrderList] = useState([]);
  useEffect( () => {
    Moment.locale('en');
    getOrderList(userId);
  }, []);

  const getOrderList = async (userID)=>{
    await axios.get(`http://localhost:8090/api/order/${userID}`,{
      headers:auth,
    })
    .then((response) => {
        setOrderList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  //const total = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = 3;
  return (
    <div className="flex flex-row">
      <div className="flex flex-col mb-16">
        {orderList.map((order, index)=>(
          <OrderItem key={order.orderId} 
            status={order.status}
            isSelected={selectedOrder == index} 
            orderId={order.orderId} 
            orderCreateAt={order.createdAt}
            onClickFunc={()=>{
              console.log(`click on ${index}`);
              if (selectedOrder != index) {
                setSelectedOrder(index);
              } else {
                setSelectedOrder(-1)
              }
            }}
          />
        ))}
      </div>
      

      <div className="flex flex-col justify-items-start w-96 p-6 bg-slate-300 rounded-xl shadow-md mt-10 fixed top-2 right-12">
      
        {(selectedOrder == -1)
        ? <div className="text-lg font-bold">Select order to view detail</div> 
        :<div>
          <div className="flex flex-row justify-between">
            <div className="text-lg font-bold text-purple-800">
              Order {orderList[selectedOrder].orderId}, {Moment(orderList[selectedOrder].createdAt).format("MMMM Do YYYY")}
            </div>
            <div 
              className={`text-xl font-semibold ${orderList[selectedOrder].status == 'Pending'? 'text-red-500': 'text-green-600'} `}
            >
              {orderList[selectedOrder].status}
            </div>
          </div>
          <div className="flex justify-end text-lg font-bold py-4 border-t  ">
            Final price: 
            <span className="text-red-500 ml-2">
              ₫{orderList[selectedOrder].totalAmount.toLocaleString()}
            </span>
          </div>

          {orderList[selectedOrder].status == 'Pending'
          ?<div className="flex justify-end mt-4">
            <button className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600">Place order</button>
           </div>
           : null}
        </div>}
      </div>  
      
    </div>
  );
}
