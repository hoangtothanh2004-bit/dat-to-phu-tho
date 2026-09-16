import { places, type NearbyItem, type Place } from "@/data/travel";
import { DISTRICT_DATABASE, type DistrictInfo, findDistrictByQuery } from "@/data/districtDirectory";
import {
  getAllPlacesForDistrict,
  getAllDistrictPlaces,
  getDistrictTravelGuide,
} from "./districtPlaceGenerator";

export type ItinerarySlot = {
  period: "Sáng" | "Trưa" | "Chiều" | "Tối";
  timeSlot: string;
  title: string;
  type: "visit" | "meal" | "stay" | "travel";
  image?: string;
  place?: Place;
  restaurant?: NearbyItem;
  stay?: NearbyItem;
  activity: string;
  transportAdvice: string;
  travelMinutes: number;
  highlightNote: string;
  estimatedCostPerPerson: number;
  audioScript?: string;
  audioScriptEn?: string;
};

export type ItineraryDay = {
  dayNumber: number;
  dateLabel: string;
  dayTitle: string;
  daySummary: string;
  slots: ItinerarySlot[];
  dayDistanceKm: number;
  stayForNight?: NearbyItem;
};

export type GeneratedItinerary = {
  id: string;
  title: string;
  subtitle: string;
  targetDestination: string;
  region: string;
  durationDays: number;
  durationLabel: string;
  transport: string;
  style: string;
  travelers: number;
  totalDistanceKm: number;
  totalDriveTime: string;
  estimatedCostPerPerson: number;
  totalCost: number;
  overviewNarrative: string;
  audioGuideScript: string;
  audioGuideScriptEn: string;
  routeAdvice: string;
  cautionAdvice: string;
  days: ItineraryDay[];
  googleMapsUrl: string;
};

export type DistrictGuide = {
  district: string;
  region: string;
  distanceFromHanoi: string;
  travelTime: string;
  recommendedTransport: string;
  bestRoutes: string;
  highlights: string[];
  signatureFoods: string[];
};

export const DISTRICT_TRAVEL_GUIDES: Record<string, DistrictGuide> = {
  "TP. Việt Trì": {
    district: "TP. Việt Trì",
    region: "Phú Thọ",
    distanceFromHanoi: "70 km",
    travelTime: "60 phút",
    recommendedTransport: "Ô tô riêng / Xe khách Mỹ Đình / Tàu hỏa",
    bestRoutes: "Từ Hà Nội theo cao tốc Nội Bài - Lào Cai (rẽ nút giao IC7) hoặc theo trục Quốc lộ 2 qua cầu Vĩnh Thịnh/Hạc Trì.",
    highlights: ["Khu di tích lịch sử Đền Hùng", "Làng cổ & Đình cổ Hùng Lô (hát Xoan)", "Cầu đi bộ Công viên Văn Lang"],
    signatureFoods: ["Cá lăng sông Lô om chuối đậu", "Bánh tai Gia Cẩm", "Thịt chua Thanh Sơn"],
  },
  "Huyện Thanh Sơn": {
    district: "Huyện Thanh Sơn",
    region: "Phú Thọ",
    distanceFromHanoi: "95 km (55 km từ Việt Trì)",
    travelTime: "1 giờ 45 phút",
    recommendedTransport: "Ô tô riêng / Xe máy du lịch / Xe khách tuyến Hà Nội - Thanh Sơn",
    bestRoutes: "Từ Hà Nội theo Quốc lộ 32 qua Cầu Trung Hà -> Thanh Sơn. Tuyến đường huyết mạch kết nối trực tiếp với Đồi chè Long Cốc, Vườn QG Xuân Sơn và Khoáng nóng Thanh Thủy.",
    highlights: ["Thủ phủ Thịt chua truyền thống trứ danh (Nghị Thịnh / Điệp Đào)", "Khám phá văn hóa bản Mường & Thác Chòi", "Cửa ngõ kết nối Đồi chè Long Cốc và Vườn quốc gia Xuân Sơn"],
    signatureFoods: ["Thịt chua Thanh Sơn gói lá chuối kèm lá sung, ổi, đinh lăng", "Rêu đá xào tỏi Mường", "Cơm lam cá suối nướng than hoa"],
  },
  "Huyện Tân Sơn": {
    district: "Huyện Tân Sơn",
    region: "Phú Thọ",
    distanceFromHanoi: "115 km (80 km từ Việt Trì)",
    travelTime: "2 giờ 15 phút",
    recommendedTransport: "Ô tô gầm cao / Xe máy phượt ngắm cảnh",
    bestRoutes: "Từ Việt Trì hoặc Hà Nội đi theo QL32 qua Thanh Sơn, rẽ ĐT316 vào Tân Sơn. Đường nhựa đồi núi uốn lượn phong cảnh hữu tình.",
    highlights: ["Đồi chè Long Cốc (ốc đảo chè đẹp nhất Việt Nam)", "Vườn quốc gia Xuân Sơn (rừng nguyên sinh, hang Lạng)"],
    signatureFoods: ["Gà nhiều cựa Xuân Sơn nướng than", "Lợn lửng xào lăn hạt dổi", "Rau sắng rừng & Xôi ngũ sắc"],
  },
  "Huyện Thanh Thủy": {
    district: "Huyện Thanh Thủy",
    region: "Phú Thọ",
    distanceFromHanoi: "65 km (40 km từ Việt Trì)",
    travelTime: "1 giờ 15 phút",
    recommendedTransport: "Ô tô riêng / Xe Limousine đón trả tận nơi",
    bestRoutes: "Từ Hà Nội theo Đại lộ Thăng Long qua cầu Đồng Quang hoặc cầu Trung Hà, rẽ ĐT317 chạy thẳng vào trung tâm khoáng nóng.",
    highlights: ["Quần thể nghỉ dưỡng suối khoáng nóng Radon", "Đền Lăng Sương", "Đảo Ngọc Xanh"],
    signatureFoods: ["Cá ngạnh sông Đà nướng riềng mẻ", "Gà đồi Thanh Thủy hấp lá chanh", "Tắm Onsen thư giãn"],
  },
  "Huyện Hạ Hòa": {
    district: "Huyện Hạ Hòa",
    region: "Phú Thọ",
    distanceFromHanoi: "120 km (65 km từ Việt Trì)",
    travelTime: "1 giờ 20 phút",
    recommendedTransport: "Ô tô riêng / Xe khách cao tốc",
    bestRoutes: "Từ Hà Nội đi thẳng cao tốc Nội Bài - Lào Cai, rẽ nút giao IC10 (Hạ Hòa), chỉ 10 phút sau là tới Đền Mẫu và Đầm Ao Châu.",
    highlights: ["Đền Mẫu Âu Cơ (cội nguồn Mẹ Đất Việt)", "Khu du lịch sinh thái Đầm Ao Châu (99 ngách nước non)"],
    signatureFoods: ["Trám đen kho thịt", "Chuối phấn Hạ Hòa", "Cá đầm Ao Châu nướng giòn"],
  },
  "Huyện Tam Đảo": {
    district: "Huyện Tam Đảo",
    region: "Vĩnh Phúc",
    distanceFromHanoi: "75 km",
    travelTime: "1 giờ 30 phút",
    recommendedTransport: "Ô tô riêng / Limousine khứ hồi / Xe máy (cần tay lái vững)",
    bestRoutes: "Từ Hà Nội theo cao tốc Nội Bài - Lào Cai rẽ nút giao IC4 -> đường QL2B lên Tam Đảo (đoạn đèo dốc 13km trải nhựa êm, có rào chắn bảo vệ).",
    highlights: ["Khu du lịch sương mù Tam Đảo (khí hậu 4 mùa)", "Quần thể Di tích & Danh thắng Tây Thiên (cáp treo, Thiền viện)"],
    signatureFoods: ["Ngọn su su xào tỏi giòn ngọt", "Gà đồi bọc đất sét nướng than", "Lợn mán gác bếp"],
  },
  "TP. Phúc Yên": {
    district: "TP. Phúc Yên",
    region: "Vĩnh Phúc",
    distanceFromHanoi: "45 km (cách sân bay Nội Bài 15km)",
    travelTime: "45 phút",
    recommendedTransport: "Ô tô riêng / Taxi sân bay / Xe buýt",
    bestRoutes: "Từ Hà Nội qua Cầu Nhật Tân -> đường Võ Nguyên Giáp -> QL2 hoặc ĐT301 chạy thẳng vào khu vực Hồ Đại Lải.",
    highlights: ["Hồ Đại Lải thơ mộng", "Flamingo Đại Lải Resort & Bảo tàng nghệ thuật trong rừng", "Đảo Ngọc"],
    signatureFoods: ["Thịt trâu nhúng mẻ / xào rau muống", "Cá hồ Đại Lải nướng", "Thịt lợn quay giòn"],
  },
  "TP. Vĩnh Yên": {
    district: "TP. Vĩnh Yên",
    region: "Vĩnh Phúc",
    distanceFromHanoi: "55 km",
    travelTime: "50 phút",
    recommendedTransport: "Ô tô riêng / Tàu hỏa / Xe buýt liên tỉnh",
    bestRoutes: "Theo cao tốc Nội Bài - Lào Cai rẽ IC3 hoặc đi đường Quốc lộ 2 qua cầu Thăng Long.",
    highlights: ["Chùa Hà Tiên linh thiêng", "Đầm Vạc", "Quảng trường Hồ Chí Minh"],
    signatureFoods: ["Tép dầu Đầm Vạc chiên giòn", "Chè kho Tứ Yên", "Gỏi cá mè Vĩnh Yên"],
  },
  "Huyện Bình Xuyên": {
    district: "Huyện Bình Xuyên",
    region: "Vĩnh Phúc",
    distanceFromHanoi: "50 km (kề cận Vĩnh Yên)",
    travelTime: "45 phút",
    recommendedTransport: "Ô tô riêng / Xe buýt",
    bestRoutes: "Chạy dọc Quốc lộ 2 hoặc nút giao cao tốc Bình Xuyên.",
    highlights: ["Làng gốm sành cổ Hương Canh 300 năm di sản", "Tháp gốm Bình Sơn"],
    signatureFoods: ["Bánh hòn Hương Canh", "Cháo se Hương Canh"],
  },
  "Huyện Mai Châu": {
    district: "Huyện Mai Châu",
    region: "Hòa Bình",
    distanceFromHanoi: "135 km",
    travelTime: "3 giờ 30 phút",
    recommendedTransport: "Ô tô riêng / Limousine đón tận homestay / Xe máy phượt",
    bestRoutes: "Từ Hà Nội theo Đại lộ Thăng Long -> Cao tốc Hòa Lạc - Hòa Bình -> Quốc lộ 6 vượt Đèo Thung Khe (Đèo Đá Trắng) xuống thung lũng Mai Châu.",
    highlights: ["Bản Lác & Thung lũng Mai Châu thơ mộng", "Điểm săn mây & Chợ phiên Pà Cò", "Đèo Đá Trắng Thung Khe"],
    signatureFoods: ["Cơm lam nếp nương nướng than", "Thịt lợn mán hạt dổi xứ Mường", "Cá suối chiên giòn & Rượu cần"],
  },
  "Huyện Kim Bôi": {
    district: "Huyện Kim Bôi",
    region: "Hòa Bình",
    distanceFromHanoi: "75 km",
    travelTime: "1 giờ 45 phút",
    recommendedTransport: "Ô tô riêng / Xe Limousine / Xe khách",
    bestRoutes: "Từ Hà Nội theo QL6 qua xã Xuân Mai tới ngã ba Bãi Chạo (Lương Sơn), rẽ vào đường ATK Bãi Chạo chạy thẳng vào thung lũng khoáng nóng.",
    highlights: ["Suối khoáng nóng tự nhiên Kim Bôi (36°C giàu khoáng chất)", "Serena Resort Kim Bôi"],
    signatureFoods: ["Gà đồi nướng mọi", "Măng đắng xào thịt bò", "Rau rừng đồ chấm lòng cá"],
  },
  "Huyện Cao Phong": {
    district: "Huyện Cao Phong",
    region: "Hòa Bình",
    distanceFromHanoi: "88 km",
    travelTime: "2 giờ",
    recommendedTransport: "Ô tô riêng / Xe du lịch",
    bestRoutes: "Từ Hà Nội đi cao tốc Hòa Lạc - Hòa Bình, qua TP. Hòa Bình theo QL6 chừng 12km tới xã Cao Phong, rẽ vào bến cảng Thung Nai.",
    highlights: ["Lòng hồ sông Đà Thung Nai (du thuyền Vịnh Hạ Long trên núi)", "Đền Bà Chúa Thác Bờ linh thiêng"],
    signatureFoods: ["Cá lăng sông Đà nướng than lá chuối", "Cam Cao Phong lòng vàng", "Gà thả đồi nướng"],
  },
  "TP. Hòa Bình": {
    district: "TP. Hòa Bình",
    region: "Hòa Bình",
    distanceFromHanoi: "75 km",
    travelTime: "1 giờ 15 phút",
    recommendedTransport: "Ô tô riêng / Xe khách Mỹ Đình/Yên Nghĩa",
    bestRoutes: "Đi thẳng Đại lộ Thăng Long kết nối cao tốc Hòa Lạc - Hòa Bình (CT08), đường rộng 4 làn xe chạy rất nhanh và êm ái.",
    highlights: ["Nhà máy Thủy điện Hòa Bình kỳ vĩ", "Bảo tàng Không gian Văn hóa Mường", "Tượng đài Bác Hồ núi Ông Tượng"],
    signatureFoods: ["Cỗ lá Mường truyền thống", "Chả cuốn lá bưởi thơm lừng", "Cá chiên sông Đà"],
  },
};

export type PlannerOptions = {
  anchorPlaceId?: string;
  selectedPlaceIds?: string[];
  district?: string;
  region?: string;
  durationDays: number;
  durationNights?: number;
  transport: string;
  budget: string;
  style: string;
  travelers: number;
  lang?: string;
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function buildItinerary(options: PlannerOptions): GeneratedItinerary {
  const {
    anchorPlaceId,
    selectedPlaceIds = [],
    district,
    region,
    durationDays = 2,
    durationNights,
    transport = "Ô tô riêng",
    budget = "Tiêu chuẩn",
    style = "Văn hóa & cội nguồn",
    travelers = 2,
    lang = "vi",
  } = options;

  // Master place pool combining handcrafted places and all 32 districts' spots
  const allAvailablePlaces: Place[] = [...places, ...getAllDistrictPlaces()];

  // Detect target district if specified by district name or district-based anchor
  let targetDistrictInfo: DistrictInfo | undefined;
  if (district && district !== "Tất cả") {
    targetDistrictInfo = findDistrictByQuery(district);
  }
  if (!targetDistrictInfo && anchorPlaceId) {
    const cleanId = anchorPlaceId.replace(/^district-/, "").split("-spot-")[0];
    targetDistrictInfo = DISTRICT_DATABASE[cleanId] || findDistrictByQuery(anchorPlaceId);
  }
  if (!targetDistrictInfo && selectedPlaceIds.length > 0) {
    for (const pid of selectedPlaceIds) {
      const cleanId = pid.replace(/^district-/, "").split("-spot-")[0];
      if (DISTRICT_DATABASE[cleanId]) {
        targetDistrictInfo = DISTRICT_DATABASE[cleanId];
        break;
      }
    }
  }

  // 1. Xác định danh sách các điểm được người dùng ưu tiên ghép
  const userChosenPlaces: Place[] = [];
  if (selectedPlaceIds.length > 0) {
    for (const pid of selectedPlaceIds) {
      const found = allAvailablePlaces.find((p) => p.id === pid);
      if (found && !userChosenPlaces.some((cp) => cp.id === found.id)) {
        userChosenPlaces.push(found);
      }
    }
  }

  // Nếu không chọn mảng điểm, tìm điểm neo khởi đầu
  let anchor: Place;
  if (userChosenPlaces.length > 0) {
    anchor = userChosenPlaces[0];
  } else if (targetDistrictInfo) {
    const distPlaces = getAllPlacesForDistrict(targetDistrictInfo.id);
    anchor = distPlaces[0] || allAvailablePlaces.find((p) => p.id === anchorPlaceId) || places[0];
  } else if (anchorPlaceId) {
    anchor = allAvailablePlaces.find((p) => p.id === anchorPlaceId) || places[0];
  } else if (district) {
    anchor = allAvailablePlaces.find((p) => p.district === district) || places[0];
  } else if (region && region !== "Tất cả") {
    anchor = allAvailablePlaces.find((p) => p.region === region) || places[0];
  } else {
    anchor = places[0]; // Default Đền Hùng
  }

  // 2. Gom cụm các điểm đến phù hợp theo cự ly và chủ đề
  const neededStops = Math.max(durationDays * 2, userChosenPlaces.length);
  const chosenPlaces: Place[] = [...userChosenPlaces];

  if (!chosenPlaces.some((p) => p.id === anchor.id)) {
    chosenPlaces.unshift(anchor);
  }

  // Nếu người dùng chọn huyện cụ thể, ưu tiên đưa các điểm tham quan thực tế của huyện đó vào
  if (targetDistrictInfo && chosenPlaces.length < neededStops) {
    const distPlaces = getAllPlacesForDistrict(targetDistrictInfo.id);
    for (const dp of distPlaces) {
      if (chosenPlaces.length >= neededStops) break;
      if (!chosenPlaces.some((p) => p.id === dp.id)) {
        chosenPlaces.push(dp);
      }
    }
  }

  // Nếu vẫn chưa đủ điểm cho số ngày, tự động bổ sung các điểm lân cận
  if (chosenPlaces.length < neededStops) {
    const existingIds = new Set(chosenPlaces.map((p) => p.id));
    const pool = allAvailablePlaces.filter((p) => !existingIds.has(p.id));

    // Ưu tiên cùng huyện trước, sau đó cùng vùng, sau đó theo cự ly
    pool.sort((a, b) => {
      const lastPlace = chosenPlaces[chosenPlaces.length - 1] || anchor;
      if (district && a.district === district && b.district !== district) return -1;
      if (district && b.district === district && a.district !== district) return 1;
      if (targetDistrictInfo && a.district === targetDistrictInfo.name && b.district !== targetDistrictInfo.name) return -1;
      if (targetDistrictInfo && b.district === targetDistrictInfo.name && a.district !== targetDistrictInfo.name) return 1;
      if (a.region === lastPlace.region && b.region !== lastPlace.region) return -1;
      if (b.region === lastPlace.region && a.region !== lastPlace.region) return 1;
      const distA = haversineDistance(lastPlace.lat, lastPlace.lng, a.lat, a.lng);
      const distB = haversineDistance(lastPlace.lat, lastPlace.lng, b.lat, b.lng);
      return distA - distB;
    });

    for (const candidate of pool) {
      if (chosenPlaces.length >= neededStops) break;
      chosenPlaces.push(candidate);
    }
  }

  // 3. Xây dựng từng ngày
  const days: ItineraryDay[] = [];
  let totalDistanceKm = 0;
  let totalMinutes = 0;

  for (let dayIdx = 0; dayIdx < durationDays; dayIdx++) {
    const dayNum = dayIdx + 1;
    const morningPlace = chosenPlaces[dayIdx * 2] || anchor;
    const afternoonPlace = chosenPlaces[dayIdx * 2 + 1] || morningPlace;

    const isLastDay = dayNum === durationDays;

    // Khoảng cách di chuyển trong ngày
    const distBetween = haversineDistance(
      morningPlace.lat,
      morningPlace.lng,
      afternoonPlace.lat,
      afternoonPlace.lng
    );
    const dayDistance = Math.round(distBetween + 20); // cộng 20km cự ly trung bình từ điểm xuất phát/quán ăn
    totalDistanceKm += dayDistance;

    const morningMinutes = Math.max(20, Math.round(morningPlace.distanceFromVietTri * 1.5));
    const afternoonMinutes = Math.max(15, Math.round(distBetween * 1.6));
    totalMinutes += morningMinutes + afternoonMinutes;

    // Chọn nhà hàng
    const lunchRestaurant =
      morningPlace.restaurants[0] || afternoonPlace.restaurants[0] || places[0].restaurants[0];
    const dinnerRestaurant =
      afternoonPlace.restaurants[1] || afternoonPlace.restaurants[0] || places[0].restaurants[1];

    // Chọn nơi nghỉ đêm (nếu không phải ngày cuối)
    const nightStay = isLastDay
      ? undefined
      : afternoonPlace.stays[0] || morningPlace.stays[0] || places[0].stays[0];

    const slot1Title = (() => {
      if (lang === "en") return `Depart & Discover ${morningPlace.shortName}`;
      if (lang === "zh") return `出发前往并探索 ${morningPlace.shortName}`;
      if (lang === "ko") return `출발 및 ${morningPlace.shortName} 탐방`;
      if (lang === "ja") return `出発・${morningPlace.shortName} 見学`;
      return `Khởi hành & Khám phá ${morningPlace.shortName}`;
    })();

    const slot2Title = (() => {
      if (lang === "en") return `Savor local specialties at ${lunchRestaurant.name}`;
      if (lang === "zh") return `在 ${lunchRestaurant.name} 品鉴特色美食`;
      if (lang === "ko") return `${lunchRestaurant.name}에서 현지 미식 즐기기`;
      if (lang === "ja") return `${lunchRestaurant.name} で郷土料理を堪能`;
      return `Thưởng thức ẩm thực tại ${lunchRestaurant.name}`;
    })();

    const slot3Title = (() => {
      if (lang === "en") return `Experience & Check-in at ${afternoonPlace.shortName}`;
      if (lang === "zh") return `体验与打卡 ${afternoonPlace.shortName}`;
      if (lang === "ko") return `${afternoonPlace.shortName} 체험 및 포토존`;
      if (lang === "ja") return `${afternoonPlace.shortName} を体験・散策`;
      return `Trải nghiệm & Check-in ${afternoonPlace.shortName}`;
    })();

    const slot4Title = (() => {
      if (isLastDay) {
        if (lang === "en") return `Specialty dinner at ${dinnerRestaurant.name} & Tour conclusion`;
        if (lang === "zh") return `在 ${dinnerRestaurant.name} 享用特色晚餐并结束旅程`;
        if (lang === "ko") return `${dinnerRestaurant.name} 특선 석식 및 여정 마무리`;
        if (lang === "ja") return `${dinnerRestaurant.name} でディナー＆ツアー終了`;
        return `Bữa tối đặc sản tại ${dinnerRestaurant.name} & Kết thúc tour`;
      }
      if (lang === "en") return `Specialty dinner & stay at ${nightStay?.name || afternoonPlace.shortName}`;
      if (lang === "zh") return `特色晚餐与夜宿于 ${nightStay?.name || afternoonPlace.shortName}`;
      if (lang === "ko") return `특선 석식 및 ${nightStay?.name || afternoonPlace.shortName} 숙박`;
      if (lang === "ja") return `名物ディナー＆ ${nightStay?.name || afternoonPlace.shortName} で宿泊`;
      return `Ăn tối đặc sản & Nghỉ đêm tại ${nightStay?.name || afternoonPlace.shortName}`;
    })();

    const slots: ItinerarySlot[] = [
      // BUỔI SÁNG
      {
        period: "Sáng",
        timeSlot: "07:30 – 11:30",
        title: slot1Title,
        type: "visit",
        place: morningPlace,
        activity: `Tham quan các điểm nhấn tiêu biểu: ${morningPlace.highlights.slice(0, 2).join(", ")}. Chụp ảnh lưu niệm và tìm hiểu văn hóa lịch sử.`,
        transportAdvice: `Di chuyển bằng ${transport}. Thời gian di chuyển ước tính ${morningMinutes} phút. ${morningPlace.transportTips?.routeAdvice || "Đi theo chỉ dẫn đường chính, đường đi thuận lợi."}`,
        travelMinutes: morningMinutes,
        highlightNote: morningPlace.highlights[0] || "Điểm đến biểu tượng",
        estimatedCostPerPerson: morningPlace.price.includes("miễn phí") ? 50000 : 120000,
      },
      // BUỔI TRƯA
      {
        period: "Trưa",
        timeSlot: "11:30 – 13:30",
        title: slot2Title,
        type: "meal",
        restaurant: lunchRestaurant,
        activity: `Ăn trưa và nghỉ ngơi giữa ngày. Thực đơn gợi ý: ${lunchRestaurant.note}.`,
        transportAdvice: `Cách điểm tham quan sáng ${lunchRestaurant.distance} (${lunchRestaurant.travelTime}). Có bãi đỗ xe rộng rãi.`,
        travelMinutes: 10,
        highlightNote: lunchRestaurant.taste || "Hương vị đặc sản đậm đà",
        estimatedCostPerPerson: 180000,
      },
      // BUỔI CHIỀU
      {
        period: "Chiều",
        timeSlot: "13:30 – 17:30",
        title: slot3Title,
        type: "visit",
        place: afternoonPlace,
        activity: `Tham quan ${afternoonPlace.name}. Trải nghiệm ${afternoonPlace.highlights.slice(0, 2).join(", ")}. Ngắm cảnh hoàng hôn.`,
        transportAdvice: `Di chuyển từ nhà hàng sang ${afternoonPlace.shortName} mất khoảng ${afternoonMinutes} phút (${Math.round(distBetween)} km). ${afternoonPlace.transportTips?.caution || "Chú ý quan sát biển báo giao thông."}`,
        travelMinutes: afternoonMinutes,
        highlightNote: afternoonPlace.highlights[1] || afternoonPlace.highlights[0],
        estimatedCostPerPerson: afternoonPlace.price.includes("miễn phí") ? 40000 : 100000,
      },
      // BUỔI TỐI
      {
        period: "Tối",
        timeSlot: isLastDay ? "18:00 – 20:30" : "18:00 – 22:00",
        title: slot4Title,
        type: isLastDay ? "meal" : "stay",
        restaurant: dinnerRestaurant,
        stay: nightStay,
        activity: isLastDay
          ? `Thưởng thức bữa tối sum vầy với ${dinnerRestaurant.note}. Mua sắm đặc sản làm quà và chuẩn bị lên xe trở về.`
          : `Thưởng thức bữa tối đặc sản tại ${dinnerRestaurant.name}. Sau đó nhận phòng nghỉ ngơi tại ${nightStay?.name}. Dạo bộ tận hưởng không khí buổi tối yên bình.`,
        transportAdvice: isLastDay
          ? `Ăn tối xong khởi hành trở về bằng ${transport}. Lái xe an toàn và kiểm tra kỹ hành lý.`
          : `Về khách sạn/resort chỉ cách 5–10 phút di chuyển. Nơi nghỉ có lễ tân 24/7 và dịch vụ chu đáo.`,
        travelMinutes: 15,
        highlightNote: isLastDay
          ? "Bữa tối ấm cúng trọn vẹn hành trình"
          : nightStay?.note || "Không gian nghỉ ngơi thư thái",
        estimatedCostPerPerson: isLastDay ? 200000 : 450000,
      },
    ];

    const dayTitle = (() => {
      if (lang === "en") return `Explore ${morningPlace.shortName} – ${afternoonPlace.shortName}`;
      if (lang === "zh") return `探索 ${morningPlace.shortName} – ${afternoonPlace.shortName}`;
      if (lang === "ko") return `${morningPlace.shortName} – ${afternoonPlace.shortName} 탐방`;
      if (lang === "ja") return `${morningPlace.shortName} – ${afternoonPlace.shortName} を巡る`;
      return `Khám phá ${morningPlace.shortName} – ${afternoonPlace.shortName}`;
    })();

    const dateLabel = (() => {
      if (lang === "en") return `Day ${dayNum}`;
      if (lang === "zh") return `第 ${dayNum} 天`;
      if (lang === "ko") return `${dayNum}일차`;
      if (lang === "ja") return `${dayNum}日目`;
      return `Ngày ${dayNum}`;
    })();

    days.push({
      dayNumber: dayNum,
      dateLabel,
      dayTitle,
      daySummary: `${morningPlace.highlights[0]} kết hợp trải nghiệm ẩm thực và danh thắng ${afternoonPlace.shortName}.`,
      slots,
      dayDistanceKm: dayDistance,
      stayForNight: nightStay,
    });
  }

  // Ước tính chi phí bám sát tiêu chuẩn ngân sách
  const isBudgetLow = budget.includes("Tiết kiệm");
  const isBudgetHigh = budget.includes("Cao cấp") || budget.includes("Nghỉ dưỡng");
  const baseCostPerPerson = isBudgetLow
    ? durationDays * 500000
    : isBudgetHigh
    ? durationDays * 1950000
    : durationDays * 950000;

  const totalCost = baseCostPerPerson * travelers;

  const districtGuide = targetDistrictInfo
    ? getDistrictTravelGuide(targetDistrictInfo.id) || DISTRICT_TRAVEL_GUIDES[targetDistrictInfo.name]
    : district
    ? DISTRICT_TRAVEL_GUIDES[district] || getDistrictTravelGuide(district)
    : null;

  const actualNights = durationNights !== undefined ? durationNights : (durationDays > 1 ? durationDays - 1 : 0);

  const shortDn = (() => {
    if (lang === "en") return durationDays > 1 ? `${durationDays}D${actualNights}N` : "1-Day";
    if (lang === "zh") return durationDays > 1 ? `${durationDays}天${actualNights}晚` : "1日";
    if (lang === "ko") return durationDays > 1 ? `${actualNights}박${durationDays}일` : "당일";
    if (lang === "ja") return durationDays > 1 ? `${actualNights}泊${durationDays}日` : "日帰り";
    return `${durationDays}N${actualNights > 0 ? `${actualNights}Đ` : ""}`;
  })();

  let displayTitle = "";
  if (targetDistrictInfo && userChosenPlaces.length <= 1) {
    const districtTagline = targetDistrictInfo.title.includes("–")
      ? targetDistrictInfo.title.split("–")[1]?.trim()
      : targetDistrictInfo.title;
    if (lang === "en") displayTitle = `${shortDn} Itinerary: Discover ${targetDistrictInfo.name}`;
    else if (lang === "zh") displayTitle = `${shortDn}行程：探索 ${targetDistrictInfo.name}`;
    else if (lang === "ko") displayTitle = `${shortDn} 여정: ${targetDistrictInfo.name} 탐방`;
    else if (lang === "ja") displayTitle = `${shortDn}の旅程：${targetDistrictInfo.name}を巡る`;
    else displayTitle = `Hành trình ${shortDn}: Khám phá ${targetDistrictInfo.name} – ${districtTagline}`;
  } else if (userChosenPlaces.length > 1) {
    const stopsList = userChosenPlaces.slice(0, 3).map(p => p.shortName).join(" – ") + (userChosenPlaces.length > 3 ? ` (+${userChosenPlaces.length - 3})` : "");
    if (lang === "en") displayTitle = `${shortDn} Route: ${stopsList}`;
    else if (lang === "zh") displayTitle = `${shortDn}连线游：${stopsList}`;
    else if (lang === "ko") displayTitle = `${shortDn} 연계 루트: ${stopsList}`;
    else if (lang === "ja") displayTitle = `${shortDn}周遊ルート：${stopsList}`;
    else displayTitle = `Hành trình ${shortDn}: Ghép tuyến ${stopsList}`;
  } else {
    if (lang === "en") displayTitle = `${shortDn} Itinerary: Discover ${anchor.shortName}`;
    else if (lang === "zh") displayTitle = `${shortDn}行程：探索 ${anchor.shortName}`;
    else if (lang === "ko") displayTitle = `${shortDn} 여정: ${anchor.shortName} 탐방`;
    else if (lang === "ja") displayTitle = `${shortDn}の旅程：${anchor.shortName}を巡る`;
    else displayTitle = `Hành trình ${shortDn}: Khám phá ${anchor.shortName}`;
  }

  const effectiveDistrictName = targetDistrictInfo ? targetDistrictInfo.name : district;
  const effectiveRegion = targetDistrictInfo ? targetDistrictInfo.province : anchor.region;

  const displaySubtitle = (() => {
    if (lang === "en") return `${effectiveDistrictName ? `${effectiveDistrictName} · ` : ""}${effectiveRegion} · Transport: ${transport} · ${style}`;
    if (lang === "zh") return `${effectiveDistrictName ? `${effectiveDistrictName} · ` : ""}${effectiveRegion} · 交通：${transport} · ${style}`;
    if (lang === "ko") return `${effectiveDistrictName ? `${effectiveDistrictName} · ` : ""}${effectiveRegion} · 이동: ${transport} · ${style}`;
    if (lang === "ja") return `${effectiveDistrictName ? `${effectiveDistrictName} · ` : ""}${effectiveRegion} · 移動手段：${transport} · ${style}`;
    return `${effectiveDistrictName ? `${effectiveDistrictName} · ` : ""}${effectiveRegion} · Phương tiện ${transport} · ${style}`;
  })();

  const dNLabel = (() => {
    if (lang === "en") return durationDays > 1 ? `${durationDays} days ${actualNights} nights` : "1 day (Day trip)";
    if (lang === "zh") return durationDays > 1 ? `${durationDays}天${actualNights}晚` : "1日游（当天往返）";
    if (lang === "ko") return durationDays > 1 ? `${actualNights}박 ${durationDays}일` : "당일치기";
    if (lang === "ja") return durationDays > 1 ? `${actualNights}泊${durationDays}日` : "日帰り";
    return `${durationDays} ngày ${actualNights > 0 ? `${actualNights} đêm` : "(trong ngày)"}`;
  })();

  // Lời thoại hướng dẫn viên ảo (Tiếng Việt & English)
  const audioGuideScript = targetDistrictInfo
    ? `Chào mừng quý khách đến với hành trình khám phá ${targetDistrictInfo.name}, ${targetDistrictInfo.title}. Tôi là trợ lý du lịch số, rất vui được đồng hành cùng quý khách trong chuyến đi ${durationDays} ngày này. ${targetDistrictInfo.intro} Lịch trình được thiết kế tối ưu, kết hợp tham quan các danh lam tiêu biểu như ${targetDistrictInfo.attractions.map((a) => a.name.split("(")[0].trim()).join(", ")}, trải nghiệm văn hóa bản địa, thưởng thức đặc sản ${targetDistrictInfo.culinary.map((c) => c.dish.split("(")[0].trim()).join(", ")} và nghỉ dưỡng tiện nghi. Kính chúc quý khách có một chuyến đi an toàn, thư thái và trọn vẹn!`
    : `Chào mừng quý khách đến với hành trình du lịch ${anchor.shortName} và vùng đất cội nguồn Phú Thọ – Vĩnh Phúc – Hòa Bình. Tôi là trợ lý hướng dẫn viên số, rất vui được đồng hành cùng quý khách trong chuyến đi ${durationDays} ngày này. Lịch trình đã được tối ưu cân đối giữa thời gian tham quan, thưởng thức ẩm thực đặc sản và nghỉ dưỡng phục hồi sức khỏe. Kính chúc quý khách một chuyến đi trọn vẹn, an toàn và nhiều trải nghiệm đáng nhớ!`;

  const audioGuideScriptEn = targetDistrictInfo
    ? `Welcome to your journey exploring ${targetDistrictInfo.name} in ${targetDistrictInfo.province}. I am your digital tour guide, delighted to accompany you on this ${durationDays}-day trip. This itinerary is carefully optimized for sightseeing, authentic regional gastronomy, and relaxing stays. Wishing you a wonderful, safe, and memorable trip!`
    : `Welcome to your journey exploring ${anchor.shortName} and the northern cultural heritage of Phu Tho, Vinh Phuc, and Hoa Binh. I am your digital tour guide, delighted to accompany you on this ${durationDays}-day trip. This itinerary is carefully optimized for sightseeing, authentic regional gastronomy, and relaxing stays. Wishing you a wonderful, safe, and memorable trip in Vietnam!`;

  const overviewNarrative = targetDistrictInfo
    ? `Hành trình ${durationDays} ngày ${actualNights > 0 ? `${actualNights} đêm` : "(trong ngày)"} khám phá trọn vẹn ${targetDistrictInfo.name} (${targetDistrictInfo.province}) được tối ưu hóa cung đường di chuyển bằng ${transport}. Lịch trình kết nối các danh lam thắng cảnh đặc sắc như ${targetDistrictInfo.attractions.map((a) => a.name.split("(")[0].trim()).join(", ")}, thưởng thức ẩm thực đặc sản ${targetDistrictInfo.culinary.map((c) => c.dish.split("(")[0].trim()).join(", ")} và nghỉ ngơi tại ${targetDistrictInfo.recommendedStay || "khách sạn địa phương chu đáo"}.`
    : `Hành trình ${durationDays} ngày ${actualNights > 0 ? `${actualNights} đêm` : "(trong ngày)"} được thiết kế tối ưu hóa lộ trình di chuyển bằng ${transport}, kết nối những tinh hoa đặc sắc nhất của ${anchor.region}: từ di sản tâm linh, cảnh quan mây núi đến ẩm thực đặc sản bản địa. Lịch trình phân bổ nhịp nhàng giữa thời gian tham quan, thưởng thức ẩm thực và nghỉ ngơi tái tạo năng lượng.`;

  // Tạo Google Maps URL đa điểm
  const allStops = chosenPlaces.map((p) => `${p.lat},${p.lng}`);
  const googleMapsUrl = `https://www.google.com/maps/dir/${allStops.join("/")}`;

  // Thời gian di chuyển định dạng
  const hoursDrive = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  let totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive} giờ ` : ""}${remMinutes} phút lái xe`;
  if (lang === "en") {
    totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive}h ` : ""}${remMinutes}m drive`;
  } else if (lang === "zh") {
    totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive}小时` : ""}${remMinutes}分钟车程`;
  } else if (lang === "ko") {
    totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive}시간 ` : ""}${remMinutes}분 운전`;
  } else if (lang === "ja") {
    totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive}時間` : ""}${remMinutes}分ドライブ`;
  }

  const defaultRouteAdvice = districtGuide
    ? `${districtGuide.bestRoutes} (Cự ly ~${districtGuide.distanceFromHanoi}, thời gian ~${districtGuide.travelTime}).`
    : (anchor.transportTips?.routeAdvice || "Cung đường liên huyện và cao tốc bằng phẳng, dễ di chuyển.");

  return {
    id: `plan-${Date.now()}`,
    title: displayTitle,
    subtitle: displaySubtitle,
    targetDestination: targetDistrictInfo
      ? `${targetDistrictInfo.name} (${targetDistrictInfo.province})`
      : userChosenPlaces.length > 1
      ? userChosenPlaces.map((p) => p.shortName).join(", ")
      : anchor.name,
    region: targetDistrictInfo ? targetDistrictInfo.province : userChosenPlaces.length > 1 ? "Liên tuyến đa điểm" : anchor.region,
    durationDays,
    durationLabel: dNLabel,
    transport,
    style,
    travelers,
    totalDistanceKm,
    totalDriveTime,
    estimatedCostPerPerson: baseCostPerPerson,
    totalCost,
    overviewNarrative,
    audioGuideScript,
    audioGuideScriptEn,
    routeAdvice: defaultRouteAdvice,
    cautionAdvice: targetDistrictInfo
      ? `Đoàn cần chú ý giữ gìn vệ sinh môi trường, chuẩn bị trang phục phù hợp khi tham quan các danh thắng tại ${targetDistrictInfo.name} và tuân thủ tốc độ khi lái xe.`
      : (anchor.warning || "Chú ý theo dõi thời tiết và chuẩn bị trang phục phù hợp với từng điểm đến."),
    days,
    googleMapsUrl,
  };
}

/**
 * Lịch trình du lịch chuẩn 2N1Đ: Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo
 * Biên soạn và chuẩn hóa chính xác theo hồ sơ "lịch trình du lịch.docx"
 */
export function getOfficialDocxItinerary(lang: string = "vi"): GeneratedItinerary {
  const denHungPlace = places.find((p) => p.id === "den-hung") || places[0];
  const thanhThuyPlace = places.find((p) => p.id === "thanh-thuy") || places[3] || places[0];
  const tamDaoPlace = places.find((p) => p.id === "tam-dao") || places[0];

  const lynnTimesStay: NearbyItem = {
    name: "Lynn Times Thanh Thủy Resort & Khoáng Nóng",
    type: "stay",
    distance: "Trung tâm xã Thanh Thủy",
    travelTime: "Ngay trung tâm",
    note: "Tổ hợp nghỉ dưỡng khoáng nóng Radon tiêu chuẩn 5 sao, Shoptel tiện nghi với bồn tắm khoáng tại phòng",
    address: "Khu 2, Xã Bảo Yên (xã Thanh Thủy), Tỉnh Phú Thọ",
    hours: "Mở cửa 24/24 đón khách",
    phone: "0210 6268 688",
    rating: 4.9,
    reviewCount: 1280,
    image: "/images/places/thanh-thuy.jpg",
    priceRange: "600.000 – 800.000đ/người (phòng/combo)",
  };

  const day1Slots: ItinerarySlot[] = [
    {
      period: "Sáng",
      timeSlot: "07:30",
      title: "Xuất phát từ trung tâm Việt Trì",
      type: "travel",
      image: "/images/places/viet-tri.jpg",
      activity: "Đoàn tập trung tại trung tâm thành phố Việt Trì, khởi hành hướng về Khu di tích lịch sử Quốc gia đặc biệt Đền Hùng.",
      transportAdvice: "Di chuyển theo Đại lộ Hùng Vương / Quốc lộ 2 thẳng tới xã Hy Cương (~10 km, thời gian lái xe khoảng 15 phút). Đường đô thị rộng thoáng, biển chỉ dẫn rõ ràng.",
      travelMinutes: 15,
      highlightNote: "Khởi hành hành trình Cội Nguồn Đất Tổ",
      estimatedCostPerPerson: 0,
      audioScript: "Xin chào bạn! Tôi là Trợ lý Du lịch Đất Tổ. Hôm nay, tôi sẽ đồng hành cùng bạn trong hành trình 2 ngày 1 đêm khám phá Đất Tổ. Chuyến đi bắt đầu từ trung tâm Việt Trì, đưa bạn trở về với cội nguồn dân tộc tại Khu di tích lịch sử Đền Hùng, thư giãn tại Thanh Thủy và kết thúc hành trình bằng một ngày khám phá Tam Đảo. Bạn có thể lựa chọn di chuyển bằng ô tô hoặc xe máy. Nếu đi cùng gia đình, người lớn tuổi hoặc trẻ nhỏ, ô tô sẽ thuận tiện và thoải mái hơn. Nếu đi cùng bạn bè hoặc nhóm nhỏ, xe máy sẽ phù hợp với những ai muốn chủ động thời gian và tận hưởng cung đường. Trong hành trình hôm nay, tôi sẽ không chỉ hướng dẫn bạn đi đâu, đi như thế nào, mà còn kể cho bạn nghe những câu chuyện, truyền thuyết và giá trị văn hóa – lịch sử gắn với vùng đất này. Bây giờ, chúng ta cùng bắt đầu nhé!",
      audioScriptEn: "Hello! I am your Ancestral Land Travel Assistant. Today, I will accompany you on a 2-day, 1-night journey exploring Phu Tho: starting from Viet Tri city center, returning to ancestral roots at Hung Kings Temple, unwinding in Thanh Thuy hot springs, and concluding with a cloud-hunting day in Tam Dao. Let's begin our journey!",
    },
    {
      period: "Sáng",
      timeSlot: "07:30 – 08:00",
      title: "Ăn sáng tại Nhà hàng Mai Anh",
      type: "meal",
      restaurant: {
        name: "Nhà hàng Mai Anh – Hy Cương",
        type: "restaurant",
        distance: "Gần cổng vào Đền Hùng",
        travelTime: "5 phút",
        note: "Bún bò Huế, phở bò gia truyền tái chín, bánh cuốn chả nóng hổi, cà phê sáng tràn đầy năng lượng",
        address: "Đường Hùng Vương, xã Hy Cương, Tỉnh Phú Thọ",
        hours: "06:00 – 21:00",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Bún bò, phở cội nguồn thơm ngọt đậm đà",
      },
      activity: "Thưởng thức bữa sáng nóng sốt, chuẩn bị thể lực dồi dào trước khi bước vào hành trình leo núi viếng Đền Hùng.",
      transportAdvice: "Nằm ngay mặt đường Hùng Vương giáp quần thể di tích, sân đỗ xe rộng rãi.",
      travelMinutes: 5,
      highlightNote: "Nạp năng lượng chuẩn bị leo núi Nghĩa Lĩnh (40.000–60.000đ/người)",
      estimatedCostPerPerson: 50000,
      audioScript: "Để chuẩn bị thể lực dồi dào cho hành trình leo núi Nghĩa Lĩnh, đoàn dừng chân tại Nhà hàng Mai Anh ngay cửa ngõ Đền Hùng, thưởng thức tô phở bò gia truyền hoặc bún bò Huế nóng sốt đậm đà hương vị.",
      audioScriptEn: "Energize yourself before the ascent up Mount Nghia Linh with a hot bowl of traditional beef pho or Hue beef noodles at Mai Anh Restaurant right by the entrance.",
    },
    {
      period: "Sáng",
      timeSlot: "08:00 – 10:30",
      title: "Hành hương chiêm bái Quần thể Di tích Đền Hùng",
      type: "visit",
      place: denHungPlace,
      activity: "Lộ trình hành hương tuần tự tôn nghiêm: Cổng Đền → Đền Hạ (nơi Mẹ Âu Cơ sinh bọc trăm trứng) → Đền Trung (nơi Vua Hùng cùng lạc hầu, lạc tướng bàn việc nước) → Đền Thượng (đỉnh núi Nghĩa Lĩnh linh thiêng dâng hương trời đất) → Lăng Hùng Vương → Đền Giếng (nơi công chúa Tiên Dung & Ngọc Hoa soi gương vấn tóc) → Tham quan Bảo tàng Hùng Vương chiêm ngưỡng hiện vật thời đại đồ đồng Đông Sơn và trống đồng cổ.",
      transportAdvice: "Gửi xe tại bãi đỗ xe Đền Hùng, đi bộ men theo các bậc đá rợp bóng mát cây cổ thụ ngàn năm.",
      travelMinutes: 15,
      highlightNote: "Đền Hạ → Đền Trung → Đền Thượng → Đền Giếng → Bảo tàng Hùng Vương (Miễn phí vào cổng)",
      estimatedCostPerPerson: 0,
      audioScript: "Bạn hãy bắt đầu hành trình tại Cổng chính Khu di tích lịch sử Đền Hùng dưới chân núi Nghĩa Lĩnh, xây dựng năm 1917 với dòng chữ 'Cao sơn cảnh hành'. Men theo tuyến bậc đá dẫn lên sườn núi, điểm dừng đầu tiên là Đền Hạ – nơi gắn liền với truyền thuyết Mẹ Âu Cơ sinh bọc trăm trứng, cội nguồn của hai tiếng 'đồng bào' và hình ảnh 'Con Rồng, cháu Tiên'. Ngay cạnh Đền Hạ là Chùa Thiên Quang với cây vạn tuế ba nhánh 800 năm tuổi, nơi Bác Hồ về thăm ngày 19 tháng 9 năm 1954. Tiếp tục leo 159 bậc đá, bạn sẽ đến Đền Trung – Hùng Vương Tổ Miếu, nơi các Vua Hùng cùng Lạc hầu, Lạc tướng bàn việc nước và gắn với câu chuyện Lang Liêu làm bánh chưng bánh giầy dâng vua cha. Vượt tiếp 100 bậc đá lên đỉnh núi cao nhất là Đền Thượng – Kính Thiên Lĩnh Điện, nơi diễn ra các nghi lễ Giỗ Tổ trang nghiêm và Cột đá thề linh thiêng. Năm 2012, Tín ngưỡng thờ cúng Hùng Vương đã được UNESCO ghi danh Di sản văn hóa phi vật thể đại diện của nhân loại. Sau khi dâng hương, theo lối phía sau bạn xuống viếng Lăng Hùng Vương thứ sáu trầm mặc, rồi qua Đền Giếng soi bóng giếng cổ Ngọc Tỉnh nơi công chúa Tiên Dung và Ngọc Hoa thường chải tóc. Điểm cuối là Bảo tàng Hùng Vương trên Đồi Công Quán, nơi trưng bày các hiện vật khảo cổ học Phùng Nguyên, Đồng Đậu, Gò Mun và trống đồng Đông Sơn rực rỡ.",
      audioScriptEn: "Begin at the Main Gate constructed in 1917 inscribed with 'Cao Son Canh Hanh'. Climb stone steps to Ha Temple, commemorating Mother Au Co's hundred-egg sac and the roots of national solidarity. Next door sits Thien Quang Pagoda with an 800-year-old cycad tree marking Ho Chi Minh's 1954 historic visit. Ascend 159 steps to Trung Temple, where Kings deliberated with generals and Lang Liêu crafted square earth and round sky cakes. Continue 100 steps to the summit at Thuong Temple - Kinh Thien Linh Dien, epicenter of the UNESCO-inscribed Ancestral Worship rites. Descend to the 6th King's Mausoleum, Gieng Temple with Princesses Tien Dung and Ngoc Hoa's reflection well, and conclude at Hung Kings Museum examining prehistoric Bronze Age Dong Son drums.",
    },
    {
      period: "Trưa",
      timeSlot: "10:30 – 11:00",
      title: "Xuống núi và di chuyển đến nhà hàng",
      type: "travel",
      activity: "Xuống núi Nghĩa Lĩnh, nghỉ ngơi lấy lại sức và di chuyển sang nhà hàng ẩm thực đất Tổ.",
      transportAdvice: "Khoảng cách ~2 km, di chuyển bằng ô tô riêng hoặc xe điện nội khu mất khoảng 5–10 phút.",
      travelMinutes: 10,
      highlightNote: "Nghỉ chân chuẩn bị bữa trưa đặc sản vùng Đất Tổ",
      estimatedCostPerPerson: 0,
      audioScript: "Sau khi chiêm bái trọn vẹn các ngôi đền trên núi Nghĩa Lĩnh và Bảo tàng Hùng Vương, chúng ta cùng thong thả xuống núi, nghỉ ngơi lấy lại sức và di chuyển đến nhà hàng thưởng thức bữa trưa đặc sản Đất Tổ.",
      audioScriptEn: "Descending Mount Nghia Linh, take a relaxing breather before driving over to savor authentic regional specialties.",
    },
    {
      period: "Trưa",
      timeSlot: "11:00 – 12:15",
      title: "Ăn trưa tại Nhà Hàng Giang Lan Đền Hùng",
      type: "meal",
      restaurant: {
        name: "Nhà Hàng Giang Lan Đền Hùng",
        type: "restaurant",
        distance: "Khu vực Đền Hùng (cách 1.5 km)",
        travelTime: "5 phút",
        note: "Mâm cơm phong vị Đất Tổ: Cá lăng om chuối đậu, gà đồi hấp lá chanh, thịt chua Thanh Sơn ăn kèm lá sung, canh rau sắng, xôi nếp nương",
        address: "Khu 1, xã Hy Cương, Tỉnh Phú Thọ",
        hours: "09:00 – 22:00",
        phone: "0983 234 567",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Cá lăng tươi ngọt béo ngậy, gà đồi chắc thịt thơm phức",
      },
      activity: "Dùng bữa trưa thịnh soạn với các món ăn đặc sản truyền thống Phú Thọ trong không gian sân vườn mát mẻ, thoáng đãng.",
      transportAdvice: "Nhà hàng có bãi đậu xe ô tô rộng rãi, đón tiếp đoàn đông chu đáo.",
      travelMinutes: 5,
      highlightNote: "Ẩm thực truyền thống Đất Tổ (120.000–180.000đ/người)",
      estimatedCostPerPerson: 150000,
      audioScript: "Nhà hàng Giang Lan Đền Hùng là địa điểm phù hợp để thưởng thức các món đặc sản Phú Thọ sau hành trình tham quan Đền Hùng. Nhà hàng phục vụ những món ăn mang hương vị địa phương, nổi bật với các đặc sản vùng Đất Tổ như cá lăng om chuối đậu, gà đồi hấp lá chanh, thịt chua Thanh Sơn, phù hợp cho cả gia đình và đoàn khách du lịch.",
      audioScriptEn: "Giang Lan Restaurant is an ideal stop to taste Phu Tho culinary specialties after exploring Hung Temple. It serves authentic local delicacies including Da River fish stewed with green banana, steamed free-range hill chicken, and Thanh Son fermented pork.",
    },
    {
      period: "Chiều",
      timeSlot: "12:15 – 13:30",
      title: "Di chuyển Đền Hùng → Thanh Thủy (~35 km)",
      type: "travel",
      activity: "Rời khu di tích Đền Hùng, xe lăn bánh theo đường tỉnh 317 ven đê sông Đà thơ mộng hướng về khu du lịch nghỉ dưỡng khoáng nóng Thanh Thủy.",
      transportAdvice: "Cung đường ĐT317 trải nhựa êm thuận, cự ly ~35 km, thời gian di chuyển khoảng 50–60 phút. Hai bên đường là khung cảnh đồng quê xanh ngát và dòng sông Đà hùng vĩ.",
      travelMinutes: 50,
      highlightNote: "Cung đường ven sông Đà nối Đất Tổ với thiên đường khoáng nóng",
      estimatedCostPerPerson: 0,
      audioScript: "Rời Đền Hùng, xe lăn bánh theo đường tỉnh 317 ven đê sông Đà thơ mộng hướng về khu nghỉ dưỡng khoáng nóng Thanh Thủy. Tuyến đường 35 km êm thuận với khung cảnh đồng quê thanh bình, đưa bạn đến với miền khoáng nóng trứ danh của Phú Thọ.",
      audioScriptEn: "Departing Hung Temple, scenic Provincial Road 317 winds along the romantic Da River dyke for 35 km towards the geothermal mineral springs of Thanh Thuy.",
    },
    {
      period: "Chiều",
      timeSlot: "13:30 – 14:00",
      title: "Đến Lynn Times Thanh Thủy, gửi hành lý",
      type: "stay",
      place: thanhThuyPlace,
      stay: lynnTimesStay,
      activity: "Đến sảnh chính khu nghỉ dưỡng 5 sao Lynn Times Thanh Thủy, nhân viên đón tiếp trà hoa thảo mộc chào mừng và hỗ trợ gửi hành lý.",
      transportAdvice: "Xe dừng đỗ thuận tiện tại sảnh chính tòa nhà lễ tân.",
      travelMinutes: 5,
      highlightNote: "Check-in sảnh đón tiếp sang trọng và nhận trà đón tiếp",
      estimatedCostPerPerson: 0,
      audioScript: "Chào mừng bạn đến với Lynn Times Thanh Thủy! Quý khách dừng chân tại sảnh chính sang trọng, thưởng thức tách trà thảo mộc đón tiếp và gửi hành lý trong thời gian chuẩn bị nhận phòng.",
      audioScriptEn: "Welcome to Lynn Times Thanh Thuy! Arrive at the 5-star grand reception hall, enjoy welcome herbal tea, and store luggage before room check-in.",
    },
    {
      period: "Chiều",
      timeSlot: "14:00 – 14:30",
      title: "Nhận phòng Shoptel & nghỉ ngơi lấy lại sức",
      type: "stay",
      stay: lynnTimesStay,
      activity: "Nhận phòng căn hộ Shoptel tiện nghi chuẩn 5 sao, cất đồ đạc, thay trang phục thư giãn và ngắm view nội khu xanh mát.",
      transportAdvice: "Thang máy tốc độ cao hoặc xe điện đưa đón trong khuôn viên khu nghỉ dưỡng.",
      travelMinutes: 5,
      highlightNote: "Căn hộ Shoptel cao cấp có nguồn khoáng nóng dẫn trực tiếp vào phòng (600.000–800.000đ/người)",
      estimatedCostPerPerson: 700000,
      audioScript: "Quý khách nhận phòng căn hộ Shoptel 5 sao tiện nghi, nơi có nguồn khoáng nóng tự nhiên dẫn trực tiếp vào phòng tắm. Thư giãn ngắm nhìn khung cảnh núi non Ba Vì và sông Đà yên bình phía xa.",
      audioScriptEn: "Check into your stylish 5-star Shoptel suite featuring an in-room natural mineral tub. Relax and take in peaceful vistas of the Da River and distant Ba Vi peaks.",
    },
    {
      period: "Chiều",
      timeSlot: "14:30 – 16:00",
      title: "Tắm khoáng nóng Radon tại Ohayo Onsen & Spa",
      type: "visit",
      place: thanhThuyPlace,
      activity: "Ngâm mình thư giãn trong nguồn nước khoáng nóng Radon quý hiếm độc nhất miền Bắc: ngâm bể khoáng ngoài trời hòa mình vào thiên nhiên, massage thủy lực tại bể Jacuzzi, ngâm bồn thảo dược và xông hơi Sauna đá muối Himalaya giải tỏa mọi căng thẳng mệt mỏi.",
      transportAdvice: "Tản bộ qua công viên khoáng nóng Ohayo Onsen nằm ngay trung tâm quần thể.",
      travelMinutes: 5,
      highlightNote: "Suối khoáng Radon quý hiếm & xông hơi đá muối Himalaya (Đã bao gồm trong combo phòng)",
      estimatedCostPerPerson: 0,
      audioScript: "Lynn Times Thanh Thủy là một khu nghỉ dưỡng khoáng nóng mang đậm phong cách Nhật Bản, nơi dịch vụ được xây dựng như một câu chuyện văn hóa tinh tế. Khi bước vào không gian Onsen, du khách sẽ cảm nhận sự thư thái trong từng chi tiết: làn nước khoáng nóng tự nhiên giàu khoáng chất và khí Radon quý hiếm giúp cơ thể phục hồi, cùng phong cách phục vụ nhẹ nhàng, chu đáo. Trải nghiệm tại đây không chỉ dừng lại ở tắm khoáng, mà còn là hành trình chăm sóc sức khỏe toàn diện với bể Jacuzzi thủy lực, bồn thảo dược và xông hơi Sauna đá muối Himalaya giải tỏa mọi căng thẳng.",
      audioScriptEn: "Lynn Times Thanh Thuy is a Japanese-style hot mineral resort where wellness is crafted like refined cultural storytelling. Step into the Onsen sanctuary to bathe in rare natural radon-infused geothermal waters that rejuvenate muscles and mind, complemented by Himalayan salt sauna and herbal therapy baths.",
    },
    {
      period: "Chiều",
      timeSlot: "16:00 – 17:30",
      title: "Dạo phố đi bộ sinh thái, vườn cảnh quan, hồ cá Koi & check-in café",
      type: "visit",
      place: thanhThuyPlace,
      activity: "Dạo bước trên các tuyến phố đi bộ rực rỡ sắc màu, ngắm đàn cá Koi tung tăng bơi lội, check-in tại các tiểu cảnh hoa anh đào, thưởng thức trà chiều hoặc cà phê giải khát.",
      transportAdvice: "Khuôn viên phố đi bộ an toàn, khép kín, xe điện nội khu hỗ trợ khi cần.",
      travelMinutes: 5,
      highlightNote: "Check-in phố hoa, hồ cá Koi và thư giãn trà chiều (Tùy chi tiêu cá nhân)",
      estimatedCostPerPerson: 50000,
      audioScript: "Điểm nhấn đặc biệt là khu phố Nhật ngay trong khuôn viên, nơi tái hiện khung cảnh truyền thống với đèn lồng, mái ngói cong, tạo nên không gian check-in độc đáo. Bên cạnh đó, vườn Nhật với bonsai, cầu gỗ, hồ nước trong xanh mang lại cảm giác thiền định, còn hồ cá Koi rực rỡ sắc màu trở thành biểu tượng may mắn và là nơi du khách dừng chân ngắm cảnh. Quán café phong cách Nhật cũng là điểm hẹn lý tưởng để thưởng thức đồ uống, trò chuyện và lưu giữ những bức hình đẹp.",
      audioScriptEn: "A standout highlight is the on-site Japanese walking street recreating traditional architectures with hanging paper lanterns and curved tiled roofs. Wander through Zen gardens with bonsai and wooden bridges, marvel at colorful lucky Koi carp ponds, and unwind at a Japanese tea cafe.",
    },
    {
      period: "Tối",
      timeSlot: "17:30 – 18:30",
      title: "Nghỉ ngơi, thư giãn tại phòng",
      type: "stay",
      stay: lynnTimesStay,
      activity: "Trở về phòng nghỉ ngơi, tắm tráng nước ấm, ngắm hoàng hôn buông xuống núi Ba Vì phía xa và chuẩn bị trang phục cho bữa tiệc tối.",
      transportAdvice: "Nội khu phòng nghỉ.",
      travelMinutes: 0,
      highlightNote: "Khoảng lặng thư thái tái tạo năng lượng",
      estimatedCostPerPerson: 0,
      audioScript: "Khoảng lặng êm đềm tại phòng nghỉ Shoptel để du khách tắm tráng nước ấm, ngắm hoàng hôn nhuộm hồng đỉnh núi Ba Vì phía xa và chuẩn bị trang phục cho bữa tối đặc sắc.",
      audioScriptEn: "Enjoy a tranquil downtime in your room, watching the sunset glow over Mount Ba Vi and freshening up for the upcoming dinner feast.",
    },
    {
      period: "Tối",
      timeSlot: "18:30 – 19:45",
      title: "Ăn tối tại Nhà hàng Tinh Hoa Bắc Bộ & Chả Cá Sông Đà",
      type: "meal",
      restaurant: {
        name: "Nhà hàng Tinh Hoa Bắc Bộ & Chả Cá Sông Đà – Lynn Times",
        type: "restaurant",
        distance: "Phố đi bộ Lynn Times Thanh Thủy",
        travelTime: "2 phút đi bộ",
        note: "Chả cá lăng sông Đà nướng thơm lừng xèo xèo trên chảo mỡ, ăn kèm thì là hành hoa, bún rối, lạc rang và mắm tôm chuẩn vị; cá ngạnh om chuối đậu",
        address: "Khu phố đi bộ Lynn Times Thanh Thủy, Tỉnh Phú Thọ",
        hours: "10:30 – 22:30",
        phone: "0210 6268 888",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Chả cá sông Đà thơm béo, đậm đà tinh hoa ẩm thực truyền thống Bắc Bộ",
      },
      activity: "Thưởng thức bữa tối ẩm thực đặc sắc với món Chả cá sông Đà trứ danh trong không gian nhà hàng lung linh ánh đèn ấm cúng.",
      transportAdvice: "Đi bộ 2–3 phút từ khu phòng ở sang nhà hàng ẩm thực.",
      travelMinutes: 5,
      highlightNote: "Thưởng thức Chả cá sông Đà nóng hổi trứ danh (150.000–250.000đ/người)",
      estimatedCostPerPerson: 200000,
      audioScript: "Nhà hàng Tinh Hoa Bắc Bộ & Chả Cá Sông Đà tại Lynn Times Thanh Thủy là nơi du khách được thưởng thức ẩm thực mang đậm hương vị vùng miền. Không gian nhà hàng kết hợp nét hiện đại với phong cách Bắc Bộ truyền thống, tạo cảm giác vừa sang trọng vừa gần gũi. Điểm nhấn đặc biệt chính là món Chả Cá Sông Đà, chế biến từ cá tươi đánh bắt ngay dòng sông Đà, thịt chắc, thơm, kết hợp cùng gia vị truyền thống tạo nên hương vị khó quên. Ngoài ra thực đơn còn có nhiều món đặc sản Bắc Bộ tinh tế, mang lại một trải nghiệm văn hóa ẩm thực trọn vẹn.",
      audioScriptEn: "Tinh Hoa Bac Bo & Cha Ca Song Da Restaurant at Lynn Times celebrates northern culinary identity. The star highlight is grilled Da River fish patties, served sizzling on oil pans with fresh dill, spring onions, rice vermicelli, roasted peanuts, and traditional seasoning sauces.",
    },
    {
      period: "Tối",
      timeSlot: "19:45 – 21:15",
      title: "Dạo quảng trường Sakura & Hokkaido, café & check-in đêm",
      type: "visit",
      place: thanhThuyPlace,
      activity: "Hòa mình vào không khí lung linh về đêm tại quảng trường Sakura & Hokkaido, thưởng thức âm nhạc acoustic nhẹ nhàng, uống cà phê và check-in phố đèn lồng rực rỡ.",
      transportAdvice: "Tản bộ dạo đêm nội khu resort.",
      travelMinutes: 5,
      highlightNote: "Phố đêm lung linh ánh đèn và thưởng thức cà phê ngắm cảnh (Tùy chi tiêu)",
      estimatedCostPerPerson: 50000,
      audioScript: "Hòa mình vào không khí lung linh về đêm tại quảng trường Sakura & Hokkaido, nhâm nhi tách cà phê ấm nóng, thưởng thức âm nhạc acoustic nhẹ nhàng và check-in bên những dãy phố đèn lồng đỏ rực rỡ.",
      audioScriptEn: "Soak in the illuminated nighttime charm at Sakura & Hokkaido Squares, sip evening coffee with gentle acoustic tunes, and capture memories along radiant lantern-lit promenades.",
    },
    {
      period: "Tối",
      timeSlot: "21:15",
      title: "Nghỉ đêm tại Lynn Times Thanh Thủy Resort",
      type: "stay",
      stay: lynnTimesStay,
      activity: "Ngâm bồn khoáng ấm thư giãn tại phòng, tận hưởng giấc ngủ sâu và êm ái giữa không gian tĩnh lặng, trong lành của vùng đất khoáng nóng.",
      transportAdvice: "Nghỉ ngơi tại phòng.",
      travelMinutes: 0,
      highlightNote: "Nghỉ ngơi phục hồi sức khỏe trọn vẹn",
      estimatedCostPerPerson: 0,
      audioScript: "Ngâm bồn khoáng ấm thư giãn ngay tại phòng, tận hưởng giấc ngủ sâu và êm ái giữa không gian tĩnh lặng, trong lành của miền đất khoáng nóng, chuẩn bị năng lượng cho chuyến khám phá Tam Đảo ngày mai.",
      audioScriptEn: "Immerse in your private in-room warm mineral tub for deeply restorative sleep amidst the serene countryside atmosphere, getting well-rested for tomorrow's Tam Dao ascent.",
    },
  ];

  const day2Slots: ItinerarySlot[] = [
    {
      period: "Sáng",
      timeSlot: "07:30 – 08:15",
      title: "Ăn sáng buffet tại Lynn Times Thanh Thủy",
      type: "meal",
      restaurant: {
        name: "Nhà hàng Buffet Lynn Times Thanh Thủy",
        type: "restaurant",
        distance: "Tầng 2 nhà hàng trung tâm",
        travelTime: "Ngay tại resort",
        note: "Buffet phong phú với hơn 40 món: bún thang, phở cuốn, bánh mì nóng, thịt nguội, cháo sườn, hoa quả nhiệt đới tươi ngon và cà phê",
        address: "Khu 2, Xã Bảo Yên (xã Thanh Thủy), Tỉnh Phú Thọ",
        hours: "06:30 – 09:30",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Thực đơn dinh dưỡng đa dạng chuẩn phong cách nghỉ dưỡng 5 sao",
      },
      activity: "Thưởng thức bữa sáng buffet thơm ngon, ngắm nhìn ánh nắng ban mai chiếu rọi qua rặng cây và hồ bơi ngoài trời.",
      transportAdvice: "Đi thang máy xuống nhà hàng buffet trung tâm.",
      travelMinutes: 5,
      highlightNote: "Buffet sáng tiêu chuẩn cao cấp (Đã bao gồm trong combo phòng)",
      estimatedCostPerPerson: 0,
      audioScript: "Chào ngày mới! Quý khách thưởng thức bữa sáng buffet thơm ngon với hơn 40 món ăn phong phú tại nhà hàng trung tâm Lynn Times Thanh Thủy, ngắm nhìn ánh ban mai chiếu rọi qua rặng cây, nạp năng lượng sẵn sàng cho chặng vượt đèo lên Tam Đảo.",
      audioScriptEn: "Good morning! Savor a bountiful breakfast buffet with over 40 delicacies at the central restaurant, soaking in the morning sunshine before driving up to misty Tam Dao.",
    },
    {
      period: "Sáng",
      timeSlot: "08:15 – 08:45",
      title: "Dạo quanh khu nghỉ dưỡng, chụp ảnh kỷ niệm",
      type: "visit",
      place: thanhThuyPlace,
      activity: "Tản bộ hít thở bầu không khí tươi mới buổi sáng, chụp những bức hình kỷ niệm rạng rỡ giữa các góc tiểu cảnh xanh mát của resort.",
      transportAdvice: "Đi bộ dạo quanh khuôn viên.",
      travelMinutes: 5,
      highlightNote: "Check-in khung cảnh ban mai thư thái (0đ)",
      estimatedCostPerPerson: 0,
      audioScript: "Tận hưởng bầu không khí trong lành buổi sớm mai, thong thả tản bộ qua các tiểu cảnh vườn Nhật, hồ cá Koi và lưu giữ những bức hình kỷ niệm rạng rỡ trước khi rời khu nghỉ dưỡng.",
      audioScriptEn: "Enjoy the fresh morning breeze, stroll through Zen gardens and Koi ponds, and capture radiant keepsake photos before departing the resort.",
    },
    {
      period: "Sáng",
      timeSlot: "08:45 – 09:00",
      title: "Check-out trả phòng",
      type: "stay",
      stay: lynnTimesStay,
      activity: "Hoàn tất thủ tục trả phòng tại quầy lễ tân, nhân viên bellman hỗ trợ chuyển hành lý lên xe.",
      transportAdvice: "Tập trung tại sảnh chính tòa nhà lễ tân.",
      travelMinutes: 5,
      highlightNote: "Tạm biệt Lynn Times Thanh Thủy, sẵn sàng cho chặng Tam Đảo",
      estimatedCostPerPerson: 0,
      audioScript: "Quý khách hoàn tất thủ tục trả phòng tại quầy lễ tân, nhân viên hỗ trợ chuyển hành lý lên xe, chuẩn bị cho hành trình khám phá thị xã trên mây Tam Đảo.",
      audioScriptEn: "Complete check-out formalities at reception, with luggage transferred to your vehicle, ready for the scenic ascent to cloud-kissed Tam Dao.",
    },
    {
      period: "Sáng",
      timeSlot: "09:00 – 10:30",
      title: "Di chuyển Thanh Thủy → Tam Đảo (~65 km)",
      type: "travel",
      activity: "Khởi hành rời Thanh Thủy, qua cầu Đồng Quang / cầu Văn Lang, theo tuyến Quốc lộ 2B vượt cung đèo thông reo uốn lượn hướng lên đỉnh mây Tam Đảo.",
      transportAdvice: "Khoảng cách ~65 km (~1 giờ 30 phút). Đoạn đèo Tam Đảo dài 13 km uốn lượn phong cảnh hữu tình, tài xế lưu ý giữ tốc độ ổn định và đi số thấp.",
      travelMinutes: 90,
      highlightNote: "Cung đường đèo mây ngoạn mục dẫn lên vùng mây trong sương",
      estimatedCostPerPerson: 0,
      audioScript: "Rời Thanh Thủy, xe qua cầu kết nối sang Quốc lộ 2B vượt cung đèo thông reo uốn lượn dài 13 km hướng lên Tam Đảo. Khi xe lên đến độ cao gần 1.000 mét, không khí chuyển sang mát lạnh đặc trưng và mây mù giăng mắc quanh sườn núi kỳ vĩ.",
      audioScriptEn: "Departing Thanh Thuy across the river, ascend the 13-km pine-clad scenic winding pass along National Route 2B towards Tam Dao, as crisp highland breezes replace valley warmth.",
    },
    {
      period: "Sáng",
      timeSlot: "10:30 – 11:00",
      title: "Check-in Quảng trường Tam Đảo",
      type: "visit",
      place: tamDaoPlace,
      activity: "Dạo bước tại quảng trường trung tâm Tam Đảo rực rỡ với đài phun nước, bậc thang đá biểu tượng, ngắm nhìn biển mây bồng bềnh và lâu đài cổ tích phía xa.",
      transportAdvice: "Đậu xe tại bãi đỗ trung tâm xã Tam Đảo, tản bộ ngắm cảnh quanh quảng trường.",
      travelMinutes: 5,
      highlightNote: "Biểu tượng trung tâm du lịch Tam Đảo mây mù bồng bềnh (0đ)",
      estimatedCostPerPerson: 0,
      audioScript: "Quảng trường Tam Đảo nằm ngay trung tâm xã Tam Đảo, được ví như 'trái tim' của vùng đất nghỉ dưỡng trên mây. Đây là nơi du khách dễ dàng cảm nhận nhịp sống sôi động của Tam Đảo, vừa hiện đại vừa giữ được nét văn hóa vùng núi. Ban ngày, quảng trường rộng rãi, thoáng đãng, là điểm lý tưởng để dạo bộ, chụp ảnh với khung cảnh núi non hùng vĩ bao quanh. Đến Quảng trường Tam Đảo, du khách không chỉ có những bức hình đẹp, mà còn cảm nhận được tinh thần trẻ trung, năng động của thị trấn nghỉ dưỡng, đồng thời thấy rõ sự gắn kết giữa con người và thiên nhiên nơi đây.",
      audioScriptEn: "Tam Dao Central Square is the beating heart of this misty mountain resort. Spacious and breezy during the day, framed by towering mountains and fairy-tale castle facades, it is the premier spot for strolling and capturing vibrant photos.",
    },
    {
      period: "Trưa",
      timeSlot: "11:00 – 11:30",
      title: "Tham quan Nhà thờ đá cổ Tam Đảo",
      type: "visit",
      place: tamDaoPlace,
      activity: "Chiêm bái và check-in kiệt tác kiến trúc Gothic bằng đá xanh sừng sững xây dựng từ năm 1906 thời Pháp. Từ các vòm cửa đá nhìn xuống thung lũng mây trập trùng tựa chốn bồng lai tiên cảnh.",
      transportAdvice: "Cách Quảng trường trung tâm chỉ 200m đi bộ dọc con dốc đá.",
      travelMinutes: 5,
      highlightNote: "Kiệt tác Gothic đá xanh cổ kính & góc ngắm thung lũng mây huyền thoại (0đ)",
      estimatedCostPerPerson: 0,
      audioScript: "Nhà thờ đá Tam Đảo là một công trình mang tính biểu tượng, được người Pháp xây dựng từ đầu thế kỷ XX khi Tam Đảo mới hình thành như một điểm nghỉ dưỡng. Toàn bộ nhà thờ được dựng bằng đá xanh, theo phong cách Gothic cổ điển, tạo nên vẻ đẹp uy nghi, cổ kính giữa khung cảnh núi rừng mờ sương. Điều đặc biệt là nhà thờ đá không chỉ là nơi sinh hoạt tôn giáo, mà còn là minh chứng cho sự giao thoa văn hóa giữa phương Tây và vùng núi Việt Nam. Ngày nay, nhà thờ đá trở thành điểm check-in không thể bỏ qua với các vòm cửa đá cổ kính nhìn xuống thung lũng mây bồng bềnh.",
      audioScriptEn: "Tam Dao Stone Church is an iconic French Gothic monument built from bluish stones in the early 20th century. Standing majestically amidst swirling mountain mist, its stone arches frame spellbinding panoramas of the cloud-filled valley below.",
    },
    {
      period: "Trưa",
      timeSlot: "11:30 – 12:45",
      title: "Ăn trưa tại Nhà Hàng TAM ĐẢO NÚI",
      type: "meal",
      restaurant: {
        name: "Nhà Hàng TAM ĐẢO NÚI",
        type: "restaurant",
        distance: "Khu 1, xã Tam Đảo",
        travelTime: "3 phút đi bộ",
        note: "Đặc sản vùng cao: Ngọn su su xào tỏi giòn ngọt xanh mướt, gà đồi bọc đất nướng than hoa thơm lừng, thịt lợn mán xiên nướng lá móc mật, xôi nếp nương muối vừng",
        address: "Khu 1, xã Tam Đảo, Tỉnh Phú Thọ",
        hours: "09:00 – 22:30",
        phone: "0978 123 888",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Rau su su tươi giòn hái tại vườn núi, thịt gà đồi săn chắc đậm vị thiên nhiên",
      },
      activity: "Thưởng thức mâm cơm đặc sản núi rừng trọn vị giữa tiết trời se lạnh mát dịu đặc trưng của Tam Đảo.",
      transportAdvice: "Nằm ngay khu ẩm thực trung tâm xã Tam Đảo, có chỗ đỗ xe thuận tiện.",
      travelMinutes: 5,
      highlightNote: "Ẩm thực ngọn su su xanh non & gà đồi nướng than (150.000–250.000đ/người)",
      estimatedCostPerPerson: 200000,
      audioScript: "Nhà hàng Tam Đảo Núi là một điểm dừng chân ẩm thực độc đáo, nằm giữa khung cảnh núi rừng hùng vĩ của Tam Đảo. Với thiết kế mở, tận dụng tối đa không gian thoáng đãng và tầm nhìn bao quát, nhà hàng mang đến cho du khách cảm giác vừa gần gũi thiên nhiên, vừa sang trọng tinh tế. Thực đơn tại đây phong phú, kết hợp giữa đặc sản núi rừng Tam Đảo và các món ăn truyền thống Việt Nam: gà đồi bọc đất nướng than hoa, lợn bản, rau rừng tươi ngon và đặc biệt là món ngọn su su xào tỏi xanh mướt giòn ngọt đặc trưng của xứ mây.",
      audioScriptEn: "Tam Dao Nui Restaurant offers a memorable culinary stop enveloped by grand mountain landscapes. Enjoy flavorful highland dishes like grilled hill chicken, wild boar skewers, and crunchy garlic-sautéed chayote greens harvested fresh from local terraced slopes.",
    },
    {
      period: "Chiều",
      timeSlot: "12:45 – 14:00",
      title: "Café, nghỉ ngơi & ngắm cảnh tại Tam Đảo café trên cả cổng trời",
      type: "meal",
      restaurant: {
        name: "Tam Đảo cafe trên cả cổng trời",
        type: "cafe",
        distance: "Dốc Cổng Trời Tam Đảo",
        travelTime: "5 phút",
        note: "Quán cà phê săn mây view panorama triệu đô ôm trọn thung lũng mây Tam Đảo, lâu đài châu Âu cổ tích và rặng thông ngút ngàn",
        address: "Dốc Cổng Trời, Khu 1, xã Tam Đảo, Tỉnh Phú Thọ",
        hours: "07:00 – 23:00",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
        taste: "Cà phê trứng béo ngậy ấm nồng, trà đào cam sả thanh mát ngắm biển mây",
      },
      activity: "Ngồi nhâm nhi tách đồ uống ấm nóng, ngắm biển mây vần vũ lướt qua vai và chụp những bức ảnh 'sống ảo' triệu view để đời.",
      transportAdvice: "Xe đưa lên dốc Cổng Trời hoặc tản bộ ngắn từ khu trung tâm.",
      travelMinutes: 10,
      highlightNote: "Tọa độ săn mây ngắm trọn thung lũng từ đỉnh trời (60.000–100.000đ/người)",
      estimatedCostPerPerson: 80000,
      audioScript: "Tam Đảo Café trên Cổng Trời là một điểm dừng chân rất đặc biệt, nằm ngay khu vực Cổng Trời – nơi cao nhất của Tam Đảo. Quán café sở hữu tầm nhìn bao quát toàn cảnh núi rừng và thung lũng phía dưới. Ngồi ở đây, du khách có thể thưởng thức một tách cà phê nóng trong làn sương mờ buổi sáng, ngắm nhìn biển mây bồng bềnh và lâu đài cổ tích phía xa. Đây không chỉ là nơi uống cà phê, mà còn là trải nghiệm văn hóa hòa mình vào thiên nhiên, tìm lại sự cân bằng và an yên giữa núi rừng.",
      audioScriptEn: "Tam Dao Cafe tren Cong Troi occupies the highest vantage point at Heaven's Gate, boasting 360-degree panorama vistas over mist-covered pine valleys and fairytale stone castles while sipping hot artisanal coffee.",
    },
    {
      period: "Chiều",
      timeSlot: "14:00 – 15:00",
      title: "Dạo trung tâm, check-in & mua đặc sản Tam Đảo",
      type: "visit",
      place: tamDaoPlace,
      activity: "Ghé chợ trung tâm Tam Đảo mua những bó ngọn su su tươi non vừa cắt trong sương sớm, chuối mật rừng, măng khô, bánh tro mật mía và trà hoa vàng làm quà cho người thân, bạn bè.",
      transportAdvice: "Tản bộ quanh khu chợ truyền thống trung tâm xã Tam Đảo.",
      travelMinutes: 5,
      highlightNote: "Mua quà đặc sản ngọn su su & nông sản tươi ngon (Tùy chi tiêu cá nhân)",
      estimatedCostPerPerson: 100000,
      audioScript: "Sau khi tham quan các địa điểm nổi tiếng như Nhà thờ đá hay lên Cổng Trời, du khách quay lại khu trung tâm Tam Đảo để check-in và tận hưởng không khí nhộn nhịp. Khu trung tâm chính là nơi hội tụ nhiều dịch vụ du lịch: quán café, nhà hàng đặc sản núi rừng và chợ truyền thống với những bó ngọn su su tươi non mơn mởn, chuối mật, măng khô làm quà cho người thân, bạn bè.",
      audioScriptEn: "Return to Tam Dao town center to stroll through bustling local markets, picking up fresh chayote bundles, mountain honey bananas, and dried bamboo shoots as gifts.",
    },
    {
      period: "Chiều",
      timeSlot: "15:00 – 15:45",
      title: "Tự do vui chơi, chụp ảnh check-in các góc phố thơ mộng",
      type: "visit",
      place: tamDaoPlace,
      activity: "Tự do lang thang qua những con dốc hoa sim tím, bậc thang đá phong cách châu Âu, lưu giữ những kỷ niệm đẹp cuối cùng tại vùng mây Tam Đảo.",
      transportAdvice: "Đi bộ tự do trong bán kính trung tâm.",
      travelMinutes: 5,
      highlightNote: "Khoảng thời gian tự do khám phá và chụp ảnh kỷ niệm (Tùy chi tiêu)",
      estimatedCostPerPerson: 50000,
      audioScript: "Khoảng thời gian tự do khám phá, tản bộ qua những con dốc quanh co ngập tràn sắc hoa và sương mù, lưu lại những bức ảnh kỷ niệm cuối cùng tại thị trấn trong mây.",
      audioScriptEn: "Enjoy free time wandering through romantic flower slopes and stone steps, taking final memorable snapshots of misty Tam Dao.",
    },
    {
      period: "Chiều",
      timeSlot: "15:45 – 16:00",
      title: "Tập trung chuẩn bị rời Tam Đảo",
      type: "travel",
      activity: "Đoàn tập trung tại xe, sắp xếp hành lý và các túi đặc sản, kiểm tra tư trang sẵn sàng cho chặng về.",
      transportAdvice: "Tập trung tại bãi đỗ xe trung tâm xã Tam Đảo.",
      travelMinutes: 5,
      highlightNote: "Kiểm tra hành lý và chuẩn bị xuống núi",
      estimatedCostPerPerson: 0,
      audioScript: "Đoàn tập trung tại xe, sắp xếp hành lý và các phần quà đặc sản vùng cao, kiểm tra tư trang chuẩn bị cho chặng đường về trung tâm thành phố Việt Trì.",
      audioScriptEn: "Gather at the vehicle, arrange luggage and local gifts, and prepare for the scenic return drive to Viet Tri.",
    },
    {
      period: "Chiều",
      timeSlot: "16:00 – 17:30",
      title: "Di chuyển Tam Đảo → Việt Trì (~75 km)",
      type: "travel",
      activity: "Xe khởi hành xuống đèo Tam Đảo, rẽ vào Quốc lộ 2B nối sang Quốc lộ 2, qua cầu Hạc Trì / cầu Việt Trì trở về trung tâm thành phố ngã ba sông.",
      transportAdvice: "Cự ly ~75 km (~1 giờ 30 phút). Đi xe êm ái, ngắm hoàng hôn rực rỡ buông xuống đôi bờ sông Hồng, sông Lô.",
      travelMinutes: 90,
      highlightNote: "Hành trình trở về an toàn và ngắm hoàng hôn đồng bằng Bắc Bộ",
      estimatedCostPerPerson: 0,
      audioScript: "Xe khởi hành xuống đèo Tam Đảo, rẽ vào Quốc lộ 2B nối sang Quốc lộ 2, qua cầu Hạc Trì trở về trung tâm thành phố ngã ba sông Việt Trì. Quý khách thư giãn ngắm hoàng hôn buông xuống đôi bờ sông Hồng và sông Lô thanh bình.",
      audioScriptEn: "Drive down the winding mountain pass along National Routes 2B and 2 back to Viet Tri city center, admiring the peaceful sunset over the Red and Lo rivers.",
    },
    {
      period: "Chiều",
      timeSlot: "~17:30",
      title: "Kết thúc hành trình tại Việt Trì",
      type: "visit",
      activity: "Đoàn về đến trung tâm thành phố Việt Trì an toàn. Hướng dẫn viên cảm ơn và chia tay quý khách, kết thúc chuyến du lịch 2 ngày 1 đêm 'Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo' thành công tốt đẹp, đầy ắp kỷ niệm đáng nhớ.",
      transportAdvice: "Kết thúc tour tại điểm đón ban đầu.",
      travelMinutes: 0,
      highlightNote: "Hoàn thành trọn vẹn hành trình Di Sản – Khoáng Nóng – Mây Núi",
      estimatedCostPerPerson: 0,
      audioScript: "Như vậy, hành trình du lịch 2 ngày 1 đêm đã khép lại với những trải nghiệm đáng nhớ: từ không gian linh thiêng của Đền Hùng, sự thư giãn tại suối khoáng nóng Thanh Thủy, cho đến vẻ đẹp mờ sương lãng mạn của Tam Đảo với Nhà thờ đá, Quảng trường trung tâm và Cổng Trời. Trợ lý du lịch Phú Thọ rất hân hạnh được đồng hành cùng bạn. Xin chào và hẹn gặp lại ở những chuyến đi tiếp theo!",
      audioScriptEn: "Our 2-day 1-night journey has concluded with unforgettable memories: from the sacred heritage of Hung Kings Temple, deep relaxation at Thanh Thuy radon mineral springs, to the romantic highland beauty of Tam Dao. It has been an honor accompanying you. Wishing you safe travels and see you again!",
    },
  ];

  const isEnLang = lang === "en";
  const isZhLang = lang === "zh";
  const isKoLang = lang === "ko";
  const isJaLang = lang === "ja";

  const day1DateLabel = isEnLang ? "Day 1" : isZhLang ? "第1天" : isKoLang ? "1일차" : isJaLang ? "1日目" : "Ngày 1";
  const day1Title = isEnLang
    ? "Day 1: Sacred Roots Pilgrimage to Hung Temple & Thanh Thuy Hot Springs"
    : isZhLang
    ? "第1天：雄王古庙朝圣之旅 & 清水天然温泉度假"
    : isKoLang
    ? "1일차: 훙왕 신전 근원 순례 & 탄투이 천연 온천 힐링"
    : isJaLang
    ? "1日目：フン王廟への巡礼＆タントゥイ天然ラドン温泉リゾート"
    : "Hành hương Cội Nguồn Đền Hùng & Nghỉ dưỡng Khoáng nóng Thanh Thủy";
  const day1Summary = isEnLang
    ? "Depart Viet Tri, visit Hung Kings Temple UNESCO heritage site, savor local fish specialties, check into 5-star Shoptel at Lynn Times Thanh Thuy, indulge in Japanese radon Onsen and Da River fish dinner."
    : isZhLang
    ? "从越池出发，瞻仰联合国教科文组织非遗雄王庙，品尝江兰餐厅特色河鲜，入住清水林奈温泉度假区五星级套房，体验稀有氡温泉与特色河鱼宴。"
    : isKoLang
    ? "비엣찌 출발, 유네스코 인류유산 훙왕 사원 참배, 강란 향토 생선 요리 오찬, 린타임스 탄투이 5성급 숍텔 체크인, 천연 라돈 온천욕 및 전통 만찬."
    : isJaLang
    ? "ヴィエッチー出発、ユネスコ無形文化遺産フン王廟巡礼、川魚料理の昼食、リンタイムズ・タントゥイ5つ星リゾート宿泊、天然ラドン温泉と名物ディナー。"
    : "Khởi hành từ trung tâm Việt Trì, ăn sáng Mai Anh, dâng hương tri ân công đức các Vua Hùng qua 4 đền linh thiêng và Bảo tàng Hùng Vương. Thưởng thức bữa trưa cá sông tại nhà hàng Giang Lan. Buổi chiều di chuyển về Lynn Times Thanh Thủy nhận phòng Shoptel 5 sao, ngâm khoáng Radon quý hiếm tại Ohayo Onsen, dạo phố đi bộ sinh thái và thưởng thức bữa tối Chả cá sông Đà & Tinh hoa Bắc Bộ.";

  const day2DateLabel = isEnLang ? "Day 2" : isZhLang ? "第2天" : isKoLang ? "2일차" : isJaLang ? "2日目" : "Ngày 2";
  const day2Title = isEnLang
    ? "Day 2: Highland Cloud Paradise Tam Dao & Return to Viet Tri"
    : isZhLang
    ? "第2天：云雾之城三岛漫游 & 启程返回越池"
    : isKoLang
    ? "2일차: 땀다오 운해의 낙원 탐방 & 비엣찌 귀환"
    : isJaLang
    ? "2日目：霧の高原タムダオ散策＆ヴィエッチー帰還"
    : "Thiên đường mây Tam Đảo & Trở về Việt Trì";
  const day2Summary = isEnLang
    ? "Morning pass drive to misty Tam Dao, Central Square, French stone church, chayote lunch, mountain cafe above the clouds, local market shopping and scenic drive back to Viet Tri."
    : isZhLang
    ? "穿越13公里蜿蜒山路前往避暑胜地三岛，游览中央广场与百年哥特式石教堂，品尝山珍佛手瓜，在云海咖啡馆俯瞰全景，逛特产集市后返回越池。"
    : isKoLang
    ? "구름 속 고원 마을 땀다오로 이동, 중앙 광장과 프랑스식 고딕 석조 성당 탐방, 차요테 순과 토종닭 오찬, 운해 전망 카페, 특산품 쇼핑 후 비엣찌 귀환."
    : isJaLang
    ? "霧深き避暑地タムダオへ。中央広場、1906年建造の石造り教会、名物ハヤトウリ料理、雲海を望む絶景カフェ、特産品市場を巡りヴィエッチーへ帰還。"
    : "Thưởng thức buffet sáng tại resort, vượt cung đèo mây lên xã Tam Đảo trong sương. Check-in Quảng trường trung tâm, chiêm ngưỡng Nhà thờ đá Gothic cổ kính, thưởng thức bữa trưa đặc sản rau su su và gà đồi tại nhà hàng Tam Đảo Núi. Thưởng thức cà phê ngắm biển mây tại Cổng Trời, dạo chợ mua quà đặc sản và trở về Việt Trì lúc chiều muộn.";

  const days: ItineraryDay[] = [
    {
      dayNumber: 1,
      dateLabel: day1DateLabel,
      dayTitle: day1Title,
      daySummary: day1Summary,
      slots: day1Slots,
      dayDistanceKm: 55,
      stayForNight: lynnTimesStay,
    },
    {
      dayNumber: 2,
      dateLabel: day2DateLabel,
      dayTitle: day2Title,
      daySummary: day2Summary,
      slots: day2Slots,
      dayDistanceKm: 140,
    },
  ];

  const totalCostPerPerson = 1630000;
  const travelers = 2;

  const itineraryTitle = isEnLang
    ? "Viet Tri – Hung King Temple – Thanh Thuy – Tam Dao (2D1N)"
    : isZhLang
    ? "越池 – 雄王庙 – 清水 – 三岛（2天1晚）"
    : isKoLang
    ? "비엣찌 – 훙왕 신전 – 탄투이 – 땀다오 (1박2일)"
    : isJaLang
    ? "ヴィエッチー – フン王廟 – タントゥイ – タムダオ（1泊2日）"
    : "Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo (2N1Đ)";

  const itinerarySubtitle = isEnLang
    ? "Standard Heritage Route: Ancestral Roots, Mineral Onsen & Misty Mountain Peaks"
    : isZhLang
    ? "标准经典行程：民族源头文化遗产、天然氡温泉与高山云海摄影"
    : isKoLang
    ? "공식 표준 일정: 민족의 시원 문화유산, 라돈 온천 휴양 & 땀다오 운해"
    : isJaLang
    ? "公式標準ツアー：祖先の地・世界遺産、天然ラドン温泉＆霧のタムダオ絶景"
    : "Lịch trình chuẩn theo tài liệu hồ sơ: Di sản Cội Nguồn, Khoáng nóng Onsen & Săn mây núi ngàn";

  const itineraryDurationLabel = isEnLang ? "2 days 1 night" : isZhLang ? "2天1晚" : isKoLang ? "1박 2일" : isJaLang ? "1泊2日" : "2 ngày 1 đêm";

  return {
    id: "plan-viet-tri-den-hung-thanh-thuy-tam-dao-2n1d",
    title: itineraryTitle,
    subtitle: itinerarySubtitle,
    targetDestination: "Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo",
    region: "Phú Thọ",
    durationDays: 2,
    durationLabel: itineraryDurationLabel,
    transport: "Ô tô riêng",
    style: "Di sản & Nghỉ dưỡng",
    travelers,
    totalDistanceKm: 195,
    totalDriveTime: "4 giờ 15 phút lái xe",
    estimatedCostPerPerson: totalCostPerPerson,
    totalCost: totalCostPerPerson * travelers,
    overviewNarrative: "Hành trình du lịch 2 ngày 1 đêm được thiết kế chuẩn xác theo tài liệu lịch trình: kết nối trọn vẹn di sản linh thiêng Đền Hùng, không gian nghỉ dưỡng khoáng nóng Radon 5 sao Lynn Times Thanh Thủy và vùng săn mây thơ mộng Tam Đảo. Lộ trình tối ưu từng khung giờ từ 07:30 sáng ngày 1 đến 17:30 chiều ngày 2, kết hợp hoàn hảo giữa tâm linh, ẩm thực đặc sản bản địa (cá sông Lô, chả cá sông Đà, ngọn su su Tam Đảo) và chăm sóc sức khỏe phục hồi sinh lực.",
    audioGuideScript: "Xin chào bạn! Tôi là Trợ lý Du lịch Đất Tổ. Hôm nay, tôi sẽ đồng hành cùng bạn trong hành trình 2 ngày 1 đêm khám phá Đất Tổ: khởi hành từ trung tâm Việt Trì, trở về cội nguồn dân tộc tại Quần thể di tích Đền Hùng, thư giãn tại khu nghỉ dưỡng khoáng nóng Lynn Times Thanh Thủy và kết thúc bằng một ngày khám phá Tam Đảo trong sương. Tại Đền Hùng, chúng ta bắt đầu từ Cổng chính xây năm 1917 với lời nhắc 'Cao sơn cảnh hành', bước lên Đền Hạ nơi Mẹ Âu Cơ sinh bọc trăm trứng khơi nguồn hai tiếng 'đồng bào', viếng Chùa Thiên Quang với cây vạn tuế 800 năm tuổi gắn dấu mốc ngày 19/9/1954 Bác Hồ về thăm. Vượt 159 bậc đá lên Đền Trung – Hùng Vương Tổ Miếu gắn với sự tích bánh chưng bánh giầy Lang Liêu, leo tiếp 100 bậc lên đỉnh Nghĩa Lĩnh viếng Đền Thượng Kính Thiên Lĩnh Điện – trung tâm Tín ngưỡng thờ cúng Hùng Vương được UNESCO vinh danh Di sản nhân loại, rồi xuống viếng Lăng Hùng Vương thứ sáu, Đền Giếng giếng cổ Ngọc Tỉnh và Bảo tàng Hùng Vương trên Đồi Công Quán. Sau bữa trưa đặc sản cá sông Lô tại Nhà hàng Giang Lan, đoàn xuôi dòng sông Đà về Lynn Times Thanh Thủy tận hưởng làn khoáng nóng Radon quý hiếm, dạo phố Nhật, ngắm hồ cá Koi và thưởng thức bữa tối Chả cá sông Đà trứ danh tại Nhà hàng Tinh Hoa Bắc Bộ. Ngày thứ hai, đoàn vượt cung đèo mây 13 km lên đỉnh Tam Đảo, dạo bước Quảng trường trung tâm, chiêm ngưỡng Nhà thờ đá Gothic xây từ năm 1906, thưởng thức bữa trưa ngọn su su và gà đồi tại Nhà hàng Tam Đảo Núi, nhâm nhi cà phê săn mây tại Tam Đảo Café trên Cổng Trời và dạo chợ mua đặc sản phố núi trước khi trở về Việt Trì trong sự thư thái trọn vẹn. Chúc bạn có một chuyến đi tuyệt vời!",
    audioGuideScriptEn: "Welcome! I am your Ancestral Land Travel Assistant. Today, I accompany you on our official 2-day 1-night journey: departing Viet Tri, returning to sacred roots at Hung Kings Temple, rejuvenating in radon hot mineral springs at Lynn Times Thanh Thuy, and concluding with a cloud-hunting day in misty Tam Dao. At Mount Nghia Linh, we start from the 1917 Main Gate, visit Ha Temple honoring Mother Au Co's hundred-egg sac, Thien Quang Pagoda with its 800-year-old cycad tree, ascend 159 steps to Trung Temple honoring Lang Liêu's cakes, and 100 steps to Thuong Temple atop the summit for UNESCO Ancestral Worship rites, followed by the 6th King's Mausoleum, Gieng Temple, and the Bronze Age museum. After lunch at Giang Lan Restaurant, we follow the Da River to Lynn Times Thanh Thuy for therapeutic radon Onsen bathing, Zen gardens, Koi ponds, and a dinner of sizzling Da River fish patties. On Day 2, we drive up the 13-km winding pass to misty Tam Dao, exploring the Central Square, French Gothic Stone Church, dining at Tam Dao Nui Restaurant, sipping clouds-view coffee at Cong Troi, and gathering local gifts before our scenic return to Viet Tri.",
    routeAdvice: "Cung đường di chuyển rất thuận lợi: TP. Việt Trì qua Đại lộ Hùng Vương tới Đền Hùng (~10 km) → theo ĐT317 ven sông Đà tới Thanh Thủy (~35 km) → qua cầu Đồng Quang / cầu Văn Lang kết nối Quốc lộ 2B vượt dốc đèo lên Tam Đảo (~65 km) → theo QL2B và QL2 trở về trung tâm Việt Trì (~75 km). Đoạn đèo Tam Đảo dài 13 km uốn lượn có cảnh quan rất đẹp, tài xế lưu ý giữ khoảng cách an toàn và đi số thấp.",
    cautionAdvice: "Khi tham quan Đền Hùng nên đi giày thể thao hoặc giày đế bệt êm chân do có nhiều bậc đá; trang phục lịch sự, kín đáo nơi đền miếu. Tại Lynn Times Thanh Thủy nên mang đồ bơi hoặc đồ tắm phù hợp để trải nghiệm Onsen trọn vẹn. Lên Tam Đảo nên mang theo áo khoác mỏng hoặc khăn choàng vì thời tiết se lạnh vào chiều tối.",
    days,
    googleMapsUrl: "https://www.google.com/maps/dir/TP.+Việt+Trì/Khu+di+tích+lịch+sử+Đền+Hùng/Lynn+Times+Thanh+Thủy/Tam+Đảo/TP.+Việt+Trì",
  };
}

