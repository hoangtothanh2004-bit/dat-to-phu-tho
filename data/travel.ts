export const categoryLabels = [
  "Tất cả",
  "Di sản & tâm linh",
  "Núi rừng & sinh thái",
  "Nghỉ dưỡng & chữa lành",
  "Văn hóa & làng nghề",
  "Check-in & vui chơi",
] as const;

export const regionLabels = [
  "Tất cả",
  "Phú Thọ",
  "Vĩnh Phúc",
  "Hòa Bình",
] as const;

export type Category = (typeof categoryLabels)[number];
export type PlaceCategory = Exclude<Category, "Tất cả">;
export type Region = (typeof regionLabels)[number];
export type PlaceRegion = Exclude<Region, "Tất cả">;

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
  priceRange?: string;
};

export type TransportTip = {
  recommendedVehicle: string;
  routeAdvice: string;
  caution: string;
};

export type Place = {
  id: string;
  name: string;
  nameEn?: string;
  shortName: string;
  category: PlaceCategory;
  region: PlaceRegion;
  district: string;
  location: string;
  locationEn?: string;
  image: string;
  imageCredit: string;
  rating: number;
  reviews: number;
  hours: string;
  price: string;
  description: string;
  tags: string[];
  highlights: string[];
  highlightsEn?: string[];
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
  audioScriptEn?: string;
  restaurants: NearbyItem[];
  stays: NearbyItem[];
  transportTips?: TransportTip;
};

export type DirectoryPlace = {
  stt: string;
  district: string;
  name: string;
  category: string;
  location: string;
  restaurants: string;
  stays: string;
  distance: string;
  notes: string;
};

const foodPhoto = "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=82";
const fishPhoto = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82";
const meatPhoto = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82";
const homestayPhoto = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=82";
const hotelPhoto = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82";
const resortPhoto = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=82";

export const places: Place[] = [
  // ==================== PHÚ THỌ LÕI (ĐẤT TỔ) ====================
  {
    id: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    shortName: "Đền Hùng",
    category: "Di sản & tâm linh",
    region: "Phú Thọ",
    district: "Việt Trì",
    location: "xã Hy Cương, tỉnh Phú Thọ",
    locationEn: "Hy Cương, Phu Tho",
    image: "/images/places/den-hung.png",
    imageCredit: "Khu di tích lịch sử Đền Hùng",
    rating: 4.9,
    reviews: 2840,
    hours: "06:00 – 18:00 hàng ngày",
    price: "Vào cổng miễn phí (xe điện 20.000đ/lượt)",
    description: "Quần thể đền thờ các Vua Hùng trên núi Nghĩa Lĩnh, trung tâm thực hành Tín ngưỡng thờ cúng Hùng Vương - Di sản văn hóa phi vật thể đại diện của nhân loại.",
    tags: ["Di sản", "Tín ngưỡng", "Gia đình", "Lịch sử"],
    highlights: ["Đền Hạ – Trung – Thượng", "Lăng Hùng Vương", "Bảo tàng Hùng Vương", "Đền Quốc Tổ Lạc Long Quân"],
    highlightsEn: ["Ha - Trung - Thuong Temples", "Hung King Mausoleum", "Hung King Museum", "Lac Long Quan Temple"],
    bestTime: "06:30 – 09:30 hoặc sau 15:30",
    season: "Đẹp quanh năm; cao điểm Giỗ Tổ 10/3 âm lịch",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "3 – 4 giờ",
    distanceFromVietTri: 10,
    travelFromVietTri: "20 phút bằng ô tô",
    bestStart: "07:00",
    warning: "Dịp lễ hội rất đông; nên mang giày thể thao đế bám tốt vì có hơn 500 bậc đá lên đỉnh Nghĩa Lĩnh.",
    lat: 21.366,
    lng: 105.3246,
    featured: true,
    audioScript: "Khu di tích lịch sử Đền Hùng nằm trên núi Nghĩa Lĩnh, bắt đầu từ Cổng chính xây dựng năm 1917 với dòng chữ 'Cao sơn cảnh hành'. Tuyến hành hương dẫn lên Đền Hạ nơi gắn liền với truyền thuyết Mẹ Âu Cơ sinh bọc trăm trứng, cội nguồn hai tiếng 'đồng bào' và 'Con Rồng, cháu Tiên'. Cạnh đó là Chùa Thiên Quang với cây vạn tuế 800 năm tuổi. Tiếp tục leo 159 bậc đá là Đền Trung nơi Vua Hùng bàn việc nước gắn với sự tích bánh chưng bánh giầy Lang Liêu. Vượt tiếp 100 bậc lên Đền Thượng Kính Thiên Lĩnh Điện trên đỉnh núi cao nhất – trung tâm Tín ngưỡng thờ cúng Hùng Vương được UNESCO vinh danh Di sản nhân loại, rồi xuống viếng Lăng Hùng Vương thứ sáu, Đền Giếng hai nàng công chúa Tiên Dung - Ngọc Hoa và Bảo tàng Hùng Vương.",
    audioScriptEn: "Hung Kings Temple on Mount Nghia Linh begins at the 1917 Main Gate inscribed with 'Cao Son Canh Hanh'. Ascend stone steps to Ha Temple celebrating Mother Au Co's hundred-egg sac, Thien Quang Pagoda with its 800-year-old cycad tree, Trung Temple honoring Lang Liêu's square and round cakes, and Thuong Temple at the summit for UNESCO-inscribed ancestral rites, followed by the 6th King's Mausoleum, Gieng Temple, and the Hung Kings Museum.",
    restaurants: [
      {
        name: "Nhà hàng A Thảo Gà cựa",
        type: "Đặc sản Đất Tổ",
        distance: "8,5 km",
        travelTime: "18 phút",
        note: "Gà nhiều cựa hấp lá chanh, cá lăng sông Đà, rau sắn chua om tép",
        taste: "Thịt gà săn chắc, ngọt tự nhiên; cá nướng thơm đậm đà gia vị núi rừng.",
        address: "235 Tiên Dung, P. Tiên Cát, TP. Việt Trì",
        hours: "09:00 – 22:00",
        phone: "0913282120",
        rating: 4.8,
        reviewCount: 126,
        image: foodPhoto,
        priceRange: "150.000 – 300.000đ/người",
      },
      {
        name: "Quán cá Hạc Trì",
        type: "Cá sông Lô – sông Thao",
        distance: "7,8 km",
        travelTime: "16 phút",
        note: "Cá lăng nướng than, cá quất om chuối đậu, lẩu cá ngạnh",
        taste: "Thịt cá sông tự nhiên giòn béo ngậy, nước om chua thanh đậm đà.",
        address: "398 Lạc Long Quân, P. Thanh Miếu, TP. Việt Trì",
        hours: "10:00 – 22:30",
        phone: "0983398468",
        rating: 4.7,
        reviewCount: 94,
        image: fishPhoto,
        priceRange: "200.000 – 400.000đ/người",
      }
    ],
    stays: [
      {
        name: "Mường Thanh Luxury Phú Thọ",
        type: "Khách sạn 5 sao",
        distance: "8,1 km",
        travelTime: "17 phút",
        note: "Phòng hạng sang · Hồ bơi ngoài trời · Bữa sáng buffet phong phú",
        address: "Lô CC17, đường Hùng Vương, P. Gia Cẩm, TP. Việt Trì",
        hours: "Lễ tân 24/7",
        phone: "02103616666",
        rating: 4.7,
        reviewCount: 740,
        image: hotelPhoto,
        priceRange: "1.100.000 – 2.200.000đ/đêm",
      },
      {
        name: "Sài Gòn – Phú Thọ Hotel",
        type: "Khách sạn 4 sao",
        distance: "7,4 km",
        travelTime: "15 phút",
        note: "Trung tâm TP. Việt Trì · View hồ nước · Tiện ích đầy đủ",
        address: "17A đường Trần Phú, P. Gia Cẩm, TP. Việt Trì",
        hours: "Lễ tân 24/7",
        phone: "02103626666",
        rating: 4.5,
        reviewCount: 420,
        image: hotelPhoto,
        priceRange: "750.000 – 1.400.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng hoặc xe du lịch",
      routeAdvice: "Từ Hà Nội theo cao tốc Nội Bài - Lào Cai rẽ nút giao IC7 ra TP. Việt Trì, chạy tiếp 7 km đường Nguyễn Tất Thành là tới cổng Đền Hùng.",
      caution: "Bãi đỗ xe trung tâm rất rộng; giữ vé xe cẩn thận và lưu ý vị trí đỗ xe dịp lễ."
    }
  },
  {
    id: "xuan-son",
    name: "Vườn quốc gia Xuân Sơn",
    nameEn: "Xuan Son National Park",
    shortName: "Xuân Sơn",
    category: "Núi rừng & sinh thái",
    region: "Phú Thọ",
    district: "Tân Sơn",
    location: "xã Xuân Đài, tỉnh Phú Thọ",
    locationEn: "Xuan Dai, Phu Tho",
    image: "/images/places/xuan-son.png",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.8,
    reviews: 968,
    hours: "Mở cả ngày; khuyến khích trekking ban ngày",
    price: "Vé tham quan 40.000đ/người",
    description: "Rừng nguyên sinh trên núi đá vôi, hang Lạng, hang Thổ Thần, suối trong vắt và văn hóa đặc sắc của đồng bào Dao Tiền, Mường ở Bản Cỏi và Bản Dù.",
    tags: ["Trekking", "Bản Cỏi", "Hang động", "Dao – Mường"],
    highlights: ["Rừng nguyên sinh núi đá vôi", "Bản Cỏi – bản Dù", "Hang Lạng – Hang Na", "Tắm suối và cỗ lá người Dao"],
    highlightsEn: ["Limestone primary forest", "Coi & Du Villages", "Lang Cave - Na Cave", "Stream bathing & Dao ethnic cuisine"],
    bestTime: "07:00 – 16:30; bắt đầu trekking trước 14:00",
    season: "Tháng 3 – 5 và 9 – 11 thời tiết mát mẻ khô ráo",
    seasonMonths: [3, 4, 5, 9, 10, 11],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 80,
    travelFromVietTri: "Khoảng 2 giờ 15 phút lái xe",
    bestStart: "07:30",
    warning: "Đường rừng có độ dốc; hãy đi theo hướng dẫn viên bản địa và không tự ý vào hang sâu khi trời mưa to.",
    lat: 21.1506,
    lng: 104.9327,
    featured: true,
    audioScript: "Chào mừng quý khách đến với Vườn Quốc gia Xuân Sơn - lá phổi xanh của vùng Tây Bắc Phú Thọ. Nơi đây sở hữu kiểu rừng nguyên sinh trên núi đá vôi độc đáo, cùng các bản làng người Dao Tiền còn lưu giữ nguyên vẹn nếp nhà sàn, nghề nhuộm chàm và ẩm thực cỗ lá đặc sắc.",
    audioScriptEn: "Welcome to Xuan Son National Park, the primary limestone rainforest sanctuary in Phu Tho. Here, untouched primeval forests, pristine waterfalls, Lang Cave, and authentic Dao and Muong ethnic villages like Ban Coi and Ban Du offer an unforgettable eco-trekking experience.",
    restaurants: [
      {
        name: "Cơm nhà sàn Bản Cỏi",
        type: "Ẩm thực Mường – Dao",
        distance: "0,5 km",
        travelTime: "3 phút",
        note: "Gà nhiều cựa nướng mắc khén, cá suối chiên giòn, xôi nếp nương ngũ sắc",
        taste: "Vị thơm nồng của hạt dổi, mắc khén rừng quyện cùng vị ngọt chắc của gà bản.",
        address: "Bản Cỏi, xã Xuân Sơn, Tân Sơn",
        hours: "08:00 – 21:00 (Nên gọi trước)",
        phone: "0983124567",
        rating: 4.8,
        reviewCount: 88,
        image: foodPhoto,
        priceRange: "120.000 – 200.000đ/người",
      }
    ],
    stays: [
      {
        name: "Homestay Lâm Bản Dù",
        type: "Homestay nhà sàn gỗ",
        distance: "0,8 km",
        travelTime: "5 phút",
        note: "Nhà sàn nhìn ra suối · Trải nghiệm văn hóa Dao · Đốt lửa trại buổi tối",
        address: "Bản Dù, xã Xuân Sơn, Tân Sơn",
        hours: "Nhận phòng 14:00, Trả phòng 12:00",
        phone: "0976543210",
        rating: 4.7,
        reviewCount: 95,
        image: homestayPhoto,
        priceRange: "150.000 – 350.000đ/người",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô gầm cao hoặc xe máy phượt",
      routeAdvice: "Theo QL32 từ Việt Trì qua Thanh Sơn lên Tân Sơn, rẽ vào đường tỉnh DT316 vào vùng lõi VQG Xuân Sơn.",
      caution: "Đoạn đường đèo vào bản có khúc cua dốc, lái xe chú ý giảm tốc độ và bóp còi khi vào cua khuất tầm nhìn."
    }
  },
  {
    id: "long-coc",
    name: "Đồi chè Long Cốc",
    shortName: "Long Cốc",
    category: "Check-in & vui chơi",
    region: "Phú Thọ",
    district: "Tân Sơn",
    location: "xã Long Cốc, tỉnh Phú Thọ",
    locationEn: "Long Cốc, Phu Tho",
    image: "/images/places/long-coc.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.9,
    reviews: 1420,
    hours: "Không gian mở cả ngày; ngắm bình minh 05:00 – 07:30",
    price: "Tham quan miễn phí; thuê trang phục 50.000đ",
    description: "Hàng trăm quả đồi chè hình bát úp uốn lượn ẩn hiện trong sương sớm, được mệnh danh là “vịnh Hạ Long vùng trung du” - thiên đường săn mây và nhiếp ảnh.",
    tags: ["Săn mây", "Bình minh", "Đồi chè", "Nhiếp ảnh"],
    highlights: ["Săn biển mây bình minh đồi chè", "Check-in đồi chè Đội 3, Đội 5", "Uống trà San Tuyết Long Cốc", "Trang phục dân tộc Mường"],
    bestTime: "05:15 – 08:00 (săn sương mây) hoặc 16:30 – 17:45 (hoàng hôn)",
    season: "Đẹp nhất từ tháng 9 đến tháng 12 và mùa xuân tháng 3 – 5",
    seasonMonths: [3, 4, 5, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: 70,
    travelFromVietTri: "Khoảng 1 giờ 45 phút",
    bestStart: "05:15",
    warning: "Nên đến từ chiều hôm trước ngủ lại homestay dưới chân đồi để sáng sớm dậy săn mây dễ dàng.",
    lat: 21.1804,
    lng: 105.0708,
    featured: true,
    audioScript: "Đồi chè Long Cốc là một trong những cảnh quan nông nghiệp kỳ vĩ nhất miền Bắc. Vào buổi sáng sớm mùa thu - đông, biển sương trắng bồng bềnh phủ ngang sườn đồi, chỉ nhô lên những chỏm chè xanh ngát như những chiếc ốc đảo thần tiên trong truyện cổ tích.",
    audioScriptEn: "Welcome to Long Coc Tea Hills in Tan Son, celebrated as one of Vietnam's most scenic undulating tea landscapes. In the early morning mist, hundreds of dome-shaped tea hills emerge like giant green tea bowls floating in an ocean of clouds.",
    restaurants: [
      {
        name: "Nhà hàng Bếp Mường Long Cốc",
        type: "Ẩm thực Mường",
        distance: "0,7 km",
        travelTime: "3 phút",
        note: "Cỗ lá lợn mán, măng xào thịt ba chỉ, canh rau sắn chua nấu cá",
        taste: "Hương vị đậm đà nguyên bản, rau hái tại vườn đồi tươi mát.",
        address: "Khu Măng 1, xã Long Cốc, Tân Sơn",
        hours: "07:00 – 21:00",
        phone: "0968987654",
        rating: 4.8,
        reviewCount: 112,
        image: foodPhoto,
        priceRange: "100.000 – 180.000đ/người",
      }
    ],
    stays: [
      {
        name: "Long Cốc Ecolodge",
        type: "Ecolodge sinh thái",
        distance: "0,9 km",
        travelTime: "4 phút",
        note: "View trực diện đồi chè bát úp · Ban công săn sương sớm · Đồ uống trà sạch",
        address: "Khu 3, xã Long Cốc, Tân Sơn",
        hours: "Lễ tân 24/7",
        phone: "0912345678",
        rating: 4.8,
        reviewCount: 130,
        image: resortPhoto,
        priceRange: "600.000 – 1.200.000đ/phòng",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô con hoặc xe máy",
      routeAdvice: "Theo quốc lộ 32 đến xã Thanh Sơn, rẽ đường đi Tân Sơn rồi theo biển chỉ dẫn vào xã Long Cốc. Đường nhựa đẹp tận chân đồi.",
      caution: "Đường lên đỉnh đồi chè có dốc đất bê tông nhỏ, đi xe máy tay ga cần giữ vững tay lái."
    }
  },
  {
    id: "thanh-thuy",
    name: "Suối khoáng nóng Thanh Thủy",
    shortName: "Khoáng nóng Thanh Thủy",
    category: "Nghỉ dưỡng & chữa lành",
    region: "Phú Thọ",
    district: "Thanh Thủy",
    location: "xã Thanh Thủy, tỉnh Phú Thọ",
    locationEn: "Thanh Thuy town, Phu Tho province",
    image: "/images/places/thanh-thuy.jpg",
    imageCredit: "Khu nghỉ dưỡng khoáng nóng Thanh Thủy",
    rating: 4.8,
    reviews: 1890,
    hours: "Mở cửa hàng ngày từ 07:30 – 22:00",
    price: "Vé tắm khoáng từ 150.000đ – 450.000đ/người",
    description: "Nguồn khoáng nóng tự nhiên giàu Radon quý hiếm bên bờ sông Đà, nhiệt độ từ 37°C – 53°C có tác dụng trị liệu xương khớp, lưu thông khí huyết và tái tạo năng lượng.",
    tags: ["Khoáng nóng", "Nghỉ dưỡng", "Chữa lành", "Gia đình", "Trị liệu"],
    highlights: ["Tắm khoáng nóng Radon tự nhiên", "Ngâm khoáng thảo dược", "Wyndham Lynn Times", "Ẩm thực cá ngạnh sông Đà"],
    bestTime: "08:00 – 11:00 hoặc 15:00 – 19:00",
    season: "Đặc biệt lý tưởng vào mùa thu đông và đầu xuân (tháng 10 – tháng 4)",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "Nửa ngày đến 2 ngày 1 đêm",
    distanceFromVietTri: 42,
    travelFromVietTri: "Khoảng 55 phút ô tô",
    bestStart: "08:30",
    warning: "Không nên tắm khoáng nóng khi vừa uống rượu bia hoặc ăn quá no; mỗi lượt ngâm 15-20 phút rồi nghỉ.",
    lat: 21.1511,
    lng: 105.2971,
    featured: true,
    audioScript: "Khu du lịch khoáng nóng Thanh Thủy nằm uốn mình bên dòng sông Đà hùng vĩ. Mạch nước nóng ngầm tự nhiên chứa hàm lượng chất khoáng cao và khí Radon quý hiếm, giúp cơ thể thư giãn sâu và phục hồi sức khỏe tuyệt vời sau những ngày làm việc bận rộn.",
    audioScriptEn: "Welcome to Thanh Thuy Hot Mineral Spring Resort. Rich in natural radon and therapeutic minerals heated by geothermal activity, this destination provides premier natural mineral wellness and therapeutic retreats.",
    restaurants: [
      {
        name: "Nhà hàng Sông Đà Thanh Thủy",
        type: "Cá sông & Đặc sản đồng quê",
        distance: "0,6 km",
        travelTime: "3 phút",
        note: "Cá lăng nướng riềng mẻ, cá ngạnh om chuối đậu, gà đồi hấp muối",
        taste: "Cá tươi sống bắt tại bè sông Đà, nướng giòn da ngọt thịt thơm phức.",
        address: "xã Thanh Thủy, tỉnh Phú Thọ",
        hours: "09:30 – 22:00",
        phone: "02103876543",
        rating: 4.7,
        reviewCount: 165,
        image: fishPhoto,
        priceRange: "180.000 – 350.000đ/người",
      }
    ],
    stays: [
      {
        name: "Wyndham Lynn Times Thanh Thủy",
        type: "Tổ hợp Nghỉ dưỡng khoáng nóng 5 sao",
        distance: "0,3 km",
        travelTime: "2 phút",
        note: "Công viên khoáng nóng thiên nhiên cao cấp · Căn hộ khách sạn sang trọng · Trị liệu chăm sóc sức khỏe",
        address: "xã Thanh Thủy, tỉnh Phú Thọ",
        hours: "Lễ tân 24/7",
        phone: "02103688888",
        rating: 4.8,
        reviewCount: 890,
        image: resortPhoto,
        priceRange: "1.400.000 – 3.200.000đ/đêm",
      },
      {
        name: "Vườn Vua Resort & Villas",
        type: "Resort sinh thái nghỉ dưỡng",
        distance: "7,5 km",
        travelTime: "12 phút",
        note: "Biệt thự ven đầm sen Bạch Thủy · Bể bơi khoáng nóng ngoài trời · Không gian xanh",
        address: "xã Đồng Trung, tỉnh Phú Thọ",
        hours: "Lễ tân 24/7",
        phone: "0902888666",
        rating: 4.6,
        reviewCount: 650,
        image: resortPhoto,
        priceRange: "1.200.000 – 2.800.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng, xe khách hoặc Limousine đưa đón tận nơi",
      routeAdvice: "Từ Hà Nội theo Đại lộ Thăng Long qua cầu Đồng Quang là sang đất Thanh Thủy, đường êm chỉ mất 1 giờ 15 phút di chuyển.",
      caution: "Đường tỉnh lộ 317 mặt đường phẳng đẹp; các resort đều có trạm sạc xe điện và bãi đỗ xe rộng."
    }
  },
  {
    id: "dao-ngoc-xanh",
    name: "Khu du lịch Đảo Ngọc Xanh",
    shortName: "Đảo Ngọc Xanh",
    category: "Check-in & vui chơi",
    region: "Phú Thọ",
    district: "Thanh Thủy",
    location: "xã Thanh Thủy, tỉnh Phú Thọ",
    locationEn: "Thanh Thuy town, Phu Tho province",
    image: "/images/places/dao-ngoc-xanh.jpg",
    imageCredit: "Khu du lịch sinh thái Đảo Ngọc Xanh",
    rating: 4.8,
    reviews: 2150,
    hours: "07:00 – 18:00 hàng ngày",
    price: "Vé trọn gói: 150.000đ/trẻ em – 200.000đ/người lớn",
    description: "Được bồi đắp bởi phù sa sông Đà, Đảo Ngọc Xanh là thiên đường vui chơi giải trí và sinh thái hàng đầu Đất Tổ. Nơi hội tụ công viên nước hiện đại, các trò chơi cảm giác mạnh, vườn hoa sinh thái bốn mùa và hệ thống khoáng nóng trị liệu dưỡng sinh tuyệt hảo.",
    tags: ["Đảo Ngọc Xanh", "Vui chơi giải trí", "Công viên nước", "Cảm giác mạnh", "Gia đình", "Khoáng nóng"],
    highlights: ["Công viên nước và hồ tạo sóng khổng lồ", "Tổ hợp trò chơi cảm giác mạnh hiện đại", "Bể tắm khoáng nóng dưỡng sinh thư giãn", "Vườn hoa sinh thái & công viên khủng long"],
    bestTime: "08:00 – 17:00 (Thích hợp vui chơi cả ngày)",
    season: "Lý tưởng quanh năm, đặc biệt rực rỡ từ tháng 4 đến tháng 9",
    seasonMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 42,
    travelFromVietTri: "Khoảng 50 phút ô tô",
    bestStart: "08:00",
    warning: "Tuân thủ hướng dẫn an toàn tại các trò chơi cảm giác mạnh; mang theo đồ bơi và kem chống nắng khi tham gia công viên nước.",
    lat: 21.1689,
    lng: 105.3023,
    featured: true,
    audioScript: "Chào mừng quý khách đến với Khu du lịch Đảo Ngọc Xanh, hòn đảo ngọc xanh biếc bồng bềnh giữa dòng sông Đà thơ mộng. Đến đây, du khách sẽ được thỏa sức trải nghiệm hàng chục trò chơi giải trí cảm giác mạnh, hòa mình trong làn nước mát rượi của công viên nước, dạo bước giữa vườn hoa rực rỡ và thư thái ngâm mình trong dòng khoáng nóng thiên nhiên.",
    audioScriptEn: "Welcome to Dao Ngoc Xanh Ecotourism and Amusement Park, an emerald oasis nestled amidst the scenic Da River. Featuring a thrilling modern theme park, giant water wave pools, blooming ecological gardens, and revitalizing hot mineral baths, it is the ideal getaway for families and adventurers alike.",
    restaurants: [
      {
        name: "Nhà hàng Đảo Ngọc Xanh",
        type: "Ẩm thực sinh thái sông Đà",
        distance: "0,1 km",
        travelTime: "1 phút đi bộ",
        note: "Cá lăng nướng than hoa, gà đồi hấp lá chanh, lợn mán nướng mắc khén",
        taste: "Nguyên liệu tươi ngon phục vụ du khách tham quan trong khuôn viên khu du lịch.",
        address: "Khu du lịch Đảo Ngọc Xanh, xã Thanh Thủy, tỉnh Phú Thọ",
        hours: "08:00 – 21:00",
        phone: "02103689999",
        rating: 4.8,
        reviewCount: 380,
        image: foodPhoto,
        priceRange: "150.000 – 300.000đ/người",
      }
    ],
    stays: [
      {
        name: "Khách sạn Kim Cương - Đảo Ngọc Xanh",
        type: "Khách sạn nghỉ dưỡng 3 sao tiêu chuẩn",
        distance: "0,1 km",
        travelTime: "1 phút đi bộ",
        note: "Nằm ngay trong khuôn viên đảo · Miễn phí vé tắm khoáng · Phòng view sông Đà mát lành",
        address: "Khu du lịch Đảo Ngọc Xanh, xã Thanh Thủy, tỉnh Phú Thọ",
        hours: "Lễ tân 24/7",
        phone: "02103689888",
        rating: 4.7,
        reviewCount: 520,
        image: resortPhoto,
        priceRange: "600.000 – 1.200.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng, xe khách du lịch hoặc xe máy phượt",
      routeAdvice: "Từ Hà Nội hoặc Việt Trì đi theo hướng QL32 qua cầu Trung Hà rẽ trái vào xã Thanh Thủy khoảng 10km.",
      caution: "Cuối tuần lượng khách gia đình khá đông, nên đặt vé và phòng trước."
    }
  },
  {
    id: "hung-lo",
    name: "Làng cổ & Đình cổ Hùng Lô",
    shortName: "Làng cổ Hùng Lô",
    category: "Văn hóa & làng nghề",
    region: "Phú Thọ",
    district: "Việt Trì",
    location: "phường Vân Phú, tỉnh Phú Thọ",
    locationEn: "Vân Phú, Phu Tho",
    image: "/images/places/hung-lo.jpg",
    imageCredit: "Cổng thông tin du lịch Phú Thọ",
    rating: 4.7,
    reviews: 580,
    hours: "07:30 – 17:30 hàng ngày",
    price: "Tham quan miễn phí; xem biểu diễn Hát Xoan theo đoàn đăng ký trước",
    description: "Quần thể đình cổ hơn 300 năm tuổi lưu giữ nguyên vẹn nghệ thuật chạm khắc gỗ thời Hậu Lê, làng nghề làm mì gạo truyền thống và cái nôi di sản Hát Xoan Phú Thọ.",
    tags: ["Hát Xoan", "Làng cổ", "Đình cổ", "Mì gạo", "Di sản UNESCO"],
    highlights: ["Chiêm bái Đình cổ Hùng Lô", "Thưởng thức làn điệu Hát Xoan", "Trải nghiệm làm mì gạo Hùng Lô", "Nhà cổ trăm năm ven sông Lô"],
    bestTime: "08:30 – 11:00 hoặc 14:30 – 17:00",
    season: "Đẹp quanh năm; mùa hội làng tháng Giêng và tháng Ba âm lịch",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: 7,
    travelFromVietTri: "12 phút lái xe",
    bestStart: "09:00",
    warning: "Nên liên hệ trước với ban quản lý đình nếu muốn xem nghệ nhân biểu diễn canh Hát Xoan trọn vẹn.",
    lat: 21.3712,
    lng: 105.4077,
    audioScript: "Đình Hùng Lô là viên ngọc quý của kiến trúc điêu khắc dân gian Việt Nam thế kỷ 17. Đình thờ Vua Hùng và các vị thần che chở xóm làng. Tại khoảng sân đình rợp bóng cây cổ thụ này, du khách sẽ được lắng nghe những câu Hát Xoan mượt mà, di sản văn hóa phi vật thể đại diện của nhân loại được UNESCO vinh danh.",
    audioScriptEn: "Welcome to Hung Lo Ancient Village and its 300-year-old communal house on the banks of Lo River. Here, visitors admire intricate wood carvings, ancient brick alleyways, and listen to the UNESCO-recognized Xoan singing heritage.",
    restaurants: [
      {
        name: "Nhà cổ Hùng Lô ẩm thực dân gian",
        type: "Cơm quê truyền thống",
        distance: "0,3 km",
        travelTime: "2 phút",
        note: "Mì gạo Hùng Lô xào lòng gà, bánh chưng gù, canh cá nấu chua mầm măng",
        taste: "Sợi mì gạo dai mộc mạc thơm mùi gạo quê, món ăn thanh tao mộc mạc.",
        address: "Khu 4, xã Hùng Lô, TP. Việt Trì",
        hours: "08:00 – 19:00",
        phone: "0978901234",
        rating: 4.7,
        reviewCount: 65,
        image: foodPhoto,
        priceRange: "80.000 – 150.000đ/người",
      }
    ],
    stays: [
      {
        name: "Khách sạn Sài Gòn Phú Thọ",
        type: "Khách sạn trung tâm",
        distance: "6,5 km",
        travelTime: "12 phút",
        note: "Khách sạn 4 sao gần Hùng Lô và trung tâm ẩm thực TP. Việt Trì",
        address: "17A Trần Phú, P. Gia Cẩm, TP. Việt Trì",
        hours: "Lễ tân 24/7",
        phone: "02103626666",
        rating: 4.5,
        reviewCount: 380,
        image: hotelPhoto,
        priceRange: "750.000 – 1.300.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô, taxi hoặc xe máy",
      routeAdvice: "Từ trung tâm TP. Việt Trì đi dọc đê sông Lô khoảng 6 km là vào đến cổng làng cổ Hùng Lô.",
      caution: "Đường làng bê tông sạch đẹp nhưng có một số khúc cua ngõ nhỏ, ô tô trên 29 chỗ đỗ ở sân trung tâm văn hóa xã."
    }
  },
  {
    id: "den-mau-au-co",
    name: "Đền Mẫu Âu Cơ Hạ Hòa",
    shortName: "Đền Mẫu Âu Cơ",
    category: "Di sản & tâm linh",
    region: "Phú Thọ",
    district: "Hạ Hòa",
    location: "xã Hiền Lương, tỉnh Phú Thọ",
    locationEn: "Hiền Lương, Ha Hoa",
    image: "/images/places/den-mau-au-co.jpg",
    imageCredit: "Trung tâm TTXT Du lịch Phú Thọ",
    rating: 4.8,
    reviews: 920,
    hours: "06:30 – 18:00 hàng ngày",
    price: "Tham quan miễn phí",
    description: "Nơi thờ Quốc Mẫu Âu Cơ - người Mẹ huyền thoại của muôn dân đất Việt, tọa lạc giữa cảnh quan núi non hữu tình bên tả ngạn sông Thao.",
    tags: ["Tâm linh", "Lịch sử", "Quốc Mẫu", "Lễ hội Mẫu"],
    highlights: ["Đền chính thờ Mẫu Âu Cơ", "Cây đa cổ thụ linh thiêng", "Lễ hội Mẫu Âu Cơ mùng 7 tháng Giêng", "Vãn cảnh bờ sông Thao"],
    bestTime: "07:30 – 10:30 hoặc 14:00 – 16:30",
    season: "Lễ hội chính mùng 7 tháng Giêng âm lịch; đẹp quanh năm",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "1,5 – 2 giờ",
    distanceFromVietTri: 65,
    travelFromVietTri: "Khoảng 1 giờ lái xe qua cao tốc Nội Bài - Lào Cai (IC10)",
    bestStart: "08:00",
    lat: 21.5794,
    lng: 105.0212,
    audioScript: "Đền Mẫu Âu Cơ nằm tại xã Hiền Lương, huyện Hạ Hòa là chốn linh thiêng phụng thờ Người Mẹ đầu tiên của trăm họ Việt. Truyền thuyết kể rằng sau khi chia 50 người con lên rừng và 50 người con xuống biển, Mẹ Âu Cơ đã dừng chân khai khẩn đất hoang tại vùng đất trù phú này trước khi bay về trời.",
    audioScriptEn: "Welcome to Mother Au Co Temple in Hien Luong, Ha Hoa. Nestled beneath sacred banyan trees beside the Red River, this temple is dedicated to the Great Mother Au Co, celebrating the primordial legend of the Dragon and Fairy heritage.",
    restaurants: [
      {
        name: "Nhà hàng Đầm Ao Châu",
        type: "Cá đầm & Thủy sản tự nhiên",
        distance: "11 km",
        travelTime: "15 phút",
        note: "Cá quả nướng rơm, ốc đầm hấp lá gừng, vịt bầu Hạ Hòa",
        taste: "Cá đầm tự nhiên chắc nịch ngọt nước, vị đậm đà thơm mùi đồng nội.",
        address: "Khu 4, xã Hạ Hòa",
        hours: "09:00 – 21:00",
        phone: "0982345671",
        rating: 4.6,
        reviewCount: 78,
        image: fishPhoto,
        priceRange: "120.000 – 220.000đ/người",
      }
    ],
    stays: [
      {
        name: "Khách sạn Sông Thao Hạ Hòa",
        type: "Khách sạn trung tâm xã",
        distance: "10 km",
        travelTime: "14 phút",
        note: "Phòng nghỉ tiện nghi · Gần ga Hạ Hòa và nút giao cao tốc IC10",
        address: "Khu 3, xã Hạ Hòa",
        hours: "Lễ tân 24/7",
        phone: "02103888999",
        rating: 4.3,
        reviewCount: 80,
        image: hotelPhoto,
        priceRange: "350.000 – 600.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng qua cao tốc hoặc tàu hỏa Hà Nội - Lào Cai",
      routeAdvice: "Chạy cao tốc Nội Bài - Lào Cai, thoát tại nút giao IC10 đi tiếp 7 km đường tỉnh là đến đền.",
      caution: "Đường vào bãi đỗ xe Đền Mẫu thoáng rộng, có dịch vụ xe điện phục vụ người cao tuổi."
    }
  },
  {
    id: "dam-ao-chau",
    name: "Khu du lịch sinh thái Đầm Ao Châu",
    shortName: "Đầm Ao Châu",
    category: "Núi rừng & sinh thái",
    region: "Phú Thọ",
    district: "Hạ Hòa",
    location: "xã Hạ Hòa, tỉnh Phú Thọ",
    locationEn: "Ha Hoa, Phu Tho",
    image: "/images/places/dam-ao-chau.jpg",
    imageCredit: "Cổng thông tin du lịch Phú Thọ",
    rating: 4.7,
    reviews: 640,
    hours: "Mở cả ngày; thuê thuyền 07:00 – 17:30",
    price: "Vé thuyền tham quan đảo từ 60.000 – 120.000đ/người",
    description: "Được ví như “vịnh Hạ Long thu nhỏ trên vùng trung du”, đầm rộng hơn 300 ha với 99 ngách nước len lỏi giữa hàng trăm hòn đảo đồi xanh ngát bốn mùa.",
    tags: ["Sinh thái", "Du thuyền", "Đảo xanh", "Nghỉ dưỡng"],
    highlights: ["Đi thuyền ngắm 99 ngách nước", "Thưởng thức trái cây đồi đảo", "Câu cá giải trí ven đầm", "Ngắm hoàng hôn trên mặt nước"],
    bestTime: "08:00 – 11:00 hoặc 15:00 – 17:30",
    season: "Mùa hè và thu (tháng 5 – tháng 10) nước đầm trong xanh nhất",
    seasonMonths: [5, 6, 7, 8, 9, 10],
    duration: "3 – 5 giờ",
    distanceFromVietTri: 72,
    travelFromVietTri: "Khoảng 1 giờ 10 phút ô tô",
    bestStart: "09:00",
    lat: 21.5833,
    lng: 104.9833,
    audioScript: "Đầm Ao Châu là một kiệt tác tự nhiên nằm giữa vùng đồi bát úp của huyện Hạ Hòa. Mặt nước đầm quanh năm trong xanh phẳng lặng, soi bóng những vạt đồi trồng vải, mít và chè bạt ngàn. Ngồi trên mạn thuyền rẽ sóng qua từng ngách vịnh, du khách sẽ cảm nhận sự thanh bình thoát tục của đất trời trung du.",
    audioScriptEn: "Welcome to Ao Chau Lagoon in Ha Hoa, known as the Halong Bay of Phu Tho with 99 scenic branches, crystal clear waters, surrounding lush fruit hills, and boat eco-tours.",
    restaurants: [
      {
        name: "Ẩm thực Thuyền Chài Ao Châu",
        type: "Thủy sản & gà đồi",
        distance: "0,5 km",
        travelTime: "3 phút",
        note: "Cá chép đầm hấp bia, tôm đầm nướng mọi, gà ri thả đồi",
        taste: "Hải sản đầm nước ngọt béo bùi, rau tự trồng tươi ngon.",
        address: "Khu 5, xã Hạ Hòa",
        hours: "08:00 – 21:00",
        phone: "0973456789",
        rating: 4.6,
        reviewCount: 92,
        image: fishPhoto,
        priceRange: "150.000 – 250.000đ/người",
      }
    ],
    stays: [
      {
        name: "Ao Châu Homestay & Camping",
        type: "Homestay ven hồ & Lều trại",
        distance: "1,2 km",
        travelTime: "5 phút",
        note: "View trực diện mặt đầm · Lều Glamping · Tiệc nướng BBQ ngoài trời",
        address: "Khu Bến Thuyền, TT. Hạ Hòa",
        hours: "Lễ tân 24/7",
        phone: "0915678901",
        rating: 4.6,
        reviewCount: 88,
        image: homestayPhoto,
        priceRange: "300.000 – 700.000đ/phòng",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô hoặc xe máy",
      routeAdvice: "Đến xã Hạ Hòa rẽ vào bến thuyền Ao Châu, có bãi trông giữ xe ô tô an toàn.",
      caution: "Khi lên thuyền tham quan phải mặc áo phao cứu sinh đầy đủ theo hướng dẫn của thuyền trưởng."
    }
  },

  // ==================== VÙNG VĨNH PHÚC (TÀI LIỆU 2) ====================
  {
    id: "tam-dao",
    name: "Khu du lịch Quốc gia Tam Đảo",
    shortName: "Tam Đảo",
    category: "Nghỉ dưỡng & chữa lành",
    region: "Vĩnh Phúc",
    district: "Tam Đảo",
    location: "xã Tam Đảo, tỉnh Phú Thọ",
    locationEn: "Tam Dao, Phu Tho",
    image: "/images/places/tam-dao.jpg",
    imageCredit: "Cổng thông tin du lịch Tam Đảo",
    rating: 4.8,
    reviews: 3450,
    hours: "Không gian mở 24/7 quanh năm",
    price: "Vào xã Tam Đảo miễn phí; các điểm check-in từ 30.000 – 100.000đ",
    description: "Khu nghỉ dưỡng trên núi cao hơn 900m được người Pháp quy hoạch từ năm 1904. Khí hậu 4 mùa trong 1 ngày, bồng bềnh giữa biển mây mộng mơ cùng các di tích Nhà thờ đá, Tháp truyền hình, Cầu Mây.",
    tags: ["Xã Tam Đảo", "Khí hậu 4 mùa", "Check-in", "Nghỉ dưỡng", "Ẩm thực su su"],
    highlights: ["Quảng trường & Nhà thờ đá Tam Đảo", "Cầu Mây & Tổ hợp Check-in Quán Gió", "Thác Bạc & Cổng Trời", "Ngọn su su xào tỏi & Gà đồi đắp đất"],
    bestTime: "Sáng sớm săn mây 06:00 – 08:30 hoặc chiều hoàng hôn 16:30 – 18:00",
    season: "Đẹp cả 4 mùa; mùa hè tránh nóng, mùa đông săn mây bồng bềnh",
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    duration: "2 ngày 1 đêm hoặc 3 ngày 2 đêm",
    distanceFromVietTri: 45,
    travelFromVietTri: "Khoảng 1 giờ 10 phút lái xe",
    bestStart: "07:30",
    warning: "Đoạn đèo Tam Đảo dài 13 km dốc quanh co; xe máy tuyệt đối không dùng xe ga tắt máy thả trôi, ô tô về số thấp khi xuống đèo.",
    lat: 21.4583,
    lng: 105.6483,
    featured: true,
    audioScript: "Chào mừng quý khách đến với Tam Đảo trong sương. Tọa lạc trên dãy núi cao gần 1.000 mét so với mặt biển, Tam Đảo đón quý khách bằng bầu không khí mát rượi và sương mây bảng lảng quanh những tòa lâu đài đá cổ kính. Buổi tối dạo bước quanh quảng trường, thưởng thức xiên nướng nóng hổi và đĩa ngọn su su giòn ngọt sẽ là kỷ niệm khó quên.",
    audioScriptEn: "Welcome to the misty mountain resort town of Tam Dao, perched over 900 meters above sea level in Vinh Phuc. Enjoy four distinct seasons in a single day, stroll around the century-old stone church, and savor fresh local chayote greens and grilled hill chicken.",
    restaurants: [
      {
        name: "Nhà hàng Phúc Hương Viên Tam Đảo",
        type: "Đặc sản vùng cao Tam Đảo",
        distance: "0,3 km",
        travelTime: "2 phút",
        note: "Ngọn su su Tam Đảo xào tỏi, gà đồi bọc đất nướng than hoa, thịt lợn mán mẹt nướng riềng",
        taste: "Ngọn su su non giòn sần sật ngọt thanh, gà đồi thịt chắc thơm phức mùi khói than.",
        address: "Khu 1, xã Tam Đảo",
        hours: "09:00 – 23:00",
        phone: "0988654321",
        rating: 4.8,
        reviewCount: 310,
        image: foodPhoto,
        priceRange: "150.000 – 300.000đ/người",
      },
      {
        name: "Quán Gió Tam Đảo",
        type: "Cà phê ngắm mây & Ăn nhẹ",
        distance: "0,5 km",
        travelTime: "4 phút",
        note: "Quán cà phê trên vách núi ngắm trọn biển mây và thành phố lung linh về đêm",
        taste: "Cà phê trứng đậm đà, trà gừng mật ong nóng ấm giữa gió núi se lạnh.",
        address: "Thôn 1, xã Tam Đảo",
        hours: "07:00 – 23:00",
        phone: "0912888999",
        rating: 4.7,
        reviewCount: 560,
        image: foodPhoto,
        priceRange: "45.000 – 90.000đ/ly",
      }
    ],
    stays: [
      {
        name: "Venus Hotel Tam Đảo",
        type: "Khách sạn 4 sao phong cách Châu Âu",
        distance: "0,2 km",
        travelTime: "2 phút",
        note: "Bể bơi vô cực bốn mùa · View toàn cảnh núi mây · Trung tâm quảng trường",
        address: "Khu 1, xã Tam Đảo",
        hours: "Lễ tân 24/7",
        phone: "02113888999",
        rating: 4.7,
        reviewCount: 680,
        image: hotelPhoto,
        priceRange: "1.200.000 – 2.600.000đ/đêm",
      },
      {
        name: "Cầu Mây Homestay Tam Đảo",
        type: "Homestay săn mây view núi",
        distance: "1,5 km",
        travelTime: "6 phút",
        note: "Các căn bungalow kính giữa rừng thông · Sân nướng BBQ lộng gió · Giá trẻ trung",
        address: "Đường vào Thác Bạc, xã Tam Đảo",
        hours: "Lễ tân 24/7",
        phone: "0987111222",
        rating: 4.6,
        reviewCount: 410,
        image: homestayPhoto,
        priceRange: "450.000 – 950.000đ/căn",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô số tự động / số sàn khỏe, xe máy số hoặc xe Limousine Hà Nội - Tam Đảo",
      routeAdvice: "Từ Vĩnh Yên hoặc Việt Trì theo quốc lộ 2B lên dốc Tam Đảo, đường đèo 13 km đã rải nhựa đẹp và có gương cầu lồi.",
      caution: "Mùa sương mù tầm nhìn có thể dưới 10m, bật đèn sương mù và giữ khoảng cách an toàn."
    }
  },
  {
    id: "tay-thien",
    name: "Quần thể Di tích & Danh thắng Tây Thiên",
    shortName: "Tây Thiên",
    category: "Di sản & tâm linh",
    region: "Vĩnh Phúc",
    district: "Tam Đảo",
    location: "xã Đại Đình, tỉnh Phú Thọ",
    locationEn: "Đại Đình, Phu Tho",
    image: "/images/places/tay-thien.jpg",
    imageCredit: "Ban Quản lý Di tích Quốc gia đặc biệt Tây Thiên",
    rating: 4.9,
    reviews: 2150,
    hours: "06:00 – 18:00 hàng ngày",
    price: "Vào cổng tự do; Vé cáp treo khứ hồi 240.000đ/người lớn",
    description: "Trung tâm Phật giáo và tín ngưỡng thờ Mẫu lớn bậc nhất miền Bắc. Nơi giao hòa giữa đạo Mẫu Tam Phủ (Quốc Mẫu Tây Thiên Lăng Thị Tiêu) và Phật giáo Trúc Lâm với Thiền viện Trúc Lâm Tây Thiên và Đại Bảo tháp Mandala.",
    tags: ["Di tích Quốc gia đặc biệt", "Tâm linh", "Thiền viện", "Cáp treo", "Quốc Mẫu"],
    highlights: ["Đền Thỏng & Cây đa trăm tuổi", "Thiền viện Trúc Lâm Tây Thiên", "Đại Bảo tháp Mandala Tây Thiên", "Hệ thống cáp treo băng qua thung lũng rừng sâu"],
    highlightsEn: ["Truc Lam Zen Monastery", "Silver Waterfall", "Tay Thien Cable Car", "Quoc Mau Tay Thien Temple"],
    bestTime: "07:00 – 11:30 sáng",
    season: "Lễ hội xuân từ Rằm tháng Giêng đến hết tháng Ba âm lịch",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "4 – 6 giờ",
    distanceFromVietTri: 38,
    travelFromVietTri: "Khoảng 50 phút lái xe",
    bestStart: "07:30",
    warning: "Trang phục lịch sự khi vào đền chùa; leo núi bậc đá suối Giải Oan cần đi giày êm chân.",
    lat: 21.4688,
    lng: 105.6125,
    featured: true,
    audioScript: "Đến với Tây Thiên là đến với miền đất Phật, về với cội nguồn tâm linh thanh tịnh. Quý khách có thể lựa chọn hành hương bằng cáp treo lướt qua tán rừng nguyên sinh đại ngàn, chiêm bái Đền Thượng thờ Quốc Mẫu Tây Thiên trên đỉnh núi cao và lắng lòng trong tiếng chuông chùa Thiền viện Trúc Lâm.",
    audioScriptEn: "Welcome to the Tay Thien Scenic and Spiritual Relic Complex in Tam Dao, Vinh Phuc. Home to the great Truc Lam Tay Thien Zen Monastery and the Great Mandala Stupa, it is an auspicious sanctuary harmonizing Buddhism and Mother Goddess worship amidst cloud-capped peaks.",
    restaurants: [
      {
        name: "Nhà hàng Chân Núi Tây Thiên",
        type: "Cơm chay thanh tịnh & Đặc sản Tam Đảo",
        distance: "0,8 km",
        travelTime: "3 phút",
        note: "Mâm cơm chay dưỡng sinh 12 món, rau su su xào nấm hương, gà đồi hấp lá chanh",
        taste: "Vị thanh đạm, nguyên liệu rau củ sạch tươi ngon dưới chân núi.",
        address: "Khu vực Đền Thỏng, xã Đại Đình, Tam Đảo",
        hours: "07:30 – 20:00",
        phone: "0967333444",
        rating: 4.7,
        reviewCount: 145,
        image: foodPhoto,
        priceRange: "90.000 – 180.000đ/người",
      }
    ],
    stays: [
      {
        name: "Tây Thiên Retreat & Homestay",
        type: "Không gian nghỉ dưỡng thiền định",
        distance: "1,5 km",
        travelTime: "5 phút",
        note: "Không gian thanh tịnh dưới chân thông reo · Phù hợp nghỉ dưỡng phục hồi",
        address: "Đường vào Thiền Viện, xã Đại Đình, Tam Đảo",
        hours: "Lễ tân 24/7",
        phone: "0982555666",
        rating: 4.6,
        reviewCount: 110,
        image: homestayPhoto,
        priceRange: "400.000 – 800.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô, xe du lịch hoặc xe buýt từ Vĩnh Yên",
      routeAdvice: "Đường rộng 4 làn xe chạy thẳng từ QL2B vào cổng khu danh thắng Tây Thiên, bãi đỗ xe rộng rãi.",
      caution: "Nên mua vé cáp treo khứ hồi tại quầy vé trung tâm để tiết kiệm thời gian xếp hàng dịp lễ hội."
    }
  },
  {
    id: "ho-dai-lai",
    name: "Khu du lịch sinh thái Hồ Đại Lải",
    shortName: "Hồ Đại Lải",
    category: "Check-in & vui chơi",
    region: "Vĩnh Phúc",
    district: "Phúc Yên",
    location: "Phường Xuân Hòa, tỉnh Phú Thọ",
    locationEn: "Xuân Hòa, Phu Tho",
    image: "/images/places/ho-dai-lai.jpg",
    imageCredit: "Cổng thông tin xúc tiến du lịch Vĩnh Phúc",
    rating: 4.7,
    reviews: 1780,
    hours: "Mở cả ngày quanh năm",
    price: "Vé vào cổng hồ tự do; vé Flamingo Đại Lải theo gói dịch vụ",
    description: "Hồ nước ngọt nhân tạo rộng lớn với 525 ha mặt nước phẳng lặng, bao bọc bởi đồi thông reo và dãy núi Thằn Lằn. Quần thể sở hữu Flamingo Đại Lải Resort 5 sao đẳng cấp thế giới, Đảo Ngọc và nhiều hoạt động chèo SUP, kayak.",
    tags: ["Nghỉ dưỡng", "Chèo SUP", "Resort 5 sao", "Flamingo", "Thịt trâu Đại Lải"],
    highlights: ["Du thuyền hồ & Đảo Chim Đảo Ngọc", "Không gian nghệ thuật Flamingo Art in the Forest", "Chèo thuyền Kayak và SUP trên mặt hồ", "Đặc sản thịt trâu tươi xào lá lốt"],
    bestTime: "08:00 – 11:30 hoặc 15:00 – 18:30 ngắm hoàng hôn đỏ rực",
    season: "Đặc biệt sôi động vào mùa xuân hè (tháng 4 – tháng 10)",
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 48,
    travelFromVietTri: "Khoảng 1 giờ lái xe",
    bestStart: "08:30",
    lat: 21.3417,
    lng: 105.7194,
    audioScript: "Hồ Đại Lải là điểm hẹn nghỉ dưỡng tuyệt vời với mặt hồ mênh mông và rừng thông xanh rì rào trong gió. Tại đây, du khách có thể thảnh thơi chèo thuyền lướt sóng, đạp xe dưới tán rừng mát rượi và thưởng thức bữa tiệc ẩm thực trâu nướng thơm lừng bên bờ hồ thơ mộng.",
    audioScriptEn: "Welcome to Dai Lai Lake Eco-Tourism Area in Phuc Yen, Vinh Phuc. Spanning over 500 hectares surrounded by pine forests, bird sanctuaries, and luxury eco-resorts, it is a perfect weekend getaway for sailing, kayaking, and family retreats.",
    restaurants: [
      {
        name: "Nhà hàng Trâu Tươi Phi Xuyên Đại Lải",
        type: "Đặc sản thịt trâu nổi tiếng",
        distance: "1,2 km",
        travelTime: "4 phút",
        note: "Trâu nhúng mẻ, trâu nướng tảng than hoa, trâu xào rau muống giòn",
        taste: "Thịt trâu tươi rói ngọt mềm tự nhiên, gia vị tẩm ướp đậm đà khó cưỡng.",
        address: "Đường Nguyễn Tất Thành, xã Ngọc Thanh, TP. Phúc Yên",
        hours: "09:30 – 22:00",
        phone: "0913999888",
        rating: 4.8,
        reviewCount: 420,
        image: meatPhoto,
        priceRange: "150.000 – 280.000đ/người",
      }
    ],
    stays: [
      {
        name: "Flamingo Đại Lải Resort",
        type: "Resort 5 sao Quốc tế",
        distance: "0,5 km",
        travelTime: "2 phút",
        note: "Biệt thự rừng thông sang trọng · Bể bơi ốc đảo bốn mùa · Công viên nghệ thuật",
        address: "Thôn Ngọc Quang, xã Ngọc Thanh, TP. Phúc Yên",
        hours: "Lễ tân 24/7",
        phone: "0986009999",
        rating: 4.7,
        reviewCount: 1560,
        image: resortPhoto,
        priceRange: "1.800.000 – 4.500.000đ/đêm",
      },
      {
        name: "Đại Lải Lake View Homestay",
        type: "Homestay ven hồ",
        distance: "1,0 km",
        travelTime: "3 phút",
        note: "View trực diện mặt hồ · Bãi cỏ cắm trại lộng gió · Giá cả bình dân",
        address: "Bến Thuyền Hồ Đại Lải, Phúc Yên",
        hours: "Lễ tân 24/7",
        phone: "0972444555",
        rating: 4.5,
        reviewCount: 180,
        image: homestayPhoto,
        priceRange: "400.000 – 750.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng, taxi hoặc xe bus điện Phúc Yên",
      routeAdvice: "Chạy thẳng đường Nguyễn Tất Thành từ trung tâm Phúc Yên hoặc từ sân bay Nội Bài chỉ 20 km.",
      caution: "Cuối tuần lượng khách về đông, nên đặt bàn ăn và phòng nghỉ trước ít nhất 3 ngày."
    }
  },
  {
    id: "chua-ha-tien",
    name: "Chùa Hà Tiên (Chùa Hà Vĩnh Yên)",
    shortName: "Chùa Hà Tiên",
    category: "Di sản & tâm linh",
    region: "Vĩnh Phúc",
    district: "Vĩnh Yên",
    location: "Phường Vĩnh Yên, tỉnh Phú Thọ",
    locationEn: "Vĩnh Yên, Phu Tho",
    image: "/images/places/chua-ha-tien.jpg",
    imageCredit: "Cổng thông tin Phật giáo Vĩnh Phúc",
    rating: 4.8,
    reviews: 840,
    hours: "06:00 – 21:00 hàng ngày",
    price: "Tham quan tự do",
    description: "Ngôi chùa cổ hơn 323 năm lịch sử (khởi dựng 1703 thời vua Lê Hy Tông), nổi danh là chốn cầu duyên, cầu tài lộc linh thiêng bậc nhất xứ Bắc. Nơi đây vinh dự được Bác Hồ ghé thăm và nghỉ chân vào năm 1961.",
    tags: ["Cầu duyên", "Chùa cổ 320 năm", "Bác Hồ về thăm", "Bảo tháp", "Tâm linh"],
    highlights: ["Cầu duyên tại giếng ngọc Hà Tiên", "Bảo tháp 3 tầng mái uy nghiêm", "Bia lưu niệm Bác Hồ nghỉ chân năm 1961", "8 ngôi tháp tổ xá lợi cổ kính"],
    bestTime: "07:30 – 10:00 sáng hoặc 16:00 – 18:30 chiều",
    season: "Đẹp quanh năm; tấp nập ngày rằm, mùng một và đầu năm mới",
    seasonMonths: [1, 2, 3, 4, 8, 9, 10, 11, 12],
    duration: "1,5 – 2 giờ",
    distanceFromVietTri: 22,
    travelFromVietTri: "Khoảng 30 phút lái xe",
    bestStart: "08:30",
    lat: 21.3125,
    lng: 105.5917,
    audioScript: "Chùa Hà Tiên tọa lạc trên thế đất rồng ngậm ngọc ở đồi Hà, trung tâm thành phố Vĩnh Yên. Dân gian truyền tụng 'Cầu tài cầu lộc tới đền, cầu tình cầu duyên ghé chùa Hà'. Tiếng chuông chiều ngân vang giữa vườn cây cổ thụ tạo nên không gian thanh tịnh giúp tâm hồn thư thái nhẹ nhõm.",
    audioScriptEn: "Welcome to Ha Tien Pagoda in Vinh Yen, Vinh Phuc. Originally built in the 18th century, this grand Buddhist sanctuary features majestic tiered towers, the legendary jade well, and tranquil contemplation halls.",
    restaurants: [
      {
        name: "Quán Tép Dầu Đầm Vạc & Món Quê Vĩnh Yên",
        type: "Đặc sản Vĩnh Yên",
        distance: "1,5 km",
        travelTime: "5 phút",
        note: "Tép dầu kho tương Đầm Vạc, cá thính Lập Thạch, bún chả Vĩnh Yên",
        taste: "Tép dầu giòn bùi ngậy đượm tương nếp cổ truyền, ăn cùng cơm nóng rất đưa cơm.",
        address: "Phố Lam Sơn, P. Tích Sơn, TP. Vĩnh Yên",
        hours: "09:00 – 21:30",
        phone: "0981222333",
        rating: 4.6,
        reviewCount: 160,
        image: fishPhoto,
        priceRange: "80.000 – 160.000đ/người",
      }
    ],
    stays: [
      {
        name: "Westlake Hotel & Resort Vĩnh Yên",
        type: "Khách sạn nghỉ dưỡng 4 sao",
        distance: "2,2 km",
        travelTime: "7 phút",
        note: "View trọn hồ Đầm Vạc · Hồ bơi ngoài trời · Trung tâm ẩm thực TP. Vĩnh Yên",
        address: "Số 1D đường Kim Ngọc, P. Tích Sơn, TP. Vĩnh Yên",
        hours: "Lễ tân 24/7",
        phone: "02113777888",
        rating: 4.7,
        reviewCount: 390,
        image: hotelPhoto,
        priceRange: "900.000 – 1.800.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô, taxi hoặc xe máy",
      routeAdvice: "Nằm ngay mặt đường Trần Phú thuộc trung tâm Vĩnh Yên, cách bến xe và ga Vĩnh Yên chỉ 2 km.",
      caution: "Chùa có bãi gửi xe ô tô và xe máy trong khuôn viên, giữ trật tự và tắt chuông điện thoại khi vào tam bảo."
    }
  },
  {
    id: "lang-gom-huong-canh",
    name: "Làng gốm sành cổ Hương Canh",
    shortName: "Làng gốm Hương Canh",
    category: "Văn hóa & làng nghề",
    region: "Vĩnh Phúc",
    district: "Bình Xuyên",
    location: "xã Bình Nguyên, tỉnh Phú Thọ",
    locationEn: "Bình Nguyên, Phu Tho",
    image: "/images/places/lang-gom-huong-canh.jpg",
    imageCredit: "Hội Làng nghề truyền thống gốm Hương Canh",
    rating: 4.7,
    reviews: 490,
    hours: "08:00 – 18:00 hàng ngày",
    price: "Tham quan miễn phí; trải nghiệm chuốt gốm 50.000đ/sản phẩm",
    description: "Làng nghề gốm sành truyền thống hơn 300 năm tuổi nổi tiếng với câu ca 'Sứ Móng Cái, vại Hương Canh'. Chất gốm sành từ đất sét xanh đặc trưng, gõ vang như chuông, đựng nước không rỉ, ướp trà giữ trọn hương vị nhiều ngày.",
    tags: ["Làng nghề 300 năm", "Gốm sành", "Trải nghiệm làm gốm", "Bánh hòn cháo se"],
    highlights: ["Tự tay vuốt gốm trên bàn xoay", "Chiêm ngưỡng lò nung gốm truyền thống", "Thưởng thức đặc sản Bánh Hòn – Cháo Se", "Mua sắm chum sành, ấm chén mỹ nghệ"],
    bestTime: "08:30 – 11:30 hoặc 14:00 – 17:00",
    season: "Đẹp quanh năm, mùa nắng hanh làm gốm nhộn nhịp nhất",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: 30,
    travelFromVietTri: "Khoảng 40 phút lái xe",
    bestStart: "09:00",
    lat: 21.2833,
    lng: 105.65,
    audioScript: "Làng gốm Hương Canh bên dòng sông Cà Lồ là niềm tự hào của nghề thủ công xứ Bắc. Khác với gốm men Bát Tràng hay Phù Lãng, gốm sành Hương Canh mộc mạc không men, đanh chắc bền bỉ với thời gian. Đến đây, du khách sẽ được các nghệ nhân hướng dẫn từng động tác chuốt đất trên bàn xoay và thưởng thức món Bánh hòn, Cháo se nức tiếng.",
    audioScriptEn: "Welcome to Huong Canh Ancient Pottery Village in Binh Xuyen, Vinh Phuc. With over 300 years of heritage, the village is renowned for rustic, watertight terracotta and earthenware jars crafted through traditional wood-fired kilns.",
    restaurants: [
      {
        name: "Quán Đặc sản Bánh Hòn Cháo Se Hương Canh",
        type: "Ẩm thực làng nghề truyền thống",
        distance: "0,4 km",
        travelTime: "2 phút",
        note: "Bánh hòn nhân mộc nhĩ hành mỡ, cháo se nấu nước ninh xương ngọt lịm",
        taste: "Bánh dẻo dai chấm nước mắm ớt cay tê, bát cháo se nóng hổi đậm đà tình quê.",
        address: "Phố cổ Hương Canh, Bình Xuyên",
        hours: "06:30 – 18:00",
        phone: "0984111333",
        rating: 4.8,
        reviewCount: 95,
        image: foodPhoto,
        priceRange: "25.000 – 50.000đ/người",
      }
    ],
    stays: [
      {
        name: "Khách sạn Sông Hồng Resort Vĩnh Yên",
        type: "Resort 4 sao lân cận",
        distance: "6,5 km",
        travelTime: "12 phút",
        note: "Nằm cạnh bán đảo Đầm Vạc · Không gian cây xanh rộng rãi · Dễ dàng di chuyển",
        address: "Số 189 đường Lam Sơn, TP. Vĩnh Yên",
        hours: "Lễ tân 24/7",
        phone: "02113777777",
        rating: 4.6,
        reviewCount: 450,
        image: hotelPhoto,
        priceRange: "850.000 – 1.600.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô hoặc xe máy",
      routeAdvice: "Đi theo quốc lộ 2 qua cầu Hương Canh, rẽ vào đường làng nghề có biển chỉ dẫn rõ ràng.",
      caution: "Đường làng sạch đẹp, khi tham quan xưởng gốm chú ý không va chạm vào các sản phẩm mộc đang phơi."
    }
  },

  // ==================== VÙNG HÒA BÌNH (TÀI LIỆU 1) ====================
  {
    id: "ban-lac-mai-chau",
    name: "Bản Lác & Thung lũng Mai Châu",
    shortName: "Mai Châu – Bản Lác",
    category: "Văn hóa & làng nghề",
    region: "Hòa Bình",
    district: "Mai Châu",
    location: "xã Mai Châu, tỉnh Phú Thọ",
    locationEn: "Mai Châu, Phu Tho",
    image: "/images/places/ban-lac-mai-chau.jpg",
    imageCredit: "Du lịch cộng đồng thung lũng Mai Châu",
    rating: 4.9,
    reviews: 3100,
    hours: "Mở cả ngày quanh năm",
    price: "Tham quan bản tự do; thuê xe đạp 30.000 – 50.000đ/ngày",
    description: "Cái nôi du lịch cộng đồng vùng cao với lịch sử hơn 700 năm của người Thái đen. Những nếp nhà sàn gỗ san sát giữa thung lũng lúa ngút ngàn, tiếng thoi đưa dệt thổ cẩm, điệu múa xòe và rượu cần ngất ngây đêm hội lửa trại.",
    tags: ["Bản Lác", "Người Thái đen", "Nhà sàn", "Du lịch cộng đồng", "Múa xòe"],
    highlights: ["Đạp xe ngắm cánh đồng thung lũng Bản Lác – Pom Coọng", "Trải nghiệm dệt vải thổ cẩm Thái", "Thưởng thức mâm cỗ lá & múa sạp giao lưu", "Khám phá Hang Chiều và Hang Mỏ Luông"],
    bestTime: "Sáng 07:00 – 10:00 (mát mẻ) hoặc chiều 15:30 – 18:00 (hoàng hôn rực rỡ)",
    season: "Mùa lúa chín tháng 5 – 6 và tháng 9 – 10 đẹp tựa tranh vẽ",
    seasonMonths: [3, 4, 5, 6, 9, 10, 11],
    duration: "2 ngày 1 đêm hoặc 3 ngày 2 đêm",
    distanceFromVietTri: 125,
    travelFromVietTri: "Khoảng 2 giờ 45 phút lái xe qua QL6",
    bestStart: "07:00",
    warning: "Chinh phục đèo Thung Khe (đèo Đá Trắng) cần kiểm tra phanh xe; tôn trọng phong tục nhà sàn của đồng bào Thái.",
    lat: 20.6667,
    lng: 105.0833,
    featured: true,
    audioScript: "Chào mừng quý khách đến với thung lũng Mai Châu thơ mộng. Nằm e ấp giữa những dãy núi đá vôi sừng sững, Bản Lác đón du khách với những nếp nhà sàn gầm cao thoáng mát, con suối róc rách và lòng hiếu khách nồng hậu của các cô gái Thái duyên dáng trong điệu xòe hoa.",
    audioScriptEn: "Welcome to Ban Lac in the peaceful valley of Mai Chau, Hoa Binh. Cycling along lush green rice paddies, staying in traditional wooden stilt houses of the White Thai ethnic group, and tasting bamboo-tube sticky rice create an authentic northern highland experience.",
    restaurants: [
      {
        name: "Nhà hàng Bếp Thái Bản Lác 1",
        type: "Ẩm thực truyền thống Thái Mường",
        distance: "0,2 km",
        travelTime: "2 phút",
        note: "Cơm lam nếp nương, thịt lợn mán nướng than hoa chẩm chéo, cá suối nướng pa pỉnh tộp",
        taste: "Thơm lừng mùi hạt mắc khén cay nồng, xôi dẻo quánh chấm muối vừng đậm vị vùng cao.",
        address: "Bản Lác 1, xã Mai Châu",
        hours: "07:00 – 22:30",
        phone: "0985222111",
        rating: 4.8,
        reviewCount: 380,
        image: foodPhoto,
        priceRange: "120.000 – 220.000đ/người",
      }
    ],
    stays: [
      {
        name: "Mai Châu Ecolodge Resort",
        type: "Resort sinh thái nghỉ dưỡng cao cấp",
        distance: "1,2 km",
        travelTime: "5 phút",
        note: "Biệt thự đá tự nhiên view thung lũng lúa · Bể bơi vô cực · Trải nghiệm văn hóa",
        address: "Bản Nà Chiềng, xã Nà Phòn, Mai Châu",
        hours: "Lễ tân 24/7",
        phone: "02183865888",
        rating: 4.8,
        reviewCount: 890,
        image: resortPhoto,
        priceRange: "1.400.000 – 2.900.000đ/đêm",
      },
      {
        name: "Homestay Nhà Sàn Hùng Mếch Bản Lác",
        type: "Homestay nhà sàn gỗ truyền thống",
        distance: "0,1 km",
        travelTime: "1 phút",
        note: "Ngủ đệm bông gạo êm ái rèm thổ cẩm · Ăn cơm gia đình · Xem múa sạp tại sân",
        address: "Số 28 Bản Lác 1, Mai Châu",
        hours: "Lễ tân 24/7",
        phone: "0978666555",
        rating: 4.7,
        reviewCount: 260,
        image: homestayPhoto,
        priceRange: "120.000 – 350.000đ/người",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng, xe Limousine Hà Nội - Mai Châu hoặc xe máy phượt",
      routeAdvice: "Theo quốc lộ 6 qua xã Cao Phong, vượt đèo Thung Khe rồi rẽ xuống thung lũng Mai Châu.",
      caution: "Đoạn đèo Đá Trắng thường có sương mù dày đặc quanh năm, nhớ bật đèn vàng và không vượt ẩu."
    }
  },
  {
    id: "khoang-nong-kim-boi",
    name: "Suối khoáng nóng Kim Bôi",
    shortName: "Khoáng nóng Kim Bôi",
    category: "Nghỉ dưỡng & chữa lành",
    region: "Hòa Bình",
    district: "Kim Bôi",
    location: "xã Bo, tỉnh Phú Thọ",
    locationEn: "Bo town, Phu Tho province",
    image: "/images/places/khoang-nong-kim-boi.jpg",
    imageCredit: "Khu du lịch sinh thái suối khoáng Kim Bôi",
    rating: 4.8,
    reviews: 2100,
    hours: "07:00 – 22:00 hàng ngày",
    price: "Vé tắm khoáng từ 100.000 – 350.000đ/người; gói dịch vụ khoáng cao cấp tùy resort",
    description: "Mạch khoáng nóng xuất lộ từ vỉa đá vôi 250 triệu năm tuổi với nhiệt độ tự nhiên 34°C – 36°C tinh khiết đủ tiêu chuẩn uống trực tiếp. Nổi tiếng với Serena Resort Kim Bôi chuẩn 5 sao và khu tắm khoáng trị liệu phục hồi sức khỏe.",
    tags: ["Khoáng nóng", "Trị liệu", "Serena Resort", "Onsen", "Chữa lành", "Wellness"],
    highlights: ["Tắm khoáng nóng lộ thiên thiên nhiên", "Tắm bùn khoáng thiên nhiên", "Resort Serena Kim Bôi đẳng cấp", "Cỗ lá lợn mán Mường hạt dổi"],
    bestTime: "08:00 – 11:00 hoặc 15:30 – 19:30",
    season: "Lý tưởng quanh năm, tuyệt vời nhất vào mùa thu đông se lạnh",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "1 ngày hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 95,
    travelFromVietTri: "Khoảng 2 giờ 10 phút lái xe",
    bestStart: "08:00",
    warning: "Ngâm khoáng từng đợt 15-20 phút, uống đủ nước để giữ cân bằng điện giải cho cơ thể.",
    lat: 20.6667,
    lng: 105.5333,
    featured: true,
    audioScript: "Suối khoáng nóng Kim Bôi là món quà vô giá của mẹ thiên nhiên dành tặng cho vùng đất Mường Động. Nguồn nước khoáng ấm áp chứa nhiều nguyên tố vi lượng quý giá giúp làn da mịn màng, làm dịu những cơn đau nhức xương khớp và mang lại giấc ngủ sâu êm dịu.",
    audioScriptEn: "Welcome to Kim Boi Natural Hot Spring in Hoa Binh. Emerging naturally at a soothing 36 degrees Celsius, this mineral-rich geothermal water promotes revitalization, wellness, and relaxation in a tranquil mountain valley setting.",
    restaurants: [
      {
        name: "Nhà hàng Nón Serena Resort Kim Bôi",
        type: "Ẩm thực Mường & Á Âu cao cấp",
        distance: "0,2 km",
        travelTime: "2 phút",
        note: "Cỗ lá Mường đặc sắc, cá suối chiên giòn chấm mắm gừng, gà nấu măng chua hạt dổi",
        taste: "Hương vị Mường cổ truyền được chế biến tinh tế theo tiêu chuẩn 5 sao sang trọng.",
        address: "xã Bo, tỉnh Phú Thọ",
        hours: "06:30 – 22:00",
        phone: "0981345678",
        rating: 4.8,
        reviewCount: 410,
        image: foodPhoto,
        priceRange: "200.000 – 450.000đ/người",
      }
    ],
    stays: [
      {
        name: "Serena Resort Kim Bôi",
        type: "Khu nghỉ dưỡng khoáng nóng sinh thái 5 sao",
        distance: "0,1 km",
        travelTime: "1 phút",
        note: "Khu tắm khoáng bồn gỗ sồi tự nhiên · Biệt thự tre nứa mộc mạc nhìn ra sông Bôi · Đẳng cấp nhất vùng",
        address: "xã Bo, tỉnh Phú Thọ",
        hours: "Lễ tân 24/7",
        phone: "02186256666",
        rating: 4.8,
        reviewCount: 1420,
        image: resortPhoto,
        priceRange: "1.600.000 – 3.800.000đ/đêm",
      },
      {
        name: "Khách sạn Công Đoàn Kim Bôi",
        type: "Khách sạn khoáng nóng tiêu chuẩn",
        distance: "1,5 km",
        travelTime: "5 phút",
        note: "Hồ bơi khoáng nóng lớn · Giá cả bình dân hợp túi tiền gia đình",
        address: "Xóm Mớ Đá, xã Bo, Kim Bôi",
        hours: "Lễ tân 24/7",
        phone: "02183871115",
        rating: 4.3,
        reviewCount: 320,
        image: hotelPhoto,
        priceRange: "450.000 – 850.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô riêng hoặc xe hợp đồng gia đình",
      routeAdvice: "Theo đường Hồ Chí Minh hoặc QL6 qua dốc Kẽm rẽ vào xã Bo, đường phẳng đẹp.",
      caution: "Khu vực ven suối khoáng có nhiều cua đường làng, chú ý nhường đường cho người dân bản địa."
    }
  },
  {
    id: "thung-nai-song-da",
    name: "Khu du lịch lòng hồ sông Đà Thung Nai",
    shortName: "Thung Nai Sông Đà",
    category: "Núi rừng & sinh thái",
    region: "Hòa Bình",
    district: "Cao Phong",
    location: "Xã Thung Nai, tỉnh Phú Thọ",
    locationEn: "Thung Nai, Phu Tho",
    image: "/images/places/thung-nai-song-da.jpg",
    imageCredit: "Cổng thông tin xúc tiến du lịch lòng hồ Hòa Bình",
    rating: 4.8,
    reviews: 1650,
    hours: "Tàu chạy ban ngày từ 06:30 – 17:30",
    price: "Vé tham quan lòng hồ 30.000đ; Thuê tàu ghép từ 120.000 – 200.000đ/người",
    description: "Được ngợi ca là “Hạ Long trên núi”, hồ nước xanh ngắt mênh mang với hàng trăm đảo đá vôi nhấp nhô giữa lòng sông Đà. Nơi có Đền thờ Bà Chúa Thác Bờ linh thiêng và Động Thác Bờ kỳ vĩ.",
    tags: ["Hạ Long trên núi", "Đền Thác Bờ", "Lòng hồ sông Đà", "Du thuyền", "Cá sông"],
    highlights: ["Du thuyền lướt sóng trên lòng hồ Sông Đà", "Chiêm bái Đền Bà Chúa Thác Bờ linh thiêng", "Khám phá thạch nhũ Động Thác Bờ", "Thưởng thức cá nướng than trên thuyền"],
    bestTime: "08:00 – 12:00 sáng hoặc 14:00 – 17:00 chiều",
    season: "Lễ hội Đền Bờ từ tháng Giêng đến tháng Ba âm lịch; mùa nước đầy tháng 9 – 12 tuyệt đẹp",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "4 – 6 giờ hoặc 2 ngày 1 đêm",
    distanceFromVietTri: 88,
    travelFromVietTri: "Khoảng 1 giờ 55 phút lái xe đến cảng Thung Nai",
    bestStart: "08:00",
    warning: "Bắt buộc mặc áo phao suốt hành trình đi thuyền trên hồ nước sâu.",
    lat: 20.75,
    lng: 105.2833,
    featured: true,
    audioScript: "Lòng hồ Thung Nai là một trong những kỳ quan hồ nhân tạo đẹp nhất Đông Nam Á hình thành sau khi ngăn dòng sông Đà xây dựng nhà máy thủy điện. Mặt nước xanh như ngọc bích soi bóng mây trời và những hòn đảo hoang sơ. Du khách thập phương về đây không chỉ để vãn cảnh sơn thủy hữu tình mà còn thành kính dâng hương Đền Bà Chúa Thác Bờ cầu bình an hạnh phúc.",
    audioScriptEn: "Welcome to Thung Nai on the Da River Reservoir in Hoa Binh, often called the Halong Bay on the mountains. Take a scenic boat tour across emerald waters to explore limestone islets, Bo Market, and the sacred Thac Bo Goddess Temple.",
    restaurants: [
      {
        name: "Nhà hàng Đảo Cối Xay Gió Thung Nai",
        type: "Ẩm thực đảo hồ sông Đà",
        distance: "1,5 km đường thủy",
        travelTime: "15 phút đi tàu",
        note: "Cá sông Đà kẹp que tre nướng than hoa, gà đồi hấp lá chanh, măng vầu luộc chấm muối ớt",
        taste: "Cá thơm phức béo ngọt thịt nướng giòn rụm, thưởng thức giữa bốn bề sóng nước mát lạnh.",
        address: "Đảo Cối Xay Gió, lòng hồ Thung Nai",
        hours: "08:00 – 20:00",
        phone: "0912111444",
        rating: 4.7,
        reviewCount: 210,
        image: fishPhoto,
        priceRange: "150.000 – 260.000đ/người",
      }
    ],
    stays: [
      {
        name: "Nhà nghỉ Cối Xay Gió Thung Nai",
        type: "Homestay trên đảo lòng hồ",
        distance: "1,5 km đường thủy",
        travelTime: "15 phút đi tàu",
        note: "Nằm trọn trên đảo đá giữa hồ · Đêm nghe sóng vỗ và ngắm ngàn sao · Rất thi vị",
        address: "Đảo Cối Xay Gió, Thung Nai",
        hours: "Lễ tân 24/7",
        phone: "0912111444",
        rating: 4.6,
        reviewCount: 180,
        image: homestayPhoto,
        priceRange: "350.000 – 600.000đ/đêm (gồm ăn)",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô tới bến cảng Thung Nai rồi đi tàu thủy",
      routeAdvice: "Từ TP. Hòa Bình theo đường Tây Tiến lên cảng Thung Nai khoảng 15 km, bãi đỗ xe ô tô tại bến cảng.",
      caution: "Nên thỏa thuận giá tàu và giờ đón trả rõ ràng với chủ thuyền trước khi xuất bến."
    }
  },
  {
    id: "pa-co-san-may",
    name: "Điểm săn mây & Chợ phiên Pà Cò",
    shortName: "Săn mây Pà Cò",
    category: "Check-in & vui chơi",
    region: "Hòa Bình",
    district: "Mai Châu",
    location: "Xã Pà Cò, tỉnh Phú Thọ",
    locationEn: "Pà Cò, Phu Tho",
    image: "/images/places/pa-co-san-may.jpg",
    imageCredit: "Cổng thông tin du lịch Pà Cò",
    rating: 4.8,
    reviews: 890,
    hours: "Mở cả ngày; Chợ phiên họp sáng Chủ Nhật hàng tuần",
    price: "Vé vào cổng điểm săn mây 30.000đ/người",
    description: "Tọa lạc trên độ cao trên 1.200m giữa cổng trời Mai Châu - Mộc Châu, nơi sinh sống của đồng bào H'Mông với biển mây cuồn cuộn quanh năm, rừng mận cổ thụ và phiên chợ vùng cao rực rỡ sắc màu thổ cẩm sáng Chủ Nhật.",
    tags: ["Săn mây", "Người H'Mông", "Chợ phiên Chủ Nhật", "Rừng mận", "Cổng trời"],
    highlights: ["Săn biển mây cuồn cuộn đỉnh đồi Pà Cò", "Đi chợ phiên Pà Cò sáng Chủ Nhật", "Check-in vườn hoa mận, hoa đào mùa xuân", "Uống trà Shan tuyết cổ thụ"],
    bestTime: "05:30 – 08:30 sáng săn mây",
    season: "Tháng 10 đến tháng 4 năm sau xác suất biển mây cao nhất; tháng 1 – 2 mùa hoa mận trắng",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "2 – 4 giờ",
    distanceFromVietTri: 155,
    travelFromVietTri: "Khoảng 3 giờ 15 phút lái xe",
    bestStart: "05:30",
    warning: "Nhiệt độ sáng sớm và đêm vùng cao Pà Cò xuống thấp dưới 15°C, nhớ mang theo áo khoác ấm và khăn quàng.",
    lat: 20.7333,
    lng: 104.9167,
    audioScript: "Pà Cò nằm trên cổng trời ngút ngàn của vùng cao xứ Mường - Thái. Nơi đây như chốn bồng lai tiên cảnh khi ánh bình minh ló rạng, nhuộm hồng biển mây cuồn cuộn dưới chân. Vào sáng Chủ Nhật, tiếng khèn Mông rộn rã kéo du khách về với phiên chợ đầy sắc màu váy hoa sặc sỡ và hương thắng cố nồng nàn.",
    audioScriptEn: "Welcome to Hang Kia and Pa Co Cloud Hunting Peak in Mai Chau, Hoa Binh. Perched over 1,200 meters high, it offers magnificent seas of clouds at dawn, vibrant weekend ethnic markets, and plum blossom valleys in spring.",
    restaurants: [
      {
        name: "Bếp Mông Quán Pà Cò",
        type: "Ẩm thực người H'Mông bản địa",
        distance: "0,5 km",
        travelTime: "3 phút",
        note: "Thắng cố ngựa truyền thống, gà đen H'Mông tiềm nấm rừng, mèn mén bánh ngô",
        taste: "Vị thảo quả nồng nàn ấm bụng, thịt gà đen săn ngọt bổ dưỡng.",
        address: "Trung tâm xã Pà Cò, Mai Châu",
        hours: "06:00 – 21:00",
        phone: "0977888999",
        rating: 4.7,
        reviewCount: 120,
        image: foodPhoto,
        priceRange: "80.000 – 160.000đ/người",
      }
    ],
    stays: [
      {
        name: "Pà Cò Glamping & Homestay",
        type: "Lều Glamping săn mây cao cấp",
        distance: "0,2 km",
        travelTime: "2 phút",
        note: "Lều kính nhìn thẳng ra biển mây · Đốt lửa sưởi ấm đêm · Rất chill cho giới trẻ",
        address: "Đỉnh đồi săn mây, xã Pà Cò",
        hours: "Lễ tân 24/7",
        phone: "0966555444",
        rating: 4.8,
        reviewCount: 165,
        image: homestayPhoto,
        priceRange: "500.000 – 1.100.000đ/lều",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô gầm cao hoặc xe máy số",
      routeAdvice: "Từ quốc lộ 6 đoạn giáp ranh Mai Châu - Vân Hồ rẽ vào đường liên xã Pà Cò khoảng 6 km đường bê tông dốc.",
      caution: "Đường dốc quanh co, hạn chế đi đêm khi có sương mù dày đặc."
    }
  },
  {
    id: "bao-tang-muong",
    name: "Bảo tàng Không gian Văn hóa Mường",
    shortName: "Bảo tàng Mường",
    category: "Văn hóa & làng nghề",
    region: "Hòa Bình",
    district: "TP. Hòa Bình",
    location: "Đường Tây Tiến, phường Thái Bình, tỉnh Phú Thọ",
    locationEn: "Đường Tây Tiến, Thái Bình, Phu Tho",
    image: "/images/places/bao-tang-muong.jpg",
    imageCredit: "Bảo tàng Không gian Văn hóa Mường",
    rating: 4.8,
    reviews: 750,
    hours: "08:00 – 17:30 hàng ngày",
    price: "Vé tham quan 50.000đ/người lớn",
    description: "Bảo tàng tư nhân độc đáo nhất Việt Nam do họa sĩ Vũ Đức Hiếu sáng lập, tái hiện trọn vẹn xã hội Mường cổ thu nhỏ với 4 nếp nhà sàn đại diện cho 4 tầng lớp: nhà Lang (thống trị), nhà Ậu (tử quan), nhà Noóc (bình dân) và nhà Noóc Trọi (nghèo khổ).",
    tags: ["Bảo tàng sống", "Văn hóa Mường cổ", "Nhà Lang", "Cồng chiêng", "Nghệ thuật đương đại"],
    highlights: ["Chiêm ngưỡng 4 nếp nhà sàn cổ 4 tầng lớp Mường", "Trưng bày hàng ngàn hiện vật cồng chiêng, đồ đồng cổ", "Khu sáng tác nghệ thuật đương đại Mường Studio", "Trải nghiệm ngủ nhà sàn cổ Muong Retreat"],
    bestTime: "08:30 – 11:30 hoặc 14:00 – 16:30",
    season: "Tham quan văn hóa lý tưởng quanh năm",
    seasonMonths: [1, 2, 3, 4, 5, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: 70,
    travelFromVietTri: "Khoảng 1 giờ 30 phút lái xe",
    bestStart: "09:00",
    lat: 20.8167,
    lng: 105.3167,
    audioScript: "Bảo tàng Không gian Văn hóa Mường tọa lạc trên một ngọn đồi thoai thoải rợp bóng mát tại phường Thái Bình. Đây là bảo tàng sống bảo tồn trọn vẹn hồn cốt của văn hóa Mường - một trong những cái nôi văn hóa lâu đời gắn bó mật thiết với cư dân Đất Tổ thời các Vua Hùng dựng nước.",
    audioScriptEn: "Welcome to the Muong Cultural Heritage Space Museum in Hoa Binh City. Set on an open hillside, it preserves the authentic four social tiers of traditional Muong stilt houses, bronze drums, hunting tools, and millennia-old indigenous wisdom.",
    restaurants: [
      {
        name: "Nhà hàng Cỗ Lá Bảo Tàng Mường",
        type: "Ẩm thực Mường chuẩn vị cổ truyền",
        distance: "Tại điểm",
        travelTime: "0 phút",
        note: "Thịt lợn mán hấp lá chuối hột, chả cuốn lá bưởi nướng than hoa, rau rừng đồ chấm lòng cá",
        taste: "Thơm lừng mùi lá bưởi nướng, vị thanh ngọt mát lành của rau rừng đồ tự nhiên.",
        address: "202 đường Tây Tiến, phường Thái Bình",
        hours: "09:00 – 20:30",
        phone: "02183894805",
        rating: 4.8,
        reviewCount: 180,
        image: foodPhoto,
        priceRange: "120.000 – 220.000đ/người",
      }
    ],
    stays: [
      {
        name: "Muong Retreat Homestay",
        type: "Homestay nhà sàn cổ trong bảo tàng",
        distance: "Tại điểm",
        travelTime: "0 phút",
        note: "Ngủ trong nhà sàn gỗ cổ giữa đồi cây · Không gian tĩnh lặng như quay ngược thời gian",
        address: "Khuôn viên Bảo tàng Mường, 202 Tây Tiến",
        hours: "Lễ tân 24/7",
        phone: "02183894805",
        rating: 4.7,
        reviewCount: 90,
        image: homestayPhoto,
        priceRange: "300.000 – 600.000đ/đêm",
      }
    ],
    transportTips: {
      recommendedVehicle: "Ô tô hoặc xe máy",
      routeAdvice: "Từ trung tâm TP. Hòa Bình đi theo đường Tây Tiến hướng lên dốc Cun chỉ 4 km là tới cổng bảo tàng.",
      caution: "Bảo tàng nằm trên sườn đồi thoai thoải có bậc đá, đi giày thể thao để tham quan thuận tiện."
    }
  }
];

// Danh mục 100 địa điểm Phú Thọ từ Tài liệu 3
export const phuTho100Directory: DirectoryPlace[] = [
  {
    "stt": "1",
    "district": "Việt Trì",
    "name": "Khu di tích lịch sử quốc gia đặc biệt Đền Hùng",
    "category": "Tâm linh - lịch sử",
    "location": "Hy Cương",
    "restaurants": "Nhà hàng khu Đền Hùng/Hy Cương; vào trung tâm Việt Trì có nhiều lựa chọn",
    "stays": "Mường Thanh Luxury Phú Thọ; Sài Gòn - Phú Thọ; khách sạn trung tâm Việt Trì",
    "distance": "0-10 km",
    "notes": "Điểm lõi; nên dành 2-4 giờ."
  },
  {
    "stt": "2",
    "district": "Việt Trì",
    "name": "Cổng Đền Hùng",
    "category": "Kiến trúc - check-in",
    "location": "Hy Cương",
    "restaurants": "Dịch vụ ăn uống khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Điểm mở đầu tuyến leo núi Nghĩa Lĩnh."
  },
  {
    "stt": "3",
    "district": "Việt Trì",
    "name": "Đền Hạ",
    "category": "Tâm linh - lịch sử",
    "location": "Núi Nghĩa Lĩnh, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Gắn truyền thuyết bọc trăm trứng."
  },
  {
    "stt": "4",
    "district": "Việt Trì",
    "name": "Chùa Thiên Quang",
    "category": "Tâm linh",
    "location": "Núi Nghĩa Lĩnh, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Tham quan cùng Đền Hạ."
  },
  {
    "stt": "5",
    "district": "Việt Trì",
    "name": "Đền Trung",
    "category": "Tâm linh - lịch sử",
    "location": "Núi Nghĩa Lĩnh, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Nằm trên trục lên Đền Thượng."
  },
  {
    "stt": "6",
    "district": "Việt Trì",
    "name": "Đền Thượng",
    "category": "Tâm linh - lịch sử",
    "location": "Đỉnh Nghĩa Lĩnh, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Điểm cao nhất quần thể chính."
  },
  {
    "stt": "7",
    "district": "Việt Trì",
    "name": "Lăng Hùng Vương",
    "category": "Lịch sử - tâm linh",
    "location": "Núi Nghĩa Lĩnh, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Kết hợp Đền Thượng."
  },
  {
    "stt": "8",
    "district": "Việt Trì",
    "name": "Đền Giếng",
    "category": "Tâm linh",
    "location": "Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Thờ công chúa Tiên Dung, Ngọc Hoa."
  },
  {
    "stt": "9",
    "district": "Việt Trì",
    "name": "Đền Tổ Mẫu Âu Cơ (khu Đền Hùng)",
    "category": "Tâm linh",
    "location": "Núi Vặn, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Khác với Đền Mẫu Âu Cơ ở Hạ Hòa."
  },
  {
    "stt": "10",
    "district": "Việt Trì",
    "name": "Đền Quốc Tổ Lạc Long Quân",
    "category": "Tâm linh",
    "location": "Khu Đền Hùng, Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Nên ghép cùng Đền Tổ Mẫu Âu Cơ."
  },
  {
    "stt": "11",
    "district": "Việt Trì",
    "name": "Bảo tàng Hùng Vương tại Khu di tích Đền Hùng",
    "category": "Bảo tàng - lịch sử",
    "location": "Hy Cương",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Phù hợp học sinh, sinh viên, đoàn nghiên cứu."
  },
  {
    "stt": "12",
    "district": "Việt Trì",
    "name": "Đồi Phân Bùng / khu cảnh quan Đền Hùng",
    "category": "Cảnh quan - dã ngoại",
    "location": "Khu Đền Hùng",
    "restaurants": "Dịch vụ khu Đền Hùng",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-10 km",
    "notes": "Điểm phụ trợ trong quần thể."
  },
  {
    "stt": "13",
    "district": "Việt Trì",
    "name": "Điểm du lịch văn hóa cộng đồng Hùng Lô",
    "category": "Văn hóa - di sản",
    "location": "phường Vân Phú, tỉnh Phú Thọ",
    "restaurants": "Ẩm thực làng nghề; bánh chưng, mì gạo, món địa phương",
    "stays": "Khách sạn trung tâm Việt Trì",
    "distance": "0-8 km",
    "notes": "Có thể trải nghiệm làm bánh, mì, hát Xoan."
  },
  {
    "stt": "14",
    "district": "Việt Trì",
    "name": "Đình cổ Hùng Lô",
    "category": "Tâm linh - kiến trúc",
    "location": "phường Vân Phú, tỉnh Phú Thọ",
    "restaurants": "Ẩm thực Hùng Lô",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-8 km",
    "notes": "Quần thể đình cổ hơn 300 năm."
  },
  {
    "stt": "15",
    "district": "Việt Trì",
    "name": "Làng cổ Hùng Lô",
    "category": "Di sản - trải nghiệm",
    "location": "phường Vân Phú, tỉnh Phú Thọ",
    "restaurants": "Ẩm thực hộ dân/làng nghề",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-8 km",
    "notes": "Phù hợp tour đi bộ, trải nghiệm nông thôn."
  },
  {
    "stt": "16",
    "district": "Việt Trì",
    "name": "Không gian Hát Xoan Hùng Lô",
    "category": "Di sản phi vật thể",
    "location": "phường Vân Phú, tỉnh Phú Thọ",
    "restaurants": "Ẩm thực cộng đồng Hùng Lô",
    "stays": "Khách sạn Việt Trì",
    "distance": "0-8 km",
    "notes": "Nên đặt lịch biểu diễn trước với đoàn."
  },
  {
    "stt": "17",
    "district": "Việt Trì",
    "name": "Miếu Lãi Lèn",
    "category": "Tín ngưỡng - Hát Xoan",
    "location": "Kim Đức, Việt Trì",
    "restaurants": "Nhà hàng trung tâm Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "5-10 km",
    "notes": "Gắn nguồn gốc Hát Xoan."
  },
  {
    "stt": "18",
    "district": "Việt Trì",
    "name": "Đình Thét",
    "category": "Di tích - Hát Xoan",
    "location": "Khu vực Kim Đức",
    "restaurants": "Nhà hàng Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "5-10 km",
    "notes": "Một không gian Xoan gốc."
  },
  {
    "stt": "19",
    "district": "Việt Trì",
    "name": "Đình Kim Đái",
    "category": "Di tích - Hát Xoan",
    "location": "Khu vực Kim Đức",
    "restaurants": "Nhà hàng Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "5-10 km",
    "notes": "Phù hợp tour di sản Hát Xoan."
  },
  {
    "stt": "20",
    "district": "Việt Trì",
    "name": "Đình An Thái",
    "category": "Di tích - Hát Xoan",
    "location": "Khu vực Phượng Lâu",
    "restaurants": "Nhà hàng Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "5-10 km",
    "notes": "Một trong các phường Xoan gốc."
  },
  {
    "stt": "21",
    "district": "Việt Trì",
    "name": "Công viên Văn Lang",
    "category": "Công viên - check-in",
    "location": "Trung tâm Việt Trì",
    "restaurants": "Phố ẩm thực Nguyễn Du; nhà hàng trung tâm",
    "stays": "Mường Thanh Luxury; Sài Gòn - Phú Thọ; khách sạn trung tâm",
    "distance": "0-3 km",
    "notes": "Đẹp chiều tối; phù hợp gia đình."
  },
  {
    "stt": "22",
    "district": "Việt Trì",
    "name": "Hồ Công viên Văn Lang - cầu đi bộ",
    "category": "Cảnh quan đô thị",
    "location": "Trung tâm Việt Trì",
    "restaurants": "Phố ẩm thực Nguyễn Du",
    "stays": "Khách sạn trung tâm Việt Trì",
    "distance": "0-3 km",
    "notes": "Điểm chụp ảnh, đi dạo."
  },
  {
    "stt": "23",
    "district": "Việt Trì",
    "name": "Bảo tàng Hùng Vương (thành phố Việt Trì)",
    "category": "Bảo tàng - văn hóa",
    "location": "Trung tâm Việt Trì",
    "restaurants": "Nhà hàng trung tâm",
    "stays": "Khách sạn trung tâm",
    "distance": "0-3 km",
    "notes": "Không nhầm với bảo tàng trong Khu Đền Hùng."
  },
  {
    "stt": "24",
    "district": "Việt Trì",
    "name": "Đền Tam Giang",
    "category": "Tâm linh - lịch sử",
    "location": "Bạch Hạc",
    "restaurants": "Nhà hàng cá sông/khu Bạch Hạc - Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "3-8 km",
    "notes": "Kết hợp ngã ba Hạc."
  },
  {
    "stt": "25",
    "district": "Việt Trì",
    "name": "Chùa Đại Bi",
    "category": "Tâm linh",
    "location": "Bạch Hạc",
    "restaurants": "Ẩm thực Bạch Hạc/Việt Trì",
    "stays": "Khách sạn Việt Trì",
    "distance": "3-8 km",
    "notes": "Ghép Đền Tam Giang."
  },
  {
    "stt": "26",
    "district": "Việt Trì",
    "name": "Điểm du lịch văn hóa cộng đồng Bạch Hạc",
    "category": "Văn hóa - sông nước",
    "location": "Phường Thanh Miếu, tỉnh Phú Thọ",
    "restaurants": "Ẩm thực cá sông, làng nghề",
    "stays": "Khách sạn Việt Trì",
    "distance": "3-8 km",
    "notes": "Trải nghiệm cộng đồng ven sông."
  },
  {
    "stt": "27",
    "district": "Việt Trì",
    "name": "Ngã ba Hạc",
    "category": "Cảnh quan sông nước",
    "location": "Bạch Hạc",
    "restaurants": "Nhà hàng cá sông",
    "stays": "Khách sạn Việt Trì",
    "distance": "3-8 km",
    "notes": "Điểm nhìn hợp lưu sông."
  },
  {
    "stt": "28",
    "district": "Lâm Thao",
    "name": "Di tích khảo cổ Sơn Vi",
    "category": "Khảo cổ",
    "location": "Sơn Vi",
    "restaurants": "Nhà hàng xã Lâm Thao",
    "stays": "Nhà nghỉ/khách sạn Lâm Thao hoặc Việt Trì",
    "distance": "0-15 km",
    "notes": "Giá trị tiền sử, phù hợp nghiên cứu."
  },
  {
    "stt": "29",
    "district": "Lâm Thao",
    "name": "Đền thờ Nguyễn Mẫn Đốc",
    "category": "Lịch sử - danh nhân",
    "location": "Xuân Lũng",
    "restaurants": "Nhà hàng Lâm Thao",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "5-15 km",
    "notes": "Di tích quốc gia."
  },
  {
    "stt": "30",
    "district": "Lâm Thao",
    "name": "Đình Du Cung",
    "category": "Di tích lịch sử - văn hóa",
    "location": "Lâm Thao",
    "restaurants": "Nhà hàng Lâm Thao",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "0-15 km",
    "notes": "Có thể ghép chùa Danh Sơn."
  },
  {
    "stt": "31",
    "district": "Lâm Thao",
    "name": "Chùa Danh Sơn",
    "category": "Tâm linh",
    "location": "Lâm Thao",
    "restaurants": "Nhà hàng Lâm Thao",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "0-15 km",
    "notes": "Cụm cùng đình Du Cung."
  },
  {
    "stt": "32",
    "district": "Lâm Thao",
    "name": "Đình Hy Sơn",
    "category": "Di tích thời Hùng Vương",
    "location": "Khu vực Lâm Thao",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "5-15 km",
    "notes": "Điểm di sản tín ngưỡng vùng Đất Tổ."
  },
  {
    "stt": "33",
    "district": "Lâm Thao",
    "name": "Đình Sơn Vi",
    "category": "Đình làng - văn hóa",
    "location": "Sơn Vi",
    "restaurants": "Nhà hàng Sơn Vi/Lâm Thao",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "5-15 km",
    "notes": "Ghép di tích khảo cổ Sơn Vi."
  },
  {
    "stt": "34",
    "district": "Lâm Thao",
    "name": "Đình Xuân Lũng",
    "category": "Đình làng - văn hóa",
    "location": "Xuân Lũng",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "5-15 km",
    "notes": "Tuyến di tích làng cổ."
  },
  {
    "stt": "35",
    "district": "Lâm Thao",
    "name": "Làng nghề tương Dục Mỹ",
    "category": "Làng nghề - ẩm thực",
    "location": "Lâm Thao",
    "restaurants": "Trải nghiệm tương, món địa phương",
    "stays": "Lưu trú Lâm Thao/Việt Trì",
    "distance": "5-15 km",
    "notes": "Phù hợp tour nông thôn - làng nghề."
  },
  {
    "stt": "36",
    "district": "Phù Ninh",
    "name": "Đền Nhà Bà",
    "category": "Tâm linh - thời Hùng Vương",
    "location": "Tiên Du",
    "restaurants": "Nhà hàng Phù Ninh/Việt Trì",
    "stays": "Nhà nghỉ Phù Ninh hoặc Việt Trì",
    "distance": "5-20 km",
    "notes": "Thờ Tiên Dung và Ngọc Hoa."
  },
  {
    "stt": "37",
    "district": "Phù Ninh",
    "name": "Đình Tối Linh",
    "category": "Di tích tín ngưỡng",
    "location": "Tiên Du",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Lưu trú Phù Ninh/Việt Trì",
    "distance": "5-20 km",
    "notes": "Trong quần thể tín ngưỡng Tiên Du."
  },
  {
    "stt": "38",
    "district": "Phù Ninh",
    "name": "Chùa Thái Bình",
    "category": "Tâm linh",
    "location": "Tiên Du",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Lưu trú Phù Ninh/Việt Trì",
    "distance": "5-20 km",
    "notes": "Ghép Đền Nhà Bà - đình Tối Linh."
  },
  {
    "stt": "39",
    "district": "Phù Ninh",
    "name": "Làng nón Gia Thanh",
    "category": "Làng nghề",
    "location": "Gia Thanh",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Nhà nghỉ Phù Ninh/Việt Trì",
    "distance": "5-20 km",
    "notes": "Trải nghiệm làm/mua nón lá."
  },
  {
    "stt": "40",
    "district": "Phù Ninh",
    "name": "Khu vực đồi chè Phù Ninh",
    "category": "Nông nghiệp - cảnh quan",
    "location": "Phù Ninh",
    "restaurants": "Nhà hàng đặc sản",
    "stays": "Lưu trú Phù Ninh/Việt Trì",
    "distance": "5-20 km",
    "notes": "Thích hợp check-in, trải nghiệm chè nếu có đơn vị đón khách."
  },
  {
    "stt": "41",
    "district": "Phù Ninh",
    "name": "Đền Hùng Vương vùng Phù Ninh (các điểm thờ vọng địa phương)",
    "category": "Tín ngưỡng dân gian",
    "location": "Phù Ninh",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Lưu trú Phù Ninh/Việt Trì",
    "distance": "5-20 km",
    "notes": "Nên liên hệ địa phương trước khi tổ chức đoàn."
  },
  {
    "stt": "42",
    "district": "Hạ Hòa",
    "name": "Đền Mẫu Âu Cơ",
    "category": "Tâm linh - quốc gia",
    "location": "Hiền Lương",
    "restaurants": "Nhà hàng khu Hiền Lương/trung tâm Hạ Hòa",
    "stays": "Nhà nghỉ trung tâm Hạ Hòa",
    "distance": "0-20 km",
    "notes": "Điểm tâm linh tiêu biểu; lễ hội đầu xuân."
  },
  {
    "stt": "43",
    "district": "Hạ Hòa",
    "name": "Ao Giời - Suối Tiên",
    "category": "Sinh thái - thác suối",
    "location": "Hiền Lương",
    "restaurants": "Ẩm thực địa phương; gà đồi, cá, rau rừng",
    "stays": "Nhà nghỉ Hạ Hòa/homestay địa phương",
    "distance": "0-20 km",
    "notes": "Nên đi mùa nước đẹp, chú ý trơn trượt."
  },
  {
    "stt": "44",
    "district": "Hạ Hòa",
    "name": "Đầm Ao Châu",
    "category": "Sinh thái hồ",
    "location": "Hạ Hòa",
    "restaurants": "Nhà hàng trung tâm Hạ Hòa",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "0-10 km",
    "notes": "Phù hợp ngắm cảnh, trải nghiệm mặt nước khi có dịch vụ."
  },
  {
    "stt": "45",
    "district": "Hạ Hòa",
    "name": "Đầm Vân Hội",
    "category": "Sinh thái hồ",
    "location": "Hạ Hòa",
    "restaurants": "Nhà hàng Hạ Hòa",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "5-20 km",
    "notes": "Cảnh quan hồ, nông thôn."
  },
  {
    "stt": "46",
    "district": "Hạ Hòa",
    "name": "Đền Chu Hưng",
    "category": "Tâm linh - lịch sử",
    "location": "Ấm Hạ",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "5-20 km",
    "notes": "Lễ hội truyền thống địa phương."
  },
  {
    "stt": "47",
    "district": "Hạ Hòa",
    "name": "Núi Vả",
    "category": "Cảnh quan tự nhiên",
    "location": "Hạ Hòa",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "5-20 km",
    "notes": "Điểm phụ trợ tuyến sinh thái."
  },
  {
    "stt": "48",
    "district": "Hạ Hòa",
    "name": "Vùng chè Hạ Hòa",
    "category": "Nông nghiệp - trải nghiệm",
    "location": "Hạ Hòa",
    "restaurants": "Ẩm thực nông thôn",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "5-20 km",
    "notes": "Có thể kết hợp mua chè địa phương."
  },
  {
    "stt": "49",
    "district": "Hạ Hòa",
    "name": "Làng quê ven sông Hồng Hạ Hòa",
    "category": "Du lịch nông thôn",
    "location": "Hạ Hòa",
    "restaurants": "Ẩm thực hộ dân/nhà hàng huyện",
    "stays": "Nhà nghỉ Hạ Hòa",
    "distance": "5-20 km",
    "notes": "Phù hợp khảo sát xây tour cộng đồng."
  },
  {
    "stt": "50",
    "district": "Đoan Hùng",
    "name": "Tượng đài Chiến thắng Sông Lô",
    "category": "Lịch sử - cảnh quan",
    "location": "Chí Đám",
    "restaurants": "Nhà hàng trung tâm Đoan Hùng/cá sông",
    "stays": "Nhà nghỉ trung tâm Đoan Hùng",
    "distance": "0-15 km",
    "notes": "Có góc nhìn hợp lưu sông."
  },
  {
    "stt": "51",
    "district": "Đoan Hùng",
    "name": "Ngã ba sông Lô - sông Chảy",
    "category": "Cảnh quan sông nước",
    "location": "Chí Đám",
    "restaurants": "Nhà hàng cá sông",
    "stays": "Nhà nghỉ Đoan Hùng",
    "distance": "0-15 km",
    "notes": "Kết hợp tượng đài."
  },
  {
    "stt": "52",
    "district": "Đoan Hùng",
    "name": "Vùng bưởi đặc sản Đoan Hùng",
    "category": "Nông nghiệp - đặc sản",
    "location": "Các xã vùng bưởi Đoan Hùng",
    "restaurants": "Nhà vườn/nhà hàng địa phương",
    "stays": "Nhà nghỉ Đoan Hùng",
    "distance": "5-20 km",
    "notes": "Đẹp nhất mùa bưởi; cần liên hệ nhà vườn."
  },
  {
    "stt": "53",
    "district": "Đoan Hùng",
    "name": "Vườn bưởi Chí Đám",
    "category": "Nông nghiệp - trải nghiệm",
    "location": "Chí Đám",
    "restaurants": "Ẩm thực nhà vườn",
    "stays": "Nhà nghỉ Đoan Hùng",
    "distance": "5-15 km",
    "notes": "Kết hợp Sông Lô."
  },
  {
    "stt": "54",
    "district": "Đoan Hùng",
    "name": "Vườn bưởi Bằng Luân",
    "category": "Nông nghiệp - trải nghiệm",
    "location": "Bằng Luân",
    "restaurants": "Ẩm thực nhà vườn",
    "stays": "Nhà nghỉ Đoan Hùng",
    "distance": "5-20 km",
    "notes": "Đặc sản bưởi Đoan Hùng."
  },
  {
    "stt": "55",
    "district": "Cẩm Khê",
    "name": "Căn cứ Tiên Động",
    "category": "Lịch sử quốc gia",
    "location": "Tiên Lương",
    "restaurants": "Nhà hàng xã Cẩm Khê",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "5-20 km",
    "notes": "Gắn phong trào Cần Vương, Nguyễn Quang Bích."
  },
  {
    "stt": "56",
    "district": "Cẩm Khê",
    "name": "Đình Thổ Khối",
    "category": "Di tích quốc gia",
    "location": "Minh Tân",
    "restaurants": "Nhà hàng Cẩm Khê",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "5-20 km",
    "notes": "Điểm lễ hội đầu xuân."
  },
  {
    "stt": "57",
    "district": "Cẩm Khê",
    "name": "Đình Hạ Khê",
    "category": "Di tích cấp tỉnh",
    "location": "Minh Tân",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "5-20 km",
    "notes": "Có thể ghép đình Thổ Khối."
  },
  {
    "stt": "58",
    "district": "Cẩm Khê",
    "name": "Đình Cả Phùng Xá",
    "category": "Di tích cấp tỉnh",
    "location": "Minh Tân",
    "restaurants": "Nhà hàng địa phương",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "5-20 km",
    "notes": "Tuyến đình làng."
  },
  {
    "stt": "59",
    "district": "Cẩm Khê",
    "name": "Đình Cả Văn Phú",
    "category": "Tín ngưỡng thời Hùng Vương",
    "location": "Xã Cẩm Khê",
    "restaurants": "Nhà hàng xã Cẩm Khê",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "0-10 km",
    "notes": "Một trong các điểm thờ Vua Hùng địa phương."
  },
  {
    "stt": "60",
    "district": "Cẩm Khê",
    "name": "Đình Nga Hà",
    "category": "Tín ngưỡng thời Hùng Vương",
    "location": "Xã Cẩm Khê",
    "restaurants": "Nhà hàng trung tâm xã",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "0-10 km",
    "notes": "Có lễ dâng hương tưởng niệm Vua Hùng."
  },
  {
    "stt": "61",
    "district": "Cẩm Khê",
    "name": "Đình Bình Phú",
    "category": "Di tích kiến trúc - tín ngưỡng",
    "location": "Xã Cẩm Khê",
    "restaurants": "Nhà hàng trung tâm xã",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "0-10 km",
    "notes": "Thờ Cao Sơn và Tam Giang đại vương."
  },
  {
    "stt": "62",
    "district": "Cẩm Khê",
    "name": "Làng nón Sai Nga",
    "category": "Làng nghề",
    "location": "Sai Nga",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Nhà nghỉ Cẩm Khê",
    "distance": "5-15 km",
    "notes": "Điểm tham quan, mua sắm làng nghề."
  },
  {
    "stt": "63",
    "district": "Thanh Ba",
    "name": "Đền Du Yến",
    "category": "Di tích quốc gia",
    "location": "Chí Tiên",
    "restaurants": "Nhà hàng trung tâm Thanh Ba",
    "stays": "Nhà nghỉ Thanh Ba/Thị xã Phú Thọ",
    "distance": "5-20 km",
    "notes": "Di tích nổi bật của Thanh Ba."
  },
  {
    "stt": "64",
    "district": "Thanh Ba",
    "name": "Đình - đền Mạo Phổ",
    "category": "Di tích quốc gia",
    "location": "Lương Lỗ",
    "restaurants": "Nhà hàng Thanh Ba",
    "stays": "Nhà nghỉ Thanh Ba/TX Phú Thọ",
    "distance": "5-20 km",
    "notes": "Cụm di tích quan trọng."
  },
  {
    "stt": "65",
    "district": "Thanh Ba",
    "name": "Núi Thắm",
    "category": "Khảo cổ - cảnh quan",
    "location": "Thanh Ba",
    "restaurants": "Nhà hàng Thanh Ba",
    "stays": "Nhà nghỉ Thanh Ba/TX Phú Thọ",
    "distance": "5-20 km",
    "notes": "Có dấu tích cư trú người nguyên thủy."
  },
  {
    "stt": "66",
    "district": "Thanh Ba",
    "name": "Vùng chè Thanh Ba",
    "category": "Nông nghiệp - cảnh quan",
    "location": "Thanh Ba",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Nhà nghỉ Thanh Ba/TX Phú Thọ",
    "distance": "5-20 km",
    "notes": "Phù hợp trải nghiệm chè nếu liên hệ cơ sở."
  },
  {
    "stt": "67",
    "district": "Thanh Ba",
    "name": "Làng quê trung du Thanh Ba",
    "category": "Du lịch nông thôn",
    "location": "Thanh Ba",
    "restaurants": "Nhà hàng/ẩm thực hộ dân",
    "stays": "Nhà nghỉ Thanh Ba/TX Phú Thọ",
    "distance": "5-20 km",
    "notes": "Điểm khảo sát tour nông thôn."
  },
  {
    "stt": "68",
    "district": "Thị xã Phú Thọ",
    "name": "Khu trung tâm thị xã Phú Thọ",
    "category": "Đô thị - lịch sử địa phương",
    "location": "Thị xã Phú Thọ",
    "restaurants": "Nhà hàng trung tâm thị xã",
    "stays": "Khách sạn/nhà nghỉ thị xã Phú Thọ",
    "distance": "0-5 km",
    "notes": "Điểm trung chuyển thuận tiện."
  },
  {
    "stt": "69",
    "district": "Thị xã Phú Thọ",
    "name": "Ga Phú Thọ và không gian đường sắt lịch sử",
    "category": "Kiến trúc - giao thông",
    "location": "Thị xã Phú Thọ",
    "restaurants": "Nhà hàng trung tâm",
    "stays": "Khách sạn/nhà nghỉ thị xã",
    "distance": "0-5 km",
    "notes": "Phù hợp tham quan ngắn, chụp ảnh bên ngoài khu công cộng."
  },
  {
    "stt": "70",
    "district": "Thị xã Phú Thọ",
    "name": "Không gian văn hóa - quảng trường trung tâm thị xã",
    "category": "Đô thị - cộng đồng",
    "location": "Thị xã Phú Thọ",
    "restaurants": "Nhà hàng trung tâm",
    "stays": "Khách sạn/nhà nghỉ thị xã",
    "distance": "0-5 km",
    "notes": "Dùng làm điểm dừng, kết nối Thanh Ba/Hạ Hòa."
  },
  {
    "stt": "71",
    "district": "Thị xã Phú Thọ",
    "name": "Các làng ven sông Thao quanh thị xã",
    "category": "Nông thôn - cảnh quan",
    "location": "Vùng ven thị xã Phú Thọ",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Lưu trú thị xã",
    "distance": "5-15 km",
    "notes": "Phù hợp tuyến đạp xe/khảo sát nông thôn."
  },
  {
    "stt": "72",
    "district": "Tam Nông",
    "name": "Thành Hưng Hóa",
    "category": "Lịch sử - thành cổ",
    "location": "Hưng Hóa",
    "restaurants": "Nhà hàng trung tâm Hưng Hóa",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "0-15 km",
    "notes": "Cụm di tích lịch sử quan trọng."
  },
  {
    "stt": "73",
    "district": "Tam Nông",
    "name": "Cột cờ thành Hưng Hóa",
    "category": "Lịch sử - kiến trúc",
    "location": "Hưng Hóa",
    "restaurants": "Nhà hàng Hưng Hóa",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "0-15 km",
    "notes": "Ghép Thành Hưng Hóa."
  },
  {
    "stt": "74",
    "district": "Tam Nông",
    "name": "Đền thờ Nguyễn Quang Bích",
    "category": "Lịch sử - danh nhân",
    "location": "Hưng Hóa",
    "restaurants": "Nhà hàng Hưng Hóa",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "0-15 km",
    "notes": "Ghép cụm thành Hưng Hóa."
  },
  {
    "stt": "75",
    "district": "Tam Nông",
    "name": "Văn miếu tỉnh Hưng Hóa",
    "category": "Lịch sử - giáo dục",
    "location": "Hưng Hóa",
    "restaurants": "Nhà hàng Hưng Hóa",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "0-15 km",
    "notes": "Phù hợp tour học sinh."
  },
  {
    "stt": "76",
    "district": "Tam Nông",
    "name": "Cảnh quan ven sông Đà Tam Nông",
    "category": "Sinh thái - sông nước",
    "location": "Tam Nông",
    "restaurants": "Nhà hàng cá sông",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Kết nối Thanh Thủy."
  },
  {
    "stt": "77",
    "district": "Tam Nông",
    "name": "Làng quê ven sông Hồng - Tam Nông",
    "category": "Nông thôn - trải nghiệm",
    "location": "Tam Nông",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Nhà nghỉ Tam Nông/Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Có thể xây tour cộng đồng."
  },
  {
    "stt": "78",
    "district": "Thanh Thủy",
    "name": "Khu khoáng nóng Thanh Thủy",
    "category": "Nghỉ dưỡng - chăm sóc sức khỏe",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng trung tâm Thanh Thủy; cá sông Đà, dê, gà đồi",
    "stays": "Wyndham Lynn Times Thanh Thủy; resort/khu nghỉ dưỡng địa phương",
    "distance": "0-10 km",
    "notes": "Cụm nghỉ dưỡng chính."
  },
  {
    "stt": "79",
    "district": "Thanh Thủy",
    "name": "Wyndham Lynn Times Thanh Thủy",
    "category": "Nghỉ dưỡng - khoáng nóng",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng trong khu và trung tâm Thanh Thủy",
    "stays": "Lưu trú tại khu",
    "distance": "0 km",
    "notes": "Phù hợp nghỉ dưỡng gia đình/đoàn."
  },
  {
    "stt": "80",
    "district": "Thanh Thủy",
    "name": "Vườn Vua Resort & Villas",
    "category": "Nghỉ dưỡng - sinh thái",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng trong resort/địa phương",
    "stays": "Lưu trú tại resort",
    "distance": "0 km",
    "notes": "Phù hợp 2N1Đ, teambuilding."
  },
  {
    "stt": "81",
    "district": "Thanh Thủy",
    "name": "Đảo Ngọc Xanh",
    "category": "Vui chơi - nghỉ dưỡng",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng khu du lịch/trung tâm",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "0-10 km",
    "notes": "Phù hợp gia đình, nhóm trẻ."
  },
  {
    "stt": "82",
    "district": "Thanh Thủy",
    "name": "Đình Đào Xá",
    "category": "Di tích - lễ hội",
    "location": "Đào Xá",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Có thể ghép khoáng nóng."
  },
  {
    "stt": "83",
    "district": "Thanh Thủy",
    "name": "Đình La Phù",
    "category": "Di tích văn hóa",
    "location": "La Phù",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Tuyến di tích Thanh Thủy."
  },
  {
    "stt": "84",
    "district": "Thanh Thủy",
    "name": "Khu lưu niệm Chủ tịch Hồ Chí Minh tại đồi Bạch Thạch",
    "category": "Lịch sử",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Phù hợp tour giáo dục truyền thống."
  },
  {
    "stt": "85",
    "district": "Thanh Thủy",
    "name": "Đền Ngọc Sơn",
    "category": "Tâm linh",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Ghép tuyến ven sông."
  },
  {
    "stt": "86",
    "district": "Thanh Thủy",
    "name": "Đền Quốc Tế",
    "category": "Tâm linh",
    "location": "Thanh Thủy",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Điểm tín ngưỡng địa phương."
  },
  {
    "stt": "87",
    "district": "Thanh Thủy",
    "name": "Đình - đền Viễn Lãm",
    "category": "Di tích lịch sử - văn hóa",
    "location": "Bảo Yên",
    "restaurants": "Nhà hàng Thanh Thủy",
    "stays": "Lưu trú Thanh Thủy",
    "distance": "5-15 km",
    "notes": "Gần trục sông Đà; có thể ghép resort."
  },
  {
    "stt": "88",
    "district": "Thanh Sơn",
    "name": "Thác Mây",
    "category": "Sinh thái - thác nước",
    "location": "Hương Cần",
    "restaurants": "Ẩm thực Mường; gà đồi, cá suối, cơm lam",
    "stays": "Nhà sàn/homestay hoặc nhà nghỉ Thanh Sơn",
    "distance": "0-25 km",
    "notes": "Có nhiều tầng thác; chú ý an toàn mùa mưa."
  },
  {
    "stt": "89",
    "district": "Thanh Sơn",
    "name": "Thác Mơ (Vạn Mơ)",
    "category": "Sinh thái - thác nước",
    "location": "Cự Thắng",
    "restaurants": "Ẩm thực Mường tại khu vực/Thanh Sơn",
    "stays": "Nhà sàn/homestay hoặc nhà nghỉ Thanh Sơn",
    "distance": "0-20 km",
    "notes": "Thác nhiều tầng, cảnh quan hoang sơ."
  },
  {
    "stt": "90",
    "district": "Thanh Sơn",
    "name": "Suối Hem - khu Thác Mây",
    "category": "Sinh thái",
    "location": "Hương Cần",
    "restaurants": "Ẩm thực địa phương",
    "stays": "Lưu trú Thanh Sơn",
    "distance": "0-25 km",
    "notes": "Kết hợp Thác Mây."
  },
  {
    "stt": "91",
    "district": "Thanh Sơn",
    "name": "Vùng đồi chè Thanh Sơn",
    "category": "Nông nghiệp - cảnh quan",
    "location": "Thanh Sơn",
    "restaurants": "Thịt chua Thanh Sơn; ẩm thực Mường",
    "stays": "Nhà nghỉ Thanh Sơn",
    "distance": "0-20 km",
    "notes": "Thích hợp check-in, mua chè."
  },
  {
    "stt": "92",
    "district": "Thanh Sơn",
    "name": "Không gian văn hóa Mường Thanh Sơn",
    "category": "Văn hóa cộng đồng",
    "location": "Thanh Sơn",
    "restaurants": "Cơm lam, thịt chua, gà đồi, rau rừng",
    "stays": "Nhà sàn/homestay địa phương",
    "distance": "0-20 km",
    "notes": "Nên liên hệ cộng đồng trước cho đoàn."
  },
  {
    "stt": "93",
    "district": "Tân Sơn",
    "name": "Vườn quốc gia Xuân Sơn",
    "category": "Sinh thái - VQG",
    "location": "Xuân Sơn",
    "restaurants": "Ẩm thực Dao - Mường; gà, cá suối, cơm lam",
    "stays": "Homestay Xuân Sơn 1/2; homestay cộng đồng",
    "distance": "0-10 km",
    "notes": "Nên dành ít nhất 1 ngày."
  },
  {
    "stt": "94",
    "district": "Tân Sơn",
    "name": "Điểm du lịch cộng đồng Bản Dù",
    "category": "Du lịch cộng đồng",
    "location": "Xuân Sơn",
    "restaurants": "Cơm bản, gà, thịt lợn bản, rau rừng",
    "stays": "Homestay tại Bản Dù/Xuân Sơn",
    "distance": "0-3 km",
    "notes": "Điểm du lịch cấp tỉnh."
  },
  {
    "stt": "95",
    "district": "Tân Sơn",
    "name": "Điểm du lịch sinh thái cộng đồng Bản Cỏi",
    "category": "Sinh thái - cộng đồng",
    "location": "Xuân Sơn",
    "restaurants": "Ẩm thực Dao/Mường",
    "stays": "Homestay Bản Cỏi/Xuân Sơn",
    "distance": "0-5 km",
    "notes": "Điểm du lịch cấp tỉnh."
  },
  {
    "stt": "96",
    "district": "Tân Sơn",
    "name": "Điểm du lịch sinh thái Thác Ngọc",
    "category": "Sinh thái - thác",
    "location": "VQG Xuân Sơn",
    "restaurants": "Ẩm thực Xuân Sơn",
    "stays": "Homestay Xuân Sơn",
    "distance": "0-8 km",
    "notes": "Điểm du lịch cấp tỉnh."
  },
  {
    "stt": "97",
    "district": "Tân Sơn",
    "name": "Đồi chè Long Cốc",
    "category": "Cảnh quan - nông nghiệp",
    "location": "Long Cốc",
    "restaurants": "Ẩm thực Mường; chè địa phương",
    "stays": "Homestay Hưng Yên; Homestay Tony Luận; homestay Long Cốc",
    "distance": "0-5 km",
    "notes": "Điểm săn bình minh, săn mây nổi bật; nên ngủ lại từ tối hôm trước."
  },
  {
    "stt": "98",
    "district": "Tân Sơn",
    "name": "Trải nghiệm hái và chế biến chè Long Cốc",
    "category": "Nông nghiệp - trải nghiệm",
    "location": "Long Cốc",
    "restaurants": "Ẩm thực cộng đồng/homestay",
    "stays": "Homestay Long Cốc",
    "distance": "0-3 km",
    "notes": "Nên đặt trước với hộ/cơ sở đón khách; phù hợp tour sinh viên, gia đình."
  },
  {
    "stt": "99",
    "district": "Yên Lập",
    "name": "Hồ Ly",
    "category": "Sinh thái hồ",
    "location": "Thượng Long",
    "restaurants": "Ẩm thực Dao - Mường; cá hồ, gà, cơm lam",
    "stays": "Homestay/nhà nghỉ khu vực Yên Lập",
    "distance": "0-15 km",
    "notes": "Hồ khoảng 40 ha, có cầu treo, cảnh quan núi rừng; phù hợp dã ngoại."
  },
  {
    "stt": "100",
    "district": "Yên Lập",
    "name": "Bản Dao - Mường ven Hồ Ly",
    "category": "Văn hóa cộng đồng",
    "location": "Thượng Long",
    "restaurants": "Ẩm thực bản địa; món Dao - Mường",
    "stays": "Homestay địa phương/nhà nghỉ Yên Lập",
    "distance": "0-10 km",
    "notes": "Có thể kết hợp tìm hiểu thổ cẩm, đời sống bản địa; nên liên hệ cộng đồng trước."
  }
];

export type FoodDish = {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  price: string;
  season: string;
  seasonEn?: string;
  region: PlaceRegion;
  sellers: FoodSeller[];
};

export type FoodSeller = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviewCount: number;
  pickupNote: string;
  price: number;
  unit: string;
  verified?: boolean;
};

export type FoodRegion = {
  id: string;
  label: string;
  subtitle: string;
  dishes: FoodDish[];
};

export const foodRegions: FoodRegion[] = [
  {
    id: "phu-tho-dac-san",
    label: "Khu vực Phú Thọ",
    subtitle: "Hương vị cội nguồn: Bánh tai, thịt chua Thanh Sơn, xáo chuối Lâm Thao, cọ ỏm, bưởi Đoan Hùng, canh rau sắn",
    dishes: [
      {
        id: 'banh-tai-phu-tho',
        name: 'Bánh tai Phú Thọ',
        nameEn: 'Phu Tho Ear-shaped Rice Cake (Banh Tai)',
        image: '/images/food/banh-tai.jpg',
        description: 'Đặc sản truyền thống Phú Thọ, làm từ gạo tẻ dẻo trắng nặn hình cong vành tai, nhân thịt lợn băm nhỏ ướp tiêu hành thơm ngậy, ăn lúc vừa hấp nóng hổi dẻo mềm.',
        descriptionEn: 'Traditional specialty of Phu Tho, made from soft white rice dough shaped like an ear lobe, filled with seasoned minced pork and pepper, steamed hot and fragrant.',
        price: 'Từ 3.000đ/chiếc',
        season: 'Quanh năm',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'banh-tai-ba-tuyet',
            name: 'Bánh tai Bà Tuyết',
            address: 'Hà Thạch, thị xã Phú Thọ, tỉnh Phú Thọ',
            phone: '0981234567',
            hours: '06:00 – 18:00',
            rating: 4.8,
            reviewCount: 210,
            pickupNote: 'Mua tại cửa hàng hoặc đặt giao tận nơi',
            price: 50000,
            unit: 'chục',
            verified: true,
          }
        ]
      },
      {
        id: 'thit-chua-truong-food',
        name: 'Thịt chua Trường Food',
        nameEn: 'Truong Food Fermented Sour Pork (Thit Chua)',
        image: '/images/food/thit-chua-tf.jpg',
        description: 'Đặc sản trứ danh Thanh Sơn - Phú Thọ, chế biến từ thịt lợn sạch lên men tự nhiên với thính ngô rang vàng theo công thức người Mường, ăn kèm lá sung lá ổi và tương ớt.',
        descriptionEn: 'Famous Thanh Son specialty made from select pork naturally fermented with roasted corn powder, served with fig leaves and chili sauce.',
        price: 'Từ 45.000đ/hộp',
        season: 'Quanh năm',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'truong-food-chinh-hang',
            name: 'Cửa hàng chính hãng Trường Food',
            address: 'xã Thanh Sơn, tỉnh Phú Thọ',
            phone: '02102225666',
            hours: '07:30 – 21:00',
            rating: 4.9,
            reviewCount: 520,
            pickupNote: 'Đóng hộp tiêu chuẩn OCOP 4 sao, hạn sử dụng 2 tháng',
            price: 45000,
            unit: 'hộp',
            verified: true,
          }
        ]
      },
      {
        id: 'xao-chuoi-lam-thao',
        name: 'Xáo chuối Lâm Thao',
        nameEn: 'Lam Thao Green Banana Braised Pork (Xao Chuoi)',
        image: '/images/food/xao-chuoi-lam-thao.png',
        description: 'Món ăn cổ truyền trứ danh của vùng đất Lâm Thao, chuối tiêu xanh tước vỏ nấu nhừ cùng sườn lợn, tiết và nghệ vàng, mang vị ngọt bùi béo ngậy đặc trưng không nơi nào có được.',
        descriptionEn: 'Traditional signature delicacy of Lam Thao, green bananas slow-cooked with pork ribs, turmeric, and herbs, offering a velvety, savory flavor.',
        price: 'Từ 60.000đ/bát',
        season: 'Quanh năm, đặc biệt trong các dịp cỗ làng và lễ hội',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'xao-chuoi-lam-thao-quan',
            name: 'Quán Đặc Sản Làng Quê Lâm Thao',
            address: 'xã Xuân Lũng, tỉnh Phú Thọ',
            phone: '0978123456',
            hours: '08:00 – 20:00',
            rating: 4.8,
            reviewCount: 180,
            pickupNote: 'Phục vụ ăn tại chỗ nóng hổi hoặc đặt cỗ gia đình',
            price: 60000,
            unit: 'bát',
            verified: true,
          }
        ]
      },
      {
        id: 'co-om-phu-tho',
        name: 'Cọ ỏm Đất Tổ',
        nameEn: 'Phu Tho Warmed Palm Fruits (Co Om)',
        image: '/images/food/co-om.jpg',
        description: 'Món quà thiên nhiên độc đáo xứ cọ Phú Thọ. Quả cọ già dày cùi ỏm trong nước nóng vừa độ cho mềm, lớp cùi vàng óng dẻo quánh, vị béo bùi ngậy chấm chút nước mắm ớt thơm lừng.',
        descriptionEn: 'A unique rustic gift of the palm land, palm fruits delicately steeped in warm water until soft, creamy, rich and savory.',
        price: 'Từ 50.000đ/kg',
        season: 'Mùa đông (tháng 10 - tháng 12 âm lịch)',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'co-om-phu-ninh',
            name: 'Vựa cọ nếp Phù Ninh',
            address: 'xã Tiên Kiên, tỉnh Phú Thọ',
            phone: '0983456789',
            hours: '07:00 – 19:00',
            rating: 4.7,
            reviewCount: 140,
            pickupNote: 'Cọ ỏm sẵn trong ngày hoặc đóng túi quả tươi về tự ỏm',
            price: 50000,
            unit: 'kg',
            verified: true,
          }
        ]
      },
      {
        id: 'buoi-doan-hung',
        name: 'Bưởi Đoan Hùng',
        nameEn: 'Doan Hung Pomelo',
        image: '/images/food/buoi-doan-hung.jpg',
        description: 'Đặc sản bưởi trứ danh của vùng đất Đoan Hùng, tép nhỏ mọng nước, tép vàng trong, vị ngọt thanh mát tan trong đầu lưỡi và hương thơm ngát đặc trưng.',
        descriptionEn: 'Renowned sweet pomelo of Doan Hung, translucent golden segments, extremely juicy with sweet aromatic flavor.',
        price: 'Từ 35.000đ/quả',
        season: 'Mùa thu (tháng 8 - 11 âm lịch)',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'nha-vuon-doan-hung',
            name: 'Nhà vườn bưởi Sửu Bằng Luân',
            address: 'xã Bằng Luân, tỉnh Phú Thọ',
            phone: '0981234567',
            hours: '07:00 – 18:00',
            rating: 4.8,
            reviewCount: 200,
            pickupNote: 'Mua tại vườn, có thùng quà biếu sang trọng',
            price: 35000,
            unit: 'quả',
            verified: true,
          }
        ]
      },
      {
        id: 'rau-san-chua',
        name: 'Canh rau sắn muối chua',
        nameEn: 'Sour Fermented Cassava Leaves Soup (Canh Rau San)',
        image: '/images/food/rau-san-chua.png',
        description: 'Món ăn dân dã thấm đẫm ân tình Đất Tổ. Ngọn rau sắn non muối chua nấu cùng cá đồng hoặc tép suối, nước canh chua dịu ngọt thanh bùi bùi ăn cùng cơm nóng khó quên.',
        descriptionEn: 'Soulful comfort food of Phu Tho, tender young cassava leaves fermented sour and braised with river fish, offering a refreshing tangy and savory broth.',
        price: 'Từ 30.000đ/hũ',
        season: 'Quanh năm',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'rau-san-hung-lo',
            name: 'Cơ sở Rau sắn chua làng cổ',
            address: 'phường Vân Phú, tỉnh Phú Thọ',
            phone: '0977889900',
            hours: '07:00 – 18:00',
            rating: 4.9,
            reviewCount: 160,
            pickupNote: 'Đóng hộp tiệt trùng gửi toàn quốc',
            price: 30000,
            unit: 'hũ 1kg',
            verified: true,
          }
        ]
      },
      {
        id: 'mi-gao-hung-lo',
        name: 'Mì gạo Hùng Lô',
        nameEn: 'Hung Lo Traditional Rice Noodles',
        image: '/images/food/mi-gao.jpg',
        description: 'Sợi mì gạo sạch trắng ngà, làm từ hạt gạo dẻo thơm ngâm kỹ, xay nhuyễn và phơi nắng tự nhiên bên đình cổ Hùng Lô, khi nấu sợi mềm dai không bị nát.',
        descriptionEn: 'Artisanal clean rice noodles from historic Hung Lo village, naturally sun-dried, pleasantly chewy and fragrant.',
        price: 'Từ 30.000đ/kg',
        season: 'Quanh năm',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'htx-mi-gao-hung-lo',
            name: 'HTX Mì gạo Hùng Lô OCOP',
            address: 'phường Vân Phú, tỉnh Phú Thọ',
            phone: '0978901234',
            hours: '07:30 – 18:00',
            rating: 4.9,
            reviewCount: 280,
            pickupNote: 'Đóng gói 1kg, chuẩn OCOP Phú Thọ',
            price: 30000,
            unit: 'kg',
            verified: true,
          }
        ]
      },
      {
        id: 'banh-chung-banh-day',
        name: 'Bánh chưng, bánh dầy Đất Tổ',
        nameEn: 'Banh Chung & Banh Day of Ancestral Land',
        image: '/images/food/banh-chung.jpg',
        description: 'Món bánh truyền thống dâng Vua Hùng, mang ý nghĩa trời tròn đất vuông, dẻo thơm hạt nếp cái hoa vàng quện đỗ xanh thịt mỡ đậm đà hương vị cội nguồn.',
        descriptionEn: 'Traditional sacred cakes offered to the Hung Kings, rich in ancestral flavors and historical symbolism.',
        price: 'Từ 50.000đ/chiếc',
        season: 'Đặc biệt vào dịp Giỗ Tổ và lễ Tết',
        region: 'Phú Thọ',
        sellers: [
          {
            id: 'htx-banh-chung-hung-lo',
            name: 'HTX Bánh chưng truyền thống Hùng Lô',
            address: 'phường Vân Phú, tỉnh Phú Thọ',
            phone: '0912345678',
            hours: '07:00 – 17:00',
            rating: 4.9,
            reviewCount: 300,
            pickupNote: 'Đóng gói hút chân không, thích hợp làm quà',
            price: 60000,
            unit: 'chiếc',
            verified: true,
          }
        ]
      }
    ]
  },
  {
    id: "vinh-phuc-dac-san",
    label: "Khu vực Vĩnh Phúc",
    subtitle: "Mỹ vị đồng quê & non cao: Cá thính Lập Thạch, bò tái kiến đốt, chè kho Tứ Yên, dứa Tam Dương, tép Đầm Vạc, rau su su",
    dishes: [
      {
        id: 'ca-thinh-lap-thach',
        name: 'Cá thính Lập Thạch',
        nameEn: 'Lap Thach Fermented Salted Fish (Ca Thinh)',
        image: '/images/food/ca-thinh.jpg',
        description: 'Cá mè, cá quả tươi ngon ướp muối kỹ rồi lên men trong thính ngô rang thơm lừng và ép chặt trong vại gốm. Khi nướng lên da cá vàng ruộm, thịt cá màu hồng chua ngậy đậm đà.',
        descriptionEn: 'Lap Thach fermented fish steeped with roasted corn flour and sea salt, pan-fried to fragrant golden crispiness with unique tangy taste.',
        price: 'Từ 150.000đ/hộp',
        season: 'Quanh năm',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'ca-thinh-lap-thach-ngon',
            name: 'Đặc sản cá thính Lập Thạch gia truyền',
            address: 'xã Tam Sơn, tỉnh Phú Thọ',
            phone: '0912345890',
            hours: '07:00 – 18:00',
            rating: 4.8,
            reviewCount: 320,
            pickupNote: 'Đóng hộp hút chân không tiện lợi mang đi xa',
            price: 150000,
            unit: 'hộp 1kg',
            verified: true,
          }
        ]
      },
      {
        id: 'bo-tai-kien-dot',
        name: 'Bò tái kiến đốt Tam Đảo',
        nameEn: 'Tam Dao Ant-Bitten Rare Beef (Bo Tai Kien Dot)',
        image: '/images/food/bo-tai-kien-dot.jpg',
        description: 'Món ăn trứ danh độc đáo bậc nhất Tam Đảo. Từng tảng thịt bò tươi nóng hổi được treo lên cây rừng cho các tổ kiến tự nhiên đốt ngấu, sau đó nướng trên than hoa tạo nên vị ngọt đậm và mùi thơm hoang dã hiếm có.',
        descriptionEn: 'Extremely unique Tam Dao specialty, prime beef hung near wild ant nests on forest trees to be bitten before charcoal grilling, yielding sublime tenderness.',
        price: 'Từ 250.000đ/đĩa',
        season: 'Quanh năm, ngon nhất khi thưởng thức trên đỉnh mù sương Tam Đảo',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'bo-tai-tam-dao-quan',
            name: 'Nhà hàng Đệ Nhất Bò Tái Tam Đảo',
            address: 'xã Tam Đảo, tỉnh Phú Thọ',
            phone: '0979888999',
            hours: '10:00 – 22:30',
            rating: 4.9,
            reviewCount: 410,
            pickupNote: 'Thưởng thức tại nhà hàng kèm nước tương gừng và rau rừng',
            price: 250000,
            unit: 'đĩa',
            verified: true,
          }
        ]
      },
      {
        id: 'che-kho-tu-yen',
        name: 'Chè kho Tứ Yên',
        nameEn: 'Tu Yen Mung Bean Sweet Pudding (Che Kho)',
        image: '/images/food/che-kho-tu-yen.jpg',
        description: 'Đặc sản tiến vua truyền thống làng Tứ Yên, nấu từ đậu xanh lòng vàng đãi vỏ tinh khiết, xào kỹ với đường kính và thoảng chút hương thảo quả cay dịu, bề mặt mịn màng rắc vừng rang thơm bùi.',
        descriptionEn: 'Ancient royal offering of Tu Yen village, silken smooth mung bean paste cooked with sugar and fragrant cardamom seeds.',
        price: 'Từ 40.000đ/đĩa',
        season: 'Quanh năm, đặc biệt dịp lễ hội tháng Giêng',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'che-kho-tu-yen-co-so',
            name: 'Cơ sở Chè kho Tứ Yên truyền thống',
            address: 'xã Tứ Yên, tỉnh Phú Thọ',
            phone: '0988776655',
            hours: '07:30 – 19:00',
            rating: 4.8,
            reviewCount: 220,
            pickupNote: 'Đóng hộp giấy quà tặng đẹp mắt',
            price: 40000,
            unit: 'đĩa',
            verified: true,
          }
        ]
      },
      {
        id: 'dua-tam-duong',
        name: 'Dứa Tam Dương',
        nameEn: 'Tam Duong Sweet Pineapples',
        image: '/images/food/dua-tam-duong.jpg',
        description: 'Đặc sản vùng đất đồi Tam Dương, quả dứa chín vàng óng ả, mắt phẳng, tép dứa giòn tan, nhiều mật ngọt và thơm lừng vị ngọt thanh mát mùa hè.',
        descriptionEn: 'Sweet aromatic pineapples grown on the hills of Tam Duong, intensely fragrant, crispy and bursting with honey-like nectar.',
        price: 'Từ 20.000đ/quả',
        season: 'Mùa thu hoạch rộ từ tháng 4 đến tháng 7',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'nha-vuon-dua-tam-duong',
            name: 'Trang trại Dứa Tam Dương',
            address: 'xã Hướng Đạo, huyện Tam Dương, tỉnh Phú Thọ',
            phone: '0971234999',
            hours: '06:00 – 18:00',
            rating: 4.7,
            reviewCount: 150,
            pickupNote: 'Mua dứa tươi cắt tại đồi hoặc nước ép dứa nguyên chất',
            price: 20000,
            unit: 'quả',
            verified: true,
          }
        ]
      },
      {
        id: 'tep-dau-dam-vac',
        name: 'Tép Dầu Đầm Vạc',
        nameEn: 'Dam Vac Small River Fish (Tep Dau)',
        image: '/images/food/tep-dau-dam-vac.jpg',
        description: '“Cỗ chín lợn mười trâu không bằng Tép Dầu Đầm Vạc”. Loài cá nhỏ tự nhiên nhiều trứng béo ngậy ở vùng nước Đầm Vạc, thường kho tương bần hoặc nấu canh chua thanh mát tuyệt phẩm.',
        descriptionEn: 'Famous roe-filled small river fish from Dam Vac wetland, braised with fermented soybean paste or cooked in sour soups.',
        price: 'Từ 90.000đ/niêu',
        season: 'Từ tháng 8 đến tháng 10 âm lịch',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'nha-hang-dam-vac',
            name: 'Nhà hàng Ẩm thực Ven Hồ Đầm Vạc',
            address: 'Phường Vĩnh Yên, tỉnh Phú Thọ',
            phone: '02113888999',
            hours: '09:00 – 22:00',
            rating: 4.8,
            reviewCount: 290,
            pickupNote: 'Phục vụ niêu cá kho nóng sốt tại bàn',
            price: 90000,
            unit: 'niêu',
            verified: true,
          }
        ]
      },
      {
        id: 'banh-trung-mat-mia',
        name: 'Bánh trùng mật mía Vĩnh Tường',
        nameEn: 'Vinh Tuong Molasses Rice Cake (Banh Trung)',
        image: '/images/food/banh-trung-mat-mia.jpg',
        description: 'Món bánh dân dã độc đáo không nhân của phủ Vĩnh Tường xưa, viên bột nếp luộc trong nước mật mía cô đặc đỏ au sóng sánh, phảng phất hương gừng cay nồng và rắc vừng thơm ngậy.',
        descriptionEn: 'Vinh Tuong traditional dessert of sticky rice dumplings simmered in rich ginger-infused dark sugarcane molasses.',
        price: 'Từ 25.000đ/bát',
        season: 'Quanh năm, đặc biệt ngon vào mùa đông se lạnh',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'banh-trung-vinh-tuong',
            name: 'Bánh trùng mật mía Lũng Hòa',
            address: 'xã Thổ Tang, tỉnh Phú Thọ',
            phone: '0987654321',
            hours: '07:00 – 19:00',
            rating: 4.8,
            reviewCount: 170,
            pickupNote: 'Bán bát nóng tại chỗ hoặc đóng hộp mang về',
            price: 25000,
            unit: 'bát',
            verified: true,
          }
        ]
      },
      {
        id: 'rau-su-su-tam-dao',
        name: 'Rau su su Tam Đảo',
        nameEn: 'Tam Dao Fresh Chayote Shoots',
        image: '/images/food/su-su-tam-dao.png',
        description: 'Đặc sản trứ danh xứ sương mù Tam Đảo, ngọn su su xanh non mỡ màng, giòn sần sật xào tỏi thơm nức hoặc luộc chấm muối vừng đậm đà.',
        descriptionEn: 'Crisp, sweet, and vibrant green chayote shoots cultivated in the cool mountain mist of Tam Dao, stir-fried with garlic.',
        price: 'Từ 25.000đ/bó',
        season: 'Quanh năm',
        region: 'Vĩnh Phúc',
        sellers: [
          {
            id: 'su-su-tam-dao-farm',
            name: 'Hợp tác xã Nông sản sạch Tam Đảo',
            address: 'xã Tam Đảo, tỉnh Phú Thọ',
            phone: '0915678901',
            hours: '06:00 – 18:00',
            rating: 4.9,
            reviewCount: 450,
            pickupNote: 'Ngắt tươi tại vườn mỗi sớm mai, giao tận tay du khách',
            price: 25000,
            unit: 'bó 1kg',
            verified: true,
          }
        ]
      }
    ]
  },
  {
    id: "hoa-binh-dac-san",
    label: "Khu vực Hòa Bình",
    subtitle: "Mỹ vị đại ngàn Tây Bắc: Cơm lam nếp nương, thịt lợn muối chua, gà đồi nấu măng, chả cuốn lá bưởi, cá nướng sông Đà, thịt trâu lá lồm, rượu cần Mường",
    dishes: [
      {
        id: 'com-lam-muong',
        name: 'Cơm lam nếp nương Mường',
        nameEn: 'Muong Bamboo Tube Sticky Rice (Com Lam)',
        image: '/images/food/com-lam-mai-chau.png',
        description: 'Đặc sản không thể bỏ lỡ của xứ Mường. Gạo nếp nương thơm dẻo ngâm nước cốt dừa tươi, nén trong ống nứa non rồi nướng đều trên than hồng, bóc vỏ nứa giữ nguyên lớp màng lụa trắng chấm muối vừng tuyệt ngon.',
        descriptionEn: 'Iconic highland delicacy: fragrant upland sticky rice steamed inside young bamboo stalks with coconut juice, paired with toasted sesame salt.',
        price: 'Từ 15.000đ/ống',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'com-lam-ban-lac',
            name: 'Cơm lam Bản Lác Mai Châu',
            address: 'xã Mai Châu, tỉnh Phú Thọ',
            phone: '0982345678',
            hours: '07:00 – 21:00',
            rating: 4.9,
            reviewCount: 380,
            pickupNote: 'Nướng nóng liên tục, có thể bảo quản mang về làm quà',
            price: 15000,
            unit: 'ống',
            verified: true,
          }
        ]
      },
      {
        id: 'thit-lon-muoi-chua',
        name: 'Thịt lợn muối chua Hòa Bình',
        nameEn: 'Hoa Binh Salted Sour Pork',
        image: '/images/food/thit-lon-muoi-chua.jpg',
        description: 'Thịt lợn bản tươi ngon ướp với men lá rừng bí truyền, thính gạo rang giã nhỏ và muối hầm, ủ trong bồ tre lót lá chuối. Món ăn có vị chua thanh dịu, ngậy thơm bùi béo ăn kèm các loại lá rừng.',
        descriptionEn: 'Indigenous Muong fermented pork cured with wild forest leaves, roasted rice powder, and rock salt, wrapped in forest greens.',
        price: 'Từ 70.000đ/hộp',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'thit-muoi-chua-muong',
            name: 'Đặc sản Thịt muối chua Mường Bi',
            address: 'xã Mường Bi, tỉnh Phú Thọ',
            phone: '0973456789',
            hours: '07:30 – 19:30',
            rating: 4.8,
            reviewCount: 260,
            pickupNote: 'Đóng hộp chuẩn OCOP lót lá chuối sạch',
            price: 70000,
            unit: 'hộp 500g',
            verified: true,
          }
        ]
      },
      {
        id: 'ga-doi-nau-mang',
        name: 'Gà đồi nấu măng chua',
        nameEn: 'Highland Chicken with Sour Bamboo Shoots',
        image: '/images/food/ga-doi-nau-mang.jpg',
        description: 'Gà thả đồi thịt săn chắc, da giòn thơm nấu cùng măng giang chua thanh và hạt dổi nướng thơm nức mũi. Nước canh chua thanh ngọt đậm, ăn cùng cơm nếp hay bún đều ngon hết ý.',
        descriptionEn: 'Free-range hill chicken simmered with wild sour bamboo shoots and aromatic doi seeds, delivering an invigorating, savory soup.',
        price: 'Từ 180.000đ/nồi',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'nha-hang-ga-doi-thung-nai',
            name: 'Nhà hàng Ẩm thực Thung Nai',
            address: 'xã Thung Nai, tỉnh Phú Thọ',
            phone: '0912987654',
            hours: '08:00 – 21:00',
            rating: 4.8,
            reviewCount: 310,
            pickupNote: 'Phục vụ lẩu gà hoặc canh gà nóng sốt tại bàn',
            price: 180000,
            unit: 'nồi',
            verified: true,
          }
        ]
      },
      {
        id: 'cha-cuon-la-buoi',
        name: 'Chả cuốn lá bưởi Mường',
        nameEn: 'Muong Grilled Pork Wrapped in Pomelo Leaves',
        image: '/images/food/cha-cuon-la-buoi.jpg',
        description: 'Đặc sản độc đáo chỉ có ở xứ Mường. Thịt lợn mán băm nhỏ ướp hạt dổi, hành rừng rồi cuộn trong lá bưởi non nướng trên than hoa. Vị đắng nhẹ thơm ngát của lá bưởi quyện với vị ngọt béo của thịt tạo nên dư vị khó quên.',
        descriptionEn: 'Tender minced pork infused with forest wild pepper, wrapped in fresh young pomelo leaves and grilled over charcoal embers.',
        price: 'Từ 90.000đ/đĩa',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'cha-la-buoi-quan',
            name: 'Quán Ăn Dân Tộc Mường',
            address: 'xã Bo, tỉnh Phú Thọ',
            phone: '0989012345',
            hours: '09:00 – 22:00',
            rating: 4.8,
            reviewCount: 230,
            pickupNote: 'Ăn nóng tại chỗ kèm rau rừng tươi ngon',
            price: 90000,
            unit: 'đĩa',
            verified: true,
          }
        ]
      },
      {
        id: 'ca-nuong-song-da',
        name: 'Cá nướng sông Đà',
        nameEn: 'Da River Grilled Fish',
        image: '/images/food/ca-nuong-song-da.jpg',
        description: 'Cá lăng, cá trắm đen đánh bắt từ lòng hồ sông Đà, kẹp vào thanh tre tươi ướp muối ớt, mắc khén rồi nướng chậm trên than củi bên bờ hồ. Thịt cá dai ngọt thơm nức mũi.',
        descriptionEn: 'Fresh river fish caught from Da River reservoir, seasoned with mountain mac khen spices and grilled on fresh bamboo skewers.',
        price: 'Từ 150.000đ/con',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'ca-nuong-thung-nai',
            name: 'Bè cá sông Đà Thung Nai',
            address: 'xã Thung Nai, tỉnh Phú Thọ',
            phone: '0978654123',
            hours: '08:00 – 20:00',
            rating: 4.9,
            reviewCount: 420,
            pickupNote: 'Nướng tại thuyền hoặc đóng gói hút chân không',
            price: 150000,
            unit: 'con',
            verified: true,
          }
        ]
      },
      {
        id: 'thit-trau-la-lom',
        name: 'Thịt trâu nấu lá lồm',
        nameEn: 'Tender Buffalo Stew with Lom Leaves',
        image: '/images/food/thit-trau-la-lom.jpg',
        description: 'Thịt trâu tươi thui vàng giòn thơm, ninh nhừ trong nồi đất cùng lá lồm (lá chua rừng) và gạo tấm. Miếng thịt trâu mềm ngọt, nước canh sền sệt chua thanh kích thích vị giác.',
        descriptionEn: 'Traditional highland slow-braised buffalo meat stewed with wild sour lom leaves, yielding buttery tenderness and a mouthwatering tangy aroma.',
        price: 'Từ 120.000đ/bát',
        season: 'Quanh năm',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'nha-hang-trau-la-lom',
            name: 'Nhà hàng Ẩm thực Tây Bắc',
            address: 'xã Mai Châu, tỉnh Phú Thọ',
            phone: '0912112233',
            hours: '09:00 – 22:00',
            rating: 4.8,
            reviewCount: 350,
            pickupNote: 'Món cỗ Mường truyền thống chuẩn vị',
            price: 120000,
            unit: 'bát',
            verified: true,
          }
        ]
      },
      {
        id: 'ruou-can-muong',
        name: 'Rượu cần Mường',
        nameEn: 'Muong Traditional Straw Wine (Ruou Can)',
        image: '/images/food/ruou-can-muong.jpg',
        description: 'Thức uống linh hồn trong các dịp hội hè xứ Mường. Rượu ủ từ nếp nương, vỏ trấu và hàng chục vị men lá thuốc rừng, hương vị ngọt thơm êm say nồng ấm tình người.',
        descriptionEn: 'Sacred fermented rice wine drank through bamboo straws, brewed from mountain sticky rice and wild botanical yeast.',
        price: 'Từ 120.000đ/bình',
        season: 'Quanh năm, đặc biệt dịp lễ tết và hội bản',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'ruou-can-hoa-binh',
            name: 'Cơ sở Rượu cần Mường truyền thống',
            address: 'phường Thái Bình, tỉnh Phú Thọ',
            phone: '02183856789',
            hours: '07:30 – 20:00',
            rating: 4.9,
            reviewCount: 310,
            pickupNote: 'Bình gốm 5 lít - 10 lít kèm bộ cần trúc cao cấp',
            price: 120000,
            unit: 'bình 5L',
            verified: true,
          }
        ]
      },
      {
        id: 'cam-cao-phong',
        name: 'Cam Cao Phong',
        nameEn: 'Cao Phong Sweet Oranges',
        image: '/images/food/cam.png',
        description: 'Đặc sản nức tiếng vùng lòng chảo Cao Phong, trái cam vỏ mỏng vàng ruộm, mọng nước, vị ngọt lịm đậm đà và mùi thơm tươi mát.',
        descriptionEn: 'Renowned sweet oranges of Cao Phong valley, thin golden skin, juicy and delightfully sweet.',
        price: 'Từ 35.000đ/kg',
        season: 'Từ tháng 10 đến tháng 2 năm sau',
        region: 'Hòa Bình',
        sellers: [
          {
            id: 'vuon-cam-cao-phong',
            name: 'Vườn cam sạch Cao Phong OCOP',
            address: 'xã Thung Nai, tỉnh Phú Thọ',
            phone: '0987654321',
            hours: '07:00 – 18:00',
            rating: 4.8,
            reviewCount: 220,
            pickupNote: 'Hái trực tiếp tại vườn hoặc đóng thùng quà tặng',
            price: 35000,
            unit: 'kg',
            verified: true,
          }
        ]
      }
    ]
  }
];

export const categoryIcons: Record<Category, string> = {
  "Tất cả": "◈",
  "Di sản & tâm linh": "🏛️",
  "Núi rừng & sinh thái": "🌲",
  "Nghỉ dưỡng & chữa lành": "♨️",
  "Văn hóa & làng nghề": "🏮",
  "Check-in & vui chơi": "📸",
};


export type ServiceItem = {
  id: string;
  icon: string;
  name: string;
  type: "Trạm xăng" | "Bãi đỗ xe" | "Y tế" | "ATM" | "Trạm sạc EV" | "Cứu hộ" | "Tiện ích";
  province: "Phú Thọ" | "Vĩnh Phúc" | "Hòa Bình";
  district: string;
  lat: number;
  lng: number;
  note: string;
  address: string;
  phone?: string;
  image?: string;
};

export const comprehensiveServices: ServiceItem[] = [
  // --- PHÚ THỌ ---
  { id: "srv-pt-1", icon: "✚", name: "Bệnh viện Đa khoa tỉnh Phú Thọ", type: "Y tế", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3215, lng: 105.3926, note: "Cấp cứu 24/7 · Tuyến đầu", address: "Đường Nguyễn Tất Thành, P. Tân Dân, TP. Việt Trì", phone: "02103955555" },
  { id: "srv-pt-2", icon: "⛽", name: "Trạm xăng Petrolimex Hùng Vương", type: "Trạm xăng", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3341, lng: 105.3835, note: "Mở cửa 24/24 · Xăng A95, E5, Dầu DO", address: "Đại lộ Hùng Vương, TP. Việt Trì", phone: "02103846123" },
  { id: "srv-pt-3", icon: "🅿️", name: "Bãi đỗ xe trung tâm Đền Hùng", type: "Bãi đỗ xe", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3612, lng: 105.3297, note: "Sức chứa 2000 xe · Có xe điện trung chuyển", address: "Khu 8, xã Hy Cương, tỉnh Phú Thọ", phone: "02103860012" },
  { id: "srv-pt-4", icon: "⚡", name: "Trạm sạc VinFast Vincom Plaza Việt Trì", type: "Trạm sạc EV", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3175, lng: 105.4012, note: "Sạc siêu nhanh 250kW & 60kW", address: "Đường Hùng Vương, P. Tiên Cát, TP. Việt Trì" },
  { id: "srv-pt-5", icon: "▣", name: "ATM Vietcombank Việt Trì 24/7", type: "ATM", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3048, lng: 105.4028, note: "Rút tiền, chuyển khoản đa ngân hàng", address: "Số 668 Đại lộ Hùng Vương, TP. Việt Trì" },
  { id: "srv-pt-6", icon: "🛠️", name: "Cứu hộ giao thông Phú Thọ 116", type: "Cứu hộ", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.312, lng: 105.395, note: "Cứu hộ xe tai nạn, chết máy, vá lốp 24/7", address: "Toàn tỉnh Phú Thọ & Cao tốc Nội Bài - Lào Cai", phone: "0983116116" },
  { id: "srv-pt-7", icon: "⛽", name: "Trạm xăng Petrolimex Thanh Thủy", type: "Trạm xăng", province: "Phú Thọ", district: "Huyện Thanh Thủy", lat: 21.178, lng: 105.289, note: "Mở cửa cả ngày · Bơm xe, nước làm mát", address: "Khu 3, xã La Phù, Huyện Thanh Thủy", phone: "02103878234" },
  { id: "srv-pt-8", icon: "✚", name: "Trung tâm Y tế Huyện Thanh Thủy", type: "Y tế", province: "Phú Thọ", district: "Huyện Thanh Thủy", lat: 21.182, lng: 105.295, note: "Trực cấp cứu 24/7", address: "Khu 5, xã Thanh Thủy", phone: "02103877115" },
  { id: "srv-pt-9", icon: "🅿️", name: "Bãi đỗ xe Khu du lịch Long Cốc", type: "Bãi đỗ xe", province: "Phú Thọ", district: "Huyện Tân Sơn", lat: 21.205, lng: 105.082, note: "Bãi xe chân đồi chè · Có dịch vụ xe ôm bản địa", address: "Xã Long Cốc, huyện Tân Sơn" },
  { id: "srv-pt-10", icon: "⛽", name: "Trạm xăng ngã ba Tân Sơn - VQG Xuân Sơn", type: "Trạm xăng", province: "Phú Thọ", district: "Huyện Tân Sơn", lat: 21.124, lng: 104.985, note: "Trạm xăng cuối cùng trước khi vào rừng nguyên sinh", address: "Xã Xuân Đài, huyện Tân Sơn" },

  // --- VĨNH PHÚC ---
  { id: "srv-vp-1", icon: "⛽", name: "Trạm xăng Petrolimex Chân Đèo Tam Đảo", type: "Trạm xăng", province: "Vĩnh Phúc", district: "Huyện Tam Đảo", lat: 21.412, lng: 105.618, note: "Cần đổ đầy bình trước khi lên dốc đèo 13km", address: "Ngã ba Hợp Châu, QL2B, Huyện Tam Đảo", phone: "02113853112" },
  { id: "srv-vp-2", icon: "🅿️", name: "Bãi đỗ xe Trung tâm Xã Tam Đảo", type: "Bãi đỗ xe", province: "Vĩnh Phúc", district: "Huyện Tam Đảo", lat: 21.458, lng: 105.648, note: "Bãi xe Quảng trường & Khách sạn trung tâm", address: "Khu 1, xã Tam Đảo", phone: "02113824123" },
  { id: "srv-vp-3", icon: "🛠️", name: "Đội cứu hộ đèo dốc Tam Đảo 24/7", type: "Cứu hộ", province: "Vĩnh Phúc", district: "Huyện Tam Đảo", lat: 21.442, lng: 105.635, note: "Hỗ trợ mất phanh, hỏng số đèo Tam Đảo & Tây Thiên", address: "Dọc tuyến đèo QL2B Tam Đảo", phone: "0915998116" },
  { id: "srv-vp-4", icon: "🅿️", name: "Bãi đỗ xe Cáp treo Tây Thiên", type: "Bãi đỗ xe", province: "Vĩnh Phúc", district: "Huyện Tam Đảo", lat: 21.492, lng: 105.592, note: "Bãi xe rộng hàng nghìn m2 · Điểm xuất phát cáp treo", address: "Xã Đại Đình, huyện Tam Đảo" },
  { id: "srv-vp-5", icon: "✚", name: "Bệnh viện Đa khoa tỉnh Vĩnh Phúc", type: "Y tế", province: "Vĩnh Phúc", district: "TP. Vĩnh Yên", lat: 21.315, lng: 105.589, note: "Cấp cứu 24/7 · Trang thiết bị hiện đại", address: "Đường Lạc Long Quân, P. Định Trung, TP. Vĩnh Yên", phone: "02113861206" },
  { id: "srv-vp-6", icon: "⚡", name: "Trạm sạc VinFast Flamingo Đại Lải Resort", type: "Trạm sạc EV", province: "Vĩnh Phúc", district: "TP. Phúc Yên", lat: 21.332, lng: 105.715, note: "Sạc công cộng cho khách du lịch và cư dân", address: "Khu nghỉ dưỡng Flamingo Đại Lải, Phúc Yên" },
  { id: "srv-vp-7", icon: "▣", name: "ATM BIDV Phúc Yên - Đại Lải", type: "ATM", province: "Vĩnh Phúc", district: "TP. Phúc Yên", lat: 21.325, lng: 105.702, note: "Hoạt động liên tục 24/7", address: "Đường Nguyễn Tất Thành, TP. Phúc Yên" },
  { id: "srv-vp-8", icon: "⛽", name: "Trạm xăng Petrolimex Số 1 Vĩnh Yên", type: "Trạm xăng", province: "Vĩnh Phúc", district: "TP. Vĩnh Yên", lat: 21.312, lng: 105.595, note: "Mở cửa 24/24 · Đầy đủ xăng dầu chất lượng cao", address: "Đường Mê Linh, P. Khai Quang, TP. Vĩnh Yên", phone: "02113862234" },
  { id: "srv-vp-9", icon: "⚡", name: "Trạm sạc VinFast Vincom Plaza Vĩnh Yên", type: "Trạm sạc EV", province: "Vĩnh Phúc", district: "TP. Vĩnh Yên", lat: 21.318, lng: 105.602, note: "Trụ sạc nhanh ô tô điện 60kW – 250kW", address: "Đường Hai Bà Trưng, P. Tiền Châu, TP. Vĩnh Yên" },
  { id: "srv-vp-10", icon: "▣", name: "ATM Vietcombank Vĩnh Phúc 24/7", type: "ATM", province: "Vĩnh Phúc", district: "TP. Vĩnh Yên", lat: 21.316, lng: 105.592, note: "Rút tiền, chuyển khoản ngân hàng", address: "Đường Kim Ngọc, TP. Vĩnh Yên" },
  { id: "srv-vp-11", icon: "✚", name: "Trung tâm Y tế Huyện Tam Đảo", type: "Y tế", province: "Vĩnh Phúc", district: "Huyện Tam Đảo", lat: 21.425, lng: 105.625, note: "Trực cấp cứu y tế 24/7 phục vụ khách du lịch", address: "Xã Hợp Châu, Huyện Tam Đảo", phone: "02113853115" },
  { id: "srv-vp-12", icon: "🛠️", name: "Cứu hộ giao thông Vĩnh Phúc 116", type: "Cứu hộ", province: "Vĩnh Phúc", district: "TP. Vĩnh Yên", lat: 21.310, lng: 105.580, note: "Cứu hộ xe hỏng, cẩu kéo 24/7 toàn tỉnh & Cao tốc Nội Bài - Lào Cai", address: "TP. Vĩnh Yên, Vĩnh Phúc", phone: "0912116116" },

  // --- HÒA BÌNH ---
  { id: "srv-hb-1", icon: "⛽", name: "Trạm xăng Petrolimex Bản Lác Mai Châu", type: "Trạm xăng", province: "Hòa Bình", district: "Huyện Mai Châu", lat: 20.665, lng: 105.085, note: "Phục vụ khách du lịch thung lũng Mai Châu", address: "Ngã ba xã Mai Châu", phone: "02183867234" },
  { id: "srv-hb-2", icon: "🅿️", name: "Bãi đỗ xe Du lịch Cộng đồng Bản Lác 1 & 2", type: "Bãi đỗ xe", province: "Hòa Bình", district: "Huyện Mai Châu", lat: 20.658, lng: 105.078, note: "Bãi xe ô tô du lịch · Cho thuê xe đạp/xe điện", address: "Bản Lác, xã Mai Châu" },
  { id: "srv-hb-3", icon: "🛠️", name: "Cứu hộ giao thông Đèo Thung Khe (Đèo Đá Trắng)", type: "Cứu hộ", province: "Hòa Bình", district: "Huyện Mai Châu", lat: 20.695, lng: 105.155, note: "Cứu hộ sương mù, trơn trượt dốc đèo QL6", address: "Đỉnh đèo Thung Khe, Quốc lộ 6", phone: "0978116116" },
  { id: "srv-hb-4", icon: "⛽", name: "Trạm xăng ngã ba Bo - Kim Bôi", type: "Trạm xăng", province: "Hòa Bình", district: "Huyện Kim Bôi", lat: 20.682, lng: 105.535, note: "Trung tâm xã Bo · Gần khu suối khoáng", address: "Khu Mớ Đá, xã Bo, Kim Bôi", phone: "02183871112" },
  { id: "srv-hb-5", icon: "✚", name: "Bệnh viện Đa khoa tỉnh Hòa Bình", type: "Y tế", province: "Hòa Bình", district: "TP. Hòa Bình", lat: 20.814, lng: 105.338, note: "Cấp cứu 24/7", address: "Đường Cù Chính Lan, P. Đồng Tiến, TP. Hòa Bình", phone: "02183852115" },
  { id: "srv-hb-6", icon: "🅿️", name: "Bãi đỗ xe Cảng du lịch Thung Nai Sông Đà", type: "Bãi đỗ xe", province: "Hòa Bình", district: "Huyện Cao Phong", lat: 20.768, lng: 105.242, note: "Trông giữ xe qua đêm đi tàu lòng hồ Sông Đà", address: "Bến cảng Thung Nai, huyện Cao Phong" },
  { id: "srv-hb-7", icon: "⚡", name: "Trạm sạc VinFast TP. Hòa Bình", type: "Trạm sạc EV", province: "Hòa Bình", district: "TP. Hòa Bình", lat: 20.825, lng: 105.342, note: "Trạm sạc nhanh Vincom Plaza Hòa Bình", address: "Đường Cù Chính Lan, TP. Hòa Bình" }
];

export * from "./districtDirectory";
