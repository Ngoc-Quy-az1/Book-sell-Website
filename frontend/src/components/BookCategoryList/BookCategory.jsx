import { useState } from "react";
import Book1 from "../BookCategoryList/ExampleImage/book1.jpg";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Book3 from "../BookCategoryList/ExampleImage/book3.png";
import Book4 from "../BookCategoryList/ExampleImage/book4.jpg";
import Book5 from "../BookCategoryList/ExampleImage/book5.png";
import Book6 from "../BookCategoryList/ExampleImage/book6.png";
import Book7 from "../BookCategoryList/ExampleImage/book7.png";
import Book8 from "../BookCategoryList/ExampleImage/book8.png";
import Book9 from "../BookCategoryList/ExampleImage/book9.png";
import Navbar from "../Navbar/Navbar";

const books = [
  { title: "Bạch Dạ Hành", price: 199750, oldPrice: 235000, image: Book1 },
  { title: "Đôi Mắt Của Mona", price: 287300, oldPrice: 338000, image: Book2 },
  { title: "Cuốn Sách Hoang Dã", price: 115600, oldPrice: 136000, image: Book3 },
  { title: "Những Thủ Lĩnh Triển Cát", price: 152150, oldPrice: 179000, image: Book4 },
  { title: "Mùa thu của cây dương", price: 199750, oldPrice: 235000, image: Book5 },
  { title: "Những đứa con của nửa đêm", price: 287300, oldPrice: 338000, image: Book6 },
  { title: "Chuyện con mèo dạy hải âu bay", price: 115600, oldPrice: 136000, image: Book7 },
  { title: "Những ngọn gió hua tát", price: 152150, oldPrice: 179000, image: Book8 },
  { title: "Kafka bên bờ biển", price: 152150, oldPrice: 179000, image: Book9 },
];

const BookCategoryList = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const countries = ["Việt Nam", "Trung Quốc", "Nhật Bản", "Pháp", "Đức", "Hàn Quốc", "Italy", "Mỹ"];

  return (
    <div className="flex p-5 pl-40 pr-40">
      {/* Sidebar */}
      <div className="w-1/4 pr-5 border-r">
        <h2 className="font-bold text-lg mb-2 text-green-600">Quốc gia</h2>
        {countries.map((country) => (
          <div key={country} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            <span>{country}</span>
          </div>
        ))}
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
          {books.map((book) => (
            <div key={book.title} className="border p-3 rounded-lg shadow-sm">
              <img src={book.image} alt={book.title} className="w-full h-100 object-cover mb-2" />
              <h3 className="font-bold text-sm mb-1">{book.title}</h3>
              <div className="text-green-600 font-semibold">{book.price.toLocaleString()}đ</div>
              <div className="text-gray-400 line-through text-sm">{book.oldPrice.toLocaleString()}đ</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCategoryList;
