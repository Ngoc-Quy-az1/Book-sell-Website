import Navbar from "../Navbar/Navbar";
import { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from 'js.cookie';


const BookCategoryList = () => {
  const userId = Cookies.get('userId');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const category = ["Giáo dục", "Kinh tế", "Văn học", "Tiểu thuyết", "Thiếu nhi"];
  const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
  const [totalPage, setTotalPage] = useState(1)
  const [bookList, setBooklist] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1)
  useEffect( () => {
    getBookPage();
  }, []);

  const getBookPage = async ()=>{
    await axios.get('http://localhost:8090/api/books/GetAllPaginated',{
      headers:auth,
    })
    .then((response) => {
        setBooklist(response.data.content);
        setTotalPage(response.data.totalPages);
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
        headers:auth,
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

  const addToCart = async (userId, bookId)=>{
    let data = {
      "userId": userId,
      "bookId": bookId,
      "quantity":1,
    };
    await axios.post('http://localhost:8090/api/cart/add',
      data,
      {
        headers:auth,
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error.response.data);
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
                
              )}₫ 
              <span className="text-base line-through text-gray-500 ml-2">
                {(parseFloat(book.price_original)).toLocaleString(undefined,
               
              )}₫</span>
              <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded ml-2">
                {Math.round( (parseFloat(book.price_original) - parseFloat(book.price_discounted))*100
                  /parseFloat(book.price_original) )} %
              </span>
              
              <button onClick={()=>{
                addToCart(userId, book.id);
              }} 
              className="bg-red-500 text-white px-2 py-2 rounded-xl hover:bg-red-600">
                Add to cart
              </button>
      

            </div>
              
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2 text-gray-600">
            <button disabled={1 === 1} onClick={() => {}} className="px-2">
              &#x2039;
            </button>
            {[...Array(totalPage)].map((page, index) => (
              <button
                key={index}
                onClick = { async ()=>{
                  await onPageChange(index);
                  setSelectedPage(page);
                }}
                className={`px-3 py-1 rounded-full border ${selectedPage === (index+1)  ? 'text-green-600 border-green-600' : ''}`}
              >
                {index+1}
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
