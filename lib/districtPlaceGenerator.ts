import { DISTRICT_DATABASE, type DistrictInfo, findDistrictByQuery } from "@/data/districtDirectory";
import type { Place, NearbyItem, PlaceCategory, TransportTip } from "@/data/travel";
import type { DistrictGuide } from "./guidePlanner";

// Coordinates and highway access for all 32 districts across Phu Tho, Vinh Phuc, Hoa Binh
export const DISTRICT_COORDINATES: Record<
  string,
  { lat: number; lng: number; distVietTri: number; distHanoi: string; timeHanoi: string; bestRoute: string }
> = {
  // 1. Phú Thọ
  "viet-tri": {
    lat: 21.32,
    lng: 105.40,
    distVietTri: 5,
    distHanoi: "70 km",
    timeHanoi: "1 giờ",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (IC7) hoặc Quốc lộ 2 qua cầu Hạc Trì / Vĩnh Thịnh.",
  },
  "thi-xa-phu-tho": {
    lat: 21.40,
    lng: 105.22,
    distVietTri: 30,
    distHanoi: "85 km",
    timeHanoi: "1 giờ 15 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (nút giao IC8) hoặc theo đường tỉnh 315 từ Việt Trì.",
  },
  "lam-thao": {
    lat: 21.32,
    lng: 105.30,
    distVietTri: 12,
    distHanoi: "75 km",
    timeHanoi: "1 giờ 10 phút",
    bestRoute: "Từ Hà Nội qua cầu Trung Hà theo QL32, hoặc từ Việt Trì qua ĐT324 bên bờ sông Thao.",
  },
  "phu-ninh": {
    lat: 21.42,
    lng: 105.35,
    distVietTri: 18,
    distHanoi: "80 km",
    timeHanoi: "1 giờ 15 phút",
    bestRoute: "Từ Việt Trì theo Quốc lộ 2 đi ngược lên Phong Châu hoặc nút giao IC8 cao tốc.",
  },
  "ha-hoa": {
    lat: 21.60,
    lng: 105.02,
    distVietTri: 65,
    distHanoi: "115 km",
    timeHanoi: "1 giờ 45 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (nút giao IC10 hoặc IC11) chạy thẳng vào trung tâm Hạ Hòa.",
  },
  "doan-hung": {
    lat: 21.62,
    lng: 105.18,
    distVietTri: 60,
    distHanoi: "110 km",
    timeHanoi: "1 giờ 40 phút",
    bestRoute: "Từ Hà Nội theo cao tốc Nội Bài – Lào Cai (rẽ nút giao IC9 Thị xã Phú Thọ) hoặc theo Quốc lộ 2 qua Việt Trì chạy thẳng Đoan Hùng.",
  },
  "cam-khe": {
    lat: 21.42,
    lng: 105.10,
    distVietTri: 45,
    distHanoi: "95 km",
    timeHanoi: "1 giờ 30 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (nút giao IC10 Sai Nga) rẽ thẳng vào huyện Cẩm Khê.",
  },
  "thanh-ba": {
    lat: 21.45,
    lng: 105.18,
    distVietTri: 38,
    distHanoi: "90 km",
    timeHanoi: "1 giờ 25 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (nút giao IC9) hoặc qua đường tỉnh DT314 từ TX. Phú Thọ.",
  },
  "tam-nong": {
    lat: 21.28,
    lng: 105.30,
    distVietTri: 25,
    distHanoi: "65 km",
    timeHanoi: "1 giờ 10 phút",
    bestRoute: "Từ Hà Nội theo Đại lộ Thăng Long qua Cầu Trung Hà theo QL32 vào trung tâm Tam Nông & Vườn Vua.",
  },
  "thanh-thuy": {
    lat: 21.18,
    lng: 105.30,
    distVietTri: 42,
    distHanoi: "65 km",
    timeHanoi: "1 giờ 15 phút",
    bestRoute: "Đại lộ Thăng Long qua cầu Đồng Quang hoặc cầu Trung Hà, rẽ ĐT317 thẳng vào suối khoáng nóng.",
  },
  "thanh-son": {
    lat: 21.18,
    lng: 105.18,
    distVietTri: 55,
    distHanoi: "85 km",
    timeHanoi: "1 giờ 35 phút",
    bestRoute: "Quốc lộ 32 qua Cầu Trung Hà chạy thẳng thị trấn Thanh Sơn (thủ phủ Thịt chua).",
  },
  "tan-son": {
    lat: 21.12,
    lng: 104.95,
    distVietTri: 85,
    distHanoi: "115 km",
    timeHanoi: "2 giờ 15 phút",
    bestRoute: "Từ Hà Nội theo QL32 qua Thanh Sơn, rẽ ĐT316 lên Đồi chè Long Cốc & Vườn quốc gia Xuân Sơn.",
  },
  "yen-lap": {
    lat: 21.35,
    lng: 105.05,
    distVietTri: 50,
    distHanoi: "100 km",
    timeHanoi: "1 giờ 45 phút",
    bestRoute: "Từ Việt Trì qua Cẩm Khê hoặc theo QL32 rẽ đường tỉnh DT313 vào hồ Ly và thị trấn Yên Lập.",
  },

  // 2. Vĩnh Phúc
  "vinh-yen": {
    lat: 21.31,
    lng: 105.60,
    distVietTri: 25,
    distHanoi: "55 km",
    timeHanoi: "50 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (IC4) hoặc Quốc lộ 2 qua cầu Thăng Long.",
  },
  "phuc-yen": {
    lat: 21.32,
    lng: 105.72,
    distVietTri: 40,
    distHanoi: "40 km",
    timeHanoi: "40 phút",
    bestRoute: "Đường Võ Nguyên Giáp qua cầu Nhật Tân nối thẳng QL2 hoặc cao tốc Nội Bài.",
  },
  "tam-dao": {
    lat: 21.46,
    lng: 105.65,
    distVietTri: 38,
    distHanoi: "75 km",
    timeHanoi: "1 giờ 30 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai rẽ nút giao IC4 Vĩnh Yên, đi theo QL2B lên đỉnh núi Tam Đảo.",
  },
  "binh-xuyen": {
    lat: 21.30,
    lng: 105.68,
    distVietTri: 32,
    distHanoi: "48 km",
    timeHanoi: "45 phút",
    bestRoute: "Quốc lộ 2 hoặc nút giao cao tốc Bình Xuyên kết nối làng gốm Hương Canh.",
  },
  "vinh-tuong": {
    lat: 21.25,
    lng: 105.52,
    distVietTri: 18,
    distHanoi: "58 km",
    timeHanoi: "1 giờ",
    bestRoute: "Từ Hà Nội qua Cầu Vĩnh Thịnh theo QL2C rẽ Đầm Rưng & Thổ Tang.",
  },
  "yen-lac": {
    lat: 21.24,
    lng: 105.58,
    distVietTri: 26,
    distHanoi: "50 km",
    timeHanoi: "55 phút",
    bestRoute: "Từ Hà Nội qua cầu Vĩnh Thịnh theo đê tả sông Hồng hoặc qua QL2 rẽ ĐT304 vào Yên Lạc.",
  },
  "lap-thach": {
    lat: 21.42,
    lng: 105.45,
    distVietTri: 25,
    distHanoi: "75 km",
    timeHanoi: "1 giờ 15 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (nút giao IC6 Văn Quán) rẽ thẳng vào huyện Lập Thạch.",
  },
  "song-lo": {
    lat: 21.48,
    lng: 105.38,
    distVietTri: 35,
    distHanoi: "85 km",
    timeHanoi: "1 giờ 25 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (IC6) qua Lập Thạch theo ĐT307 lên núi Sáng và thị trấn Tam Sơn.",
  },
  "tam-duong": {
    lat: 21.38,
    lng: 105.58,
    distVietTri: 28,
    distHanoi: "65 km",
    timeHanoi: "1 giờ 10 phút",
    bestRoute: "Cao tốc Nội Bài – Lào Cai (IC4) theo QL2C lên Hợp Hòa và vùng đồi dứa Hướng Đạo.",
  },

  // 3. Hòa Bình
  "tp-hoa-binh": {
    lat: 20.82,
    lng: 105.34,
    distVietTri: 70,
    distHanoi: "75 km",
    timeHanoi: "1 giờ 15 phút",
    bestRoute: "Đại lộ Thăng Long kết nối Cao tốc Hòa Lạc – Hòa Bình (CT08) êm ái.",
  },
  "mai-chau": {
    lat: 20.66,
    lng: 105.08,
    distVietTri: 140,
    distHanoi: "135 km",
    timeHanoi: "3 giờ 15 phút",
    bestRoute: "Từ Hà Nội theo cao tốc Hòa Lạc – Hòa Bình, theo QL6 qua đèo Thung Khe (Đá Trắng) xuống Bản Lác.",
  },
  "kim-boi": {
    lat: 20.68,
    lng: 105.54,
    distVietTri: 85,
    distHanoi: "75 km",
    timeHanoi: "1 giờ 45 phút",
    bestRoute: "Từ Hà Nội theo QL6 qua thị trấn Xuân Mai tới Bãi Chạo rẽ vào thung lũng khoáng nóng Serena.",
  },
  "cao-phong": {
    lat: 20.72,
    lng: 105.32,
    distVietTri: 85,
    distHanoi: "88 km",
    timeHanoi: "2 giờ",
    bestRoute: "Cao tốc Hòa Lạc – Hòa Bình qua TP. Hòa Bình 12km theo QL6 tới bến cảng Thung Nai sông Đà.",
  },
  "luong-son": {
    lat: 20.88,
    lng: 105.50,
    distVietTri: 75,
    distHanoi: "45 km",
    timeHanoi: "50 phút",
    bestRoute: "Quốc lộ 6 qua thị trấn Xuân Mai chạy thẳng thị trấn Lương Sơn & Ivory Resort.",
  },
  "da-bac": {
    lat: 20.88,
    lng: 105.15,
    distVietTri: 110,
    distHanoi: "105 km",
    timeHanoi: "2 giờ 30 phút",
    bestRoute: "Từ TP. Hòa Bình vượt dốc Cun rẽ ĐT433 uốn lượn ven hồ sông Đà lên Đà Bắc & Bản Đá Bia.",
  },
  "tan-lac": {
    lat: 20.60,
    lng: 105.28,
    distVietTri: 105,
    distHanoi: "100 km",
    timeHanoi: "2 giờ 15 phút",
    bestRoute: "Theo QL6 qua Cao Phong tới ngã ba Mãn Đức, rẽ đường tỉnh lên thiên đường mây Lũng Vân.",
  },
  "lac-son": {
    lat: 20.52,
    lng: 105.45,
    distVietTri: 120,
    distHanoi: "115 km",
    timeHanoi: "2 giờ 30 phút",
    bestRoute: "Từ Hà Nội theo đường Hồ Chí Minh hoặc QL6 qua Tân Lạc rẽ QL12B vào Vụ Bản và Thác Mu.",
  },
  "lac-thuy": {
    lat: 20.50,
    lng: 105.75,
    distVietTri: 115,
    distHanoi: "85 km",
    timeHanoi: "1 giờ 45 phút",
    bestRoute: "Từ Hà Nội theo QL21B qua Vân Đình hoặc đường Hồ Chí Minh tới Chi Nê và Chùa Tiên – Đầm Đa.",
  },
  "yen-thuy": {
    lat: 20.45,
    lng: 105.62,
    distVietTri: 125,
    distHanoi: "95 km",
    timeHanoi: "2 giờ",
    bestRoute: "Đường Hồ Chí Minh chạy thẳng qua Hàng Trạm, tiếp giáp VQG Cúc Phương.",
  },
};

function getDistrictSpotImage(districtId: string, idx: number): string {
  // Use existing local high-resolution photos
  if (districtId === "doan-hung") {
    if (idx === 0) return "/images/places/long-coc.png"; // Vườn bưởi xanh ngút ngàn
    if (idx === 1) return "/images/places/den-hung.png"; // Tượng đài Sông Lô
    if (idx === 2) return "/images/places/hung-lo.png"; // Chùa Đại Bi
    return "/images/places/dam-ao-chau.png"; // Sông Lô - Sông Chảy
  }
  if (districtId === "cam-khe") {
    if (idx === 0) return "/images/places/dam-ao-chau.png"; // Đầm Rộc Trịnh
    if (idx === 1) return "/images/places/hung-lo.png"; // Chùa Bồng Lai
    return "/images/places/den-hung.png";
  }
  if (districtId === "da-bac") {
    if (idx === 0) return "/images/places/mai-chau.png"; // Đá Bia CBT
    if (idx === 1) return "/images/places/thung-nai.png"; // Bản Ké
    return "/images/places/xuan-son.png";
  }
  if (districtId === "lap-thach") {
    if (idx === 0) return "/images/places/den-hung.png";
    if (idx === 1) return "/images/places/tay-thien.png"; // Tháp Chùa Trò
    return "/images/places/hung-canh.png";
  }
  if (districtId === "lac-thuy") {
    if (idx === 0) return "/images/places/tay-thien.png"; // Chùa Tiên - Đầm Đa
    if (idx === 1) return "/images/places/den-hung.png"; // Nhà máy in tiền
    return "/images/places/thung-nai.png";
  }
  if (districtId === "tam-nong") {
    if (idx === 0) return "/images/places/thanh-thuy.png"; // Vườn Vua Resort
    if (idx === 1) return "/images/places/dam-ao-chau.png"; // Đầm sen Bạch Thủy
    return "/images/places/den-hung.png";
  }
  if (districtId === "vinh-tuong") {
    if (idx === 0) return "/images/places/dam-ao-chau.png"; // Đầm Rưng
    if (idx === 1) return "/images/places/hung-lo.png"; // Đình Thổ Tang
    return "/images/places/hung-canh.png";
  }
  if (districtId === "song-lo") {
    if (idx === 0) return "/images/places/xuan-son.png"; // Núi Sáng Thác Bay
    if (idx === 1) return "/images/places/tay-thien.png"; // Thiền viện Tuệ Đức
    return "/images/places/dam-ao-chau.png";
  }

  // General fallbacks
  const photos = [
    "/images/places/den-hung.png",
    "/images/places/dam-ao-chau.png",
    "/images/places/long-coc.png",
    "/images/places/hung-lo.png",
    "/images/places/thanh-thuy.png",
    "/images/places/xuan-son.png",
  ];
  return photos[(idx + districtId.length) % photos.length];
}

export function createPlaceFromDistrict(
  district: DistrictInfo,
  attractionIndex: number = 0
): Place {
  const attraction = district.attractions[attractionIndex] || district.attractions[0];
  const otherAttractions = district.attractions.filter((_, idx) => idx !== attractionIndex);

  // Category mapping
  let placeCategory: PlaceCategory = "Văn hóa & làng nghề";
  const catLower = (attraction.category || "").toLowerCase();
  if (
    catLower.includes("tâm linh") ||
    catLower.includes("di tích") ||
    catLower.includes("lịch sử") ||
    catLower.includes("cổ tự") ||
    catLower.includes("cội nguồn")
  ) {
    placeCategory = "Di sản & tâm linh";
  } else if (
    catLower.includes("sinh thái") ||
    catLower.includes("núi") ||
    catLower.includes("rừng") ||
    catLower.includes("hồ") ||
    catLower.includes("thác") ||
    catLower.includes("thiên nhiên") ||
    catLower.includes("sông")
  ) {
    placeCategory = "Núi rừng & sinh thái";
  } else if (
    catLower.includes("nghỉ dưỡng") ||
    catLower.includes("khoáng") ||
    catLower.includes("resort") ||
    catLower.includes("chữa lành")
  ) {
    placeCategory = "Nghỉ dưỡng & chữa lành";
  } else if (
    catLower.includes("check-in") ||
    catLower.includes("giải trí") ||
    catLower.includes("săn mây") ||
    catLower.includes("nông nghiệp")
  ) {
    placeCategory = "Check-in & vui chơi";
  }

  // Map culinary to restaurants (NearbyItem)
  const restaurants: NearbyItem[] = district.culinary.map((c, i) => {
    const rawPlace = c.places || "";
    const namePart = rawPlace.includes(",") ? rawPlace.split(",")[0].trim() : rawPlace || `Nhà hàng ẩm thực ${district.name}`;
    const addrPart = rawPlace.includes(",") ? rawPlace.split(",").slice(1).join(",").trim() : `Trung tâm ${district.name}, tỉnh ${district.province}`;

    return {
      name: namePart.length > 3 ? namePart : `Đặc sản ${c.dish.split("(")[0].trim()}`,
      type: `Đặc sản ${district.name}`,
      distance: `${1.2 + i * 1.5} km`,
      travelTime: `${5 + i * 3} phút`,
      note: `${c.dish}: ${c.desc}`,
      taste: c.desc,
      address: addrPart || `${district.name}, ${district.province}`,
      hours: "07:30 – 22:00",
      phone: "0988 234 567",
      rating: 4.8,
      reviewCount: 120 + i * 25,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
      priceRange: "80.000đ – 250.000đ",
    };
  });

  // Map stay (NearbyItem)
  const stayRaw = district.recommendedStay || "";
  const stayName = stayRaw.includes(",") ? stayRaw.split(",")[0].trim() : stayRaw || `Khách sạn / Homestay ${district.name}`;
  const stayAddr = stayRaw.includes(",") ? stayRaw.split(",").slice(1).join(",").trim() : `Trung tâm ${district.name}, tỉnh ${district.province}`;

  const stays: NearbyItem[] = [
    {
      name: stayName,
      type: stayName.toLowerCase().includes("resort")
        ? "Khu nghỉ dưỡng Resort"
        : stayName.toLowerCase().includes("homestay")
        ? "Homestay sinh thái cộng đồng"
        : "Khách sạn du lịch tiện nghi",
      distance: "2,0 km",
      travelTime: "6 phút",
      note: `Không gian nghỉ ngơi yên bình, phục vụ khách du lịch tại ${district.name}, chu đáo và đầy đủ tiện nghi.`,
      address: stayAddr || `${district.name}, tỉnh ${district.province}`,
      hours: "Lễ tân 24/7 (Nhận phòng 14:00 – Trả phòng 12:00)",
      phone: "0977 123 888",
      rating: 4.8,
      reviewCount: 160,
      image: stayName.toLowerCase().includes("resort")
        ? "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=82"
        : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82",
      priceRange: "350.000đ – 950.000đ/đêm",
    },
  ];

  // Coordinates
  const coords = DISTRICT_COORDINATES[district.id] || {
    lat: 21.35,
    lng: 105.25,
    distVietTri: 30,
    distHanoi: "80 km",
    timeHanoi: "1 giờ 30 phút",
    bestRoute: `Tuyến đường thuận tiện nối Hà Nội / Việt Trì tới trung tâm ${district.name}.`,
  };

  const spotId = attractionIndex === 0 ? `district-${district.id}` : `district-${district.id}-spot-${attractionIndex}`;

  return {
    id: spotId,
    name: `${attraction.name} (${district.name})`,
    shortName: attraction.name.split("(")[0].trim(),
    category: placeCategory,
    region: district.province,
    district: district.name,
    location: `${attraction.name}, ${district.name}, tỉnh ${district.province}`,
    image: getDistrictSpotImage(district.id, attractionIndex),
    imageCredit: `Du lịch ${district.name}`,
    rating: 4.8,
    reviews: 280,
    hours: "07:00 – 18:00 hàng ngày",
    price: "Tham quan tự do / Vé thắng cảnh theo quy định",
    description: `${attraction.desc} Đây là điểm đến tiêu biểu trong hành trình khám phá ${district.title}.`,
    tags: [district.name, district.province, attraction.category, ...district.keywords.slice(0, 3)],
    highlights: [
      attraction.name,
      ...otherAttractions.map((a) => a.name.split("(")[0].trim()),
      ...district.culinary.map((c) => c.dish.split("(")[0].trim()),
    ],
    bestTime: "Sáng 07:30 – 10:30 hoặc Chiều 14:30 – 17:00",
    season: "Thích hợp khám phá quanh năm",
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    duration: "2 – 3 giờ",
    distanceFromVietTri: coords.distVietTri,
    travelFromVietTri: `${Math.round(coords.distVietTri * 1.5)} phút bằng ô tô`,
    bestStart: "07:30",
    warning: "Nên mang trang phục thoải mái, giày thể thao và giữ gìn vệ sinh cảnh quan chung.",
    lat: coords.lat + attractionIndex * 0.007,
    lng: coords.lng + attractionIndex * 0.007,
    featured: true,
    audioScript: `Chào mừng quý khách đến với ${attraction.name} tại ${district.name}, tỉnh ${district.province}. ${attraction.desc} Tại ${district.name}, quý khách đừng quên thưởng thức các món ăn nức tiếng như ${district.culinary.map((c) => c.dish.split("(")[0].trim()).join(", ")}. Chúc quý khách có một chuyến đi trọn vẹn và an toàn!`,
    audioScriptEn: `Welcome to ${attraction.name} in ${district.name}, ${district.province}. ${attraction.desc}`,
    restaurants,
    stays,
    transportTips: {
      recommendedVehicle: "Ô tô riêng / Xe máy du lịch",
      routeAdvice: coords.bestRoute,
      caution: "Lái xe đúng tốc độ quy định, chú ý quan sát tại các cung đường đồi núi.",
    },
  };
}

// Generate all Place objects for a specific district
export function getAllPlacesForDistrict(districtId: string): Place[] {
  const normId = districtId.replace(/^district-/, "").split("-spot-")[0];
  const district = DISTRICT_DATABASE[normId];
  if (!district) return [];

  return district.attractions.map((_, idx) => createPlaceFromDistrict(district, idx));
}

// Generate all Place objects for all 32 districts
export function getAllDistrictPlaces(): Place[] {
  const all: Place[] = [];
  for (const distKey of Object.keys(DISTRICT_DATABASE)) {
    const district = DISTRICT_DATABASE[distKey];
    if (district) {
      district.attractions.forEach((_, idx) => {
        all.push(createPlaceFromDistrict(district, idx));
      });
    }
  }
  return all;
}

// Generate DistrictGuide for any district
export function getDistrictTravelGuide(districtNameOrId: string): DistrictGuide | null {
  const district =
    DISTRICT_DATABASE[districtNameOrId.replace(/^district-/, "")] ||
    findDistrictByQuery(districtNameOrId);

  if (!district) return null;

  const coords = DISTRICT_COORDINATES[district.id] || {
    lat: 21.35,
    lng: 105.25,
    distVietTri: 35,
    distHanoi: "80 km",
    timeHanoi: "1 giờ 30 phút",
    bestRoute: `Tuyến đường thuận tiện nối Hà Nội / Việt Trì tới trung tâm ${district.name}.`,
  };

  return {
    district: district.name,
    region: district.province,
    distanceFromHanoi: coords.distHanoi,
    travelTime: coords.timeHanoi,
    recommendedTransport: "Ô tô riêng / Limousine / Xe máy du lịch",
    bestRoutes: coords.bestRoute,
    highlights: district.attractions.map((a) => a.name.split("(")[0].trim()),
    signatureFoods: district.culinary.map((c) => c.dish.split("(")[0].trim()),
  };
}
