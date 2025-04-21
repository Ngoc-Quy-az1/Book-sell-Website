import React from "react";
import Book1 from "../../assets/books/book1.jpg";
import Book2 from "../../assets/books/book2.jpg";
import Book3 from "../../assets/books/book3.jpg";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";

const booksData = [
  {
    id: 1,
    img: Book1,
    title: "Who's there",
    rating: 5.0,
    author: "Someone",
  },
  {
    id: 2,
    img: Book2,
    title: "His Life",
    rating: 4.5,
    author: "John",
  },
  {
    id: 3,
    img: Book3,
    title: "Lost boys",
    rating: 4.7,
    author: "Lost Girl",
  },
  {
    id: 4,
    img: Book2,
    title: "His Life",
    rating: 4.4,
    author: "Someone",
  },
  {
    id: 5,
    img: Book1,
    title: "Who's There",
    rating: 4.5,
    author: "Someone",
  },
];
import { useState, useEffect } from "react";
import axios from 'axios';

// const booksData = [
//   {
//     id: 1,
//     img: Book1,
//     title: "Who's there",
//     rating: 5.0,
//     author: "Someone",
//   },
//   {
//     id: 2,
//     img: Book2,
//     title: "His Life",
//     rating: 4.5,
//     author: "John",
//   },
//   {
//     id: 3,
//     img: Book3,
//     title: "Lost boys",
//     rating: 4.7,
//     author: "Lost Girl",
//   },
//   {
//     id: 4,
//     img: Book2,
//     title: "His Life",
//     rating: 4.4,
//     author: "Someone",
//   },
//   {
//     id: 5,
//     img: Book1,
//     title: "Who's There",
//     rating: 4.5,
//     author: "Someone",
//   },
// ];

const change = () => {
  console.log("R")
  return (<Link to={"/books"}/>)
}
const Books = () => {
  const [booklist, setBooklist] = useState([]);
    useEffect( () => {
        getBookLink();
      }, []);
    const getBookLink = async ()=>{
      await axios.get('http://localhost:8090/api/books/GetAllPaginated?page=2&size=5')
      .then((response) => {
          setBooklist(response.data.content);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  return (
    <>
      <div className="mt-14 mb-12">
        <div className="container">
          {/* header */}
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Top Books for you
            </p>
            <h1 className="text-3xl font-bold">Top Books</h1>
            <p className="text-xs text-gray-400">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Perspiciatis delectus architecto error nesciunt,
            </p>
          </div>

          {/* Body section */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 flex-wrap">
              {/* Card */}
              {booklist.map((book ) => (
                <div key={book.id} className="div space-y-3">
                  <img
                    src={book.image}
                    alt=""
                    className="h-[220px] w-[200px] object-cover pl-12"
                  />
                  <div>
                    <h3 className="font-semibold line-clamp-3 text-align: center">{book.title}</h3>
                    <p className="text-sm text-gray-700">{book.author}</p>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to="/books">
              <button className="text-center mt-10 cursor-pointer  bg-primary text-white py-1 px-5 rounded-md" onClick={change}>
                View All Books
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;
