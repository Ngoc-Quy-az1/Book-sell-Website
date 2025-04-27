import React, { useState,useEffect } from "react";
import axios from 'axios';
import UserPopup from "./BookPopup";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import Cookies from "js.cookie"
const config = {'Authorization': `Bearer ${Cookies.get('authToken')}`}
console.log(Cookies.get('authToken'))

const AdminBookCategoryList = () => {
  const sortMethod = ["Default", "Newest", "Lowest Cost", "Highest Cost"]
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [userPopup, setUserPopup] = React.useState(false);
    const [sortRule, setSortRule] = useState("Lowest Cost");
    const [categories, setCategories] = useState([]);
    useEffect( () => {
      getBookCategory();
    }, [])
    const [selectedSortRule, setSelectedSortRule] = useState("Lowest Cost");
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [url, setUrl] = useState("http://localhost:8090/api/books/GetAllPaginated");
    const [page, setPage] = useState(1);
    const handlePage = (int) => {
      setPage(page + int);
    }
    const [maxPage, setMaxPage] = useState(1);
    const findMaxPage = (int) => {
      setMaxPage(Math.floor((int+19)/20));
    }
    const [bookList, setBookList] = useState([]);
    useEffect( () => {
      getBookPage();
    }, []);
    const [selectedBook, setSelectedBook] = useState();
    useEffect (() => {
      getDetail()
    },[])
    const getBookPage = async ()=>{
      await fetch(url,{ headers: config})
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setBookList(response.content);
        console.log(response.content);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
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
    
    const handleUserPopup = (link) => {
      setUserPopup(!userPopup);
  
    };
  const handleSort = (url) => {
    setSortRule(url);
    getBookPage();
  }
  const handleManage = (book) => {
    setSelectedBook(book);
    handleUserPopup();
  }
  const handleChange = (event) => {
    const index = selectedCategory.indexOf(event.target.id);
    (event.target.checked) ? setSelectedCategory([...selectedCategory, event.target.id])
    : setSelectedCategory([...selectedCategory.slice(0,index),...selectedCategory.slice(index+1)])
  }
  const sort = (a,b) => {
    if (sortRule==0) return a.title>b.title ? 1 : -1;
    if (sortRule==1) return a.id<b.id ? 1 : -1;
    if (sortRule==2) return a.price_discounted>b.price_discounted ? 1 : -1;
    if (sortRule==3) return a.price_discounted<b.price_discounted ? 1 : -1;
  }
  const BookList = () => {
    const newList = bookList.filter((book) => selectedCategory.includes(book.category) || selectedCategory.length == 0);
    findMaxPage(newList.length);
    return newList.map((book) => (
      <button id={book.id} key={book.title} className="border p-3 rounded-lg shadow-sm" onClick={() => handleManage(book)}>
        <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
        <h3 className="font-bold text-sm mb-1">{book.title}</h3>
        <div className="text-green-600 font-semibold">{book.price_discounted.toLocaleString()}.000đ</div>
        <div className="text-gray-400 line-through text-sm">{book.price_original.toLocaleString()}.000đ</div>
      </button>
    ))
  }
  const pageIndex = () => {
    let list = Array.from({length:5}, (x,i) => page-2+i)
    return list.filter((val) => val>0 && val<=maxPage)
  }
  return (
    <div className="flex p-5 pl-10">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        <h2 className="font-bold text-lg mb-2 text-green-600">Thể loại</h2>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" id={category} onChange={handleChange}/>
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        <UserPopup book={selectedBook} userPopup={userPopup} handleUserPopup={handleUserPopup}/>
        {/* Sorting Options */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 border rounded" onClick={() => handleSort("http://localhost:8090/api/books/GetAllPaginated")} style={(selectedSortRule==1) ? {backgroundColor : colors.greenAccent[600]} : {}}>Sách mới</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSort("http://localhost:8090/api/books/GetAllPaginated/sortedAcs")} style={(selectedSortRule==2) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSort("http://localhost:8090/api/books/GetAllPaginated/sortedDesc")} style={(selectedSortRule==3) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className={`grid grid-cols-4 gap-4`}>
          <BookList/>
          
        </div>
        <div className="flex justify-center mt-6 space-x-2">
            <button disabled={page === 1} onClick={() => {handlePage(-1)}} className="px-2">
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
            <button disabled={page === maxPage} onClick={() => {handlePage(1)}} className="px-2">
              &#x203A;
            </button>
          </div>
      </div>
    </div>
  );
};

export default AdminBookCategoryList;
