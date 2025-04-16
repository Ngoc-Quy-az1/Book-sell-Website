import { useState,useEffect } from "react";
import axios from 'axios';
import Navbar from "../Navbar/Navbar";

const BookCategoryList = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const countries = ["Việt Nam", "Trung Quốc", "Nhật Bản", "Pháp", "Đức", "Hàn Quốc", "Italy", "Mỹ"];
  const [bookList, setBooklist] = useState([]);
  useEffect( () => {
    getBookPage();
  }, []);
  const getBookPage = async ()=>{
    await axios.get('http://localhost:8090/api/books/GetAllPaginated')
    .then((response) => {
        setBooklist(response.data.content);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  const onPageChange = async (page)=> {
    await axios
    .get(
      'http://localhost:8090/api/books/GetAllPaginated',
      {
        params: {
          page: page,
        }
      }
    )
    .then((response) => {
        setBooklist(response.data.content);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  return (
    <div className="flex p-5 pl-40 pr-40">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        <h2 className="font-bold text-lg mb-2 text-green-600">Quốc gia</h2>
        {countries.map((country) => (
          <div key={country} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            <span>{country}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        
        {/* Sorting Options */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 border rounded bg-gray-200">Mặc định</button>
          <button className="px-3 py-1 border rounded">Sách mới</button>
          <button className="px-3 py-1 border rounded">Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded">Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className="grid grid-cols-4 gap-4">
          {bookList.map((book) => (
            <div key={book.title} className="border p-3 rounded-lg shadow-sm">
              <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
              <h3 className="font-bold text-sm mb-1">{book.title}</h3>
              <div className="text-green-600 font-semibold">{book.price_discounted.toLocaleString()}000đ</div>
              <div className="text-gray-400 line-through text-sm">{book.price_original.toLocaleString()}000đ</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2 text-gray-600">
            <button disabled={1 === 1} onClick={() => {}} className="px-2">
              &#x2039;
            </button>
            {[1, 2,].map((page, index) => (
              <button
                key={index}
                onClick = { ()=>{}}
                className={`px-3 py-1 rounded-full border ${1 === page ? 'text-green-600 border-green-600' : ''}`}
              >
                {page}
              </button>
            ))}
            <button disabled={3 === 3} onClick={() =>{}} className="px-2">
              &#x203A;
            </button>
          </div>
      </div>
    </div>
  );
};

export default BookCategoryList;
