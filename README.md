# CNWeb

Bộ bài tập và ví dụ thực hành môn Công nghệ Web (CNWeb).

Mục tiêu: tập hợp các bài tập HTML/CSS/JS đơn giản và một ví dụ nhỏ bằng React để thực hành các khái niệm cơ bản về frontend.

## Cấu trúc dự án

Thư mục chính và mục đích:

- `exercise1/` — Các bài tập tĩnh (HTML/CSS/JS)

  - `ex1/` — Bài tập 1 (chỉ `index.html`)
  - `ex2/` — Bài tập 2 (`index.html`, `style.css`)
  - `ex3/` — Bài tập 3 (`index.html`, `script.js`, `style.css`)
  - `ex4/` — Bài tập 4 (`index.html`, `script.js`, `style.css`)
  - `ex5/` — Bài tập 5 (`index.html`, `script.js`, `style.css`)
  - `ex6/` — Bài tập 6 (`index.html`, `script.js`, `style.css`)

- `ReactjsExercise/` — Ứng dụng nhỏ dùng Vite + React
  - `index.html`, `package.json`, `vite.config.js`, `eslintrc.config.js`
  - `src/` chứa mã nguồn React
    - `App.jsx`, `main.jsx`, `App.css`, `index.css`
    - `assets/components/` chứa các component: `AddUser.jsx`, `ResultTable.jsx`, `SearchForm.jsx`

## Yêu cầu môi trường

- Node.js (v14+ khuyến nghị) để chạy phần React.
- Trình duyệt hiện đại để mở các file HTML tĩnh.

## Hướng dẫn chạy

1. Mở các bài tập tĩnh (exercise1)

- Cách nhanh nhất: mở file `exercise1/exN/index.html` trực tiếp bằng trình duyệt.
- Nếu bạn muốn phục vụ qua HTTP (để tránh vấn đề CORS hoặc dùng fetch local), có thể dùng một server tĩnh nhẹ, ví dụ với Python hoặc npm:

  - Với Python 3 (từ thư mục `exercise1` hoặc root):

    ```bash
    python -m http.server 8000
    # rồi mở http://localhost:8000/ex1/index.html (hoặc ex2, ex3...)
    ```

  - Với npm (nếu có `serve`):

    ```bash
    npx serve .
    ```

2. Chạy ứng dụng React (`ReactjsExercise`)

- Chuyển vào thư mục `ReactjsExercise`:

      ```bash
      cd ReactjsExercise
      ```

- Cài phụ thuộc và chạy môi trường phát triển (Vite):

      ```bash
      npm install
      npm run dev
      ```

  - Mở địa chỉ mà Vite in ra (thường là `http://localhost:5173`).

  - Build để production:

    ```bash
    npm run build
    npm run preview
    ```

## Mô tả nhanh các phần trong `ReactjsExercise`

- `AddUser.jsx` — form thêm người dùng (input + validation cơ bản).
- `SearchForm.jsx` — trường tìm kiếm / lọc danh sách.
- `ResultTable.jsx` — bảng hiển thị danh sách người dùng, có thể có các hành động (sửa / xóa) tuỳ bài tập.

## Ghi chú về lint và cấu hình

- File `eslint.config.js` nằm ở root của `ReactjsExercise`. Nếu dùng editor như VS Code, cài plugin ESLint để nhận cảnh báo và auto-fix.

## Đóng góp

- Nếu bạn muốn mở rộng bài tập hoặc sửa lỗi, clone repo, tạo branch mới và gửi pull request.

## Liên hệ / Tác giả

- Tài liệu này là tập hợp bài tập cho môn CNWeb. Nếu cần trợ giúp, liên hệ giảng viên hoặc nhóm học tập của bạn.

---

Phiên bản: 1.0 — README mở rộng để tiện cho người dùng mới. Nếu bạn muốn mình điều chỉnh nội dung (ví dụ: thêm hướng dẫn chi tiết cho mỗi bài tập), cho biết chi tiết mong muốn và mình sẽ cập nhật tiếp.
