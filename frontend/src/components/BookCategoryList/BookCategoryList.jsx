import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from "js.cookie";
import { Slider } from "@mui/material";

const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
console.log(Cookies.get('authToken'))
const BookCategoryList = () => {
  //Lấy tất cả thể loại
  const [categories, setCategories] = useState([]);
  useEffect( () => {
    getBookCategory();
  }, [])

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
    await axios.get('http://localhost:8090/api/books/GetAllPaginated')
    .then((response) => {
        setBookList(response.data.content);
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
        setBookList(response.data.content);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  return (
    <div className="flex p-5 pl-40 pr-40">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
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
          <input value={value[0]} className="search-input" onChange={handleMinSlider} style={{marginLeft:"5px", }}></input>
        </div>
        <div className="flex items-center mb-2 justify-center"> Giá tối đa:  
          <input value={value[1]} className="search-input" onChange={handleMaxSlider} style={{marginLeft:"10px", }}></input>
        </div>
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
              <h1 className="font-bold text-xl mb-1">{book.title}</h1>

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
