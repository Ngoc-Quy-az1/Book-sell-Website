import React, { useState, useEffect } from "react";
import { Checkbox } from '@headlessui/react'
import Book1 from "../BookCategoryList/ExampleImage/book1.jpg";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Book3 from "../BookCategoryList/ExampleImage/book3.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Cart() {
  const [totalAmount, setTotalAmount]  = useState(0);
  const [cartlist, setCartlist] = useState([{
    check:true,
    quantity: 1,
    title: "BẠCH DẠ HÀNH",
    price: 199750,
    image: Book1,
  }, {
    check:true,
    quantity: 2,
    title: "ĐÔI MẮT CỦA MONA",
    price: 287300,
    image: Book2,
  }, {
    check:false,
    quantity: 3,
    title: "CUỐN SÁCH HOANG DÃ",
    price: 115600,
    image: Book3,
  }]);
  useEffect( () => {
    caculateTotal();
    }, []);

  const caculateTotal = ()=>{
    var tempTotal = 0;
    for (let i = 0; i < cartlist.length; i++) {
      if (cartlist[i].check)
      tempTotal += cartlist[i].quantity*cartlist[i].price;
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
      ...cartlist[index], check: value,
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
        
            {cartlist.map((book, index) => (
              <div key={index} className="flex flex-row content-evenly items-center border-b pb-4">
                <input checked={book.check} 
                  onChange={()=>{
                    var newValue= !book.check
                    handleCheckBoxChange(newValue, index);
                    if (newValue){
                      setTotalAmount(totalAmount + cartlist[index].price*cartlist[index].quantity);
                    } else{
                      setTotalAmount(totalAmount - cartlist[index].price*cartlist[index].quantity);
                    }
                  }} 
                  type="checkbox" className="mr-4 w-5 h-5" />

                {/* Book image */}
                <img src={book.image} alt={book.title} className="w-20 h-28 object-cover mr-4" />

                {/* Book information */}
                <div className="flex-1">
                  <h2 className="text-md font-semibold">{book.title}</h2>
                  <button className="text-red-600 text-sm"
                    onClick={()=>{
                      if (book.check) setTotalAmount(totalAmount - book.price*book.quantity);
                      handleDeleteBook(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="text-green-600 font-semibold w-24 text-right">
                  {(book.price).toLocaleString('vi-VN')}₫
                </div>

                {/* Quantity */}
                <div className="flex items-center ml-6">
                  <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden text-sm font-medium">
                    <button
                      onClick={()=>{
                        if (((book.quantity -1) > 0) && (book.check)) setTotalAmount(totalAmount-cartlist[index].price);
                        handelQuantityChange(book.quantity - 1, index); 
                      }}
                      className="px-3 py-1 text-2xl text-gray-700 border-r border-gray-300 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <div className=" text-2xl px-4 py-1">{book.quantity}</div>
                    <button
                      onClick={()=>{
                        handelQuantityChange(book.quantity + 1, index);
                        if (book.check) setTotalAmount(totalAmount+cartlist[index].price);
                      }}
                      className="px-3 py-1 text-2xl text-gray-700 border-l border-gray-300 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Book final price */}
                <div className="text-green-600 font-semibold w-24 text-right ml-4">
                  {(book.price*book.quantity).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}

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