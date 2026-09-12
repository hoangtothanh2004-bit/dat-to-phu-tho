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
  shortName: string;
  category: PlaceCategory;
  region: PlaceRegion;
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
  {
    id: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    shortName: "Đền Hùng",
    category: "Di sản & tâm linh",
    region: "Phú Thọ",
    district: "Việt Trì",
    location: "xã Hy Cương, TP. Việt Trì, Phú Thọ",
    image: "/images/places/den-hung.png",
    imageCredit: "Khu di tích Đền Hùng",
    rating: 4.9,
    reviews: 2840,
    hours: "06:00 – 18:00",
    price: "Miễn phí",
    description: "Quần thể đền thờ các Vua Hùng trên núi Nghĩa Lĩnh, cội nguồn linh thiêng của dân tộc Việt Nam.",
    tags: ["Di sản", "Tâm linh", "Lịch sử"],
    highlights: ["Đền Hạ – Trung – Thượng", "Lăng Hùng Vương", "Bảo tàng Hùng Vương"],
    bestTime: "Sáng sớm hoặc chiều mát",
    season: "Quanh năm; cao điểm Giỗ Tổ 10/3 âm lịch",
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    duration: "3 – 4 giờ",
    distanceFromVietTri: 10,
    travelFromVietTri: "20 phút bằng ô tô",
    bestStart: "07:00",
    lat: 21.366,
    lng: 105.3246,
    featured: true,
    audioScript: "Chào mừng bạn đến với Khu di tích lịch sử Đền Hùng, nơi hội tụ cội nguồn dân tộc Việt Nam.",
    audioScriptEn: "Welcome to Hung King Temple, the sacred root of the Vietnamese nation.",
    restaurants: [
      {
        name: "Nhà hàng ẩm thực Đất Tổ (Mẫu)",
        type: "Đặc sản truyền thống",
        distance: "2 km",
        travelTime: "5 phút",
        note: "Gà nhiều cựa, cá lăng nướng",
        address: "TP. Việt Trì, Phú Thọ",
        hours: "09:00 – 22:00",
        rating: 4.8,
        reviewCount: 50,
        image: foodPhoto,
        priceRange: "150.000 – 300.000đ/người",
      },
      {
        name: "Quán cá sông Lô mẫu",
        type: "Cá sông",
        distance: "3 km",
        travelTime: "7 phút",
        note: "Cá lăng om chuối đậu",
        address: "TP. Việt Trì, Phú Thọ",
        hours: "10:00 – 22:00",
        rating: 4.7,
        reviewCount: 40,
        image: fishPhoto,
        priceRange: "180.000 – 350.000đ/người",
      }
    ],
    stays: [
      {
        name: "Khách sạn trung tâm (Mẫu)",
        type: "Khách sạn tiêu chuẩn",
        distance: "5 km",
        travelTime: "10 phút",
        note: "Phòng nghỉ tiện nghi hiện đại",
        address: "TP. Việt Trì, Phú Thọ",
        hours: "24/7",
        rating: 4.7,
        reviewCount: 80,
        image: hotelPhoto,
        priceRange: "500.000 – 1.200.000đ/đêm",
      },
      {
        name: "Resort sinh thái nghỉ dưỡng (Mẫu)",
        type: "Resort",
        distance: "8 km",
        travelTime: "15 phút",
        note: "Khuôn viên xanh thoáng mát",
        address: "TP. Việt Trì, Phú Thọ",
        hours: "24/7",
        rating: 4.8,
        reviewCount: 65,
        image: resortPhoto,
        priceRange: "800.000 – 1.800.000đ/đêm",
      }
    ]
  },
  {
    id: "hung-lo",
    name: "Làng cổ & Đình cổ Hùng Lô",
    shortName: "Đình Hùng Lô",
    category: "Văn hóa & làng nghề",
    region: "Phú Thọ",
    district: "Việt Trì",
    location: "Xã Hùng Lô, TP. Việt Trì, Phú Thọ",
    image: "/images/places/hung-lo.jpg",
    imageCredit: "Đình cổ Hùng Lô",
    rating: 4.7,
    reviews: 520,
    hours: "07:30 – 17:30",
    price: "Miễn phí",
    description: "Quần thể đình cổ hơn 300 năm tuổi và cái nôi di sản Hát Xoan Phú Thọ.",
    tags: ["Văn hóa", "Làng cổ", "Hát Xoan"],
    highlights: ["Kiến trúc gỗ cổ", "Biểu diễn Hát Xoan", "Làng nghề làm miến"],
    bestTime: "Sáng 08:00 – 11:00",
    season: "Quanh năm",
    seasonMonths: [1, 2, 3, 4, 10, 11, 12],
    duration: "1.5 – 2 giờ",
    distanceFromVietTri: 7,
    travelFromVietTri: "15 phút",
    bestStart: "08:30",
    lat: 21.3412,
    lng: 105.3521,
    featured: true,
    audioScript: "Đình cổ Hùng Lô là công trình kiến trúc gỗ bề thế trên 300 năm tuổi, nơi lưu giữ tinh hoa Hát Xoan Phú Thọ.",
    audioScriptEn: "Hung Lo ancient communal house is a 300-year-old architectural gem and home of UNESCO Xoan singing.",
    restaurants: [
      {
        name: "Ẩm thực làng cổ mẫu",
        type: "Món quê truyền thống",
        distance: "500 m",
        travelTime: "2 phút",
        note: "Bánh chưng, chè lam, miến Hùng Lô",
        address: "Làng cổ Hùng Lô",
        hours: "08:00 – 20:00",
        rating: 4.6,
        reviewCount: 30,
        image: foodPhoto,
        priceRange: "50.000 – 150.000đ/người",
      },
      {
        name: "Nhà hàng ẩm thực sông Lô",
        type: "Cơm quê",
        distance: "1 km",
        travelTime: "5 phút",
        note: "Cá sông nướng than",
        address: "Hùng Lô, Việt Trì",
        hours: "09:00 – 21:00",
        rating: 4.7,
        reviewCount: 25,
        image: fishPhoto,
        priceRange: "100.000 – 200.000đ/người",
      }
    ],
    stays: [
      {
        name: "Homestay không gian xưa mẫu",
        type: "Homestay nhà cổ",
        distance: "300 m",
        travelTime: "2 phút",
        note: "Trải nghiệm nhà gỗ truyền thống",
        address: "Xã Hùng Lô",
        hours: "24/7",
        rating: 4.8,
        reviewCount: 40,
        image: homestayPhoto,
        priceRange: "350.000 – 700.000đ/đêm",
      },
      {
        name: "Nhà nghỉ ven đô mẫu",
        type: "Nhà nghỉ",
        distance: "2 km",
        travelTime: "5 phút",
        note: "Yên tĩnh, giá bình dân",
        address: "Việt Trì",
        hours: "24/7",
        rating: 4.5,
        reviewCount: 20,
        image: hotelPhoto,
        priceRange: "250.000 – 500.000đ/đêm",
      }
    ]
  },
  {
    id: "tam-dao",
    name: "Khu du lịch Tam Đảo",
    shortName: "Tam Đảo",
    category: "Nghỉ dưỡng & chữa lành",
    region: "Vĩnh Phúc",
    district: "Tam Đảo",
    location: "Thị trấn Tam Đảo, Vĩnh Phúc",
    image: "/images/places/tam-dao.jpg",
    imageCredit: "Tam Đảo Tourism",
    rating: 4.8,
    reviews: 1950,
    hours: "Mở cả ngày",
    price: "Tùy dịch vụ",
    description: "Thị trấn trong sương với khí hậu 4 mùa trong 1 ngày, điểm nghỉ dưỡng săn mây lý tưởng.",
    tags: ["Nghỉ dưỡng", "Săn mây", "Khí hậu mát mẻ"],
    highlights: ["Nhà thờ đá cổ", "Quảng trường trung tâm", "Cổng trời Tam Đảo"],
    bestTime: "Quanh năm, đẹp nhất mùa hè và thu",
    season: "Quanh năm",
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    duration: "1 – 2 ngày",
    distanceFromVietTri: 45,
    travelFromVietTri: "1 giờ bằng ô tô",
    bestStart: "08:00",
    lat: 21.458,
    lng: 105.648,
    featured: true,
    audioScript: "Chào mừng quý khách đến với thị trấn mây mù Tam Đảo, nơi khí hậu mát lành quanh năm.",
    audioScriptEn: "Welcome to Tam Dao mountain town, famed for its misty cool atmosphere.",
    restaurants: [
      {
        name: "Nhà hàng ngọn su su mẫu",
        type: "Đặc sản núi Tam Đảo",
        distance: "500 m",
        travelTime: "5 phút",
        note: "Ngọn su su xào tỏi, gà đồi nướng",
        address: "Khu 1, Tam Đảo",
        hours: "08:00 – 22:00",
        rating: 4.7,
        reviewCount: 45,
        image: foodPhoto,
        priceRange: "120.000 – 250.000đ/người",
      },
      {
        name: "Quán nướng gió mây mẫu",
        type: "Đồ nướng vùng cao",
        distance: "700 m",
        travelTime: "6 phút",
        note: "Xiên nướng than hồng ấm cúng",
        address: "Khu 2, Tam Đảo",
        hours: "16:00 – 23:00",
        rating: 4.6,
        reviewCount: 50,
        image: meatPhoto,
        priceRange: "100.000 – 200.000đ/người",
      }
    ],
    stays: [
      {
        name: "Homestay view mây mẫu",
        type: "Homestay săn mây",
        distance: "1 km",
        travelTime: "5 phút",
        note: "View thung lũng săn mây đẹp",
        address: "Thị trấn Tam Đảo",
        hours: "24/7",
        rating: 4.8,
        reviewCount: 60,
        image: homestayPhoto,
        priceRange: "600.000 – 1.500.000đ/đêm",
      },
      {
        name: "Khách sạn trung tâm Tam Đảo mẫu",
        type: "Khách sạn 3 sao",
        distance: "300 m",
        travelTime: "3 phút",
        note: "Gần quảng trường và chợ đêm",
        address: "Thị trấn Tam Đảo",
        hours: "24/7",
        rating: 4.7,
        reviewCount: 85,
        image: hotelPhoto,
        priceRange: "700.000 – 1.800.000đ/đêm",
      }
    ]
  },
  {
    id: "ban-lac-mai-chau",
    name: "Bản Lác – Thung Lũng Mai Châu",
    shortName: "Bản Lác",
    category: "Núi rừng & sinh thái",
    region: "Hòa Bình",
    district: "Mai Châu",
    location: "Xã Chiềng Châu, Mai Châu, Hòa Bình",
    image: "/images/places/ban-lac-mai-chau.jpg",
    imageCredit: "Mai Chau Eco",
    rating: 4.8,
    reviews: 1420,
    hours: "Mở cả ngày",
    price: "Tùy dịch vụ homestay",
    description: "Bản làng văn hóa người Thái trắng hơn 700 năm tuổi giữa cánh đồng thung lũng bình yên.",
    tags: ["Bản làng", "Văn hóa Thái", "Sinh thái"],
    highlights: ["Đạp xe ngắm thung lũng lúa", "Múa sạp & rượu cần", "Nhà sàn người Thái"],
    bestTime: "Mùa lúa chín tháng 5 – 6 và tháng 9 – 10",
    season: "Thu – Đông – Xuân",
    seasonMonths: [2, 3, 4, 5, 9, 10, 11],
    duration: "1 – 2 ngày",
    distanceFromVietTri: 110,
    travelFromVietTri: "2.5 giờ bằng ô tô",
    bestStart: "07:30",
    lat: 20.658,
    lng: 105.078,
    featured: true,
    audioScript: "Bản Lác Mai Châu chào đón bạn với cánh đồng lúa xanh ngút ngàn và nếp nhà sàn thanh bình.",
    audioScriptEn: "Welcome to Ban Lac Mai Chau, a 700-year-old White Thai ethnic village nestled in peaceful valleys.",
    restaurants: [
      {
        name: "Bếp Thái Bản Lác mẫu",
        type: "Ẩm thực dân tộc Thái",
        distance: "200 m",
        travelTime: "2 phút",
        note: "Cơm lam, gà đồi nướng mắc khén, măng rừng",
        address: "Bản Lác, Mai Châu",
        hours: "07:00 – 21:00",
        rating: 4.8,
        reviewCount: 70,
        image: meatPhoto,
        priceRange: "100.000 – 200.000đ/người",
      },
      {
        name: "Quán cá suối chiên mẫu",
        type: "Đặc sản Tây Bắc",
        distance: "400 m",
        travelTime: "4 phút",
        note: "Cá suối nướng, mâm cỗ lá",
        address: "Bản Lác 2, Mai Châu",
        hours: "08:00 – 21:30",
        rating: 4.7,
        reviewCount: 45,
        image: fishPhoto,
        priceRange: "120.000 – 220.000đ/người",
      }
    ],
    stays: [
      {
        name: "Nhà sàn sinh thái Bản Lác",
        type: "Homestay nhà sàn",
        distance: "100 m",
        travelTime: "1 phút",
        note: "Không gian thoáng đãng giữa đồng lúa",
        address: "Bản Lác, Mai Châu",
        hours: "24/7",
        rating: 4.8,
        reviewCount: 95,
        image: homestayPhoto,
        priceRange: "300.000 – 800.000đ/đêm",
      },
      {
        name: "Ecolodge nghỉ dưỡng mẫu",
        type: "Resort sinh thái",
        distance: "800 m",
        travelTime: "5 phút",
        note: "Hồ bơi vô cực view cánh đồng",
        address: "Thung lũng Mai Châu",
        hours: "24/7",
        rating: 4.9,
        reviewCount: 110,
        image: resortPhoto,
        priceRange: "1.200.000 – 2.500.000đ/đêm",
      }
    ]
  }
];

export const phuTho100Directory: DirectoryPlace[] = [
  {
    stt: "01",
    district: "Việt Trì",
    name: "Khu di tích lịch sử Đền Hùng",
    category: "Di tích lịch sử",
    location: "Xã Hy Cương, TP. Việt Trì",
    restaurants: "Nhà hàng khu vực Đền Hùng",
    stays: "Khách sạn TP. Việt Trì",
    distance: "0 km",
    notes: "Trung tâm tín ngưỡng thờ cúng Hùng Vương."
  },
  {
    stt: "02",
    district: "Việt Trì",
    name: "Đình cổ Hùng Lô",
    category: "Văn hóa - di sản",
    location: "Xã Hùng Lô, TP. Việt Trì",
    restaurants: "Ẩm thực Hát Xoan Hùng Lô",
    stays: "Nhà nghỉ / Homestay lân cận",
    distance: "7 km",
    notes: "Di sản Hát Xoan UNESCO và kiến trúc cổ."
  }
];

export type FoodDish = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  season: string;
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
    label: "Đất Tổ Phú Thọ",
    subtitle: "Ẩm thực truyền thống vùng đất cội nguồn",
    dishes: [
      {
        id: "thit-chua-thanh-son",
        name: "Thịt chua Thanh Sơn (Mẫu)",
        image: "/images/food/thit-chua.jpg",
        description: "Món ăn lên men tự nhiên đặc trưng của người Mường Phú Thọ.",
        price: "Từ 50.000đ/hộp",
        season: "Quanh năm",
        region: "Phú Thọ",
        sellers: [
          {
            id: "seller-pt-demo",
            name: "Cơ sở đặc sản mẫu",
            address: "TP. Việt Trì, Phú Thọ",
            phone: "0900000000",
            hours: "08:00 – 21:00",
            rating: 4.8,
            reviewCount: 30,
            pickupNote: "Đóng gói tiêu chuẩn mang đi",
            price: 50000,
            unit: "hộp 250g",
            verified: true,
          }
        ]
      }
    ]
  },
  {
    id: "vinh-phuc-dac-san",
    label: "Đặc sản Vĩnh Phúc",
    subtitle: "Hương vị vùng núi Tam Đảo",
    dishes: [
      {
        id: "su-su-tam-dao",
        name: "Ngọn su su xào tỏi (Mẫu)",
        image: "/images/food/su-su.jpg",
        description: "Ngọn su su tươi non đặc sản khí hậu vùng cao Tam Đảo.",
        price: "Từ 30.000đ/bó",
        season: "Quanh năm",
        region: "Vĩnh Phúc",
        sellers: [
          {
            id: "seller-vp-demo",
            name: "Nông sản vùng cao mẫu",
            address: "Thị trấn Tam Đảo",
            phone: "0900000000",
            hours: "07:00 – 19:00",
            rating: 4.7,
            reviewCount: 25,
            pickupNote: "Rau tươi thu hoạch trong ngày",
            price: 30000,
            unit: "bó",
            verified: true,
          }
        ]
      }
    ]
  },
  {
    id: "hoa-binh-dac-san",
    label: "Đặc sản Hòa Bình",
    subtitle: "Món ngon núi rừng Mai Châu",
    dishes: [
      {
        id: "com-lam-mai-chau",
        name: "Cơm lam nếp nương (Mẫu)",
        image: "/images/food/com-lam-mai-chau.jpg",
        description: "Gạo nếp nương nướng trong ống tre thơm dẻo chấm muối vừng.",
        price: "Từ 15.000đ/ống",
        season: "Quanh năm",
        region: "Hòa Bình",
        sellers: [
          {
            id: "seller-hb-demo",
            name: "Bếp Thái Bản Lác mẫu",
            address: "Bản Lác, Mai Châu",
            phone: "0900000000",
            hours: "07:00 – 21:00",
            rating: 4.8,
            reviewCount: 40,
            pickupNote: "Nóng hổi mang đi",
            price: 15000,
            unit: "ống",
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
  { id: "srv-pt-1", icon: "✚", name: "Cơ sở y tế trung tâm (Mẫu)", type: "Y tế", province: "Phú Thọ", district: "TP. Việt Trì", lat: 21.3215, lng: 105.3926, note: "Trực cấp cứu 24/7", address: "TP. Việt Trì, Phú Thọ", phone: "02103888888" },
  { id: "srv-vp-1", icon: "⛽", name: "Trạm xăng dầu (Mẫu)", type: "Trạm xăng", province: "Vĩnh Phúc", district: "Tam Đảo", lat: 21.412, lng: 105.618, note: "Mở cửa cả ngày", address: "Huyện Tam Đảo, Vĩnh Phúc" },
  { id: "srv-hb-1", icon: "🅿️", name: "Bãi đỗ xe du lịch (Mẫu)", type: "Bãi đỗ xe", province: "Hòa Bình", district: "Mai Châu", lat: 20.658, lng: 105.078, note: "Sức chứa xe du lịch", address: "Thị trấn Mai Châu, Hòa Bình" }
];

export * from "./districtDirectory";
