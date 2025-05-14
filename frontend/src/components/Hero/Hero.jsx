import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Vector from "../../assets/website/blue-pattern.png";
import { Link } from "react-router-dom";


const Hero = ({ handleOrderPopup }) => {
  const [imageId, setImageId] = useState('https://bizweb.dktcdn.net/100/363/455/products/an-dam-khong-nuoc-mat.jpg?v=1695032717550');
  const [title, setTitle] = useState("ĂN DẶM KHÔNG NƯỚC MẮT");
  const [booklist, setBooklist] = useState([]);
  const [bookId, setBookId] = useState('3');
  const [description, setDescription] = useState(
    "Thông tin chi tiết sản phẩm đang được cập nhật"
  );
  const [author, setAuthor] = useState('Nguyễn Thị Ninh')

  useEffect( () => {
    getBookLink();
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (!booklist || booklist.length === 0) return;
    let currentIndex = booklist.findIndex(b => b.image === imageId);
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % booklist.length;
      const book = booklist[currentIndex];
      setImageId(book.image);
      setTitle(book.title);
      setDescription(book.description);
      setAuthor(book.author);
      setBookId(book.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [booklist, imageId]);

  const getBookLink = async ()=>{
    const apiUrl = import.meta.env.VITE_API_URL;
    await axios.get(`${apiUrl}/api/books/GetAllPaginated?page=0&size=3`)
    .then((response) => {
        setBooklist(response.data.content);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  const bgImage = {
    backgroundImage: `url(${Vector})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    // height: "100%",
    width: "100%",
  };

  return (
      <div
        className="min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200"
     
      >
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* text content section */}
            <div
              data-aos-once="true"
              className="flex flex-col justify-center gap-8 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1"
            >
              <h1
                data-aos="zoom-out"
                data-aos-duration="500"
                data-aos-once="true"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold"
              >
                {title}
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-primary text-right text-xl to-secondary">
                  {author}
                </p>{" "}
              </h1>
              <p
                data-aos="slide-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="text-xl line-clamp-3"
                
              >
                {description}
              </p>
              <div>
                 <Link to={"../book-detail/"+bookId}>
                  <button
                    onClick={handleOrderPopup}
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                  >
                    Order Now
                  </button>
                </Link>
              </div>
            </div>
            {/* Image section */}
            <div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-1 sm:order-2 ">
              <div className="h-[300px] sm:h-[450px] overflow-hidden flex justify-center items-center">
                <img
                  data-aos="zoom-in"
                  data-aos-once="true"
                  src={imageId}
                  alt="biryani img"
                  className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 object-contain mx-auto"
                />
              </div>
              <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute -bottom-[40px] lg:-right-1 bg-white rounded-full">
                {booklist.map((book, idx) => (
                  <img
                    data-aos="zoom-in"
                    data-aos-once="true"
                    src={book.image}
                    onClick={() => {
                      // Khi click vào thumbnail, chuyển ngay và reset interval
                      setImageId(
                        book.image
                      );
                      setTitle(book.title);
                      setDescription(book.description);
                      setAuthor(book.author);
                      setBookId(book.id);
                    }}
                    alt="biryani img"
                    className="max-w-[100px] h-[100px] object-contain inline-block hover:scale-110 duration-200"
                    key={book.id || idx}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Hero;
