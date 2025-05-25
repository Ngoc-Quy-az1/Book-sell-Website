import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Cookies from 'js.cookie';
import axios from 'axios';
import "../../CheckToken";
import { Link, useNavigate } from "react-router-dom";
import voucherImage from './ExampleImage/ahihi.png';  // Import the voucher image

export default function Cart() {
  const navigate = useNavigate();
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

  const updateVoucherCount = async (voucherCode) => {
    try {
      await axios.put(`${apiUrl}/api/discount-codes/${voucherCode}/decrease`, {}, {
        headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
      });
    } catch (error) {
      console.error('Error updating voucher count:', error);
    }
  };

  useEffect( () => {
    //console.log(userId);
    getCartList(userId);
    getVoucherList(userId);
    }, []);

  useEffect(() => {
    let total = 0;
    cartlist.forEach(item => {
      if (item.isPurchased) total += item.quantity * item.book.price_discounted;
    });

    // Nếu có sách được chọn và đã chọn voucher thì áp dụng giảm giá
    if (voucherIndex !== -1 && voucherList[voucherIndex]) {
      const selectedVoucher = voucherList[voucherIndex];
      setDiscountText(`${total.toLocaleString('vi-VN')}₫`);
      setDiscountText2(selectedVoucher.discountPercentage ? `-${selectedVoucher.discountPercentage}%` : (selectedVoucher.discountAmount ? `-${selectedVoucher.discountAmount.toLocaleString('vi-VN')}₫` : ''));
      if (selectedVoucher.discountPercentage) {
        total = total - (total * parseFloat(selectedVoucher.discountPercentage) / 100);
      } else if (selectedVoucher.discountAmount) {
        total = total - selectedVoucher.discountAmount;
      }
    } else {
      setDiscountText('');
      setDiscountText2('');
    }
    setTotalAmount(Math.max(0, Math.round(total)));
  }, [cartlist, voucherIndex, voucherList]);

  const getCartList = async(userId)=>{
    await axios.get(`${apiUrl}/api/cart/user/${userId}`,{
      headers:{'Authorization': `Bearer ${Cookies.get('authToken')}`},
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
      headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
    })
    .then((response) => {
        //console.log(response.data);
    })
    .catch((error) => {
      console.error(' qqq Error fetching data:', error);
    });
  };

  const deleteCartBookBackend = async (userId, bookId) => {
    await axios.delete(`${apiUrl}/api/cart/${userId}/${bookId}`, {
      headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
    })
    .catch((error) => {
      if (error.response) {
        console.error('API error:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching data:', error);
      }
    });
  }

  const getVoucherList = async(userId)=>{
    await axios.get(`${apiUrl}/api/users/${userId}/discount-codes`,{
      headers:{'Authorization': `Bearer ${Cookies.get('authToken')}`},
    })
    .then((response) => {
        setVoucherList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
    caculateTotal();
  };

  // Add function to check if voucher is valid
  const isVoucherValid = (voucher) => {
    return voucher && voucher.numberCode > 0;
  };

  // Add function to handle voucher selection
  const handleVoucherSelect = (index) => {
    const selectedVoucher = voucherList[index];
    if (isVoucherValid(selectedVoucher)) {
      setVoucherCode(selectedVoucher.code);
      setVoucherIndex(index);
    } else {
      setVoucherIndex(-1);
      setVoucherCode("");
    }
  };

  // Thêm hàm xử lý double click để bỏ chọn voucher
  const handleVoucherDoubleClick = (index) => {
    if (voucherIndex === index) {
      setVoucherIndex(-1);
      setVoucherCode("");
      setPickVoucherText("Apply voucher");
    }
  };

  // Modify useEffect to reset voucher selection if selected voucher becomes invalid
  useEffect(() => {
    if (voucherIndex !== -1 && !isVoucherValid(voucherList[voucherIndex])) {
      setVoucherIndex(-1);
      setVoucherCode("");
      setPickVoucherText("Apply voucher");
    }
  }, [voucherList, voucherIndex]);

  // Xác định có sách nào được chọn không
  const hasSelectedBooks = cartlist.some(item => item.isPurchased);

  // Khi nhấn Apply chỉ lưu trạng thái voucher đã chọn, không trừ số lượng
  const handleSubmitVoucher = () => {
    if (voucherIndex === -1 || !isVoucherValid(voucherList[voucherIndex])) {
      setShowInvalidVoucher(true);
      return;
    }
    setShowVoucher(false);
    setPickVoucherText(`Voucher applied`);
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
    await updateCartListBackend(userId, newBook.bookId, value)
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
    await deleteCartBookBackend(userId, cartlist[index].bookId )
  }

  // Trừ số lượng voucher khi đặt hàng thành công
  const handlePlaceOrder = async (userId) => {
    let tempList = [];
    for (let i = 0; i < cartlist.length; i++) {
      if (cartlist[i].isPurchased) tempList.push(cartlist[i].bookId);
    }
    let data = {
      "userId": userId,
      "bookIds": tempList,
    };
    if (voucherCode) {
      data.discountCode = voucherCode;
    }
    await axios.post(`${apiUrl}/api/order/create`,
      data,
      {
        headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
      }
    ).then(async (response) => {
      // Trừ số lượng voucher ở đây nếu có dùng
      if (voucherIndex !== -1 && voucherList[voucherIndex]) {
        await updateVoucherCount(voucherList[voucherIndex].code);
        // Cập nhật lại voucherList local
        const updatedVoucherList = voucherList.map((voucher, index) => {
          if (index === voucherIndex) {
            return {
              ...voucher,
              numberCode: Math.max(0, voucher.numberCode - 1)
            };
          }
          return voucher;
        });
        setVoucherList(updatedVoucherList);
      }
      const newCartList = cartlist.filter(item => !item.isPurchased);
      setCartlist(newCartList);
      setVoucherIndex(-1);
      setPickVoucherText("Apply voucher");
      // Chuyển hướng đến trang placeorder sau khi đặt hàng thành công
      navigate('/placeorder');
    }).catch((error) => {
      console.error('Error creating order:', error)
    });
  }
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 mt-8 px-4 md:px-10 lg:ml-36">Your Cart</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 px-4 md:px-10 lg:ml-36 text-sm">
        Select the book you want to pay for, change the quantity or remove the product from the cart.
      </p>
      {cartlist.length > 0 ? (
        <div className="flex flex-col px-1 sm:px-4 md:px-16 lg:px-36">
          {/* Bọc bảng trong một div cho phép cuộn ngang trên mobile */}
          <div className="w-full overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="min-w-[700px] w-full text-center">
              <thead className="bg-green-50 dark:bg-green-900/30 border-b dark:border-gray-700">
                <tr>
                  <th className="py-3 px-2"></th>
                  <th className="py-3 px-2 text-left text-gray-900 dark:text-white">Product information</th>
                  <th className="py-3 px-2 text-gray-900 dark:text-white"> Book Price </th>
                  <th className="py-3 px-2 text-gray-900 dark:text-white">Quantity</th>
                  <th className="py-3 px-2 text-gray-900 dark:text-white">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {cartlist.map((cartItem, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <td className="py-2 px-2 align-middle">
                      <input
                        checked={cartItem.isPurchased}
                        onChange={() => {
                          var newValue = !cartItem.isPurchased;
                          handleCheckBoxChange(newValue, index);
                        }}
                        type="checkbox"
                        className="w-5 h-5 accent-green-500"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-4 min-h-[96px]">
                        <img src={cartItem.book.image} alt={cartItem.book.title} className="w-16 h-24 object-cover rounded border dark:border-gray-600" />
                        <div className="flex flex-col justify-center h-24 w-full">
                          <div className="font-semibold text-gray-800 dark:text-gray-200 text-left break-words line-clamp-2" style={{maxWidth: '220px'}}>
                            {cartItem.book.title}
                          </div>
                          <button
                            className="text-red-500 dark:text-red-400 hover:underline text-sm self-start mt-2"
                            onClick={() => handleDeleteBook(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-green-600 dark:text-green-400 font-bold align-middle">
                      {(cartItem.book.price_discounted).toLocaleString('vi-VN')}₫
                    </td>
                    <td className="py-2 px-2 align-middle">
                      <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 shadow-sm">
                        <button
                          onClick={() => handelQuantityChange(cartItem.quantity - 1, index)}
                          className="px-3 py-1 text-xl text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                        >-</button>
                        <span className="px-4 py-1 min-w-[32px] text-center text-gray-800 dark:text-white">{cartItem.quantity}</span>
                        <button
                          onClick={() => handelQuantityChange(cartItem.quantity + 1, index)}
                          className="px-3 py-1 text-xl text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                        >+</button>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-green-700 dark:text-green-400 font-bold align-middle">
                      {(cartItem.book.price_discounted * cartItem.quantity).toLocaleString('vi-VN')}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mã giảm giá */}
          <div className="mt-8 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Your Discount</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">(Chỉ áp dụng 1 voucher cho mỗi đơn hàng.)</span>
            </div>
            <div className="mt-2">
              <div
                className="inline-block text-blue-600 dark:text-blue-400 cursor-pointer font-semibold hover:underline"
                onClick={() => setShowVoucher(true)}
              >
                {pickVoucherText}
              </div>
            </div>
            {/* Popup voucher */}
            {showVoucher && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 z-30"
                  onClick={() => {setShowVoucher(false); setShowInvalidVoucher(false);}}
                />
                <div className="fixed top-1/2 left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-xl p-6 overflow-y-auto max-h-[80vh]">
                  <div className="flex flex-row gap-4 overflow-x-auto pb-2 max-w-full" style={{paddingBottom: 8}}>
                    {voucherList.map((voucher, index) => {
                      const isDisabled = !isVoucherValid(voucher);
                      return (
                        <div
                          key={index}
                          className={`min-w-[260px] max-w-[260px] bg-white dark:bg-gray-700 rounded-xl shadow-md border-2 flex-shrink-0 flex flex-col items-center p-4 transition-all cursor-pointer select-none 
                            ${voucherIndex === index ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 scale-105' : 'border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'}
                            ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={() => handleVoucherSelect(index)}
                          onDoubleClick={() => handleVoucherDoubleClick(index)}
                          style={{marginRight: 12}}
                        >
                          <div className="flex items-center gap-2 mb-2 w-full">
                            <img src={voucher.image || voucherImage} alt="Voucher" className="w-12 h-12 rounded-lg object-cover border dark:border-gray-600 bg-orange-100 dark:bg-orange-900/30" />
                            <span className="uppercase text-xs font-bold text-orange-500 dark:text-orange-400">VOUCHER</span>
                          </div>
                          <div className="font-bold text-green-700 dark:text-green-400 text-base mb-1 text-center">{voucher.code}</div>
                          <div className="text-red-500 dark:text-red-400 font-bold text-lg mb-1 text-center">
                            {voucher.discountAmount ? `Giảm ${(voucher.discountAmount).toLocaleString('vi-VN')}₫` : `Giảm ${voucher.discountPercentage}%`}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">HSD: {voucher.expirationDate || '---'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">Số lượng: {voucher.numberCode ?? 0}</div>
                          <input
                            type="radio"
                            name="voucher"
                            value={index}
                            checked={voucherIndex === index}
                            onChange={() => handleVoucherSelect(index)}
                            className="mt-2 accent-green-500"
                            disabled={isDisabled}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {/* Option button  */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => {setShowVoucher(false); setShowInvalidVoucher(false); setVoucherIndex(-1)}}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 text-sm bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                      onClick={handleSubmitVoucher}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* Hiển thị giá gạch và phần trăm giảm nếu có và có sách được chọn */}
            {(hasSelectedBooks && (discountText || discountText2)) && (
              <div className="flex flex-col items-end mt-2">
                <div className="line-through text-green-600 dark:text-green-400">{discountText}</div>
                <div className="text-green-600 dark:text-green-400">{discountText2}</div>
              </div>
            )}
          </div>
          {/* Tổng tiền */}
          <div className="flex justify-end mt-6">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">
              Total: {totalAmount.toLocaleString('vi-VN')}₫
            </div>
          </div>
          {/* Nút thanh toán */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handlePlaceOrder(userId)}
              className="bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 dark:hover:bg-green-600 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-3xl font-bold text-gray-400 dark:text-gray-500 mt-10">Your cart is emply</div>
      )}
    </div>
  );
}