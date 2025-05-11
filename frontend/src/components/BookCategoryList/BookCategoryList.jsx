import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from "js.cookie";
import { FaBars } from 'react-icons/fa';
import { Slider } from "@mui/material";

const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
const userId = Cookies.get('userId');
const auth = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
console.log(Cookies.get('authToken'))
const BookCategoryList = () => {
  const [totalPage, setTotalPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  //Lấy tất cả thể loại
  const [categories, setCategories] = useState([]);
  useEffect( () => {
    getBookCategory();
  }, [])

const [sidebarOpen, setSidebarOpen] = useState(false);

//Thể loại đang được chọn 
  const [selectedCategory, setSelectedCategory] = useState([]);
  const handleChange = (event) => {
    const index = selectedCategory.indexOf(event.target.id);
    (event.target.checked) ? setSelectedCategory([...selectedCategory, event.target.id])
    : setSelectedCategory([...selectedCategory.slice(0,index),...selectedCategory.slice(index+1)])
  }
//Slider xét giá
  const [value, setValue] = React.useState([0, 1000000]);

  const handleSlider = (event, newValue) => {
    setValue(newValue);
  };
  const handleMinSlider = (event) => {
    setValue([event.target.value === '' ? 0 : Number(event.target.value),value[1]]);
  };
  const handleMaxSlider = (event) => {
    setValue([value[0],event.target.value === '' ? 0 : Number(event.target.value)]);
  };
  
  const getBookCategory = async ()=>{
    await fetch('http://localhost:8090/api/books/AllTypeCategories', {headers: config})
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setCategories(response); 
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  const [bookList, setBookList] = useState([]);
  useEffect( () => {
    getBookPage();
  }, []);

  const getBookPage = async ()=>{
    await axios.get('http://localhost:8090/api/books/GetAllPaginated',{
      headers:auth,
    })
    .then((response) => {
        setBookList(response.data.content);
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
        setBookList(response.data.content);
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
    <div className="flex flex-col md:flex-row p-5">
      {/* Menu button */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">
          <FaBars />
        </button>
      </div>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div  className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white p-5 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/4 md:max-w-none md:block md:border-r`}>
         <div className="flex justify-end mb-4 md:hidden">
          <button onClick={() => setSidebarOpen(false)} className="text-red-500 text-lg font-bold">✕</button>
        </div>
        
        <h2 className="font-bold text-lg mb-2 text-green-600">Phi hư cấu</h2>
        {categories.slice(0,10).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleChange}/>
            <span>{category}</span>
          </div>
        ))}
        <h2 className="font-bold text-lg mb-2 text-green-600">Hư cấu </h2>
        {categories.slice(10,21).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleChange}/>
            <span>{category}</span>
          </div>
        ))}
        <h2 className="font-bold text-lg mb-2 text-green-600">Thiếu nhi</h2>
        {categories.slice(21,25).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleChange}/>
            <span>{category}</span>
          </div>
        ))}
        
        {/*Slider giá */}
        <h2 className="font-bold text-lg mb-2 text-green-600">Giá</h2>
          <Slider
            getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
            value={value}
            onChange={handleSlider}
            min={0}
            step={10000}
            max={1000000}
            valueLabelDisplay="auto"
          />
        <div className="flex items-center mb-2 justify-center"> Giá tối thiểu: 
          <input value={value[0]} className="search-input ml-2" onChange={handleMinSlider} style={{marginLeft:"5px", }}></input>
        </div>
        <div className="flex items-center mb-2 justify-center"> Giá tối đa:  
          <input value={value[1]} className="search-input" onChange={handleMaxSlider} style={{marginLeft:"10px", }}></input>
        </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookList.map((book) => (
            <div key={book.title} className="border p-3 rounded-lg shadow-sm">
              <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
              <h1 className="font-bold text-base md:text-xl mb-1">{book.title}</h1>

              <div className="text-xl font-bold text-green-600">
                {(parseFloat(book.price_discounted)).toLocaleString(undefined,
                  
                )}₫ 
              </div>
              <div>
                <span className="text-base line-through text-gray-500 ml-2">
                  {(parseFloat(book.price_original)).toLocaleString(undefined,
                )}₫</span>
                <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded ml-2">
                  {Math.round( (parseFloat(book.price_original) - parseFloat(book.price_discounted))*100
                    /parseFloat(book.price_original) )} %
                </span>
                
              </div>
              <button onClick={()=>{
                  addToCart(userId, book.id);
                }} 
                className="bg-red-500 text-white px-2 py-2 rounded-xl hover:bg-red-600 mt-4 w-full">
                  Add to cart
                </button>
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
