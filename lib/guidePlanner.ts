import { places, type NearbyItem, type Place } from "@/data/travel";

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
    highlights: ["Thị trấn sương mù Tam Đảo (khí hậu 4 mùa)", "Quần thể Di tích & Danh thắng Tây Thiên (cáp treo, Thiền viện)"],
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
    bestRoutes: "Từ Hà Nội theo QL6 qua thị trấn Xuân Mai tới ngã ba Bãi Chạo (Lương Sơn), rẽ vào đường ATK Bãi Chạo chạy thẳng vào thung lũng khoáng nóng.",
    highlights: ["Suối khoáng nóng tự nhiên Kim Bôi (36°C giàu khoáng chất)", "Serena Resort Kim Bôi"],
    signatureFoods: ["Gà đồi nướng mọi", "Măng đắng xào thịt bò", "Rau rừng đồ chấm lòng cá"],
  },
  "Huyện Cao Phong": {
    district: "Huyện Cao Phong",
    region: "Hòa Bình",
    distanceFromHanoi: "88 km",
    travelTime: "2 giờ",
    recommendedTransport: "Ô tô riêng / Xe du lịch",
    bestRoutes: "Từ Hà Nội đi cao tốc Hòa Lạc - Hòa Bình, qua TP. Hòa Bình theo QL6 chừng 12km tới thị trấn Cao Phong, rẽ vào bến cảng Thung Nai.",
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
    transport = "Ô tô riêng",
    budget = "Tiêu chuẩn",
    style = "Văn hóa & cội nguồn",
    travelers = 2,
    lang = "vi",
  } = options;

  // 1. Xác định danh sách các điểm được người dùng ưu tiên ghép
  const userChosenPlaces: Place[] = [];
  if (selectedPlaceIds.length > 0) {
    for (const pid of selectedPlaceIds) {
      const found = places.find((p) => p.id === pid);
      if (found && !userChosenPlaces.some((cp) => cp.id === found.id)) {
        userChosenPlaces.push(found);
      }
    }
  }

  // Nếu không chọn mảng điểm, tìm điểm neo khởi đầu
  let anchor = userChosenPlaces[0] || places.find((p) => p.id === anchorPlaceId);
  if (!anchor) {
    if (district) {
      anchor = places.find((p) => p.district === district) || places[0];
    } else if (region && region !== "Tất cả") {
      anchor = places.find((p) => p.region === region) || places[0];
    } else {
      anchor = places[0]; // Default Đền Hùng
    }
  }

  // 2. Gom cụm các điểm đến phù hợp theo cự ly và chủ đề
  const neededStops = Math.max(durationDays * 2, userChosenPlaces.length);
  const chosenPlaces: Place[] = [...userChosenPlaces];

  if (!chosenPlaces.some((p) => p.id === anchor.id)) {
    chosenPlaces.unshift(anchor);
  }

  // Nếu vẫn chưa đủ điểm cho số ngày, tự động bổ sung các điểm lân cận
  if (chosenPlaces.length < neededStops) {
    const existingIds = new Set(chosenPlaces.map((p) => p.id));
    const pool = places.filter((p) => !existingIds.has(p.id));

    // Ưu tiên cùng huyện trước, sau đó cùng vùng, sau đó theo cự ly
    pool.sort((a, b) => {
      const lastPlace = chosenPlaces[chosenPlaces.length - 1] || anchor;
      if (district && a.district === district && b.district !== district) return -1;
      if (district && b.district === district && a.district !== district) return 1;
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

  // Lời thoại hướng dẫn viên ảo (Tiếng Việt & English)
  const audioGuideScript = `Chào mừng quý khách đến với hành trình du lịch ${anchor.shortName} và vùng đất cội nguồn Phú Thọ – Vĩnh Phúc – Hòa Bình. Tôi là trợ lý hướng dẫn viên số, rất vui được đồng hành cùng quý khách trong chuyến đi ${durationDays} ngày này. Lịch trình đã được tối ưu cân đối giữa thời gian tham quan, thưởng thức ẩm thực đặc sản và nghỉ dưỡng phục hồi sức khỏe. Kính chúc quý khách một chuyến đi trọn vẹn, an toàn và nhiều trải nghiệm đáng nhớ!`;

  const audioGuideScriptEn = `Welcome to your journey exploring ${anchor.shortName} and the northern cultural heritage of Phu Tho, Vinh Phuc, and Hoa Binh. I am your digital tour guide, delighted to accompany you on this ${durationDays}-day trip. This itinerary is carefully optimized for sightseeing, authentic regional gastronomy, and relaxing stays. Wishing you a wonderful, safe, and memorable trip in Vietnam!`;

  const overviewNarrative = `Hành trình ${durationDays} ngày ${durationDays > 1 ? `${durationDays - 1} đêm` : "(trong ngày)"} được thiết kế tối ưu hóa lộ trình di chuyển bằng ${transport}, kết nối những tinh hoa đặc sắc nhất của ${anchor.region}: từ di sản tâm linh, cảnh quan mây núi đến ẩm thực đặc sản bản địa. Lịch trình phân bổ nhịp nhàng giữa thời gian tham quan, thưởng thức ẩm thực và nghỉ ngơi tái tạo năng lượng.`;

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

  const districtGuide = district && DISTRICT_TRAVEL_GUIDES[district] ? DISTRICT_TRAVEL_GUIDES[district] : null;

  const shortDn = (() => {
    if (lang === "en") return durationDays > 1 ? `${durationDays}D${durationDays - 1}N` : "1-Day";
    if (lang === "zh") return durationDays > 1 ? `${durationDays}天${durationDays - 1}晚` : "1日";
    if (lang === "ko") return durationDays > 1 ? `${durationDays - 1}박${durationDays}일` : "당일";
    if (lang === "ja") return durationDays > 1 ? `${durationDays - 1}泊${durationDays}日` : "日帰り";
    return `${durationDays}N${durationDays > 1 ? `${durationDays - 1}Đ` : ""}`;
  })();

  let displayTitle = "";
  if (userChosenPlaces.length > 1) {
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

  const defaultRouteAdvice = districtGuide
    ? `${districtGuide.bestRoutes} (Cự ly ~${districtGuide.distanceFromHanoi}, thời gian ~${districtGuide.travelTime}).`
    : (anchor.transportTips?.routeAdvice || "Cung đường liên huyện và cao tốc bằng phẳng, dễ di chuyển.");

  const displaySubtitle = (() => {
    if (lang === "en") return `${district ? `${district} · ` : ""}${anchor.region} · Transport: ${transport} · ${style}`;
    if (lang === "zh") return `${district ? `${district} · ` : ""}${anchor.region} · 交通：${transport} · ${style}`;
    if (lang === "ko") return `${district ? `${district} · ` : ""}${anchor.region} · 이동: ${transport} · ${style}`;
    if (lang === "ja") return `${district ? `${district} · ` : ""}${anchor.region} · 移動手段：${transport} · ${style}`;
    return `${district ? `${district} · ` : ""}${anchor.region} · Phương tiện ${transport} · ${style}`;
  })();

  const dNLabel = (() => {
    if (lang === "en") return durationDays > 1 ? `${durationDays} days ${durationDays - 1} nights` : "1 day (Day trip)";
    if (lang === "zh") return durationDays > 1 ? `${durationDays}天${durationDays - 1}晚` : "1日游（当天往返）";
    if (lang === "ko") return durationDays > 1 ? `${durationDays - 1}박 ${durationDays}일` : "당일치기";
    if (lang === "ja") return durationDays > 1 ? `${durationDays - 1}泊${durationDays}日` : "日帰り";
    return `${durationDays} ngày ${durationDays > 1 ? `${durationDays - 1} đêm` : "(trong ngày)"}`;
  })();

  return {
    id: `plan-${Date.now()}`,
    title: displayTitle,
    subtitle: displaySubtitle,
    targetDestination: userChosenPlaces.length > 1 ? userChosenPlaces.map(p => p.shortName).join(", ") : anchor.name,
    region: userChosenPlaces.length > 1 ? "Liên tuyến đa điểm" : anchor.region,
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
    cautionAdvice: anchor.warning || "Chú ý theo dõi thời tiết và chuẩn bị trang phục phù hợp với từng điểm đến.",
    days,
    googleMapsUrl,
  };
}
