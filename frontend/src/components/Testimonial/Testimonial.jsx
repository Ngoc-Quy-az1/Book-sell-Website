import React from "react";
import Slider from "react-slick";

const testimonialData = [
  {
    id: 1,
    name: "Nguyen Long",
    text: "Great web site with so much feature. Really love this site.",
    img: "https://static.tuoitre.vn/tto/i/s626/2016/01/05/e06f1709.jpg",
  },
  {
    id: 1,
    name: "Truong Thi Linh",
    text: "I really like this website, it have every book I need!",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUKxgwC4lalRuuViy9H0Ycj-NeQc21dZyhww&s",
  },
  {
    id: 1,
    name: "Nguyen Hoang Thai",
    text: "Beautyfull website, it help me so much with my study.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkXLjCUDWFcnPPjxVFYFkNjAEMXvsMiBXCRw&s",
  },
  {
    id: 1,
    name: "Messi",
    text: "Tôi có thể đọc sách mãi mãi mà không thấy chán.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjnQxzm9Wn19Ah8TlBN7ClBUMmlnD9G2QZ3w&s",
  },
  {
    id: 1,
    name: "Ronaldo",
    text: "Tôi ghi rất nhiều bàn nhưng không bàn nào tuyệt bằng bàn bạc về sách :V",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzlblcuSk43o3SyuUBVkyLyEtyNfdv0VfWfA&s",
  },

];

const Testimonial = () => {
  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500" className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-[800px] mx-auto">
            <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-3">
              What customers say
            </p>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Testimonial</h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Here is what our beloved customers say about this website.
            </p>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-duration="500"
            className="max-w-[1200px] mx-auto"
          >
            <Slider {...settings}>
              {testimonialData.map((data) => {
                return (
                  <div key={data.id} className="px-4 py-6">
                    <div className="group flex flex-col gap-6 shadow-xl hover:shadow-2xl py-10 px-8 rounded-2xl dark:bg-gray-800 bg-white/80 backdrop-blur-sm relative transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-6">
                        <img
                          className="rounded-full w-24 h-24 object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-110"
                          src={data.img}
                          alt={data.name}
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {data.name}
                          </h2>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        "{data.text}"
                      </p>
                      <div className="absolute top-6 right-6 text-gray-200 dark:text-gray-700 text-8xl font-serif transform rotate-12 transition-transform duration-300 group-hover:rotate-0">
                        ,,
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
