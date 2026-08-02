export const categoryLabels = [
  "Tất cả",
  "Di sản & tâm linh",
  "Núi rừng & sinh thái",
  "Nghỉ dưỡng & chữa lành",
  "Văn hóa & làng nghề",
  "Check-in & vui chơi",
] as const;

export type Category = (typeof categoryLabels)[number];
export type PlaceCategory = Exclude<Category, "Tất cả">;

export type NearbyItem = {
  name: string;
  type: string;
  distance: string;
  travelTime: string;
  note: string;
  address: string;
  hours: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  taste?: string;
  image: string;
};

export type Place = {
  id: string;
  name: string;
  shortName: string;
  category: PlaceCategory;
  district: string;
  location: string;
  image: string;
  imageCredit: string;
  rating: number;
  reviews: number;
  hours: string;
  price: string;
  description: string;
  tags: string[];
  highlights: string[];
  bestTime: string;
  season: string;
  seasonMonths: number[];
  duration: string;
  distanceFromVietTri: number;
  travelFromVietTri: string;
  bestStart: string;
  warning?: string;
  lat: number;
  lng: number;
  featured?: boolean;
  audioScript: string;
  restaurants: NearbyItem[];
  stays: NearbyItem[];
};

const foodPhoto =
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=82";
const fishPhoto =
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82";
const homestayPhoto =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=82";
const hotelPhoto =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82";

const aThao: NearbyItem = {
  name: "Nhà hàng A Thảo Gà cựa",
  type: "Đặc sản Đất Tổ",
  distance: "8,5 km",
  travelTime: "18 phút",
  note: "Gà nhiều cựa · Cá sông · Phù hợp nhóm",
  taste: "Thịt gà săn chắc, ngọt tự nhiên; món nướng và hấp giữ vị rõ.",
  address: "235 Tiên Dung, phường Tiên Cát, Việt Trì",
  hours: "Nên gọi xác nhận trước khi đến",
  phone: "0913282120",
  rating: 4.8,
  reviewCount: 126,
  image: foodPhoto,
};

const hacTri: NearbyItem = {
  name: "Quán cá Hạc Trì",
  type: "Cá sông",
  distance: "7,8 km",
  travelTime: "16 phút",
  note: "Cá lăng · Món Việt · Có phòng nhóm",
  taste: "Vị đậm vừa, nổi bật các món cá sông nướng và om.",
  address: "398 Lạc Long Quân, phường Thanh Miếu, Việt Trì",
  hours: "Nên gọi xác nhận khung giờ bán",
  phone: "0983398468",
  rating: 4.7,
  reviewCount: 94,
  image: fishPhoto,
};

const vietTriGarden: NearbyItem = {
  name: "Việt Trì Garden",
  type: "Khách sạn",
  distance: "4,4 km",
  travelTime: "10 phút",
  note: "Gần trung tâm · Có nhà hàng",
  address: "Nguyễn Tất Thành, Trưng Vương, Việt Trì",
  hours: "Lễ tân 24/7",
  phone: "02103555555",
  rating: 4.5,
  reviewCount: 318,
  image: hotelPhoto,
};

const localMeal = (distance: string, travelTime: string): NearbyItem => ({
  name: "Cơm nhà sàn bản Cỏi",
  type: "Ẩm thực Mường – Dao",
  distance,
  travelTime,
  note: "Gà nhiều cựa · Cá suối · Xôi ngũ sắc",
  taste: "Món nướng thơm mắc khén, rau rừng thanh và cá suối vị ngọt.",
  address: "Bản Cỏi, xã Xuân Sơn, Tân Sơn",
  hours: "Phục vụ theo đoàn; nên đặt trước ít nhất 2 giờ",
  rating: 4.8,
  reviewCount: 68,
  image: foodPhoto,
});

const localStay = (distance: string, travelTime: string): NearbyItem => ({
  name: "Homestay cộng đồng Xuân Sơn",
  type: "Nhà sàn",
  distance,
  travelTime,
  note: "Ăn sáng · Trải nghiệm bản địa",
  address: "Bản Dù, xã Xuân Sơn, Tân Sơn",
  hours: "Nhận phòng theo xác nhận của chủ nhà",
  rating: 4.7,
  reviewCount: 82,
  image: homestayPhoto,
});

export const places: Place[] = [
  {
    id: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    shortName: "Đền Hùng",
    category: "Di sản & tâm linh",
    district: "Việt Trì",
    location: "Khu 8, xã Hy Cương, Việt Trì",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/2022-07-20-05-40-40-Dh1.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.9,
    reviews: 2840,
    hours: "Tham khảo 06:00 – 18:00",
    price: "Tham quan khu di tích miễn phí; một số dịch vụ tính riêng",
    description:
      "Quần thể đền thờ các Vua Hùng trên núi Nghĩa Lĩnh, trung tâm thực hành Tín ngưỡng thờ cúng Hùng Vương và là điểm mở đầu trọn vẹn cho hành trình về cội nguồn.",
    tags: ["Di sản", "Tín ngưỡng", "Gia đình", "Lịch sử"],
    highlights: ["Đền Hạ – Trung – Thượng", "Lăng Hùng Vương", "Bảo tàng Hùng Vương", "Đường bậc đá giữa rừng"],
    bestTime: "06:30 – 09:30 hoặc sau 15:30",
    season: "Đẹp quanh năm; đông nhất dịp Giỗ Tổ 10/3 âm lịch",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "3 – 4 giờ",
    distanceFromVietTri: 11,
    travelFromVietTri: "20 – 25 phút bằng ô tô",
    bestStart: "07:00",
    warning: "Dịp lễ hội rất đông; nên đi sớm, mang giày đế bám và giữ trang phục lịch sự.",
    lat: 21.366,
    lng: 105.3246,
    featured: true,
    audioScript:
      "Đền Hùng nằm trên núi Nghĩa Lĩnh, là nơi tưởng nhớ các Vua Hùng đã có công dựng nước. Hành trình thường bắt đầu từ Đền Hạ, tiếp tục lên Đền Trung, Đền Thượng và Lăng Hùng Vương. Khi tham quan, bạn nên giữ không gian trang nghiêm, đi chậm và dành thời gian đọc các bảng chỉ dẫn để hiểu rõ hơn về tín ngưỡng thờ cúng Hùng Vương.",
    restaurants: [aThao, hacTri],
    stays: [
      vietTriGarden,
      {
        name: "Mường Thanh Luxury Phú Thọ",
        type: "Khách sạn",
        distance: "8,1 km",
        travelTime: "17 phút",
        note: "Phòng gia đình · Hồ bơi",
        address: "Lô CC17, đường Hùng Vương, phường Gia Cẩm, Việt Trì",
        hours: "Lễ tân 24/7",
        phone: "02103616666",
        rating: 4.6,
        reviewCount: 740,
        image: hotelPhoto,
      },
    ],
  },
  {
    id: "xuan-son",
    name: "Vườn quốc gia Xuân Sơn",
    shortName: "Xuân Sơn",
    category: "Núi rừng & sinh thái",
    district: "Tân Sơn",
    location: "Xã Xuân Sơn, Tân Sơn",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/2022-07-21-09-46-56-6.giaiba-binhminhxuanson-tacgianguyenvanmuoi.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.8,
    reviews: 968,
    hours: "Khu vực mở; điểm dịch vụ có giờ riêng",
    price: "Từ 40.000đ/người, tùy tuyến trải nghiệm",
    description:
      "Rừng nguyên sinh trên núi đá vôi, hang động, suối và các bản làng Dao – Mường. Phù hợp cho trekking nhẹ, tìm hiểu văn hóa và nghỉ tại nhà sàn.",
    tags: ["Trekking", "Bản Cỏi", "Hang động", "Dao – Mường"],
    highlights: ["Rừng nguyên sinh núi đá vôi", "Bản Cỏi – bản Dù", "Hang Na – hang Lạng", "Cá suối và gà nhiều cựa"],
    bestTime: "07:00 – 16:30; bắt đầu trekking trước 14:00",
    season: "Tháng 3 – 5 và 9 – 11 dễ đi; mùa mưa cần kiểm tra đường suối",
    seasonMonths: [3, 4, 5, 9, 10, 11],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 80,
    travelFromVietTri: "Khoảng 2 giờ 15 phút",
    bestStart: "07:30",
    warning: "Không tự vào hang hoặc tuyến rừng vắng; hỏi kiểm lâm/hướng dẫn viên khi mưa lớn.",
    lat: 21.1506,
    lng: 104.9327,
    featured: true,
    audioScript:
      "Vườn quốc gia Xuân Sơn nằm ở phần cuối dãy Hoàng Liên Sơn và nổi bật với rừng nguyên sinh trên núi đá vôi. Bên cạnh hệ sinh thái đa dạng, nơi đây còn có các bản làng của đồng bào Dao và Mường. Một ngày phù hợp thường gồm tham quan bảo tàng thiên nhiên, đi bộ qua bản, khám phá suối và thưởng thức bữa cơm địa phương. Hãy hạn chế rác nhựa và luôn hỏi người bản địa trước khi đi vào tuyến rừng.",
    restaurants: [localMeal("0,6 km", "4 phút"), { ...aThao, distance: "78 km", travelTime: "2 giờ 10 phút" }],
    stays: [localStay("0,8 km", "5 phút"), { ...vietTriGarden, distance: "82 km", travelTime: "2 giờ 20 phút" }],
  },
  {
    id: "long-coc",
    name: "Đồi chè Long Cốc",
    shortName: "Long Cốc",
    category: "Check-in & vui chơi",
    district: "Tân Sơn",
    location: "Xóm Măng 1, xã Long Cốc, Tân Sơn",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/03.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.8,
    reviews: 1240,
    hours: "Không gian mở; tôn trọng khu vực sản xuất chè",
    price: "Tham quan miễn phí; dịch vụ chụp ảnh tính riêng",
    description:
      "Những đồi chè hình bát úp nối tiếp trong sương sớm, được ví như “vịnh Hạ Long vùng trung du” và đặc biệt cuốn hút với người thích nhiếp ảnh.",
    tags: ["Săn mây", "Bình minh", "Đồi chè", "Nhiếp ảnh"],
    highlights: ["Biển đồi chè bát úp", "Săn sương bình minh", "Trải nghiệm hái – sao chè", "Mâm cỗ lá người Mường"],
    bestTime: "05:15 – 08:00; hoàng hôn 16:30 – 17:45",
    season: "Tháng 3 – 5 và 9 – 12 xanh đẹp, xác suất có sương cao hơn",
    seasonMonths: [3, 4, 5, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: 70,
    travelFromVietTri: "Khoảng 1 giờ 50 phút",
    bestStart: "05:30",
    warning: "Đường đồi có thể trơn khi mưa; không giẫm lên luống chè và xin phép trước khi chụp người dân.",
    lat: 21.1804,
    lng: 105.0708,
    featured: true,
    audioScript:
      "Long Cốc gây ấn tượng bởi hàng trăm quả đồi chè tròn nối nhau đến tận đường chân trời. Thời điểm đẹp nhất thường là buổi sớm, khi sương còn nằm giữa các thung đồi và ánh nắng vừa chạm vào luống chè. Đây là khu vực sản xuất của người dân, vì vậy bạn hãy đi theo lối có sẵn, không bẻ chè và ưu tiên sử dụng dịch vụ của cộng đồng địa phương.",
    restaurants: [
      {
        ...localMeal("1,2 km", "6 phút"),
        name: "Bếp Lá Long Cốc",
        address: "Xã Long Cốc, Tân Sơn",
      },
      { ...localMeal("4,6 km", "12 phút"), name: "Cơm Mường Tân Sơn" },
    ],
    stays: [
      { ...localStay("1,4 km", "7 phút"), name: "Homestay Long Cốc", address: "Xóm Măng 1, Long Cốc, Tân Sơn" },
      { ...localStay("4,8 km", "13 phút"), name: "Nhà sàn Mường Tân Sơn" },
    ],
  },
  {
    id: "thanh-thuy",
    name: "Khu nghỉ dưỡng khoáng nóng Thanh Thủy",
    shortName: "Khoáng nóng Thanh Thủy",
    category: "Nghỉ dưỡng & chữa lành",
    district: "Thanh Thủy",
    location: "Khu vực La Phù – Bảo Yên, Thanh Thủy",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=86",
    imageCredit: "Ảnh minh họa không gian khoáng nóng",
    rating: 4.7,
    reviews: 1678,
    hours: "Tùy cơ sở, phổ biến 08:00 – 22:00",
    price: "Từ 200.000đ/người; cần kiểm tra gói dịch vụ",
    description:
      "Cụm nghỉ dưỡng khoáng nóng bên sông Đà, phù hợp để thư giãn, chăm sóc sức khỏe và kết hợp chuyến đi gia đình cuối tuần.",
    tags: ["Khoáng nóng", "Gia đình", "Spa", "Sông Đà"],
    highlights: ["Ngâm khoáng nóng", "Spa – xông hơi", "Ẩm thực cá sông Đà", "Nghỉ cuối tuần cho gia đình"],
    bestTime: "09:00 – 11:00 hoặc 16:00 – 20:30",
    season: "Quanh năm; dễ chịu nhất từ tháng 10 đến tháng 3",
    seasonMonths: [1, 2, 3, 10, 11, 12],
    duration: "Nửa ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 42,
    travelFromVietTri: "Khoảng 60 – 75 phút",
    bestStart: "15:30",
    warning: "Không ngâm quá lâu; người có bệnh nền, phụ nữ mang thai và trẻ nhỏ nên hỏi tư vấn y tế/cơ sở.",
    lat: 21.1511,
    lng: 105.2971,
    featured: true,
    audioScript:
      "Thanh Thủy được biết đến với nguồn khoáng nóng tự nhiên và hệ thống nghỉ dưỡng ven sông Đà. Trải nghiệm phù hợp là ngâm khoáng theo từng phiên ngắn, nghỉ giữa các lần ngâm và bổ sung đủ nước. Bạn nên hỏi rõ nhiệt độ bể, dịch vụ bao gồm trong vé và các lưu ý sức khỏe trước khi sử dụng.",
    restaurants: [
      { ...hacTri, name: "Nhà hàng cá sông Đà", distance: "1,1 km", travelTime: "5 phút", address: "Khu du lịch Thanh Thủy, Phú Thọ" },
      { ...aThao, distance: "41 km", travelTime: "65 phút" },
    ],
    stays: [
      { ...vietTriGarden, name: "Wyndham Thanh Thủy", type: "Resort", distance: "0,5 km", travelTime: "3 phút", address: "Xã Bảo Yên, Thanh Thủy", phone: undefined },
      { ...localStay("2,1 km", "8 phút"), name: "Khu nghỉ Thanh Lâm", address: "La Phù, Thanh Thủy" },
    ],
  },
  {
    id: "hung-lo",
    name: "Đình cổ Hùng Lô và làng Xoan",
    shortName: "Làng cổ Hùng Lô",
    category: "Văn hóa & làng nghề",
    district: "Việt Trì",
    location: "Xã Hùng Lô, Việt Trì",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/diem-den-hut-khach-du-lich-637860435296282908-1024x537.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.7,
    reviews: 426,
    hours: "Tham khảo 07:00 – 17:30; Hát Xoan theo lịch hẹn",
    price: "Tham quan miễn phí; trải nghiệm đoàn cần đặt trước",
    description:
      "Không gian đình hơn 300 năm tuổi, nhà cổ và Hát Xoan gắn với đời sống cộng đồng ven sông Lô, phù hợp cho hành trình văn hóa chậm.",
    tags: ["Hát Xoan", "Làng cổ", "Mì gạo", "Kiến trúc gỗ"],
    highlights: ["Đình cổ hơn 300 năm", "Trình diễn Hát Xoan", "Nhà cổ ven sông Lô", "Trải nghiệm mì gạo – bánh chưng"],
    bestTime: "08:00 – 11:00 hoặc 14:00 – 16:30",
    season: "Quanh năm; mùa xuân có nhiều hoạt động văn hóa",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "1,5 – 2,5 giờ",
    distanceFromVietTri: 7,
    travelFromVietTri: "15 – 20 phút",
    bestStart: "09:00",
    warning: "Nên đặt trước nếu muốn nghe Hát Xoan hoặc tham gia trải nghiệm làng nghề.",
    lat: 21.3712,
    lng: 105.4077,
    audioScript:
      "Làng cổ Hùng Lô nằm bên sông Lô và nổi bật với ngôi đình có lịch sử hơn ba trăm năm. Đây là một trong những không gian tiêu biểu để cảm nhận Hát Xoan Phú Thọ. Ngoài kiến trúc đình và nhà cổ, du khách có thể tìm hiểu nghề làm mì gạo, bánh chưng và các sinh hoạt của làng. Nếu muốn xem biểu diễn, bạn nên liên hệ trước để cộng đồng chuẩn bị chương trình phù hợp.",
    restaurants: [
      { ...aThao, distance: "6,9 km", travelTime: "15 phút" },
      { ...hacTri, distance: "8,2 km", travelTime: "18 phút" },
    ],
    stays: [vietTriGarden, { ...vietTriGarden, name: "SOJO Hotel Việt Trì", distance: "7,2 km", travelTime: "16 phút", phone: undefined }],
  },
  {
    id: "van-lang",
    name: "Công viên Văn Lang",
    shortName: "Công viên Văn Lang",
    category: "Check-in & vui chơi",
    district: "Việt Trì",
    location: "Phường Tiên Cát, Việt Trì",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/2022-11-17-11-39-14-z3562723366125_b1c6b79cca606435114d03b525cdc5bc.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.6,
    reviews: 1830,
    hours: "Không gian công cộng mở cả ngày",
    price: "Miễn phí",
    description:
      "Không gian xanh quanh hồ giữa trung tâm Việt Trì với cầu đi bộ, tháp giữa hồ và khu ẩm thực lân cận; đẹp nhất vào cuối chiều.",
    tags: ["Hoàng hôn", "Đi bộ", "Gia đình", "Ăn tối"],
    highlights: ["Cầu đi bộ 178 m", "Tháp giữa hồ", "Hoàng hôn và ánh đèn", "Kết hợp phố ẩm thực"],
    bestTime: "16:30 – 20:30",
    season: "Quanh năm; tránh giữa trưa mùa hè",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "1 – 2 giờ",
    distanceFromVietTri: 1,
    travelFromVietTri: "5 – 10 phút",
    bestStart: "17:00",
    lat: 21.3066,
    lng: 105.3998,
    audioScript:
      "Công viên Văn Lang là khoảng xanh nổi bật giữa trung tâm Việt Trì. Cầu đi bộ bắc qua hồ dẫn tới tháp bảy tầng, tạo nên khung cảnh đặc biệt khi thành phố lên đèn. Bạn có thể đi dạo một vòng hồ, ngắm hoàng hôn rồi kết thúc bằng bữa tối ở khu phố ẩm thực gần đó.",
    restaurants: [
      { ...aThao, distance: "1,6 km", travelTime: "6 phút" },
      { ...hacTri, distance: "2,1 km", travelTime: "8 phút" },
    ],
    stays: [{ ...vietTriGarden, distance: "2,6 km", travelTime: "9 phút" }, { ...vietTriGarden, name: "SOJO Hotel Việt Trì", distance: "0,7 km", travelTime: "4 phút", phone: undefined }],
  },
  {
    id: "mau-au-co",
    name: "Đền Mẫu Âu Cơ",
    shortName: "Đền Mẫu Âu Cơ",
    category: "Di sản & tâm linh",
    district: "Hạ Hòa",
    location: "Xã Hiền Lương, Hạ Hòa",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/kham-pha-top-25-dia-diem-du-lich-phu-tho-hut-hon-du-khach-637772882465539989.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.8,
    reviews: 612,
    hours: "Tham khảo 07:00 – 17:00",
    price: "Tham quan miễn phí",
    description:
      "Không gian thờ Quốc Mẫu Âu Cơ gắn với truyền thuyết nguồn cội, nổi bật với lễ chính vào mùng 7 tháng Giêng âm lịch.",
    tags: ["Quốc Mẫu", "Lễ hội", "Nguồn cội", "Hạ Hòa"],
    highlights: ["Tín ngưỡng thờ Mẫu Âu Cơ", "Kiến trúc cổ", "Lễ hội mùng 7 tháng Giêng", "Kết nối tuyến du lịch Hạ Hòa"],
    bestTime: "07:30 – 10:30",
    season: "Đẹp quanh năm; nhộn nhịp nhất dịp tháng Giêng âm lịch",
    seasonMonths: [1, 2, 3, 10, 11, 12],
    duration: "1,5 – 2 giờ",
    distanceFromVietTri: 70,
    travelFromVietTri: "Khoảng 1 giờ 40 phút",
    bestStart: "08:00",
    warning: "Giữ trang phục lịch sự; ngày lễ nên đi sớm và theo hướng dẫn phân luồng.",
    lat: 21.5684,
    lng: 105.0138,
    audioScript:
      "Đền Mẫu Âu Cơ ở Hiền Lương là nơi người dân tưởng nhớ Quốc Mẫu Âu Cơ trong truyền thuyết bọc trăm trứng. Lễ chính diễn ra vào mùng bảy tháng Giêng âm lịch. Khi đến đền, bạn nên dành thời gian tìm hiểu các nghi thức và câu chuyện địa phương, đồng thời giữ thái độ trang nghiêm trong không gian thờ tự.",
    restaurants: [{ ...localMeal("2,4 km", "8 phút"), name: "Bếp quê Hiền Lương", address: "Xã Hiền Lương, Hạ Hòa" }, { ...aThao, distance: "68 km", travelTime: "1 giờ 35 phút" }],
    stays: [{ ...localStay("7,5 km", "16 phút"), name: "Nhà nghỉ trung tâm Hạ Hòa", address: "Thị trấn Hạ Hòa" }, vietTriGarden],
  },
  {
    id: "ao-gioi",
    name: "Ao Giời – Suối Tiên",
    shortName: "Ao Giời – Suối Tiên",
    category: "Núi rừng & sinh thái",
    district: "Hạ Hòa",
    location: "Núi Nả, xã Quân Khê, Hạ Hòa",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/thumb-5.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.6,
    reviews: 438,
    hours: "Nên đi ban ngày, kết thúc trước 16:30",
    price: "Chi phí phụ thuộc dịch vụ địa phương",
    description:
      "Dòng suối trên núi Nả tạo thành nhiều tầng thác và ao tự nhiên giữa rừng, phù hợp cho chuyến đi mùa hè có chuẩn bị tốt.",
    tags: ["Thác nước", "Đi bộ rừng", "Giải nhiệt", "Hoang sơ"],
    highlights: ["Chuỗi thác và hồ tự nhiên", "Nước suối mát", "Tuyến đi bộ giữa rừng", "Kết hợp Đầm Ao Châu"],
    bestTime: "07:00 – 15:30",
    season: "Tháng 4 – 8; tránh ngày mưa lớn và sau mưa kéo dài",
    seasonMonths: [4, 5, 6, 7, 8],
    duration: "4 – 6 giờ",
    distanceFromVietTri: 80,
    travelFromVietTri: "Khoảng 2 giờ",
    bestStart: "07:00",
    warning: "Không xuống suối khi nước đục hoặc mưa thượng nguồn; đá trơn, sóng điện thoại có thể yếu.",
    lat: 21.565,
    lng: 104.937,
    audioScript:
      "Ao Giời – Suối Tiên bắt nguồn từ núi Nả và tạo nên nhiều tầng thác, hồ nước tự nhiên giữa rừng. Đây là điểm còn hoang sơ, vì vậy an toàn thời tiết quan trọng hơn lịch trình. Bạn chỉ nên đi khi trời ổn định, mang giày bám tốt, không xuống nước khi dòng chảy mạnh và nên có người địa phương dẫn đường.",
    restaurants: [{ ...localMeal("1,8 km", "9 phút"), name: "Quán suối Quân Khê", address: "Xã Quân Khê, Hạ Hòa", hours: "Phục vụ theo ngày; cần hỏi trước" }, { ...localMeal("14 km", "25 phút"), name: "Cơm quê Ao Châu", address: "Khu vực Ao Châu, Hạ Hòa" }],
    stays: [{ ...localStay("15 km", "28 phút"), name: "Lưu trú khu vực Hạ Hòa", address: "Trung tâm Hạ Hòa" }, { ...localStay("8 km", "18 phút"), name: "Homestay Quân Khê", address: "Xã Quân Khê, Hạ Hòa" }],
  },
  {
    id: "lang-suong",
    name: "Đền Lăng Sương",
    shortName: "Đền Lăng Sương",
    category: "Di sản & tâm linh",
    district: "Thanh Thủy",
    location: "Xã Trung Nghĩa, Thanh Thủy",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/2022-07-25-04-54-48-z3543504357883_769b2e086451850a8db237c8f07da62e-1024x768.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.7,
    reviews: 286,
    hours: "Tham khảo 07:00 – 17:00",
    price: "Tham quan miễn phí",
    description:
      "Di tích quốc gia gắn với tín ngưỡng thờ Tản Viên, được giới thiệu là nơi thờ cả gia đình Đức Thánh Tản.",
    tags: ["Tản Viên", "Di tích quốc gia", "Tâm linh", "Thanh Thủy"],
    highlights: ["Không gian thờ Đức Thánh Tản", "Giá trị lịch sử – tín ngưỡng", "Kiến trúc đền truyền thống", "Kết hợp khoáng nóng"],
    bestTime: "08:00 – 11:00",
    season: "Quanh năm; nên đi buổi sáng, tránh giờ nắng gắt",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "1 – 1,5 giờ",
    distanceFromVietTri: 35,
    travelFromVietTri: "Khoảng 55 phút",
    bestStart: "08:30",
    lat: 21.209,
    lng: 105.263,
    audioScript:
      "Đền Lăng Sương thuộc xã Trung Nghĩa, là di tích lịch sử cấp quốc gia và gắn với tín ngưỡng thờ Tản Viên Sơn Thánh. Điểm đặc biệt của nơi đây là không gian thờ cả gia đình Đức Thánh Tản. Bạn có thể kết hợp tham quan đền vào buổi sáng và dành buổi chiều nghỉ dưỡng khoáng nóng Thanh Thủy.",
    restaurants: [{ ...hacTri, name: "Bếp cá sông Đà", distance: "7,2 km", travelTime: "15 phút", address: "Khu vực Thanh Thủy" }, { ...aThao, distance: "34 km", travelTime: "55 phút" }],
    stays: [{ ...localStay("8 km", "16 phút"), name: "Resort khoáng nóng Thanh Thủy", address: "Thanh Thủy" }, { ...vietTriGarden, distance: "36 km", travelTime: "58 phút" }],
  },
  {
    id: "dao-ngoc-xanh",
    name: "Khu du lịch Đảo Ngọc Xanh",
    shortName: "Đảo Ngọc Xanh",
    category: "Check-in & vui chơi",
    district: "Thanh Thủy",
    location: "La Phù, Thanh Thủy",
    image: "https://dulichphutho.gov.vn/content-uploads/2025/02/2022-07-20-11-00-44-284793376_3076655812577544_2851434455336724323_n.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.5,
    reviews: 1340,
    hours: "Cần kiểm tra lịch vận hành trò chơi trước ngày đi",
    price: "Vé và dịch vụ thay đổi theo thời điểm",
    description:
      "Tổ hợp vui chơi, công viên nước, nghỉ dưỡng và khoáng nóng ven sông Đà, phù hợp cho gia đình có trẻ nhỏ.",
    tags: ["Công viên nước", "Gia đình", "Trò chơi", "Khoáng nóng"],
    highlights: ["Công viên nước", "Khu trò chơi trẻ em", "Khách sạn ven sông", "Nhà hàng Ngọc Trai"],
    bestTime: "08:30 – 16:30",
    season: "Trò chơi nước phù hợp tháng 4 – 9; khoáng nóng hợp mùa lạnh",
    seasonMonths: [4, 5, 6, 7, 8, 9],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 42,
    travelFromVietTri: "Khoảng 65 phút",
    bestStart: "08:30",
    warning: "Kiểm tra chiều cao, độ tuổi và lịch bảo trì từng trò chơi; trẻ em cần người lớn giám sát.",
    lat: 21.1518,
    lng: 105.3004,
    audioScript:
      "Đảo Ngọc Xanh là tổ hợp vui chơi và nghỉ dưỡng ven sông Đà. Gia đình có thể dành buổi sáng cho khu trò chơi, nghỉ trưa tại nhà hàng rồi lựa chọn công viên nước hoặc khoáng nóng vào buổi chiều. Trước khi đi, bạn nên gọi kiểm tra lịch vận hành, giá vé và yêu cầu chiều cao của từng trò chơi.",
    restaurants: [{ ...aThao, name: "Nhà hàng Ngọc Trai", distance: "0,2 km", travelTime: "2 phút", address: "Trong Khu du lịch Đảo Ngọc Xanh", phone: "0968910998", note: "Món Việt · Đặc sản địa phương · Phục vụ đoàn" }, { ...hacTri, name: "Bếp cá sông Đà", distance: "1,4 km", travelTime: "6 phút", address: "La Phù, Thanh Thủy" }],
    stays: [{ ...vietTriGarden, name: "Khách sạn Đảo Ngọc Xanh", distance: "0,1 km", travelTime: "1 phút", address: "Trong Khu du lịch Đảo Ngọc Xanh", phone: "0968910998" }, { ...localStay("2,3 km", "8 phút"), name: "Lưu trú khoáng nóng Thanh Thủy", address: "Khu vực La Phù" }],
  },
];

export type FoodRegion = {
  id: string;
  label: string;
  subtitle: string;
  dishes: FoodDish[];
};

export type FoodSeller = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  price: number;
  unit: string;
  rating: number;
  reviewCount: number;
  pickupNote: string;
  verified: boolean;
};

export type FoodDish = {
  id: string;
  name: string;
  description: string;
  price: string;
  season: string;
  image: string;
  sellers: FoodSeller[];
};

const dishImages = {
  banhTai: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=900&q=82",
  bunTom: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=82",
  ga: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82",
  thitChua: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
  mamCo: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
  xoi: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=900&q=82",
  fruit: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=82",
  fish: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
};

const demoSeller = (
  id: string,
  name: string,
  address: string,
  phone: string,
  price: number,
  unit: string,
  hours = "Liên hệ trước khi đến",
): FoodSeller => ({
  id,
  name,
  address,
  phone,
  hours,
  price,
  unit,
  rating: 4.7,
  reviewCount: 0,
  pickupNote: "Nhận tại cửa hàng; giao hàng sẽ mở khi kết nối đối tác vận chuyển",
  verified: false,
});

export const foodRegions: FoodRegion[] = [
  {
    id: "viet-tri",
    label: "Việt Trì",
    subtitle: "Món cội nguồn và phố ẩm thực",
    dishes: [
      {
        id: "banh-tai-phu-tho", name: "Bánh tai Phú Thọ", description: "Vỏ bột gạo mềm, nhân thịt tiêu thơm, hợp ăn sáng.", price: "Từ 10.000đ", season: "Quanh năm", image: dishImages.banhTai,
        sellers: [
          demoSeller("bep-dat-to-banh-tai", "Bếp Đất Tổ — gian hàng mẫu", "Trung tâm Việt Trì, Phú Thọ", "02103888888", 10000, "chiếc", "06:00 – 10:00"),
          demoSeller("cho-viet-tri-banh-tai", "Quầy đặc sản Việt Trì — gian hàng mẫu", "Khu chợ trung tâm Việt Trì, Phú Thọ", "02103999999", 12000, "chiếc", "06:30 – 11:00"),
        ],
      },
      {
        id: "bun-tom-dat-to", name: "Bún tôm Đất Tổ", description: "Nước dùng thanh, tôm rang thơm và rau ghém tươi.", price: "Từ 40.000đ", season: "Quanh năm", image: dishImages.bunTom,
        sellers: [demoSeller("pho-am-thuc-bun-tom", "Bếp Việt Trì — gian hàng mẫu", "Phường Gia Cẩm, Việt Trì, Phú Thọ", "02103666666", 40000, "bát", "06:00 – 13:30")],
      },
      {
        id: "ga-nhieu-cua", name: "Gà nhiều cựa", description: "Thịt săn chắc, hợp nướng, hấp hoặc ăn cùng xôi.", price: "Từ 320.000đ", season: "Nên đặt trước", image: dishImages.ga,
        sellers: [demoSeller("ga-cua-viet-tri", "Bếp gà nhiều cựa — gian hàng mẫu", "Khu vực Đền Hùng, Việt Trì, Phú Thọ", "02103777777", 320000, "suất", "10:00 – 21:00")],
      },
    ],
  },
  {
    id: "tan-son",
    label: "Tân Sơn – Thanh Sơn",
    subtitle: "Ẩm thực Mường – Dao giữa núi rừng",
    dishes: [
      { id: "thit-chua-thanh-son", name: "Thịt chua Thanh Sơn", description: "Vị chua dịu từ thính rang, ăn cùng lá sung và tương ớt.", price: "Từ 45.000đ", season: "Quanh năm", image: dishImages.thitChua, sellers: [demoSeller("ocop-thanh-son", "Đặc sản Thanh Sơn — gian hàng mẫu", "Thị trấn Thanh Sơn, Phú Thọ", "02106333333", 45000, "hộp", "07:00 – 20:00")] },
      { id: "mam-co-la", name: "Mâm cỗ lá", description: "Nhiều món bản địa bày trên lá, thơm mắc khén và rau rừng.", price: "Từ 650.000đ", season: "Đặt trước", image: dishImages.mamCo, sellers: [demoSeller("bep-ban-coi", "Bếp bản Cỏi — gian hàng mẫu", "Bản Cỏi, Xuân Sơn, Tân Sơn", "02106444444", 650000, "mâm 4 người", "Phục vụ theo lịch đặt")] },
      { id: "xoi-ngu-sac", name: "Xôi ngũ sắc", description: "Nếp dẻo nhuộm màu tự nhiên từ lá rừng.", price: "Từ 35.000đ", season: "Lễ hội và đặt trước", image: dishImages.xoi, sellers: [demoSeller("xoi-xuan-son", "Bếp nhà sàn Xuân Sơn — gian hàng mẫu", "Bản Dù, Xuân Sơn, Tân Sơn", "02106555555", 35000, "suất", "06:00 – 19:00")] },
    ],
  },
  {
    id: "doan-hung",
    label: "Đoan Hùng",
    subtitle: "Sản vật ven sông Lô",
    dishes: [
      { id: "buoi-doan-hung", name: "Bưởi Đoan Hùng", description: "Múi mọng, vị ngọt mát và hương thơm nhẹ.", price: "Từ 35.000đ", season: "Thu hoạch chính khoảng tháng 8 – 12", image: dishImages.fruit, sellers: [demoSeller("vuon-buoi-doan-hung", "Vườn bưởi Đoan Hùng — gian hàng mẫu", "Huyện Đoan Hùng, Phú Thọ", "02106666666", 35000, "quả", "07:00 – 18:00")] },
      { id: "ca-song-lo", name: "Cá sông Lô", description: "Thịt chắc, thường nướng hoặc om chuối đậu.", price: "Từ 180.000đ", season: "Quanh năm", image: dishImages.fish, sellers: [demoSeller("bep-song-lo", "Bếp ven sông Lô — gian hàng mẫu", "Thị trấn Đoan Hùng, Phú Thọ", "02106777777", 180000, "suất", "10:00 – 21:00")] },
    ],
  },
  {
    id: "ha-hoa",
    label: "Hạ Hòa",
    subtitle: "Món quê quanh Đền Mẫu và hồ đầm",
    dishes: [
      { id: "com-que-hien-luong", name: "Cơm quê Hiền Lương", description: "Món mùa, rau vườn và gà bản theo mâm gia đình.", price: "Từ 450.000đ", season: "Nên đặt trước", image: dishImages.mamCo, sellers: [demoSeller("bep-hien-luong", "Bếp quê Hiền Lương — gian hàng mẫu", "Hiền Lương, Hạ Hòa, Phú Thọ", "02106888888", 450000, "mâm 4 người", "Phục vụ theo lịch đặt")] },
      { id: "ca-suoi-nuong", name: "Cá suối nướng", description: "Cá nhỏ nướng giòn, chấm muối mắc khén.", price: "Từ 120.000đ", season: "Mùa khô", image: dishImages.fish, sellers: [demoSeller("bep-ao-gioi", "Bếp Ao Giời — gian hàng mẫu", "Quân Khê, Hạ Hòa, Phú Thọ", "02106999999", 120000, "suất", "10:00 – 20:00")] },
    ],
  },
  {
    id: "thanh-thuy",
    label: "Thanh Thủy",
    subtitle: "Cá sông Đà và bữa ăn nghỉ dưỡng",
    dishes: [
      { id: "ca-song-da", name: "Cá sông Đà", description: "Thịt ngọt chắc, hợp nướng, om hoặc lẩu.", price: "Từ 220.000đ", season: "Quanh năm", image: dishImages.fish, sellers: [demoSeller("bep-song-da", "Bếp sông Đà — gian hàng mẫu", "La Phù, Thanh Thủy, Phú Thọ", "02106111111", 220000, "suất", "10:00 – 21:30")] },
      { id: "de-nui-da", name: "Dê núi đá", description: "Thịt thơm, thường tái chanh, hấp hoặc nướng.", price: "Từ 180.000đ", season: "Quanh năm", image: dishImages.ga, sellers: [demoSeller("de-thanh-thuy", "Bếp dê Thanh Thủy — gian hàng mẫu", "Trung tâm Thanh Thủy, Phú Thọ", "02106222222", 180000, "đĩa", "10:00 – 22:00")] },
    ],
  },
];

export const categoryIcons: Record<Category, string> = {
  "Tất cả": "⌘",
  "Di sản & tâm linh": "◇",
  "Núi rừng & sinh thái": "♧",
  "Nghỉ dưỡng & chữa lành": "◌",
  "Văn hóa & làng nghề": "◎",
  "Check-in & vui chơi": "✦",
};
