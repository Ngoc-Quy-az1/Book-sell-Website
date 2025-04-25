import Navbar from "../Navbar/Navbar";
import { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';

const BookCategoryList = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const category = ["Giáo dục", "Kinh tế", "Văn học", "Tiểu thuyết", "Thiếu nhi"];
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [bookList, setBooklist] = useState([]);
  useEffect( () => {
    getBookPage();
  }, []);
  const getBookPage = async ()=>{
    await axios.get('http://localhost:8090/api/books/GetAllPaginated',{
      headers:auth,
    })
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
      <div className="flex flex-col w-1/4 pr-5 border-r">
        <h2 className="font-bold text-lg mb-2 text-green-600">Thể loại</h2>
        {category.map((country) => (
          <div key={country} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            <span>{country}</span>
          </div>
        ))}
        <h2 className="font-bold text-lg mb-2 text-green-600 mt-8">xắp xếp</h2>
        <button className=" items-start max-w-xl bg-red-500 text-white  py-2 rounded-xl hover:bg-red-600 mb-8">Cao đến thấp</button>
        <button className="bg-red-500 text-white  py-2 rounded-xl hover:bg-red-600">Thấp đến cao</button>
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        
        {/* Sorting Options */}
        {/* <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 border rounded bg-gray-200">Mặc định</button>
          <button className="px-3 py-1 border rounded">Sách mới</button>
          <button className="px-3 py-1 border rounded">Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded">Giá cao - thấp</button>
        </div> */}
        
        {/* Book List */}
        <div className="grid grid-cols-4 gap-4">
          {bookList.map((book) => (
            <div key={book.title} className="border p-3 rounded-lg shadow-sm">
              <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
              <h1 className="font-bold text-xl mb-1">{book.title}</h1>

              <div className="text-xl font-bold text-green-600">
              {(parseFloat(book.price_discounted)).toLocaleString(undefined,
                {'minimumFractionDigits':3}
              )}₫ 
              <span className="text-base line-through text-gray-500 ml-2">
                {(parseFloat(book.price_original)).toLocaleString(undefined,
              {'minimumFractionDigits':3}  
              )}₫</span>
              <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded ml-2">
                {Math.round( (parseFloat(book.price_original) - parseFloat(book.price_discounted))*100
                  /parseFloat(book.price_original) )} %
              </span>

            </div>
              
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2 text-gray-600">
            <button disabled={1 === 1} onClick={() => {}} className="px-2">
              &#x2039;
            </button>
            {[1, 2, 3].map((page, index) => (
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
