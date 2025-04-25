import React, { useState, useEffect } from "react";
import { Checkbox } from '@headlessui/react'
import Book1 from "../BookCategoryList/ExampleImage/book1.jpg";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Book3 from "../BookCategoryList/ExampleImage/book3.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cookies from 'js.cookie';
import axios from 'axios';

export default function Cart() {
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const handleSubmitVoucher = () => {
    console.log("Submitted voucher code:", voucherCode);
    setShowVoucher(false);
  };
  const [totalAmount, setTotalAmount]  = useState(0);
  const [cartlist, setCartlist] = useState([])
  // const [cartlist, setCartlist] = useState([{
  //   check:true,
  //   quantity: 1,
  //   title: "BẠCH DẠ HÀNH",
  //   price: 199750,
  //   image: Book1,
  // }, {
  //   check:true,
  //   quantity: 2,
  //   title: "ĐÔI MẮT CỦA MONA",
  //   price: 287300,
  //   image: Book2,
  // }, {
  //   check:false,
  //   quantity: 3,
  //   title: "CUỐN SÁCH HOANG DÃ",
  //   price: 115600,
  //   image: Book3,
  // }]);
  useEffect( () => {
    getCartList(14);
    }, []);

  const getCartList = async(userId)=>{
    await axios.get(`http://localhost:8090/api/cart/user/${userId}`,{
      headers:auth,
    })
    .then((response) => {
        setCartlist(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
    caculateTotal();
  };
    
  const caculateTotal = ()=>{
    var tempTotal = 0;
    for (let i = 0; i < cartlist.length; i++) {
      if (cartlist[i].check)
      tempTotal += cartlist[i].quantity*cartlist[i].book.price_discounted;
    }
    setTotalAmount(tempTotal);
  }

  const handelQuantityChange = (value, index) =>{
    if (value<1) return;
    var newBook = {
      ...cartlist[index], quantity: value,
    }
    var newList = cartlist.slice();
    newList.splice(index, 1, newBook);
    setCartlist(newList);
  }

  const handleCheckBoxChange = (value, index)=>{
    var newBook = {
      ...cartlist[index], isPurchased: value,
    }
    var newList = cartlist.slice();
    newList.splice(index, 1, newBook);
    setCartlist(newList);
  }

  const handleDeleteBook = (index)=>{
    var newList = cartlist.slice();
    newList.splice(index, 1);
    setCartlist(newList);
  }
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar/>
      <h1 className="text-3xl font-bold text-green-600 mb-6 ml-36 mt-8">Your cart</h1>
      {(cartlist.length>0)
      ? <div className="flex flex-col content-evenly px-36 ">
        
            {cartlist.map((cartItem, index) => (
              <div key={index} className="flex flex-row content-evenly items-center border-b pb-4">
                <input checked={cartItem.isPurchased} 
                  onChange={()=>{
                    var newValue= !cartItem.isPurchased
                    handleCheckBoxChange(newValue, index);
                    if (newValue){
                      setTotalAmount(totalAmount + cartlist[index].book.price_discounted*cartlist[index].quantity);
                    } else{
                      setTotalAmount(totalAmount - cartlist[index].book.price_discounted*cartlist[index].quantity);
                    }
                  }} 
                  type="checkbox" className="mr-4 w-5 h-5" />

                {/* Book image */}
                <img src={cartItem.book.image} alt={cartItem.book.title} className="w-20 h-28 object-cover mr-4" />

                {/* Book information */}
                <div className="flex-1">
                  <h2 className="text-md font-semibold">{cartItem.book.title}</h2>
                  <button className="text-red-600 text-sm"
                    onClick={()=>{
                      if (cartItem.isPurchased) setTotalAmount(totalAmount - cartItem.price*cartItem.quantity);
                      handleDeleteBook(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="text-green-600 font-semibold w-24 text-right">
                  {(cartItem.book.price_discounted).toLocaleString('vi-VN')}₫
                </div>

                {/* Quantity */}
                <div className="flex items-center ml-6">
                  <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden text-sm font-medium">
                    <button
                      onClick={()=>{
                        if (((cartItem.quantity -1) > 0) && (cartItem.isPurchased)) setTotalAmount(totalAmount-cartlist[index].book.price_discounted);
                        handelQuantityChange(cartItem.quantity - 1, index); 
                      }}
                      className="px-3 py-1 text-2xl text-gray-700 border-r border-gray-300 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <div className=" text-2xl px-4 py-1">{cartItem.quantity}</div>
                    <button
                      onClick={()=>{
                        handelQuantityChange(cartItem.quantity + 1, index);
                        if (cartItem.isPurchased) setTotalAmount(totalAmount + cartlist[index].book.price_discounted);
                      }}
                      className="px-3 py-1 text-2xl text-gray-700 border-l border-gray-300 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Book final price */}
                <div className="text-green-600 font-semibold w-24 text-right ml-4">
                  {(cartItem.book.price_discounted*cartItem.quantity).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}

            {/* Pick voucher   */}
            <div className="flex justify-between items-center py-4 mt-4">
                <div className="relative">
                  <div
                    className="text-xl text-blue-600 cursor-pointer"
                    onClick={() => setShowVoucher(!showVoucher)}
                  >
                    Chọn Voucher
                  </div>
                  {showVoucher && (
                    <div className="absolute left-3 mt-2 w-64 bg-white shadow-lg border rounded-lg p-4 z-10">
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded mb-2"
                        placeholder="Enter voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowVoucher(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={handleSubmitVoucher}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            {/* Total cart price */}
            <div className="mt-6 text-right font-bold text-green-600 text-lg">
              Total amount: {(totalAmount).toLocaleString('vi-VN')}₫
            </div>
            <button className="mt-4 ml-[1250px] w-96 justify-self-end bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Checkout
            </button>
          
        </div>
      :<div className=" text-center text-3xl font-bold">Your cart is empty</div>
      }
      
      <Footer/>
    </div>
  );
} 