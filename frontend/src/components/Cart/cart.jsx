import React, { useState, useEffect } from "react";
import { Checkbox } from '@headlessui/react'
import Book1 from "../BookCategoryList/ExampleImage/book1.jpg";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Book3 from "../BookCategoryList/ExampleImage/book3.png";
import Footer from "../Footer/Footer";
import Cookies from 'js.cookie';
import axios from 'axios';

export default function Cart() {
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`,}
  const userId = Cookies.get('userId');
  const apiUrl = import.meta.env.VITE_API_URL;
  const [showVoucher, setShowVoucher] = useState(false);
  const [showInvalidVoucher, setShowInvalidVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [pickVoucherText, setPickVoucherText] = useState("Apply voucher");
  const [totalAmount, setTotalAmount]  = useState(0);
  const [voucherIndex, setVoucherIndex] = useState(-1);
  const [cartlist, setCartlist] = useState([])
  const [voucherList, setVoucherList] = useState([]);
  const [discountText, setDiscountText] = useState('');
  const [discountText2, setDiscountText2] = useState('');
  useEffect( () => {
    console.log(userId);
    getCartList(userId);
    getVoucherList(userId);
    }, []);

  const getCartList = async(userId)=>{
    await axios.get(`${apiUrl}/api/cart/user/${userId}`,{
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

  const updateCartListBackend = async (userId, bookId, quantity)=>{
    let data = {
      "userId": userId,
      "bookId": bookId,
      "quantity": quantity,
    };
    await axios.put(`${apiUrl}/api/cart/update-quantity`,
    data,
    {   
      headers: auth,
    })
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
      console.error(' qqq Error fetching data:', error);
    });
  };

  const deleteCartBookBackend = async (userId, bookId)=>{
    await axios.delete(`${apiUrl}/api/cart/${userId}/${bookId}`,
    //data,
    {   
      headers: auth,
    })
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
      console.error(' qqq Error fetching data:', error);
    });
  }

  const getVoucherList = async(userId)=>{
    await axios.get(`${apiUrl}/api/users/${userId}/discount-codes`,{
      headers:auth,
    })
    .then((response) => {
        setVoucherList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
    caculateTotal();
  };

  const handleSubmitVoucher = () => {
    console.log("Submitted voucher code:", voucherCode);
    if (false){
      
    } else{
      console.log('good');
      setShowVoucher(false);
      setPickVoucherText(`Voucher applied`);
      setDiscountText(`${(totalAmount).toLocaleString('vi-VN')}₫ `);
      setDiscountText2(`-${voucherList[voucherIndex].discountPercentage}%`);
      var tempTotal = 0;
      tempTotal = totalAmount - totalAmount*parseFloat(voucherList[voucherIndex].discountPercentage)/100;
      setTotalAmount(Math.round(tempTotal));
    }
  };

  const caculateTotal = ()=>{
    var tempTotal = 0;
    for (let i = 0; i < cartlist.length; i++) {
      if (cartlist[i].isPurchased)
      tempTotal += cartlist[i].quantity*cartlist[i].book.price_discounted;
    }
    setTotalAmount(tempTotal);
  }

  const handelQuantityChange = async (value, index) =>{
    if (value<1) return;
    var newBook = {
      ...cartlist[index], quantity: value,
    }
    var newList = cartlist.slice();
    newList.splice(index, 1, newBook);
    setCartlist(newList);
    await updateCartListBackend(14, newBook.bookId, value)
  }

  const handleCheckBoxChange = async (value, index)=>{
    var newBook = {
      ...cartlist[index], isPurchased: value,
    }
    var newList = cartlist.slice();
    newList.splice(index, 1, newBook);
    setCartlist(newList);
  }

  const handleDeleteBook = async (index)=>{
    var newList = cartlist.slice();
    newList.splice(index, 1);
    setCartlist(newList);
    await deleteCartBookBackend(14, cartlist[index].bookId )
  }

  const handlePlaceOrder = async (userId)=>{
    let tempList = []
    for (let i=0; i< cartlist.length; i++){
      if (cartlist[i].isPurchased) tempList.push(cartlist[i].bookId)
    };
    let data = {
      "userId": userId,
      "bookIds": tempList,
    };
    await axios.post(`${apiUrl}/api/order/create`,
      data,
      {
        headers: auth,
      }
    ).then((response)=>{
      console.log(response.data);
    }). catch((error)=>{
      console.error('qqq Error fetching data:', error)
    })
  }
  return (
    <div className="flex flex-col min-h-screen bg-white">
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
                  
                  {/* Text Button */}
                  <div
                    className="text-xl text-blue-600 cursor-pointer"
                    onClick={() => setShowVoucher(!showVoucher)}
                  >
                    {pickVoucherText}
                  </div>

                  {/* Drop down */}
                  {showVoucher && (
                    <div className="flex flex-col absolute left-3 mt-2 w-64 bg-white shadow-lg border rounded-lg p-4 z-10">
                      
                      {/* <input
                        type="text"
                        className="w-full border px-3 py-2 rounded mb-2"
                        placeholder="Enter voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      /> */}

                      {/* Voucher list */}
                      {(voucherList.length ==0)
                      ? <div>You don't have any voucher</div>
                      : voucherList.map((voucher, index)=>(
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="voucher"
                            value={index}
                            checked={voucherIndex === index}
                            onChange={() => {setVoucherCode(voucher.code); setVoucherIndex(index)}}
                            className="mr-2"
                          />
                          <div>{voucher.code}</div>
                        </div>
                      ))}

                      {/* Option button  */}
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => {setShowVoucher(false); setShowInvalidVoucher(false); setVoucherIndex(-1)}}
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
            <div className="flex flex-row justify-end">
              <div className="mt-6 text-right font-bold text-green-600 text-lg">
                Total amount: {(totalAmount).toLocaleString('vi-VN')}₫ 
              </div>
              <div className="mt-7 pl-3 text-right line-through text-green-600">
                {discountText}
              </div>
              <div className="mt-7 pl-3 text-right text-green-600">
                {discountText2}
              </div>
            </div>
            <button onClick={()=>{handlePlaceOrder(14);}} className="mt-4 ml-[1250px] w-96 justify-self-end bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Place Order
            </button>
          
        </div>
      :<div className=" text-center text-3xl font-bold">Your cart is empty</div>
      }
      
      <Footer/>
    </div>
  );
} 