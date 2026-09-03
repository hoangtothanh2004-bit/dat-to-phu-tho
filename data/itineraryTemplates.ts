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
    summary: "Hành trình linh thiêng dâng hương tưởng nhớ các Vua Hùng trên đỉnh Nghĩa Lĩnh, thưởng thức cá sông Lăng Hạc Trì và trải nghiệm nghe Hát Xoan tại đình cổ Hùng Lô hơn 300 năm tuổi.",
    estimatedBudgetPerPerson: "450.000 – 750.000đ",
    highlights: ["Leo núi Nghĩa Lĩnh viếng Đền Hạ – Trung – Thượng", "Bảo tàng Hùng Vương", "Cá lăng nướng than quán Hạc Trì", "Nghe hát Xoan làng cổ Hùng Lô"]
  },
  {
    id: "tour-tam-dao-2n1d",
    title: "Săn Mây Tam Đảo & Chiêm Bái Thiền Tự Tây Thiên",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    region: "Vĩnh Phúc",
    badge: "Nghỉ dưỡng & Sống ảo",
    theme: "Nghỉ dưỡng & Chữa lành",
    recommendedTransport: "Ô tô riêng / Xe Limousine / Xe máy",
    anchorPlaceId: "tam-dao",
    summary: "Trốn khói bụi về thị trấn mây Tam Đảo tận hưởng 4 mùa trong 1 ngày, ngắm hoàng hôn Quán Gió, thưởng thức ngọn su su giòn ngọt và cáp treo chiêm bái Đại Bảo tháp Tây Thiên mây ngàn.",
    estimatedBudgetPerPerson: "1.300.000 – 2.400.000đ",
    highlights: ["Săn biển mây Cầu Mây & Nhà thờ đá", "Cáp treo Tây Thiên viếng Đền Thượng", "Ngọn su su xào tỏi & Gà đồi nướng", "Nghỉ đêm khách sạn view thung lũng"]
  },
  {
    id: "tour-mai-chau-kim-boi-2n1d",
    title: "Mai Châu Bản Lác & Khoáng Nóng Onsen Kim Bôi",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    region: "Hòa Bình",
    badge: "Văn hóa & Trị liệu",
    theme: "Văn hóa & Làng nghề",
    recommendedTransport: "Ô tô riêng / Xe gia đình",
    anchorPlaceId: "ban-lac-mai-chau",
    summary: "Đạp xe giữa thung lũng lúa Bản Lác, hòa mình vào điệu xòe Thái, thưởng thức mâm cỗ lá lợn mán hạt dổi và ngâm mình phục hồi sức khỏe trong suối khoáng nóng 250 triệu năm tại Kim Bôi.",
    estimatedBudgetPerPerson: "1.200.000 – 2.800.000đ",
    highlights: ["Đạp xe thung lũng lúa Mai Châu 700 năm", "Giao lưu múa sạp & rượu cần đêm Bản Lác", "Ngâm khoáng Onsen nóng tự nhiên Kim Bôi", "Thưởng thức cơm lam, cá suối chiên giòn"]
  },
  {
    id: "tour-long-coc-xuan-son-thanh-thuy-2n1d",
    title: "Săn Mây Long Cốc – Trekking Xuân Sơn – Onsen Thanh Thủy",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    region: "Phú Thọ",
    badge: "Thiên nhiên kỳ vĩ",
    theme: "Núi rừng & Sinh thái",
    recommendedTransport: "Ô tô gầm cao / Xe máy phượt",
    anchorPlaceId: "long-coc",
    summary: "Bình minh săn biển mây trên đồi chè bát úp Long Cốc, khám phá rừng nguyên sinh hang động VQG Xuân Sơn và kết thúc bằng buổi ngâm khoáng nóng Nhật Bản phục hồi thể lực tại Thanh Thủy.",
    estimatedBudgetPerPerson: "1.100.000 – 2.200.000đ",
    highlights: ["Săn sương sớm vịnh Hạ Long vùng trung du Long Cốc", "Trekking bản Cỏi & Hang Lạng Xuân Sơn", "Mâm cỗ lá người Dao gà nhiều cựa", "Tắm khoáng Onsen chuẩn Nhật Wyndham Thanh Thủy"]
  },
  {
    id: "tour-thung-nai-song-da-1n",
    title: "Du Thuyền Lòng Hồ Sông Đà: Thung Nai – Đền Chúa Thác Bờ",
    durationDays: 1,
    durationLabel: "1 ngày (Trong ngày)",
    region: "Hòa Bình",
    badge: "Sơn thủy hữu tình",
    theme: "Núi rừng & Sinh thái",
    recommendedTransport: "Ô tô tới bến cảng + Tàu thủy",
    anchorPlaceId: "thung-nai-song-da",
    summary: "Lướt thuyền trên làn nước xanh ngọc bích của 'vịnh Hạ Long trên núi', chiêm bái Đền Chúa Thác Bờ linh thiêng, khám phá động thạch nhũ và thưởng thức cá sông Đà nướng que tre giòn rụm.",
    estimatedBudgetPerPerson: "550.000 – 850.000đ",
    highlights: ["Đi tàu tham quan lòng hồ Sông Đà mênh mông", "Cầu an Đền Bà Chúa Thác Bờ", "Thưởng thức cá nướng than tre trên đảo", "Khám phá thạch nhũ Động Thác Bờ"]
  },
  {
    id: "tour-dai-hanh-trinh-3n2d",
    title: "Đại Hành Trình Di Sản: Đất Tổ – Mây Ngàn Tam Đảo – Thung Lũng Mai Châu",
    durationDays: 3,
    durationLabel: "3 ngày 2 đêm",
    region: "Liên thông 3 tỉnh",
    badge: "Siêu tour 3 tỉnh",
    theme: "Khám phá toàn diện",
    recommendedTransport: "Ô tô riêng / Xe du lịch hợp đồng",
    anchorPlaceId: "den-hung",
    summary: "Hành trình trọn vẹn kết nối 3 không gian di sản tiêu biểu: Ngày 1 dâng hương Đền Hùng & tắm khoáng Thanh Thủy; Ngày 2 vượt núi săn mây Tam Đảo; Ngày 3 xuôi về thung lũng Bản Lác Mai Châu.",
    estimatedBudgetPerPerson: "2.400.000 – 4.500.000đ",
    highlights: ["Khám phá trọn vẹn 3 tỉnh Phú Thọ - Vĩnh Phúc - Hòa Bình", "Hội tụ đủ: Tâm linh, Nghỉ dưỡng mây núi, Suối khoáng Onsen, Du lịch cộng đồng", "Thưởng thức thực đơn tinh hoa: Cá sông Lô, Ngọn su su Tam Đảo, Cơm lam Mai Châu"]
  }
];
