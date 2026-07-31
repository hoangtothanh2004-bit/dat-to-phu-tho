# Đất Tổ — Du lịch Phú Thọ

Ứng dụng du lịch Phú Thọ chạy trên máy chủ Next.js độc lập. Dự án không cần tài khoản ChatGPT, không dùng xác thực ChatGPT và có thể triển khai trên bất kỳ VPS hoặc nền tảng Docker nào.

## Chạy trên máy phát triển

Yêu cầu Node.js 22 và pnpm 11.

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

## API của máy chủ

- `GET /api/health`: kiểm tra trạng thái máy chủ.
- `GET /api/places?q=den+hung&category=Tâm+linh`: tìm kiếm địa điểm.
- `GET /api/places?limit=20`: lấy danh sách địa điểm.

## Đưa lên Internet

Xem hướng dẫn trong `DEPLOYMENT.md`. Cách khuyến nghị là một VPS Linux, Docker Compose, tên miền riêng và Caddy tự cấp HTTPS.

## Demo miễn phí bằng GitHub Pages

Workflow `.github/workflows/pages.yml` tự tạo bản website tĩnh mỗi khi có thay đổi được đẩy lên nhánh `main`.

1. Tạo một repository GitHub công khai và đẩy mã nguồn này lên nhánh `main`.
2. Mở **Settings → Pages → Build and deployment**.
3. Chọn **Source: GitHub Actions**.
4. Mở tab **Actions** để theo dõi lần phát hành đầu tiên.

Bản GitHub Pages sử dụng tìm kiếm cục bộ vì GitHub Pages không chạy máy chủ Node.js. Bản VPS vẫn giữ đầy đủ API `/api/health` và `/api/places`.

## Kiểu chữ

- **Be Vietnam Pro** dùng cho nội dung để các dấu tiếng Việt rõ ràng, dễ đọc.
- **Lora** dùng cho tiêu đề và điểm nhấn để tạo cảm giác mềm mại, giàu bản sắc.

Các tệp font được đóng gói trong `app/fonts` theo giấy phép SIL Open Font License 1.1; bản sao giấy phép đi kèm ngay trong thư mục này.
