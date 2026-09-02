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
  routeAdvice: string;
  cautionAdvice: string;
  days: ItineraryDay[];
  googleMapsUrl: string;
};

export type PlannerOptions = {
  anchorPlaceId?: string;
  region?: string;
  durationDays: number;
  transport: string;
  budget: string;
  style: string;
  travelers: number;
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
    region,
    durationDays = 2,
    transport = "Ô tô riêng",
    budget = "Tiêu chuẩn",
    style = "Văn hóa & cội nguồn",
    travelers = 2,
  } = options;

  // 1. Tìm điểm neo khởi đầu
  let anchor = places.find((p) => p.id === anchorPlaceId);
  if (!anchor) {
    if (region && region !== "Tất cả") {
      anchor = places.find((p) => p.region === region) || places[0];
    } else {
      anchor = places[0]; // Default Đền Hùng
    }
  }

  // 2. Gom cụm các điểm đến phù hợp theo cự ly và chủ đề
  const otherPlaces = places.filter((p) => p.id !== anchor!.id);
  // Sắp xếp các điểm còn lại theo cự ly tới điểm neo hoặc liên vùng nếu đi 3-4 ngày
  const sortedNearby = [...otherPlaces].sort((a, b) => {
    const distA = haversineDistance(anchor!.lat, anchor!.lng, a.lat, a.lng);
    const distB = haversineDistance(anchor!.lat, anchor!.lng, b.lat, b.lng);
    // Nếu cùng vùng ưu tiên trước
    if (a.region === anchor!.region && b.region !== anchor!.region) return -1;
    if (b.region === anchor!.region && a.region !== anchor!.region) return 1;
    return distA - distB;
  });

  // Chọn danh sách điểm dừng: mỗi ngày 2 điểm tham quan chính
  const chosenPlaces: Place[] = [anchor];
  const neededStops = Math.min(durationDays * 2, places.length);
  for (const candidate of sortedNearby) {
    if (chosenPlaces.length >= neededStops) break;
    chosenPlaces.push(candidate);
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

    const slots: ItinerarySlot[] = [
      // BUỔI SÁNG
      {
        period: "Sáng",
        timeSlot: "07:30 – 11:30",
        title: `Khởi hành & Khám phá ${morningPlace.shortName}`,
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
        title: `Thưởng thức ẩm thực tại ${lunchRestaurant.name}`,
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
        title: `Trải nghiệm & Check-in ${afternoonPlace.shortName}`,
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
        title: isLastDay
          ? `Bữa tối đặc sản tại ${dinnerRestaurant.name} & Kết thúc tour`
          : `Ăn tối đặc sản & Nghỉ đêm tại ${nightStay?.name || afternoonPlace.shortName}`,
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

    days.push({
      dayNumber: dayNum,
      dateLabel: `Ngày ${dayNum}`,
      dayTitle: `Khám phá ${morningPlace.shortName} – ${afternoonPlace.shortName}`,
      daySummary: `${morningPlace.highlights[0]} kết hợp trải nghiệm ẩm thực và danh thắng ${afternoonPlace.shortName}.`,
      slots,
      dayDistanceKm: dayDistance,
      stayForNight: nightStay,
    });
  }

  // Ước tính chi phí
  const baseCostPerPerson =
    budget === "Tiết kiệm"
      ? durationDays * 550000
      : budget === "Cao cấp"
      ? durationDays * 1600000
      : durationDays * 950000;

  const totalCost = baseCostPerPerson * travelers;

  // Lời thoại hướng dẫn viên ảo
  const audioGuideScript = `Kính chào quý khách! Tôi là hướng dẫn viên ảo của Du lịch Đất Tổ Phú Thọ mở rộng. Tôi rất vinh hạnh đồng hành cùng quý khách trong hành trình ${durationDays} ngày khám phá ${anchor.name} và các danh thắng lân cận. Trong suốt chuyến đi, chúng ta sẽ lần lượt chiêm ngưỡng cảnh quan thiên nhiên hùng vĩ, thưởng thức trọn vẹn các món ăn đặc sản nức tiếng và trải nghiệm những nét văn hóa ngàn đời. Chúc quý khách một chuyến đi an toàn, ngập tràn niềm vui và những bức ảnh kỷ niệm tuyệt đẹp!`;

  const overviewNarrative = `Hành trình ${durationDays} ngày ${durationDays > 1 ? `${durationDays - 1} đêm` : "(trong ngày)"} được thiết kế tối ưu hóa lộ trình di chuyển bằng ${transport}, kết nối những tinh hoa đặc sắc nhất của ${anchor.region}: từ di sản tâm linh, cảnh quan mây núi đến ẩm thực đặc sản bản địa. Lịch trình phân bổ nhịp nhàng giữa thời gian tham quan, thưởng thức ẩm thực và nghỉ ngơi tái tạo năng lượng.`;

  // Tạo Google Maps URL đa điểm
  const allStops = chosenPlaces.map((p) => `${p.lat},${p.lng}`);
  const googleMapsUrl = `https://www.google.com/maps/dir/${allStops.join("/")}`;

  // Thời gian di chuyển định dạng
  const hoursDrive = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  const totalDriveTime = `${hoursDrive > 0 ? `${hoursDrive} giờ ` : ""}${remMinutes} phút lái xe`;

  return {
    id: `plan-${Date.now()}`,
    title: `Hành trình ${durationDays}N${durationDays > 1 ? `${durationDays - 1}Đ` : ""}: Khám phá ${anchor.shortName}`,
    subtitle: `${anchor.region} · Phương tiện ${transport} · ${style}`,
    targetDestination: anchor.name,
    region: anchor.region,
    durationDays,
    durationLabel: `${durationDays} ngày ${durationDays > 1 ? `${durationDays - 1} đêm` : "(trong ngày)"}`,
    transport,
    style,
    travelers,
    totalDistanceKm,
    totalDriveTime,
    estimatedCostPerPerson: baseCostPerPerson,
    totalCost,
    overviewNarrative,
    audioGuideScript,
    routeAdvice: anchor.transportTips?.routeAdvice || "Cung đường liên huyện và cao tốc bằng phẳng, dễ di chuyển.",
    cautionAdvice: anchor.warning || "Chú ý theo dõi thời tiết và chuẩn bị trang phục phù hợp với từng điểm đến.",
    days,
    googleMapsUrl,
  };
}
