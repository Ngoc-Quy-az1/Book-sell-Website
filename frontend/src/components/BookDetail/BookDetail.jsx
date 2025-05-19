import React, { useState, useEffect } from "react";
import { Minus, Plus, Pen, ShoppingCart } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Star } from "lucide-react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import Cookies from 'js.cookie';
import Moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../CheckToken";
import { ToastContainer } from 'react-toastify';


const BookDetail = () => {
  const userId = Cookies.get('userId');
  const [listComment, setListComment] = useState([]);
  const [bookDetail, setBookDetail] = useState()
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [totalComment, setTotalComment] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const MAX_DESCRIPTION_LENGTH = 350;
  const apiUrl = import.meta.env.VITE_API_URL;
  let ratingArray = [0,0,0,0,0,0];
  let {id} = useParams();
  useEffect(() => {
    getBookDetail();
    getAllReview(id);
  }, [id]);

  useEffect(() => {
    // Listen for theme changes
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getBookDetail = ()=>{
    axios.get(`${apiUrl}/api/books/${id}`,{
    })
    .then((response) => {
      setBookDetail(response.data);
    })
  }

  const getAllReview = async (bookId)=>{
    axios.get(`${apiUrl}/api/users/review/${bookId}`)
    .then((response) => {
      setListComment(response.data);
      setTotalComment(listComment.length)
    })
  }

  const getRatingArray = () => {
    const arr = [0, 0, 0, 0, 0, 0];
    listComment.forEach(c => {
      if (c.rating >= 1 && c.rating <= 5) arr[c.rating]++;
    });
    return arr;
  };

  const caculatePercentStar = (score) => {
    const arr = getRatingArray();
    const total = listComment.length || 1;
    return (arr[score] / total) * 100;
  };

  const caculateAverageRating = () => {
    if (listComment.length === 0) return 0;
    const sum = listComment.reduce((acc, c) => acc + c.rating, 0);
    return sum / listComment.length;
  };

  const postReview = async (rating, comment, bookId)=>{
    const data = {
      "rating": rating,
      "comment": comment
    }
    await axios.post(`${apiUrl}/api/users/review/${userId}/${bookId}`,
      data,
      {
        headers: {'Authorization': `Bearer ${Cookies.get('authToken')}`},
      }
    )
  }

  const handleSetquantity=(value)=>{
    if (value < 1) return;
    setBuyQuantity(value);
  }
  const handleSubmitReview = async () => {
    await postReview(rating, comment, id);
    await getAllReview(id);
    setIsOpenDialog(false);
    setRating(0);
    setComment("");
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/cart/add`,
        {
          userId: Number(userId),
          bookId: Number(id),
          quantity: buyQuantity
        },
        {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
        }
      );
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '50%',
            marginRight: 12
          }}>
          </span>
          Đã thêm vào giỏ hàng!
        </div>,
        { position: "top-right", style: { background: 'linear-gradient(90deg, #bbf7d0 0%, #86efac 100%)', color: '#166534', fontWeight: 'bold' } }
      );
    } catch (error) {
      let errorMessage = "";
      let errorIcon = "";

      if (!Cookies.get('authToken')) {
        errorMessage = "Vui lòng đăng nhập để thêm sách vào giỏ hàng";
      } else {
        errorMessage = "Sách này đã có trong giỏ hàng của bạn";
        errorIcon = "";
      }

      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, #f59e42 0%, #f43f1a 100%)',
            borderRadius: '50%',
            marginRight: 12,
            fontSize: '20px'
          }}>
            {errorIcon}
          </span>
          {errorMessage}
        </div>,
        { 
          position: "top-right", 
          style: { 
            background: 'linear-gradient(90deg, #fef3c7 0%, #fdba74 100%)', 
            color: '#b45309', 
            fontWeight: 'bold' 
          } 
        }
      );
    }
  };

  if (bookDetail == undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 flex flex-col md:flex-row gap-12 transition-colors">
          {/* Ảnh sách lớn bên trái */}
          <div className="flex-shrink-0 flex justify-center items-start">
            <img
              src={bookDetail.image}
              alt={bookDetail.title}
              className="w-[380px] h-[540px] object-cover rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 cursor-zoom-in transition-all duration-200 hover:scale-105"
              onClick={() => setIsFullScreen(true)}
            />
            {/* Modal phóng to ảnh */}
            {isFullScreen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                onClick={() => setIsFullScreen(false)}
              >
                <img
                  src={bookDetail.image}
                  alt={bookDetail.title}
                  className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          {/* Thông tin + mô tả bên phải */}
          <div className="flex-1 flex flex-col gap-6 justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">{bookDetail.title}</h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                Tác giả: <span className="font-bold text-gray-900 dark:text-white">{bookDetail.author}</span>
              </p>
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={32} className={star <= caculateAverageRating() ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400 text-xl font-semibold">{caculateAverageRating().toFixed(1)} / 5</span>
              </div>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-extrabold text-green-600 dark:text-green-400">{parseFloat(bookDetail.price_discounted).toLocaleString()}₫</span>
                <span className="text-2xl line-through text-gray-400 dark:text-gray-500">{parseFloat(bookDetail.price_original).toLocaleString()}₫</span>
                <span className="bg-red-500 text-white text-lg font-bold px-4 py-1 rounded">-{Math.round((parseFloat(bookDetail.price_original) - parseFloat(bookDetail.price_discounted))*100/parseFloat(bookDetail.price_original))}%</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 mb-6">
                <div className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden">
                  <button className="px-1 sm:px-2 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-xs sm:text-xl text-gray-800 dark:text-white" onClick={()=>handleSetquantity(buyQuantity-1)}><Minus size={16}/></button>
                  <span className="px-1 sm:px-2 md:px-4 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{buyQuantity}</span>
                  <button className="px-1 sm:px-2 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-xs sm:text-xl text-gray-800 dark:text-white" onClick={()=>handleSetquantity(buyQuantity+1)}><Plus size={16}/></button>
                </div>
                <button
                  onClick={addToCart}
                  className="flex items-center gap-2 sm:gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-bold text-sm sm:text-xl px-4 sm:px-8 py-3 rounded-xl shadow transition"
                >
                  <ShoppingCart className="w-4 sm:w-6 h-4 sm:h-6" />
                  Thêm vào giỏ hàng
                </button>
              </div>
              {/* Book Details grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-xl text-gray-700 dark:text-gray-300 mb-6">
                <div><span className="font-semibold">Dịch giả:</span> {bookDetail.translator}</div>
                <div><span className="font-semibold">NXB:</span> {bookDetail.publisher}</div>
                <div><span className="font-semibold">Kích thước:</span> {bookDetail.dimensions}</div>
                <div><span className="font-semibold">Số trang:</span> {bookDetail.pages}</div>
                <div><span className="font-semibold">Năm XB:</span> {bookDetail.created_at}</div>
              </div>
              {/* Mô tả sách */}
              <div className="mt-2">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Mô tả sách</h2>
                <p className="text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
                  {bookDetail.description.length > MAX_DESCRIPTION_LENGTH && !showFullDescription
                    ? (
                      <>
                        {bookDetail.description.slice(0, MAX_DESCRIPTION_LENGTH)}...
                        <button
                          className="ml-2 text-green-600 dark:text-green-400 font-semibold hover:underline"
                          onClick={() => setShowFullDescription(true)}
                        >Xem thêm</button>
                      </>
                    )
                    : (
                      <>
                        {bookDetail.description}
                        {bookDetail.description.length > MAX_DESCRIPTION_LENGTH && (
                          <button
                            className="ml-2 text-green-600 dark:text-green-400 font-semibold hover:underline"
                            onClick={() => setShowFullDescription(false)}
                          >Ẩn bớt</button>
                        )}
                      </>
                    )
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Ratings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mt-10 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">{caculateAverageRating().toFixed(1)}</div>
              <div className="flex items-center mb-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={22} className={star <= caculateAverageRating() ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                ))}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">({listComment.length} đánh giá)</div>
            </div>
            <div className="flex-1 w-full max-w-lg mx-auto">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2 mb-2">
                  <span className="w-10 text-sm text-gray-600 dark:text-gray-400">{star} sao</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{width: `${caculatePercentStar(star)}%`}}></div>
                  </div>
                  <span className="w-10 text-sm text-gray-500 dark:text-gray-400 text-right">{caculatePercentStar(star).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center md:items-end">
              <button 
                onClick={() => {
                  if (!Cookies.get('authToken')) {
                    toast.error(
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(90deg, #f59e42 0%, #f43f1a 100%)',
                          borderRadius: '50%',
                          marginRight: 12,
                          fontSize: '20px'
                        }}>
                          
                        </span>
                        Vui lòng đăng nhập để thêm đánh giá
                      </div>,
                      { 
                        position: "top-right", 
                        style: { 
                          background: 'linear-gradient(90deg, #fef3c7 0%, #fdba74 100%)', 
                          color: '#b45309', 
                          fontWeight: 'bold' 
                        } 
                      }
                    );
                  } else {
                    setIsOpenDialog(true)
                  }
                }} 
                className="flex items-center gap-2 border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 px-4 py-2 rounded-lg font-semibold transition">
                <Pen size={16} className="mr-1"/> Viết đánh giá
              </button>
            </div>
          </div>
          {/* User Comments */}
          <div className="mt-10 max-h-[350px] overflow-y-auto space-y-6">
            {listComment.length === 0 && <div className="text-gray-400 dark:text-gray-500 italic text-center">Chưa có đánh giá nào.</div>}
            {listComment.map((comment, idx) => (
              <div key={idx} className="border dark:border-gray-700 p-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">{comment.user_name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{Moment(comment.created_at).format('YYYY-MM-D, HH:mm')}</span>
                </div>
                <div className="flex items-center text-yellow-500 mb-2">
                  {Array.from({length: comment.rating}).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.review}</p>
              </div>
            ))}
          </div>
          {/* Comment Dialog */}
          <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md transition-colors">
                <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Đánh giá của bạn</Dialog.Title>
                <div className="flex space-x-2 mb-4">
                  {[1,2,3,4,5].map(num => (
                    <Star
                      key={num}
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(num)}
                      className={`w-7 h-7 cursor-pointer transition-colors ${
                        (hoverRating || rating) >= num ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400 dark:stroke-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Viết nhận xét của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsOpenDialog(false)}
                    className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
};

export default BookDetail;
