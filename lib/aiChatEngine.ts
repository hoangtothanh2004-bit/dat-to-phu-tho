import { places, type Place, foodRegions } from "@/data/travel";
import { buildItinerary, type GeneratedItinerary } from "./guidePlanner";

export type AiSurveyState = {
  destinationText: string;
  anchorPlaceId: string;
  selectedPlaceIds: string[];
  district?: string;
  region?: string;
  durationDays?: number;
  travelers?: number;
  transport?: string;
  budget?: string;
  style?: string;
};

export type AiResponseResult = {
  text: string;
  options?: Array<{ label: string; value: string; icon?: string }>;
  itinerary?: GeneratedItinerary;
  updatedSurvey: AiSurveyState;
  isCompleted?: boolean;
};

// Known destination keywords and mappings to real place IDs in website database
const DESTINATION_MAPPINGS: Array<{
  keywords: string[];
  placeId: string;
  name: string;
  region: string;
  district?: string;
  desc: string;
}> = [
  {
    keywords: ["thanh sơn", "thanh son", "huyện thanh sơn", "huyen thanh son", "thịt chua thanh sơn", "thit chua thanh son", "thác chòi"],
    placeId: "long-coc",
    name: "Huyện Thanh Sơn & Tân Sơn (Đặc sản Thịt chua & Đồi chè Long Cốc)",
    region: "Phú Thọ",
    district: "Huyện Thanh Sơn",
    desc: "Cái nôi văn hóa Mường Đất Tổ và thủ phủ đặc sản Thịt chua trứ danh (Nghị Thịnh / Điệp Đào), cửa ngõ khám phá đồi chè bát úp Long Cốc và rừng nguyên sinh Xuân Sơn.",
  },
  {
    keywords: ["tân sơn", "tan son", "huyện tân sơn", "huyen tan son"],
    placeId: "long-coc",
    name: "Huyện Tân Sơn (Đồi chè Long Cốc & VQG Xuân Sơn)",
    region: "Phú Thọ",
    district: "Huyện Tân Sơn",
    desc: "Thiên đường sinh thái với ốc đảo chè Long Cốc bồng bềnh mây sớm và Vườn quốc gia Xuân Sơn với hệ thống hang động kỳ vĩ.",
  },
  {
    keywords: ["đoan hùng", "doan hung", "huyện đoan hùng", "bưởi đoan hùng"],
    placeId: "den-hung",
    name: "Huyện Đoan Hùng (Vùng đất bưởi tiến Vua)",
    region: "Phú Thọ",
    district: "Huyện Đoan Hùng",
    desc: "Vùng đất trù phú ngã ba sông Lô, nổi tiếng với di tích Chiến thắng Sông Lô và giống bưởi Sửu, bưởi Bằng Luân thơm ngọt tiến Vua.",
  },
  {
    keywords: ["lâm thao", "lam thao", "huyện lâm thao", "làng chu quyến"],
    placeId: "den-hung",
    name: "Huyện Lâm Thao (Đất học & Làng cổ)",
    region: "Phú Thọ",
    district: "Huyện Lâm Thao",
    desc: "Vùng đất phù sa cổ ven sông Hồng, gắn liền với di tích khảo cổ Sơn Vi và các làng nghề bánh làng Dòng truyền thống.",
  },
  {
    keywords: ["phù ninh", "phu ninh", "huyện phù ninh"],
    placeId: "den-hung",
    name: "Huyện Phù Ninh",
    region: "Phú Thọ",
    district: "Huyện Phù Ninh",
    desc: "Cửa ngõ Đất Tổ với đồi chè xanh mướt và hội chọi trâu Phù Ninh cổ xưa.",
  },
  {
    keywords: ["cẩm khê", "cam khe", "huyện cẩm khê"],
    placeId: "dam-ao-chau",
    name: "Huyện Cẩm Khê",
    region: "Phú Thọ",
    district: "Huyện Cẩm Khê",
    desc: "Vùng đất đồng chiêm trù phú với nghề làm nón lá Sai Nga truyền thống và đầm sen ngát hương.",
  },
  {
    keywords: ["tam nông", "tam nong", "huyện tam nông"],
    placeId: "thanh-thuy",
    name: "Huyện Tam Nông",
    region: "Phú Thọ",
    district: "Huyện Tam Nông",
    desc: "Vùng đất nằm bên ngã ba sông Đà và sông Hồng, nổi tiếng với Khu nghỉ dưỡng Vườn Vua Resort & Villas.",
  },
  {
    keywords: ["yên lập", "yen lap", "huyện yên lập"],
    placeId: "xuan-son",
    name: "Huyện Yên Lập",
    region: "Phú Thọ",
    district: "Huyện Yên Lập",
    desc: "Vùng cao nguyên sơ với hồ Ly thanh bình và nét văn hóa độc đáo của đồng bào Mường, Dao.",
  },
  {
    keywords: ["thanh ba", "thanh ba", "huyện thanh ba"],
    placeId: "dam-ao-chau",
    name: "Huyện Thanh Ba",
    region: "Phú Thọ",
    district: "Huyện Thanh Ba",
    desc: "Vùng đồi búp chè xanh ngát và hồ Láng Cẩm phẳng lặng giữa trung du.",
  },
  {
    keywords: ["phú thọ", "phu tho", "tỉnh phú thọ", "đất tổ", "dat to"],
    placeId: "den-hung",
    name: "Du lịch Phú Thọ (Đất Tổ Hùng Vương)",
    region: "Phú Thọ",
    district: "Việt Trì",
    desc: "Cội nguồn ngàn năm dân tộc Việt Nam, kết nối Đền Hùng linh thiêng, Đồi chè Long Cốc, Suối khoáng Thanh Thủy và VQG Xuân Sơn.",
  },
  {
    keywords: ["tam đảo", "tam dao", "nhà thờ đá tam đảo", "thác bạc tam đảo", "quán gió", "cầu mây"],
    placeId: "tam-dao",
    name: "Khu du lịch Quốc gia Tam Đảo",
    region: "Vĩnh Phúc",
    district: "Tam Đảo",
    desc: "Thị trấn bồng bềnh mây ngàn trên độ cao 900m, khí hậu 4 mùa trong một ngày, nổi tiếng với Nhà thờ Đá, Thác Bạc, Cầu Mây và đặc sản ngọn su su xào tỏi.",
  },
  {
    keywords: ["tây thiên", "tay thien", "thiền viện trúc lâm", "đại bảo tháp"],
    placeId: "tay-thien",
    name: "Quần thể Di tích & Danh thắng Tây Thiên",
    region: "Vĩnh Phúc",
    district: "Tam Đảo",
    desc: "Vùng đất thiêng cội nguồn Phật giáo và Mẫu Tây Thiên ngự giữa rừng thông thanh tịnh dãy Tam Đảo.",
  },
  {
    keywords: ["đại lải", "dai lai", "hồ đại lải", "flamingo"],
    placeId: "ho-dai-lai",
    name: "Khu du lịch sinh thái Hồ Đại Lải",
    region: "Vĩnh Phúc",
    district: "Phúc Yên",
    desc: "Mặt hồ phẳng lặng hơn 500 ha bao quanh bởi rừng thông xanh biếc, thiên đường nghỉ dưỡng và thể thao nước.",
  },
  {
    keywords: ["đền hùng", "den hung", "vua hùng", "nghĩa lĩnh", "việt trì", "viet tri"],
    placeId: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    region: "Phú Thọ",
    district: "TP. Việt Trì",
    desc: "Không gian thiêng liêng cội nguồn dân tộc Việt Nam trên đỉnh Nghĩa Lĩnh huyền thoại, nơi hội tụ hồn thiêng sông núi.",
  },
  {
    keywords: ["long cốc", "long coc", "đồi chè", "doi che", "ốc đảo chè", "săn mây long cốc"],
    placeId: "long-coc",
    name: "Đồi chè Long Cốc",
    region: "Phú Thọ",
    district: "Huyện Tân Sơn",
    desc: "Ốc đảo chè đẹp nhất Việt Nam với hàng trăm quả đồi bát úp nhấp nhô giữa làn sương sớm bồng bềnh.",
  },
  {
    keywords: ["xuân sơn", "xuan son", "vườn quốc gia", "hang lạng", "bản cỏi", "gà nhiều cựa"],
    placeId: "xuan-son",
    name: "Vườn quốc gia Xuân Sơn",
    region: "Phú Thọ",
    district: "Huyện Tân Sơn",
    desc: "Lá phổi xanh ngút ngàn với hệ sinh thái rừng nhiệt đới trên núi đá vôi nguyên sinh, suối trong vắt và hang động kỳ vĩ.",
  },
  {
    keywords: ["thanh thủy", "thanh thuy", "khoáng nóng", "khoang nong", "onsen", "wyndham", "bamboo", "tre nguồn", "đảo ngọc xanh"],
    placeId: "thanh-thuy",
    name: "Suối khoáng nóng Thanh Thủy",
    region: "Phú Thọ",
    district: "Huyện Thanh Thủy",
    desc: "Nguồn nước khoáng Radon quý hiếm tự nhiên tốt cho sức khỏe, trung tâm nghỉ dưỡng Onsen chuẩn Nhật và vui chơi sinh thái ven sông Đà.",
  },
  {
    keywords: ["hùng lô", "hung lo", "làng cổ", "đình cổ", "hát xoan"],
    placeId: "hung-lo",
    name: "Làng cổ & Đình cổ Hùng Lô",
    region: "Phú Thọ",
    district: "TP. Việt Trì",
    desc: "Quần thể kiến trúc cổ kính hơn 300 năm tuổi và cái nôi di sản Hát Xoan Phú Thọ được UNESCO vinh danh.",
  },
  {
    keywords: ["âu cơ", "au co", "đền mẫu", "den mau au co", "hạ hòa", "ha hoa"],
    placeId: "den-mau-au-co",
    name: "Đền Mẫu Âu Cơ Hạ Hòa",
    region: "Phú Thọ",
    district: "Huyện Hạ Hòa",
    desc: "Nơi phụng thờ Quốc Mẫu Âu Cơ sinh ra bọc trăm trứng, gắn liền với huyền tích cội nguồn giống nòi tiên rồng.",
  },
  {
    keywords: ["ao châu", "ao chau", "đầm ao châu"],
    placeId: "dam-ao-chau",
    name: "Khu du lịch sinh thái Đầm Ao Châu",
    region: "Phú Thọ",
    district: "Huyện Hạ Hòa",
    desc: "Vịnh Hạ Long thu nhỏ giữa vùng trung du với 99 ngách nước len lỏi qua các đồi chè, đồi cọ trù phú.",
  },
  {
    keywords: ["mai châu", "mai chau", "bản lác", "ban lac", "thung khe", "đá trắng"],
    placeId: "ban-lac-mai-chau",
    name: "Bản Lác & Thung lũng Mai Châu",
    region: "Hòa Bình",
    district: "Huyện Mai Châu",
    desc: "Thung lũng thơ mộng của đồng bào Thái, nhà sàn thanh bình giữa đồng lúa bát ngát và đèo Thung Khe mây phủ.",
  },
  {
    keywords: ["kim bôi", "kim boi", "khoáng nóng kim bôi"],
    placeId: "khoang-nong-kim-boi",
    name: "Suối khoáng nóng Kim Bôi",
    region: "Hòa Bình",
    district: "Huyện Kim Bôi",
    desc: "Dòng suối khoáng ấm tự nhiên chảy từ lòng đất mẹ, nổi tiếng thư giãn phục hồi sinh lực.",
  },
  {
    keywords: ["thung nai", "sông đà", "thác bờ", "đền thác bờ"],
    placeId: "thung-nai-song-da",
    name: "Khu du lịch lòng hồ sông Đà Thung Nai",
    region: "Hòa Bình",
    district: "Huyện Cao Phong",
    desc: "Vịnh Hạ Long trên núi với làn nước xanh ngọc bích, đảo nổi bồng bềnh và đền Chúa Thác Bờ linh thiêng.",
  },
  {
    keywords: ["pà cò", "pa co", "săn mây pà cò"],
    placeId: "pa-co-san-may",
    name: "Điểm săn mây & Chợ phiên Pà Cò",
    region: "Hòa Bình",
    district: "Huyện Mai Châu",
    desc: "Biển mây trắng xóa bồng bềnh mỗi sớm mai và sắc màu váy hoa thổ cẩm người H'Mông rực rỡ.",
  },
];

// Check if query is outside website's scope
export function checkOutOfScope(text: string): boolean {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Unrelated distant locations
  const outLocations = [
    "da nang", "phu quoc", "nha trang", "vung tau", "da lat", "hue", "hoi an",
    "can tho", "sai gon", "tp hcm", "ha giang", "cao bang", "sapa", "quy nhon",
    "thai lan", "singapore", "nhat ban", "han quoc", "chau au", "paris", "tokyo"
  ];
  if (outLocations.some((loc) => lower.includes(loc))) {
    return true;
  }

  // Non-travel topics: coding, advanced math, politics, crypto, general knowledge
  const nonTravelKeywords = [
    "viet code", "python", "javascript", "giai phuong trinh", "toan hoc",
    "chinh tri", "bitcoin", "crypto", "chung khoan", "bong da anh", "ngoai hang anh",
    "viet van", "bai tho ve tinh yeu", "triet hoc"
  ];
  if (nonTravelKeywords.some((kw) => lower.includes(kw))) {
    return true;
  }

  return false;
}

// Extract parameters from natural language
export function extractEntitiesFromText(text: string, prevSurvey: AiSurveyState): {
  survey: AiSurveyState;
  extractedAny: boolean;
  destinationMatched?: (typeof DESTINATION_MAPPINGS)[0];
} {
  const lower = text.toLowerCase();
  const nextSurvey: AiSurveyState = { ...prevSurvey };
  let extractedAny = false;
  let destinationMatched: (typeof DESTINATION_MAPPINGS)[0] | undefined;

  // 1. Destination Extraction
  for (const item of DESTINATION_MAPPINGS) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      nextSurvey.anchorPlaceId = item.placeId;
      nextSurvey.selectedPlaceIds = [item.placeId];
      nextSurvey.destinationText = item.name;
      nextSurvey.region = item.region;
      nextSurvey.district = item.district;
      destinationMatched = item;
      extractedAny = true;
      break;
    }
  }

  // 2. Duration Extraction (e.g. "3 ngày 2 đêm", "2 ngày 1 đêm", "1 ngày", "3n2d", "2n1d")
  // IMPORTANT: Bắt chặt chẽ để "5 người" KHÔNG BAO GIỜ bị match thành 5 ngày!
  const multiDayMatch = lower.match(/\b(\d+)\s*(?:ngày|ngay)(?:\s*(\d+)?\s*(?:đêm|dem))?\b/);
  const shortDayNightMatch = lower.match(/\b(\d+)\s*n\s*(\d+)\s*(?:d|đ|đêm|dem)\b/);
  // Chỉ match 'n' nếu ngay sau đó KHÔNG PHẢI là chữ cái (nhất là 'g' trong người, hoặc 'k', 'b', 'th')
  const shortDayOnlyMatch = lower.match(/\b(\d+)\s*n\b(?!\s*(?:g|kh|b|th|v|c))/);

  if (multiDayMatch) {
    const days = parseInt(multiDayMatch[1], 10);
    if (days >= 1 && days <= 7) {
      nextSurvey.durationDays = days;
      extractedAny = true;
    }
  } else if (shortDayNightMatch) {
    const days = parseInt(shortDayNightMatch[1], 10);
    if (days >= 1 && days <= 7) {
      nextSurvey.durationDays = days;
      extractedAny = true;
    }
  } else if (shortDayOnlyMatch) {
    const days = parseInt(shortDayOnlyMatch[1], 10);
    if (days >= 1 && days <= 7) {
      nextSurvey.durationDays = days;
      extractedAny = true;
    }
  } else if (lower.includes("1 ngày") || lower.includes("trong ngày") || lower.includes("đi về trong ngày")) {
    nextSurvey.durationDays = 1;
    extractedAny = true;
  } else if (lower.includes("cuối tuần") || lower.includes("thứ 7 chủ nhật") || lower.includes("t7 cn")) {
    nextSurvey.durationDays = 2;
    extractedAny = true;
  }

  // 3. Travelers Extraction (e.g. "5 người", "2 người", "cặp đôi", "gia đình 4 người", "1 mình")
  const travelerMatch = lower.match(/(\d+)\s*(?:người|nguoi|khách|khach|thành viên|vé|ve)(?![a-zA-Zà-ỹÀ-Ỹ0-9])/);
  const groupMatch = lower.match(/\b(?:đoàn|nhóm|doan|nhom)\s*(\d+)\b/);

  if (travelerMatch) {
    const count = parseInt(travelerMatch[1], 10);
    if (count >= 1 && count <= 50) {
      nextSurvey.travelers = count;
      extractedAny = true;
    }
  } else if (groupMatch) {
    const count = parseInt(groupMatch[1], 10);
    if (count >= 1 && count <= 50) {
      nextSurvey.travelers = count;
      extractedAny = true;
    }
  } else if (lower.includes("cặp đôi") || lower.includes("hai người") || lower.includes("2 vợ chồng") || lower.includes("đôi bạn")) {
    nextSurvey.travelers = 2;
    extractedAny = true;
  } else if (lower.includes("1 mình") || lower.includes("độc hành") || lower.includes("solo") || lower.includes("một mình")) {
    nextSurvey.travelers = 1;
    extractedAny = true;
  } else if (lower.includes("gia đình") || lower.includes("bố mẹ và con")) {
    nextSurvey.travelers = 4;
    extractedAny = true;
  } else if (lower.includes("nhóm bạn") || lower.includes("đoàn đông") || lower.includes("công ty")) {
    nextSurvey.travelers = 8;
    extractedAny = true;
  }

  // 4. Transport Extraction
  if (lower.includes("xe máy") || lower.includes("xe may") || lower.includes("phượt") || lower.includes("mô tô")) {
    nextSurvey.transport = "Xe máy";
    extractedAny = true;
  } else if (lower.includes("ô tô") || lower.includes("o to") || lower.includes("xe hơi") || lower.includes("tự lái") || lower.includes("xe nhà")) {
    nextSurvey.transport = "Ô tô riêng";
    extractedAny = true;
  } else if (lower.includes("limousine") || lower.includes("xe khách") || lower.includes("xe bus") || lower.includes("xe buýt")) {
    nextSurvey.transport = "Limousine / Xe khách";
    extractedAny = true;
  }

  // 5. Travel Style
  if (lower.includes("nghỉ dưỡng") || lower.includes("onsen") || lower.includes("chữa lành") || lower.includes("thư giãn")) {
    nextSurvey.style = "Nghỉ dưỡng & ẩm thực";
    extractedAny = true;
  } else if (lower.includes("săn mây") || lower.includes("sống ảo") || lower.includes("chụp ảnh") || lower.includes("thiên nhiên")) {
    nextSurvey.style = "Nhiếp ảnh & thiên nhiên";
    extractedAny = true;
  } else if (lower.includes("văn hóa") || lower.includes("tâm linh") || lower.includes("cội nguồn") || lower.includes("lễ hội") || lower.includes("hát xoan")) {
    nextSurvey.style = "Văn hóa & cội nguồn";
    extractedAny = true;
  } else if (lower.includes("ẩm thực") || lower.includes("món ngon") || lower.includes("ăn uống") || lower.includes("đặc sản")) {
    nextSurvey.style = "Nghỉ dưỡng & ẩm thực";
    extractedAny = true;
  }

  return { survey: nextSurvey, extractedAny, destinationMatched };
}

// Master Reasoning & Dialog Engine
export function processAiMessage(
  userText: string,
  currentSurvey: AiSurveyState,
  userName?: string
): AiResponseResult {
  const trimmed = userText.trim();
  const lower = trimmed.toLowerCase();

  // 1. GUARD: Out of scope check
  if (checkOutOfScope(trimmed)) {
    return {
      text:
        "Dạ, em là **Trợ lý AI Đất Tổ** chuyên hỗ trợ thông tin và lịch trình du lịch trong phạm vi **Phú Thọ và các tuyến liên kết** (Tam Đảo, Tây Thiên, Mai Châu, Hòa Bình).\n\n" +
        "Yêu cầu của bạn hiện nằm ngoài phạm vi hoạt động của website. Để đảm bảo dữ liệu du lịch chính xác nhất và tránh quá tải hệ thống, em xin phép chỉ hỗ trợ các câu hỏi liên quan đến điểm đến, ẩm thực OCOP và lên lịch trình du lịch Đất Tổ & vùng phụ cận.\n\n" +
        "Bạn có muốn em tư vấn hoặc lên lịch trình cho các điểm đến nổi tiếng như **Đền Hùng, Tam Đảo, Đồi chè Long Cốc, Thanh Sơn hay Suối khoáng nóng Thanh Thủy** không ạ? 🌿",
      options: [
        { label: "🍃 Khám phá Thanh Sơn & Long Cốc", value: "plan_long_coc", icon: "📸" },
        { label: "🏛️ Khám phá Đền Hùng", value: "plan_den_hung", icon: "🏛️" },
        { label: "🌫️ Lên lịch trình Tam Đảo", value: "plan_tam_dao", icon: "📍" },
        { label: "♨️ Tắm khoáng nóng Thanh Thủy", value: "plan_thanh_thuy", icon: "💆" },
      ],
      updatedSurvey: currentSurvey,
    };
  }

  // 2. Entity Extraction
  const { survey, destinationMatched } = extractEntitiesFromText(trimmed, currentSurvey);

  // 3. CASE A: User explicitly asks about foods / specialties
  if (lower.includes("đặc sản") || lower.includes("món ngon") || lower.includes("ăn gì") || lower.includes("thịt chua") || lower.includes("cá lăng") || lower.includes("bánh tai")) {
    return {
      text:
        "🥢 **Khám phá ẩm thực & Đặc sản OCOP trứ danh:**\n\n" +
        "1. **Thịt chua Thanh Sơn (Nghị Thịnh / Điệp Đào):** Đặc sản nức tiếng làm từ thịt lợn tươi ủ men thính ngô thơm bùi, gói lá chuối, ăn kèm lá sung, ổi, đinh lăng chấm tương ớt.\n" +
        "2. **Cá lăng sông Đà & sông Lô:** Thịt cá săn chắc béo ngậy, làm lẩu ngạnh om chuối đậu hoặc nướng than hoa riềng mẻ.\n" +
        "3. **Bánh tai Phú Thọ (Bánh Hòn):** Bánh gạo tẻ dẻo thơm nhân thịt ba chỉ tiêu xay nóng hổi.\n" +
        "4. **Gà nhiều cựa Vườn QG Xuân Sơn:** Giống gà huyền thoại tiến Vua, thịt ngọt chắc tự nhiên.\n" +
        "5. **Ngọn su su Tam Đảo:** Tươi giòn ngọt mát xào tỏi đượm vị núi rừng.\n\n" +
        "*(Bạn có thể bấm vào mục **Đặc sản OCOP** trên trang chủ để đặt giao tận nơi hoặc thêm vào giỏ hàng nhé!)*",
      options: [
        { label: "✨ Lên tour Thanh Sơn & Long Cốc", value: "plan_long_coc", icon: "🍃" },
        { label: "🏛️ Lên tour Đền Hùng", value: "plan_den_hung", icon: "📍" },
        { label: "🌫️ Lên tour Tam Đảo", value: "plan_tam_dao", icon: "🏔️" },
      ],
      updatedSurvey: survey,
    };
  }

  // 4. CASE B: Check if we have enough info to GENERATE the itinerary immediately!
  // Condition: We have a valid destination AND a duration
  const hasDestination = Boolean(survey.anchorPlaceId && survey.anchorPlaceId !== "");
  const hasDuration = Boolean(survey.durationDays && survey.durationDays >= 1);
  const hasTravelers = Boolean(survey.travelers && survey.travelers >= 1);

  // If both destination and duration are known (even if travelers or transport weren't given, we use smart defaults)
  if (hasDestination && hasDuration) {
    const finalDays = survey.durationDays || 2;
    const finalTravelers = survey.travelers || 2;
    const finalTransport = survey.transport || "Ô tô riêng";
    const finalStyle = survey.style || "Văn hóa & cội nguồn";

    // Generate accurate itinerary
    const itinerary = buildItinerary({
      anchorPlaceId: survey.anchorPlaceId,
      selectedPlaceIds: survey.selectedPlaceIds.length > 0 ? survey.selectedPlaceIds : [survey.anchorPlaceId],
      district: survey.district,
      region: survey.region,
      durationDays: finalDays,
      transport: finalTransport,
      budget: survey.budget || "Tiêu chuẩn",
      style: finalStyle,
      travelers: finalTravelers,
    });

    const userGreeting = userName ? `Chào **${userName}**! ` : "";
    const nightText = finalDays > 1 ? ` ${finalDays - 1} đêm` : " trong ngày";

    return {
      text:
        `🎉 ${userGreeting}Em đã thiết kế xong **Lịch trình ${finalDays} ngày${nightText}** khám phá **${survey.destinationText}** cho **${finalTravelers} người** đi bằng **${finalTransport}** đúng theo yêu cầu của bạn!\n\n` +
        `Lịch trình được tính toán cung đường tối ưu, các điểm tham quan nổi tiếng, điểm nghỉ chân và gợi ý các món đặc sản địa phương ngon nhất. Bạn có thể xem ngay chi tiết bên dưới:`,
      itinerary,
      options: [
        { label: "👉 Xem trên Trang Lịch Trình trực quan ➔", value: "view_trip_now", icon: "🗺️" },
        { label: "💾 Lưu vào Lịch trình của tôi", value: "save_trip_now", icon: "⭐" },
        { label: "🔄 Tùy chỉnh lịch trình khác", value: "start_planner", icon: "🔁" },
      ],
      updatedSurvey: survey,
      isCompleted: true,
    };
  }

  // 5. CASE C: We have Destination, but missing Duration
  if (hasDestination && !hasDuration) {
    const destInfo = destinationMatched || DESTINATION_MAPPINGS.find((d) => d.placeId === survey.anchorPlaceId);
    const destName = destInfo ? destInfo.name : survey.destinationText;
    const descText = destInfo ? destInfo.desc : "";
    const travelerText = survey.travelers ? `cho đoàn **${survey.travelers} người** ` : "";
    const currentTrav = survey.travelers || 2;

    return {
      text:
        `Dạ tuyệt vời! Em đã ghi nhận bạn muốn đến **${destName}** ${travelerText}!\n${descText ? `*(${descText})*\n\n` : "\n"}` +
        `Bạn dự định đi trong **mấy ngày** để em hoàn thiện lịch trình tối ưu nhất cho đoàn mình ạ? (Bạn có thể chọn nhanh bên dưới hoặc gõ trực tiếp):`,
      options: [
        { label: `⭐ 2 ngày 1 đêm (${currentTrav} người)`, value: `choose_dur_2_${survey.anchorPlaceId}`, icon: "🌟" },
        { label: `🌿 3 ngày 2 đêm (${currentTrav} người)`, value: `choose_dur_3_${survey.anchorPlaceId}`, icon: "🍃" },
        { label: `⚡ Đi trong ngày (1 ngày - ${currentTrav} người)`, value: `choose_dur_1_${survey.anchorPlaceId}`, icon: "⚡" },
        { label: `✨ 4 ngày 3 đêm (${currentTrav} người)`, value: `choose_dur_4_${survey.anchorPlaceId}`, icon: "✨" },
      ],
      updatedSurvey: survey,
    };
  }

  // 6. CASE D: We have Duration / Travelers, but missing Destination
  if (!hasDestination && hasDuration) {
    const days = survey.durationDays || 2;
    const trav = survey.travelers || 2;

    return {
      text:
        `Dạ em đã ghi nhận bạn muốn đi **${days} ngày** cho **${trav} người**!\n\n` +
        `Bạn muốn đến địa điểm nào tại Phú Thọ & vùng liên kết để em tạo lịch trình ngay ạ?`,
      options: [
        { label: "🍃 Huyện Thanh Sơn & Đồi chè Long Cốc", value: "plan_long_coc", icon: "📸" },
        { label: "🏛️ Đền Hùng & TP Việt Trì", value: "plan_den_hung", icon: "🏛️" },
        { label: "🌫️ Khu du lịch Tam Đảo", value: "plan_tam_dao", icon: "🏔️" },
        { label: "♨️ Suối khoáng nóng Thanh Thủy", value: "plan_thanh_thuy", icon: "💆" },
        { label: "🌲 Vườn quốc gia Xuân Sơn", value: "plan_xuan_son", icon: "🌲" },
      ],
      updatedSurvey: survey,
    };
  }

  // 7. DEFAULT FRIENDLY RESPONSE: Prompt with smart suggestions
  return {
    text:
      `Xin chào bạn! Em là **Trợ lý AI Đất Tổ**.\n\n` +
      `Em có thể giúp bạn tự động thiết kế lịch trình du lịch thông minh, tối ưu cung đường và ngân sách tại **Phú Thọ** cùng các điểm đến liên kết như **Tam Đảo, Tây Thiên, Mai Châu**.\n\n` +
      `Bạn chỉ cần cho em biết bạn muốn đi đâu, mấy người và trong mấy ngày (Ví dụ: *"Lên lịch trình Tam Đảo 3 ngày 2 đêm cho 2 người"* hoặc *"Đi Đền Hùng 1 ngày bằng xe máy"*). Hãy chọn gợi ý hoặc gõ yêu cầu của bạn nhé!`,
    options: [
      { label: "🌫️ Lên lịch trình Tam Đảo (2N1Đ / 3N2Đ)", value: "plan_tam_dao", icon: "🏔️" },
      { label: "🏛️ Lên lịch trình Đền Hùng (1N / 2N1Đ)", value: "plan_den_hung", icon: "🏛️" },
      { label: "🍃 Săn mây Đồi chè Long Cốc", value: "plan_long_coc", icon: "📸" },
      { label: "♨️ Nghỉ dưỡng khoáng nóng Thanh Thủy", value: "plan_thanh_thuy", icon: "💆" },
      { label: "🍲 Gợi ý đặc sản OCOP Phú Thọ", value: "ask_foods", icon: "🥢" },
    ],
    updatedSurvey: survey,
  };
}
