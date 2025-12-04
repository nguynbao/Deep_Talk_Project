# DeepTalk Web
Giao diện React cho ứng dụng trò chuyện hỏi đáp theo nhóm. Người dùng có thể tạo nhóm, thêm thành viên, quản lý câu hỏi theo chủ đề và chơi game xoay vòng câu hỏi.

## Demo
Truy cập bản deploy: https://deep-talk-project-client.onrender.com/

## Tính năng chính
- Tạo/sửa/xóa câu hỏi và gán chủ đề (topic)
- Tạo nhóm, thêm/bớt thành viên
- Chọn chủ đề và bắt đầu game; vòng chơi tự random người và câu hỏi
- Lọc câu hỏi theo chủ đề

## Cấu hình nhanh
- API backend: đặt `REACT_APP_SERVER` trong `.env` (đã dùng https://deep-talk-project.onrender.com cho bản deploy).
- Cài đặt: `npm install`
- Chạy dev: `npm start` (mặc định http://localhost:3000)
- Build production: `npm run build`

## Thư mục chính
- `src/app/api.jsx`: các hàm gọi API
- `src/pages/`: trang giao diện (Questions, Groups, Game, ...)
- `src/components/`: các thành phần UI dùng chung (nếu có)
