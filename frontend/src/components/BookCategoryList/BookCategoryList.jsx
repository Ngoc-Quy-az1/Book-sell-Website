import React, { useState,useEffect } from "react";
import axios from 'axios';
import Cookies from "js.cookie";
import { Slider, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { CheckToken } from "../../Service";

const userId = Cookies.get('userId');
const BookCategoryList = () => {
  const [sortRule, setSortRule] = useState("Tasc");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [value, setValue] = React.useState([0, 1000000]);
  const [tValue, setTValue] = React.useState([0, 1000000]);
  const [maxPage, setMaxPage] = useState(1);
  const [selectedSortRule, setSelectedSortRule] = useState("Tasc");
  const [page, setPage] = useState(1);
  const [bookList, setBookList] = useState([]);
  const [search, setSearch] = useState("")
  //Lấy tất cả thể loại
  const [categories, setCategories] = useState([]);
  useEffect( () => {
    getBookCategory();
  }, [])
  useEffect( () => {
    getBookList();
    console.log(value,page, selectedCategory, search, sortRule)
  }, [value, page, selectedCategory, search, sortRule]);
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
    await fetch('http://localhost:8090/api/books/AllTypeCategories', )
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
    await fetch('http://localhost:8090/api/books/GetAllPaginatedFull',
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
    await axios.post('http://localhost:8090/api/cart/add',
      data,
      {
        headers:{'Authorization': `Bearer ${CheckToken()}`},
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error.response.data);
    });
  }
  
    
    const pageIndex = () => {
      let list = Array.from({length:5}, (x,i) => page-2+i)
      return list.filter((val) => val>0 && val<=maxPage)
    }
  //Danh sách sau khi lọc 
    const BookList = () => {
      return bookList.map((book) => (
        <div id={book.id} key={book.title} className="border p-3 rounded-lg shadow-sm">
          <div>
          <Link to={"../book-detail/"+book.id}>
            <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
            <h3 className="font-bold text-sm mb-1">{book.title}</h3>
            <div className="text-green-600 font-semibold">{book.price_discounted.toLocaleString()}đ</div>
            <div className="text-gray-400 line-through text-sm">{book.price_original.toLocaleString()}đ</div>
            
          </Link>
          </div>
          <div className="flex items-center justify-center">
          <button onClick={()=>{
            addToCart(userId, book.id);
          }} 
          className="bg-red-500 text-white px-2 py-2 rounded-xl hover:bg-red-600 mt-4">
            Add to cart
          </button></div>
        </div>
      ))
    }
    
  //Số trang hiện tại 
    const handlePage = (int) => {
      setPage(int);
    }
    
  return (
    <div className="flex p-5 pl-40 pr-40">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        {/*Search*/}
        <Box
          display="flex"
          borderRadius="3px"
        >
          <input className="search-input" placeholder="Search" onChange={handleSearch}/>
          <IconButton type="button" sx={{ pb: 2 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <h2 className="font-bold text-lg mb-2 text-green-600">Phi hư cấu</h2>
        {categories.slice(0,10).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleCategories}/>
            <span>{category}</span>
          </div>
        ))}
        <h2 className="font-bold text-lg mb-2 text-green-600">Hư cấu </h2>
        {categories.slice(10,21).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleCategories}/>
            <span>{category}</span>
          </div>
        ))}
        <h2 className="font-bold text-lg mb-2 text-green-600">Thiếu nhi</h2>
        {categories.slice(21,25).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleCategories}/>
            <span>{category}</span>
          </div>
        ))}
        
        {/*Slider giá */}
        <h2 className="font-bold text-lg mb-2 text-green-600">Giá</h2>
          <Slider
            getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
            value={tValue}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommit}
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
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule("Tasc")} style={(selectedSortRule=="Tasc") ? {backgroundColor : "green"} : {}}>A - Z</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule("Tdesc")} style={(selectedSortRule=="Tdesc") ? {backgroundColor : "green"} : {}}>Z - A</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule("asc")} style={(selectedSortRule=="asc") ? {backgroundColor : "green"} : {}}>Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule("desc")} style={(selectedSortRule=="desc") ? {backgroundColor : "green"} : {}}>Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className="grid grid-cols-4 gap-4">
          <BookList/>
        </div>

        <div className="flex justify-center mt-6 space-x-2 text-gray-600">
            <button disabled={page === 1} onClick={() => {handlePage(page-1)}} className="px-2">
              &#x2039;
            </button>
            {pageIndex().map((index) => (
              <button
                key={index}
                onClick = { ()=>{handlePage(index)}}
                className={`px-3 py-1 rounded-full border `}
              >
                {index}
              </button>
            ))}
            <button disabled={page === maxPage} onClick={() => {handlePage(page+1)}} className="px-2">
              &#x203A;
            </button>
          </div>
      </div>
    </div>
  );
};

export default BookCategoryList;
