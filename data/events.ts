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
    schedule: "Ngày chính hội 10/3 âm lịch; hoạt động thường diễn ra nhiều ngày",
    season: "Mùa xuân",
    description: "Lễ dâng hương, hoạt động văn hóa dân gian và hành trình về cội nguồn.",
    placeId: "den-hung",
  },
  {
    id: "den-mau-au-co",
    name: "Lễ hội Đền Mẫu Âu Cơ",
    location: "Hiền Lương, Hạ Hòa",
    schedule: "Ngày chính lễ 7 tháng Giêng âm lịch",
    season: "Mùa xuân",
    description: "Tưởng nhớ Quốc Mẫu Âu Cơ với nghi lễ truyền thống và sinh hoạt cộng đồng.",
    placeId: "mau-au-co",
  },
  {
    id: "tro-tram",
    name: "Lễ hội Trò Trám",
    location: "Tứ Xã, Lâm Thao, Phú Thọ",
    schedule: "Đêm 11, rạng sáng 12 tháng Giêng âm lịch",
    season: "Mùa xuân",
    description: "Lễ hội dân gian đặc sắc gắn với tín ngưỡng phồn thực của cư dân vùng trung du.",
  },
  {
    id: "hat-xoan-hung-lo",
    name: "Nghe Hát Xoan tại làng cổ Hùng Lô",
    location: "Đình cổ Hùng Lô, Việt Trì",
    schedule: "Theo lịch biểu diễn và lịch đặt đoàn; cần liên hệ trước",
    season: "Quanh năm",
    description: "Trải nghiệm di sản Hát Xoan trong không gian đình cổ; không nên đến tự phát mà chưa xác nhận lịch.",
    placeId: "hung-lo",
    bookingRequired: true,
  },
];
