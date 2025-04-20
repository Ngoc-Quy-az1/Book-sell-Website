import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Vector from "../../assets/website/blue-pattern.png";


const Hero = ({ handleOrderPopup }) => {
  const [imageId, setImageId] = useState('https://bizweb.dktcdn.net/100/363/455/products/phattriennangluccamxucxahoigiu.jpg?v=1710306260350');
  const [title, setTitle] = useState("PHÁT TRIỂN NĂNG LỰC CẢM XÚC XÃ HỘI");
  const [booklist, setBooklist] = useState([]);
  const [description, setDescription] = useState(
    "Từ thời Hy Lạp cổ đại, Plato đã đề xuất một chương trình giáo dục toàn diện; đào tạo cân bằng thể chất, hội họa, toán, khoa học, nhân cách, đạo đức chứ không thiên lệch về IQ.\nThế kỷ XX, giáo dục cảm xúc xã hội hiện đại được khởi xướng lại ở nước Mỹ, tạo nên những thành công đáng chú ý cho sức khỏe tinh thần các học trò lẫn nhà trường và xã hội sau này. Và hiện nay, giáo dục cảm xúc xã hội đã trở nên quan trọng và quen thuộc ở nhiều nước trên thế giới."
  );

  useEffect( () => {
    getBookLink();
  }, []);

  const getBookLink = async ()=>{
    await axios.get('http://localhost:8090/api/books/GetAllPaginated?page=0&size=3')
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
    <>
      <div
        className="min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200"
        style={bgImage}
      >
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* text content section */}
           
              <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute -bottom-[40px] lg:-right-1 bg-white rounded-full">
                {booklist.map((book) => (
                  <img
                    data-aos="zoom-in"
                    data-aos-once="true"
                    src={book.image}
                    onClick={() => {
                      setImageId(
                        book.image
                      );
                      setTitle(book.title);
                      setDescription(book.description);
                    }}
                    alt="biryani img"
                    className="max-w-[100px] h-[100px] object-contain inline-block hover:scale-110 duration-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
