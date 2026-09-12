export interface DistrictAttraction {
  name: string;
  category: string;
  desc: string;
  location?: string;
  icon: string;
}

export interface DistrictCulinary {
  dish: string;
  desc: string;
  places?: string;
  tips?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  oldName: string;
  province: "Phú Thọ" | "Vĩnh Phúc" | "Hòa Bình";
  title: string;
  intro: string;
  keywords: string[];
  attractions: DistrictAttraction[];
  culinary: DistrictCulinary[];
  recommendedStay?: string;
  comboActionValue: string;
  comboActionLabel: string;
}

const DEMO_ATTRACTIONS: DistrictAttraction[] = [
  {
    name: "Điểm tham quan mẫu",
    category: "Khám phá - văn hóa",
    desc: "Dữ liệu mẫu demo. Bạn có thể cập nhật thông tin địa danh thực tế tại đây.",
    icon: "📍"
  }
];

const DEMO_CULINARY: DistrictCulinary[] = [
  {
    dish: "Món ăn đặc sản mẫu",
    desc: "Dữ liệu mẫu demo ẩm thực địa phương. Vui lòng bổ sung theo nhu cầu.",
    places: "Khu ẩm thực địa phương"
  }
];

export const DISTRICT_DATABASE: Record<string, DistrictInfo> = {
  "viet-tri": {
    id: "viet-tri",
    name: "TP. Việt Trì",
    oldName: "Việt Trì cũ",
    province: "Phú Thọ",
    title: "TP. Việt Trì – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về TP. Việt Trì. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["việt trì", "viet tri", "tp việt trì", "thành phố việt trì", "đền hùng", "den hung", "hùng lô", "hung lo", "hồ văn lang", "bến gót", "bạch hạc", "việt trì cũ"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại TP. Việt Trì",
    comboActionValue: "viet-tri",
    comboActionLabel: "Khám phá TP. Việt Trì"
  },
  "thi-xa-phu-tho": {
    id: "thi-xa-phu-tho",
    name: "Thị xã Phú Thọ",
    oldName: "Thị xã Phú Thọ cũ",
    province: "Phú Thọ",
    title: "Thị xã Phú Thọ – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Thị xã Phú Thọ. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["thị xã phú thọ", "thi xa phu tho", "tx phú thọ", "tx phu tho", "thị xã phú thọ cũ", "hà thạch", "sai nga", "thanh minh"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Thị xã Phú Thọ",
    comboActionValue: "thi-xa-phu-tho",
    comboActionLabel: "Khám phá Thị xã Phú Thọ"
  },
  "lam-thao": {
    id: "lam-thao",
    name: "Huyện Lâm Thao",
    oldName: "Lâm Thao cũ",
    province: "Phú Thọ",
    title: "Huyện Lâm Thao – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Lâm Thao. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["lâm thao", "lam thao", "huyện lâm thao", "lâm thao cũ", "sơn vi", "xuân lũng", "bánh dòng", "tứ xã", "trò trám", "dục mỹ"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Lâm Thao",
    comboActionValue: "lam-thao",
    comboActionLabel: "Khám phá Huyện Lâm Thao"
  },
  "phu-ninh": {
    id: "phu-ninh",
    name: "Huyện Phù Ninh",
    oldName: "Phù Ninh cũ",
    province: "Phú Thọ",
    title: "Huyện Phù Ninh – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Phù Ninh. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["phù ninh", "phu ninh", "huyện phù ninh", "phù ninh cũ", "an thái", "chùa lộc vân", "đền nhà bà", "rươi sông lô", "trạm thản"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Phù Ninh",
    comboActionValue: "phu-ninh",
    comboActionLabel: "Khám phá Huyện Phù Ninh"
  },
  "ha-hoa": {
    id: "ha-hoa",
    name: "Huyện Hạ Hòa",
    oldName: "Hạ Hòa cũ",
    province: "Phú Thọ",
    title: "Huyện Hạ Hòa – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Hạ Hòa. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["hạ hòa", "ha hoa", "huyện hạ hòa", "hạ hòa cũ", "âu cơ", "đền mẫu âu cơ", "đầm ao châu", "ao châu", "ao giời suối tiên", "hiền lương", "quân khê"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Hạ Hòa",
    comboActionValue: "ha-hoa",
    comboActionLabel: "Khám phá Huyện Hạ Hòa"
  },
  "doan-hung": {
    id: "doan-hung",
    name: "Huyện Đoan Hùng",
    oldName: "Đoan Hùng cũ",
    province: "Phú Thọ",
    title: "Huyện Đoan Hùng – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Đoan Hùng. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["đoan hùng", "doan hung", "huyện đoan hùng", "đoan hùng cũ", "bưởi đoan hùng", "bưởi sửu", "bằng luân", "chí đám", "chiến thắng sông lô", "sông lô đoan hùng", "tượng đài chiến thắng"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Đoan Hùng",
    comboActionValue: "doan-hung",
    comboActionLabel: "Khám phá Huyện Đoan Hùng"
  },
  "cam-khe": {
    id: "cam-khe",
    name: "Huyện Cẩm Khê",
    oldName: "Cẩm Khê cũ",
    province: "Phú Thọ",
    title: "Huyện Cẩm Khê – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Cẩm Khê. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["cẩm khê", "cam khe", "huyện cẩm khê", "cẩm khê cũ", "cá thính", "tiên động", "chùa bồng lai", "rộc trịnh", "sông thao", "vạn thắng"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Cẩm Khê",
    comboActionValue: "cam-khe",
    comboActionLabel: "Khám phá Huyện Cẩm Khê"
  },
  "thanh-ba": {
    id: "thanh-ba",
    name: "Huyện Thanh Ba",
    oldName: "Thanh Ba cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Ba – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Thanh Ba. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["thanh ba", "thanh ba cũ", "huyện thanh ba", "vân hội", "đầm vân hội", "chè búp tím", "chùa bút", "quảng nạp"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Thanh Ba",
    comboActionValue: "thanh-ba",
    comboActionLabel: "Khám phá Huyện Thanh Ba"
  },
  "tam-nong": {
    id: "tam-nong",
    name: "Huyện Tam Nông",
    oldName: "Tam Nông cũ",
    province: "Phú Thọ",
    title: "Huyện Tam Nông – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Tam Nông. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tam nông", "tam nong", "huyện tam nông", "tam nông cũ", "vườn vua", "vuon vua", "vườn vua resort", "bạch thủy", "đầm sen bạch thủy", "phúc thánh", "bánh hòn"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Tam Nông",
    comboActionValue: "tam-nong",
    comboActionLabel: "Khám phá Huyện Tam Nông"
  },
  "thanh-thuy": {
    id: "thanh-thuy",
    name: "Huyện Thanh Thủy",
    oldName: "Thanh Thủy cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Thủy – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Thanh Thủy. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["thanh thủy", "thanh thuy", "huyện thanh thủy", "thanh thủy cũ", "suối khoáng nóng", "khoáng nóng thanh thủy", "đảo ngọc xanh", "đền lăng sương", "onsen", "wyndham", "tre nguồn", "bamboo"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Thanh Thủy",
    comboActionValue: "thanh-thuy",
    comboActionLabel: "Khám phá Huyện Thanh Thủy"
  },
  "thanh-son": {
    id: "thanh-son",
    name: "Huyện Thanh Sơn",
    oldName: "Thanh Sơn cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Sơn – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Thanh Sơn. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["thanh sơn", "thanh son", "huyện thanh sơn", "thanh sơn cũ", "thịt chua thanh sơn", "nghị thịnh", "thác chòi", "cự thắng", "văn hóa mường"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Thanh Sơn",
    comboActionValue: "thanh-son",
    comboActionLabel: "Khám phá Huyện Thanh Sơn"
  },
  "tan-son": {
    id: "tan-son",
    name: "Huyện Tân Sơn",
    oldName: "Tân Sơn cũ",
    province: "Phú Thọ",
    title: "Huyện Tân Sơn – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Tân Sơn. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tân sơn", "tan son", "huyện tân sơn", "tân sơn cũ", "long cốc", "long coc", "đồi chè long cốc", "xuân sơn", "xuan son", "vườn quốc gia xuân sơn", "hang lạng", "bản cỏi", "bản dù", "gà nhiều cựa"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Tân Sơn",
    comboActionValue: "tan-son",
    comboActionLabel: "Khám phá Huyện Tân Sơn"
  },
  "yen-lap": {
    id: "yen-lap",
    name: "Huyện Yên Lập",
    oldName: "Yên Lập cũ",
    province: "Phú Thọ",
    title: "Huyện Yên Lập – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Yên Lập. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["yên lập", "yen lap", "huyện yên lập", "yên lập cũ", "hồ ly", "hồ thượng long", "ho ly", "thượng long", "núi rừng yên lập"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Yên Lập",
    comboActionValue: "yen-lap",
    comboActionLabel: "Khám phá Huyện Yên Lập"
  },
  "vinh-yen": {
    id: "vinh-yen",
    name: "TP. Vĩnh Yên",
    oldName: "Vĩnh Yên cũ",
    province: "Vĩnh Phúc",
    title: "TP. Vĩnh Yên – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về TP. Vĩnh Yên. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["vĩnh yên", "vinh yen", "tp vĩnh yên", "thành phố vĩnh yên", "đầm vạc", "dam vac", "chùa tích sơn", "chùa hà tiên", "quảng trường vĩnh yên"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại TP. Vĩnh Yên",
    comboActionValue: "vinh-yen",
    comboActionLabel: "Khám phá TP. Vĩnh Yên"
  },
  "phuc-yen": {
    id: "phuc-yen",
    name: "TP. Phúc Yên",
    oldName: "Phúc Yên cũ",
    province: "Vĩnh Phúc",
    title: "TP. Phúc Yên – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về TP. Phúc Yên. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["phúc yên", "phuc yen", "tp phúc yên", "thành phố phúc yên", "đại lải", "dai lai", "hồ đại lải", "flamingo đại lải", "ngọc thanh"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại TP. Phúc Yên",
    comboActionValue: "phuc-yen",
    comboActionLabel: "Khám phá TP. Phúc Yên"
  },
  "tam-dao": {
    id: "tam-dao",
    name: "Huyện Tam Đảo",
    oldName: "Tam Đảo cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Tam Đảo – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Tam Đảo. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tam đảo", "tam dao", "huyện tam đảo", "tam đảo cũ", "tây thiên", "tay thien", "nhà thờ đá tam đảo", "quán gió", "cầu mây", "thác bạc", "đại bảo tháp mandala"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Tam Đảo",
    comboActionValue: "tam-dao",
    comboActionLabel: "Khám phá Huyện Tam Đảo"
  },
  "binh-xuyen": {
    id: "binh-xuyen",
    name: "Huyện Bình Xuyên",
    oldName: "Bình Xuyên cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Bình Xuyên – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Bình Xuyên. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["bình xuyên", "binh xuyen", "huyện bình xuyên", "bình xuyên cũ", "hương canh", "gốm hương canh", "bánh hòn hương canh", "hồ gia khau"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Bình Xuyên",
    comboActionValue: "binh-xuyen",
    comboActionLabel: "Khám phá Huyện Bình Xuyên"
  },
  "vinh-tuong": {
    id: "vinh-tuong",
    name: "Huyện Vĩnh Tường",
    oldName: "Vĩnh Tường cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Vĩnh Tường – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Vĩnh Tường. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["vĩnh tường", "vinh tuong", "huyện vĩnh tường", "vĩnh tường cũ", "đầm rưng", "thổ tang", "đình thổ tang", "lý nhân", "bánh trùng mật mía", "vĩnh thịnh"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Vĩnh Tường",
    comboActionValue: "vinh-tuong",
    comboActionLabel: "Khám phá Huyện Vĩnh Tường"
  },
  "yen-lac": {
    id: "yen-lac",
    name: "Huyện Yên Lạc",
    oldName: "Yên Lạc cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Yên Lạc – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Yên Lạc. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["yên lạc", "yen lac", "huyện yên lạc", "yên lạc cũ", "đồng đậu", "di chỉ đồng đậu", "tề lỗ", "chùa biện sơn"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Yên Lạc",
    comboActionValue: "yen-lac",
    comboActionLabel: "Khám phá Huyện Yên Lạc"
  },
  "lap-thach": {
    id: "lap-thach",
    name: "Huyện Lập Thạch",
    oldName: "Lập Thạch cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Lập Thạch – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Lập Thạch. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["lập thạch", "lap thach", "huyện lập thạch", "lập thạch cũ", "cá thính lập thạch", "tháp chùa trò", "trần nguyên hãn", "đền trần nguyên hãn"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Lập Thạch",
    comboActionValue: "lap-thach",
    comboActionLabel: "Khám phá Huyện Lập Thạch"
  },
  "song-lo": {
    id: "song-lo",
    name: "Huyện Sông Lô",
    oldName: "Sông Lô cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Sông Lô – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Sông Lô. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["sông lô", "song lo", "huyện sông lô", "sông lô cũ", "núi sáng", "thác bay", "tuệ đức", "thiền viện tuệ đức", "hang đề thám"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Sông Lô",
    comboActionValue: "song-lo",
    comboActionLabel: "Khám phá Huyện Sông Lô"
  },
  "tam-duong": {
    id: "tam-duong",
    name: "Huyện Tam Dương",
    oldName: "Tam Dương cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Tam Dương – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Tam Dương. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tam dương", "tam duong", "huyện tam dương", "tam dương cũ", "hướng đạo", "dứa hướng đạo", "gà đồi tam dương"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Tam Dương",
    comboActionValue: "tam-duong",
    comboActionLabel: "Khám phá Huyện Tam Dương"
  },
  "tp-hoa-binh": {
    id: "tp-hoa-binh",
    name: "TP. Hòa Bình",
    oldName: "TP. Hòa Bình cũ",
    province: "Hòa Bình",
    title: "TP. Hòa Bình – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về TP. Hòa Bình. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tp hòa bình", "hòa bình", "hoa binh", "thành phố hòa bình", "tp hòa bình cũ", "thủy điện hòa bình", "bảo tàng mường", "giang mỗ", "sông đà"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại TP. Hòa Bình",
    comboActionValue: "tp-hoa-binh",
    comboActionLabel: "Khám phá TP. Hòa Bình"
  },
  "mai-chau": {
    id: "mai-chau",
    name: "Huyện Mai Châu",
    oldName: "Mai Châu cũ",
    province: "Hòa Bình",
    title: "Huyện Mai Châu – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Mai Châu. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["mai châu", "mai chau", "huyện mai châu", "mai châu cũ", "bản lác", "ban lac", "thung khe", "đèo đá trắng", "hang kia", "pà cò", "cơm lam mai châu"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Mai Châu",
    comboActionValue: "mai-chau",
    comboActionLabel: "Khám phá Huyện Mai Châu"
  },
  "kim-boi": {
    id: "kim-boi",
    name: "Huyện Kim Bôi",
    oldName: "Kim Bôi cũ",
    province: "Hòa Bình",
    title: "Huyện Kim Bôi – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Kim Bôi. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["kim bôi", "kim boi", "huyện kim bôi", "kim bôi cũ", "khoáng nóng kim bôi", "suối khoáng kim bôi", "serena resort", "serena kim bôi", "thác bạc kim bôi"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Kim Bôi",
    comboActionValue: "kim-boi",
    comboActionLabel: "Khám phá Huyện Kim Bôi"
  },
  "cao-phong": {
    id: "cao-phong",
    name: "Huyện Cao Phong",
    oldName: "Cao Phong cũ",
    province: "Hòa Bình",
    title: "Huyện Cao Phong – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Cao Phong. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["cao phong", "cao phong cũ", "huyện cao phong", "thung nai", "thung nai sông đà", "đền thác bờ", "cam cao phong", "động thác bờ"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Cao Phong",
    comboActionValue: "cao-phong",
    comboActionLabel: "Khám phá Huyện Cao Phong"
  },
  "luong-son": {
    id: "luong-son",
    name: "Huyện Lương Sơn",
    oldName: "Lương Sơn cũ",
    province: "Hòa Bình",
    title: "Huyện Lương Sơn – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Lương Sơn. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["lương sơn", "luong son", "huyện lương sơn", "lương sơn cũ", "động đá bạc", "ivory resort", "sân golf phượng hoàng", "thịt trâu lá lồm"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Lương Sơn",
    comboActionValue: "luong-son",
    comboActionLabel: "Khám phá Huyện Lương Sơn"
  },
  "da-bac": {
    id: "da-bac",
    name: "Huyện Đà Bắc",
    oldName: "Đà Bắc cũ",
    province: "Hòa Bình",
    title: "Huyện Đà Bắc – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Đà Bắc. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["đà bắc", "da bac", "huyện đà bắc", "đà bắc cũ", "đá bia", "ké", "hiền lương", "tiền phong", "vịnh ngòi hoa", "cbt đà bắc"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Đà Bắc",
    comboActionValue: "da-bac",
    comboActionLabel: "Khám phá Huyện Đà Bắc"
  },
  "tan-lac": {
    id: "tan-lac",
    name: "Huyện Tân Lạc",
    oldName: "Tân Lạc cũ",
    province: "Hòa Bình",
    title: "Huyện Tân Lạc – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Tân Lạc. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["tân lạc", "tan lac", "huyện tân lạc", "tân lạc cũ", "mường bi", "lũng vân", "lung van", "động nam sơn", "nam sơn"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Tân Lạc",
    comboActionValue: "tan-lac",
    comboActionLabel: "Khám phá Huyện Tân Lạc"
  },
  "lac-son": {
    id: "lac-son",
    name: "Huyện Lạc Sơn",
    oldName: "Lạc Sơn cũ",
    province: "Hòa Bình",
    title: "Huyện Lạc Sơn – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Lạc Sơn. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["lạc sơn", "lac son", "huyện lạc sơn", "lạc sơn cũ", "thác mu", "thac mu", "miền đồi", "mường vang", "hang mãn nguyện"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Lạc Sơn",
    comboActionValue: "lac-son",
    comboActionLabel: "Khám phá Huyện Lạc Sơn"
  },
  "lac-thuy": {
    id: "lac-thuy",
    name: "Huyện Lạc Thủy",
    oldName: "Lạc Thủy cũ",
    province: "Hòa Bình",
    title: "Huyện Lạc Thủy – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Lạc Thủy. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["lạc thủy", "lac thuy", "huyện lạc thủy", "lạc thủy cũ", "chùa tiên", "đầm đa", "chùa tiên đầm đa", "chi nê", "nhà máy in tiền chi nê", "dê núi lạc thủy"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Lạc Thủy",
    comboActionValue: "lac-thuy",
    comboActionLabel: "Khám phá Huyện Lạc Thủy"
  },
  "yen-thuy": {
    id: "yen-thuy",
    name: "Huyện Yên Thủy",
    oldName: "Yên Thủy cũ",
    province: "Hòa Bình",
    title: "Huyện Yên Thủy – Cổng thông tin du lịch & trải nghiệm",
    intro: "Giới thiệu tổng quan về Huyện Yên Thủy. Bạn có thể chỉnh sửa nội dung giới thiệu chi tiết theo đề tài của mình.",
    keywords: ["yên thủy", "yen thuy", "huyện yên thủy", "yên thủy cũ", "chùa hang yên thủy", "cây đa xóm rộc", "yên trị"],
    attractions: DEMO_ATTRACTIONS,
    culinary: DEMO_CULINARY,
    recommendedStay: "Nhà nghỉ / Homestay / Khách sạn tại Huyện Yên Thủy",
    comboActionValue: "yen-thuy",
    comboActionLabel: "Khám phá Huyện Yên Thủy"
  },
};

export function findDistrictByQuery(text: string): DistrictInfo | undefined {
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");

  const specificDistricts = Object.values(DISTRICT_DATABASE).filter(
    (d) => d.id !== "tp-hoa-binh" && d.id !== "vinh-yen" && d.id !== "viet-tri"
  );
  const capitalDistricts = Object.values(DISTRICT_DATABASE).filter(
    (d) => d.id === "tp-hoa-binh" || d.id === "vinh-yen" || d.id === "viet-tri"
  );

  const candidates: Array<{ info: DistrictInfo; kw: string; length: number }> = [];

  for (const info of specificDistricts) {
    for (const kw of info.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ]/g, "d");
      const regex = new RegExp(`\\b${normKw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
      if (regex.test(lower) || lower.includes(normKw)) {
        candidates.push({ info, kw: normKw, length: normKw.length });
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0].info;
  }

  const capitalCandidates: Array<{ info: DistrictInfo; kw: string; length: number }> = [];
  for (const info of capitalDistricts) {
    for (const kw of info.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ]/g, "d");
      const regex = new RegExp(`\\b${normKw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
      if (regex.test(lower) || lower.includes(normKw)) {
        capitalCandidates.push({ info, kw: normKw, length: normKw.length });
      }
    }
  }

  if (capitalCandidates.length > 0) {
    capitalCandidates.sort((a, b) => b.length - a.length);
    return capitalCandidates[0].info;
  }

  return undefined;
}
