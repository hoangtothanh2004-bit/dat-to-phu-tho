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
  place?: Place;
  restaurant?: NearbyItem;
  stay?: NearbyItem;
  activity: string;
  transportAdvice: string;
  travelMinutes: number;
  highlightNote: string;
  estimatedCostPerPerson: number;
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
export function getOfficialDocxItinerary(): GeneratedItinerary {
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
      title: "Xuất phát từ trung tâm TP. Việt Trì",
      type: "travel",
      activity: "Đoàn tập trung tại trung tâm thành phố Việt Trì, khởi hành hướng về Khu di tích lịch sử Quốc gia đặc biệt Đền Hùng.",
      transportAdvice: "Di chuyển theo Đại lộ Hùng Vương / Quốc lộ 2 thẳng tới xã Hy Cương (~10 km, thời gian lái xe khoảng 15 phút). Đường đô thị rộng thoáng, biển chỉ dẫn rõ ràng.",
      travelMinutes: 15,
      highlightNote: "Khởi hành hành trình Cội Nguồn Đất Tổ",
      estimatedCostPerPerson: 0,
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
        address: "Đường Hùng Vương, xã Hy Cương, TP. Việt Trì, Tỉnh Phú Thọ",
        hours: "06:00 – 21:00",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        taste: "Bún bò, phở cội nguồn thơm ngọt đậm đà",
      },
      activity: "Thưởng thức bữa sáng nóng sốt, chuẩn bị thể lực dồi dào trước khi bước vào hành trình leo núi viếng Đền Hùng.",
      transportAdvice: "Nằm ngay mặt đường Hùng Vương giáp quần thể di tích, sân đỗ xe rộng rãi.",
      travelMinutes: 5,
      highlightNote: "Nạp năng lượng chuẩn bị leo núi Nghĩa Lĩnh (40.000–60.000đ/người)",
      estimatedCostPerPerson: 50000,
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
        address: "Khu 1, xã Hy Cương, TP. Việt Trì, Tỉnh Phú Thọ",
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
    },
    {
      period: "Chiều",
      timeSlot: "16:00 – 17:30",
      title: "Di chuyển Tam Đảo → TP. Việt Trì (~75 km)",
      type: "travel",
      activity: "Xe khởi hành xuống đèo Tam Đảo, rẽ vào Quốc lộ 2B nối sang Quốc lộ 2, qua cầu Hạc Trì / cầu Việt Trì trở về trung tâm thành phố ngã ba sông.",
      transportAdvice: "Cự ly ~75 km (~1 giờ 30 phút). Đi xe êm ái, ngắm hoàng hôn rực rỡ buông xuống đôi bờ sông Hồng, sông Lô.",
      travelMinutes: 90,
      highlightNote: "Hành trình trở về an toàn và ngắm hoàng hôn đồng bằng Bắc Bộ",
      estimatedCostPerPerson: 0,
    },
    {
      period: "Chiều",
      timeSlot: "~17:30",
      title: "Kết thúc hành trình tại TP. Việt Trì",
      type: "visit",
      activity: "Đoàn về đến trung tâm thành phố Việt Trì an toàn. Hướng dẫn viên cảm ơn và chia tay quý khách, kết thúc chuyến du lịch 2 ngày 1 đêm 'Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo' thành công tốt đẹp, đầy ắp kỷ niệm đáng nhớ.",
      transportAdvice: "Kết thúc tour tại điểm đón ban đầu.",
      travelMinutes: 0,
      highlightNote: "Hoàn thành trọn vẹn hành trình Di Sản – Khoáng Nóng – Mây Núi",
      estimatedCostPerPerson: 0,
    },
  ];

  const days: ItineraryDay[] = [
    {
      dayNumber: 1,
      dateLabel: "Ngày 1",
      dayTitle: "Hành hương Cội Nguồn Đền Hùng & Nghỉ dưỡng Khoáng nóng Thanh Thủy",
      daySummary: "Khởi hành từ trung tâm Việt Trì, ăn sáng Mai Anh, dâng hương tri ân công đức các Vua Hùng qua 4 đền linh thiêng và Bảo tàng Hùng Vương. Thưởng thức bữa trưa cá sông tại nhà hàng Giang Lan. Buổi chiều di chuyển về Lynn Times Thanh Thủy nhận phòng Shoptel 5 sao, ngâm khoáng Radon quý hiếm tại Ohayo Onsen, dạo phố đi bộ sinh thái và thưởng thức bữa tối Chả cá sông Đà & Tinh hoa Bắc Bộ.",
      slots: day1Slots,
      dayDistanceKm: 55,
      stayForNight: lynnTimesStay,
    },
    {
      dayNumber: 2,
      dateLabel: "Ngày 2",
      dayTitle: "Thiên đường mây Tam Đảo & Trở về TP. Việt Trì",
      daySummary: "Thưởng thức buffet sáng tại resort, vượt cung đèo mây lên xã Tam Đảo trong sương. Check-in Quảng trường trung tâm, chiêm ngưỡng Nhà thờ đá Gothic cổ kính, thưởng thức bữa trưa đặc sản rau su su và gà đồi tại nhà hàng Tam Đảo Núi. Thưởng thức cà phê ngắm biển mây tại Cổng Trời, dạo chợ mua quà đặc sản và trở về Việt Trì lúc chiều muộn.",
      slots: day2Slots,
      dayDistanceKm: 140,
    },
  ];

  const totalCostPerPerson = 1630000;
  const travelers = 2;

  return {
    id: "plan-viet-tri-den-hung-thanh-thuy-tam-dao-2n1d",
    title: "Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo (2N1Đ)",
    subtitle: "Lịch trình chuẩn theo tài liệu hồ sơ: Di sản Cội Nguồn, Khoáng nóng Onsen & Săn mây núi ngàn",
    targetDestination: "Việt Trì – Đền Hùng – Thanh Thủy – Tam Đảo",
    region: "Phú Thọ",
    durationDays: 2,
    durationLabel: "2 ngày 1 đêm",
    transport: "Ô tô riêng",
    style: "Di sản & Nghỉ dưỡng",
    travelers,
    totalDistanceKm: 195,
    totalDriveTime: "4 giờ 15 phút lái xe",
    estimatedCostPerPerson: totalCostPerPerson,
    totalCost: totalCostPerPerson * travelers,
    overviewNarrative: "Hành trình du lịch 2 ngày 1 đêm được thiết kế chuẩn xác theo tài liệu lịch trình: kết nối trọn vẹn di sản linh thiêng Đền Hùng, không gian nghỉ dưỡng khoáng nóng Radon 5 sao Lynn Times Thanh Thủy và vùng săn mây thơ mộng Tam Đảo. Lộ trình tối ưu từng khung giờ từ 07:30 sáng ngày 1 đến 17:30 chiều ngày 2, kết hợp hoàn hảo giữa tâm linh, ẩm thực đặc sản bản địa (cá sông Lô, chả cá sông Đà, ngọn su su Tam Đảo) và chăm sóc sức khỏe phục hồi sinh lực.",
    audioGuideScript: "Kính chào quý khách! Chào mừng quý khách đến với hành trình du lịch 2 ngày 1 đêm kết nối Đất Tổ Hùng Vương linh thiêng, thiên đường khoáng nóng Thanh Thủy và vùng mây mù Tam Đảo. Ngày đầu tiên, chúng ta khởi hành từ thành phố ngã ba sông Việt Trì, thưởng thức bữa sáng tại nhà hàng Mai Anh trước khi thành kính dâng hương qua Đền Hạ, Đền Trung, Đền Thượng và Đền Giếng trên đỉnh Nghĩa Lĩnh hùng vĩ. Buổi trưa, đoàn thưởng thức ẩm thực sông Lô tại nhà hàng Giang Lan, sau đó xuôi theo dòng sông Đà về nhận phòng nghỉ dưỡng Shoptel 5 sao tại Lynn Times Thanh Thủy. Quý khách sẽ được đắm mình trong dòng khoáng nóng Radon quý hiếm tại Ohayo Onsen, dạo bước ngắm hồ cá Koi và thưởng thức bữa tối Chả cá sông Đà trứ danh. Sang ngày thứ hai, sau bữa sáng buffet phong phú, đoàn sẽ vượt cung đèo mây lên đỉnh Tam Đảo, check-in Nhà thờ đá cổ, Quảng trường trung tâm, thưởng thức mâm cơm ngọn su su xanh giòn tại nhà hàng Tam Đảo Núi và nhâm nhi cà phê ngắm toàn cảnh thung lũng mây tại Cổng Trời trước khi trở về Việt Trì trong sự thư thái trọn vẹn.",
    audioGuideScriptEn: "Welcome to the official 2-day 1-night journey connecting ancestral heritage, radon hot spring wellness, and cloudy mountain retreat: Viet Tri – Hung Kings Temple – Lynn Times Thanh Thuy – Tam Dao. On Day 1, depart from Viet Tri city center, enjoy breakfast at Mai Anh Restaurant, and ascend Mount Nghia Linh to pay homage at Lower, Middle, Upper, and Well Temples, followed by the Hung Kings Museum. Savor local river fish specialties at Giang Lan Restaurant, then travel along the Da River to check into 5-star Shoptel at Lynn Times Thanh Thuy. Immerse yourself in rare natural radon mineral waters at Ohayo Onsen, stroll along scenic walking streets, and enjoy a dinner of Da River grilled fish patties. On Day 2, savor an international breakfast buffet before driving through pine-clad winding passes up to misty Tam Dao. Capture memories at the Central Square and French Gothic Stone Church, indulge in fresh chayote shoots and hill chicken at Tam Dao Nui Restaurant, and relax with panoramic cloud-view coffee at Cong Troi before a safe scenic return to Viet Tri by late afternoon.",
    routeAdvice: "Cung đường di chuyển rất thuận lợi: TP. Việt Trì qua Đại lộ Hùng Vương tới Đền Hùng (~10 km) → theo ĐT317 ven sông Đà tới Thanh Thủy (~35 km) → qua cầu Đồng Quang / cầu Văn Lang kết nối Quốc lộ 2B vượt dốc đèo lên Tam Đảo (~65 km) → theo QL2B và QL2 trở về trung tâm Việt Trì (~75 km). Đoạn đèo Tam Đảo dài 13 km uốn lượn có cảnh quan rất đẹp, tài xế lưu ý giữ khoảng cách an toàn và đi số thấp.",
    cautionAdvice: "Khi tham quan Đền Hùng nên đi giày thể thao hoặc giày đế bệt êm chân do có nhiều bậc đá; trang phục lịch sự, kín đáo nơi đền miếu. Tại Lynn Times Thanh Thủy nên mang đồ bơi hoặc đồ tắm phù hợp để trải nghiệm Onsen trọn vẹn. Lên Tam Đảo nên mang theo áo khoác mỏng hoặc khăn choàng vì thời tiết se lạnh vào chiều tối.",
    days,
    googleMapsUrl: "https://www.google.com/maps/dir/TP.+Việt+Trì/Khu+di+tích+lịch+sử+Đền+Hùng/Lynn+Times+Thanh+Thủy/Tam+Đảo/TP.+Việt+Trì",
  };
}

