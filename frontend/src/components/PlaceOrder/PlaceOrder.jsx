import React, { useState, useEffect } from "react";

export default function PlaceOrder() {
  const bookList = [
    {
      id: 3,
      title: "ĂN DẶM KHÔNG NƯỚC MẮT",
      price: 53360,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/100/363/455/products/an-dam-khong-nuoc-mat.jpg?v=1695032717550",
    },
    {
      id: 2,
      title: "NUÔI DẠY CON KHÔNG QUÁT MẮNG",
      price: 53360,
      quantity: 2,
      image: "https://bizweb.dktcdn.net/100/363/455/products/nuoidayconkhongquatmangcover01.jpg?v=1705552116190",
    },
  ];

  const total = bookList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const handleSubmitVoucher = () => {
    console.log("Submitted voucher code:", voucherCode);
    setShowVoucher(false);
  };
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-xl mt-10">
      <div className="flex flex-row">
        <h2 className="text-xl font-semibold mb-4">Product</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[460px]">Price</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[69px]">Amount</h2>
        <h2 className="text-xl font-semibold mb-4 ml-[80px]">Total</h2>
      </div>
      {bookList.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-4">
            <img src={item.image} alt="book" className="w-12 h-16 object-cover" />
            <span className=" text-2xl">{item.title}</span>
          </div>
          <div className="flex items-center">
            <span className=" text-xl mr-12 w-24 text-left">₫{item.price.toLocaleString()}</span>
            <span className=" text-lg mr-12 w-7">{item.quantity}</span>
            <span className=" text-xl w-24 text-right">₫{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center py-4 border-t mt-4">
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

      <div className="flex justify-end text-lg font-bold py-4 border-t">
        Final price: 
        <span className="text-red-500 ml-2">₫{total.toLocaleString()}</span>
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        When you click Place order it mean you agree with <span className="text-blue-600 cursor-pointer"> Our term of service.</span>
      </div>

      <div className="flex justify-end mt-4">
        <button className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600">Place order</button>
      </div>
    </div>
  );
}
