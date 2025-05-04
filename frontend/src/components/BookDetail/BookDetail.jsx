import React, { useState, useEffect } from "react";
import { Minus, Plus, Pen } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Star } from "lucide-react";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Navbar from "../Navbar/Navbar";
import axios from 'axios';
import Cookies from 'js.cookie';
import Moment from 'moment';


const BookDetail = () => {
  const userId = Cookies.get('userId');
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [listComment, setListComment] = useState([]);
  const [bookDetail, setBookDetail] = useState()
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [totalComment, setTotalComment] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  let ratingArray = [0,0,0,0,0,0];
  useEffect( () => {
    console.log(userId);
    getBookDetail();
    getAllReview(4);
  }, []);

  const getBookDetail = ()=>{
    axios.get('http://localhost:8090/api/books/4',{
      headers:auth,
    })
    .then((response) => {
      setBookDetail(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  const getAllReview = async (bookId)=>{
    axios.get(`http://localhost:8090/api/users/review/${bookId}`,{
      headers:auth,
    })
    .then((response) => {
      setListComment(response.data);
      setTotalComment(listComment.length)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  const caculateAverageRating = ()=>{
    let sumRating = 0;
    for (let i=0; i<listComment.length; i++){
      ratingArray[listComment[i].rating]++;
      sumRating += listComment[i].rating;
    }
    return sumRating/listComment.length;
  }

  const caculatePercentStar = (score)=>{
    return (ratingArray[score]/listComment.length)*100;
  }

  const postReview = async (rating, comment, bookId)=>{
    const data = {
      "rating": rating,
      "comment": comment
    };
    await axios.post(`http://localhost:8090/api/users/review/${userId}/${bookId}`,
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

  const handleSetquantity=(value)=>{
    if (value < 1) return;
    setBuyQuantity(value);
  }
  const handleSubmitReview = () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    postReview(rating, comment, 4);
    var newRatingComment = {
      user_id:userId,
      rating: rating,
      user_name: "Nguyen quang",
      review: comment,
    }
    setListComment([...listComment, newRatingComment])
    setIsOpenDialog(false);
    setRating(0);
    setComment("");
  };
  if (bookDetail == undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar/>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {
            <img
              src={bookDetail.image}
              alt="Bach"
              className="w-80 rounded shadow-lg"
            />
          }
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-4">
          { 
            <h1 className="text-2xl font-bold text-gray-900">
              {bookDetail.title}
            </h1>
          }
          <p className="text-gray-700">
            Author: { <span className="font-semibold">{bookDetail.author}</span>}
          </p>


            <div className="text-2xl font-bold text-green-600">
              {(parseFloat(bookDetail.price_discounted)).toLocaleString(undefined,
              )}₫ 
              <span className="text-base line-through text-gray-500 ml-2">
                {(parseFloat(bookDetail.price_original)).toLocaleString(undefined,
              )}₫</span>
              <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded ml-2">
                {Math.round( (parseFloat(bookDetail.price_original) - parseFloat(bookDetail.price_discounted))*100
                  /parseFloat(bookDetail.price_original) )} %
              </span>
            </div>
          

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded px-2 py-1">
              <button className="p-1" onClick={()=>handleSetquantity(buyQuantity-1)}>
                <Minus size={16} />
              </button>
              <span className="mx-5">{buyQuantity}</span>
              <button className="p-1" onClick={()=>handleSetquantity(buyQuantity +1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Description and Details */}
      <div className="max-w-5xl w-full mt-12 flex flex-col md:flex-row gap-8">
        {/* Description */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Description</h2>
          {
            <p className="mb-4">
              {bookDetail.description}
            </p>
          }
         
        </div>

        {/* Detailed Info */}
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Detail</h2>
          <div className="border rounded-lg p-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Author</span>
              <span className="font-semibold">{bookDetail.author}</span>
            </div>
            <div className="flex justify-between">
              <span>Translator</span>
              <span className="font-semibold">{bookDetail.translator}</span>
            </div>
            <div className="flex justify-between">
              <span>Publisher</span>
              <span className="font-semibold">{bookDetail.publisher}</span>
            </div>
            <div className="flex justify-between">
              <span>Dimensions</span>
              <span className="font-semibold">{bookDetail.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span>Pages</span>
              <span className="font-semibold">{bookDetail.pages}</span>
            </div>
            <div className="flex justify-between">
              <span>Publish year</span>
              <span className="font-semibold">{bookDetail.created_at}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="max-w-5xl w-full mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4">User rating</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="text-5xl font-bold">{caculateAverageRating().toFixed(1)}<span className="text-2xl">/5</span></div>
            <p className="text-sm text-gray-500 mt-1">({listComment.length} rating)</p>
          </div>

          <div className="w-full md:w-2/3 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="w-12 text-sm text-gray-700">{star} star</span>
                <div className=" h-2 bg-gray-200 rounded mx-6 w-[30rem]">
                  <div className={`h-full bg-yellow-400 rounded w-[${(caculatePercentStar(star)*30/100).toFixed(0)}rem]`} />
                </div>
                <span className="text-sm text-gray-600">{caculatePercentStar(star).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          {/* Add comment button  */}
          <div className="mt-6 md:mt-0">
            <button onClick={() => setIsOpenDialog(true)} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              <Pen size={16} className="mr-2" /> Viết đánh giá
            </button>
          </div>

          {/* Comment dilog */}
          <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold mb-4">Your Feedback</Dialog.Title>

                {/* Star Rating */}
                <div className="flex space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                      key={num}
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(num)}
                      className={`w-6 h-6 cursor-pointer transition-colors ${
                        (hoverRating || rating) >= num ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Textarea */}
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsOpenDialog(false)}
                    className="px-4 py-2 text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

        </div>

        {/* User Comments */}
        <div className="max-w-5xl w-full mt-12">
          <h2 className="text-xl font-semibold text-green-700 mb-4">User feedback</h2>
          <div className="space-y-6">
            {listComment.map((comment)=>
               <div className="border p-4 rounded-lg shadow-sm">
               <div className="flex items-center justify-between mb-2">
                 <span className="font-semibold">{comment.user_name}</span>
                 <span className="text-sm text-gray-500">{Moment(comment.created_at).format('YYYY-MM-D, HH:mm')}</span>
               </div>
               <div className="flex items-center text-yellow-500 mb-2">
                 {Array.from({length: comment.rating}).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
               </div>
               <p className="text-gray-700">
                 {comment.review}
               </p>
             </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetail;
