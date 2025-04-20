import React from "react";
import { Minus, Plus, Pen } from "lucide-react";
import Book2 from "../BookCategoryList/ExampleImage/book2.jpg";
import Navbar from "../Navbar/Navbar";

const BookDetail = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar/>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <img
            src={Book2}
            alt="Bach"
            className="w-80 rounded shadow-lg"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            ĐÔI MẮT CỦA MONA
          </h1>
          <p className="text-gray-700">
            Tác giả: <span className="font-semibold">THOMAS SCHLESSER</span>
          </p>

          <div className="text-2xl font-bold text-green-600">
            287.300₫ <span className="text-base line-through text-gray-500 ml-2">338.000₫</span>
            <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded ml-2">
              -15%
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded px-2 py-1">
              <button className="p-1">
                <Minus size={16} />
              </button>
              <span className="mx-5">1</span>
              <button className="p-1">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Description and Details */}
      <div className="max-w-5xl w-full mt-12 flex flex-col md:flex-row gap-8">
        {/* Description */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Giới thiệu sách</h2>
          <p className="mb-4">
            <strong>Đôi mắt của Mona</strong> là tiểu thuyết đầu tay của Thomas Schlesser, và đã bán được bản quyền cho 25 quốc gia trên thế giới trước cả khi được xuất bản tại Pháp.
          </p>
          <p className="mb-4">
            <strong>Năm mươi hai tuần:</strong> đó là khoảng thời gian còn lại để Mona khám phá toàn bộ vẻ đẹp của thế giới. Đó cũng là khoảng thời gian mà ông ngoại Mona, một người uyên bác và phóng khoáng, dành ra để giúp cô bé mở lòng với các tác phẩm nghệ thuật, trước khi cô bé có thể vĩnh viễn mất đi thị lực. Cùng nhau, hai ông cháu sẽ đi khắp các bảo tàng Louvre, Orsay và Beaubourg. Cùng nhau, hai ông cháu sẽ xúc động, băn khoăn, ngây ngất trước những bức tranh, những pho tượng, những tác phẩm sắp đặt...
          </p>
          <p>
            Mượn ánh mắt của Botticelli, Vermeer, Goya, Courbet, Claudel, Kahlo, Basquiat hay van Gogh, Mona sẽ khám phá sức mạnh của nghệ thuật đồng thời học hỏi về nghi ngờ, u sầu, tranh đấu, yêu thương... một kho tàng cảm xúc phong phú của con người.
          </p>
        </div>

        {/* Detailed Info */}
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Thông tin chi tiết</h2>
          <div className="border rounded-lg p-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Tác giả</span>
              <span className="font-semibold">THOMAS SCHLESSER</span>
            </div>
            <div className="flex justify-between">
              <span>Dịch giả</span>
              <span className="font-semibold">CHÂU ANH</span>
            </div>
            <div className="flex justify-between">
              <span>Nhà xuất bản</span>
              <span className="font-semibold">Phụ Nữ</span>
            </div>
            <div className="flex justify-between">
              <span>Kích thước</span>
              <span className="font-semibold">15.5x 24cm</span>
            </div>
            <div className="flex justify-between">
              <span>Số trang</span>
              <span className="font-semibold">484</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày phát hành</span>
              <span className="font-semibold">2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="max-w-5xl w-full mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="text-5xl font-bold">0<span className="text-2xl">/5</span></div>
            <div className="flex mt-2 text-gray-300">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.564-.955L10 0l2.949 5.955 6.564.955-4.757 4.635 1.122 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">(0 đánh giá)</p>
          </div>

          <div className="w-full md:w-2/3 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="w-12 text-sm text-gray-700">{star} sao</span>
                <div className="flex-1 h-2 bg-gray-200 rounded mx-2">
                  <div className="h-full bg-gray-400 rounded w-0" />
                </div>
                <span className="text-sm text-gray-600">0%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-0">
            <button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              <Pen size={16} className="mr-2" /> Viết đánh giá
            </button>
          </div>
          

        </div>

        {/* User Comments */}
        <div className="max-w-5xl w-full mt-12">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Đánh giá từ người dùng</h2>
          <div className="space-y-6">
            <div className="border p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">nguoi dung</span>
                <span className="text-sm text-gray-500">2025-01-12 23:54</span>
              </div>
              {/* <div className="flex items-center text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div> */}
              <p className="text-gray-700">
                Gói hơi sợ xíu, truyện nhìn mới, giấy cứng trắng, ít bụi, bìa cứng đều, thank nhiều nha 🐥
              </p>
            </div>
            <div className="border p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">barrymarkham</span>
                <span className="text-sm text-gray-500">2025-02-10 14:07</span>
              </div>
              {/* <div className="flex items-center text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div> */}
              <p className="text-gray-700">
                Mua combo chủ yếu để đọc chứ không sưu tầm pk + mua đợt sale nên mua được em nó với giá khá hợp lý. Đóng gói hàng rất kĩ, một lớp chống sốc lớn cộng thêm lớp xốp bong bóng nên hàng đến tay không bị dập.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetail;
