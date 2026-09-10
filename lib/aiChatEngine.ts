import { places, type Place, foodRegions } from "@/data/travel";
import { DISTRICT_DATABASE, findDistrictByQuery, type DistrictInfo } from "@/data/districtDirectory";
import { buildItinerary, type GeneratedItinerary } from "./guidePlanner";

export const DISTRICT_TO_ANCHOR_MAP: Record<string, string> = {
  "viet-tri": "den-hung",
  "thi-xa-phu-tho": "den-hung",
  "lam-thao": "den-hung",
  "phu-ninh": "den-hung",
  "ha-hoa": "den-mau-au-co",
  "doan-hung": "den-hung",
  "cam-khe": "dam-ao-chau",
  "thanh-ba": "dam-ao-chau",
  "tam-nong": "thanh-thuy",
  "thanh-thuy": "thanh-thuy",
  "thanh-son": "long-coc",
  "tan-son": "long-coc",
  "yen-lap": "xuan-son",
  "vinh-yen": "dam-vac",
  "phuc-yen": "ho-dai-lai",
  "tam-dao": "tam-dao",
  "binh-xuyen": "lang-gom-huong-canh",
  "vinh-tuong": "dam-vac",
  "yen-lac": "dam-vac",
  "lap-thach": "tam-dao",
  "song-lo": "tam-dao",
  "tam-duong": "tam-dao",
  "tp-hoa-binh": "bao-tang-muong",
  "mai-chau": "ban-lac-mai-chau",
  "kim-boi": "khoang-nong-kim-boi",
  "cao-phong": "thung-nai-song-da",
  "luong-son": "bao-tang-muong",
  "da-bac": "thung-nai-song-da",
  "tan-lac": "ban-lac-mai-chau",
  "lac-son": "ban-lac-mai-chau",
  "lac-thuy": "khoang-nong-kim-boi",
  "yen-thuy": "khoang-nong-kim-boi",
};

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
    keywords: ["huyện thanh thủy", "huyen thanh thuy", "du lịch thanh thủy", "du lich thanh thuy", "thanh thủy", "thanh thuy"],
    placeId: "thanh-thuy",
    name: "Huyện Thanh Thủy (Khoáng nóng Onsen & Vui chơi sinh thái)",
    region: "Phú Thọ",
    district: "Huyện Thanh Thủy",
    desc: "Thiên đường nghỉ dưỡng khoáng nóng Radon, tổ hợp vui chơi Đảo Ngọc Xanh, Đền Lăng Sương và thưởng thức ẩm thực cá sông Đà.",
  },
  {
    keywords: ["khoáng nóng thanh thủy", "khoang nong thanh thuy", "suối khoáng nóng thanh thủy", "suoi khoang nong thanh thuy", "khoáng nóng", "khoang nong", "onsen", "wyndham", "bamboo", "tre nguồn"],
    placeId: "thanh-thuy",
    name: "Suối khoáng nóng Thanh Thủy",
    region: "Phú Thọ",
    district: "Huyện Thanh Thủy",
    desc: "Nguồn nước khoáng Radon quý hiếm tự nhiên tốt cho sức khỏe, trung tâm nghỉ dưỡng Onsen chuẩn Nhật và trị liệu thư giãn.",
  },
  {
    keywords: ["đảo ngọc xanh", "dao ngoc xanh", "công viên đảo ngọc xanh", "khu du lịch đảo ngọc xanh"],
    placeId: "thanh-thuy",
    name: "Khu du lịch sinh thái Đảo Ngọc Xanh",
    region: "Phú Thọ",
    district: "Huyện Thanh Thủy",
    desc: "Tổ hợp vui chơi giải trí lớn nhất vùng với công viên nước, vòng quay mặt trời, các trò chơi cảm giác mạnh và công viên khủng long.",
  },
  {
    keywords: ["đền lăng sương", "den lang suong", "lăng sương"],
    placeId: "thanh-thuy",
    name: "Khu di tích lịch sử Đền Lăng Sương",
    region: "Phú Thọ",
    district: "Huyện Thanh Thủy",
    desc: "Ngôi đền linh thiêng duy nhất thờ toàn gia Đức Thánh Tản Viên (Sơn Tinh) và thân mẫu Quốc Mẫu Đinh Thị Đen.",
  },
  {
    keywords: ["vườn vua", "vuon vua", "vườn vua resort", "vuon vua resort"],
    placeId: "thanh-thuy",
    name: "Khu nghỉ dưỡng Vườn Vua Resort & Villas",
    region: "Phú Thọ",
    district: "Huyện Tam Nông",
    desc: "Quần thể biệt thự nghỉ dưỡng bên đầm sen Bạch Thủy bát ngát, chèo thuyền kayak và tắm khoáng nóng ngoài trời.",
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
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");

  // In-scope protected districts, landmarks, and regions of 3 provinces (NEVER out of scope)
  const inScopeKeywords = [
    "phu tho", "viet tri", "lam thao", "phu ninh", "ha hoa", "doan hung", "cam khe",
    "thanh ba", "tam nong", "thanh thuy", "thanh son", "tan son", "yen lap", "thi xa phu tho",
    "vinh phuc", "vinh yen", "phuc yen", "tam dao", "binh xuyen", "vinh tuong", "yen lac",
    "lap thach", "song lo", "tam duong", "tay thien", "dai lai",
    "hoa binh", "mai chau", "kim boi", "cao phong", "luong son", "da bac", "tan lac",
    "lac son", "lac thuy", "yen thuy", "thung nai", "song da", "thac bo", "dam vac", "huong canh",
    "tho tang", "dong dau", "da bia", "lung van", "thac mu", "chua tien", "dam da", "chi ne",
    "xuan son", "long coc", "dao ngoc xanh", "vuon vua", "den hung", "hung lo"
  ];
  if (inScopeKeywords.some((kw) => lower.includes(kw))) {
    return false;
  }

  // If matched to any district in our database, it is 100% in-scope
  if (findDistrictByQuery(text)) {
    return false;
  }

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

export interface AreaRecommendation {
  title: string;
  intro: string;
  spots: Array<{
    name: string;
    icon: string;
    desc: string;
    actionValue: string;
    actionLabel: string;
  }>;
  comboValue: string;
  comboLabel: string;
  anchorPlaceId: string;
  district: string;
  region: string;
}

export const AREA_RECOMMENDATIONS: Record<string, AreaRecommendation> = {
  "thanh-thuy": {
    title: "Huyện Thanh Thủy – Thiên đường nghỉ dưỡng khoáng nóng & sinh thái ven sông Đà",
    intro: "Dạ, **Huyện Thanh Thủy** là điểm đến nghỉ dưỡng khoáng nóng và du lịch sinh thái nổi tiếng nhất Phú Thọ ven dòng sông Đà thơ mộng.\n\nNếu bạn dự định đi chơi ở Thanh Thủy, dưới đây là **những địa điểm vui chơi & trải nghiệm hấp dẫn nhất** bạn có thể lựa chọn:",
    spots: [
      {
        name: "Khu nghỉ dưỡng Suối khoáng nóng Radon (Wyndham Lynn Times / Bamboo / Tre Nguồn)",
        icon: "♨️",
        desc: "Ngâm khoáng nóng tự nhiên chuẩn Onsen Nhật Bản, thư giãn xông hơi đá muối Himalaya, phục hồi sức khỏe và làm đẹp da.",
        actionValue: "choose_spot_thanh_thuy_onsen",
        actionLabel: "♨️ Tắm khoáng nóng Onsen Thanh Thủy",
      },
      {
        name: "Khu du lịch sinh thái Đảo Ngọc Xanh",
        icon: "🏝️",
        desc: "Tổ hợp vui chơi giải trí lớn nhất vùng với công viên nước, vòng quay mặt trời, trò chơi cảm giác mạnh, công viên khủng long (rất lý tưởng cho gia đình & trẻ nhỏ).",
        actionValue: "choose_spot_dao_ngoc_xanh",
        actionLabel: "🏝️ Vui chơi Đảo Ngọc Xanh",
      },
      {
        name: "Khu di tích lịch sử Đền Lăng Sương",
        icon: "⛩️",
        desc: "Ngôi đền linh thiêng duy nhất phụng thờ toàn gia Đức Thánh Tản Viên (Sơn Tinh) cùng thân mẫu Quốc Mẫu Đinh Thị Đen giữa cảnh quan non nước thanh bình.",
        actionValue: "choose_spot_den_lang_suong",
        actionLabel: "⛩️ Chiêm bái Đền Lăng Sương",
      },
      {
        name: "Khu nghỉ dưỡng Vườn Vua Resort & Villas (tiếp giáp Thanh Thủy - Tam Nông)",
        icon: "🏰",
        desc: "Quần thể biệt thự phong cách châu Âu bên đầm sen Bạch Thủy bát ngát, chèo thuyền kayak, đạp xe dạo hồ và tắm khoáng ngoài trời.",
        actionValue: "choose_spot_vuon_vua",
        actionLabel: "🏰 Nghỉ dưỡng Vườn Vua Resort",
      },
      {
        name: "Thưởng thức ẩm thực Cá sông Đà & Cung đường ven sông",
        icon: "🐟",
        desc: "Thưởng thức các món đặc sản trứ danh: Cá ngạnh nướng than hoa, cá lăng om chuối đậu, lẩu cá ngạnh và ngắm hoàng hôn đỏ rực buông xuống sông Đà.",
        actionValue: "choose_spot_ca_song_da",
        actionLabel: "🐟 Khám phá ẩm thực Cá sông Đà",
      },
    ],
    comboValue: "plan_thanh_thuy_combo",
    comboLabel: "✨ Lên lịch trình kết hợp trọn gói Thanh Thủy",
    anchorPlaceId: "thanh-thuy",
    district: "Huyện Thanh Thủy",
    region: "Phú Thọ",
  },
  "thanh-son": {
    title: "Huyện Thanh Sơn – Cửa ngõ văn hóa Mường & Thủ phủ Thịt chua Đất Tổ",
    intro: "Dạ, **Thanh Sơn** nổi tiếng với nét đẹp văn hóa bản Mường nguyên sơ, ẩm thực trứ danh và là cửa ngõ tuyệt vời kết nối Đồi chè Long Cốc và Vườn QG Xuân Sơn.\n\nĐến Thanh Sơn, bạn nhất định nên tham quan và trải nghiệm các điểm đến sau:",
    spots: [
      {
        name: "Trải nghiệm đặc sản & Làng nghề Thịt chua Thanh Sơn (Nghị Thịnh / Điệp Đào)",
        icon: "🥩",
        desc: "Tìm hiểu bí quyết ủ men thính ngô truyền thống của đồng bào Mường, thưởng thức thịt chua nức tiếng gói lá chuối kèm lá sung, ổi, đinh lăng tươi giòn.",
        actionValue: "choose_spot_thit_chua",
        actionLabel: "🥩 Trải nghiệm Thịt chua Thanh Sơn",
      },
      {
        name: "Đồi chè bát úp Long Cốc (tiếp giáp Thanh Sơn - Tân Sơn)",
        icon: "🍃",
        desc: "Được mệnh danh 'ốc đảo chè đẹp nhất Việt Nam' với hàng trăm quả đồi chè hình bát úp bồng bềnh trong sương sớm, thiên đường săn mây và chụp ảnh.",
        actionValue: "choose_spot_long_coc",
        actionLabel: "🍃 Săn mây Đồi chè Long Cốc",
      },
      {
        name: "Vườn quốc gia Xuân Sơn (tiếp giáp cung đường)",
        icon: "🌲",
        desc: "Lá phổi xanh nguyên sinh với hệ thống hang Lạng kỳ vĩ, suối trong veo, bản Cỏi mộc mạc và gà nhiều cựa tiến Vua huyền thoại.",
        actionValue: "choose_spot_xuan_son",
        actionLabel: "🌲 Khám phá Vườn QG Xuân Sơn",
      },
      {
        name: "Thác Chòi & Các dòng suối đá nguyên sơ bản Mường",
        icon: "🏞️",
        desc: "Dòng thác trong vắt đổ giữa rừng già bản Mường xanh mát, điểm lý tưởng để cắm trại, picnic, tắm suối và hít thở không khí núi rừng.",
        actionValue: "choose_spot_thac_choi",
        actionLabel: "🏞️ Khám phá Thác Chòi & Bản Mường",
      },
    ],
    comboValue: "plan_thanh_son_combo",
    comboLabel: "✨ Lên tour Thanh Sơn & Long Cốc kết hợp",
    anchorPlaceId: "long-coc",
    district: "Huyện Thanh Sơn",
    region: "Phú Thọ",
  },
  "den-hung": {
    title: "TP. Việt Trì & Khu di tích lịch sử Đền Hùng",
    intro: "Dạ, **TP. Việt Trì và Đền Hùng** là cội nguồn linh thiêng của dân tộc Việt Nam. Đến đây, bạn có thể ghé thăm các điểm đến tiêu biểu sau:",
    spots: [
      {
        name: "Khu di tích lịch sử Quốc gia đặc biệt Đền Hùng",
        icon: "🏛️",
        desc: "Hành hương qua Đền Hạ, Đền Trung, Đền Thượng trên đỉnh Nghĩa Lĩnh cao 175m, viếng Lăng Hùng Vương và Đền Quốc Tổ Lạc Long Quân.",
        actionValue: "choose_spot_den_hung",
        actionLabel: "🏛️ Chiêm bái Đền Hùng",
      },
      {
        name: "Làng cổ & Đình cổ Hùng Lô",
        icon: "🎶",
        desc: "Di tích kiến trúc cổ kính hơn 300 năm tuổi với điêu khắc gỗ tinh xảo và là cái nôi thưởng thức Di sản Hát Xoan Phú Thọ được UNESCO vinh danh.",
        actionValue: "choose_spot_hung_lo",
        actionLabel: "🎶 Thăm Làng cổ & Nghe Hát Xoan",
      },
      {
        name: "Công viên Văn Lang & Cầu đi bộ biểu tượng",
        icon: "🌉",
        desc: "Dạo mát quanh hồ Văn Lang thơ mộng, chụp ảnh cầu đi bộ nghệ thuật và thưởng thức nhạc nước lung linh về đêm.",
        actionValue: "choose_spot_van_lang",
        actionLabel: "🌉 Dạo chơi Công viên Văn Lang",
      },
      {
        name: "Phố ẩm thực ngã ba sông & Cá lăng sông Lô",
        icon: "🐟",
        desc: "Thưởng thức cá lăng nướng than riềng mẻ, cá quất om chuối đậu và bánh tai Phú Thọ nóng hổi.",
        actionValue: "choose_spot_viet_tri_food",
        actionLabel: "🐟 Ẩm thực Cá lăng sông Lô",
      },
    ],
    comboValue: "plan_viet_tri_combo",
    comboLabel: "✨ Lên lịch trình Đền Hùng & Việt Trì",
    anchorPlaceId: "den-hung",
    district: "TP. Việt Trì",
    region: "Phú Thọ",
  },
  "tam-dao": {
    title: "Khu du lịch Quốc gia Tam Đảo & Tây Thiên",
    intro: "Dạ, **Tam Đảo** bồng bềnh giữa mây ngàn ở độ cao 900m với khí hậu mát mẻ 4 mùa trong 1 ngày. Các điểm check-in và tham quan không thể bỏ qua gồm có:",
    spots: [
      {
        name: "Nhà thờ Đá cổ & Quảng trường trung tâm Tam Đảo",
        icon: "🏰",
        desc: "Công trình kiến trúc Gothic bằng đá từ thời Pháp, điểm ngắm mây và biểu tượng check-in số 1 của thị trấn.",
        actionValue: "choose_spot_tam_dao_church",
        actionLabel: "🏰 Nhà thờ Đá & Quảng trường",
      },
      {
        name: "Cổng Trời, Cầu Mây & Quán Gió Tam Đảo",
        icon: "☁️",
        desc: "Điểm ngắm hoàng hôn tuyệt đẹp, phóng tầm mắt ôm trọn thung lũng sương mù và thưởng thức cà phê trên mây.",
        actionValue: "choose_spot_cau_may",
        actionLabel: "☁️ Săn mây Cầu Mây & Quán Gió",
      },
      {
        name: "Thác Bạc Tam Đảo",
        icon: "🌊",
        desc: "Dòng thác trắng xóa ẩn mình giữa rừng sâu xanh biếc, nước mát lạnh quanh năm.",
        actionValue: "choose_spot_thac_bac",
        actionLabel: "🌊 Khám phá Thác Bạc",
      },
      {
        name: "Quần thể Di tích & Danh thắng Tây Thiên (tiếp giáp chân núi)",
        icon: "🛕",
        desc: "Cáp treo lên Đền Thượng Quốc Mẫu Tây Thiên và Thiền viện Trúc Lâm thanh tịnh.",
        actionValue: "choose_spot_tay_thien",
        actionLabel: "🛕 Chiêm bái Tây Thiên",
      },
    ],
    comboValue: "plan_tam_dao_combo",
    comboLabel: "✨ Lên lịch trình khám phá Tam Đảo trọn gói",
    anchorPlaceId: "tam-dao",
    district: "Huyện Tam Đảo",
    region: "Vĩnh Phúc",
  },
  "phu-tho": {
    title: "Tỉnh Phú Thọ – Miền Đất Tổ cội nguồn ngàn năm",
    intro: "Dạ, **Phú Thọ** có rất nhiều điểm đến tuyệt đẹp được chia theo 4 cụm du lịch đặc sắc. Bạn có thể tham khảo các điểm nổi bật sau:",
    spots: [
      {
        name: "Khu di tích lịch sử Đền Hùng & TP. Việt Trì",
        icon: "🏛️",
        desc: "Cội nguồn dân tộc linh thiêng trên đỉnh Nghĩa Lĩnh, Làng cổ Hùng Lô, nghe Hát Xoan UNESCO và hồ Văn Lang.",
        actionValue: "plan_den_hung",
        actionLabel: "🏛️ Cụm Đền Hùng & Việt Trì",
      },
      {
        name: "Suối khoáng nóng Thanh Thủy & Đảo Ngọc Xanh",
        icon: "♨️",
        desc: "Nghỉ dưỡng tắm Onsen khoáng nóng Radon Nhật Bản, công viên nước Đảo Ngọc Xanh, Đền Lăng Sương.",
        actionValue: "plan_thanh_thuy",
        actionLabel: "♨️ Cụm Khoáng nóng Thanh Thủy",
      },
      {
        name: "Đồi chè Long Cốc & Vườn quốc gia Xuân Sơn (Thanh Sơn - Tân Sơn)",
        icon: "🍃",
        desc: "Săn mây trên hàng trăm quả đồi chè bát úp, trekking rừng nguyên sinh, hang Lạng và thưởng thức thịt chua Thanh Sơn.",
        actionValue: "plan_long_coc",
        actionLabel: "🍃 Cụm Đồi chè Long Cốc & Xuân Sơn",
      },
      {
        name: "Đền Mẫu Âu Cơ & Đầm Ao Châu (Hạ Hòa)",
        icon: "🛕",
        desc: "Cội nguồn Mẹ Tiên Âu Cơ và vịnh nước 99 ngách đồi chè thanh bình.",
        actionValue: "choose_spot_ha_hoa",
        actionLabel: "🛕 Cụm Đền Mẫu Âu Cơ & Ao Châu",
      },
    ],
    comboValue: "plan_phu_tho_full",
    comboLabel: "✨ Lên lịch trình tổng hợp Đất Tổ (2N1Đ / 3N2Đ)",
    anchorPlaceId: "den-hung",
    district: "Việt Trì",
    region: "Phú Thọ",
  },
};

export function checkIsAskingSightseeing(text: string): boolean {
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");
  const patterns = [
    "di nhung dau",
    "di dau",
    "co gi choi",
    "choi gi",
    "co gi dep",
    "nen di dau",
    "tham quan gi",
    "co nhung diem nao",
    "co diem nao",
    "diem nao dep",
    "cho nao choi",
    "co cho nao",
    "nhung cho nao",
    "co gi hay",
    "kham pha nhung gi",
    "kham pha gi",
    "goi y diem",
    "goi y dia diem",
    "goi y diem choi",
    "goi y diem tham quan",
    "choi o dau",
    "choi nhung dau",
    "di dau choi",
    "nhung diem nao",
    "cac diem nao",
    "di choi",
    "di choi o",
    "muon di choi",
    "muon di choi o",
    "tham quan o",
    "du lich o",
    "den day choi gi",
    "den day di dau",
    "diem du lich",
    "co gi tham quan",
    "co cho nao tham quan",
    "canh dep",
    "danh lam",
    "thang canh",
  ];
  return patterns.some((p) => lower.includes(p));
}

export function checkIsAskingFood(text: string): boolean {
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");

  const foodPatterns = [
    "an gi",
    "co gi an",
    "co gi ngon",
    "an gi ngon",
    "mon gi ngon",
    "an uong",
    "an uong gi",
    "an uong o",
    "mon ngon",
    "co mon gi",
    "co mon nao",
    "dac san",
    "dac san gi",
    "dac san nao",
    "dac san co gi",
    "quan an",
    "nha hang",
    "quan ngon",
    "quan nao ngon",
    "am thuc",
    "cho nao an",
    "dia diem an",
    "mon gi",
    "mon an",
    "uong gi",
    "thuc don",
    "choi xong an",
    "di dau an",
    "an o dau",
    "an o dau ngon",
    "dia chi quan",
    "quan nao",
    "do an",
    "do uong",
    "com lam",
    "thit chua",
    "ca lang",
    "banh tai",
    "ca thinh",
    "buoi doan hung",
    "ga nhieu cua",
    "ga chin cua",
    "ga doi",
    "thit trau",
    "su su",
    "de nui",
    "banh hon",
    "banh trung",
  ];
  return foodPatterns.some((p) => lower.includes(p));
}

export function checkIsAskingAlternative(text: string): boolean {
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");

  const altPatterns = [
    "co cho nao khac",
    "cho nao khac",
    "diem nao khac",
    "dia diem khac",
    "cho khac",
    "diem khac",
    "ngoai",
    "khac ngoai",
    "con cho nao",
    "con diem nao",
    "con gi khac",
    "con gi nua khong",
    "con gi nua",
    "khong muon di",
    "khong thich",
    "thay vi",
    "ngoai tru",
    "chua muon",
  ];

  return altPatterns.some((p) => lower.includes(p));
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

  // 1. Destination Extraction from explicit mappings
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

  // Fallback: Check 32 districts database across Phu Tho, Vinh Phuc, Hoa Binh
  if (!destinationMatched) {
    const distInfo = findDistrictByQuery(text);
    if (distInfo) {
      const pId = DISTRICT_TO_ANCHOR_MAP[distInfo.id] || "den-hung";
      nextSurvey.anchorPlaceId = pId;
      nextSurvey.selectedPlaceIds = [pId];
      nextSurvey.destinationText = distInfo.title;
      nextSurvey.region = distInfo.province;
      nextSurvey.district = distInfo.name;
      destinationMatched = {
        keywords: distInfo.keywords,
        placeId: pId,
        name: distInfo.name,
        region: distInfo.province,
        district: distInfo.name,
        desc: distInfo.intro,
      };
      extractedAny = true;
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

  // Identify district from query or current survey state
  const matchedDistrict =
    findDistrictByQuery(trimmed) ||
    (survey.district ? findDistrictByQuery(survey.district) : undefined) ||
    (currentSurvey.district ? findDistrictByQuery(currentSurvey.district) : undefined);

  const isAskingAlternative = checkIsAskingAlternative(trimmed);
  const isAskingFood = checkIsAskingFood(trimmed);
  const isAskingSightseeing = checkIsAskingSightseeing(trimmed);
  const hasDuration = Boolean(survey.durationDays && survey.durationDays >= 1);
  const hasDestination = Boolean(survey.anchorPlaceId && survey.anchorPlaceId !== "");
  const currentTrav = survey.travelers || 2;

  // =========================================================================
  // 3. ALTERNATIVE SPOTS INTENT: User asks for OTHER places / alternatives
  // (e.g. "có chỗ nào khác ngoài suối khoáng nóng thanh thủy", "ngoài đền hùng ra còn gì"...)
  // =========================================================================
  if (isAskingAlternative) {
    if (matchedDistrict) {
      // Find excluded words
      let excludedLabel = "điểm vừa đề cập";
      let filteredSpots = matchedDistrict.attractions;

      if (lower.includes("khoang nong") || lower.includes("khoáng nóng") || lower.includes("onsen") || lower.includes("suoi") || lower.includes("suối")) {
        excludedLabel = "Suối khoáng nóng";
        filteredSpots = matchedDistrict.attractions.filter((s) => !s.name.toLowerCase().includes("khoáng") && !s.name.toLowerCase().includes("onsen"));
      } else if (lower.includes("dao ngoc") || lower.includes("đảo ngọc")) {
        excludedLabel = "Đảo Ngọc Xanh";
        filteredSpots = matchedDistrict.attractions.filter((s) => !s.name.toLowerCase().includes("ngọc xanh"));
      } else if (lower.includes("den hung") || lower.includes("đền hùng")) {
        excludedLabel = "Đền Hùng";
        filteredSpots = matchedDistrict.attractions.filter((s) => !s.name.toLowerCase().includes("hùng"));
      } else if (lower.includes("long coc") || lower.includes("long cốc") || lower.includes("doi che") || lower.includes("đồi chè")) {
        excludedLabel = "Đồi chè Long Cốc";
        filteredSpots = matchedDistrict.attractions.filter((s) => !s.name.toLowerCase().includes("long cốc"));
      } else {
        excludedLabel = matchedDistrict.attractions[0]?.name || "điểm vừa đề cập";
        filteredSpots = matchedDistrict.attractions.slice(1);
      }

      let spotsText = `Dạ, nếu bạn muốn tìm **các địa điểm vui chơi, tham quan khác** (thay vì *${excludedLabel}*) tại **${matchedDistrict.name}** (${matchedDistrict.province}) thì còn rất nhiều lựa chọn nổi bật sau ạ:\n\n`;
      filteredSpots.forEach((sp, idx) => {
        spotsText += `${idx + 1}. ${sp.icon} **${sp.name}** (${sp.category}):\n   - ${sp.desc}\n`;
      });
      spotsText += `\nBạn thấy thích **địa điểm nào nhất** trong các gợi ý trên, hoặc bạn muốn em tạo **Lịch trình kết hợp các điểm này** cho chuyến đi của bạn ạ? (Hãy bấm chọn gợi ý bên dưới hoặc gõ trực tiếp nhé! 🌿)`;

      const options = filteredSpots.map((sp, idx) => ({
        label: `${sp.icon} ${sp.name.split("(")[0].trim()}`,
        value: `choose_spot_${matchedDistrict.id}_${idx}`,
        icon: sp.icon,
      }));
      options.push({
        label: `✨ Lên tour kết hợp các điểm trên (${filteredSpots.length} điểm)`,
        value: matchedDistrict.comboActionValue,
        icon: "✨",
      });

      const nextSurvey: AiSurveyState = {
        ...currentSurvey,
        anchorPlaceId: DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung",
        destinationText: matchedDistrict.title,
        district: matchedDistrict.name,
        region: matchedDistrict.province,
        selectedPlaceIds: [DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung"],
      };

      return {
        text: spotsText,
        options,
        updatedSurvey: nextSurvey,
      };
    }

    // Fallback to regional recommendations
    let areaKey = "thanh-thuy";
    if (lower.includes("thanh thủy") || lower.includes("thanh thuy") || currentSurvey.district?.includes("Thanh Thủy")) {
      areaKey = "thanh-thuy";
    } else if (lower.includes("thanh sơn") || lower.includes("thanh son") || currentSurvey.district?.includes("Thanh Sơn")) {
      areaKey = "thanh-son";
    } else if (lower.includes("đền hùng") || lower.includes("den hung") || lower.includes("việt trì") || lower.includes("viet tri")) {
      areaKey = "den-hung";
    } else if (lower.includes("tam đảo") || lower.includes("tam dao")) {
      areaKey = "tam-dao";
    }

    const rec = AREA_RECOMMENDATIONS[areaKey] || AREA_RECOMMENDATIONS["thanh-thuy"];
    let filteredSpots = rec.spots.slice(1);
    let spotsText = `Dạ, nếu bạn muốn tìm **các địa điểm vui chơi khác** tại **${rec.title.split("–")[0]?.trim() || "khu vực này"}** thì còn các lựa chọn nổi bật sau ạ:\n\n`;
    filteredSpots.forEach((sp, idx) => {
      spotsText += `${idx + 1}. ${sp.icon} **${sp.name}**:\n   - ${sp.desc}\n`;
    });
    spotsText += `\nBạn thấy thích **địa điểm nào nhất** trong các gợi ý trên ạ?`;

    return {
      text: spotsText,
      options: filteredSpots.map((sp) => ({ label: sp.actionLabel, value: sp.actionValue, icon: sp.icon })),
      updatedSurvey: currentSurvey,
    };
  }

  // =========================================================================
  // 3.5. COMBINED INTENT: User asks for BOTH attractions AND food in a district
  // (e.g. "huyện đoan hùng có điểm du lịch và ăn uống gì", "tam nông có gì chơi và ăn gì"...)
  // =========================================================================
  if (matchedDistrict && isAskingFood && isAskingSightseeing) {
    let combinedText = `Dạ chào bạn! Khám phá **${matchedDistrict.name}** (${matchedDistrict.province}) có cả danh lam thắng cảnh đẹp và ẩm thực đặc sản nức tiếng:\n\n` +
      `🏞️ **Địa điểm du lịch & trải nghiệm tiêu biểu:**\n`;

    matchedDistrict.attractions.forEach((a, i) => {
      combinedText += `${i + 1}. ${a.icon} **${a.name}** (${a.category}):\n   - ${a.desc}\n`;
    });

    combinedText += `\n🥢 **Ẩm thực đặc sản & Quán ăn gợi ý:**\n`;
    matchedDistrict.culinary.forEach((c, idx) => {
      combinedText += `${idx + 1}. **${c.dish}**:\n   - *Hương vị đặc sắc:* ${c.desc}\n   - 📍 *Địa chỉ / Quán gợi ý:* ${c.places || "Các nhà hàng đặc sản địa phương"}\n`;
    });

    if (matchedDistrict.recommendedStay) {
      combinedText += `\n🏨 **Lưu trú gợi ý:** ${matchedDistrict.recommendedStay}\n`;
    }

    combinedText += `\nBạn có muốn em lên **Lịch trình kết hợp tham quan & ăn uống** tại ${matchedDistrict.name} cho đoàn mình không ạ? (Hãy bấm chọn gợi ý bên dưới hoặc gõ trực tiếp nhé! 🌿)`;

    const nextSurvey: AiSurveyState = {
      ...currentSurvey,
      anchorPlaceId: DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung",
      destinationText: matchedDistrict.title,
      district: matchedDistrict.name,
      region: matchedDistrict.province,
      selectedPlaceIds: [DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung"],
    };

    const options = [
      { label: `✨ Lên tour trọn gói ${matchedDistrict.name}`, value: matchedDistrict.comboActionValue, icon: "✨" },
      { label: `⭐ 2 ngày 1 đêm (${matchedDistrict.name} - ${currentTrav} người)`, value: `choose_dur_2_${nextSurvey.anchorPlaceId}`, icon: "⭐" },
      { label: `⚡ Đi trong ngày (1 ngày - ${currentTrav} người)`, value: `choose_dur_1_${nextSurvey.anchorPlaceId}`, icon: "⚡" },
      { label: `🌿 3 ngày 2 đêm (${matchedDistrict.name} - ${currentTrav} người)`, value: `choose_dur_3_${nextSurvey.anchorPlaceId}`, icon: "🌿" },
    ];

    return {
      text: combinedText,
      options,
      updatedSurvey: nextSurvey,
    };
  }

  // =========================================================================
  // 4. FOOD & DINING INTENT: User asks about food, dishes, restaurants, specialties
  // (e.g. "ở cẩm khê ăn gì ngon", "mai châu ăn gì", "đặc sản đoan hùng có gì", "quán ăn ở vĩnh tường"...)
  // =========================================================================
  if (isAskingFood) {
    if (matchedDistrict) {
      let foodText = `🥢 **Khám phá ẩm thực & Quán ăn đặc sản tại ${matchedDistrict.name} (${matchedDistrict.province}):**\n\n`;
      matchedDistrict.culinary.forEach((c, idx) => {
        foodText += `${idx + 1}. **${c.dish}**:\n   - *Hương vị đặc sắc:* ${c.desc}\n   - 📍 *Địa chỉ / Quán gợi ý:* ${c.places || "Các nhà hàng đặc sản trung tâm huyện"}\n`;
      });

      foodText += `\n*(Bạn có thể kết hợp thưởng thức ẩm thực khi ghé thăm các điểm du lịch nổi tiếng tại ${matchedDistrict.name} như **${matchedDistrict.attractions.slice(0, 3).map((a) => a.name.split("(")[0].trim()).join(", ")}**.)*\n\n` +
        `Bạn có muốn em lên **Lịch trình kết hợp tham quan & ăn uống** tại ${matchedDistrict.name} cho đoàn mình không ạ? (Hãy bấm chọn gợi ý bên dưới hoặc gõ trực tiếp nhé! 🌿)`;

      const nextSurvey: AiSurveyState = {
        ...currentSurvey,
        anchorPlaceId: DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung",
        destinationText: matchedDistrict.title,
        district: matchedDistrict.name,
        region: matchedDistrict.province,
        selectedPlaceIds: [DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung"],
      };

      const options = [
        { label: `✨ Lên tour ăn uống & du lịch ${matchedDistrict.name}`, value: matchedDistrict.comboActionValue, icon: "✨" },
        { label: `🏞️ Xem điểm tham quan tại ${matchedDistrict.name}`, value: `explore_spots_${matchedDistrict.id}`, icon: "📍" },
        { label: `⭐ 2 ngày 1 đêm (${matchedDistrict.name} - ${currentTrav} người)`, value: `choose_dur_2_${nextSurvey.anchorPlaceId}`, icon: "⭐" },
        { label: `⚡ Đi trong ngày (1 ngày - ${currentTrav} người)`, value: `choose_dur_1_${nextSurvey.anchorPlaceId}`, icon: "⚡" },
      ];

      return {
        text: foodText,
        options,
        updatedSurvey: nextSurvey,
      };
    }

    // General regional food overview (Phú Thọ, Vĩnh Phúc, Hòa Bình)
    return {
      text:
        "🥢 **Khám phá tinh hoa ẩm thực & Đặc sản OCOP 3 tỉnh Đất Tổ – Vĩnh Phúc – Hòa Bình:**\n\n" +
        "1. 🥩 **Phú Thọ (Đất Tổ):**\n" +
        "   - *Thịt chua Thanh Sơn (Nghị Thịnh / Điệp Đào):* Thịt lợn tươi ủ thính ngô thơm bùi gói lá chuối cuốn lá sung.\n" +
        "   - *Cá lăng & cá ngạnh sông Lô sông Đà:* Nướng than hoa riềng mẻ hoặc om chuối đậu béo ngậy.\n" +
        "   - *Bánh tai Phú Thọ & Bánh làng Dòng Lâm Thao:* Bánh dẻo thơm nhân thịt mỡ hành tiêu nóng hổi.\n" +
        "   - *Cá thính Cẩm Khê & Bưởi Đoan Hùng tiến Vua:* Tép bưởi mọng nước ngọt thanh và cá thính ủ chum sành nức mũi.\n\n" +
        "2. 🍃 **Vĩnh Phúc:**\n" +
        "   - *Ngọn su su Tam Đảo:* Tươi giòn ngọt mát xào tỏi đượm vị núi mây sương mù.\n" +
        "   - *Thịt trâu tươi nướng tảng Đại Lải:* Thịt trâu giật nướng than hồng chấm tương gừng.\n" +
        "   - *Tép dầu Đầm Vạc kho tương, Bánh trùng mật mía Vĩnh Tường & Cá thính Lập Thạch.*\n\n" +
        "3. 🍗 **Hòa Bình:**\n" +
        "   - *Cơm lam nếp nương Mai Châu & Xôi ngũ sắc:* Nướng ống nứa dẻo thơm chấm muối vừng.\n" +
        "   - *Cá suối nướng Pa pỉnh tộp & Cỗ lá lợn mán:* Chấm muối ớt hạt dổi mắc khén cay thơm ngào ngạt.\n" +
        "   - *Măng chua nấu gà đồi Kim Bôi, Cam Cao Phong & Dê núi Lạc Thủy.*\n\n" +
        "*(Bạn muốn tìm hiểu chi tiết ẩm thực của **huyện nào** trong 3 tỉnh trên ạ? Hãy gõ tên huyện hoặc chọn bên dưới nhé!)*",
      options: [
        { label: "🥩 Đặc sản Phú Thọ (Thịt chua, Cá lăng, Bưởi)", value: "explore_food_phu_tho", icon: "🥩" },
        { label: "🌿 Đặc sản Vĩnh Phúc (Su su Tam Đảo, Trâu Đại Lải)", value: "explore_food_vinh_phuc", icon: "🍃" },
        { label: "🍢 Đặc sản Hòa Bình (Cơm lam, Cá sông Đà, Cỗ lá)", value: "explore_food_hoa_binh", icon: "🍗" },
        { label: "✨ Lên lịch trình ẩm thực trọn gói", value: "plan_food_tour", icon: "✨" },
      ],
      updatedSurvey: survey,
    };
  }

  // =========================================================================
  // 5. SIGHTSEEING INTENT: User asks what spots to visit / what to do
  // (e.g. "ở cẩm khê có gì chơi", "đà bắc có điểm du lịch nào", "vĩnh tường có gì chơi"...)
  // =========================================================================
  if (isAskingSightseeing) {
    if (matchedDistrict) {
      let spotsText = `Dạ, **${matchedDistrict.name}** (${matchedDistrict.province}) là điểm đến tuyệt vời với nhiều cảnh quan và di tích đặc sắc.\n\n${matchedDistrict.intro}\n\nDưới đây là **những địa điểm tham quan & trải nghiệm nổi bật nhất** tại ${matchedDistrict.name}:\n\n`;

      matchedDistrict.attractions.forEach((sp, idx) => {
        spotsText += `${idx + 1}. ${sp.icon} **${sp.name}**:\n   - *Loại hình:* ${sp.category}\n   - ${sp.desc}\n`;
      });

      spotsText += `\n🥢 **Ẩm thực đặc sắc:** ${matchedDistrict.culinary.map((c) => c.dish.split("(")[0].trim()).join(", ")}.\n`;
      if (matchedDistrict.recommendedStay) {
        spotsText += `🏨 **Lưu trú gợi ý:** ${matchedDistrict.recommendedStay}\n`;
      }
      spotsText += `\nBạn thích ghé thăm **địa điểm nào nhất** trong các gợi ý trên, hoặc bạn muốn em tạo **Lịch trình kết hợp trọn gói** cho đoàn mình ạ? (Hãy bấm chọn gợi ý bên dưới hoặc gõ trực tiếp nhé! 🌿)`;

      const nextSurvey: AiSurveyState = {
        ...currentSurvey,
        anchorPlaceId: DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung",
        destinationText: matchedDistrict.title,
        district: matchedDistrict.name,
        region: matchedDistrict.province,
        selectedPlaceIds: [DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung"],
      };

      const options = matchedDistrict.attractions.slice(0, 4).map((sp, idx) => ({
        label: `${sp.icon} ${sp.name.split("(")[0].trim()}`,
        value: `choose_spot_${matchedDistrict.id}_${idx}`,
        icon: sp.icon,
      }));
      options.push({
        label: matchedDistrict.comboActionLabel,
        value: matchedDistrict.comboActionValue,
        icon: "✨",
      });
      options.push({
        label: `🥢 Món ngon & Quán ăn ${matchedDistrict.name}`,
        value: `explore_food_${matchedDistrict.id}`,
        icon: "🍲",
      });

      return {
        text: spotsText,
        options,
        updatedSurvey: nextSurvey,
      };
    }

    // Regional sightseeing overview fallback
    let areaKey = "phu-tho";
    if (lower.includes("thanh thủy") || lower.includes("thanh thuy") || lower.includes("khoáng nóng")) {
      areaKey = "thanh-thuy";
    } else if (lower.includes("thanh sơn") || lower.includes("thanh son") || lower.includes("thịt chua") || lower.includes("long cốc")) {
      areaKey = "thanh-son";
    } else if (lower.includes("đền hùng") || lower.includes("den hung") || lower.includes("việt trì")) {
      areaKey = "den-hung";
    } else if (lower.includes("tam đảo") || lower.includes("tam dao") || lower.includes("tây thiên")) {
      areaKey = "tam-dao";
    }

    const rec = AREA_RECOMMENDATIONS[areaKey] || AREA_RECOMMENDATIONS["phu-tho"];
    let spotsText = `${rec.intro}\n\n`;
    rec.spots.forEach((sp, idx) => {
      spotsText += `${idx + 1}. ${sp.icon} **${sp.name}**:\n   - ${sp.desc}\n`;
    });
    spotsText += `\nBạn thích ghé thăm **địa điểm nào nhất** trong các gợi ý trên, hoặc bạn muốn em tạo **Lịch trình kết hợp trọn gói** cho chuyến đi của bạn ạ? (Hãy bấm chọn gợi ý bên dưới hoặc gõ trực tiếp nhé! 🌿)`;

    const options = rec.spots.map((sp) => ({
      label: sp.actionLabel,
      value: sp.actionValue,
      icon: sp.icon,
    }));
    options.push({
      label: rec.comboLabel,
      value: rec.comboValue,
      icon: "✨",
    });

    const nextSurvey: AiSurveyState = {
      ...currentSurvey,
      anchorPlaceId: rec.anchorPlaceId,
      destinationText: rec.title,
      district: rec.district,
      region: rec.region,
      selectedPlaceIds: [rec.anchorPlaceId],
    };

    return {
      text: spotsText,
      options,
      updatedSurvey: nextSurvey,
    };
  }

  // =========================================================================
  // 6. GENERAL DISTRICT INQUIRY (User mentions district without duration)
  // e.g. "ở cẩm khê có gì", "huyện đoan hùng có điểm du lịch và ăn uống gì", "tam nông có gì chơi và ăn gì", "cho tôi biết về đà bắc"
  // =========================================================================
  if (matchedDistrict && !hasDuration) {
    let overviewText = `Dạ chào bạn! Khám phá **${matchedDistrict.name}** (${matchedDistrict.province}) – ${matchedDistrict.title.split("–")[1]?.trim() || "vùng đất giàu bản sắc văn hóa & cảnh sắc"}:\n\n` +
      `${matchedDistrict.intro}\n\n` +
      `🏞️ **Địa điểm du lịch & trải nghiệm tiêu biểu:**\n`;

    matchedDistrict.attractions.forEach((a, i) => {
      overviewText += `${i + 1}. ${a.icon} **${a.name}**: ${a.desc}\n`;
    });

    overviewText += `\n🥢 **Ẩm thực & Đặc sản nức tiếng:**\n`;
    matchedDistrict.culinary.forEach((c) => {
      overviewText += `• **${c.dish}**: ${c.desc} *(Địa chỉ: ${c.places})*\n`;
    });

    if (matchedDistrict.recommendedStay) {
      overviewText += `\n🏨 **Lưu trú gợi ý:** ${matchedDistrict.recommendedStay}\n`;
    }

    overviewText += `\nBạn dự định đi trong **mấy ngày** để em hoàn thiện lịch trình tối ưu nhất cho đoàn mình ạ? (Bạn có thể chọn nhanh bên dưới hoặc gõ trực tiếp):`;

    const nextSurvey: AiSurveyState = {
      ...currentSurvey,
      anchorPlaceId: DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung",
      destinationText: matchedDistrict.title,
      district: matchedDistrict.name,
      region: matchedDistrict.province,
      selectedPlaceIds: [DISTRICT_TO_ANCHOR_MAP[matchedDistrict.id] || "den-hung"],
    };

    const options = [
      { label: `⭐ 2 ngày 1 đêm (${matchedDistrict.name} - ${currentTrav} người)`, value: `choose_dur_2_${nextSurvey.anchorPlaceId}`, icon: "⭐" },
      { label: `⚡ Đi trong ngày (1 ngày - ${currentTrav} người)`, value: `choose_dur_1_${nextSurvey.anchorPlaceId}`, icon: "⚡" },
      { label: `🌿 3 ngày 2 đêm (${matchedDistrict.name} - ${currentTrav} người)`, value: `choose_dur_3_${nextSurvey.anchorPlaceId}`, icon: "🌿" },
      { label: `🥢 Chi tiết món ngon & quán ăn ${matchedDistrict.name}`, value: `explore_food_${matchedDistrict.id}`, icon: "🍲" },
      { label: `🏞️ Xem chi tiết các điểm tham quan`, value: `explore_spots_${matchedDistrict.id}`, icon: "📍" },
    ];

    return {
      text: overviewText,
      options,
      updatedSurvey: nextSurvey,
    };
  }

  // =========================================================================
  // 7. ITINERARY GENERATION (Both Destination AND Duration are present)
  // =========================================================================
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

  // =========================================================================
  // 8. CASE C: We have Destination, but missing Duration
  // =========================================================================
  if (hasDestination && !hasDuration) {
    const destInfo = destinationMatched || DESTINATION_MAPPINGS.find((d) => d.placeId === survey.anchorPlaceId);
    const destName = destInfo ? destInfo.name : survey.destinationText;
    const descText = destInfo ? destInfo.desc : "";
    const travelerText = survey.travelers ? `cho đoàn **${survey.travelers} người** ` : "";

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

  // =========================================================================
  // 9. CASE D: We have Duration / Travelers, but missing Destination
  // =========================================================================
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
