import React from "react";
import Book1 from "../BookCategoryList/ExampleImage/book1.jpg";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Book3 from "../BookCategoryList/ExampleImage/book3.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Cart() {
  const cartlist = [{
    title: "BẠCH DẠ HÀNH",
    price: 199750,
    image: Book1,
  }, {
    title: "ĐÔI MẮT CỦA MONA",
    price: 287300,
    image: Book2,
  }, {
    title: "CUỐN SÁCH HOANG DÃ",
    price: 115600,
    image: Book3,
  }];
  return (
    <div className="min-h-screen bg-white pl-96">
      <Navbar/>
      <h1 className="text-3xl font-bold text-green-600 mb-6 pl-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 pl-8">
          {cartlist.map((book, index) => (
            <div key={index} className="flex items-center border-b pb-4">
              <img src={book.image} alt={book.title} className="w-20 h-28 object-cover mr-4" />
              <div className="flex-1">
                <h2 className="text-md font-semibold">{book.title}</h2>
                <button className="text-red-600 text-sm">Xoá</button>
              </div>
              <div className="text-green-600 font-semibold w-24 text-right">
                {(book.price).toLocaleString('vi-VN')}₫
              </div>

              <div className="flex items-center ml-6">
                <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden text-sm font-medium">
                  <button
                    className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <div className="px-4 py-1">1</div>
                  <button
                    className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-green-600 font-semibold w-24 text-right ml-4">
                {(book.price).toLocaleString('vi-VN')}₫
              </div>
            </div>
          ))}

          <div className="mt-6 text-right font-bold text-green-600 text-lg">
            Tổng tiền: {(602650).toLocaleString('vi-VN')}₫
          </div>
          <button className="mt-4 ml-[650px] w-96 justify-self-end bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Thanh toán
          </button>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
} 