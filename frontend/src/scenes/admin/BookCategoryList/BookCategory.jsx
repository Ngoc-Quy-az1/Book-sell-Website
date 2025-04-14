import React, { useState,useEffect } from "react";
import axios from 'axios';
import UserPopup from "./UserPopup";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";


const AdminBookCategoryList = () => {
  const countries = ["Việt Nam", "Trung Quốc", "Nhật Bản", "Pháp", "Đức", "Hàn Quốc", "Italy", "Mỹ"];
  const categories = ["Nuôi dạy con ", "D"
  ];
  const sortMethod = ["Default", "Newest", "Lowest Cost", "Highest Cost"]
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [userPopup, setUserPopup] = React.useState(false);
    const [sortRule, setSortRule] = useState("Lowest Cost");
    const [selectedSortRule, setSelectedSortRule] = useState("Lowest Cost");
    const [selectedCategory, setSelectedCategory] = useState("Nuôi dạy con ");
    const [bookList, setBookList] = useState([]);
    const [selectedBook, setSelectedBook] = useState();
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
    const getDetail = async (id)=>{
      await axios.get("http://localhost:8090/api/books/"+id)
      .then((response) => {
          setSelectedBook(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
    const handleUserPopup = (link) => {
      setUserPopup(!userPopup);
  
    };
  const handleSortRule = (rule) => {
    setSortRule(rule);
    setSelectedSortRule(rule);
  }
  const handleManage = (book) => {
    getDetail(book.id);
    console.log(book);
    handleUserPopup();
  }
  const handleChange = (event) => {
    setChecked(event.target.checked);
    console.log(event.target)
  }
  const handleSelectedCategory = (key) => {
    console.log(key);
    setSelectedCategory(categories.map((category, index) =>
    index === key
    ? {...category, checked: !category.checked}
    : category 
    ))
  }
  const sort = (a,b) => {
    if (sortRule==0) return a.title>b.title ? 1 : -1;
    if (sortRule==1) return a.id<b.id ? 1 : -1;
    if (sortRule==2) return a.price_discounted>b.price_discounted ? 1 : -1;
    if (sortRule==3) return a.price_discounted<b.price_discounted ? 1 : -1;
  }
  const BookList = () => {
    return bookList.filter((book) => book.category==selectedCategory).toSorted(sort)
    .map((book) => (
      <div id={book.id} key={book.title} className="border p-3 rounded-lg shadow-sm" onClick={() => handleManage(book)}>
        <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
        <h3 className="font-bold text-sm mb-1">{book.title}</h3>
        <div className="text-green-600 font-semibold">{book.price_discounted.toLocaleString()}.000đ</div>
        <div className="text-gray-400 line-through text-sm">{book.price_original.toLocaleString()}.000đ</div>
      </div>
    ))
  }
  return (
    <div className="flex p-5 pl-40 pr-40">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        <h2 className="font-bold text-lg mb-2 text-green-600">Thể loại</h2>
        {categories.map((category) => (
            <input type="radio" key={category} className="flex items-center mb-2"  onChange={handleChange}/>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        <UserPopup book={selectedBook} userPopup={userPopup} handleUserPopup={handleUserPopup}/>
        {/* Sorting Options */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(0)} style={(selectedSortRule==0) ? {backgroundColor : colors.greenAccent[600]} : {}}>Mặc định</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(1)} style={(selectedSortRule==1) ? {backgroundColor : colors.greenAccent[600]} : {}}>Sách mới</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(2)} style={(selectedSortRule==2) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá thấp - cao</button>
          <button className="px-3 py-1 border rounded" onClick={() => handleSortRule(3)} style={(selectedSortRule==3) ? {backgroundColor : colors.greenAccent[600]} : {}}>Giá cao - thấp</button>
        </div>
        
        {/* Book List */}
        <div className="grid grid-cols-4 gap-4">
          <BookList/>
        </div>
      </div>
    </div>
  );
};

export default AdminBookCategoryList;
