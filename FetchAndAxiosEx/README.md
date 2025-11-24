# CRUD Users Management App

Ứng dụng quản lý Users sử dụng Vite + React + Axios

## Tính năng

- ✅ **Read**: Hiển thị bảng users với ID, Tên, Email, Điện thoại, Thành phố
- ✅ **Create**: Form popup để thêm user mới
- ✅ **Update/Edit**: Form popup để chỉnh sửa user
- ✅ **Delete**: Xóa user với xác nhận
- ✅ **Search**: Tìm kiếm users theo tên (real-time)
- ✅ **Pagination**: Phân trang với điều hướng

## Yêu cầu kỹ thuật

- ✅ Sử dụng **Axios** để gọi API
- ✅ Sử dụng **async/await** (không dùng `.then()`)
- ✅ Cập nhật UI thủ công sau POST/PUT/DELETE
- ✅ Xử lý lỗi với thông báo rõ ràng
- ✅ UI responsive, hỗ trợ mobile

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở chế độ development:
```bash
npm run dev
```

3. Build ứng dụng cho production:
```bash
npm run build
```

4. Preview build:
```bash
npm run preview
```

## Cấu trúc dự án

```
FetchAndAxiosEx/
├── src/
│   ├── components/
│   │   ├── UserTable.jsx      # Component hiển thị bảng users
│   │   ├── UserForm.jsx        # Component form Create/Update
│   │   └── Pagination.jsx      # Component phân trang
│   ├── services/
│   │   └── api.js              # Service API sử dụng Axios
│   ├── App.jsx                 # Component chính
│   ├── App.css                 # CSS cho App component
│   ├── main.jsx                # Entry point
│   └── index.css               # CSS global
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Cấu hình Vite
└── README.md                   # Tài liệu
```

## API

Ứng dụng sử dụng API từ: `https://jsonplaceholder.typicode.com/users`

## Công nghệ sử dụng

- **Vite**: Build tool và dev server
- **React 19**: UI framework
- **Axios**: HTTP client
- **CSS3**: Styling với animations
