# Triển khai máy chủ độc lập

Kiến trúc sản xuất:

```text
Điện thoại / trình duyệt
          |
     HTTPS + tên miền
          |
        Caddy
          |
  Next.js web + API tìm kiếm
```

Không thành phần nào trong luồng trên cần ChatGPT. Link `chatgpt.site` chỉ là bản thử nghiệm tạm thời và có thể ngừng sử dụng sau khi tên miền riêng hoạt động.

## 1. Chuẩn bị

- VPS Linux có tối thiểu 2 GB RAM.
- Docker Engine và Docker Compose.
- Một tên miền, ví dụ `dulichphutho.vn` hoặc `app.dulichphutho.vn`.
- Bản ghi DNS loại `A` trỏ tên miền về địa chỉ IP công cộng của VPS.
- Mở cổng TCP 80, TCP 443 và UDP 443 trên tường lửa.

## 2. Cấu hình

Sao chép `.env.example` thành `.env`, rồi thay bằng tên miền thật:

```env
APP_DOMAIN=app.tenmiencuaban.vn
ALLOWED_ORIGIN=https://app.tenmiencuaban.vn
```

Không đưa mật khẩu, khóa API hoặc file `.env` lên Git.

## 3. Khởi động

Tại thư mục dự án trên VPS:

```bash
docker compose up -d --build
```

Caddy sẽ nhận chứng chỉ HTTPS tự động khi DNS đã trỏ đúng. Kiểm tra:

```text
https://app.tenmiencuaban.vn/api/health
https://app.tenmiencuaban.vn/api/places?q=Đền%20Hùng
```

## 4. Cập nhật phiên bản

```bash
git pull
docker compose up -d --build
docker image prune -f
```

## 5. Dữ liệu và giai đoạn tiếp theo

API hiện dùng tập dữ liệu mẫu trong `data/places.ts`. Trước khi thương mại hóa nên chuyển sang PostgreSQL để có:

- Trang quản trị điểm đến, nhà hàng, khách sạn và sự kiện.
- Tài khoản đối tác và quy trình xác minh nội dung.
- Đánh giá, hình ảnh, đặt dịch vụ và giao dịch.
- Nhật ký thay đổi, sao lưu tự động và phân quyền quản trị.

Không lưu lịch sử GPS chi tiết nếu không thật sự cần thiết. Nếu cần phân tích vị trí, phải xin phép rõ ràng và chỉ lưu dữ liệu tổng hợp/ẩn danh.
