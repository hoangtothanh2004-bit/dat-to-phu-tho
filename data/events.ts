export type CulturalEvent = {
  id: string;
  name: string;
  location: string;
  schedule: string;
  season: "Mùa xuân" | "Mùa hè" | "Mùa thu" | "Quanh năm";
  description: string;
  placeId?: string;
  bookingRequired?: boolean;
};

export const culturalEvents: CulturalEvent[] = [
  {
    id: "gio-to-hung-vuong",
    name: "Giỗ Tổ Hùng Vương – Lễ hội Đền Hùng",
    location: "Khu di tích lịch sử Đền Hùng, Việt Trì",
    schedule: "Ngày chính hội 10/3 âm lịch",
    season: "Mùa xuân",
    description: "Lễ dâng hương, hoạt động văn hóa dân gian và hành trình về cội nguồn.",
    placeId: "den-hung",
  },
  {
    id: "hat-xoan-hung-lo",
    name: "Nghe Hát Xoan tại làng cổ Hùng Lô",
    location: "Đình cổ Hùng Lô, Việt Trì",
    schedule: "Theo lịch biểu diễn định kỳ",
    season: "Quanh năm",
    description: "Trải nghiệm di sản Hát Xoan Phú Thọ trong không gian đình cổ 300 năm tuổi.",
    placeId: "hung-lo",
    bookingRequired: true,
  },
  {
    id: "tro-tram",
    name: "Lễ hội Trò Trám",
    location: "Tứ Xã, Lâm Thao, Phú Thọ",
    schedule: "Đêm 11, rạng sáng 12 tháng Giêng âm lịch",
    season: "Mùa xuân",
    description: "Lễ hội dân gian đặc sắc gắn với tín ngưỡng phồn thực của cư dân vùng trung du.",
  }
];
