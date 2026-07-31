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
