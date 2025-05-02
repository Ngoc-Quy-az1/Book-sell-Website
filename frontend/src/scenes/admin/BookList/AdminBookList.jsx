import React, { useState,useEffect } from "react";
import Slider from '@mui/material/Slider';
import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import BookPopup from "./BookPopup";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import Cookies from "js.cookie";

//Lấy Cookie 
const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
console.log(Cookies.get('authToken'))

const AdminBookList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [bookPopup, setBookPopup] = React.useState(false);
  const [sortRule, setSortRule] = useState("Lowest Cost");
  const [deleted, setDeleted] = useState([]);
//Lấy tất cả thể loại
  const [categories, setCategories] = useState([]);
  useEffect( () => {
    getBookCategory();
  }, [])
  
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
//Quy tắc sắp xếp đang được chọn    
  const [selectedSortRule, setSelectedSortRule] = useState("Lowest Cost");
  
  const handleSortRule = (rule) => {
    setSortRule(rule);
    setSelectedSortRule(rule);
  }
//Thể loại đang được chọn 
  const [selectedCategory, setSelectedCategory] = useState([]);
  const handleChange = (event) => {
    const index = selectedCategory.indexOf(event.target.id);
    (event.target.checked) ? setSelectedCategory([...selectedCategory, event.target.id])
    : setSelectedCategory([...selectedCategory.slice(0,index),...selectedCategory.slice(index+1)])
  }
//Số trang hiện tại 
  const [page, setPage] = useState(1);
  const handlePage = (int) => {
    setPage(int);
  }
  const getBookPage = async ()=>{
    await fetch('http://localhost:8090/api/books/all',{ headers: config})
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setBookList(response);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  const pageIndex = () => {
    let list = Array.from({length:5}, (x,i) => page-2+i)
    return list.filter((val) => val>0 && val<=maxPage)
  }
//Số trang tối đa 
  const [maxPage, setMaxPage] = useState(1);
  const findMaxPage = (int) => {
    setMaxPage(Math.floor((int+19)/20));
    setPage(Math.max(1,Math.min(page, Math.floor((int+19)/20))))
  }
//Danh sách tất cả sách 
  const [bookList, setBookList] = useState([]);
  useEffect( () => {
    getBookPage();
  }, []);
//Sách được click vào để xem thông tin chi tiết     
  const [selectedBook, setSelectedBook] = useState();
  useEffect (() => {
    getDetail()
  },[])
  
  const getDetail = async ()=>{
    if (selectedBook!=null) await fetch("http://localhost:8090/api/books/"+selectedBook.id, {headers : config})
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setSelectedBook(response);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
//Quản lí sách 
  const handleManage = (book) => {
    setSelectedBook(book);
    handleBookPopup();
  }
  const handleBookPopup = (link) => {
    setBookPopup(!bookPopup);
  };
  const handleDelete = (book) => {
    setDeleted([...deleted,book])
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
//Tìm theo tên     
  const [search, setSearch] = useState("")
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
//Sắp xếp 
  const sort = (a,b) => {
    if (sortRule==0) return a.id<b.id ? 1 : -1;
    if (sortRule==1) return a.title>b.title ? 1 : -1;
    if (sortRule==2) return a.price_discounted>b.price_discounted ? 1 : -1;
    if (sortRule==3) return a.price_discounted<b.price_discounted ? 1 : -1;
  }
//Danh sách sau khi lọc 
  const BookList = () => {
    const newList = bookList.filter((book) => (selectedCategory.includes(book.category) || selectedCategory.length == 0) 
      && (!deleted.includes(book)) 
      && (book.price_discounted<value[1]) && (book.price_discounted>value[0])
      && (book.title.includes(search.toUpperCase())));
    findMaxPage(newList.length);
    return newList.toSorted(sort).slice((page-1)*20,page*20).map((book) => (
      <button id={book.id} key={book.title} className="border p-3 rounded-lg shadow-sm" onClick={() => handleManage(book)}>
        <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
        <h3 className="font-bold text-sm mb-1">{book.title}</h3>
        <div className="text-green-600 font-semibold">{book.price_discounted.toLocaleString()}đ</div>
        <div className="text-gray-400 line-through text-sm">{book.price_original.toLocaleString()}đ</div>
      </button>
    ))
  }
  return (
    <div className="flex p-5 pl-10">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        {/*Search*/}
        <Box
          display="flex"
          backgroundColor={colors.primary[900]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" onChange={handleSearch}/>
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/*Thể loại */}
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
            color={colors.primary[100]}
            valueLabelDisplay="auto"
          />
        <div className="flex items-center mb-2 justify-center"> Giá tối thiểu: 
          <input value={value[0]} onChange={handleMinSlider} style={{marginLeft:"5px", backgroundColor:colors.primary[900]}}></input>
        </div>
        <div className="flex items-center mb-2 justify-center"> Giá tối đa:  
          <input value={value[1]} onChange={handleMaxSlider} style={{marginLeft:"10px", backgroundColor:colors.primary[900]}}></input>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        <BookPopup book={selectedBook} bookPopup={bookPopup} handleBookPopup={handleBookPopup} handleDelete={handleDelete}/>
        {/* Sorting Options */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(0)} style={(selectedSortRule==0) ? {backgroundColor : colors.greenAccent[600]} : {}}>Mặc định</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(1)} style={(selectedSortRule==1) ? {backgroundColor : colors.greenAccent[600]} : {}}>Theo tên</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(2)} style={(selectedSortRule==2) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(3)} style={(selectedSortRule==3) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className={`grid grid-cols-4 gap-4`}>
          <BookList/>
          
        </div>
        <div className="flex justify-center mt-6 space-x-2">
            <button disabled={page === 1} onClick={() => {handlePage(page-1)}} className="px-2">
              &#x2039;
            </button>
            {pageIndex().map((index) => (
              <button
                key={index}
                onClick = { ()=>{handlePage(index)}}
                className={`px-3 py-1 rounded-full border`}
                style={index==page ? {backgroundColor:colors.greenAccent[700]}: {}}
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

export default AdminBookList;
