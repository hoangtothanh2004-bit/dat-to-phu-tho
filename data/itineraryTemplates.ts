export type TourTemplate = {
  id: string;
  title: string;
  durationDays: number;
  durationLabel: string;
  region: "Phú Thọ" | "Vĩnh Phúc" | "Hòa Bình" | "Liên thông 3 tỉnh";
  badge: string;
  theme: string;
  recommendedTransport: string;
  anchorPlaceId: string;
  image: string;
  summary: string;
  estimatedBudgetPerPerson: string;
  highlights: string[];
};

export const tourTemplates: TourTemplate[] = [
  {
    id: "tour-den-hung-1n",
    title: "Về Cội Nguồn Đất Tổ: Đền Hùng – Làng Cổ Hùng Lô",
    durationDays: 1,
    durationLabel: "1 ngày (Trong ngày)",
    region: "Phú Thọ",
    badge: "Phổ biến nhất",
    theme: "Di sản & Tâm linh",
    recommendedTransport: "Ô tô riêng / Xe khách",
    anchorPlaceId: "den-hung",
    image: "/images/places/den-hung.png",
    summary: "Hành trình linh thiêng dâng hương tưởng nhớ các Vua Hùng trên đỉnh Nghĩa Lĩnh và khám phá đình cổ Hùng Lô.",
    estimatedBudgetPerPerson: "450.000 – 750.000đ",
    highlights: ["Leo núi Nghĩa Lĩnh viếng Đền Hùng", "Bảo tàng Hùng Vương", "Thưởng thức ẩm thực Đất Tổ", "Nghe hát Xoan làng cổ Hùng Lô"]
  },
  {
    id: "tour-tam-dao-2n1d",
    title: "Săn Mây Tam Đảo & Khí Hậu 4 Mùa",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    region: "Vĩnh Phúc",
    badge: "Nghỉ dưỡng & Check-in",
    theme: "Nghỉ dưỡng & Chữa lành",
    recommendedTransport: "Ô tô riêng / Xe Limousine",
    anchorPlaceId: "tam-dao",
    image: "/images/places/tam-dao.jpg",
    summary: "Nghỉ dưỡng tại thị trấn mây Tam Đảo, tận hưởng không khí trong lành và ngắm hoàng hôn thung lũng.",
    estimatedBudgetPerPerson: "1.200.000 – 2.000.000đ",
    highlights: ["Nhà thờ đá Tam Đảo", "Quảng trường trung tâm", "Thưởng thức ngọn su su giòn ngọt", "Homestay view thung lũng mây"]
  },
  {
    id: "tour-mai-chau-2n1d",
    title: "Khám Phá Bản Lác & Thung Lũng Mai Châu",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    region: "Hòa Bình",
    badge: "Văn hóa bản địa",
    theme: "Núi rừng & Sinh thái",
    recommendedTransport: "Ô tô riêng / Xe gia đình",
    anchorPlaceId: "ban-lac-mai-chau",
    image: "/images/places/ban-lac-mai-chau.jpg",
    summary: "Đạp xe ngắm thung lũng lúa Bản Lác, giao lưu văn hóa người Thái và thưởng thức cơm lam nếp nương.",
    estimatedBudgetPerPerson: "1.000.000 – 1.800.000đ",
    highlights: ["Đạp xe giữa đồng lúa Bản Lác", "Giao lưu múa sạp & lửa trại", "Nghỉ đêm nhà sàn truyền thống", "Thưởng thức cơm lam nếp nương"]
  }
];
