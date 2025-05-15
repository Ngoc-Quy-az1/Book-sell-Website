# Website Bán Sách - Nhóm 31

## Giới thiệu dự án

Đây là dự án Website Bán Sách được phát triển bởi nhóm 31, môn học Công nghệ Web và dịch vụ trực tuyến, Đại học Bách Khoa Hà Nội. Website cung cấp các chức năng mua bán sách trực tuyến, quản lý đơn hàng, quản trị viên, chat hỗ trợ, thanh toán, đánh giá sách, sử dụng voucher giảm giá, v.v.

## Tính năng chính

- Đăng ký, đăng nhập, quên mật khẩu
- Tìm kiếm, lọc, xem chi tiết sách
- Thêm sách vào giỏ hàng, đặt hàng, thanh toán (QR, xu)
- Quản lý đơn hàng, lịch sử mua hàng
- Đánh giá, bình luận sách
- Quản trị viên: quản lý người dùng, sách, chat hỗ trợ
- Hệ thống voucher giảm giá, tích xu
- Chat trực tuyến với admin và cộng đồng

## Công nghệ sử dụng

- **Frontend:** ReactJS, TailwindCSS, Axios, React Router, MUI
- **Backend:** Java Spring Boot
- **Database:** MySQL
- **Khác:** JWT, Cookies, WebSocket (chat), Vite

## Hướng dẫn chạy dự án

1. **Clone dự án:**
   ```bash
   git clone https://github.com/Ngoc-Quy-az1/Book-sell-Website
   cd Book-sell-Website
   ```

2. **Cài đặt dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Cấu hình biến môi trường:**
   - Tạo file `.env` trong thư mục `frontend` với nội dung:
     ```
     VITE_API_URL=http://localhost:8090
     ```

4. **Chạy frontend:**
   ```bash
   npm run dev
   ```

5. **Chạy backend:**  
   (Làm theo hướng dẫn riêng của backend, ví dụ với Spring Boot: `mvn spring-boot:run`)

6. **Truy cập:**  
   Mở trình duyệt và vào địa chỉ [http://localhost:5173](http://localhost:5173)

## Thành viên nhóm 31

- **20225074** - Đặng Ngọc Quý
- **20225066** - Lê Xuân Phúc
- **20225067** - Nguyễn Hoàng Phúc
- **20183615** - Nguyễn Đức Thiều Quang

## Liên hệ

Mọi thắc mắc hoặc góp ý vui lòng liên hệ nhóm 31 hoặc giảng viên hướng dẫn.

---
