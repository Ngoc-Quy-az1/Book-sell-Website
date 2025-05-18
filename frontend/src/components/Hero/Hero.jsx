import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Vector from "../../assets/website/blue-pattern.png";
import bg1 from "../../assets/bg1.jpg"; // Thêm dòng này
import { Link } from "react-router-dom";


const Hero = ({ handleOrderPopup }) => {
  const [imageId, setImageId] = useState('https://bizweb.dktcdn.net/100/363/455/products/an-dam-khong-nuoc-mat.jpg?v=1695032717550');
  const [title, setTitle] = useState("ĂN DẶM KHÔNG NƯỚC MẮT");
  const [booklist, setBooklist] = useState([]);
  const [bookId, setBookId] = useState('3');
  const [description, setDescription] = useState(
    "Cha mẹ nào cũng muốn con cái mình thành đạt, vươn tới tận cùng tiềm năng của chúng. Nhưng liệu có một phương pháp nuôi dạy con nào đảm bảo tạo ra những con người thành đạt, thông minh, tự quyết và có khả năng thay đổi thế giới không? Cuốn sách này sẽ cho bạn thấy là có. Kết hợp các nghiên cứu khoa học mới nhất về tâm lý học phát triển, sự phát triển não bộ và khả năng học tập của trẻ em, cùng với những câu chuyện đời thực của các cá nhân nổi bật, Đại công thức minh họa cách mà phương pháp nuôi dạy con có chiến lược định hình nên những con người xuất sắc và thú vị. Không cần phải giàu có hay xuất chúng, các bậc cha mẹ của những người này giúp họ tỏa sáng chỉ bằng nỗ lực tận tâm và một chiến lược nuôi dạy con hiệu quả. Tám vai trò mà cha mẹ cần đảm đương trong đời con làm nên một Đại công thức dẫn con tới một cuộc sống hạnh phúc, thành đạt, với mọi tiềm năng được hiện thực hóa."
  );
  const [author, setAuthor] = useState('Nguyễn Thị Ninh')

  // Lấy theme từ localStorage (do navbar quản lý)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const handleStorage = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
        className="relative min-h-[550px] sm:min-h-[650px] flex justify-center items-center dark:text-white duration-200"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay làm tối ảnh: dark mode 60%, light mode 0.1 */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-60"
          style={{
            background: "black",
            //opacity: theme === "dark" ? 0.6 : 0.1
          }}
        ></div>
        {/* Nền mờ để hiển thị rõ chữ trên desktop, không hiện trên mobile */}
        <div
          className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none hidden sm:flex"
        >
          <div
            className="w-full max-w-7xl mx-auto rounded-2xl backdrop-blur-md p-6 sm:p-12 bg-[#ffffff4d] dark:bg-[#1118274d]"
            style={{
              //backgroundColor: theme === "dark" ? "rgba(17,24,39,0.3)" : "rgba(255,255,255,0.3)",
              minHeight: "600px",
              maxWidth: "1200px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            <div className="container pb-8 sm:pb-0 relative z-10">
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
        </div>
        {/* Hiển thị sách và nội dung luôn luôn trên mobile */}
        <div className="sm:hidden w-full max-w-7xl mx-auto p-4 relative z-10">
          <div className="container pb-8 sm:pb-0">
            <div className="grid grid-cols-1">
              {/* text content section */}
              <div
                data-aos-once="true"
                className="flex flex-col justify-center gap-8 pt-12 text-center order-2"
              >
                <h1
                  data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-4xl font-bold"
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
                  className="text-lg line-clamp-3"
                >
                  {description}
                </p>
                <div>
                  <Link to={"../book-detail/" + bookId}>
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
              <div className="min-h-[300px] flex justify-center items-center relative order-1 mt-8">
                <div className="h-[300px] overflow-hidden flex justify-center items-center">
                  <img
                    data-aos="zoom-in"
                    data-aos-once="true"
                    src={imageId}
                    alt="biryani img"
                    className="w-[220px] h-[220px] object-contain mx-auto"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {booklist.map((book, idx) => (
                    <img
                      data-aos="zoom-in"
                      data-aos-once="true"
                      src={book.image}
                      onClick={() => {
                        setImageId(book.image);
                        setTitle(book.title);
                        setDescription(book.description);
                        setAuthor(book.author);
                        setBookId(book.id);
                      }}
                      alt="biryani img"
                      className="max-w-[60px] h-[60px] object-contain inline-block hover:scale-110 duration-200"
                      key={book.id || idx}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Đảm bảo ChatButton luôn hiển thị trên cùng */}
        <div className="fixed z-[100] bottom-5 right-5 pointer-events-auto">
          {/* Nếu bạn import ChatButton ở đây, render nó tại đây */}
          {/* <ChatButton /> */}
        </div>
      </div>
  );
};

export default Hero;
