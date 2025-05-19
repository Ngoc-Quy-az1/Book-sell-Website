import React, { useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
import {
  Box,
  IconButton,
  Collapse,
  useMediaQuery
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import BookPopup from "./BookPopup";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import Cookies from "js.cookie";
import "../../../CheckToken";

const AdminBookList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:768px)");

  const [bookPopup, setBookPopup] = useState(false);
  const [sortRule, setSortRule] = useState("Tasc");
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedSortRule, setSelectedSortRule] = useState("Lowest Cost");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState();
  const [value, setValue] = useState([0, 1000000]);
  const [tValue, setTValue] = useState([0, 1000000]);
  const [bookList, setBookList] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getBookCategory();
  }, []);

  useEffect(() => {
    getBookPage();
  }, [value, page, selectedCategory, search, sortRule]);

  useEffect(() => {
    getDetail();
  }, []);

  const getBookCategory = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/books/AllTypeCategories`, {
        headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getBookPage = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/books/GetAllPaginatedFull`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sort: sortRule,
          minPrice: value[0],
          maxPrice: value[1],
          page: page - 1,
          size: "20",
          category: selectedCategory,
          search: search
        })
      });
      const data = await response.json();
      setBookList(data.content);
      setMaxPage(data.totalPages);
    } catch (error) {
      console.error('Error fetching book list:', error);
    }
  };

  const getDetail = async () => {
    if (!selectedBook) return;
    try {
      const response = await fetch(`${apiUrl}/api/books/` + selectedBook.id, {
        headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
      });
      const data = await response.json();
      setSelectedBook(data);
    } catch (error) {
      console.error('Error fetching book detail:', error);
    }
  };

  const handleSortRule = (rule) => {
    setPage(1);
    setSortRule(rule);
    setSelectedSortRule(rule);
  };

  const handleCategories = (event) => {
    setPage(1);
    const id = event.target.id;
    const index = selectedCategory.indexOf(id);
    if (event.target.checked) {
      setSelectedCategory([...selectedCategory, id]);
    } else {
      setSelectedCategory([
        ...selectedCategory.slice(0, index),
        ...selectedCategory.slice(index + 1),
      ]);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const handleSliderChange = (e, newTValue) => setTValue(newTValue);
  const handleSliderCommit = (e, newValue) => {
    setValue(newValue);
    setPage(1);
  };

  const handleMinSlider = (e) => {
    const val = Number(e.target.value || 0);
    setValue([val, value[1]]);
    setTValue([val, tValue[1]]);
  };

  const handleMaxSlider = (e) => {
    const val = Number(e.target.value || 0);
    setValue([value[0], val]);
    setTValue([tValue[0], val]);
  };

  const handlePage = (int) => setPage(int);
  const pageIndex = () =>
    Array.from({ length: 5 }, (_, i) => page - 2 + i).filter(
      (val) => val > 0 && val <= maxPage
    );

  const handleManage = (book) => {
    setSelectedBook(book);
    setBookPopup(true);
  };

  const handleDelete = (book) => setDeleted([...deleted, book]);

  const BookList = () =>
    bookList.map((book) => (
      <button
        id={book.id}
        key={book.title}
        className="border p-3 rounded-lg shadow-sm"
        onClick={() => handleManage(book)}
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-100 object-cover mb-2"
        />
        <h3 className="font-bold text-sm mb-1">{book.title}</h3>
        <div className="text-green-600 font-semibold">
          {book.price_discounted.toLocaleString()}đ
        </div>
        <div className="text-gray-400 line-through text-sm">
          {book.price_original.toLocaleString()}đ
        </div>
      </button>
    ));

  return (
    <div className="flex flex-col lg:flex-row lg:pl-10">
      {/* Mobile Toggle Button */}
      <div className={`${isMobile ? "w-full sticky top-10 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200" 
                                  : "w-1/4"} -z-1  p-3 shadow-md `} 
      style={{backgroundColor:colors.primary[400]}}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-green-600">Filter</h2>
          <IconButton onClick={() => setFiltersOpen(!filtersOpen)}>
            <MenuIcon />
          </IconButton>
        </div>
      <Collapse in={!isMobile || filtersOpen} timeout="auto" unmountOnExit>
        <div className={`${isMobile ? "w-full mb-4" : "w-full pr-5 border-r"} transition-all duration-300`}>
          {/* Search */}
          <Box
            display="flex"
            backgroundColor={colors.primary[900]}
            borderRadius="3px"
            className="mb-4"
          >
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" onChange={handleSearch} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Categories */}
          {["Phi hư cấu", "Hư cấu", "Thiếu nhi"].map((label, i) => (
            <div key={label}>
              <h2 className="font-bold text-lg mb-2 text-green-600">{label}</h2>
              {categories.slice(i * 10, i === 2 ? 25 : (i + 1) * 10).map((category) => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    id={category}
                    onChange={handleCategories}
                  />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Price Slider */}
          <h2 className="font-bold text-lg mb-2 text-green-600">Giá</h2>
          <Slider
            value={tValue}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommit}
            min={0}
            step={10000}
            max={1000000}
            valueLabelDisplay="auto"
          />
          <div className="flex items-center mb-2 justify-center">
            Minimun Values:
            <input
              value={value[0]}
              onChange={handleMinSlider}
              className="ml-2 p-1 w-full rounded"
              style={{backgroundColor:colors.primary[900]}}
            />
          </div>
          <div className="flex items-center mb-2 justify-center">
            Maximum value:
            <input
              value={value[1]}
              onChange={handleMaxSlider}
              className="ml-2 p-1 w-full rounded"
              style={{backgroundColor:colors.primary[900]}}
            />
          </div>
        </div>
      </Collapse>
  </div>

      {/* Book Popup */}
      <BookPopup
        book={selectedBook}
        bookPopup={bookPopup}
        handleBookPopup={() => setBookPopup(!bookPopup)}
        handleDelete={handleDelete}
      />

      {/* Main Content */}
      <div className="w-full lg:w-3/4 pt-10 lg:pl-4">
        {/* Sort Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "Tasc", label: "A - Z" },
            { key: "Tdesc", label: "Z - A" },
            { key: "asc", label: "Giá thấp - cao" },
            { key: "desc", label: "Giá cao - thấp" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className="px-3 py-1 border rounded"
              onClick={() => handleSortRule(key)}
              style={
                selectedSortRule === key
                  ? { backgroundColor: colors.greenAccent[600] }
                  : {}
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <BookList />
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button disabled={page === 1} onClick={() => handlePage(page - 1)} className="px-2">
            &#x2039;
          </button>
          {pageIndex().map((index) => (
            <button
              key={index}
              onClick={() => handlePage(index)}
              className={`px-3 py-1 rounded-full border`}
              style={index === page ? { backgroundColor: colors.greenAccent[700] } : {}}
            >
              {index}
            </button>
          ))}
          <button disabled={page === maxPage} onClick={() => handlePage(page + 1)} className="px-2">
            &#x203A;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookList;
