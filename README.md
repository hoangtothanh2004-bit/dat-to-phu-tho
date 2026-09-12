# Travel Portal — Next.js & Tailwind CSS Starter Template

Mã nguồn khung giao diện (Starter Template) cho cổng thông tin & ứng dụng du lịch hiện đại, được xây dựng bằng **Next.js 16 (App Router)**, **React 19**, **TypeScript** và **Tailwind CSS v4**.

> 💡 **Lưu ý:** Đây là bản **Starter Template** cung cấp sẵn kiến trúc hệ thống, bố cục giao diện, bộ lọc đa năng, bản đồ và các thành phần UI. Dữ liệu trong thư mục `data/` là dữ liệu mẫu demo. Bạn có thể dễ dàng thay thế, bổ sung dữ liệu các địa danh, ẩm thực và dịch vụ theo địa phương hoặc đề tài của mình.

---

## 🚀 Công nghệ sử dụng

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Tính năng nổi bật:**
  - Giao diện Responsive chuẩn di động và máy tính.
  - Tích hợp Text-To-Speech (TTS) đọc thuyết minh du lịch tự động.
  - Bản đồ địa điểm, tra cứu quận huyện, ẩm thực & lịch trình.
  - Tối ưu hóa SEO và trải nghiệm người dùng (UX/UI).

---

## 🛠️ Hướng dẫn cài đặt & chạy trên máy cục bộ

Yêu cầu môi trường: **Node.js >= 20** và `npm` hoặc `pnpm`.

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
# hoặc nếu dùng pnpm:
pnpm install
```

### 2. Khởi chạy máy chủ phát triển (Dev Server)
```bash
npm run dev
# hoặc
pnpm dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

### 3. Build kiểm tra sản phẩm
```bash
npm run build
```

---

## 📁 Cấu trúc thư mục dữ liệu (`data/`)

Bạn có thể chỉnh sửa và cập nhật dữ liệu của mình tại:
- `data/travel.ts`: Cấu hình danh sách địa điểm, danh mục, ẩm thực đặc sản và dịch vụ.
- `data/districtDirectory.ts`: Danh mục quận/huyện, điểm tham quan và tìm kiếm.
- `data/itineraryTemplates.ts`: Lịch trình tour gợi ý.
- `data/events.ts`: Lễ hội văn hóa và sự kiện thường niên.
