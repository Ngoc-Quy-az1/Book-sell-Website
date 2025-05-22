import React, { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from "js.cookie";
import { FaBars } from 'react-icons/fa';
import { Slider, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "../../CheckToken";

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import LoginPopup from "../LoginPopup/LoginPopup";

const userId = Cookies.get('userId');
const BookCategoryList = () => {
  const [sortRule, setSortRule] = useState("Tasc");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [value, setValue] = React.useState([0, 1000000]);
  const [tValue, setTValue] = React.useState([0, 1000000]);
  const [maxPage, setMaxPage] = useState(1);
  const [selectedSortRule, setSelectedSortRule] = useState("Tasc");
  const [loginPopup, setLoginPopup] = React.useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [page, setPage] = useState(1);
  const [bookList, setBookList] = useState([]);
  const [search, setSearch] = useState("")
  const apiUrl = import.meta.env.VITE_API_URL;
  //Lấy tất cả thể loại
  const [categories, setCategories] = useState([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  useEffect( () => {
    getBookCategory();
  }, [])
 const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect( () => {
    getBookList();
    //console.log(value,page, selectedCategory, search, sortRule)
  }, [value, page, selectedCategory, search, sortRule]);
  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };
//Loc sach 
  const handleCategories = (event) => {
    const index = selectedCategory.indexOf(event.target.id);
    (event.target.checked) ? setSelectedCategory([...selectedCategory, event.target.id])
    : setSelectedCategory([...selectedCategory.slice(0,index),...selectedCategory.slice(index+1)])
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleSortRule = (rule) => {
    setPage(1);
    setSortRule(rule);
    setSelectedSortRule(rule);
  }
//Slider xét giá
  const handleSliderChange = (e, newTValue) => {
    setTValue(newTValue);
  };
  const handleSliderCommit = (e, newValue) => {
    setValue(newValue);
    setPage(1);
  }
  const handleMinSlider = (event) => {
    setValue([event.target.value === '' ? 0 : Number(event.target.value),value[1]]);
    setTValue([event.target.value === '' ? 0 : Number(event.target.value),tValue[1]]);
  };
  const handleMaxSlider = (event) => {
    setValue([value[0],event.target.value === '' ? 0 : Number(event.target.value)]);
    setTValue([tValue[0],event.target.value === '' ? 0 : Number(event.target.value)]);
  };
  
  const getBookCategory = async ()=>{
    await fetch(`${apiUrl}/api/books/AllTypeCategories`, )
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
  const getBookList = async ()=>{
    await fetch(`${apiUrl}/api/books/GetAllPaginatedFull`,
      { method:"POST",
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({"sort": sortRule ,
          "minPrice" : value[0],
          "maxPrice" : value[1],
          "page" : page - 1,
          "size" : "20",
          "category" : selectedCategory,
          "search" : search})
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setBookList(response.content);
      setMaxPage(response.totalPages);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
//Thêm vào giỏ hàng
  const addToCart = async (userId, bookId)=>{
    let data = {
      "userId": userId,
      "bookId": bookId,
      "quantity":1,
    };
    await axios.post(`${apiUrl}/api/cart/add`,
      data,
      {
        headers:{'Authorization': `Bearer ${Cookies.get('authToken')}`},
      }
    )
    .then((response) => {
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 2000);
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
          Thêm vào giỏ hàng thành công
        </div>,
        { position: "top-right", style: { background: 'linear-gradient(90deg, #bbf7d0 0%, #86efac 100%)', color: '#166534', fontWeight: 'bold' } }
      );
    })
    .catch((error) => {
      console.error('Error fetching data:', error.response.data);
      toast.error(
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
          {error.response.data}
        </div>,
        { position: "top-right", style: { background: 'linear-gradient(90deg, #bbf7d0 0%, #86efac 100%)', color: '#166534', fontWeight: 'bold' } }
      );
    });
  }
  
    
    const pageIndex = () => {
      let list = Array.from({length:5}, (x,i) => page-2+i)
      return list.filter((val) => val>0 && val<=maxPage)
    }
  //Danh sách sau khi lọc 
    const BookList = () => {
      return bookList.map((book) => (
        <div
          id={book.id}
          key={book.title}
          className="group border border-gray-100 dark:border-gray-700 p-2 sm:p-3 md:p-4 rounded-xl shadow-lg flex flex-col justify-between h-full transition-all duration-300 transform bg-white dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:border-green-400 dark:hover:border-green-500 cursor-pointer relative"
        >
          <div className="flex flex-col items-center">
            <Link to={"../book-detail/" + book.id} className="block w-full">
              <div className="relative w-full flex justify-center mb-2">
              <img 
                src={book.image} 
                alt={book.title} 
                  className="w-full aspect-[3/4] sm:aspect-[3/4] md:h-56 object-cover rounded-lg mb-2 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-xl border border-gray-100 dark:border-gray-700"
                  style={{willChange: 'transform', background: '#f3f4f6', maxHeight: '260px'}}
              />
              {/* Discount percent badge */}
              {book.price_original > book.price_discounted && (
                  <div className="absolute top-2 left-2 bg-gradient-to-br from-red-600 via-yellow-400 to-orange-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg z-30 border-2 border-white dark:border-gray-800 animate-pulse drop-shadow-lg tracking-wider" style={{letterSpacing: '1px'}}>
                  -{Math.round(100 - (book.price_discounted / book.price_original) * 100)}%
                </div>
              )}
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 text-center text-gray-900 dark:text-white uppercase leading-tight line-clamp-2 min-h-[48px]">{book.title}</h3>
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="text-green-600 dark:text-green-400 font-extrabold text-xl sm:text-2xl">{book.price_discounted.toLocaleString()}đ</span>
                <span className="text-gray-400 dark:text-gray-500 line-through text-sm sm:text-base">{book.price_original.toLocaleString()}đ</span>
              </div>
              <div className="text-sm font-bold text-orange-500 dark:text-orange-400 text-center mb-2">Đã bán: {book.stock ?? 0}</div>
              <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1 mb-2 text-center tracking-wide uppercase italic">{book.author}</div>
            </Link>
          </div>
          {/* Hover action buttons */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto z-10">
            <button
              onClick={
                () => {
                  Cookies.get('authToken')
                  ? addToCart(userId, book.id)
                  : handleLoginPopup();
                }
              }
              className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-xl transition-all duration-200 border-2 border-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 text-2xl hover:scale-110 active:scale-95"
              title="Mua ngay"
            >
              <svg xmlns='http://www.w3.org/2000/svg' className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 3h13m-9 4a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" /></svg>
            </button>
            <button
              onClick={() => window.location.href = `/book-detail/${book.id}`}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 text-green-700 dark:text-green-400 shadow-xl transition-all duration-200 border-2 border-green-600 dark:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 text-2xl hover:scale-110 active:scale-95"
              title="Xem chi tiết"
            >
              <svg xmlns='http://www.w3.org/2000/svg' className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" /></svg>
            </button>
          </div>
        </div>
      ))
    }
    
  //Số trang hiện tại 
    const handlePage = (int) => {
      setPage(int);
    }
    
  return (
    <div className="flex flex-col md:flex-row p-5 gap-6 bg-white dark:bg-gray-900 transition-colors">
      {/* Menu button */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-3xl p-2 rounded-full border-2 border-green-400 dark:border-green-500 bg-white dark:bg-gray-800 shadow hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-600 dark:hover:border-green-400 transition-all">
          <FaBars className="text-gray-800 dark:text-white" />
        </button>
      </div>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white dark:bg-gray-800 p-6 z-50 transform transition-transform duration-300 ease-in-out shadow-xl
       ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
       md:relative md:translate-x-0 md:w-1/4 md:max-w-none md:block md:rounded-lg md:border md:border-gray-200 dark:md:border-gray-700 md:shadow-lg md:mr-4`}>
         <div className="flex justify-end mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(false)} className="text-red-500 dark:text-red-400 text-2xl font-bold hover:text-red-600 dark:hover:text-red-300 transition-colors p-2 rounded-full border-2 border-red-300 dark:border-red-500 bg-white dark:bg-gray-800 shadow hover:bg-red-50 dark:hover:bg-gray-700">✕</button>
        </div>
         <Box display="flex" borderRadius="8px" className="mb-6">
          <input
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-full 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
              text-base bg-white dark:bg-gray-800 
              text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400
              transition-colors duration-200"
            placeholder="Tìm kiếm sách..."
            onChange={handleSearch}
            style={{
              borderRight: 'none',
              fontSize: '1rem',
              height: '44px',
            }}
          />
          <IconButton
            type="button"
            sx={{
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '0 9999px 9999px 0',
              minWidth: '44px',
              height: '44px',
              boxShadow: 'none',
              border: '1px solid #34d399',
              borderLeft: 'none',
              '&:hover': {
                backgroundColor: '#059669',
                boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)'
              },
              padding: 0,
              marginLeft: '-2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SearchIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Box>

        <div className="space-y-6">
          <div className="category-section">
            <h2 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Phi hư cấu</h2>
            <div className="space-y-2">
        {categories.slice(0,10).map((category) => (
                <div key={category} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:bg-gray-700" 
                    id={category} 
                    onChange={handleCategories}
                  />
                  <label htmlFor={category} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">{category}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h2 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Hư cấu</h2>
            <div className="space-y-2">
              {categories.slice(10,21).map((category) => (
                <div key={category} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:bg-gray-700" 
                    id={category} 
                    onChange={handleCategories}
                  />
                  <label htmlFor={category} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">{category}</label>
          </div>
        ))}
            </div>
          </div>

          <div className="category-section">
            <h2 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Thiếu nhi</h2>
            <div className="space-y-2">
              {categories.slice(21,25).map((category) => (
                <div key={category} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:bg-gray-700" 
                    id={category} 
                    onChange={handleCategories}
                  />
                  <label htmlFor={category} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">{category}</label>
          </div>
        ))}
            </div>
          </div>
        
        {/*Slider giá */}
          <div className="price-section">
            <h2 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Khoảng giá</h2>
            <div className="px-2">
          <Slider
            getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
            value={tValue}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommit}
            min={0}
            step={10000}
            max={1000000}
            valueLabelDisplay="auto"
                sx={{
                  color: '#10B981',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgba(16, 185, 129, 0.16)'
                    }
                  }
                }}
          />
              <div className="flex items-center justify-between mt-4 space-x-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Giá tối thiểu</label>
                  <input 
                    value={value[0]} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700" 
                    onChange={handleMinSlider}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Giá tối đa</label>
                  <input 
                    value={value[1]} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700" 
                    onChange={handleMaxSlider}
                  />
                </div>
              </div>
            </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Sorting Options */}
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur flex flex-wrap gap-2 mb-4 justify-center py-2 border-b border-gray-100 dark:border-gray-700">
          <button
            className={`px-3 py-1 rounded-md border font-semibold transition-all duration-200 text-sm sm:text-base focus:outline-none tracking-wide
              ${selectedSortRule=="Tasc" ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border-green-400 dark:border-green-500 hover:bg-green-50 dark:hover:bg-gray-600 hover:border-green-600'}`}
            onClick={() => handleSortRule("Tasc")}
          >A - Z</button>
          <button
            className={`px-3 py-1 rounded-md border font-semibold transition-all duration-200 text-sm sm:text-base focus:outline-none tracking-wide
              ${selectedSortRule=="Tdesc" ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border-green-400 dark:border-green-500 hover:bg-green-50 dark:hover:bg-gray-600 hover:border-green-600'}`}
            onClick={() => handleSortRule("Tdesc")}
          >Z - A</button>
          <button
            className={`px-3 py-1 rounded-md border font-semibold transition-all duration-200 text-sm sm:text-base focus:outline-none tracking-wide
              ${selectedSortRule=="asc" ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border-green-400 dark:border-green-500 hover:bg-green-50 dark:hover:bg-gray-600 hover:border-green-600'}`}
            onClick={() => handleSortRule("asc")}
          >Giá thấp - cao</button>
          <button
            className={`px-3 py-1 rounded-md border font-semibold transition-all duration-200 text-sm sm:text-base focus:outline-none tracking-wide
              ${selectedSortRule=="desc" ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border-green-400 dark:border-green-500 hover:bg-green-50 dark:hover:bg-gray-600 hover:border-green-600'}`}
            onClick={() => handleSortRule("desc")}
          >Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <BookList/>
        </div>

        <div className="flex justify-center mt-6 space-x-2 text-gray-600 dark:text-gray-400">
            <button disabled={page === 1} onClick={() => {handlePage(page-1)}} className="px-2">
              &#x2039;
            </button>
            {pageIndex().map((index) => (
              <button
                key={index}
                onClick = { ()=>{handlePage(index)}}
                className={`px-3 py-1 rounded-full border transition font-semibold ${
                  page === index 
                    ? 'bg-green-600 text-white border-green-600 shadow-lg scale-110' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-gray-600'
                }`}
              >
                {index}
              </button>
            ))}
            <button disabled={page === maxPage} onClick={() => {handlePage(page+1)}} className="px-2">
              &#x203A;
            </button>
          </div>
      </div>

      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={handleLoginPopup} />
    </div>
  );
};

export default BookCategoryList;
