"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  categoryIcons,
  categoryLabels,
  regionLabels,
  type Region,
  type PlaceRegion,
  foodRegions,
  places,
  phuTho100Directory,
  comprehensiveServices,
  type ServiceItem,
  type DirectoryPlace,
  type Category,
  type FoodDish,
  type FoodSeller,
  type NearbyItem,
  type Place,
} from "@/data/travel";
import { culturalEvents } from "@/data/events";
import { tourTemplates, type TourTemplate } from "@/data/itineraryTemplates";
import { buildItinerary, DISTRICT_TRAVEL_GUIDES, type GeneratedItinerary } from "@/lib/guidePlanner";

const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";

type Tab = "explore" | "trip" | "near" | "saved" | "profile";
type SavedSubTab = "places" | "foods" | "itinerary";
type AudioState = "idle" | "playing" | "paused";

type UserReview = {
  id: string;
  placeId: string;
  name: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
};

type CartLine = {
  dishId: string;
  sellerId: string;
  quantity: number;
};

type BookingOffer = {
  place: Place;
  stay: NearbyItem;
};

type SeasonFilter = "Tất cả" | "Đang hợp mùa" | "Mùa xuân" | "Mùa hè" | "Mùa thu" | "Mùa đông";

type NearItem = {
  id: string;
  name: string;
  type: string;
  icon: string;
  province?: string;
  lat: number;
  lng: number;
  note: string;
  address?: string;
  phone?: string;
  place?: Place;
};

type SearchSuggestion =
  | { id: string; kind: "place"; label: string; meta: string; icon: string; place: Place }
  | { id: string; kind: "food"; label: string; meta: string; icon: string; dish: FoodDish };

const categories = categoryLabels.map((label) => ({ label, icon: categoryIcons[label] }));
const foodCatalog = foodRegions.flatMap((region) => region.dishes.map((dish) => ({ dish, region })));
const seasonFilters: SeasonFilter[] = ["Tất cả", "Đang hợp mùa", "Mùa xuân", "Mùa hè", "Mùa thu", "Mùa đông"];
const seasonMonths: Record<Exclude<SeasonFilter, "Tất cả" | "Đang hợp mùa">, number[]> = {
  "Mùa xuân": [1, 2, 3, 4],
  "Mùa hè": [5, 6, 7],
  "Mùa thu": [8, 9, 10],
  "Mùa đông": [11, 12, 1],
};
const mapBounds = { minLat: 20.55, maxLat: 21.65, minLng: 104.85, maxLng: 105.75 };

const navigation: { id: Tab; label: string; icon: string }[] = [
  { id: "explore", label: "Khám phá", icon: "⌕" },
  { id: "trip", label: "Lịch trình", icon: "▤" },
  { id: "near", label: "Gần tôi", icon: "⌖" },
  { id: "saved", label: "Đã lưu", icon: "♡" },
  { id: "profile", label: "Cá nhân", icon: "♙" },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(distance: number) {
  if (distance < 1) return `${Math.max(50, Math.round((distance * 1000) / 50) * 50)} m`;
  if (distance > 999) return `${Math.round(distance).toLocaleString("vi-VN")} km`;
  return `${distance.toFixed(distance < 10 ? 1 : 0).replace(".", ",")} km`;
}

export type CurrencyCode = "VND" | "USD" | "CNY" | "KRW" | "JPY";
export type LanguageCode = "vi" | "en" | "zh" | "ko" | "ja";

export const CURRENCIES: Record<CurrencyCode, { label: string; symbol: string; rate: number; flag: string }> = {
  VND: { label: "VND (₫)", symbol: "₫", rate: 1, flag: "🇻🇳" },
  USD: { label: "USD ($)", symbol: "$", rate: 1 / 25450, flag: "🇺🇸" },
  CNY: { label: "CNY (¥)", symbol: "¥", rate: 1 / 3520, flag: "🇨🇳" },
  KRW: { label: "KRW (₩)", symbol: "₩", rate: 1 / 18.5, flag: "🇰🇷" },
  JPY: { label: "JPY (¥)", symbol: "¥", rate: 1 / 168, flag: "🇯🇵" },
};

export const LANGUAGES: Record<LanguageCode, { label: string; flag: string }> = {
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  en: { label: "English", flag: "🇬🇧" },
  zh: { label: "中文 (Chinese)", flag: "🇨🇳" },
  ko: { label: "한국어 (Korean)", flag: "🇰🇷" },
  ja: { label: "日本語 (Japanese)", flag: "🇯🇵" },
};

export type Voucher = {
  code: string;
  title: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  description: string;
  badge: string;
  expiry: string;
};

export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    code: "DATTO10",
    title: "Ưu đãi Di Sản 10%",
    discountPercent: 10,
    minSpend: 200000,
    description: "Giảm 10% tối đa 100.000đ cho mọi đơn đặt vé tour và đặc sản OCOP Đất Tổ.",
    badge: "HOT DEAL",
    expiry: "31/12/2026",
  },
  {
    code: "LEHOI2026",
    title: "Mùa Lễ Hội Giảm 20%",
    discountPercent: 20,
    minSpend: 500000,
    description: "Khuyến mãi mừng Lễ hội Đền Hùng 2026, áp dụng cho nhóm từ 2 người.",
    badge: "LỄ HỘI",
    expiry: "30/06/2026",
  },
  {
    code: "OCOP50K",
    title: "Quà Tặng OCOP 50.000đ",
    discountAmount: 50000,
    minSpend: 300000,
    description: "Giảm ngay 50.000đ cho đơn hàng thịt chua, chè Long Cốc, bánh tai từ 300k.",
    badge: "OCOP",
    expiry: "31/12/2026",
  },
  {
    code: "CHECKINPHUTHO",
    title: "Check-in Đất Tổ 30.000đ",
    discountAmount: 30000,
    minSpend: 150000,
    description: "Tặng 30.000đ khi lưu điểm đến và check-in các di tích lịch sử Phú Thọ.",
    badge: "CHECK-IN",
    expiry: "31/12/2026",
  },
  {
    code: "COMBOFAMILY",
    title: "Combo Gia Đình Giảm 15%",
    discountPercent: 15,
    minSpend: 800000,
    description: "Ưu đãi cho tour gia đình du lịch trải nghiệm 3 tỉnh Phú Thọ - Vĩnh Phúc - Hòa Bình.",
    badge: "FAMILY",
    expiry: "31/12/2026",
  },
];

export const PAYMENT_METHODS = [
  { id: "vietqr", label: "VietQR / Chuyển khoản", icon: "🏦", desc: "Quét mã QR ngân hàng tự động" },
  { id: "momo", label: "Ví MoMo", icon: "📱", desc: "Thanh toán siêu tốc qua MoMo" },
  { id: "zalopay", label: "Ví ZaloPay", icon: "⚡", desc: "Liên kết trực tiếp ZaloPay" },
  { id: "card", label: "Thẻ Visa / MasterCard", icon: "💳", desc: "Thanh toán thẻ quốc tế an toàn" },
  { id: "paypal", label: "PayPal", icon: "🌐", desc: "Dành cho du khách quốc tế" },
  { id: "cod", label: "Thanh toán khi nhận", icon: "💵", desc: "Trả tiền mặt khi nhận hàng/vé" },
];

export const UI_TEXT = {
  vi: {
    rewardTicket1Badge: "VOUCHER 30.000Đ",
    rewardTicket1Btn: "Nhận mã ngay →",
    rewardTicket2Badge: "ƯU ĐÃI NHÓM 15% – 20%",
    rewardTicket2Btn: "Lên tour áp dụng →",
    rewardTicket3Badge: "QUÀ TẶNG OCOP 5 SAO",
    rewardTicket3Btn: "Khám phá OCOP →",
    rewardStepsTitle: "3 BƯỚC ĐƠN GIẢN ĐỂ NHẬN THƯỞNG:",
    rewardStep1: "Chọn điểm đến hoặc tour di sản yêu thích",
    rewardStep2: "Lưu sổ tay hoặc nghe Thuyết minh AI di sản",
    rewardStep3: "Nhận Voucher giảm trừ hoặc quà tặng OCOP",
    heroTrendingLabel: "Gợi ý hot:",
    heroTagHungTemple: "Đền Hùng",
    heroTagHotSpring: "Khoáng nóng Thanh Thủy",
    heroTagLongCoc: "Đồi chè Long Cốc",
    heroTagTamDao: "Tam Đảo",
    heroTagOcopFood: "Đặc sản OCOP",
    heroBadgeHeritage: "Di tích Quốc gia Đặc biệt · Đất Tổ Hùng Vương",
    heroBadgeAudio: "Thuyết minh AI 5 ngôn ngữ",
    heroTrustOcop: "Đặc sản OCOP chuẩn tỉnh",
    heroTrustLanguages: "Ngôn ngữ thuyết minh AI",
    audioResume: "▶ Nghe tiếp",
    modalGoodSeason: "Thời điểm tuyệt đẹp để đi trong tháng",
    modalCautionSeason: "Cần lưu ý thời tiết trong tháng",
    brandSubtitle: "PHÚ THỌ · VĨNH PHÚC · HÒA BÌNH",
    explore: "Khám phá",
    trip: "Lịch trình",
    near: "Gần tôi",
    saved: "Đã lưu",
    profile: "Cá nhân",
    cart: "Giỏ hàng",
    vouchers: "Khuyến mãi",
    searchPlaceholder: "Tìm đền chùa, danh thắng, đặc sản OCOP...",
    heroKicker: "VỀ MIỀN DI SẢN CỘI NGUỒN",
    heroTitle1: "Đi đúng mùa.",
    heroTitle2: "Chạm đúng Đất Tổ.",
    heroDesc: "Khám phá trọn vẹn danh lam thắng cảnh, di sản văn hóa và ẩm thực nức tiếng của 3 tỉnh Phú Thọ – Vĩnh Phúc – Hòa Bình.",
    featuredDestCaption: "ĐIỂM ĐẾN NỔI BẬT",
    openGuideBtn: "Mở cẩm nang →",
    stampOriginTitle: "CỘI NGUỒN",
    stampOriginSub: "DÂN TỘC",
    heritageTag1: "✦ CHƯƠNG TRÌNH ĐẶC BIỆT 2026",
    heritageTag2: "✦ DU LỊCH DI SẢN & TÍCH ĐIỂM ĐỔI QUÀ",
    heritageTitle: "Hành Trình Về Nguồn — Khám Phá Nhận Thưởng OCOP",
    heritageDesc: "Tham gia hành trình di sản 3 tỉnh Phú Thọ – Vĩnh Phúc – Hòa Bình, check-in các điểm đến biểu tượng để tích lũy điểm thưởng và nhận ngay các voucher quà tặng đặc sản độc quyền.",
    perk1Title: "🏛️ Check-in Đền Hùng",
    perk1Desc: "Tặng ngay voucher 30.000đ khi lưu điểm đến và kích hoạt thuyết minh AI di sản.",
    perk2Title: "🎁 Thưởng Nhóm & Gia Đình",
    perk2Desc: "Giảm 15% - 20% cho các tour trải nghiệm văn hóa truyền thống khi đi từ 3 người.",
    perk3Title: "🍜 Tích Điểm OCOP 5 Sao",
    perk3Desc: "Đổi điểm tích lũy lấy thịt chua Thanh Sơn, chè Long Cốc và đặc sản quà biếu cao cấp.",
    viewAllVouchersBtn: "Xem tất cả ưu đãi & voucher",
    planTripRewardBtn: "Lên lịch trình nhận thưởng ✦",
    section01Num: "01",
    section01Title: "Khám phá theo địa phương & sở thích",
    viewAllBtn: "Xem tất cả →",
    selectProvinceLabel: "CHỌN TỈNH:",
    provAll: "✨ Tất cả 3 tỉnh",
    provPhuTho: "🏛️ Phú Thọ",
    provVinhPhuc: "☁️ Vĩnh Phúc",
    provHoaBinh: "🌲 Hòa Bình",
    seasonLabel: "ĐI THEO MÙA",
    seasonAll: "Tất cả",
    seasonInSeason: "Đang hợp mùa",
    seasonSpring: "Mùa xuân",
    seasonSummer: "Mùa hè",
    seasonAutumn: "Mùa thu",
    seasonWinter: "Mùa đông",
    section02Num: "02",
    section02TitleDefault: "Danh thắng tiêu biểu",
    section02TitleNear: "Gần vị trí của bạn",
    locateBtn: "⌖ Bật định vị",
    loadMorePlaces: "Xem thêm địa điểm →",
    noResultsTitle: "Chưa tìm thấy kết quả",
    noResultsDesc: "Thử tìm “săn mây”, “Đền Hùng”, “Tam Đảo”, “Mai Châu” hoặc chọn danh mục phía trên.",
    section03Num: "03",
    section03Kicker: "TRỢ LÝ LỊCH TRÌNH THÔNG MINH",
    section03Title1: "Hai ngày trọn vẹn,",
    section03Title2: "hướng dẫn viên lo hết.",
    section03Desc: "Tự động tối ưu 4 yếu tố: Tham quan · Ăn uống · Lưu trú · Di chuyển & thời gian trên toàn địa bàn 3 tỉnh Phú Thọ, Vĩnh Phúc, Hòa Bình.",
    planTripSmartBtn: "Lập lịch trình thông minh ngay →",
    suggestedTourTitle: "LỊCH TRÌNH GỢI Ý",
    routeSummary1: "⌁ Tuyến liên kết thuận tiện đường sá",
    routeSummary2: "Chi phí rõ ràng theo từng ngày",
    foodKicker: "BẢN ĐỒ ẨM THỰC ĐẶC SẢN",
    foodTitle1: "Mỗi vùng đất,",
    foodTitle2: "một phong vị riêng.",
    foodDesc: "Thưởng thức tinh hoa ẩm thực bản địa theo từng cung đường: cá lăng Đất Tổ, thịt chua Thanh Sơn, ngọn su su Tam Đảo, cỗ lá lợn mán Mai Châu.",
    foodSaveBtn: "♡ Lưu món ăn",
    foodSavedBtn: "♥ Đã lưu món",
    foodToggleView: "Xem điểm bán OCOP ▼",
    foodToggleHide: "Thu gọn ▲",
    sellerVerified: "✓ Điểm bán uy tín",
    sellerSuggested: "○ Điểm bán gợi ý",
    callSeller: "Gọi ngay",
    openMapSeller: "Mở bản đồ →",
    addToCartBtn: "＋ Thêm giỏ",
    shopeeHubTitle: "Đơn mua",
    shopeeHubHistoryLink: "Xem lịch sử mua hàng",
    shopeeStatusPending: "Chờ xác nhận",
    shopeeStatusProcessing: "Chờ lấy hàng",
    shopeeStatusShipping: "Chờ giao hàng",
    shopeeStatusCompleted: "Đánh giá",
    shopeeStatusCancelled: "Đã hủy",
    orderStatusAll: "Tất cả",
    orderStatusPending: "Chờ xác nhận",
    orderStatusProcessing: "Đang xử lý",
    orderStatusCompleted: "Hoàn thành",
    orderStatusCancelled: "Đã hủy",
    myOrders: "Đơn mua của tôi",
    checkout: "Thanh toán",
    paymentMethods: "Phương thức thanh toán",
    applyVoucher: "Áp dụng mã",
    discount: "Giảm giá",
    totalPayment: "Tổng thanh toán",
    floatingCartLabel: "Giỏ hàng",
    floatingCartSubDefault: "Đặc sản OCOP",
    passportKicker: "HỘ CHIẾU DU LỊCH 3 TỈNH",
    passportTitle1: "Sưu tập dấu chân,",
    passportTitle2: "mở khóa đặc quyền.",
    passportProgress: "điểm đã check-in · Thêm dấu để nhận quà tặng lưu niệm Đất Tổ",
    quickBookKicker: "ĐẶT DỊCH VỤ NHANH",
    quickBookTitle: "Mọi thứ cho chuyến đi của bạn",
    btnTourDesignTitle: "Thiết kế tour theo yêu cầu",
    btnTourDesignSub: "Tự động lập tuyến trong 1 phút",
    btnHotelsTitle: "Khách sạn & Homestay",
    btnHotelsSub: "Phú Thọ · Tam Đảo · Mai Châu · Kim Bôi",
    btnVouchersTitle: "Kho Voucher & Mã Khuyến Mãi",
    btnVouchersSub: "Ưu đãi đặt đặc sản OCOP và dịch vụ tour",
    btnOcopTitle: "Đặc sản làm quà (OCOP)",
    btnOcopSub: "Thịt chua, ngọn su su, cơm lam…",
    partnerKicker: "DÀNH CHO ĐỐI TÁC ĐỊA PHƯƠNG",
    partnerTitle: "Quảng bá dịch vụ đến du khách.",
    partnerDesc: "Nhà hàng, homestay, hợp tác xã OCOP và đơn vị lữ hành có thể đăng ký gian hàng xác minh.",
    btnRegisterPartner: "Đăng ký đối tác →",
    toastSwitchedLang: "Đã chuyển đổi toàn bộ giao diện sang Tiếng Việt",
    // Navigation & Header
    weatherToast: "tại khu vực · Dữ liệu thời tiết trực tuyến",
    roleAdmin: "Quản trị viên",
    roleMerchant: "Chủ cơ sở OCOP",
    roleCustomer: "Du khách",
    loginAccount: "Đăng nhập tài khoản",
    searchInputPlaceholder: "Tìm Đền Hùng, Tam Đảo, Mai Châu, thịt chua, khoáng nóng…",
    searchAriaLabel: "Tìm kiếm điểm đến, món ăn hoặc chỗ nghỉ",
    searchSuggestionsMatched: "Gợi ý phù hợp với từ khóa",
    searchSuggestionsPopular: "Gợi ý điểm đến & món ngon nổi bật",
    useCurrentLocation: "Dùng vị trí hiện tại",
    // Trip Planner
    tripPageTitle1: "Lập lịch trình thông minh",
    tripPageTitle2: "cùng hướng dẫn viên bản địa.",
    tripPageDesc: "Tự động thiết kế hành trình tối ưu theo 4 yếu tố cốt lõi: 🏛️ Lộ trình tham quan · 🍲 Món ngon đặc sản · 🛏️ Khách sạn nghỉ dưỡng · 🚗 Phương tiện & thời gian di chuyển trên toàn địa bàn Phú Thọ, Vĩnh Phúc, Hòa Bình.",
    tripControllerTitle: "BỘ ĐIỀU KHIỂN LỊCH TRÌNH",
    tripCustomize: "Tùy biến chuyến đi của bạn",
    tripStep1: "1. Chọn Tỉnh / Vùng du lịch",
    tripCombine3: "✨ Ghép 3 Tỉnh",
    tripStep2: "2. Chọn Huyện / Thị xã muốn tới",
    tripAllDistricts: "Toàn bộ các huyện (Lập tuyến tự do)",
    tripDirectionGuide: "🧭 HƯỚNG DẪN ĐƯỜNG ĐI:",
    tripRecommendedRoute: "Tuyến đường khuyên dùng:",
    tripSignatureFoods: "Món ngon tiêu biểu:",
    tripStep3: "3. Chọn các điểm đến vào tour",
    tripSelected: "Đã chọn",
    tripPoints: "điểm",
    tripSuggestedCombos: "Gợi ý tuyến ghép phổ biến:",
    tripAddAll: "+ Thêm tất cả",
    tripReset: "↺ Đặt lại",
    tripStep4: "4. Số ngày đi",
    tripDays: "ngày",
    tripNights: "đêm",
    tripDayTrip: "(trong ngày)",
    tripStep5: "5. Số lượng khách",
    tripGuests: "khách",
    tripPerson: "người",
    tripCouple: "Cặp đôi",
    tripFamily: "Gia đình",
    tripGroup: "Đoàn đông",
    tripStep6: "6. Tiêu chuẩn ngân sách",
    tripBudgetEcon: "🏷️ Tiết kiệm (~500.000đ / người / ngày)",
    tripBudgetStd: "⭐ Tiêu chuẩn (~1.000.000đ / người / ngày)",
    tripBudgetPrem: "👑 Cao cấp / Nghỉ dưỡng (~2.000.000đ+ / người / ngày)",
    tripStep7: "7. Phương tiện di chuyển",
    tripCar: "Ô tô riêng",
    tripMotorbike: "Xe máy",
    tripLimousine: "Limousine / Xe khách",
    tripTaxi: "Taxi / xe hợp đồng",
    tripStep8: "8. Phong cách chuyến đi",
    tripStyleCulture: "Văn hóa & cội nguồn",
    tripStyleSpa: "Nghỉ dưỡng khoáng nóng & Onsen",
    tripStyleAdventure: "Phượt & săn mây sinh thái",
    tripStyleFamily: "Gia đình có trẻ nhỏ/người cao tuổi",
    tripStyleFood: "Ẩm thực bản địa",
    tripGenerateBtn: "✦ Tạo Lịch Trình Chi Tiết",
    tripGenerateNote: "Tự động tính quãng đường, chi phí dự toán, thực đơn và thuyết minh",
    tripStatDistance: "CỰ LY LỘ TRÌNH",
    tripStatDriveTime: "THỜI GIAN LÁI XE",
    tripStatTransport: "PHƯƠNG TIỆN",
    tripStatCost: "DỰ TOÁN / KHÁCH",
    tripDayLabel: "NGÀY",
    tripDayRoute: "Lộ trình ngày:",
    tripGuideTips: "💡 Lời khuyên Hướng dẫn viên:",
    tripSafetyTips: "🛡️ Lưu ý an toàn & di chuyển:",
    tripViewGoogleMaps: "🗺️ Xem trên Google Maps",
    tripPrintPdf: "▤ In / Xuất PDF",
    tripShare: "↗ Chia sẻ lịch trình",
    tripSaveNotebook: "♡ Lưu vào Sổ tay",
    tripTransportLabel: "Phương tiện:",
    tripSuggestedToursTitle: "LỊCH TRÌNH MẪU GỢI Ý",
    tripSuggestedToursDesc: "Lựa chọn sẵn bởi chuyên gia địa phương — nhấn để áp dụng ngay.",
    // Near Me
    nearKicker: "TIỆN ÍCH VÀ DỊCH VỤ DU LỊCH",
    nearTitle1: "Tiện ích quanh bạn",
    nearTitle2: "trên cả 3 tỉnh.",
    nearLocationNotEnabled: "Chưa bật định vị",
    nearAllowLocation: "Cho phép vị trí để tính khoảng cách thực",
    nearUpdateGPS: "Cập nhật GPS",
    nearEnableGPS: "Bật định vị GPS",
    nearAreaLabel: "KHU VỰC:",
    nearAll3Provinces: "Toàn bộ 3 tỉnh",
    nearServiceGasStation: "Trạm xăng",
    nearServiceParking: "Bãi đỗ xe",
    nearServiceMedical: "Y tế",
    nearServiceATM: "ATM",
    nearServiceEV: "Trạm sạc EV",
    nearServiceRescue: "Cứu hộ",
    nearServiceDestination: "Điểm đến",
    nearServiceFood: "Ăn uống",
    nearServiceStay: "Lưu trú",
    // Saved Tab
    savedPlacesTab: "Địa điểm",
    savedFoodsTab: "Món ăn",
    savedItineraryTab: "Lịch trình",
    savedPlacesEmpty: "Chưa lưu địa điểm nào",
    savedPlacesEmptyDesc: "Nhấn biểu tượng ♡ trên thẻ địa điểm để lưu lại các nơi bạn yêu thích.",
    savedFoodsEmpty: "Chưa lưu món ăn nào",
    savedFoodsEmptyDesc: "Bấm ♡ Lưu món ăn ở mục khám phá để thêm vào danh sách.",
    savedItineraryEmpty: "Chưa có lịch trình nào được lưu",
    savedItineraryEmptyDesc: "Vào mục \"Lịch trình\", tạo một tour phù hợp rồi bấm \"Lưu vào Sổ tay\".",
    savedCreateTrip: "Tạo lịch trình ngay →",
    savedOpenDetail: "Mở xem chi tiết →",
    savedOpenGoogleMaps: "Mở Google Maps ↗",
    savedDeleteItinerary: "Xóa",
    savedDeletedToast: "Đã xóa lịch trình khỏi sổ tay",
    savedOpenedToast: "Đã mở chi tiết lịch trình!",
    savedPerGuest: "/khách",
    // Profile
    profileSystemAdmin: "🛡️ QUẢN TRỊ VIÊN HỆ THỐNG",
    profileMerchantOwner: "🏪 CHỦ CƠ SỞ OCOP:",
    profilePartner: "ĐỐI TÁC",
    profileCustomer: "👤 DU KHÁCH ĐẤT TỔ",
    profileNotLoggedIn: "CHƯA ĐĂNG NHẬP",
    profileGuest: "Khách vãng lai",
    profileLoginVia: "Đăng nhập qua",
    profileLoginPrompt: "Đăng nhập bằng Gmail hoặc Facebook để đặt đặc sản OCOP và quản lý đơn hàng.",
    profileSwitchAccount: "Đổi tài khoản",
    profileLogout: "Đăng xuất",
    profileLoginNow: "🔑 Đăng nhập ngay",
    profileOrderMgmt: "Bảng Quản Lý Đơn Hàng (Google Sheets)",
    profileAdminOrderDesc: "Quyền Admin: Quản lý đơn · Điều phối & Xuất Sheets",
    profileMerchantOrderDesc: "Chủ cơ sở: Quản lý đơn & giao hàng",
    profileOrdersCount: "đơn",
    profileOrdersPlaced: "đơn hàng đã đặt · Bấm để xem và theo dõi tiến độ giao hàng",
    profileNoOrders: "Chưa có đơn hàng nào · Khám phá đặc sản OCOP và đặt món ngay",
    profileItems: "món",
    // Footer
    footerDesc: "Cẩm nang du lịch và trợ lý hành trình số thông minh · Tinh hoa Đất Tổ hội tụ.",
    footerLink: "Du lịch Đất Tổ ↗",
    // Auth
    authLoginTab: "Đăng nhập",
    authRegisterTab: "Đăng ký Tài khoản",
    authAdminTab: "Admin",
    authEmail: "Địa chỉ Email",
    authPassword: "Mật khẩu",
    authShowPassword: "Hiện",
    authHidePassword: "Ẩn",
    authForgotPassword: "Quên mật khẩu?",
    authLoginBtn: "Đăng nhập",
    authOrLoginWith: "hoặc đăng nhập nhanh bằng",
    authRegisterName: "Họ và tên",
    authRegisterPhone: "Số điện thoại",
    authRegisterConfirmPass: "Nhập lại mật khẩu",
    authRegisterBtn: "Đăng ký tài khoản",
    authAdminUser: "Tên đăng nhập Admin",
    authAdminPass: "Mật khẩu Admin",
    authAdminLoginBtn: "Đăng nhập Admin",
    authClose: "Đóng",
    // Directory
    directoryKicker: "DANH MỤC TRA CỨU ĐIỂM ĐẾN",
    directoryTitle: "Danh bạ 100 Điểm Du lịch – Ăn uống – Lưu trú",
    directoryDesc: "Tra cứu nhanh thông tin điểm tham quan, quán ăn và cơ sở lưu trú theo từng địa bàn.",
    directoryCollapse: "Thu gọn bảng danh bạ ▲",
    directoryExpand: "Mở toàn bộ danh bạ",
    directorySearchPlaceholder: "Tìm theo tên điểm, món ăn, khách sạn...",
    directoryAllDistricts: "Tất cả huyện/thị",
    directoryDistrictPrefix: "Huyện/Thị:",
    directoryColNo: "STT",
    directoryColName: "Tên điểm đến",
    directoryColType: "Loại hình",
    directoryColArea: "Địa bàn",
    directoryColFood: "Ẩm thực & Quán ăn gần điểm",
    directoryColStay: "Lưu trú / Khách sạn gần điểm",
    directoryColDist: "Cự ly",
    // Modal
    modalClose: "Đóng",
    modalReviews: "đánh giá tham khảo",
    modalPhoto: "Ảnh:",
    // Misc
    loginRequiredToast: "Vui lòng đăng nhập bằng Gmail hoặc Facebook để đặt hàng!",
    needAtLeast1Place: "Cần giữ ít nhất 1 điểm đến trong lịch trình!",
    registerPartnerToast: "Cảm ơn bạn! Thông tin đăng ký đối tác đã được ghi nhận.",
    openTripAssistant: "Đã mở trợ lý lập lịch trình tour",
    selectResortToast: "Chọn một điểm nghỉ dưỡng rồi mở Chỗ nghỉ gần đây",
    toastLangChanged: "Đã chuyển ngôn ngữ:",
    clearOrdersConfirm: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử đơn hàng của tài khoản này không?",
    // Audio
    audioPause: "⏸ Tạm dừng",
    audioListen: "▶ Nghe Thuyết Minh Lịch Trình",
    audioStop: "Dừng",
    audioVoiceLabel: "🗣️ Giọng đọc:",
    audioVolumeLabel: "🔊 Âm lượng:",
    audioSpeedLabel: "Tốc độ:",
    // Common & Actions
    bottomNavAria: "Điều hướng trên điện thoại",
    getDirectionsBtn: "Chỉ đường →",
    detailsBtn: "Chi tiết →",
    callNowBtn: "Gọi ngay",
    serviceListTitle: "Danh sách tiện ích",
    serviceListSub: "Sắp xếp theo cự ly gần bạn nhất",
    sosTitle: "Hotline Hỗ Trợ & Cứu Hộ Khẩn Cấp 24/7",
    sosSub: "Luôn sẵn sàng hỗ trợ quý khách trên mọi cung đường.",
    sosNationalRescue: "Cứu nạn quốc gia",
    sosPolice: "Công an",
    sosAmbulance: "Cấp cứu Y tế",
    sosTrafficRescue: "Cứu hộ giao thông",
    festivalKicker: "LỊCH LỄ HỘI VĂN HÓA",
    festivalTitle1: "Đi đúng ngày,",
    festivalTitle2: "chạm đúng lễ hội.",
    festivalDesc: "Lịch hội truyền thống được giữ nguyên theo ngày âm lịch để du khách dễ dàng sắp xếp chuyến đi.",
    bookingRequired: "CẦN ĐẶT TRƯỚC",
    openPlaceBtn: "Mở điểm đến →",
    // Shopee Hub & Commerce
    shopeePurchases: "Đơn mua",
    shopeeViewHistory: "Xem lịch sử mua hàng",
    statusPending: "Chờ xác nhận",
    statusProcessing: "Chờ lấy hàng",
    statusShipping: "Chờ giao hàng",
    statusCompleted: "Đánh giá",
    statusCancelled: "Đã hủy",
    cartEmptyTitle: "Giỏ hàng đang trống",
    cartEmptyDesc: "Khám phá bản đồ ẩm thực và thêm các món đặc sản vào giỏ.",
    viewSpecialtiesBtn: "Xem đặc sản ngay →",
    voucherPromotionsTitle: "Mã khuyến mãi & Ưu đãi",
    chooseOtherVoucherBtn: "Chọn mã khác →",
    removeVoucherTitle: "Bỏ mã",
    voucherInputPlaceholder: "Nhập mã: DATTO10, LEHOI2026...",
    applyVoucherBtn: "Áp dụng",
    currencyLabel: "Đơn vị tiền tệ:",
    subtotalLabel: "Tạm tính",
    discountVoucherLabel: "Ưu đãi giảm giá",
    authRequiredOrderTitle: "Yêu cầu đăng nhập để đặt hàng",
    authRequiredOrderDesc: "Đăng nhập bằng Gmail hoặc Facebook để lưu đơn và nhận thông báo từ cơ sở OCOP.",
    loginGoogle: "Đăng nhập bằng Gmail (Google)",
    loginFacebook: "Đăng nhập bằng Facebook",
    loginAdminLink: "🛡️ Đăng nhập Quản Trị Viên (Admin) →",
    orderAccountLabel: "Tài khoản đặt hàng:",
    changeAccountBtn: "Đổi",
    fullNameLabel: "Họ và tên người mua",
    phoneNumberLabel: "Số điện thoại liên hệ",
    shippingAddressLabel: "Địa chỉ giao hàng / Tên khách sạn",
    orderNoteLabel: "Ghi chú thêm (Thời gian giao, yêu cầu đóng hộp...)",
    orderNotePlaceholder: "Ghi chú thêm cho người bán",
    confirmOrderBtn: "Xác nhận đặt hàng",
    loginToCompleteOrder: "🔒 Đăng nhập để hoàn tất đặt hàng →",
    noOrdersInStatus: "Không có đơn hàng nào trong mục này",
    noOrdersInStatusDesc: "Chọn danh mục khác hoặc đặt thêm các món đặc sản OCOP Đất Tổ.",
    clearOrderHistoryBtn: "🗑️ Xóa sạch lịch sử đơn",
    orderNumberLabel: "Đơn hàng",
    cancelOrderBtn: "Hủy đơn hàng",
    reorderBtn: "Đặt lại món này ↻",
    // Booking & Success
    bookingStayRequest: "YÊU CẦU ĐẶT PHÒNG LƯU TRÚ",
    priceFromLabel: "Giá tham khảo từ",
    bookingRepName: "Họ và tên người đại diện",
    checkInDate: "Ngày nhận phòng",
    checkOutDate: "Ngày trả phòng",
    specialRequest: "Ghi chú riêng",
    estimatedTotalStay: "Dự toán tổng tiền",
    sendBookingRequestBtn: "Gửi yêu cầu đặt phòng →",
    orderSuccessKicker: "ĐẶT HÀNG THÀNH CÔNG",
    trackYourOrderBtn: "Xem & Theo Dõi Tiến Độ Đơn Hàng Của Bạn →",
    continueExploreBtn: "Tiếp tục khám phá điểm đến",
    // Place detail, food market & slot details
    modalBestTime: "KHUNG GIỜ ĐẸP",
    modalDuration: "THỜI LƯỢNG",
    modalFromVietTri: "TỪ VIỆT TRÌ",
    modalEstimatedCost: "CHI PHÍ THAM KHẢO",
    modalHighlightsTitle: "ĐIỂM NỔI BẬT KHÔNG NÊN BỎ LỠ",
    modalNoticeTitle: "Lưu ý trước khi đi",
    modalTransportTipsTitle: "GỢI Ý PHƯƠNG TIỆN & CUNG ĐƯỜNG",
    modalVehicleLabel: "🚗 Phương tiện phù hợp:",
    modalRouteLabel: "🛣️ Cung đường:",
    modalCautionLabel: "⚠️ Lưu ý an toàn:",
    modalOpenDirections: "⌁ Mở chỉ đường",
    slotWhereSightsee: "🏛️ ĐI THAM QUAN Ở ĐÂU",
    slotDestination: "Điểm đến:",
    slotHighlights: "Điểm nhấn:",
    slotWhereDine: "🍲 ĂN Ở ĐÂU & MÓN GÌ",
    slotSpecialtyMenu: "Thực đơn đặc sản:",
    slotFreeDine: "Tự do thưởng thức ẩm thực đặc sản địa phương trên cung đường.",
    slotWhereStay: "🛏️ NGỦ NGHỈ Ở ĐÂU",
    slotAmenities: "Dịch vụ & Tiện nghi:",
    slotGuideAdvice: "Lời dặn hướng dẫn viên:",
    addressLabel: "Địa chỉ:",
    servingHoursLabel: "Giờ phục vụ:",
    contactAtShop: "Liên hệ tại quán",
    pickupNoteLabel: "Ghi chú nhận món:",
    applyTourHint: "Bấm vào tour để áp dụng ngay",
      catAll: "Tất cả",
    catHeritage: "Di sản & tâm linh",
    catNature: "Núi rừng & sinh thái",
    catResort: "Nghỉ dưỡng & chữa lành",
    catCraft: "Văn hóa & làng nghề",
    catSightseeing: "Check-in & vui chơi",
    seasonYearRound: "Quanh năm",
    fromVietTri: "từ Việt Trì",
    savedNotebookKicker: "SỔ TAY DU LỊCH CỦA BẠN",
    savedNotebookTitle1: "Những nơi & món ngon",
    savedNotebookTitle2: "bạn đã lưu lại.",
    savedNotebookDesc: "Dữ liệu được lưu trữ trực tiếp trên thiết bị của bạn để bạn dễ dàng tra cứu lại khi lên đường.",
    comboTour1: "Đền Hùng + Khoáng nóng Thanh Thủy",
    comboTour2: "Tam Đảo + Thung lũng Mai Châu",
    comboTour3: "Khoáng nóng Thanh Thủy + Kim Bôi",
    comboTour4: "Trọn Vẹn 3 Tỉnh (Phú Thọ – Vĩnh Phúc – Hòa Bình)",
    periodMorning: "SÁNG",
    periodNoon: "TRƯA",
    periodAfternoon: "CHIỀU",
    periodEvening: "TỐI",
    slotMorningDepart: "Khởi hành & Khám phá",
    slotDineAt: "Thưởng thức ẩm thực tại",
    slotAfternoonExp: "Trải nghiệm & Check-in",
    slotDinnerAt: "Bữa tối đặc sản & Nghỉ ngơi tại",
    slotTourEndDinner: "Bữa tối đặc sản & Kết thúc tour",
    itineraryJourneyPrefix: "Hành trình",
    itineraryDiscover: "Khám phá",
    itineraryCombined: "Ghép tuyến",
    audioVoiceStudioFemale: "Giọng AI Nữ Hà Nội (Chuẩn Studio - Êm ái)",
    audioVoiceStudioMale: "Giọng AI Nam Miền Bắc (Trầm ấm - Rõ ràng)",
    audioVoiceEnglish: "Giọng AI Tiếng Anh (Bản ngữ Quốc tế)",
    detailTabFood: "Ẩm thực & Quán ngon gần đây",
    detailTabStay: "Khách sạn & Nơi nghỉ gần đây",
    detailReviewKicker: "GÓC NHÌN & CẢM NHẬN DU KHÁCH",
    detailReviewTitle: "Hình ảnh & trải nghiệm thực tế",
    detailReviewEmpty: "Chưa có nhận xét nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!",
    detailTasteLabel: "Hương vị:",
    detailOpenHours: "Giờ mở cửa:",
    detailCallBookTable: "{t.detailCallBookTable}",
    detailBookRoomFrom: "Đặt phòng · từ",
    detailPerNightUnit: "/đêm →",
    nearLocationUnsupported: "Thiết bị không hỗ trợ định vị",
    nearLocationLocating: "Đang xác định vị trí…",
    nearLocationSuccess: "Đã dùng vị trí hiện tại",
    nearLocationDenied: "Không thể lấy vị trí — hãy cấp quyền GPS",
      detailViewMap: "Xem bản đồ →",
    detailReviewName: "Họ và tên hiển thị",
    detailReviewRating: "Đánh giá sao",
    detailReviewShare: "Chia sẻ trải nghiệm",
    detailReviewPlaceholder: "Bạn thích điều gì? Thời điểm nào đẹp? Có lưu ý gì cho người đi sau?",
    detailReviewAddPhotos: "＋ Thêm tối đa 2 ảnh",
    detailReviewPhotoLimit: "Mỗi ảnh dưới 800 KB",
    detailReviewSubmit: "Đăng nhận xét",
    fromYou: "từ bạn",
  },
  en: {
    rewardTicket1Badge: "VOUCHER 30,000 VND",
    rewardTicket1Btn: "Claim voucher →",
    rewardTicket2Badge: "GROUP DISCOUNT 15% – 20%",
    rewardTicket2Btn: "Book tour with deal →",
    rewardTicket3Badge: "5-STAR OCOP GIFT",
    rewardTicket3Btn: "Explore OCOP gifts →",
    rewardStepsTitle: "3 EASY STEPS TO GET REWARDS:",
    rewardStep1: "Select favorite heritage destination or tour",
    rewardStep2: "Save to notebook or listen to AI Audio Guide",
    rewardStep3: "Receive instant checkout voucher or OCOP gift",
    heroTrendingLabel: "Trending:",
    heroTagHungTemple: "Hung Temple",
    heroTagHotSpring: "Thanh Thuy Hot Springs",
    heroTagLongCoc: "Long Coc Tea Hills",
    heroTagTamDao: "Tam Dao",
    heroTagOcopFood: "OCOP Specialties",
    heroBadgeHeritage: "Special National Heritage · Hung Kings Land",
    heroBadgeAudio: "5-Language AI Audio Guide",
    heroTrustOcop: "Certified Provincial OCOP",
    heroTrustLanguages: "AI Audio Languages",
    audioResume: "▶ Resume",
    modalGoodSeason: "Prime time to visit in month",
    modalCautionSeason: "Note weather conditions in month",
    brandSubtitle: "PHU THO · VINH PHUC · HOA BINH",
    explore: "Explore",
    trip: "Itinerary",
    near: "Near Me",
    saved: "Saved",
    profile: "Profile",
    cart: "Cart",
    vouchers: "Promotions",
    searchPlaceholder: "Search temples, heritage sites, local specialties...",
    heroKicker: "JOURNEY TO THE ANCESTRAL LAND",
    heroTitle1: "Travel in season.",
    heroTitle2: "Touch the Ancestral Land.",
    heroDesc: "Discover renowned landscapes, cultural heritage, and local cuisines across Phu Tho, Vinh Phuc, and Hoa Binh.",
    featuredDestCaption: "FEATURED DESTINATION",
    openGuideBtn: "Open Travel Guide →",
    stampOriginTitle: "ANCESTRAL",
    stampOriginSub: "HERITAGE",
    heritageTag1: "✦ SPECIAL PROGRAM 2026",
    heritageTag2: "✦ HERITAGE TOURS & REWARD POINTS",
    heritageTitle: "Ancestral Journey — Explore & Claim OCOP Gifts",
    heritageDesc: "Join the 3-province heritage journey across Phu Tho, Vinh Phuc, and Hoa Binh, check in at iconic attractions to earn reward points and exclusive specialty vouchers.",
    perk1Title: "🏛️ Hung King Temple Check-in",
    perk1Desc: "Get a 30,000₫ voucher when saving places and activating AI audio guides.",
    perk2Title: "🎁 Group & Family Rewards",
    perk2Desc: "Enjoy 15% - 20% off cultural experience tours for groups of 3 or more.",
    perk3Title: "🍜 5-Star OCOP Reward Points",
    perk3Desc: "Redeem points for Thanh Son sour pork, Long Coc tea, and premium gift sets.",
    viewAllVouchersBtn: "View All Deals & Vouchers",
    planTripRewardBtn: "Plan Rewarded Trip ✦",
    section01Num: "01",
    section01Title: "Explore by region & interest",
    viewAllBtn: "View all →",
    selectProvinceLabel: "SELECT PROVINCE:",
    provAll: "✨ All 3 Provinces",
    provPhuTho: "🏛️ Phu Tho",
    provVinhPhuc: "☁️ Vinh Phuc",
    provHoaBinh: "🌲 Hoa Binh",
    seasonLabel: "SEASONAL TRAVEL",
    seasonAll: "All",
    seasonInSeason: "Best this season",
    seasonSpring: "Spring",
    seasonSummer: "Summer",
    seasonAutumn: "Autumn",
    seasonWinter: "Winter",
    section02Num: "02",
    section02TitleDefault: "Iconic Attractions",
    section02TitleNear: "Near Your Location",
    locateBtn: "⌖ Enable Location",
    loadMorePlaces: "View more places →",
    noResultsTitle: "No results found",
    noResultsDesc: "Try searching for “cloud hunting”, “Hung Temple”, “Tam Dao”, “Mai Chau” or pick a category above.",
    section03Num: "03",
    section03Kicker: "SMART TRIP ASSISTANT",
    section03Title1: "Two full days,",
    section03Title2: "local guide handled all.",
    section03Desc: "Automatically optimizes sightseeing, dining, lodging, transport and timing across Phu Tho, Vinh Phuc, and Hoa Binh.",
    planTripSmartBtn: "Create Smart Itinerary Now →",
    suggestedTourTitle: "SUGGESTED TOUR",
    routeSummary1: "⌁ Convenient connected travel routes",
    routeSummary2: "Transparent daily budget estimates",
    foodKicker: "LOCAL SPECIALTIES MAP",
    foodTitle1: "Every region,",
    foodTitle2: "a unique flavor.",
    foodDesc: "Savor authentic regional gastronomy: Lang fish, Thanh Son sour pork, Tam Dao chayote greens, and Mai Chau bamboo rice feast.",
    foodSaveBtn: "♡ Save Dish",
    foodSavedBtn: "♥ Saved",
    foodToggleView: "View OCOP Sellers ▼",
    foodToggleHide: "Collapse ▲",
    sellerVerified: "✓ Verified Seller",
    sellerSuggested: "○ Recommended Spot",
    callSeller: "Call Now",
    openMapSeller: "Open Map →",
    addToCartBtn: "＋ Add to Cart",
    shopeeHubTitle: "My Orders",
    shopeeHubHistoryLink: "View order history",
    shopeeStatusPending: "To Pay / Pending",
    shopeeStatusProcessing: "To Ship",
    shopeeStatusShipping: "To Receive",
    shopeeStatusCompleted: "Completed",
    shopeeStatusCancelled: "Cancelled",
    orderStatusAll: "All",
    orderStatusPending: "Pending",
    orderStatusProcessing: "Processing",
    orderStatusCompleted: "Completed",
    orderStatusCancelled: "Cancelled",
    myOrders: "My Orders",
    checkout: "Checkout",
    paymentMethods: "Payment Methods",
    applyVoucher: "Apply Promo Code",
    discount: "Discount",
    totalPayment: "Total Payment",
    floatingCartLabel: "Cart",
    floatingCartSubDefault: "OCOP Specialties",
    passportKicker: "3-PROVINCE TRAVEL PASSPORT",
    passportTitle1: "Collect Footsteps,",
    passportTitle2: "Unlock Privileges.",
    passportProgress: "check-in points earned · Collect more stamps for heritage souvenirs",
    quickBookKicker: "QUICK BOOKING SERVICES",
    quickBookTitle: "Everything for your journey",
    btnTourDesignTitle: "Custom Tour Planner",
    btnTourDesignSub: "Auto-generate route in 1 minute",
    btnHotelsTitle: "Hotels & Homestays",
    btnHotelsSub: "Phu Tho · Tam Dao · Mai Chau · Kim Boi",
    btnVouchersTitle: "Voucher Store & Deals",
    btnVouchersSub: "Discounts for OCOP products & tours",
    btnOcopTitle: "Specialty Souvenirs (OCOP)",
    btnOcopSub: "Sour pork, chayote greens, tea...",
    partnerKicker: "FOR LOCAL PARTNERS",
    partnerTitle: "Promote services to travelers.",
    partnerDesc: "Restaurants, homestays, OCOP cooperatives, and travel operators can register verified merchant stores.",
    btnRegisterPartner: "Register as Partner →",
    toastSwitchedLang: "Switched all interface content to English",
    weatherToast: "in the area · Live weather data",
    roleAdmin: "Administrator",
    roleMerchant: "OCOP Merchant",
    roleCustomer: "Tourist",
    loginAccount: "Sign in to your account",
    searchInputPlaceholder: "Search Hung Temple, Tam Dao, Mai Chau, local specialties…",
    searchAriaLabel: "Search destinations, dishes, or accommodation",
    searchSuggestionsMatched: "Suggestions matching your search",
    searchSuggestionsPopular: "Popular destinations & culinary highlights",
    useCurrentLocation: "Use current location",
    tripPageTitle1: "Build Smart Itinerary",
    tripPageTitle2: "with local expert guides.",
    tripPageDesc: "Automatically optimizes 4 core factors: 🏛️ Sightseeing · 🍲 Local cuisine · 🛏️ Hotels & resorts · 🚗 Transport & travel time across Phu Tho, Vinh Phuc, and Hoa Binh.",
    tripControllerTitle: "TRIP CONTROLLER",
    tripCustomize: "Customize your journey",
    tripStep1: "1. Select Province / Region",
    tripCombine3: "✨ Combine 3 Provinces",
    tripStep2: "2. Select District / Town",
    tripAllDistricts: "All districts (Free routing)",
    tripDirectionGuide: "🧭 TRAVEL DIRECTIONS:",
    tripRecommendedRoute: "Recommended route:",
    tripSignatureFoods: "Signature local dishes:",
    tripStep3: "3. Select attractions for tour",
    tripSelected: "Selected",
    tripPoints: "places",
    tripSuggestedCombos: "Popular route combos:",
    tripAddAll: "+ Add all",
    tripReset: "↺ Reset",
    tripStep4: "4. Number of days",
    tripDays: "days",
    tripNights: "nights",
    tripDayTrip: "(day trip)",
    tripStep5: "5. Number of travelers",
    tripGuests: "guests",
    tripPerson: "person",
    tripCouple: "Couple",
    tripFamily: "Family",
    tripGroup: "Large group",
    tripStep6: "6. Budget level",
    tripBudgetEcon: "🏷️ Budget (~$20 / person / day)",
    tripBudgetStd: "⭐ Standard (~$40 / person / day)",
    tripBudgetPrem: "👑 Premium / Resort (~$80+ / person / day)",
    tripStep7: "7. Transportation",
    tripCar: "Private car",
    tripMotorbike: "Motorcycle",
    tripLimousine: "Limousine / Coach",
    tripTaxi: "Taxi / Hired car",
    tripStep8: "8. Travel style",
    tripStyleCulture: "Culture & heritage",
    tripStyleSpa: "Hot springs & Onsen",
    tripStyleAdventure: "Adventure & cloud hunting",
    tripStyleFamily: "Family-friendly",
    tripStyleFood: "Local gastronomy",
    tripGenerateBtn: "✦ Generate Detailed Itinerary",
    tripGenerateNote: "Auto-calculates distance, budget estimates, menus, and audio guide",
    tripStatDistance: "ROUTE DISTANCE",
    tripStatDriveTime: "DRIVING TIME",
    tripStatTransport: "TRANSPORT",
    tripStatCost: "EST. COST / GUEST",
    tripDayLabel: "DAY",
    tripDayRoute: "Day route:",
    tripGuideTips: "💡 Guide's advice:",
    tripSafetyTips: "🛡️ Safety & travel notes:",
    tripViewGoogleMaps: "🗺️ View on Google Maps",
    tripPrintPdf: "▤ Print / Export PDF",
    tripShare: "↗ Share itinerary",
    tripSaveNotebook: "♡ Save to Notebook",
    tripTransportLabel: "Transport:",
    tripSuggestedToursTitle: "SUGGESTED TOUR TEMPLATES",
    tripSuggestedToursDesc: "Curated by local experts — tap to apply instantly.",
    nearKicker: "TRAVEL UTILITIES & SERVICES",
    nearTitle1: "Nearby amenities",
    nearTitle2: "across all 3 provinces.",
    nearLocationNotEnabled: "Location not enabled",
    nearAllowLocation: "Allow location access for real distance",
    nearUpdateGPS: "Update GPS",
    nearEnableGPS: "Enable GPS",
    nearAreaLabel: "AREA:",
    nearAll3Provinces: "All 3 provinces",
    nearServiceGasStation: "Gas station",
    nearServiceParking: "Parking",
    nearServiceMedical: "Medical",
    nearServiceATM: "ATM",
    nearServiceEV: "EV charging",
    nearServiceRescue: "Rescue",
    nearServiceDestination: "Destination",
    nearServiceFood: "Dining",
    nearServiceStay: "Accommodation",
    savedPlacesTab: "Places",
    savedFoodsTab: "Foods",
    savedItineraryTab: "Itineraries",
    savedPlacesEmpty: "No saved places yet",
    savedPlacesEmptyDesc: "Tap the ♡ icon on place cards to save your favorites.",
    savedFoodsEmpty: "No saved dishes yet",
    savedFoodsEmptyDesc: "Tap ♡ Save Dish in the Explore tab to add to your list.",
    savedItineraryEmpty: "No saved itineraries yet",
    savedItineraryEmptyDesc: "Go to \"Itinerary\" tab, create a tour, then tap \"Save to Notebook\".",
    savedCreateTrip: "Create itinerary now →",
    savedOpenDetail: "View details →",
    savedOpenGoogleMaps: "Open Google Maps ↗",
    savedDeleteItinerary: "Delete",
    savedDeletedToast: "Itinerary removed from notebook",
    savedOpenedToast: "Opened itinerary details!",
    savedPerGuest: "/guest",
    profileSystemAdmin: "🛡️ SYSTEM ADMINISTRATOR",
    profileMerchantOwner: "🏪 OCOP MERCHANT:",
    profilePartner: "PARTNER",
    profileCustomer: "👤 ANCESTRAL LAND TOURIST",
    profileNotLoggedIn: "NOT SIGNED IN",
    profileGuest: "Guest",
    profileLoginVia: "Signed in via",
    profileLoginPrompt: "Sign in with Gmail or Facebook to order OCOP specialties and manage orders.",
    profileSwitchAccount: "Switch account",
    profileLogout: "Sign out",
    profileLoginNow: "🔑 Sign in now",
    profileOrderMgmt: "Order Management (Google Sheets)",
    profileAdminOrderDesc: "Admin access: Manage orders · Dispatch & Export Sheets",
    profileMerchantOrderDesc: "Merchant: Manage orders & deliveries",
    profileOrdersCount: "orders",
    profileOrdersPlaced: "orders placed · Tap to track delivery status",
    profileNoOrders: "No orders yet · Explore OCOP specialties and order now",
    profileItems: "items",
    footerDesc: "Smart travel guide & digital itinerary assistant · Essence of Ancestral Land.",
    footerLink: "Dat To Travel ↗",
    authLoginTab: "Sign In",
    authRegisterTab: "Create Account",
    authAdminTab: "Admin",
    authEmail: "Email Address",
    authPassword: "Password",
    authShowPassword: "Show",
    authHidePassword: "Hide",
    authForgotPassword: "Forgot password?",
    authLoginBtn: "Sign In",
    authOrLoginWith: "or sign in quickly with",
    authRegisterName: "Full Name",
    authRegisterPhone: "Phone Number",
    authRegisterConfirmPass: "Confirm Password",
    authRegisterBtn: "Create Account",
    authAdminUser: "Admin Username",
    authAdminPass: "Admin Password",
    authAdminLoginBtn: "Admin Sign In",
    authClose: "Close",
    directoryKicker: "DESTINATION DIRECTORY",
    directoryTitle: "100 Tourism, Dining & Accommodation Directory",
    directoryDesc: "Quick lookup for attractions, restaurants, and accommodations by area.",
    directoryCollapse: "Collapse directory ▲",
    directoryExpand: "Open full directory",
    directorySearchPlaceholder: "Search by name, dish, hotel...",
    directoryAllDistricts: "All districts",
    directoryDistrictPrefix: "District:",
    directoryColNo: "No.",
    directoryColName: "Destination",
    directoryColType: "Type",
    directoryColArea: "Area",
    directoryColFood: "Nearby Dining",
    directoryColStay: "Nearby Hotels",
    directoryColDist: "Distance",
    modalClose: "Close",
    modalReviews: "reviews",
    modalPhoto: "Photo:",
    loginRequiredToast: "Please sign in with Gmail or Facebook to place an order!",
    needAtLeast1Place: "Must keep at least 1 destination in the itinerary!",
    registerPartnerToast: "Thank you! Your partner registration has been recorded.",
    openTripAssistant: "Opened trip planning assistant",
    selectResortToast: "Select a resort then open nearby accommodation",
    toastLangChanged: "Language switched to:",
    clearOrdersConfirm: "Are you sure you want to clear all order history for this account?",
    audioPause: "⏸ Pause",
    audioListen: "▶ Listen to Audio Guide",
    audioStop: "Stop",
    audioVoiceLabel: "🗣️ Voice:",
    audioVolumeLabel: "🔊 Volume:",
    audioSpeedLabel: "Speed:",
    // Common & Actions
    bottomNavAria: "Mobile navigation",
    getDirectionsBtn: "Directions →",
    detailsBtn: "Details →",
    callNowBtn: "Call now",
    serviceListTitle: "Amenities List",
    serviceListSub: "Sorted by closest distance to you",
    sosTitle: "24/7 Emergency Support & Rescue Hotline",
    sosSub: "Always ready to assist you on every route.",
    sosNationalRescue: "National Rescue",
    sosPolice: "Police",
    sosAmbulance: "Medical Ambulance",
    sosTrafficRescue: "Traffic Rescue",
    festivalKicker: "CULTURAL FESTIVAL CALENDAR",
    festivalTitle1: "Travel on the right day,",
    festivalTitle2: "experience the right festival.",
    festivalDesc: "Traditional festival dates are preserved according to the lunar calendar for easy trip planning.",
    bookingRequired: "BOOKING REQUIRED",
    openPlaceBtn: "Open destination →",
    // Shopee Hub & Commerce
    shopeePurchases: "Purchases",
    shopeeViewHistory: "View purchase history",
    statusPending: "Pending",
    statusProcessing: "Preparing",
    statusShipping: "Shipping",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    cartEmptyTitle: "Your cart is empty",
    cartEmptyDesc: "Explore the culinary map and add local specialties to your cart.",
    viewSpecialtiesBtn: "Explore specialties now →",
    voucherPromotionsTitle: "Vouchers & Promotions",
    chooseOtherVoucherBtn: "Choose another voucher →",
    removeVoucherTitle: "Remove voucher",
    voucherInputPlaceholder: "Enter code: DATTO10, LEHOI2026...",
    applyVoucherBtn: "Apply",
    currencyLabel: "Currency:",
    subtotalLabel: "Subtotal",
    discountVoucherLabel: "Discount Voucher",
    authRequiredOrderTitle: "Sign in required to order",
    authRequiredOrderDesc: "Sign in with Gmail or Facebook to save orders and receive updates from OCOP merchants.",
    loginGoogle: "Sign in with Gmail (Google)",
    loginFacebook: "Sign in with Facebook",
    loginAdminLink: "🛡️ Administrator Login (Admin) →",
    orderAccountLabel: "Order Account:",
    changeAccountBtn: "Change",
    fullNameLabel: "Full name",
    phoneNumberLabel: "Phone number",
    shippingAddressLabel: "Delivery address / Hotel name",
    orderNoteLabel: "Additional note (Delivery time, packaging...)",
    orderNotePlaceholder: "Note for seller",
    confirmOrderBtn: "Confirm Order",
    loginToCompleteOrder: "🔒 Sign in to complete order →",
    noOrdersInStatus: "No orders in this category",
    noOrdersInStatusDesc: "Select another category or order more local OCOP specialties.",
    clearOrderHistoryBtn: "🗑️ Clear order history",
    orderNumberLabel: "Order",
    cancelOrderBtn: "Cancel order",
    reorderBtn: "Reorder this ↻",
    // Booking & Success
    bookingStayRequest: "ACCOMMODATION BOOKING REQUEST",
    priceFromLabel: "Starting price from",
    bookingRepName: "Guest full name",
    checkInDate: "Check-in date",
    checkOutDate: "Check-out date",
    specialRequest: "Special requests",
    estimatedTotalStay: "Estimated total",
    sendBookingRequestBtn: "Send booking request →",
    orderSuccessKicker: "ORDER PLACED SUCCESSFULLY",
    trackYourOrderBtn: "View & Track Your Order Progress →",
    continueExploreBtn: "Continue exploring destinations",
    // Place detail, food market & slot details
    modalBestTime: "BEST TIME TO VISIT",
    modalDuration: "DURATION",
    modalFromVietTri: "FROM VIET TRI",
    modalEstimatedCost: "ESTIMATED EXPENSE",
    modalHighlightsTitle: "MUST-SEE HIGHLIGHTS",
    modalNoticeTitle: "Travel Advisory & Notes",
    modalTransportTipsTitle: "TRANSPORT & ROUTE SUGGESTIONS",
    modalVehicleLabel: "🚗 Recommended transport:",
    modalRouteLabel: "🛣️ Route advice:",
    modalCautionLabel: "⚠️ Safety tips:",
    modalOpenDirections: "⌁ Get Directions",
    slotWhereSightsee: "🏛️ WHERE TO VISIT",
    slotDestination: "Destination:",
    slotHighlights: "Highlights:",
    slotWhereDine: "🍲 DINING & SPECIALTIES",
    slotSpecialtyMenu: "Specialty menu:",
    slotFreeDine: "Feel free to explore and enjoy local specialties along your route.",
    slotWhereStay: "🛏️ ACCOMMODATION & RESORTS",
    slotAmenities: "Services & Amenities:",
    slotGuideAdvice: "Guide's advice:",
    addressLabel: "Address:",
    servingHoursLabel: "Opening hours:",
    contactAtShop: "Contact at store",
    pickupNoteLabel: "Pickup note:",
    applyTourHint: "Tap a tour to apply instantly",
      catAll: "All",
    catHeritage: "Heritage & Spiritual",
    catNature: "Nature & Eco",
    catResort: "Resort & Healing",
    catCraft: "Culture & Craft Villages",
    catSightseeing: "Check-in & Sightseeing",
    seasonYearRound: "Year-Round",
    fromVietTri: "from Viet Tri",
    savedNotebookKicker: "YOUR TRAVEL NOTEBOOK",
    savedNotebookTitle1: "Destinations & cuisine",
    savedNotebookTitle2: "you have bookmarked.",
    savedNotebookDesc: "Data is saved locally on your device for fast, effortless lookup during your journey.",
    comboTour1: "Hung Temple + Thanh Thuy Hot Springs",
    comboTour2: "Tam Dao + Mai Chau Valley",
    comboTour3: "Thanh Thuy + Kim Boi Hot Springs",
    comboTour4: "Grand 3-Province Tour (Phu Tho – Vinh Phuc – Hoa Binh)",
    periodMorning: "MORNING",
    periodNoon: "NOON",
    periodAfternoon: "AFTERNOON",
    periodEvening: "EVENING",
    slotMorningDepart: "Depart & Discover",
    slotDineAt: "Savor local cuisine at",
    slotAfternoonExp: "Experience & Check-in",
    slotDinnerAt: "Specialty dinner & stay at",
    slotTourEndDinner: "Farewell dinner & Tour conclusion",
    itineraryJourneyPrefix: "Journey",
    itineraryDiscover: "Discover",
    itineraryCombined: "Connected Route",
    audioVoiceStudioFemale: "AI Female Hanoi (Studio Standard - Gentle)",
    audioVoiceStudioMale: "AI Male Northern (Deep & Clear)",
    audioVoiceEnglish: "English AI Voice (Native International)",
    detailTabFood: "Nearby Dining & Specialties",
    detailTabStay: "Nearby Hotels & Lodging",
    detailReviewKicker: "TRAVELER REVIEWS & IMPRESSIONS",
    detailReviewTitle: "Photos & authentic experiences",
    detailReviewEmpty: "No reviews yet. Be the first to share your experience!",
    detailTasteLabel: "Taste & Flavor:",
    detailOpenHours: "Opening Hours:",
    detailCallBookTable: "Call to reserve table / preorder →",
    detailBookRoomFrom: "Book Room · from",
    detailPerNightUnit: "/night →",
    nearLocationUnsupported: "Device does not support geolocation",
    nearLocationLocating: "Locating…",
    nearLocationSuccess: "Current location active",
    nearLocationDenied: "Unable to get location — please allow GPS access",
      detailViewMap: "View Map →",
    detailReviewName: "Display Name",
    detailReviewRating: "Star Rating",
    detailReviewShare: "Share Your Experience",
    detailReviewPlaceholder: "What did you love? Best time to visit? Any tips for future travelers?",
    detailReviewAddPhotos: "＋ Add up to 2 photos",
    detailReviewPhotoLimit: "Under 800 KB each",
    detailReviewSubmit: "Post Review",
    fromYou: "from you",
  },
  zh: {
    rewardTicket1Badge: "3万越盾优惠券",
    rewardTicket1Btn: "立即领券 →",
    rewardTicket2Badge: "团队立减 15% – 20%",
    rewardTicket2Btn: "预订行程享优惠 →",
    rewardTicket3Badge: "五星级 OCOP 特产礼品",
    rewardTicket3Btn: "查看 OCOP 特产 →",
    rewardStepsTitle: "三步轻松赢取奖励：",
    rewardStep1: "选择喜爱的名胜景点或文化行程",
    rewardStep2: "收藏旅行手账或收听 AI 语音讲解",
    rewardStep3: "获赠订单立减优惠券或 OCOP 礼品",
    heroTrendingLabel: "热门推荐：",
    heroTagHungTemple: "雄王庙",
    heroTagHotSpring: "清水温泉",
    heroTagLongCoc: "龙谷茶丘",
    heroTagTamDao: "三岛山",
    heroTagOcopFood: "OCOP 特产",
    heroBadgeHeritage: "国家特别历史遗迹 · 雄王祖地",
    heroBadgeAudio: "5 种语言 AI 语音导览",
    heroTrustOcop: "省级标准 OCOP 特产",
    heroTrustLanguages: "AI 导览语种支持",
    audioResume: "▶ 继续播放",
    modalGoodSeason: "当月为绝佳出游时节：",
    modalCautionSeason: "当月出行需注意天气情况：",
    brandSubtitle: "富寿 · 永福 · 和平",
    explore: "探索",
    trip: "行程",
    near: "附近",
    saved: "收藏",
    profile: "个人中心",
    cart: "购物车",
    vouchers: "优惠活动",
    searchPlaceholder: "搜索寺庙、名胜、地方特产...",
    heroKicker: "探寻祖源文化遗产",
    heroTitle1: "当季旅行。",
    heroTitle2: "亲临祖源胜地。",
    heroDesc: "畅游富寿、永福、和平三省名胜古迹、非遗文化与特色美食。",
    featuredDestCaption: "精选热门胜地",
    openGuideBtn: "查看旅游指南 →",
    stampOriginTitle: "华夏祖源",
    stampOriginSub: "民族胜迹",
    heritageTag1: "✦ 2026 特别主题计划",
    heritageTag2: "✦ 遗产巡礼 · 打卡积分兑好礼",
    heritageTitle: "寻根之旅 —— 畅游打卡赢 OCOP 特产礼券",
    heritageDesc: "参与富寿、永福、和平三省文化遗产巡礼，打卡标志性名胜积累积分，即享独家地方特产优惠礼券。",
    perk1Title: "🏛️ 雄王庙打卡礼",
    perk1Desc: "收藏景点并开启 AI 智能语音讲解，立享 30,000₫ 优惠券。",
    perk2Title: "🎁 团队与家庭特惠",
    perk2Desc: "3人及以上同行体验传统文化游，享 15% - 20% 专属折扣。",
    perk3Title: "🍜 五星 OCOP 积分兑换",
    perk3Desc: "积分可直接兑换清山酸肉、龙谷茶及高档伴手礼盒。",
    viewAllVouchersBtn: "查看全部优惠与礼券",
    planTripRewardBtn: "定制打卡获奖行程 ✦",
    section01Num: "01",
    section01Title: "按地区与偏好探索",
    viewAllBtn: "查看全部 →",
    selectProvinceLabel: "选择省份:",
    provAll: "✨ 汇聚三省全部",
    provPhuTho: "🏛️ 富寿省",
    provVinhPhuc: "☁️ 永福省",
    provHoaBinh: "🌲 和平省",
    seasonLabel: "按季节旅行",
    seasonAll: "全部",
    seasonInSeason: "当季最佳",
    seasonSpring: "春季",
    seasonSummer: "夏季",
    seasonAutumn: "秋季",
    seasonWinter: "冬季",
    section02Num: "02",
    section02TitleDefault: "经典代表名胜",
    section02TitleNear: "您附近的景点",
    locateBtn: "⌖ 开启定位",
    loadMorePlaces: "查看更多景点 →",
    noResultsTitle: "未找到相关结果",
    noResultsDesc: "尝试搜索“云海”、“雄王庙”、“三岛”、“梅州”或选择上方分类。",
    section03Num: "03",
    section03Kicker: "智能行程助手",
    section03Title1: "充实两日游，",
    section03Title2: "专属向导全程规划。",
    section03Desc: "自动优化游览、餐饮、住宿、交通及时间分配，覆盖富寿、永福、和平三省全境。",
    planTripSmartBtn: "立即生成智能行程 →",
    suggestedTourTitle: "推荐行程路线",
    routeSummary1: "⌁ 交通便捷顺畅的串联路线",
    routeSummary2: "每日预算花费清晰透明",
    foodKicker: "特色美食风味地图",
    foodTitle1: "一方水土，",
    foodTitle2: "一方独特风味。",
    foodDesc: "沿途品尝地道风味精华：祖地鲇鱼、清山酸肉、三岛佛手瓜苗、梅州黑猪芭蕉叶宴。",
    foodSaveBtn: "♡ 收藏美食",
    foodSavedBtn: "♥ 已收藏",
    foodToggleView: "查看 OCOP 销售网点 ▼",
    foodToggleHide: "收起 ▲",
    sellerVerified: "✓ 认证优质商家",
    sellerSuggested: "○ 推荐商户",
    callSeller: "立即致电",
    openMapSeller: "打开地图 →",
    addToCartBtn: "＋ 加入购物车",
    shopeeHubTitle: "我的订单",
    shopeeHubHistoryLink: "查看订单记录",
    shopeeStatusPending: "待付款/待确认",
    shopeeStatusProcessing: "待发货/备货中",
    shopeeStatusShipping: "待收货/配送中",
    shopeeStatusCompleted: "已评价/完成",
    shopeeStatusCancelled: "已取消",
    orderStatusAll: "全部",
    orderStatusPending: "待确认",
    orderStatusProcessing: "处理中",
    orderStatusCompleted: "已完成",
    orderStatusCancelled: "已取消",
    myOrders: "我的订单",
    checkout: "去结算",
    paymentMethods: "支付方式",
    applyVoucher: "使用优惠券",
    discount: "优惠抵扣",
    totalPayment: "实付金额",
    floatingCartLabel: "购物车",
    floatingCartSubDefault: "OCOP 特产选购",
    passportKicker: "三省旅游数字护照",
    passportTitle1: "收集旅行足迹，",
    passportTitle2: "解锁尊享特权。",
    passportProgress: "个打卡点已点亮 · 继续打卡赢取祖地文创纪念礼品",
    quickBookKicker: "快捷预订服务",
    quickBookTitle: "为您的一站式出行准备",
    btnTourDesignTitle: "定制专属路线",
    btnTourDesignSub: "1分钟智能生成完整行程",
    btnHotelsTitle: "精选酒店与民宿",
    btnHotelsSub: "富寿 · 三岛 · 梅州 · 金杯温泉",
    btnVouchersTitle: "领券中心 & 优惠活动",
    btnVouchersSub: "OCOP 特产下单与门票立减券",
    btnOcopTitle: "地道伴手礼特产 (OCOP)",
    btnOcopSub: "清山酸肉、三岛佛手瓜苗、高山好茶…",
    partnerKicker: "本地合作商户通道",
    partnerTitle: "向广大游客推广您的服务。",
    partnerDesc: "餐厅、民宿、OCOP 合作社及旅行社均可申请入驻认证商家展位。",
    btnRegisterPartner: "申请成为合作伙伴 →",
    toastSwitchedLang: "已将全部页面内容切换为中文",
    weatherToast: "所在区域 · 实时天气数据",
    roleAdmin: "管理员", roleMerchant: "OCOP 商户", roleCustomer: "游客",
    loginAccount: "登录账户",
    searchInputPlaceholder: "搜索雄王庙、三岛、梅州、特产…",
    searchAriaLabel: "搜索景点、美食或住宿",
    searchSuggestionsMatched: "符合搜索词的建议",
    searchSuggestionsPopular: "热门目的地与特色美食推荐",
    useCurrentLocation: "使用当前位置",
    tripPageTitle1: "智能行程规划", tripPageTitle2: "当地专家全程指导。",
    tripPageDesc: "自动优化4大核心：🏛️观光·🍲美食·🛏️住宿·🚗交通，覆盖富寿、永福、和平三省。",
    tripControllerTitle: "行程控制面板", tripCustomize: "自定义您的旅程",
    tripStep1: "1. 选择省份/区域", tripCombine3: "✨ 三省联游",
    tripStep2: "2. 选择县/区", tripAllDistricts: "全部县区（自由规划）",
    tripDirectionGuide: "🧭 出行指南：", tripRecommendedRoute: "推荐路线：",
    tripSignatureFoods: "特色美食：",
    tripStep3: "3. 选择景点加入行程", tripSelected: "已选", tripPoints: "处",
    tripSuggestedCombos: "热门组合路线：", tripAddAll: "+ 全部添加", tripReset: "↺ 重置",
    tripStep4: "4. 出行天数", tripDays: "天", tripNights: "晚", tripDayTrip: "（当日往返）",
    tripStep5: "5. 出行人数", tripGuests: "位旅客", tripPerson: "人",
    tripCouple: "情侣", tripFamily: "家庭", tripGroup: "大型团队",
    tripStep6: "6. 预算标准",
    tripBudgetEcon: "🏷️ 经济型（~¥140/人/天）", tripBudgetStd: "⭐ 标准型（~¥280/人/天）",
    tripBudgetPrem: "👑 高端/度假（~¥570+/人/天）",
    tripStep7: "7. 出行方式", tripCar: "自驾", tripMotorbike: "摩托车",
    tripLimousine: "大巴/商务车", tripTaxi: "出租车/包车",
    tripStep8: "8. 旅行风格", tripStyleCulture: "文化寻根", tripStyleSpa: "温泉康养",
    tripStyleAdventure: "探险观云", tripStyleFamily: "亲子/适老", tripStyleFood: "美食探店",
    tripGenerateBtn: "✦ 生成详细行程", tripGenerateNote: "自动计算路程、预算、菜单和语音导览",
    tripStatDistance: "路线总里程", tripStatDriveTime: "驾车时间",
    tripStatTransport: "交通方式", tripStatCost: "人均预算",
    tripDayLabel: "第", tripDayRoute: "当日路线：",
    tripGuideTips: "💡 导游建议：", tripSafetyTips: "🛡️ 安全提示：",
    tripViewGoogleMaps: "🗺️ 在地图查看", tripPrintPdf: "▤ 打印/导出PDF",
    tripShare: "↗ 分享行程", tripSaveNotebook: "♡ 收藏到手册",
    tripTransportLabel: "交通方式：",
    tripSuggestedToursTitle: "推荐行程模板", tripSuggestedToursDesc: "当地专家精选——点击即用。",
    nearKicker: "旅游配套设施", nearTitle1: "周边便民设施", nearTitle2: "覆盖三省全境。",
    nearLocationNotEnabled: "未开启定位", nearAllowLocation: "开启定位以计算实际距离",
    nearUpdateGPS: "更新GPS", nearEnableGPS: "开启GPS",
    nearAreaLabel: "区域：", nearAll3Provinces: "三省全部",
    nearServiceGasStation: "加油站", nearServiceParking: "停车场", nearServiceMedical: "医疗",
    nearServiceATM: "ATM", nearServiceEV: "充电站", nearServiceRescue: "救援",
    nearServiceDestination: "景点", nearServiceFood: "餐饮", nearServiceStay: "住宿",
    savedPlacesTab: "景点", savedFoodsTab: "美食", savedItineraryTab: "行程",
    savedPlacesEmpty: "尚未收藏任何景点", savedPlacesEmptyDesc: "点击景点卡片上的♡图标即可收藏。",
    savedFoodsEmpty: "尚未收藏任何美食", savedFoodsEmptyDesc: "在探索页面点击♡收藏美食即可添加。",
    savedItineraryEmpty: "尚未保存任何行程", savedItineraryEmptyDesc: "前往\"行程\"页面创建旅游路线后点击\"收藏到手册\"。",
    savedCreateTrip: "立即创建行程 →", savedOpenDetail: "查看详情 →",
    savedOpenGoogleMaps: "打开地图 ↗", savedDeleteItinerary: "删除",
    savedDeletedToast: "行程已从手册中删除", savedOpenedToast: "已打开行程详情！", savedPerGuest: "/人",
    profileSystemAdmin: "🛡️ 系统管理员", profileMerchantOwner: "🏪 OCOP商户：",
    profilePartner: "合作伙伴", profileCustomer: "👤 祖源之旅游客",
    profileNotLoggedIn: "未登录", profileGuest: "游客",
    profileLoginVia: "登录方式", profileLoginPrompt: "通过Gmail或Facebook登录以订购OCOP特产并管理订单。",
    profileSwitchAccount: "切换账户", profileLogout: "退出登录",
    profileLoginNow: "🔑 立即登录",
    profileOrderMgmt: "订单管理（Google Sheets）",
    profileAdminOrderDesc: "管理员：管理订单·调度·导出", profileMerchantOrderDesc: "商户：管理订单与配送",
    profileOrdersCount: "单", profileOrdersPlaced: "个订单已下·点击查看配送进度",
    profileNoOrders: "暂无订单·浏览OCOP特产立即下单", profileItems: "件",
    footerDesc: "智慧旅游指南与数字行程助手·祖源精华汇聚。", footerLink: "祖源之旅 ↗",
    authLoginTab: "登录", authRegisterTab: "注册账户", authAdminTab: "管理员",
    authEmail: "邮箱地址", authPassword: "密码",
    authShowPassword: "显示", authHidePassword: "隐藏",
    authForgotPassword: "忘记密码？", authLoginBtn: "登录",
    authOrLoginWith: "或快速登录", authRegisterName: "姓名",
    authRegisterPhone: "手机号", authRegisterConfirmPass: "确认密码",
    authRegisterBtn: "注册账户", authAdminUser: "管理员用户名",
    authAdminPass: "管理员密码", authAdminLoginBtn: "管理员登录", authClose: "关闭",
    directoryKicker: "景点查询目录", directoryTitle: "100处旅游·餐饮·住宿指南",
    directoryDesc: "按区域快速查询景点、餐厅和住宿。",
    directoryCollapse: "收起目录 ▲", directoryExpand: "展开全部目录",
    directorySearchPlaceholder: "按名称、美食、酒店搜索...",
    directoryAllDistricts: "全部县区", directoryDistrictPrefix: "县/区：",
    directoryColNo: "序号", directoryColName: "景点名称", directoryColType: "类型",
    directoryColArea: "所在区域", directoryColFood: "周边餐饮", directoryColStay: "周边住宿",
    directoryColDist: "距离",
    modalClose: "关闭", modalReviews: "条评价", modalPhoto: "图片：",
    loginRequiredToast: "请先通过Gmail或Facebook登录后下单！",
    needAtLeast1Place: "行程中至少保留1个景点！",
    registerPartnerToast: "感谢您！合作伙伴申请已记录。",
    openTripAssistant: "已打开行程规划助手", selectResortToast: "选择度假村后查看周边住宿",
    toastLangChanged: "语言已切换为：",
    clearOrdersConfirm: "确定要清除该账户的全部订单记录吗？",
    audioPause: "⏸ 暂停", audioListen: "▶ 收听语音导览",
    audioStop: "停止", audioVoiceLabel: "🗣️ 语音：",
    audioVolumeLabel: "🔊 音量：", audioSpeedLabel: "语速：",
    // Common & Actions
    bottomNavAria: "移动端导航",
    getDirectionsBtn: "导航路线 →",
    detailsBtn: "详情 →",
    callNowBtn: "立即呼叫",
    serviceListTitle: "便民设施列表",
    serviceListSub: "按离您的距离排序",
    sosTitle: "24/7 紧急救援与求助热线",
    sosSub: "随时为您在旅途中提供全力协助。",
    sosNationalRescue: "国家救援",
    sosPolice: "公安报警",
    sosAmbulance: "医疗急救",
    sosTrafficRescue: "交通救援",
    festivalKicker: "文化节庆日历",
    festivalTitle1: "适逢佳日，",
    festivalTitle2: "邂逅盛典。",
    festivalDesc: "传统节日保留农历日期，方便游客规划行程。",
    bookingRequired: "需提前预约",
    openPlaceBtn: "查看目的地 →",
    // Shopee Hub & Commerce
    shopeePurchases: "购买订单",
    shopeeViewHistory: "查看购买历史",
    statusPending: "待确认",
    statusProcessing: "备货中",
    statusShipping: "配送中",
    statusCompleted: "已完成",
    statusCancelled: "已取消",
    cartEmptyTitle: "购物车为空",
    cartEmptyDesc: "浏览美食地图，添加当地特产至购物车。",
    viewSpecialtiesBtn: "立即选购特产 →",
    voucherPromotionsTitle: "优惠券与促销",
    chooseOtherVoucherBtn: "选择其他优惠券 →",
    removeVoucherTitle: "取消优惠券",
    voucherInputPlaceholder: "输入代码：DATTO10, LEHOI2026...",
    applyVoucherBtn: "使用",
    currencyLabel: "货币单位：",
    subtotalLabel: "小计",
    discountVoucherLabel: "优惠折扣",
    authRequiredOrderTitle: "下单需先登录",
    authRequiredOrderDesc: "使用 Gmail 或 Facebook 登录以保存订单并接收商家通知。",
    loginGoogle: "使用 Gmail (Google) 登录",
    loginFacebook: "使用 Facebook 登录",
    loginAdminLink: "🛡️ 管理员登录 (Admin) →",
    orderAccountLabel: "下单账户：",
    changeAccountBtn: "更改",
    fullNameLabel: "收件人姓名",
    phoneNumberLabel: "联系电话",
    shippingAddressLabel: "配送地址 / 酒店名称",
    orderNoteLabel: "补充备注（配送时间、包装要求等）",
    orderNotePlaceholder: "给卖家的留言",
    confirmOrderBtn: "确认下单",
    loginToCompleteOrder: "🔒 登录以完成下单 →",
    noOrdersInStatus: "该分类下暂无订单",
    noOrdersInStatusDesc: "选择其他分类或选购更多祖地 OCOP 特产。",
    clearOrderHistoryBtn: "🗑️ 清空订单记录",
    orderNumberLabel: "订单",
    cancelOrderBtn: "取消订单",
    reorderBtn: "再次购买 ↻",
    // Booking & Success
    bookingStayRequest: "住宿预订申请",
    priceFromLabel: "参考起价",
    bookingRepName: "入住代表姓名",
    checkInDate: "入住日期",
    checkOutDate: "退房日期",
    specialRequest: "特殊要求",
    estimatedTotalStay: "预计总额",
    sendBookingRequestBtn: "发送预订申请 →",
    orderSuccessKicker: "下单成功",
    trackYourOrderBtn: "查看并跟踪订单进度 →",
    continueExploreBtn: "继续探索目的地",
    // Place detail, food market & slot details
    modalBestTime: "最佳游览时间",
    modalDuration: "建议游玩时长",
    modalFromVietTri: "距离越池中心",
    modalEstimatedCost: "参考费用",
    modalHighlightsTitle: "不可错过的核心亮点",
    modalNoticeTitle: "出行行前贴士",
    modalTransportTipsTitle: "交通出行与路线建议",
    modalVehicleLabel: "🚗 推荐交通工具：",
    modalRouteLabel: "🛣️ 建议路线：",
    modalCautionLabel: "⚠️ 安全提示：",
    modalOpenDirections: "⌁ 打开导航路线",
    slotWhereSightsee: "🏛️ 观光游览景点",
    slotDestination: "目的地：",
    slotHighlights: "核心亮点：",
    slotWhereDine: "🍲 特色美食与餐馆",
    slotSpecialtyMenu: "特色菜单：",
    slotFreeDine: "沿途自由探索并品尝当地特色风味。",
    slotWhereStay: "🛏️ 住宿与度假酒店",
    slotAmenities: "服务与配套设施：",
    slotGuideAdvice: "导游贴心提醒：",
    addressLabel: "地址：",
    servingHoursLabel: "营业时间：",
    contactAtShop: "店内咨询",
    pickupNoteLabel: "取货/用餐备注：",
    applyTourHint: "点击路线即可一键应用",
      catAll: "全部",
    catHeritage: "历史遗产与心灵",
    catNature: "山林与自然生态",
    catResort: "度假温泉与身心疗愈",
    catCraft: "民俗文化与传统手工艺村",
    catSightseeing: "网红打卡与游乐",
    seasonYearRound: "全年皆宜",
    fromVietTri: "距越池市",
    savedNotebookKicker: "您的专属旅行手账",
    savedNotebookTitle1: "收藏的名胜景点与",
    savedNotebookTitle2: "地道风味美食。",
    savedNotebookDesc: "数据安全保存在您的设备本地，方便您在旅途中随时轻松查阅。",
    comboTour1: "雄王庙 + 清水温泉",
    comboTour2: "三岛山 + 迈州山谷",
    comboTour3: "清水温泉 + 金杯温泉",
    comboTour4: "三省经典全景游（富寿 – 永福 – 和平）",
    periodMorning: "上午",
    periodNoon: "中午",
    periodAfternoon: "下午",
    periodEvening: "晚上",
    slotMorningDepart: "出发前往并探索",
    slotDineAt: "美食品鉴于",
    slotAfternoonExp: "深度体验与打卡",
    slotDinnerAt: "特色晚餐与住宿于",
    slotTourEndDinner: "欢送特色晚餐并结束旅程",
    itineraryJourneyPrefix: "行程",
    itineraryDiscover: "探索",
    itineraryCombined: "连线游",
    audioVoiceStudioFemale: "AI 河内女声（标准录音棚 - 温婉）",
    audioVoiceStudioMale: "AI 北方男声（深沉清晰）",
    audioVoiceEnglish: "国际英语 AI 原声",
    detailTabFood: "附近美食与特色餐馆",
    detailTabStay: "附近酒店与品质住宿",
    detailReviewKicker: "游客视角与真实评价",
    detailReviewTitle: "实景图片与旅行感悟",
    detailReviewEmpty: "暂无评价。成为第一位分享您精彩体验的旅行者吧！",
    detailTasteLabel: "风味特色：",
    detailOpenHours: "营业时间：",
    detailCallBookTable: "电话订位 / 提前点餐 →",
    detailBookRoomFrom: "预订客房 · 起价",
    detailPerNightUnit: "/晚 →",
    nearLocationUnsupported: "设备不支持地理定位",
    nearLocationLocating: "正在获取当前位置…",
    nearLocationSuccess: "已使用当前位置",
    nearLocationDenied: "无法获取位置 — 请开启GPS权限",
      detailViewMap: "查看地图 →",
    detailReviewName: "显示姓名",
    detailReviewRating: "星级评分",
    detailReviewShare: "分享您的体验",
    detailReviewPlaceholder: "您喜欢这里什么？何时最美？对后来的旅行者有什么建议？",
    detailReviewAddPhotos: "＋ 最多添加2张照片",
    detailReviewPhotoLimit: "每张照片小于800 KB",
    detailReviewSubmit: "提交评价",
    fromYou: "距离您",
  },
  ko: {
    rewardTicket1Badge: "30,000동 할인 쿠폰",
    rewardTicket1Btn: "쿠폰 받기 →",
    rewardTicket2Badge: "단체/가족 15% – 20% 할인",
    rewardTicket2Btn: "투어 예약하고 적용 →",
    rewardTicket3Badge: "5성급 OCOP 특산품 증정",
    rewardTicket3Btn: "OCOP 특산품 보기 →",
    rewardStepsTitle: "리워드를 받는 간편한 3단계:",
    rewardStep1: "원하는 명소 또는 문화 투어 선택",
    rewardStep2: "수첩에 저장하거나 AI 오디오 가이드 청취",
    rewardStep3: "결제 할인 쿠폰 또는 OCOP 사은품 증정",
    heroTrendingLabel: "인기 검색:",
    heroTagHungTemple: "훙왕 신전",
    heroTagHotSpring: "탄투이 온천",
    heroTagLongCoc: "롱꼭 차밭",
    heroTagTamDao: "땀다오",
    heroTagOcopFood: "OCOP 특산품",
    heroBadgeHeritage: "국가 특별 사적지 · 훙왕 조상의 땅",
    heroBadgeAudio: "5개 국어 AI 오디오 가이드",
    heroTrustOcop: "성 인증 OCOP 특산물",
    heroTrustLanguages: "AI 오디오 지원 언어",
    audioResume: "▶ 이어듣기",
    modalGoodSeason: "여행하기 가장 좋은 달:",
    modalCautionSeason: "해당 월 날씨에 유의하세요:",
    brandSubtitle: "푸토 · 빈푹 · 호아빈",
    explore: "탐색",
    trip: "일정",
    near: "내 주변",
    saved: "저장됨",
    profile: "프로필",
    cart: "장바구니",
    vouchers: "프로모션",
    searchPlaceholder: "사원, 명소, 지역 특산품 검색...",
    heroKicker: "조상의 땅 문화유산 여행",
    heroTitle1: "제철에 떠나는 여행.",
    heroTitle2: "조상의 땅을 만나다.",
    heroDesc: "푸토, 빈푹, 호아빈 3개 지역의 명소, 문화유산 및 대표 음식을 경험해보세요.",
    featuredDestCaption: "주요 추천 명소",
    openGuideBtn: "가이드북 열기 →",
    stampOriginTitle: "민족의 시원",
    stampOriginSub: "역사 유산",
    heritageTag1: "✦ 2026 특별 테마 프로그램",
    heritageTag2: "✦ 문화유산 투어 & 포인트 교환",
    heritageTitle: "근원의 여정 — 탐방하고 OCOP 선물 받기",
    heritageDesc: "푸토, 빈푹, 호아빈 3개 지역 문화유산 투어에 참여하고, 대표 명소 체크인으로 포인트를 모아 특산품 쿠폰을 받아보세요.",
    perk1Title: "🏛️ 훙왕 신전 체크인",
    perk1Desc: "장소 저장 및 AI 문화해설 활성화 시 30,000₫ 쿠폰 즉시 증정.",
    perk2Title: "🎁 단체 및 가족 혜택",
    perk2Desc: "3인 이상 전통문화 체험 투어 시 15% - 20% 특별 할인.",
    perk3Title: "🍜 5성 OCOP 포인트 적립",
    perk3Desc: "적립 포인트로 탄선 발효 돼지고기, 롱콕 녹차 등 프리미엄 선물 세트 교환.",
    viewAllVouchersBtn: "모든 혜택 및 쿠폰 보기",
    planTripRewardBtn: "포인트 적립 일정 짜기 ✦",
    section01Num: "01",
    section01Title: "지역 및 테마별 탐색",
    viewAllBtn: "전체 보기 →",
    selectProvinceLabel: "지역 선택:",
    provAll: "✨ 3개 지역 전체",
    provPhuTho: "🏛️ 푸토성",
    provVinhPhuc: "☁️ 빈푹성",
    provHoaBinh: "🌲 호아빈성",
    seasonLabel: "계절별 추천",
    seasonAll: "전체",
    seasonInSeason: "지금 가기 좋은 곳",
    seasonSpring: "봄",
    seasonSummer: "여름",
    seasonAutumn: "가을",
    seasonWinter: "겨울",
    section02Num: "02",
    section02TitleDefault: "대표 주요 명소",
    section02TitleNear: "현재 위치 주변",
    locateBtn: "⌖ 위치 정보 켜기",
    loadMorePlaces: "더 많은 명소 보기 →",
    noResultsTitle: "검색 결과가 없습니다",
    noResultsDesc: "“운해”, “훙왕 신전”, “땀다오”, “마이쩌우”를 검색하거나 상단 카테고리를 선택해보세요.",
    section03Num: "03",
    section03Kicker: "스마트 여행 일정 플래너",
    section03Title1: "알찬 2일 일정,",
    section03Title2: "현지 가이드가 모두 케어합니다.",
    section03Desc: "푸토, 빈푹, 호아빈 3개 지역의 관광, 미식, 숙박, 교통 및 소요 시간을 자동으로 최적화합니다.",
    planTripSmartBtn: "스마트 일정 바로 생성하기 →",
    suggestedTourTitle: "추천 일정 코스",
    routeSummary1: "⌁ 이동이 편리한 최적 연계 도로망",
    routeSummary2: "일자별 투명하고 명확한 예상 경비",
    foodKicker: "지역 대표 특산 미식 지도",
    foodTitle1: "지역마다 펼쳐지는,",
    foodTitle2: "특별한 미식의 향연.",
    foodDesc: "각 코스별 정통 향토 요리를 맛보세요: 메기 요리, 탄선 발효 돼지고기, 땀다오 차요테 순, 마이쩌우 바나나잎 흑돼지 잔칫상.",
    foodSaveBtn: "♡ 요리 저장",
    foodSavedBtn: "♥ 저장됨",
    foodToggleView: "OCOP 판매처 보기 ▼",
    foodToggleHide: "접기 ▲",
    sellerVerified: "✓ 공식 인증 판매처",
    sellerSuggested: "○ 추천 매장",
    callSeller: "바로 전화",
    openMapSeller: "지도 열기 →",
    addToCartBtn: "＋ 장바구니 담기",
    shopeeHubTitle: "내 주문",
    shopeeHubHistoryLink: "주문 내역 보기",
    shopeeStatusPending: "결제/확인 대기",
    shopeeStatusProcessing: "상품 준비중",
    shopeeStatusShipping: "배송중",
    shopeeStatusCompleted: "구매평/완료",
    shopeeStatusCancelled: "취소됨",
    orderStatusAll: "전체",
    orderStatusPending: "확인 대기중",
    orderStatusProcessing: "처리중",
    orderStatusCompleted: "완료됨",
    orderStatusCancelled: "취소됨",
    myOrders: "주문 내역",
    checkout: "결제하기",
    paymentMethods: "결제 수단",
    applyVoucher: "쿠폰 적용",
    discount: "할인 금액",
    totalPayment: "총 결제금액",
    floatingCartLabel: "장바구니",
    floatingCartSubDefault: "OCOP 특산품 쇼핑",
    passportKicker: "3개 지역 여행 디지털 여권",
    passportTitle1: "발자국을 모으고,",
    passportTitle2: "특별한 혜택을 여세요.",
    passportProgress: "곳 체크인 완료 · 추가 도장을 모아 기념품을 받으세요",
    quickBookKicker: "빠른 서비스 예약",
    quickBookTitle: "완벽한 여행을 위한 모든 준비",
    btnTourDesignTitle: "맞춤형 투어 설계",
    btnTourDesignSub: "1분 만에 자동 코스 완성",
    btnHotelsTitle: "호텔 & 홈스테이",
    btnHotelsSub: "푸토 · 땀다오 · 마이쩌우 · 낌보이 온천",
    btnVouchersTitle: "쿠폰북 & 프로모션",
    btnVouchersSub: "OCOP 특산품 및 투어 할인 혜택",
    btnOcopTitle: "선물용 지역 특산품 (OCOP)",
    btnOcopSub: "발효 돼지고기, 차요테 순, 녹차…",
    partnerKicker: "현지 파트너 제휴",
    partnerTitle: "여행자들에게 귀사의 서비스를 홍보하세요.",
    partnerDesc: "식당, 숙소, OCOP 협동조합 및 여행사는 공식 인증 파트너 매장을 등록할 수 있습니다.",
    btnRegisterPartner: "파트너 신청하기 →",
    toastSwitchedLang: "모든 인터페이스가 한국어로 전환되었습니다",
    weatherToast: "지역 · 실시간 날씨 정보",
    roleAdmin: "관리자", roleMerchant: "OCOP 판매자", roleCustomer: "여행자",
    loginAccount: "계정에 로그인",
    searchInputPlaceholder: "훙왕 신전, 땀다오, 마이쩌우, 특산품 검색…",
    searchAriaLabel: "명소, 음식 또는 숙소 검색",
    searchSuggestionsMatched: "검색어와 일치하는 추천",
    searchSuggestionsPopular: "인기 여행지 및 대표 먹거리 추천",
    useCurrentLocation: "현재 위치 사용",
    tripPageTitle1: "스마트 일정 만들기", tripPageTitle2: "현지 가이드가 함께합니다.",
    tripPageDesc: "🏛️관광·🍲맛집·🛏️숙소·🚗교통 4대 요소를 자동 최적화, 푸토·빈푹·호아빈 3개 지역 전역.",
    tripControllerTitle: "일정 컨트롤러", tripCustomize: "나만의 여행 커스터마이즈",
    tripStep1: "1. 지역/도 선택", tripCombine3: "✨ 3개 지역 합치기",
    tripStep2: "2. 군/구 선택", tripAllDistricts: "전체 군구 (자유 루트)",
    tripDirectionGuide: "🧭 이동 안내:", tripRecommendedRoute: "추천 경로:",
    tripSignatureFoods: "대표 맛집:",
    tripStep3: "3. 투어에 포함할 명소 선택", tripSelected: "선택됨", tripPoints: "곳",
    tripSuggestedCombos: "인기 조합 루트:", tripAddAll: "+ 전체 추가", tripReset: "↺ 초기화",
    tripStep4: "4. 여행 일수", tripDays: "일", tripNights: "박", tripDayTrip: "(당일치기)",
    tripStep5: "5. 인원 수", tripGuests: "명", tripPerson: "명",
    tripCouple: "커플", tripFamily: "가족", tripGroup: "대규모 단체",
    tripStep6: "6. 예산 수준",
    tripBudgetEcon: "🏷️ 알뜰형 (~₩27,000/인/일)", tripBudgetStd: "⭐ 표준형 (~₩54,000/인/일)",
    tripBudgetPrem: "👑 프리미엄 (~₩108,000+/인/일)",
    tripStep7: "7. 이동 수단", tripCar: "자가용", tripMotorbike: "오토바이",
    tripLimousine: "리무진/관광버스", tripTaxi: "택시/전세차",
    tripStep8: "8. 여행 스타일", tripStyleCulture: "문화 & 역사", tripStyleSpa: "온천 & 힐링",
    tripStyleAdventure: "모험 & 운해", tripStyleFamily: "가족 친화적", tripStyleFood: "미식 탐방",
    tripGenerateBtn: "✦ 상세 일정 생성하기", tripGenerateNote: "거리·예산·맛집·오디오 가이드 자동 계산",
    tripStatDistance: "총 이동 거리", tripStatDriveTime: "운전 시간",
    tripStatTransport: "교통수단", tripStatCost: "1인 예상 비용",
    tripDayLabel: "일차", tripDayRoute: "당일 루트:",
    tripGuideTips: "💡 가이드 조언:", tripSafetyTips: "🛡️ 안전 & 이동 유의사항:",
    tripViewGoogleMaps: "🗺️ 지도에서 보기", tripPrintPdf: "▤ 인쇄 / PDF 내보내기",
    tripShare: "↗ 일정 공유", tripSaveNotebook: "♡ 수첩에 저장",
    tripTransportLabel: "교통수단:",
    tripSuggestedToursTitle: "추천 투어 템플릿", tripSuggestedToursDesc: "현지 전문가가 엄선 — 탭하면 즉시 적용.",
    nearKicker: "여행 편의시설 & 서비스", nearTitle1: "주변 편의시설", nearTitle2: "3개 지역 전역.",
    nearLocationNotEnabled: "위치 미활성화", nearAllowLocation: "실제 거리 계산을 위해 위치 허용",
    nearUpdateGPS: "GPS 갱신", nearEnableGPS: "GPS 활성화",
    nearAreaLabel: "지역:", nearAll3Provinces: "3개 지역 전체",
    nearServiceGasStation: "주유소", nearServiceParking: "주차장", nearServiceMedical: "의료",
    nearServiceATM: "ATM", nearServiceEV: "전기차 충전", nearServiceRescue: "긴급구조",
    nearServiceDestination: "명소", nearServiceFood: "맛집", nearServiceStay: "숙소",
    savedPlacesTab: "명소", savedFoodsTab: "음식", savedItineraryTab: "일정",
    savedPlacesEmpty: "저장된 명소 없음", savedPlacesEmptyDesc: "명소 카드의 ♡ 아이콘을 탭해 즐겨찾기에 저장하세요.",
    savedFoodsEmpty: "저장된 음식 없음", savedFoodsEmptyDesc: "탐색 탭에서 ♡ 음식 저장을 탭해 목록에 추가하세요.",
    savedItineraryEmpty: "저장된 일정 없음", savedItineraryEmptyDesc: "\"일정\" 탭에서 투어를 만든 후 \"수첩에 저장\"을 탭하세요.",
    savedCreateTrip: "일정 만들기 →", savedOpenDetail: "상세 보기 →",
    savedOpenGoogleMaps: "Google 지도 열기 ↗", savedDeleteItinerary: "삭제",
    savedDeletedToast: "수첩에서 일정이 삭제되었습니다", savedOpenedToast: "일정 상세를 열었습니다!", savedPerGuest: "/인",
    profileSystemAdmin: "🛡️ 시스템 관리자", profileMerchantOwner: "🏪 OCOP 판매자:",
    profilePartner: "파트너", profileCustomer: "👤 조상의 땅 여행자",
    profileNotLoggedIn: "로그인 안 됨", profileGuest: "게스트",
    profileLoginVia: "로그인 방법", profileLoginPrompt: "Gmail 또는 Facebook으로 로그인하여 OCOP 특산품을 주문하고 주문을 관리하세요.",
    profileSwitchAccount: "계정 전환", profileLogout: "로그아웃",
    profileLoginNow: "🔑 지금 로그인",
    profileOrderMgmt: "주문 관리 (Google Sheets)",
    profileAdminOrderDesc: "관리자: 주문 관리·배정·시트 내보내기", profileMerchantOrderDesc: "판매자: 주문 & 배송 관리",
    profileOrdersCount: "건", profileOrdersPlaced: "건 주문 · 배송 상태 추적하기",
    profileNoOrders: "주문 없음 · OCOP 특산품 탐색 후 지금 주문하세요", profileItems: "개",
    footerDesc: "스마트 여행 가이드 & 디지털 일정 어시스턴트 · 조상의 땅 정수.", footerLink: "닷또 트래블 ↗",
    authLoginTab: "로그인", authRegisterTab: "계정 만들기", authAdminTab: "관리자",
    authEmail: "이메일 주소", authPassword: "비밀번호",
    authShowPassword: "표시", authHidePassword: "숨기기",
    authForgotPassword: "비밀번호 찾기", authLoginBtn: "로그인",
    authOrLoginWith: "또는 빠르게 로그인", authRegisterName: "이름",
    authRegisterPhone: "전화번호", authRegisterConfirmPass: "비밀번호 확인",
    authRegisterBtn: "계정 만들기", authAdminUser: "관리자 아이디",
    authAdminPass: "관리자 비밀번호", authAdminLoginBtn: "관리자 로그인", authClose: "닫기",
    directoryKicker: "관광지 검색 디렉토리", directoryTitle: "100곳 관광·맛집·숙소 안내서",
    directoryDesc: "지역별 관광지, 맛집, 숙소를 빠르게 검색하세요.",
    directoryCollapse: "디렉토리 접기 ▲", directoryExpand: "전체 디렉토리 열기",
    directorySearchPlaceholder: "이름, 음식, 호텔로 검색...",
    directoryAllDistricts: "전체 군/구", directoryDistrictPrefix: "군/구:",
    directoryColNo: "번호", directoryColName: "명소명", directoryColType: "유형",
    directoryColArea: "지역", directoryColFood: "주변 맛집", directoryColStay: "주변 숙소",
    directoryColDist: "거리",
    modalClose: "닫기", modalReviews: "개 리뷰", modalPhoto: "사진:",
    loginRequiredToast: "주문하려면 Gmail 또는 Facebook으로 로그인하세요!",
    needAtLeast1Place: "일정에 최소 1곳의 명소를 유지해야 합니다!",
    registerPartnerToast: "감사합니다! 파트너 신청이 접수되었습니다.",
    openTripAssistant: "일정 계획 어시스턴트 열림", selectResortToast: "리조트 선택 후 주변 숙소 보기",
    toastLangChanged: "언어가 전환되었습니다:",
    clearOrdersConfirm: "이 계정의 모든 주문 내역을 삭제하시겠습니까?",
    audioPause: "⏸ 일시정지", audioListen: "▶ 오디오 가이드 듣기",
    audioStop: "정지", audioVoiceLabel: "🗣️ 음성:",
    audioVolumeLabel: "🔊 볼륨:", audioSpeedLabel: "속도:",
    // Common & Actions
    bottomNavAria: "모바일 내비게이션",
    getDirectionsBtn: "길찾기 →",
    detailsBtn: "상세보기 →",
    callNowBtn: "전화걸기",
    serviceListTitle: "편의시설 목록",
    serviceListSub: "가장 가까운 거리순 정렬",
    sosTitle: "24/7 긴급 지원 및 구조 핫라인",
    sosSub: "모든 여행 경로에서 항상 도와드립니다.",
    sosNationalRescue: "국가 구조대",
    sosPolice: "경찰",
    sosAmbulance: "응급 의료",
    sosTrafficRescue: "교통사고 구조",
    festivalKicker: "문화 축제 일정",
    festivalTitle1: "날짜에 맞춰 떠나고,",
    festivalTitle2: "축제를 만끽하세요.",
    festivalDesc: "여행 일정 계획을 돕기 위해 전통 축제 일정이 음력으로 표기됩니다.",
    bookingRequired: "사전 예약 필수",
    openPlaceBtn: "여행지 열기 →",
    // Shopee Hub & Commerce
    shopeePurchases: "주문 내역",
    shopeeViewHistory: "구매 내역 보기",
    statusPending: "확인 대기",
    statusProcessing: "준비 중",
    statusShipping: "배송 중",
    statusCompleted: "완료됨",
    statusCancelled: "취소됨",
    cartEmptyTitle: "장바구니가 비어 있습니다",
    cartEmptyDesc: "미식 지도를 둘러보고 특산품을 장바구니에 담아보세요.",
    viewSpecialtiesBtn: "특산물 둘러보기 →",
    voucherPromotionsTitle: "할인 쿠폰 & 프로모션",
    chooseOtherVoucherBtn: "다른 쿠폰 선택 →",
    removeVoucherTitle: "쿠폰 삭제",
    voucherInputPlaceholder: "코드 입력: DATTO10, LEHOI2026...",
    applyVoucherBtn: "적용",
    currencyLabel: "통화 단위:",
    subtotalLabel: "소계",
    discountVoucherLabel: "할인 혜택",
    authRequiredOrderTitle: "주문하려면 로그인이 필요합니다",
    authRequiredOrderDesc: "주문 저장 및 판매자 알림 수신을 위해 Gmail 또는 Facebook으로 로그인하세요.",
    loginGoogle: "Gmail (Google)로 로그인",
    loginFacebook: "Facebook으로 로그인",
    loginAdminLink: "🛡️ 관리자 로그인 (Admin) →",
    orderAccountLabel: "주문 계정:",
    changeAccountBtn: "변경",
    fullNameLabel: "주문자 성함",
    phoneNumberLabel: "연락처",
    shippingAddressLabel: "배송지 주소 / 호텔 이름",
    orderNoteLabel: "추가 요청사항 (배송 시간, 포장 등)",
    orderNotePlaceholder: "판매자에게 전달할 메모",
    confirmOrderBtn: "주문 확인",
    loginToCompleteOrder: "🔒 로그인하고 주문 완료하기 →",
    noOrdersInStatus: "이 상태의 주문이 없습니다",
    noOrdersInStatusDesc: "다른 탭을 선택하거나 OCOP 특산품을 주문해 보세요.",
    clearOrderHistoryBtn: "🗑️ 주문 기록 전체 삭제",
    orderNumberLabel: "주문번호",
    cancelOrderBtn: "주문 취소",
    reorderBtn: "다시 주문하기 ↻",
    // Booking & Success
    bookingStayRequest: "숙박 예약 요청",
    priceFromLabel: "시작 가격",
    bookingRepName: "대표자 성함",
    checkInDate: "체크인 날짜",
    checkOutDate: "체크아웃 날짜",
    specialRequest: "특별 요청",
    estimatedTotalStay: "예상 총액",
    sendBookingRequestBtn: "예약 요청 보내기 →",
    orderSuccessKicker: "주문이 완료되었습니다",
    trackYourOrderBtn: "주문 진행 상황 확인 및 추적 →",
    continueExploreBtn: "여행지 계속 탐색하기",
    // Place detail, food market & slot details
    modalBestTime: "추천 방문 시간대",
    modalDuration: "권장 소요 시간",
    modalFromVietTri: "비엣찌 중심지 기준",
    modalEstimatedCost: "참고 비용",
    modalHighlightsTitle: "놓치지 말아야 할 대표 포인트",
    modalNoticeTitle: "여행 전 유의사항",
    modalTransportTipsTitle: "추천 교통수단 & 이동 코스",
    modalVehicleLabel: "🚗 적합한 교통수단:",
    modalRouteLabel: "🛣️ 추천 경로:",
    modalCautionLabel: "⚠️ 안전 유의사항:",
    modalOpenDirections: "⌁ 경로 안내 보기",
    slotWhereSightsee: "🏛️ 추천 관광 명소",
    slotDestination: "목적지:",
    slotHighlights: "대표 포인트:",
    slotWhereDine: "🍲 추천 맛집 & 특색 요리",
    slotSpecialtyMenu: "특선 메뉴:",
    slotFreeDine: "이동 경로에서 현지 특색 음식을 자유롭게 즐겨보세요.",
    slotWhereStay: "🛏️ 추천 숙소 & 호텔",
    slotAmenities: "서비스 & 편의시설:",
    slotGuideAdvice: "가이드 안내 팁:",
    addressLabel: "주소:",
    servingHoursLabel: "영업 시간:",
    contactAtShop: "매장 문의",
    pickupNoteLabel: "수령 참고 사항:",
    applyTourHint: "투어를 탭하여 바로 적용하기",
      catAll: "전체",
    catHeritage: "문화유산 및 힐링",
    catNature: "산림 및 자연생태",
    catResort: "휴양 및 힐링",
    catCraft: "전통문화 및 공예마을",
    catSightseeing: "인생샷 및 레저",
    seasonYearRound: "사계절 연중",
    fromVietTri: "비엣찌 기준",
    savedNotebookKicker: "나만의 여행 수첩",
    savedNotebookTitle1: "저장해 둔 명소와",
    savedNotebookTitle2: "로컬 미식 컬렉션.",
    savedNotebookDesc: "데이터가 기기에 안전하게 저장되어 여행 중 언제든 편리하게 확인할 수 있습니다.",
    comboTour1: "훙왕 사당 + 탄투이 온천",
    comboTour2: "땀다오 + 마이쩌우 계곡",
    comboTour3: "탄투이 + 낌보이 온천",
    comboTour4: "3개 성 완전 정복 (푸토 – 빈푹 – 호아빈)",
    periodMorning: "오전",
    periodNoon: "점심",
    periodAfternoon: "오후",
    periodEvening: "저녁",
    slotMorningDepart: "출발 및 탐방:",
    slotDineAt: "현지 미식 체험:",
    slotAfternoonExp: "체험 및 포토존:",
    slotDinnerAt: "특선 석식 및 휴식:",
    slotTourEndDinner: "환송 특선 석식 및 여정 마무리",
    itineraryJourneyPrefix: "여정",
    itineraryDiscover: "탐방",
    itineraryCombined: "연계 루트",
    audioVoiceStudioFemale: "하노이 여성 AI (스튜디오 표준 - 부드러움)",
    audioVoiceStudioMale: "북부 남성 AI (차분하고 또렷함)",
    audioVoiceEnglish: "글로벌 영어 AI 음성",
    detailTabFood: "인근 맛집 및 대표 미식",
    detailTabStay: "인근 호텔 및 숙소",
    detailReviewKicker: "여행자 후기 및 생생한 리뷰",
    detailReviewTitle: "실제 사진 및 방문 소감",
    detailReviewEmpty: "아직 리뷰가 없습니다. 첫 번째로 후기를 공유해 보세요!",
    detailTasteLabel: "맛과 풍미:",
    detailOpenHours: "영업 시간:",
    detailCallBookTable: "전화 예약 / 사전 주문하기 →",
    detailBookRoomFrom: "객실 예약 · 최저",
    detailPerNightUnit: "/박 →",
    nearLocationUnsupported: "기기에서 위치 서비스를 지원하지 않습니다",
    nearLocationLocating: "위치 확인 중…",
    nearLocationSuccess: "현재 위치 적용됨",
    nearLocationDenied: "위치를 가져올 수 없습니다 — GPS 권한을 허용해 주세요",
      detailViewMap: "지도 보기 →",
    detailReviewName: "표시 이름",
    detailReviewRating: "별점 평가",
    detailReviewShare: "방문 후기 작성",
    detailReviewPlaceholder: "어떤 점이 좋았나요? 추천 방문 시기는? 다음 여행자를 위한 팁은?",
    detailReviewAddPhotos: "＋ 사진 최대 2장 추가",
    detailReviewPhotoLimit: "각 사진 800KB 이하",
    detailReviewSubmit: "후기 등록",
    fromYou: "현재 위치 기준",
  },
  ja: {
    rewardTicket1Badge: "30,000VND割引クーポン",
    rewardTicket1Btn: "今すぐ獲得 →",
    rewardTicket2Badge: "グループ15%〜20%割引",
    rewardTicket2Btn: "ツアー予約で特典適用 →",
    rewardTicket3Badge: "5つ星OCOP特産ギフト",
    rewardTicket3Btn: "OCOP特産品を見る →",
    rewardStepsTitle: "かんたん3ステップで特典獲得：",
    rewardStep1: "お気に入りの名所やツアーを選択",
    rewardStep2: "旅のノートに保存またはAI音声ガイドを聴く",
    rewardStep3: "即時割引クーポンまたは特産ギフトを獲得",
    heroTrendingLabel: "注目の検索：",
    heroTagHungTemple: "フン寺院",
    heroTagHotSpring: "タントゥイ温泉",
    heroTagLongCoc: "ロンコック茶畑",
    heroTagTamDao: "タムダオ",
    heroTagOcopFood: "OCOP特産品",
    heroBadgeHeritage: "国家特別遺跡・フン王祖先の地",
    heroBadgeAudio: "5言語対応 AI音声ガイド",
    heroTrustOcop: "省認定OCOP特産品",
    heroTrustLanguages: "AI音声ガイド対応言語",
    audioResume: "▶ 再生再開",
    modalGoodSeason: "今月は絶好の旅行シーズン：",
    modalCautionSeason: "今月の天候にご注意ください：",
    brandSubtitle: "フート省 · ビンフック省 · ホアビン省",
    explore: "探索",
    trip: "旅程",
    near: "周辺",
    saved: "保存済み",
    profile: "マイページ",
    cart: "カート",
    vouchers: "特典・クーポン",
    searchPlaceholder: "寺院、観光名所、特産品を検索...",
    heroKicker: "祖先の地 遺産巡り",
    heroTitle1: "旬の旅。",
    heroTitle2: "祖先の地に触れる。",
    heroDesc: "フート、ビンフック、ホアビン3省の絶景、文化遺産、郷土料理をご堪能ください。",
    featuredDestCaption: "注目の名所",
    openGuideBtn: "ガイドブックを開く →",
    stampOriginTitle: "民族のルーツ",
    stampOriginSub: "歴史遺産",
    heritageTag1: "✦ 2026 特別テーマ企画",
    heritageTag2: "✦ 遺産巡り · チェックイン特典",
    heritageTitle: "ルーツの旅 —— 観光して OCOP 特産品ギフトを獲得",
    heritageDesc: "フート、ビンフック、ホアビン3省の遺産ルートに参加し、名所を巡ってポイントを貯め、限定特産品クーポンをゲットしましょう。",
    perk1Title: "🏛️ フン王神殿チェックイン",
    perk1Desc: "スポット保存と AI 音声ガイド利用で 30,000₫ クーポンを進呈。",
    perk2Title: "🎁 グループ＆ファミリー特典",
    perk2Desc: "3名様以上の伝統文化体験ツアーで 15% - 20% オフ。",
    perk3Title: "🍜 5つ星 OCOP ポイント交換",
    perk3Desc: "貯めたポイントでタインソン発酵豚肉やロンコック銘茶などと交換可能。",
    viewAllVouchersBtn: "すべての特典・クーポンを見る",
    planTripRewardBtn: "特典付きプランを作成 ✦",
    section01Num: "01",
    section01Title: "地域・テーマ別で探す",
    viewAllBtn: "すべて見る →",
    selectProvinceLabel: "省を選択:",
    provAll: "✨ 3省すべて",
    provPhuTho: "🏛️ フート省",
    provVinhPhuc: "☁️ ビンフック省",
    provHoaBinh: "🌲 ホアビン省",
    seasonLabel: "季節ごとの旅",
    seasonAll: "すべて",
    seasonInSeason: "今が旬",
    seasonSpring: "春",
    seasonSummer: "夏",
    seasonAutumn: "秋",
    seasonWinter: "冬",
    section02Num: "02",
    section02TitleDefault: "代表的な名所・旧跡",
    section02TitleNear: "現在地周辺のスポット",
    locateBtn: "⌖ 位置情報を有効化",
    loadMorePlaces: "さらにスポットを見る →",
    noResultsTitle: "検索結果が見つかりません",
    noResultsDesc: "「雲海」「フン寺」「タムダオ」「マイチャウ」で検索するか、上記のカテゴリをお選びください。",
    section03Num: "03",
    section03Kicker: "スマート旅程アシスタント",
    section03Title1: "充実の2日間、",
    section03Title2: "現地ガイドがすべてサポート。",
    section03Desc: "フート、ビンフック、ホアビン3省の観光、食事、宿泊、移動時間を自動で最適化します。",
    planTripSmartBtn: "スマート旅程を今すぐ作成 →",
    suggestedTourTitle: "おすすめモデルコース",
    routeSummary1: "⌁ 移動に便利な快適ルート網",
    routeSummary2: "日ごとの明瞭な予算目安",
    foodKicker: "郷土特産グルメマップ",
    foodTitle1: "それぞれの土地に、",
    foodTitle2: "それぞれの豊かな風味。",
    foodDesc: "ルートごとの本場の味をご堪能ください：ラン魚料理、タインソン発酵豚肉、タムダオハヤトウリの若芽、マイチャウの黒豚バナナの葉包み焼き。",
    foodSaveBtn: "♡ 料理を保存",
    foodSavedBtn: "♥ 保存済み",
    foodToggleView: "OCOP 販売店を見る ▼",
    foodToggleHide: "閉じる ▲",
    sellerVerified: "✓ 認証済み優良店",
    sellerSuggested: "○ おすすめ店舗",
    callSeller: "電話する",
    openMapSeller: "地図を開く →",
    addToCartBtn: "＋ カートに追加",
    shopeeHubTitle: "ご注文商品",
    shopeeHubHistoryLink: "注文履歴を見る",
    shopeeStatusPending: "確認待ち/未払い",
    shopeeStatusProcessing: "発送準備中",
    shopeeStatusShipping: "配送中",
    shopeeStatusCompleted: "受取・レビュー",
    shopeeStatusCancelled: "キャンセル済み",
    orderStatusAll: "すべて",
    orderStatusPending: "確認待ち",
    orderStatusProcessing: "準備中",
    orderStatusCompleted: "完了",
    orderStatusCancelled: "キャンセル",
    myOrders: "注文履歴",
    checkout: "お支払い",
    paymentMethods: "お支払い方法",
    applyVoucher: "クーポンを適用",
    discount: "割引",
    totalPayment: "お支払い合計",
    floatingCartLabel: "カート",
    floatingCartSubDefault: "OCOP 特産品",
    passportKicker: "3省周遊デジタルパスポート",
    passportTitle1: "足跡を集めて、",
    passportTitle2: "特別な特典を解除。",
    passportProgress: "箇所のチェックイン完了 · スタンプを集めて記念品をゲット",
    quickBookKicker: "クイック予約サービス",
    quickBookTitle: "快適な旅のためのすべての準備",
    btnTourDesignTitle: "オーダーメイドツアー設計",
    btnTourDesignSub: "1分で自動ルート生成",
    btnHotelsTitle: "ホテル＆ホームステイ",
    btnHotelsSub: "フート · タムダオ · マイチャウ · キムボイ温泉",
    btnVouchersTitle: "クーポン一覧・特典",
    btnVouchersSub: "OCOP 特産品＆ツアー割引",
    btnOcopTitle: "お土産特産品 (OCOP)",
    btnOcopSub: "発酵豚肉、ハヤトウリの芽、銘茶…",
    partnerKicker: "現地パートナー様向け",
    partnerTitle: "旅行者にサービスをアピール。",
    partnerDesc: "飲食店、宿泊施設、OCOP 協同組合、旅行会社様は公式認証店舗をご登録いただけます。",
    btnRegisterPartner: "パートナー登録 →",
    toastSwitchedLang: "すべてのインターフェースを日本語に切り替えました",
    weatherToast: "地域 · リアルタイム天気情報",
    roleAdmin: "管理者", roleMerchant: "OCOP 出店者", roleCustomer: "旅行者",
    loginAccount: "アカウントにログイン",
    searchInputPlaceholder: "フン王寺、タムダオ、マイチャウ、特産品を検索…",
    searchAriaLabel: "観光地、料理、宿泊施設を検索",
    searchSuggestionsMatched: "検索キーワードに一致する候補",
    searchSuggestionsPopular: "人気の目的地・名物グルメ候補",
    useCurrentLocation: "現在地を使用",
    tripPageTitle1: "スマート旅程を作成", tripPageTitle2: "現地ガイドがサポート。",
    tripPageDesc: "🏛️観光·🍲グルメ·🛏️宿泊·🚗移動の4要素を自動最適化、フート・ビンフック・ホアビン3省全域。",
    tripControllerTitle: "旅程コントローラー", tripCustomize: "旅をカスタマイズ",
    tripStep1: "1. 省/地域を選択", tripCombine3: "✨ 3省を組み合わせ",
    tripStep2: "2. 郡/市を選択", tripAllDistricts: "全郡区（自由ルート）",
    tripDirectionGuide: "🧭 アクセス案内：", tripRecommendedRoute: "おすすめルート：",
    tripSignatureFoods: "名物料理：",
    tripStep3: "3. ツアーに含める観光地を選択", tripSelected: "選択済み", tripPoints: "箇所",
    tripSuggestedCombos: "人気コンビネーション：", tripAddAll: "+ すべて追加", tripReset: "↺ リセット",
    tripStep4: "4. 日数", tripDays: "日", tripNights: "泊", tripDayTrip: "（日帰り）",
    tripStep5: "5. 人数", tripGuests: "名", tripPerson: "名",
    tripCouple: "カップル", tripFamily: "ファミリー", tripGroup: "大人数グループ",
    tripStep6: "6. 予算レベル",
    tripBudgetEcon: "🏷️ エコノミー（~¥3,000/人/日）", tripBudgetStd: "⭐ スタンダード（~¥6,000/人/日）",
    tripBudgetPrem: "👑 プレミアム（~¥12,000+/人/日）",
    tripStep7: "7. 移動手段", tripCar: "自家用車", tripMotorbike: "バイク",
    tripLimousine: "リムジン/観光バス", tripTaxi: "タクシー/チャーター車",
    tripStep8: "8. 旅のスタイル", tripStyleCulture: "文化＆歴史", tripStyleSpa: "温泉＆ヒーリング",
    tripStyleAdventure: "冒険＆雲海", tripStyleFamily: "ファミリー向け", tripStyleFood: "グルメ巡り",
    tripGenerateBtn: "✦ 詳細旅程を生成", tripGenerateNote: "距離・予算・グルメ・音声ガイドを自動計算",
    tripStatDistance: "総走行距離", tripStatDriveTime: "運転時間",
    tripStatTransport: "交通手段", tripStatCost: "1人あたり予算",
    tripDayLabel: "日目", tripDayRoute: "本日のルート：",
    tripGuideTips: "💡 ガイドからのアドバイス：", tripSafetyTips: "🛡️ 安全＆移動の注意点：",
    tripViewGoogleMaps: "🗺️ 地図で見る", tripPrintPdf: "▤ 印刷 / PDF出力",
    tripShare: "↗ 旅程を共有", tripSaveNotebook: "♡ 手帳に保存",
    tripTransportLabel: "交通手段：",
    tripSuggestedToursTitle: "おすすめモデルコース", tripSuggestedToursDesc: "現地の専門家が厳選 — タップで即適用。",
    nearKicker: "旅行便利施設＆サービス", nearTitle1: "周辺の便利施設", nearTitle2: "3省全域。",
    nearLocationNotEnabled: "位置情報未有効化", nearAllowLocation: "実際の距離計算のため位置情報を許可",
    nearUpdateGPS: "GPS更新", nearEnableGPS: "GPSを有効化",
    nearAreaLabel: "エリア：", nearAll3Provinces: "3省全て",
    nearServiceGasStation: "ガソリンスタンド", nearServiceParking: "駐車場", nearServiceMedical: "医療",
    nearServiceATM: "ATM", nearServiceEV: "EV充電", nearServiceRescue: "緊急レスキュー",
    nearServiceDestination: "観光地", nearServiceFood: "飲食店", nearServiceStay: "宿泊",
    savedPlacesTab: "スポット", savedFoodsTab: "グルメ", savedItineraryTab: "旅程",
    savedPlacesEmpty: "保存済みスポットなし", savedPlacesEmptyDesc: "スポットカードの♡アイコンをタップしてお気に入りに追加。",
    savedFoodsEmpty: "保存済みグルメなし", savedFoodsEmptyDesc: "探索タブで♡料理を保存をタップしてリストに追加。",
    savedItineraryEmpty: "保存済み旅程なし", savedItineraryEmptyDesc: "「旅程」タブでツアーを作成し「手帳に保存」をタップ。",
    savedCreateTrip: "旅程を作成 →", savedOpenDetail: "詳細を見る →",
    savedOpenGoogleMaps: "Google マップで開く ↗", savedDeleteItinerary: "削除",
    savedDeletedToast: "手帳から旅程を削除しました", savedOpenedToast: "旅程の詳細を開きました！", savedPerGuest: "/人",
    profileSystemAdmin: "🛡️ システム管理者", profileMerchantOwner: "🏪 OCOP出店者：",
    profilePartner: "パートナー", profileCustomer: "👤 祖先の地の旅行者",
    profileNotLoggedIn: "未ログイン", profileGuest: "ゲスト",
    profileLoginVia: "ログイン方法", profileLoginPrompt: "GmailまたはFacebookでログインしてOCOP特産品を注文・管理。",
    profileSwitchAccount: "アカウント切替", profileLogout: "ログアウト",
    profileLoginNow: "🔑 今すぐログイン",
    profileOrderMgmt: "注文管理 (Google Sheets)",
    profileAdminOrderDesc: "管理者：注文管理・配車・エクスポート", profileMerchantOrderDesc: "出店者：注文＆配送管理",
    profileOrdersCount: "件", profileOrdersPlaced: "件の注文 · 配送状況を確認",
    profileNoOrders: "注文なし · OCOP特産品を探して今すぐ注文", profileItems: "品",
    footerDesc: "スマートな旅行ガイド＆デジタル旅程アシスタント · 祖先の地の精華。", footerLink: "ダットトー トラベル ↗",
    authLoginTab: "ログイン", authRegisterTab: "アカウント作成", authAdminTab: "管理者",
    authEmail: "メールアドレス", authPassword: "パスワード",
    authShowPassword: "表示", authHidePassword: "非表示",
    authForgotPassword: "パスワードをお忘れですか？", authLoginBtn: "ログイン",
    authOrLoginWith: "または素早くログイン", authRegisterName: "氏名",
    authRegisterPhone: "電話番号", authRegisterConfirmPass: "パスワード確認",
    authRegisterBtn: "アカウント作成", authAdminUser: "管理者ユーザー名",
    authAdminPass: "管理者パスワード", authAdminLoginBtn: "管理者ログイン", authClose: "閉じる",
    directoryKicker: "スポット検索ディレクトリ", directoryTitle: "100箇所 観光・グルメ・宿泊ガイド",
    directoryDesc: "エリア別に観光地、レストラン、宿泊施設を素早く検索。",
    directoryCollapse: "ディレクトリを閉じる ▲", directoryExpand: "全ディレクトリを開く",
    directorySearchPlaceholder: "名前、料理、ホテルで検索...",
    directoryAllDistricts: "全郡/区", directoryDistrictPrefix: "郡/区：",
    directoryColNo: "番号", directoryColName: "スポット名", directoryColType: "タイプ",
    directoryColArea: "エリア", directoryColFood: "周辺グルメ", directoryColStay: "周辺宿泊",
    directoryColDist: "距離",
    modalClose: "閉じる", modalReviews: "件のレビュー", modalPhoto: "写真：",
    loginRequiredToast: "ご注文にはGmailまたはFacebookでのログインが必要です！",
    needAtLeast1Place: "旅程には最低1箇所の観光地が必要です！",
    registerPartnerToast: "ありがとうございます！パートナー申請を受け付けました。",
    openTripAssistant: "旅程プランナーを開きました", selectResortToast: "リゾートを選択して周辺宿泊を表示",
    toastLangChanged: "言語を切り替えました：",
    clearOrdersConfirm: "このアカウントの全注文履歴を削除しますか？",
    audioPause: "⏸ 一時停止", audioListen: "▶ 音声ガイドを聴く",
    audioStop: "停止", audioVoiceLabel: "🗣️ 音声：",
    audioVolumeLabel: "🔊 音量：", audioSpeedLabel: "速度：",
    // Common & Actions
    bottomNavAria: "モバイルナビゲーション",
    getDirectionsBtn: "ルート案内 →",
    detailsBtn: "詳細を見る →",
    callNowBtn: "電話をかける",
    serviceListTitle: "施設一覧",
    serviceListSub: "現在地から近い順に表示",
    sosTitle: "24時間緊急サポート＆救援ホットライン",
    sosSub: "旅のすべてのルートでいつでもサポートいたします。",
    sosNationalRescue: "国家救助",
    sosPolice: "警察",
    sosAmbulance: "救急医療",
    sosTrafficRescue: "ロードサービス",
    festivalKicker: "文化祭カレンダー",
    festivalTitle1: "日程を合わせて、",
    festivalTitle2: "お祭りを体感。",
    festivalDesc: "旅行の計画を立てやすいよう、伝統的な祭りの日程は旧暦で表記されています。",
    bookingRequired: "事前予約が必要",
    openPlaceBtn: "目的地を開く →",
    // Shopee Hub & Commerce
    shopeePurchases: "購入履歴",
    shopeeViewHistory: "注文履歴を見る",
    statusPending: "確認待ち",
    statusProcessing: "準備中",
    statusShipping: "配送中",
    statusCompleted: "完了",
    statusCancelled: "キャンセル",
    cartEmptyTitle: "カートは空です",
    cartEmptyDesc: "グルメマップを見て特産品をカートに追加しましょう。",
    viewSpecialtiesBtn: "特産品を見る →",
    voucherPromotionsTitle: "クーポン＆お得情報",
    chooseOtherVoucherBtn: "他のクーポンを選ぶ →",
    removeVoucherTitle: "クーポン解除",
    voucherInputPlaceholder: "コード入力: DATTO10, LEHOI2026...",
    applyVoucherBtn: "適用",
    currencyLabel: "通貨単位:",
    subtotalLabel: "小計",
    discountVoucherLabel: "割引特典",
    authRequiredOrderTitle: "注文にはログインが必要です",
    authRequiredOrderDesc: "注文の保存や店舗からの通知を受け取るため、GmailまたはFacebookでログインしてください。",
    loginGoogle: "Gmail (Google) でログイン",
    loginFacebook: "Facebook でログイン",
    loginAdminLink: "🛡️ 管理者ログイン (Admin) →",
    orderAccountLabel: "注文アカウント:",
    changeAccountBtn: "変更",
    fullNameLabel: "お名前",
    phoneNumberLabel: "電話番号",
    shippingAddressLabel: "お届け先住所 / ホテル名",
    orderNoteLabel: "備考（配送希望時間、梱包など）",
    orderNotePlaceholder: "店舗へのメッセージ",
    confirmOrderBtn: "注文を確定する",
    loginToCompleteOrder: "🔒 ログインして注文を完了する →",
    noOrdersInStatus: "この項目の注文はありません",
    noOrdersInStatusDesc: "他のタブを選択するか、特産品を注文してください。",
    clearOrderHistoryBtn: "🗑️ 注文履歴をクリア",
    orderNumberLabel: "注文番号",
    cancelOrderBtn: "注文をキャンセル",
    reorderBtn: "再注文する ↻",
    // Booking & Success
    bookingStayRequest: "宿泊予約リクエスト",
    priceFromLabel: "参考料金",
    bookingRepName: "代表者氏名",
    checkInDate: "チェックイン日",
    checkOutDate: "チェックアウト日",
    specialRequest: "特別なご要望",
    estimatedTotalStay: "概算合計金額",
    sendBookingRequestBtn: "予約リクエストを送信 →",
    orderSuccessKicker: "ご注文が完了しました",
    trackYourOrderBtn: "注文状況を確認・追跡する →",
    continueExploreBtn: "引き続き観光地を探す",
    // Place detail, food market & slot details
    modalBestTime: "おすすめの時間帯",
    modalDuration: "所要時間の目安",
    modalFromVietTri: "ヴィエットチー中心部から",
    modalEstimatedCost: "参考予算・費用",
    modalHighlightsTitle: "見逃せないハイライト",
    modalNoticeTitle: "お出かけ前の注意事項",
    modalTransportTipsTitle: "交通手段・ルートのご案内",
    modalVehicleLabel: "🚗 推奨の移動手段：",
    modalRouteLabel: "🛣️ おすすめルート：",
    modalCautionLabel: "⚠️ 安全上の注意：",
    modalOpenDirections: "⌁ ルート案内を開く",
    slotWhereSightsee: "🏛️ 観光スポット",
    slotDestination: "目的地：",
    slotHighlights: "ハイライト：",
    slotWhereDine: "🍲 郷土料理・おすすめ飲食店",
    slotSpecialtyMenu: "名物メニュー：",
    slotFreeDine: "道中で地域の郷土料理や名物を自由にお楽しみください。",
    slotWhereStay: "🛏️ おすすめ宿泊施設",
    slotAmenities: "サービス＆アメニティ：",
    slotGuideAdvice: "ガイドからのアドバイス：",
    addressLabel: "住所：",
    servingHoursLabel: "営業時間：",
    contactAtShop: "店舗にてお問い合わせ",
    pickupNoteLabel: "受け取り時の注意事項：",
    applyTourHint: "ツアーをタップして今すぐ適用",
      catAll: "すべて",
    catHeritage: "遺産・スピリチュアル",
    catNature: "自然・エコツーリズム",
    catResort: "温泉リゾート・癒し",
    catCraft: "伝統文化・工芸村",
    catSightseeing: "映えスポット・レジャー",
    seasonYearRound: "通年おすすめ",
    fromVietTri: "ヴィエッチーから",
    savedNotebookKicker: "あなたの旅のノート",
    savedNotebookTitle1: "お気に入りのスポット＆",
    savedNotebookTitle2: "ご当地グルメ。",
    savedNotebookDesc: "データは端末にローカル保存され、旅先でもいつでも簡単に確認できます。",
    comboTour1: "フン寺院 + タントゥイ温泉",
    comboTour2: "タムダオ + マイチャウ渓谷",
    comboTour3: "タントゥイ + キムボイ温泉",
    comboTour4: "3省周遊グランドツアー（フートー – ヴィンフック – ホアビン）",
    periodMorning: "午前",
    periodNoon: "昼",
    periodAfternoon: "午後",
    periodEvening: "夜",
    slotMorningDepart: "出発・見学：",
    slotDineAt: "郷土料理を堪能：",
    slotAfternoonExp: "体験＆散策：",
    slotDinnerAt: "名物ディナー＆滞在：",
    slotTourEndDinner: "名物ディナー＆ツアー終了",
    itineraryJourneyPrefix: "旅程",
    itineraryDiscover: "巡る",
    itineraryCombined: "周遊ルート",
    audioVoiceStudioFemale: "ハノイ女性AI（スタジオ音質・優雅）",
    audioVoiceStudioMale: "北部男性AI（落ち着いたクリアな声）",
    audioVoiceEnglish: "国際英語 AIボイス",
    detailTabFood: "周辺のグルメ・名店",
    detailTabStay: "周辺のホテル・宿泊施設",
    detailReviewKicker: "旅行者の声・リアルレビュー",
    detailReviewTitle: "実際の写真と体験談",
    detailReviewEmpty: "まだレビューがありません。最初の体験談を投稿してみましょう！",
    detailTasteLabel: "味・特徴：",
    detailOpenHours: "営業時間：",
    detailCallBookTable: "席の予約・事前注文はこちら →",
    detailBookRoomFrom: "宿泊予約 · 1泊",
    detailPerNightUnit: "/泊 →",
    nearLocationUnsupported: "端末が位置情報に対応していません",
    nearLocationLocating: "位置情報を取得中…",
    nearLocationSuccess: "現在地を取得しました",
    nearLocationDenied: "位置情報を取得できません — GPS権限を許可してください",
      detailViewMap: "地図を見る →",
    detailReviewName: "表示名",
    detailReviewRating: "評価（星）",
    detailReviewShare: "体験を共有",
    detailReviewPlaceholder: "良かった点は？おすすめの時期は？次の旅行者へのアドバイスは？",
    detailReviewAddPhotos: "＋ 最大2枚の写真を追加",
    detailReviewPhotoLimit: "各写真800KB以下",
    detailReviewSubmit: "レビューを投稿",
    fromYou: "現在地から",
  },
};

function formatMoney(amount: number, currency: CurrencyCode = "VND") {
  const conf = CURRENCIES[currency] || CURRENCIES.VND;
  const converted = amount * conf.rate;
  if (currency === "VND") {
    return `${Math.round(converted).toLocaleString("vi-VN")}₫`;
  }
  if (currency === "USD") {
    return `$${converted.toFixed(2)}`;
  }
  if (currency === "CNY") {
    return `¥${converted.toFixed(1)}`;
  }
  if (currency === "KRW") {
    return `₩${Math.round(converted).toLocaleString("ko-KR")}`;
  }
  if (currency === "JPY") {
    return `¥${Math.round(converted).toLocaleString("ja-JP")}`;
  }
  return `${amount.toLocaleString("vi-VN")}₫`;
}

function estimatedStayPrice(stay: NearbyItem) {
  const key = normalizeSearch(`${stay.name} ${stay.type}`);
  if (key.includes("wyndham") || key.includes("serena") || key.includes("flamingo")) return 1_600_000;
  if (key.includes("resort") || key.includes("khoang nong")) return 1_100_000;
  if (key.includes("hotel") || key.includes("khach san")) return 800_000;
  return 450_000;
}

function mapPosition(lat: number, lng: number, key = "") {
  const left = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const top = (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  const hash = [...key].reduce((total, character) => total + character.charCodeAt(0), 0);
  const slot = hash % 24;
  const angle = (slot % 8) * (Math.PI / 4);
  const radius = key ? 44 + Math.floor(slot / 8) * 36 : 0;
  return {
    left: `${Math.min(96, Math.max(4, left))}%`,
    top: `${Math.min(94, Math.max(6, top))}%`,
    marginLeft: `${Math.cos(angle) * radius}px`,
    marginTop: `${Math.sin(angle) * radius}px`,
  };
}

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function estimateTravel(distance: number) {
  if (distance < 1) return "3 – 5 phút";
  const minutes = Math.max(5, Math.round(((distance / (distance > 35 ? 48 : 35)) * 60) / 5) * 5);
  if (minutes < 60) return `Khoảng ${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `Khoảng ${hours} giờ${remainder ? ` ${remainder} phút` : ""}`;
}

function isInSeason(place: Place, month = new Date().getMonth() + 1) {
  return place.seasonMonths.includes(month);
}


const EVENT_I18N: Record<
  string,
  Record<
    LanguageCode,
    {
      name: string;
      location: string;
      schedule: string;
      description: string;
    }
  >
> = {
  "gio-to-hung-vuong": {
    vi: {
      name: "Giỗ Tổ Hùng Vương – Lễ hội Đền Hùng",
      location: "Khu di tích lịch sử Đền Hùng, Việt Trì",
      schedule: "Ngày chính hội 10/3 âm lịch; hoạt động thường diễn ra nhiều ngày",
      description: "Lễ dâng hương, hoạt động văn hóa dân gian và hành trình về cội nguồn.",
    },
    en: {
      name: "Hung Kings Temple Festival",
      location: "Hung Kings Historical Site, Viet Tri",
      schedule: "Main ritual on 10th day of 3rd lunar month; activities span multiple days",
      description: "Incense offering ceremony, folk culture activities, and heritage pilgrimage.",
    },
    zh: {
      name: "雄王庙祭祖盛典",
      location: "越池市雄王庙历史古迹区",
      schedule: "农历三月初十为主祭日；民俗活动持续数天",
      description: "庄严肃穆的祭祖上香大典、民间传统游艺与寻根之旅。",
    },
    ko: {
      name: "훙왕 기일 축제",
      location: "비엣찌 훙왕 역사 유적지",
      schedule: "음력 3월 10일 본제; 다채로운 행사가 여러 날 동안 개최",
      description: "엄숙한 분향 의식, 전통 민속 축제 및 민족 기원 순례.",
    },
    ja: {
      name: "フン王記念祭（フン寺院祭り）",
      location: "ヴィエッチー フン王歴史遺跡地区",
      schedule: "旧暦3月10日（本祭）；各種催しが数日間にわたり開催",
      description: "厳粛な献香式、伝統芸能、民族の起源をたどる巡礼の旅。",
    },
  },
  "den-mau-au-co": {
    vi: {
      name: "Lễ hội Đền Mẫu Âu Cơ",
      location: "Hiền Lương, Hạ Hòa",
      schedule: "Ngày chính lễ 7 tháng Giêng âm lịch",
      description: "Tưởng nhớ Quốc Mẫu Âu Cơ với nghi lễ truyền thống và sinh hoạt cộng đồng.",
    },
    en: {
      name: "Mother Au Co Temple Festival",
      location: "Hien Luong, Ha Hoa",
      schedule: "Main ceremony on 7th day of 1st lunar month",
      description: "Honoring Mother Au Co with ancient solemn rituals and folk gatherings.",
    },
    zh: {
      name: "妪姬国母庙会",
      location: "夏和县贤良社",
      schedule: "农历正月初七为主祭日",
      description: "缅怀民族之母妪姬国母，举行庄严传统祭礼与社区民俗文化交流。",
    },
    ko: {
      name: "어우꺼 국모 사당 축제",
      location: "하호아 히엔르엉",
      schedule: "음력 정월 7일 본제",
      description: "전통 제례와 마을 공동체 행사를 통해 국모 어우꺼를 기림.",
    },
    ja: {
      name: "アウコー国母寺院祭り",
      location: "ハホア・ヒエンルオン",
      schedule: "旧暦1月7日（本祭）",
      description: "アウコー国母を追悼する伝統祭祀と温かな地域コミュニティの交流。",
    },
  },
  "tro-tram": {
    vi: {
      name: "Lễ hội Trò Trám",
      location: "Tứ Xã, Lâm Thao, Phú Thọ",
      schedule: "Đêm 11, rạng sáng 12 tháng Giêng âm lịch",
      description: "Lễ hội dân gian đặc sắc gắn với tín ngưỡng phồn thực của cư dân vùng trung du.",
    },
    en: {
      name: "Tro Tram Fertility Festival",
      location: "Tu Xa, Lam Thao, Phu Tho",
      schedule: "Night of 11th & dawn of 12th of 1st lunar month",
      description: "Unique traditional festival celebrating fertility rites of northern midlanders.",
    },
    zh: {
      name: "焯沾民俗节（繁衍祈福节）",
      location: "富寿省临洮县四社",
      schedule: "农历正月十一深夜至十二日清晨",
      description: "独具特色且历史悠久的民间传统节庆，展现中游丘陵地区的繁衍崇拜信仰。",
    },
    ko: {
      name: "쪼짬 축제 (풍요와 다산의 민속제)",
      location: "푸토 럼타오 뜨싸",
      schedule: "음력 정월 11일 밤~12일 새벽",
      description: "중부 구릉지 농경 주민들의 다산과 풍요 기원 전통 민속 축제.",
    },
    ja: {
      name: "チョー・チャム祭り（豊穣・子孙繁栄祈願祭）",
      location: "フートー ラムタオ・トゥーサー",
      schedule: "旧暦1月11日深夜〜12日未明",
      description: "中流域の肥沃・繁栄信仰に根ざしたユニークで熱気あふれる伝統奇祭。",
    },
  },
  "hat-xoan-hung-lo": {
    vi: {
      name: "Nghe Hát Xoan tại làng cổ Hùng Lô",
      location: "Đình cổ Hùng Lô, Việt Trì",
      schedule: "Theo lịch biểu diễn và lịch đặt đoàn; cần liên hệ trước",
      description: "Trải nghiệm di sản Hát Xoan trong không gian đình cổ; không nên đến tự phát mà chưa xác nhận lịch.",
    },
    en: {
      name: "Xoan Singing at Hung Lo Ancient Village",
      location: "Hung Lo Ancient Communal House, Viet Tri",
      schedule: "Per performance schedule & group booking; advance contact required",
      description: "Experience UNESCO-listed Xoan folk singing in ancient communal house; booking recommended.",
    },
    zh: {
      name: "雄炉古村春歌（Hat Xoan）非遗赏析",
      location: "越池市雄炉古村亭",
      schedule: "依演出安排及团体预约；需提前联络确认",
      description: "在300年历史古村亭中体验联合国非遗春歌；建议提前预约行程。",
    },
    ko: {
      name: "훙로 고촌 쏘안(Xoan) 민요 공연 관람",
      location: "비엣찌 훙로 고촌 사당",
      schedule: "공연 일정 및 단체 예약제; 사전 연락 필수",
      description: "300년 역사의 사당에서 유네스코 인류무형문화유산 쏘안 민요를 감상; 사전 예약 권장.",
    },
    ja: {
      name: "フンロー古村でのソアン民謡鑑賞",
      location: "ヴィエッチー フンロー古村の亭",
      schedule: "公演スケジュールおよび団体予約制；事前連絡推奨",
      description: "築300年の歴史を誇る古建築の亭でユネスコ無形文化遺産ソアン民謡を鑑賞；事前確認推奨。",
    },
  },
};

function getCategoryLabel(cat: string, t: typeof UI_TEXT.vi): string {
  if (cat.includes("Di sản")) return t.catHeritage;
  if (cat.includes("Núi rừng")) return t.catNature;
  if (cat.includes("Nghỉ dưỡng")) return t.catResort;
  if (cat.includes("Văn hóa")) return t.catCraft;
  if (cat.includes("Check-in")) return t.catSightseeing;
  return t.catAll;
}

function getRegionLabel(region: string, t: typeof UI_TEXT.vi): string {
  if (region.includes("Phú Thọ")) return t.provPhuTho;
  if (region.includes("Vĩnh Phúc")) return t.provVinhPhuc;
  if (region.includes("Hòa Bình")) return t.provHoaBinh;
  if (region.includes("3") || region.includes("Tất cả") || region.includes("Liên")) return t.provAll;
  return region;
}

function getSeasonLabel(season: string, t: typeof UI_TEXT.vi): string {
  if (season.includes("xuân") || season.includes("Spring")) return t.seasonSpring;
  if (season.includes("hè") || season.includes("Summer")) return t.seasonSummer;
  if (season.includes("thu") || season.includes("Autumn")) return t.seasonAutumn;
  if (season.includes("đông") || season.includes("Winter")) return t.seasonWinter;
  if (season.includes("năm") || season.includes("Year") || season.includes("quanh")) return t.seasonYearRound;
  return season;
}

function getStyleLabel(style: string, t: typeof UI_TEXT.vi): string {
  if (style.includes("Văn hóa") || style.includes("cội nguồn") || style.includes("Culture")) return t.tripStyleCulture;
  if (style.includes("Nghỉ dưỡng") || style.includes("Onsen") || style.includes("Spa")) return t.tripStyleSpa;
  if (style.includes("săn mây") || style.includes("Phượt") || style.includes("Adventure")) return t.tripStyleAdventure;
  if (style.includes("Gia đình") || style.includes("Family")) return t.tripStyleFamily;
  if (style.includes("Ẩm thực") || style.includes("Food")) return t.tripStyleFood;
  return style;
}

function getTransportLabel(transport: string, t: typeof UI_TEXT.vi): string {
  if (transport.includes("Ô tô") || transport.includes("Car")) return t.tripCar;
  if (transport.includes("Xe máy") || transport.includes("Motor")) return t.tripMotorbike;
  if (transport.includes("Limousine") || transport.includes("khách")) return t.tripLimousine;
  if (transport.includes("Taxi") || transport.includes("hợp đồng")) return t.tripTaxi;
  return transport;
}

function getPeriodLabel(period: string, t: typeof UI_TEXT.vi): string {
  const p = period.toLowerCase();
  if (p.includes("sáng") || p.includes("morning")) return t.periodMorning;
  if (p.includes("trưa") || p.includes("noon")) return t.periodNoon;
  if (p.includes("chiều") || p.includes("afternoon")) return t.periodAfternoon;
  if (p.includes("tối") || p.includes("evening") || p.includes("night")) return t.periodEvening;
  return period;
}

function formatDaysNights(days: number, lang: LanguageCode): string {
  if (days <= 1) {
    if (lang === "en") return "1 day";
    if (lang === "zh") return "1日游";
    if (lang === "ko") return "당일치기";
    if (lang === "ja") return "日帰り";
    return "1 ngày";
  }
  const nights = days - 1;
  if (lang === "en") return `${days}D${nights}N`;
  if (lang === "zh") return `${days}天${nights}晚`;
  if (lang === "ko") return `${nights}박${days}일`;
  if (lang === "ja") return `${nights}泊${days}日`;
  return `${days}N${nights}Đ`;
}

function getTourBadgeLabel(badge: string, lang: LanguageCode): string {
  if (badge.includes("Phổ biến")) {
    if (lang === "en") return "Most Popular";
    if (lang === "zh") return "最受欢迎";
    if (lang === "ko") return "인기 1위";
    if (lang === "ja") return "一番人気";
  }
  if (badge.includes("Sống ảo") || badge.includes("Nghỉ dưỡng")) {
    if (lang === "en") return "Resort & Scenic";
    if (lang === "zh") return "度假与摄影";
    if (lang === "ko") return "휴양 및 인생샷";
    if (lang === "ja") return "リゾート・絶景";
  }
  if (badge.includes("Trị liệu") || badge.includes("Văn hóa")) {
    if (lang === "en") return "Culture & Therapy";
    if (lang === "zh") return "文化与疗愈";
    if (lang === "ko") return "문화 및 온천 힐링";
    if (lang === "ja") return "文化・温泉セラピー";
  }
  if (badge.includes("Thiên nhiên")) {
    if (lang === "en") return "Majestic Nature";
    if (lang === "zh") return "壮美自然";
    if (lang === "ko") return "경이로운 대자연";
    if (lang === "ja") return "雄大な大自然";
  }
  if (badge.includes("Sơn thủy")) {
    if (lang === "en") return "Scenic Landscapes";
    if (lang === "zh") return "山水如画";
    if (lang === "ko") return "그림 같은 산수";
    if (lang === "ja") return "美しい山水";
  }
  if (badge.includes("Siêu tour") || badge.includes("3 tỉnh")) {
    if (lang === "en") return "Grand 3-Province Tour";
    if (lang === "zh") return "三省旗舰大环线";
    if (lang === "ko") return "3개 성 그랜드 투어";
    if (lang === "ja") return "3省周遊グランドツアー";
  }
  return badge;
}

function getLocalizedItineraryTitle(itinerary: GeneratedItinerary, lang: LanguageCode, t: typeof UI_TEXT.vi): string {
  if (lang === "vi") return itinerary.title;
  const dN = formatDaysNights(itinerary.durationDays, lang);
  const dest = itinerary.targetDestination;
  if (itinerary.title.includes("Ghép tuyến") || itinerary.region.includes("Liên")) {
    if (lang === "en") return `${dN} Route: ${dest}`;
    if (lang === "zh") return `${dN}连线游：${dest}`;
    if (lang === "ko") return `${dN} 연계 루트: ${dest}`;
    if (lang === "ja") return `${dN}周遊ルート：${dest}`;
  }
  if (lang === "en") return `${dN} Itinerary: Discover ${dest}`;
  if (lang === "zh") return `${dN}行程：探索 ${dest}`;
  if (lang === "ko") return `${dN} 여정: ${dest} 탐방`;
  if (lang === "ja") return `${dN}の旅程：${dest}を巡る`;
  return itinerary.title;
}

function getLocalizedItinerarySubtitle(itinerary: GeneratedItinerary, lang: LanguageCode, t: typeof UI_TEXT.vi): string {
  if (lang === "vi") return itinerary.subtitle;
  const reg = getRegionLabel(itinerary.region, t);
  const trans = getTransportLabel(itinerary.transport, t);
  const sty = getStyleLabel(itinerary.style, t);
  if (lang === "en") return `${reg} · Transport: ${trans} · ${sty}`;
  if (lang === "zh") return `${reg} · 交通：${trans} · ${sty}`;
  if (lang === "ko") return `${reg} · 이동: ${trans} · ${sty}`;
  if (lang === "ja") return `${reg} · 移動手段：${trans} · ${sty}`;
  return itinerary.subtitle;
}

function getLocalizedDriveTime(driveTimeStr: string, lang: LanguageCode): string {
  if (lang === "vi") return driveTimeStr;
  let hours = 0;
  let mins = 0;
  const hMatch = driveTimeStr.match(/(\d+)\s*(?:giờ|h|小时|시간|時間)/i);
  if (hMatch) hours = parseInt(hMatch[1], 10);
  const mMatch = driveTimeStr.match(/(\d+)\s*(?:phút|m|min|分钟|분|分)/i);
  if (mMatch) mins = parseInt(mMatch[1], 10);
  if (hours === 0 && mins === 0) return driveTimeStr;
  if (lang === "en") return `${hours > 0 ? `${hours}h ` : ""}${mins}m drive`;
  if (lang === "zh") return `${hours > 0 ? `${hours}小时` : ""}${mins}分钟车程`;
  if (lang === "ko") return `${hours > 0 ? `${hours}시간 ` : ""}${mins}분 운전`;
  if (lang === "ja") return `${hours > 0 ? `${hours}時間` : ""}${mins}分ドライブ`;
  return driveTimeStr;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [savedSubTab, setSavedSubTab] = useState<SavedSubTab>("places");
  const [selectedRegion, setSelectedRegion] = useState<Region>("Tất cả");
  const [category, setCategory] = useState<Category>("Tất cả");
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>("Tất cả");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [serverResultIds, setServerResultIds] = useState<string[] | null>(null);
  const [isServerSearching, setIsServerSearching] = useState(false);
  
  // Storage states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedDishes, setSavedDishes] = useState<string[]>([]);
  const [savedItineraryList, setSavedItineraryList] = useState<GeneratedItinerary[]>([]);
  
  const [selected, setSelected] = useState<Place | null>(null);
  const [detailMode, setDetailMode] = useState<"eat" | "stay">("eat");
  const [targetPlaceId, setTargetPlaceId] = useState<string>(places[0]?.id || "den-hung");
  
  // Trip planner states
  const [tripRegion, setTripRegion] = useState<string>("Tất cả");
  const [tripDistrict, setTripDistrict] = useState<string>("Tất cả");
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([places[0]?.id || "den-hung"]);
  const [days, setDays] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [transport, setTransport] = useState("Ô tô riêng");
  const [budget, setBudget] = useState("Tiêu chuẩn (~1.000.000đ/ngày)");
  const [interest, setInterest] = useState("Văn hóa & cội nguồn");
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary>(() =>
    buildItinerary({
      anchorPlaceId: places[0]?.id || "den-hung",
      selectedPlaceIds: [places[0]?.id || "den-hung"],
      durationDays: 2,
      transport: "Ô tô riêng",
      budget: "Tiêu chuẩn",
      style: "Văn hóa & cội nguồn",
      travelers: 2,
    })
  );

  // Audio guide controls & voice customization (AI TTS + Browser Speech)
  const [audioLang, setAudioLang] = useState<"vi" | "en">("vi");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("ai-female-north");
  const [audioGuidePlaying, setAudioGuidePlaying] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [speechPlaceId, setSpeechPlaceId] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.75);
  const [audioRate, setAudioRate] = useState(0.9);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const voiceOptions = useMemo(() => {
    if (audioLang === "vi") {
      const aiVoices = [
        { id: "ai-female-north", label: "🌸 Giọng AI Nữ Hà Nội (Chuẩn Studio - Êm ái)" },
      ];
      const browserVoices = availableVoices
        .filter((v) => v.lang.toLowerCase().startsWith("vi"))
        .map((v) => ({ id: v.voiceURI, label: `🖥️ ${v.name} (Hệ thống)` }));
      return [...aiVoices, ...browserVoices];
    } else {
      const aiVoices = [
        { id: "ai-en-us", label: "🇺🇸 US Natural Female (American Standard)" },
        { id: "ai-en-uk", label: "🇬🇧 UK British Female (Oxford Standard)" },
      ];
      const browserVoices = availableVoices
        .filter((v) => v.lang.toLowerCase().startsWith("en"))
        .map((v) => ({ id: v.voiceURI, label: `🖥️ ${v.name} (Hệ thống)` }));
      return [...aiVoices, ...browserVoices];
    }
  }, [availableVoices, audioLang]);

  // Directory 100
  const [show100Directory, setShow100Directory] = useState(false);
  const [directoryDistrict, setDirectoryDistrict] = useState("Tất cả");
  const [directorySearch, setDirectorySearch] = useState("");

  // Near & Services
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "unsupported" | "locating" | "success" | "denied">("idle");
  const [serviceFilter, setServiceFilter] = useState("Tất cả");
  const [serviceProvinceFilter, setServiceProvinceFilter] = useState("Tất cả");
  const [selectedNearItemId, setSelectedNearItemId] = useState("place-den-hung");

  // General & Commerce
  const [weather, setWeather] = useState<{ temp: number; label: string }>({ temp: 29, label: "Nắng nhẹ" });
  const [toast, setToast] = useState("");
  const [foodRegionId, setFoodRegionId] = useState(foodRegions[0].id);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewName, setReviewName] = useState("Du khách");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  
  // User Authentication & Role-Based Access Control
  const [authUser, setAuthUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    provider: "google" | "facebook" | "admin" | "local";
    role: "customer" | "merchant" | "admin";
    merchantName?: string;
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register" | "admin">("login");
  const [customerOrdersOpen, setCustomerOrdersOpen] = useState(false);

  // Normal Login & Register states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Admin login credentials (admin / 123456)
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Google OAuth account selection & Password step
  const [googleOAuthModalOpen, setGoogleOAuthModalOpen] = useState(false);
  const [googleSelectedAccount, setGoogleSelectedAccount] = useState<{
    email: string;
    name: string;
    isMerchant?: boolean;
    merchantName?: string;
  } | null>(null);
  const [googleAccountPassword, setGoogleAccountPassword] = useState("");
  const [googlePasswordError, setGooglePasswordError] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState("");
  const [googleInputName, setGoogleInputName] = useState("");
  const [googleInputPassword, setGoogleInputPassword] = useState("");
  const [showGoogleInputPassword, setShowGoogleInputPassword] = useState(false);
  const [googleInputError, setGoogleInputError] = useState("");

  // Registered Customer Database
  const DEFAULT_CUSTOMERS = [
    {
      id: "usr-demo-1",
      name: "Thanh Hoàng",
      email: "hoangthanh.phutho@gmail.com",
      password: "123",
      phone: "0912 345 678",
      createdAt: "01/01/2026",
    },
  ];
  const [registeredUsers, setRegisteredUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    createdAt: string;
  }>>(DEFAULT_CUSTOMERS);

  // Merchant Whitelist managed by Admin (With Passwords)
  const DEFAULT_MERCHANTS = [
    {
      email: "thitchuanghithinh@gmail.com",
      merchantName: "Thịt chua Nghị Thịnh",
      password: "123",
      phone: "0987 654 321",
      address: "Thị trấn Thanh Sơn, Phú Thọ",
      createdAt: "01/01/2026",
    },
    {
      email: "calangviettri@gmail.com",
      merchantName: "Nhà hàng Cá Lăng Việt Trì",
      password: "123",
      phone: "0912 888 999",
      address: "Đường Bạch Hạc, TP. Việt Trì",
      createdAt: "01/01/2026",
    },
    {
      email: "chelongcoc@gmail.com",
      merchantName: "HTX Chè Búp Long Cốc",
      password: "123",
      phone: "0936 123 456",
      address: "Đồi chè Long Cốc, Tân Sơn, Phú Thọ",
      createdAt: "01/01/2026",
    },
    {
      email: "banhtaiphuong@gmail.com",
      merchantName: "Cơ sở Bánh Tai Phú Thọ",
      password: "123",
      phone: "0945 678 901",
      address: "TP. Việt Trì, Phú Thọ",
      createdAt: "01/01/2026",
    },
  ];
  const [merchantWhitelist, setMerchantWhitelist] = useState<Array<{
    email: string;
    merchantName: string;
    password: string;
    phone: string;
    address?: string;
    createdAt: string;
  }>>(DEFAULT_MERCHANTS);
  const [newMerchantEmail, setNewMerchantEmail] = useState("");
  const [newMerchantName, setNewMerchantName] = useState("");
  const [newMerchantPhone, setNewMerchantPhone] = useState("");
  const [newMerchantPassword, setNewMerchantPassword] = useState("123456");

  // Cart & Checkout & Google Sheets Orders
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartDrawerTab, setCartDrawerTab] = useState<"cart" | "orders">("cart");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [ordersDashboardOpen, setOrdersDashboardOpen] = useState(false);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [orderStatusTab, setOrderStatusTab] = useState<string>("all");
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState("");
  const [sheetScriptCopied, setSheetScriptCopied] = useState(false);

  // Multi-Currency & Multi-Language States
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>("VND");
  const [currentLang, setCurrentLang] = useState<LanguageCode>("vi");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Helper to filter orders by Shopee-style statuses
  const filterOrderByStatus = (order: any, tabId: string) => {
    if (tabId === "all") return true;
    if (tabId === "pending") return !order.status || order.status === "Chờ xác nhận" || order.status === "pending";
    if (tabId === "processing") return order.status === "Đang xử lý" || order.status === "Đã xác nhận" || order.status === "Đang chuẩn bị" || order.status === "Chờ lấy hàng" || order.status === "processing";
    if (tabId === "shipping") return order.status === "Đang giao hàng" || order.status === "Đang giao" || order.status === "shipping";
    if (tabId === "completed") return order.status === "Hoàn thành" || order.status === "Đã giao" || order.status === "completed";
    if (tabId === "cancelled") return order.status === "Đã hủy" || order.status === "cancelled";
    return true;
  };

  // Compute User's Filtered Order List (Strictly scoped to current account/session)
  const userOrderList = useMemo(() => {
    if (!orderList || orderList.length === 0) return [];
    if (authUser?.role === "admin") return orderList;
    if (authUser?.role === "merchant") {
      return orderList.filter((o) =>
        (o.items || []).some((it: any) => it.sellerName === authUser.merchantName)
      );
    }
    if (authUser) {
      return orderList.filter((o) => {
        if (o.userId && o.userId === authUser.id) return true;
        if (o.customerEmail && authUser.email && o.customerEmail.toLowerCase() === authUser.email.toLowerCase()) return true;
        if (o.userEmail && authUser.email && o.userEmail.toLowerCase() === authUser.email.toLowerCase()) return true;
        if (authUser.phone && o.phone && o.phone.replace(/\D/g, "") === authUser.phone.replace(/\D/g, "")) return true;
        return false;
      });
    }
    // Guest with no login: show orders without userId/email created on this device
    return orderList.filter((o) => !o.userId && !o.customerEmail && !o.userEmail);
  }, [orderList, authUser]);

  // Vouchers & Promotions States
  const [vouchersModalOpen, setVouchersModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState<string[]>(["DATTO10", "OCOP50K"]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>("DATTO10");

  // Payment Methods States
  const [paymentMethod, setPaymentMethod] = useState<string>("vietqr");
  const [vietQrModalOpen, setVietQrModalOpen] = useState(false);

  // Booking
  const [bookingOffer, setBookingOffer] = useState<BookingOffer | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingCheckIn, setBookingCheckIn] = useState("");
  const [bookingCheckOut, setBookingCheckOut] = useState("");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const favoritesTimer = window.setTimeout(() => {
      try {
        const storedUser = window.localStorage.getItem("datto-auth-user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          setAuthUser(u);
          setCheckoutName(u.name);
          if (u.phone) setCheckoutPhone(u.phone);
        }

        const storedMerchants = window.localStorage.getItem("datto-merchant-whitelist");
        if (storedMerchants) {
          setMerchantWhitelist(JSON.parse(storedMerchants));
        }

        const storedUsers = window.localStorage.getItem("datto-registered-users");
        if (storedUsers) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }

        const stored = window.localStorage.getItem("datto-favorites");
        if (stored) setFavorites(JSON.parse(stored));
        
        const storedDishes = window.localStorage.getItem("datto-saved-dishes");
        if (storedDishes) setSavedDishes(JSON.parse(storedDishes));

        const storedItineraries = window.localStorage.getItem("datto-saved-itineraries");
        if (storedItineraries) setSavedItineraryList(JSON.parse(storedItineraries));

        const storedReviews = window.localStorage.getItem("datto-reviews");
        if (storedReviews) setUserReviews(JSON.parse(storedReviews));

        const storedCart = window.localStorage.getItem("datto-cart");
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedOrders = window.localStorage.getItem("datto-demo-orders");
        if (storedOrders) setOrderList(JSON.parse(storedOrders));

        const storedWebhook = window.localStorage.getItem("datto-sheet-webhook");
        if (storedWebhook) setSheetWebhookUrl(storedWebhook);
      } catch {
        window.localStorage.removeItem("datto-favorites");
        window.localStorage.removeItem("datto-saved-dishes");
        window.localStorage.removeItem("datto-saved-itineraries");
        window.localStorage.removeItem("datto-reviews");
        window.localStorage.removeItem("datto-cart");
      }
    }, 0);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.31&longitude=105.40&current=temperature_2m,weather_code&timezone=Asia%2FBangkok",
    )
      .then((response) => response.json())
      .then((data) => {
        const code = data?.current?.weather_code ?? 0;
        const label = code <= 1 ? "Trời quang" : code <= 3 ? "Có mây" : code <= 67 ? "Có mưa" : "Thời tiết xấu";
        setWeather({ temp: Math.round(data.current.temperature_2m), label });
      })
      .catch(() => undefined);

    return () => window.clearTimeout(favoritesTimer);
  }, []);

  // Tự động cuộn lên đầu trang khi chuyển tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [activeTab]);

  useEffect(() => {
    if (isStaticDemo) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsServerSearching(true);
      try {
        const params = new URLSearchParams({ q: query, category, limit: "50" });
        const response = await fetch(`/api/places?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Search server unavailable");
        const payload = (await response.json()) as { data?: Array<{ id: string }> };
        setServerResultIds((payload.data ?? []).map((item) => item.id));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setServerResultIds(null);
        }
      } finally {
        if (!controller.signal.aborted) setIsServerSearching(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [category, query]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      speechRef.current = null;
      setAudioState("idle");
      setSpeechPlaceId(null);
    };
  }, [selected]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    window.localStorage.setItem("datto-favorites", JSON.stringify(next));
    showToast(next.includes(id) ? "Đã lưu vào Sổ tay du lịch" : "Đã bỏ khỏi danh sách đã lưu");
  };

  const toggleSaveDish = (dishId: string) => {
    const next = savedDishes.includes(dishId) ? savedDishes.filter((id) => id !== dishId) : [...savedDishes, dishId];
    setSavedDishes(next);
    window.localStorage.setItem("datto-saved-dishes", JSON.stringify(next));
    showToast(next.includes(dishId) ? "Đã lưu món ăn vào Sổ tay" : "Đã bỏ món khỏi Sổ tay");
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setLocationStatus("success");
        showToast("Đã sắp xếp gợi ý theo vị trí của bạn");
      },
      () => {
        setLocationStatus("denied");
        showToast("Bạn có thể bật quyền Vị trí trong cài đặt trình duyệt");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const currentMonth = new Date().getMonth() + 1;

  const availableDistricts = useMemo(() => {
    if (tripRegion === "Phú Thọ") {
      return ["Tất cả", "TP. Việt Trì", "Huyện Tân Sơn", "Huyện Thanh Thủy", "Huyện Hạ Hòa"];
    }
    if (tripRegion === "Vĩnh Phúc") {
      return ["Tất cả", "Huyện Tam Đảo", "TP. Phúc Yên", "TP. Vĩnh Yên", "Huyện Bình Xuyên"];
    }
    if (tripRegion === "Hòa Bình") {
      return ["Tất cả", "Huyện Mai Châu", "Huyện Kim Bôi", "Huyện Cao Phong", "TP. Hòa Bình"];
    }
    return [
      "Tất cả",
      "TP. Việt Trì", "Huyện Tân Sơn", "Huyện Thanh Thủy", "Huyện Hạ Hòa",
      "Huyện Tam Đảo", "TP. Phúc Yên", "TP. Vĩnh Yên", "Huyện Bình Xuyên",
      "Huyện Mai Châu", "Huyện Kim Bôi", "Huyện Cao Phong", "TP. Hòa Bình"
    ];
  }, [tripRegion]);

  const activeDistrictGuide = tripDistrict !== "Tất cả" && DISTRICT_TRAVEL_GUIDES[tripDistrict]
    ? DISTRICT_TRAVEL_GUIDES[tripDistrict]
    : null;

  const availablePlacesForSelection = useMemo(() => {
    return places.filter((p) => {
      if (tripRegion !== "Tất cả" && p.region !== tripRegion) return false;
      if (tripDistrict !== "Tất cả" && p.district !== tripDistrict) return false;
      return true;
    });
  }, [tripRegion, tripDistrict]);

  const togglePlaceSelection = (placeId: string) => {
    setSelectedPlaceIds((current) => {
      if (current.includes(placeId)) {
        if (current.length === 1) {
          showToast("Cần giữ ít nhất 1 điểm đến trong lịch trình!");
          return current;
        }
        return current.filter((id) => id !== placeId);
      } else {
        return [...current, placeId];
      }
    });
  };

  const selectAllFilteredPlaces = () => {
    const ids = availablePlacesForSelection.map((p) => p.id);
    setSelectedPlaceIds((current) => {
      const merged = Array.from(new Set([...current, ...ids]));
      return merged;
    });
    showToast(`Đã thêm ${availablePlacesForSelection.length} điểm vào hành trình!`);
  };

  const applyQuickCombination = (name: string, placeIds: string[], daysCount: number) => {
    setSelectedPlaceIds(placeIds);
    setDays(daysCount);
    const res = buildItinerary({
      anchorPlaceId: placeIds[0],
      selectedPlaceIds: placeIds,
      durationDays: daysCount,
      transport,
      budget,
      style: interest,
      travelers,
      lang: currentLang,
    });
    setGeneratedItinerary(res);
    showToast(`✦ Đã áp dụng ${name}!`);
  };

  const matchingFoodDishes = useMemo(() => {
    const terms = normalizeSearch(query.trim()).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return foodCatalog
      .filter(({ dish, region }) => {
        const haystack = normalizeSearch([
          dish.name,
          dish.description,
          region.label,
          ...dish.sellers.flatMap((seller) => [seller.name, seller.address]),
        ].join(" "));
        return terms.every((term) => haystack.includes(term));
      })
      .map(({ dish }) => dish);
  }, [query]);

  const filteredPlaces = useMemo(() => {
    const terms = normalizeSearch(query.trim()).split(/\s+/).filter(Boolean);
    const serverMatches = serverResultIds ? new Set(serverResultIds) : null;
    const matchingPlaces = serverMatches
      ? places.filter((place) => serverMatches.has(place.id))
      : places
          .filter((place) => category === "Tất cả" || place.category === category)
          .filter((place) => {
            if (!terms.length) return true;
            const haystack = normalizeSearch([
              place.name,
              place.shortName,
              place.location,
              place.district,
              place.category,
              place.season,
              ...place.tags,
              ...place.highlights,
              ...place.restaurants.flatMap((item) => [item.name, item.type, item.address, item.taste ?? ""]),
              ...place.stays.flatMap((item) => [item.name, item.type, item.address]),
            ].join(" "));
            return terms.every((term) => haystack.includes(term));
          });

    const matchesRegion = (place: Place) => {
      if (selectedRegion === "Tất cả") return true;
      return place.region === selectedRegion;
    };

    const matchesSeason = (place: Place) => {
      if (seasonFilter === "Tất cả") return true;
      if (seasonFilter === "Đang hợp mùa") return isInSeason(place, currentMonth);
      return seasonMonths[seasonFilter].some((month) => place.seasonMonths.includes(month));
    };

    return matchingPlaces
      .filter(matchesRegion)
      .filter(matchesSeason)
      .slice()
      .sort((a, b) => {
        if (!position) return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return (
          haversine(position.lat, position.lng, a.lat, a.lng) -
          haversine(position.lat, position.lng, b.lat, b.lng)
        );
      });
  }, [category, currentMonth, position, query, seasonFilter, selectedRegion, serverResultIds]);

  const searchSuggestions = useMemo(() => {
    const needle = normalizeSearch(query.trim());
    const placeSuggestions: SearchSuggestion[] = places
      .filter((place) => {
        if (!needle) return Boolean(place.featured);
        return normalizeSearch([place.name, place.shortName, place.district, place.category, ...place.tags].join(" ")).includes(needle);
      })
      .slice(0, 5)
      .map((place) => ({
        id: `place-${place.id}`,
        kind: "place" as const,
        label: place.shortName,
        meta: `${place.category} · ${place.district} (${place.region})`,
        icon: "⌖",
        place,
      }));

    const dishSuggestions: SearchSuggestion[] = foodCatalog
      .filter(({ dish }) => needle && normalizeSearch(`${dish.name} ${dish.description}`).includes(needle))
      .slice(0, 3)
      .map(({ dish, region }) => ({
        id: `dish-${region.id}-${dish.name}`,
        kind: "food" as const,
        label: dish.name,
        meta: `Ẩm thực ${region.label} · ${dish.season}`,
        icon: "♨",
        dish,
      }));

    return [...placeSuggestions, ...dishSuggestions].slice(0, 6);
  }, [query]);

  const cartDetails = useMemo(() => cart.flatMap((line) => {
    const catalogItem = foodCatalog.find(({ dish }) => dish.id === line.dishId);
    const seller = catalogItem?.dish.sellers.find((item) => item.id === line.sellerId);
    return catalogItem && seller ? [{ ...line, dish: catalogItem.dish, seller }] : [];
  }), [cart]);
  
  const cartQuantity = cart.reduce((total, line) => total + line.quantity, 0);
  const cartSubtotal = cartDetails.reduce((total, line) => total + line.seller.price * line.quantity, 0);

  const appliedVoucher = useMemo(() => {
    if (!appliedVoucherCode) return null;
    return DEFAULT_VOUCHERS.find((v) => v.code === appliedVoucherCode) || null;
  }, [appliedVoucherCode]);

  const voucherDiscount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (cartSubtotal < appliedVoucher.minSpend) return 0;
    if (appliedVoucher.discountAmount) {
      return Math.min(cartSubtotal, appliedVoucher.discountAmount);
    }
    if (appliedVoucher.discountPercent) {
      const calc = Math.round((cartSubtotal * appliedVoucher.discountPercent) / 100);
      return Math.min(calc, 100000);
    }
    return 0;
  }, [appliedVoucher, cartSubtotal]);

  const finalCartTotal = Math.max(0, cartSubtotal - voucherDiscount);
  const t = UI_TEXT[currentLang] || UI_TEXT.vi;
  const locationMessage = locationStatus === "unsupported" ? t.nearLocationUnsupported : locationStatus === "locating" ? t.nearLocationLocating : locationStatus === "success" ? t.nearLocationSuccess : locationStatus === "denied" ? t.nearLocationDenied : t.nearLocationNotEnabled;
  const formatPrice = (amount: number) => formatMoney(amount, currentCurrency);

  const bookingNights = useMemo(() => {
    if (!bookingCheckIn || !bookingCheckOut) return 1;
    const milliseconds = new Date(bookingCheckOut).getTime() - new Date(bookingCheckIn).getTime();
    return Math.max(1, Math.ceil(milliseconds / 86_400_000));
  }, [bookingCheckIn, bookingCheckOut]);

  // Comprehensive near utilities
  const nearItems = useMemo<NearItem[]>(() => {
    const destinationItems = places.map((place) => ({
      id: `place-${place.id}`, name: place.shortName, type: "Điểm đến", icon: "⌖", province: place.region, lat: place.lat, lng: place.lng,
      note: `${place.bestTime} · ${place.category}`, address: place.location, place,
    }));
    const serviceItems = comprehensiveServices.map((item) => ({ ...item }));
    const restaurantItems = places.flatMap((place, placeIndex) => place.restaurants.slice(0, 2).map((item, itemIndex) => ({
      id: `eat-${place.id}-${itemIndex}`, name: item.name, type: "Ăn uống", icon: "♨", province: place.region,
      lat: place.lat + (itemIndex + 1) * 0.0015, lng: place.lng + ((placeIndex % 2 ? -1 : 1) * (itemIndex + 1) * 0.0018),
      note: `${item.note} · ${item.hours}`, address: item.address, phone: item.phone, place,
    })));
    const stayItems = places.flatMap((place, placeIndex) => place.stays.slice(0, 2).map((item, itemIndex) => ({
      id: `stay-${place.id}-${itemIndex}`, name: item.name, type: "Lưu trú", icon: "⌂", province: place.region,
      lat: place.lat - (itemIndex + 1) * 0.0014, lng: place.lng + ((placeIndex % 2 ? 1 : -1) * (itemIndex + 1) * 0.0016),
      note: `${item.note} · ${item.hours}`, address: item.address, phone: item.phone, place,
    })));
    return [...destinationItems, ...restaurantItems, ...stayItems, ...serviceItems];
  }, []);

  const filteredNearItems = useMemo(() => nearItems
    .filter((item) => serviceFilter === "Tất cả" || item.type === serviceFilter)
    .filter((item) => serviceProvinceFilter === "Tất cả" || !item.province || item.province === serviceProvinceFilter)
    .slice()
    .sort((a, b) => position
      ? haversine(position.lat, position.lng, a.lat, a.lng) - haversine(position.lat, position.lng, b.lat, b.lng)
      : a.name.localeCompare(b.name, "vi")), [nearItems, position, serviceFilter, serviceProvinceFilter]);
  
  const selectedNearItem = filteredNearItems.find((item) => item.id === selectedNearItemId) ?? filteredNearItems[0] ?? null;

  const directoryDistricts = useMemo(() => {
    const set = new Set<string>();
    phuTho100Directory.forEach((p) => {
      if (p.district) set.add(p.district);
    });
    return ["Tất cả", ...Array.from(set)];
  }, []);

  const filtered100Places = useMemo(() => {
    return phuTho100Directory.filter((item) => {
      if (directoryDistrict !== "Tất cả" && item.district !== directoryDistrict) return false;
      if (!directorySearch.trim()) return true;
      const needle = normalizeSearch(directorySearch);
      return normalizeSearch(`${item.name} ${item.category} ${item.district} ${item.restaurants} ${item.stays} ${item.location}`).includes(needle);
    });
  }, [directoryDistrict, directorySearch]);

  const savePlan = () => {
    const next = [generatedItinerary, ...savedItineraryList.filter(it => it.id !== generatedItinerary.id)];
    setSavedItineraryList(next);
    window.localStorage.setItem("datto-saved-itineraries", JSON.stringify(next));
    showToast("Đã lưu lịch trình vào Sổ tay du lịch");
  };

  const sharePlan = async () => {
    const text = [
      generatedItinerary.title,
      generatedItinerary.subtitle,
      `Quãng đường: ${generatedItinerary.totalDistanceKm} km · ${generatedItinerary.totalDriveTime}`,
      `Chi phí dự kiến: ${formatMoney(generatedItinerary.estimatedCostPerPerson)}/người`,
      `Xem lộ trình: ${generatedItinerary.googleMapsUrl}`,
    ].join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: generatedItinerary.title, text, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      showToast("Đã sao chép lịch trình để gửi qua Zalo/Facebook");
    } catch {
      showToast("Đã hủy chia sẻ lịch trình");
    }
  };

  const stopAllAudio = () => {
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
    setAudioGuidePlaying(false);
    setAudioState("idle");
    setSpeechPlaceId(null);
  };

  const playSpeechText = (
    textVi: string,
    textEn: string | undefined,
    onStateChange?: (playing: boolean) => void
  ) => {
    stopAllAudio();

    const textToSpeak = audioLang === "en" ? (textEn || textVi) : textVi;
    const isAiVoice = selectedVoiceURI.startsWith("ai-");
    const isMaleAi = selectedVoiceURI === "ai-male-north";

    // If male AI voice is selected and browser SpeechSynthesis is available, use male-tuned synthesis
    if (isMaleAi && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const viVoices = availableVoices.filter((v) => v.lang.toLowerCase().startsWith("vi"));
      const maleVoice = viVoices.find((v) => v.name.toLowerCase().includes("nam") || v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("b")) || viVoices[0];
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.lang = "vi-VN";
      utterance.rate = audioRate * 0.92;
      utterance.pitch = 0.70; // Trầm ấm nam tính
      utterance.volume = audioVolume;
      utterance.onstart = () => onStateChange?.(true);
      utterance.onend = () => onStateChange?.(false);
      utterance.onerror = () => onStateChange?.(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    }

    if (isAiVoice) {
      const lang = audioLang === "en" ? "en" : "vi";
      const audioUrl = `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${lang}&voice=${isMaleAi ? "male" : "female"}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = isMaleAi ? audioRate * 0.9 : audioRate;
      audio.volume = audioVolume;

      audio.onplay = () => {
        onStateChange?.(true);
      };
      audio.onended = () => {
        onStateChange?.(false);
        stopAllAudio();
      };
      audio.onerror = () => {
        onStateChange?.(false);
        stopAllAudio();
        showToast("Không thể tải âm thanh AI, vui lòng thử lại");
      };

      htmlAudioRef.current = audio;
      audio.play().catch(() => {
        onStateChange?.(false);
      });
      return;
    }

    // Fallback or explicit system voice selection
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast("Thiết bị chưa hỗ trợ phát giọng đọc hệ thống");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const matchedVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = audioLang === "vi" ? "vi-VN" : "en-US";
    utterance.rate = audioRate;
    utterance.pitch = selectedVoiceURI.toLowerCase().includes("nam") || selectedVoiceURI.toLowerCase().includes("male") ? 0.72 : 1.0;
    utterance.volume = audioVolume;
    utterance.onstart = () => onStateChange?.(true);
    utterance.onend = () => onStateChange?.(false);
    utterance.onerror = () => onStateChange?.(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleItineraryAudio = () => {
    if (audioGuidePlaying) {
      stopAllAudio();
      return;
    }
    playSpeechText(
      generatedItinerary.audioGuideScript,
      generatedItinerary.audioGuideScriptEn,
      setAudioGuidePlaying
    );
  };

  const togglePlaceAudio = (place: Place) => {
    if (speechPlaceId === place.id && audioState === "playing") {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      setAudioState("paused");
      return;
    }

    if (speechPlaceId === place.id && audioState === "paused") {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.play();
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
      setAudioState("playing");
      return;
    }

    stopAllAudio();
    const textToSpeak = audioLang === "en" ? (place.audioScriptEn || place.audioScript) : place.audioScript;
    const isAiVoice = selectedVoiceURI.startsWith("ai-");

    if (isAiVoice) {
      const lang = audioLang === "en" ? "en" : "vi";
      const audioUrl = `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${lang}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = audioRate;
      audio.volume = audioVolume;

      audio.onplay = () => {
        setSpeechPlaceId(place.id);
        setAudioState("playing");
      };
      audio.onended = () => {
        stopAllAudio();
      };
      audio.onerror = () => {
        stopAllAudio();
      };

      htmlAudioRef.current = audio;
      setSpeechPlaceId(place.id);
      audio.play().catch(() => {
        stopAllAudio();
      });
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast("Thiết bị chưa hỗ trợ thuyết minh tự động");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const matchedVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.lang = audioLang === "vi" ? "vi-VN" : "en-US";
    utterance.rate = audioRate;
    utterance.pitch = 1.0;
    utterance.volume = audioVolume;
    utterance.onstart = () => {
      setSpeechPlaceId(place.id);
      setAudioState("playing");
    };
    utterance.onend = stopAllAudio;
    utterance.onerror = stopAllAudio;
    speechRef.current = utterance;
    setSpeechPlaceId(place.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateItinerary = () => {
    stopAllAudio();
    const res = buildItinerary({
      anchorPlaceId: selectedPlaceIds[0] || targetPlaceId,
      selectedPlaceIds,
      district: tripDistrict !== "Tất cả" ? tripDistrict : undefined,
      region: tripRegion !== "Tất cả" ? tripRegion : undefined,
      durationDays: days,
      transport,
      budget,
      style: interest,
      travelers,
    });
    setGeneratedItinerary(res);
    showToast(`✦ Hướng dẫn viên đã tạo lịch trình ${days} ngày với ${selectedPlaceIds.length} điểm đã chọn!`);
  };

  const handleApplyTourTemplate = (tmpl: TourTemplate) => {
    stopAllAudio();
    setTargetPlaceId(tmpl.anchorPlaceId);
    setDays(tmpl.durationDays);
    const tVehicle = tmpl.recommendedTransport.includes("Xe máy")
      ? "Xe máy"
      : tmpl.recommendedTransport.includes("Limousine")
      ? "Limousine / Xe khách"
      : "Ô tô riêng";
    setTransport(tVehicle);
    setInterest(tmpl.theme);
    const res = buildItinerary({
      anchorPlaceId: tmpl.anchorPlaceId,
      region: tmpl.region === "Liên thông 3 tỉnh" ? "Tất cả" : tmpl.region,
      durationDays: tmpl.durationDays,
      transport: tVehicle,
      budget,
      style: tmpl.theme,
      travelers,
    });
    setGeneratedItinerary(res);
    showToast(`Đã chọn: ${tmpl.title}`);
  };

  const selectSearchSuggestion = (place: Place, label: string) => {
    setCategory("Tất cả");
    setQuery(label);
    setSearchFocused(false);
    openPlace(place);
  };

  const selectFoodSuggestion = (dish: FoodDish) => {
    const catalogItem = foodCatalog.find((item) => item.dish.id === dish.id);
    if (catalogItem) setFoodRegionId(catalogItem.region.id);
    setCategory("Tất cả");
    setQuery(dish.name);
    setActiveFoodId(dish.id);
    setSearchFocused(false);
  };

  const addToCart = (dish: FoodDish, seller: FoodSeller) => {
    const existing = cart.find((line) => line.dishId === dish.id && line.sellerId === seller.id);
    const next = existing
      ? cart.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line)
      : [...cart, { dishId: dish.id, sellerId: seller.id, quantity: 1 }];
    setCart(next);
    window.localStorage.setItem("datto-cart", JSON.stringify(next));
    showToast(`Đã thêm "${dish.name}" vào giỏ hàng`);
  };

  const goToFoodSection = () => {
    setCartOpen(false);
    setActiveTab("explore");
    window.setTimeout(() => {
      const el = document.getElementById("food-browser-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const changeCartQuantity = (dishId: string, sellerId: string, change: number) => {
    const next = cart
      .map((line) => line.dishId === dishId && line.sellerId === sellerId ? { ...line, quantity: line.quantity + change } : line)
      .filter((line) => line.quantity > 0);
    setCart(next);
    window.localStorage.setItem("datto-cart", JSON.stringify(next));
  };

  // Handle Admin Credentials Login (admin / 123456)
  const handleAdminLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminUsername.trim().toLowerCase() === "admin" && adminPassword === "123456") {
      const adminUser = {
        id: "usr-admin-root",
        name: "Quản Trị Viên (Admin)",
        email: "admin@dat-to.vn",
        phone: "0900 888 999",
        avatar: "AD",
        provider: "admin" as const,
        role: "admin" as const,
      };
      setAuthUser(adminUser);
      window.localStorage.setItem("datto-auth-user", JSON.stringify(adminUser));
      setAuthModalOpen(false);
      setAdminLoginError("");
      setAdminUsername("");
      setAdminPassword("");
      showToast("🛡️ Đăng nhập Quản Trị Viên (Admin) thành công! Bạn có toàn quyền quản lý hệ thống và phân quyền Gmail.");
    } else {
      setAdminLoginError("Tên đăng nhập hoặc mật khẩu Quản Trị Viên không chính xác!");
    }
  };

  // Handle Standard Email & Password Login (Customer & Merchant)
  const handleUserLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail || !loginPassword) {
      setLoginError("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    // 1. Check if Merchant
    const merchant = merchantWhitelist.find(m => m.email.toLowerCase() === cleanEmail);
    if (merchant) {
      if (merchant.password === loginPassword) {
        const user = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: merchant.merchantName,
          email: merchant.email,
          phone: merchant.phone,
          avatar: merchant.merchantName.slice(0, 2).toUpperCase(),
          provider: "local" as const,
          role: "merchant" as const,
          merchantName: merchant.merchantName,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setAuthModalOpen(false);
        setLoginEmail("");
        setLoginPassword("");
        showToast(`🏪 Đăng nhập thành công với quyền CHỦ CƠ SỞ OCOP: ${merchant.merchantName}!`);
        return;
      } else {
        setLoginError("Mật khẩu tài khoản Doanh nghiệp không chính xác! Hãy liên hệ Admin nếu bạn quên mật khẩu.");
        return;
      }
    }

    // 2. Check if Registered Customer
    const customer = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (customer) {
      if (customer.password === loginPassword) {
        const user = {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "0912 345 678",
          avatar: customer.name.slice(0, 2).toUpperCase(),
          provider: "local" as const,
          role: "customer" as const,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setAuthModalOpen(false);
        setLoginEmail("");
        setLoginPassword("");
        showToast(`👤 Đăng nhập thành công tài khoản: ${customer.name}!`);
        return;
      } else {
        setLoginError("Mật khẩu không chính xác. Vui lòng kiểm tra lại!");
        return;
      }
    }

    // 3. User not found
    setLoginError("Email này chưa đăng ký tài khoản. Vui lòng bấm sang tab 'Đăng Ký Tài Khoản' để tạo tài khoản mới!");
  };

  // Handle New Customer Registration with Password
  const handleUserRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
    const cleanEmail = registerEmail.trim().toLowerCase();

    if (!registerName.trim() || !cleanEmail || !registerPassword) {
      setRegisterError("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }
    if (registerPassword.length < 3) {
      setRegisterError("Mật khẩu phải có ít nhất 3 ký tự!");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Xác nhận mật khẩu không trùng khớp!");
      return;
    }

    if (registeredUsers.some(u => u.email.toLowerCase() === cleanEmail) || merchantWhitelist.some(m => m.email.toLowerCase() === cleanEmail)) {
      setRegisterError("Địa chỉ Email này đã có tài khoản trên hệ thống! Vui lòng bấm Đăng nhập.");
      return;
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: registerName.trim(),
      email: cleanEmail,
      phone: registerPhone.trim() || "0912 345 678",
      password: registerPassword,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const nextUsers = [...registeredUsers, newUser];
    setRegisteredUsers(nextUsers);
    window.localStorage.setItem("datto-registered-users", JSON.stringify(nextUsers));

    const auth = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      avatar: newUser.name.slice(0, 2).toUpperCase(),
      provider: "local" as const,
      role: "customer" as const,
    };
    setAuthUser(auth);
    window.localStorage.setItem("datto-auth-user", JSON.stringify(auth));
    setCheckoutName(auth.name);
    if (auth.phone) setCheckoutPhone(auth.phone);

    setAuthModalOpen(false);
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPhone("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    showToast(`🎉 Đăng ký tài khoản thành công! Chào mừng ${auth.name} đến với Đất Tổ Travel.`);
  };

  // Google OAuth step 1: User chooses an account
  const handleGoogleAccountSelect = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const matchedMerchant = merchantWhitelist.find(m => m.email.toLowerCase() === cleanEmail);

    setGoogleSelectedAccount({
      email: cleanEmail,
      name: name || (matchedMerchant ? matchedMerchant.merchantName : cleanEmail.split("@")[0]),
      isMerchant: !!matchedMerchant,
      merchantName: matchedMerchant?.merchantName,
    });
    setGoogleAccountPassword("");
    setGooglePasswordError("");
  };

  // Google OAuth step 2: User confirms password
  const handleGoogleAccountPasswordConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGooglePasswordError("");

    if (!googleSelectedAccount) return;
    if (!googleAccountPassword) {
      setGooglePasswordError("Vui lòng nhập mật khẩu để xác thực tài khoản!");
      return;
    }

    const cleanEmail = googleSelectedAccount.email.toLowerCase();

    // 1. If Merchant
    if (googleSelectedAccount.isMerchant) {
      const merchant = merchantWhitelist.find(m => m.email.toLowerCase() === cleanEmail);
      if (merchant && merchant.password === googleAccountPassword) {
        const user = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: googleSelectedAccount.name,
          email: cleanEmail,
          phone: merchant.phone,
          avatar: googleSelectedAccount.name.slice(0, 2).toUpperCase(),
          provider: "google" as const,
          role: "merchant" as const,
          merchantName: googleSelectedAccount.merchantName,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setGoogleOAuthModalOpen(false);
        setAuthModalOpen(false);
        setGoogleSelectedAccount(null);
        showToast(`🏪 Đăng nhập thành công CHỦ CƠ SỞ OCOP: ${googleSelectedAccount.merchantName}!`);
        return;
      } else {
        setGooglePasswordError("Mật khẩu Doanh nghiệp không chính xác! (Mật khẩu do Admin cấp)");
        return;
      }
    }

    // 2. If Customer
    const existingCustomer = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingCustomer) {
      if (existingCustomer.password === googleAccountPassword) {
        const user = {
          id: existingCustomer.id,
          name: existingCustomer.name,
          email: cleanEmail,
          phone: existingCustomer.phone || "0912 345 678",
          avatar: existingCustomer.name.slice(0, 2).toUpperCase(),
          provider: "google" as const,
          role: "customer" as const,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setGoogleOAuthModalOpen(false);
        setAuthModalOpen(false);
        setGoogleSelectedAccount(null);
        showToast(`👤 Đăng nhập thành công tài khoản Du khách (${cleanEmail})!`);
        return;
      } else {
        setGooglePasswordError("Mật khẩu tài khoản không chính xác!");
        return;
      }
    } else {
      // New Customer via Google: Register with this password!
      const newCust = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        name: googleSelectedAccount.name,
        email: cleanEmail,
        phone: "0912 345 678",
        password: googleAccountPassword,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      const nextCusts = [...registeredUsers, newCust];
      setRegisteredUsers(nextCusts);
      window.localStorage.setItem("datto-registered-users", JSON.stringify(nextCusts));

      const user = {
        id: newCust.id,
        name: newCust.name,
        email: cleanEmail,
        phone: newCust.phone,
        avatar: newCust.name.slice(0, 2).toUpperCase(),
        provider: "google" as const,
        role: "customer" as const,
      };
      setAuthUser(user);
      window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
      setCheckoutName(user.name);
      if (user.phone) setCheckoutPhone(user.phone);
      setGoogleOAuthModalOpen(false);
      setAuthModalOpen(false);
      setGoogleSelectedAccount(null);
      showToast(`🎉 Đã tạo mật khẩu và đăng nhập thành công tài khoản Google: ${cleanEmail}!`);
    }
  };

  // Handle Custom Google Gmail Submission with Password
  const handleCustomGoogleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGoogleInputError("");
    const cleanEmail = googleInputEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setGoogleInputError("Vui lòng nhập địa chỉ Gmail hợp lệ!");
      return;
    }
    if (!googleInputPassword.trim()) {
      setGoogleInputError("Vui lòng nhập mật khẩu để bảo vệ tài khoản của bạn!");
      return;
    }

    // Check if Merchant
    const matchedMerchant = merchantWhitelist.find(m => m.email.toLowerCase() === cleanEmail);
    if (matchedMerchant) {
      if (matchedMerchant.password === googleInputPassword) {
        const user = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: matchedMerchant.merchantName,
          email: cleanEmail,
          phone: matchedMerchant.phone,
          avatar: matchedMerchant.merchantName.slice(0, 2).toUpperCase(),
          provider: "google" as const,
          role: "merchant" as const,
          merchantName: matchedMerchant.merchantName,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setGoogleOAuthModalOpen(false);
        setAuthModalOpen(false);
        setGoogleInputEmail("");
        setGoogleInputName("");
        setGoogleInputPassword("");
        showToast(`🏪 Đăng nhập thành công CHỦ CƠ SỞ OCOP: ${matchedMerchant.merchantName}!`);
        return;
      } else {
        setGoogleInputError("Mật khẩu Doanh nghiệp không chính xác! (Mật khẩu do Admin cấp)");
        return;
      }
    }

    // Check if existing customer
    const existingCustomer = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingCustomer) {
      if (existingCustomer.password === googleInputPassword) {
        const user = {
          id: existingCustomer.id,
          name: existingCustomer.name,
          email: cleanEmail,
          phone: existingCustomer.phone || "0912 345 678",
          avatar: existingCustomer.name.slice(0, 2).toUpperCase(),
          provider: "google" as const,
          role: "customer" as const,
        };
        setAuthUser(user);
        window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
        setCheckoutName(user.name);
        if (user.phone) setCheckoutPhone(user.phone);
        setGoogleOAuthModalOpen(false);
        setAuthModalOpen(false);
        setGoogleInputEmail("");
        setGoogleInputName("");
        setGoogleInputPassword("");
        showToast(`👤 Đăng nhập thành công tài khoản Du khách (${cleanEmail})!`);
        return;
      } else {
        setGoogleInputError("Mật khẩu tài khoản không chính xác!");
        return;
      }
    } else {
      // New Customer via Custom Google input: create new user with this password!
      const displayName = googleInputName.trim() || cleanEmail.split("@")[0];
      const newCust = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        name: displayName,
        email: cleanEmail,
        phone: "0912 345 678",
        password: googleInputPassword,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      const nextCusts = [...registeredUsers, newCust];
      setRegisteredUsers(nextCusts);
      window.localStorage.setItem("datto-registered-users", JSON.stringify(nextCusts));

      const user = {
        id: newCust.id,
        name: newCust.name,
        email: cleanEmail,
        phone: newCust.phone,
        avatar: newCust.name.slice(0, 2).toUpperCase(),
        provider: "google" as const,
        role: "customer" as const,
      };
      setAuthUser(user);
      window.localStorage.setItem("datto-auth-user", JSON.stringify(user));
      setCheckoutName(user.name);
      if (user.phone) setCheckoutPhone(user.phone);
      setGoogleOAuthModalOpen(false);
      setAuthModalOpen(false);
      setGoogleInputEmail("");
      setGoogleInputName("");
      setGoogleInputPassword("");
      showToast(`🎉 Đã tạo mật khẩu và đăng nhập thành công tài khoản Google: ${cleanEmail}!`);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = () => {
    setLoginEmail("thanhhoang.fb@gmail.com");
    setAuthModalTab("login");
    setAuthModalOpen(true);
    showToast("Vui lòng nhập mật khẩu tài khoản của bạn để đăng nhập an toàn.");
  };

  // Admin Adds new Merchant Gmail with Password
  const addMerchantToWhitelist = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMerchantEmail.trim() || !newMerchantName.trim()) {
      showToast("Vui lòng nhập địa chỉ Gmail và Tên cơ sở OCOP!");
      return;
    }
    const cleanEmail = newMerchantEmail.trim().toLowerCase();
    if (merchantWhitelist.some((m) => m.email.toLowerCase() === cleanEmail)) {
      showToast("Địa chỉ Gmail này đã được cấp quyền trước đó!");
      return;
    }
    const next = [
      ...merchantWhitelist,
      {
        email: cleanEmail,
        merchantName: newMerchantName.trim(),
        password: newMerchantPassword.trim() || "123456",
        phone: newMerchantPhone.trim() || "0987 654 321",
        createdAt: new Date().toLocaleDateString("vi-VN"),
      },
    ];
    setMerchantWhitelist(next);
    window.localStorage.setItem("datto-merchant-whitelist", JSON.stringify(next));
    setNewMerchantEmail("");
    setNewMerchantName("");
    setNewMerchantPhone("");
    setNewMerchantPassword("123456");
    showToast(`✓ Đã cấp quyền và mật khẩu cho Gmail Doanh Nghiệp: ${cleanEmail}!`);
  };

  // Admin Removes a Merchant Gmail
  const removeMerchantFromWhitelist = (email: string) => {
    const next = merchantWhitelist.filter((m) => m.email.toLowerCase() !== email.toLowerCase());
    setMerchantWhitelist(next);
    window.localStorage.setItem("datto-merchant-whitelist", JSON.stringify(next));
    showToast(`Đã thu hồi quyền Chủ cơ sở của: ${email}`);
  };

  const handleLogout = () => {
    setAuthUser(null);
    window.localStorage.removeItem("datto-auth-user");
    showToast("Đã đăng xuất tài khoản.");
  };

  const cancelOrder = (orderId: string) => {
    const nextOrders = orderList.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "Đã hủy" };
      }
      return o;
    });
    setOrderList(nextOrders);
    window.localStorage.setItem("datto-demo-orders", JSON.stringify(nextOrders));
    showToast(`Đã hủy đơn hàng #${orderId}`);
  };

  const reorderItems = (order: any) => {
    if (!order.items || !order.items.length) return;
    let addedCount = 0;
    order.items.forEach((it: any) => {
      const foundDish = foodCatalog.find((fc) => fc.dish.name === it.dishName)?.dish;
      const foundSeller = foundDish?.sellers.find((s) => s.name === it.sellerName) || foundDish?.sellers[0];
      if (foundDish && foundSeller) {
        addToCart(foundDish, foundSeller);
        addedCount++;
      }
    });
    setCartDrawerTab("cart");
    setCartOpen(true);
    showToast(`Đã thêm ${addedCount} món từ đơn #${order.id} vào giỏ hàng!`);
  };

  const submitDemoOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authUser) {
      setAuthModalOpen(true);
      showToast("⚠️ Vui lòng đăng nhập bằng Gmail hoặc Facebook để đặt hàng!");
      return;
    }
    if (!checkoutName.trim()) {
      showToast("Vui lòng nhập họ và tên người mua");
      return;
    }
    if (checkoutPhone.replace(/\D/g, "").length < 9 || !cartDetails.length) {
      showToast("Hãy nhập số điện thoại hợp lệ để xác nhận đơn hàng");
      return;
    }

    const selectedPayLabel = PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label || "VietQR";

    try {
      const payload = {
        userId: authUser?.id,
        userEmail: authUser?.email,
        customerEmail: authUser?.email,
        customerName: checkoutName.trim(),
        phone: checkoutPhone.trim(),
        address: checkoutAddress.trim() || "Giao tại khách sạn / điểm hẹn",
        note: checkoutNote.trim() || "Không có",
        paymentMethod: selectedPayLabel,
        appliedVoucher: appliedVoucher ? `${appliedVoucher.code} (${appliedVoucher.title})` : undefined,
        discountAmount: voucherDiscount,
        items: cartDetails.map((c) => ({
          dishName: c.dish.name,
          sellerName: c.seller.name,
          sellerPhone: c.seller.phone,
          sellerAddress: c.seller.address,
          quantity: c.quantity,
          unitPrice: c.seller.price,
          totalPrice: c.seller.price * c.quantity,
        })),
        totalAmount: finalCartTotal,
        customSheetWebhook: sheetWebhookUrl || undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        const stored = JSON.parse(window.localStorage.getItem("datto-demo-orders") ?? "[]") as any[];
        const fullOrder = {
          ...data.order,
          userId: authUser?.id,
          userEmail: authUser?.email,
          customerEmail: authUser?.email,
          paymentMethod: selectedPayLabel,
          status: "Chờ xác nhận",
        };
        const nextOrders = [fullOrder, ...stored];
        window.localStorage.setItem("datto-demo-orders", JSON.stringify(nextOrders));
        setOrderList(nextOrders);
        setConfirmedOrder({ ...data, order: fullOrder });
        setCart([]);
        window.localStorage.removeItem("datto-cart");
        setCartOpen(false);
        setCheckoutName("");
        setCheckoutPhone("");
        setCheckoutAddress("");
        setCheckoutNote("");
        showToast(`✦ Đã tạo đơn ${fullOrder.id} (${selectedPayLabel})!`);
      } else {
        throw new Error(data.error || "Lỗi xử lý đơn");
      }
    } catch {
      // Fallback offline / local
      const stored = JSON.parse(window.localStorage.getItem("datto-demo-orders") ?? "[]") as any[];
      const fallbackOrder = {
        id: `DT-${Date.now().toString().slice(-6)}`,
        userId: authUser?.id,
        userEmail: authUser?.email,
        customerEmail: authUser?.email,
        customerName: checkoutName.trim(),
        phone: checkoutPhone.trim(),
        address: checkoutAddress.trim() || "Giao tại điểm hẹn",
        note: checkoutNote.trim() || "Không có",
        paymentMethod: selectedPayLabel,
        appliedVoucher: appliedVoucher ? `${appliedVoucher.code} (${appliedVoucher.title})` : undefined,
        discountAmount: voucherDiscount,
        items: cartDetails.map((c) => ({
          dishName: c.dish.name,
          sellerName: c.seller.name,
          sellerPhone: c.seller.phone,
          sellerAddress: c.seller.address,
          quantity: c.quantity,
          unitPrice: c.seller.price,
          totalPrice: c.seller.price * c.quantity,
        })),
        totalAmount: finalCartTotal,
        createdAt: new Date().toLocaleString("vi-VN"),
        status: "Chờ xác nhận",
      };
      const nextOrders = [fallbackOrder, ...stored];
      window.localStorage.setItem("datto-demo-orders", JSON.stringify(nextOrders));
      setOrderList(nextOrders);
      setConfirmedOrder({
        order: fallbackOrder,
        sheetSyncStatus: "Đã lưu vào bộ quản lý đơn hàng hệ thống",
        merchantNotifications: fallbackOrder.items.map((it) => ({
          sellerName: it.sellerName,
          sellerPhone: it.sellerPhone,
          message: `🔔 [ĐẤT TỔ TRAVEL] ĐƠN HÀNG MỚI #${fallbackOrder.id}\n• Món: ${it.dishName} x${it.quantity}\n• Khách: ${fallbackOrder.customerName} (${fallbackOrder.phone})\n• Giao tại: ${fallbackOrder.address}\n• Ghi chú: ${fallbackOrder.note}`,
          zaloUrl: it.sellerPhone ? `https://zalo.me/${it.sellerPhone.replace(/\D/g, "")}` : undefined,
        })),
      });
      setCart([]);
      window.localStorage.removeItem("datto-cart");
      setCartOpen(false);
      setCheckoutName("");
      setCheckoutPhone("");
      setCheckoutAddress("");
      setCheckoutNote("");
      showToast(`✦ Đã tạo đơn hàng ${fallbackOrder.id}!`);
    }
  };

  const clearMyOrders = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử đơn hàng của tài khoản này không?")) {
      const remaining = orderList.filter((o) => !userOrderList.some((uo) => uo.id === o.id));
      setOrderList(remaining);
      window.localStorage.setItem("datto-demo-orders", JSON.stringify(remaining));
      showToast("✓ Đã xóa sạch danh sách đơn hàng của bạn!");
    }
  };

  // Render Shopee-style 5 Status Icon Hub (Mục 3 trong Góp ý)
  const renderShopeeOrderHub = (target: "profile" | "drawer" | "modal" = "profile") => {
    const pendingCount = userOrderList.filter(o => !o.status || o.status === "Chờ xác nhận" || o.status === "pending").length;
    const processingCount = userOrderList.filter(o => o.status === "Đang xử lý" || o.status === "Đã xác nhận" || o.status === "Đang chuẩn bị" || o.status === "Chờ lấy hàng" || o.status === "processing").length;
    const shippingCount = userOrderList.filter(o => o.status === "Đang giao hàng" || o.status === "Đang giao" || o.status === "shipping").length;
    const completedCount = userOrderList.filter(o => o.status === "Hoàn thành" || o.status === "Đã giao" || o.status === "completed").length;
    const cancelledCount = userOrderList.filter(o => o.status === "Đã hủy" || o.status === "cancelled").length;

    const handleSelectStatus = (statusId: string) => {
      setOrderStatusTab(statusId);
      if (target === "profile") {
        setCartDrawerTab("orders");
        setCartOpen(true);
      }
    };

    return (
      <div className="shopee-order-hub">
        <div className="shopee-order-hub-header">
          <h3>
            <span>🛍️</span>
            <b>{t.shopeePurchases}</b>
          </h3>
          <button
            type="button"
            onClick={() => {
              setOrderStatusTab("all");
              if (target === "profile") {
                setCartDrawerTab("orders");
                setCartOpen(true);
              }
            }}
          >
            <span>{t.shopeeViewHistory}</span>
            <b>❯</b>
          </button>
        </div>

        <div className="shopee-order-status-grid">
          {/* 1. Chờ xác nhận */}
          <button
            type="button"
            className={`shopee-status-btn ${orderStatusTab === "pending" ? "is-active" : ""}`}
            onClick={() => handleSelectStatus("pending")}
            title={t.statusPending}
          >
            <div className="shopee-status-icon-box">
              <span>💳</span>
              {pendingCount > 0 && <span className="shopee-status-badge">{pendingCount}</span>}
            </div>
            <span className="shopee-status-label">{t.statusPending}</span>
          </button>

          {/* 2. Chờ lấy hàng */}
          <button
            type="button"
            className={`shopee-status-btn ${orderStatusTab === "processing" ? "is-active" : ""}`}
            onClick={() => handleSelectStatus("processing")}
            title={t.statusProcessing}
          >
            <div className="shopee-status-icon-box">
              <span>📦</span>
              {processingCount > 0 && <span className="shopee-status-badge">{processingCount}</span>}
            </div>
            <span className="shopee-status-label">{t.statusProcessing}</span>
          </button>

          {/* 3. Chờ giao hàng */}
          <button
            type="button"
            className={`shopee-status-btn ${orderStatusTab === "shipping" ? "is-active" : ""}`}
            onClick={() => handleSelectStatus("shipping")}
            title={t.statusShipping}
          >
            <div className="shopee-status-icon-box">
              <span>🚚</span>
              {shippingCount > 0 && <span className="shopee-status-badge">{shippingCount}</span>}
            </div>
            <span className="shopee-status-label">{t.statusShipping}</span>
          </button>

          {/* 4. Đánh giá / Hoàn thành */}
          <button
            type="button"
            className={`shopee-status-btn ${orderStatusTab === "completed" ? "is-active" : ""}`}
            onClick={() => handleSelectStatus("completed")}
            title={t.statusCompleted}
          >
            <div className="shopee-status-icon-box">
              <span>⭐</span>
              {completedCount > 0 && <span className="shopee-status-badge">{completedCount}</span>}
            </div>
            <span className="shopee-status-label">{t.statusCompleted}</span>
          </button>

          {/* 5. Đã hủy */}
          <button
            type="button"
            className={`shopee-status-btn ${orderStatusTab === "cancelled" ? "is-active" : ""}`}
            onClick={() => handleSelectStatus("cancelled")}
            title={t.statusCancelled}
          >
            <div className="shopee-status-icon-box">
              <span>✕</span>
              {cancelledCount > 0 && <span className="shopee-status-badge">{cancelledCount}</span>}
            </div>
            <span className="shopee-status-label">{t.statusCancelled}</span>
          </button>
        </div>
      </div>
    );
  };

  const exportOrdersToCSV = () => {
    if (!orderList.length) {
      showToast("Chưa có đơn hàng nào trong hệ thống");
      return;
    }
    const headers = ["Mã Đơn", "Thời Gian Đặt", "Tên Khách Hàng", "Số Điện Thoại", "Địa Chỉ Giao Hàng", "Chi Tiết Món & SL", "Cơ Sở Cung Cấp", "Tổng Tiền (VNĐ)", "Ghi Chú", "Trạng Thái"];
    const rows = orderList.map((o) => [
      o.id,
      `"${o.createdAt}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.address}"`,
      `"${(o.items || []).map((i: any) => `${i.dishName} x${i.quantity}`).join("; ")}"`,
      `"${(o.items || []).map((i: any) => i.sellerName).join(", ")}"`,
      o.totalAmount,
      `"${o.note || ''}"`,
      `"${o.status || 'Chờ xác nhận'}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Don_Hang_Dat_To_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Đã xuất file CSV Trang Tính Đơn Hàng thành công!");
  };

  const saveCustomSheetWebhook = (url: string) => {
    setSheetWebhookUrl(url);
    window.localStorage.setItem("datto-sheet-webhook", url);
    showToast("✓ Đã lưu Webhook kết nối Google Sheets!");
  };

  const openBooking = (place: Place, stay: NearbyItem) => {
    setBookingOffer({ place, stay });
    setBookingName("");
    setBookingCheckIn("");
    setBookingCheckOut("");
    setBookingGuests(2);
    setBookingPhone("");
    setBookingNote("");
  };

  const submitBookingRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingName.trim()) {
      showToast("Vui lòng nhập họ tên người đại diện nhận phòng");
      return;
    }
    if (!bookingOffer || !bookingCheckIn || !bookingCheckOut || bookingPhone.replace(/\D/g, "").length < 9) {
      showToast("Hãy điền ngày nhận, trả phòng và số điện thoại hợp lệ");
      return;
    }
    if (new Date(bookingCheckOut) <= new Date(bookingCheckIn)) {
      showToast("Ngày trả phòng cần sau ngày nhận phòng");
      return;
    }
    const total = estimatedStayPrice(bookingOffer.stay) * bookingNights;
    const stored = JSON.parse(window.localStorage.getItem("datto-booking-requests") ?? "[]") as unknown[];
    const request = {
      id: `DP-${String(stored.length + 1).padStart(6, "0")}`,
      customerName: bookingName.trim(),
      stay: bookingOffer.stay.name,
      place: bookingOffer.place.shortName,
      checkIn: bookingCheckIn,
      checkOut: bookingCheckOut,
      guests: bookingGuests,
      phone: bookingPhone,
      note: bookingNote.trim(),
      total,
      createdAt: new Date().toISOString()
    };
    window.localStorage.setItem("datto-booking-requests", JSON.stringify([request, ...stored]));
    setBookingOffer(null);
    showToast(`✦ Đã ghi nhận yêu cầu đặt phòng ${request.id} cho quý khách ${request.customerName}!`);
  };

  const handleReviewPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 2);
    if (!files.length) return;
    if (files.some((file) => file.size > 800_000)) {
      showToast("Mỗi ảnh cần nhỏ hơn 800 KB");
      event.target.value = "";
      return;
    }
    const encoded = await Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
    setReviewPhotos((current) => [...current, ...encoded].slice(0, 2));
    event.target.value = "";
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || reviewComment.trim().length < 8) {
      showToast("Hãy viết nhận xét ít nhất 8 ký tự");
      return;
    }
    const review: UserReview = {
      id: `${selected.id}-review-${userReviews.length + 1}`,
      placeId: selected.id,
      name: reviewName.trim() || "Du khách",
      rating: reviewRating,
      comment: reviewComment.trim(),
      photos: reviewPhotos,
      createdAt: new Date().toISOString(),
    };
    const next = [review, ...userReviews];
    setUserReviews(next);
    window.localStorage.setItem("datto-reviews", JSON.stringify(next));
    setReviewComment("");
    setReviewPhotos([]);
    setReviewRating(5);
    showToast("Đã đăng đánh giá thành công!");
  };

  const distanceFromUser = (place: Place) =>
    position ? formatDistance(haversine(position.lat, position.lng, place.lat, place.lng)) : null;

  const selectedUserReviews = selected ? userReviews.filter((review) => review.placeId === selected.id) : [];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.dataset.fallback) {
      target.dataset.fallback = "true";
      target.src = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
    }
  };

  const openPlace = (place: Place) => {
    stopAllAudio();
    setDetailMode("eat");
    setSelected(place);
  };

  const renderPlaceCard = (place: Place, compact = false) => (
    <article className={`place-card ${compact ? "place-card--compact" : ""}`} key={place.id}>
      <button className="place-card__image-button" onClick={() => openPlace(place)} aria-label={`Xem ${place.name}`}>
        <img className="place-card__image" src={place.image} alt={place.name} loading="lazy" onError={handleImageError} />
        <span className="place-card__category">{getCategoryLabel(place.category, t)}</span>
        <span className="place-card__region-badge">{getRegionLabel(place.region, t)}</span>
        {distanceFromUser(place) && <span className="place-card__distance">⌖ {distanceFromUser(place)}</span>}
      </button>
      <button
        className={`heart-button ${favorites.includes(place.id) ? "is-saved" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(place.id);
        }}
        aria-label={favorites.includes(place.id) ? `Bỏ lưu ${place.name}` : `Lưu ${place.name}`}
      >
        {favorites.includes(place.id) ? "♥" : "♡"}
      </button>
      <div className="place-card__body" onClick={() => openPlace(place)}>
        <span className="eyebrow">{place.location}</span>
        <strong>{place.shortName}</strong>
        <span className="place-card__meta"><b>★ {place.rating}</b> ({place.reviews.toLocaleString("vi-VN")}) · {place.bestTime}</span>
        {!compact && <span className="place-card__highlight">✦ {place.highlights[0]}</span>}
        {!compact && (
          <div className="place-card__footer">
            <span className="place-card__distance-info">
              {distanceFromUser(place)
                ? `${distanceFromUser(place)} · ${estimateTravel(haversine(position!.lat, position!.lng, place.lat, place.lng))}`
                : `${place.distanceFromVietTri} km ${t.fromVietTri}`}
            </span>
            <div className="place-card__actions-row">
              <a
                className="place-card__quick-map-btn"
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`${t.getDirectionsBtn}: ${place.name}`}
              >
                {t.getDirectionsBtn}
              </a>
              <span className="place-card__detail-link">{t.detailsBtn}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );

  const renderFoodMarket = (dish: FoodDish, context: "search" | "region") => (
    <article className={`food-market food-market--${context}`} key={`${context}-${dish.id}`}>
      <div className="food-market__intro">
        <img src={dish.image} alt={`Ảnh minh họa ${dish.name}`} loading="lazy" onError={handleImageError} />
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent)" }}>{t.foodKicker} · {dish.region}</span>
            <button
              type="button"
              className="text-link"
              style={{ fontSize: "12px" }}
              onClick={() => toggleSaveDish(dish.id)}
            >
              {savedDishes.includes(dish.id) ? t.foodSavedBtn : t.foodSaveBtn}
            </button>
          </div>
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
        </div>
      </div>
      <div className="seller-grid">
        {dish.sellers.map((seller) => (
          <section className="seller-card" key={seller.id}>
            <div className="seller-card__top">
              <span>{seller.verified ? t.sellerVerified : t.sellerSuggested}</span>
              <b>★ {seller.rating}{seller.reviewCount ? ` (${seller.reviewCount})` : " · mới"}</b>
            </div>
            <h4>{seller.name}</h4>
            <p><strong>{t.addressLabel}</strong> {seller.address}</p>
            <p><strong>{t.servingHoursLabel}</strong> {seller.hours}</p>
            <p><strong>{t.phoneNumberLabel}:</strong> {seller.phone || t.contactAtShop}</p>
            <p><strong>{t.pickupNoteLabel}</strong> {seller.pickupNote}</p>
            <div className="seller-card__buy">
              <span><b>{formatMoney(seller.price, currentCurrency)}</b><small>/{seller.unit}</small></span>
              <button type="button" onClick={() => addToCart(dish, seller)}>{t.addToCartBtn}</button>
            </div>
            <div className="seller-card__links">
              {seller.phone && <a href={`tel:${seller.phone}`}>{t.callSeller}</a>}
              <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`}>{t.openMapSeller}</a>
            </div>
          </section>
        ))}
      </div>
    </article>
  );

  return (
    <main className="app-shell">
      {/* TOPBAR */}
      <header className="topbar">
        <button className="brand" onClick={() => setActiveTab("explore")} aria-label={t.explore}>
          <span className="brand__mark">Đ</span>
          <span><strong>Đất Tổ</strong><small>{t.brandSubtitle}</small></span>
        </button>
        <nav className="desktop-nav" aria-label={t.bottomNavAria}>
          <button className={activeTab === "explore" ? "is-active" : ""} onClick={() => setActiveTab("explore")}>
            {t.explore}
          </button>
          <button className={activeTab === "trip" ? "is-active" : ""} onClick={() => setActiveTab("trip")}>
            {t.trip}
          </button>
          <button className={activeTab === "near" ? "is-active" : ""} onClick={() => setActiveTab("near")}>
            {t.near}
          </button>
          <button className={activeTab === "saved" ? "is-active" : ""} onClick={() => setActiveTab("saved")}>
            {t.saved}
            {(favorites.length + savedDishes.length + savedItineraryList.length > 0) && (
              <span className="nav-badge">{favorites.length + savedDishes.length + savedItineraryList.length}</span>
            )}
          </button>
        </nav>
        <div className="topbar__actions">
          {/* Language Dropdown Selector */}
          <div className="i18n-dropdown-container">
            <button
              type="button"
              className="lang-pill-btn"
              onClick={() => { setLangDropdownOpen(!langDropdownOpen); }}
              title={t.toastLangChanged}
            >
              <span>{LANGUAGES[currentLang].flag}</span>
              <b>{currentLang.toUpperCase()}</b>
              <small>▾</small>
            </button>
            {langDropdownOpen && (
              <div className="i18n-dropdown-menu">
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={`i18n-dropdown-item ${currentLang === code ? "is-selected" : ""}`}
                    onClick={() => {
                      setCurrentLang(code);
                      setAudioLang(code === "vi" ? "vi" : "en");
                      setSelectedVoiceURI(code === "vi" ? "ai-female-north" : "ai-en-us");
                      setLangDropdownOpen(false);
                      setGeneratedItinerary((prev) =>
                        buildItinerary({
                          anchorPlaceId: selectedPlaceIds[0] || targetPlaceId,
                          selectedPlaceIds,
                          district: tripDistrict !== "Tất cả" ? tripDistrict : undefined,
                          region: tripRegion !== "Tất cả" ? tripRegion : undefined,
                          durationDays: days,
                          transport,
                          budget,
                          style: interest,
                          travelers,
                          lang: code,
                        })
                      );
                      showToast(`${UI_TEXT[code].toastLangChanged} ${LANGUAGES[code].label}`);
                    }}
                  >
                    <span>{LANGUAGES[code].flag} {LANGUAGES[code].label}</span>
                    {currentLang === code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="weather-pill" onClick={() => showToast(`${weather.label} ${t.weatherToast}`)}>
            <span>☀</span><b>{weather.temp}°</b><small>{currentLang === "zh" ? "越池" : currentLang === "ko" ? "비엣찌" : currentLang === "ja" ? "ヴィエッチー" : "Việt Trì"}</small>
          </button>

          <button
            className="avatar"
            onClick={() => setActiveTab("profile")}
            aria-label={t.profile}
            title={authUser ? `${authUser.name} (${authUser.role === "admin" ? t.roleAdmin : authUser.role === "merchant" ? t.roleMerchant : t.roleCustomer})` : t.loginAccount}
          >
            {authUser ? (authUser.avatar || authUser.name.slice(0, 2).toUpperCase()) : "👤"}
          </button>
        </div>
      </header>

      {/* TAB 1: KHÁM PHÁ (EXPLORE) */}
      {activeTab === "explore" && (
        <>
          <section className="hero">
            <div className="hero__content">
              <span className="kicker">{t.heroKicker}</span>
              <h1>{t.heroTitle1}<br /><em>{t.heroTitle2}</em></h1>
              <p>{t.heroDesc}</p>
              <div className="search-area" onMouseLeave={() => setSearchFocused(false)} onPointerLeave={() => setSearchFocused(false)}>
                <div className="search-box">
                  <span aria-hidden="true">⌕</span>
                  <input
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setSearchFocused(true); setVisibleCount(8); }}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSearchFocused(false);
                      if (event.key === "Enter" && searchSuggestions[0]) {
                        const suggestion = searchSuggestions[0];
                        if (suggestion.kind === "place") selectSearchSuggestion(suggestion.place, suggestion.label);
                        else selectFoodSuggestion(suggestion.dish);
                      }
                    }}
                    placeholder={t.searchInputPlaceholder}
                    aria-label={t.searchAriaLabel}
                    aria-controls="search-suggestions"
                  />
                  <button onClick={() => { setSearchFocused(false); locate(); }} title={t.useCurrentLocation} aria-label={t.useCurrentLocation}>⌖</button>
                </div>
                {searchFocused && searchSuggestions.length > 0 && (
                  <div className="search-suggestions" id="search-suggestions" role="listbox">
                    <span className="search-suggestions__label">{query ? t.searchSuggestionsMatched || "..." : t.searchSuggestionsPopular || "..."}</span>
                    {searchSuggestions.map((item) => (
                      <button key={item.id} role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => item.kind === "place" ? selectSearchSuggestion(item.place, item.label) : selectFoodSuggestion(item.dish)}>
                        <span>{item.icon}</span><p><b>{item.label}</b><small>{item.meta}</small></p><i>↗</i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* QUICK TRENDING SEARCH CHIPS */}
              <div className="hero__trending">
                <span className="hero__trending-label">{t.heroTrendingLabel}</span>
                {[
                  { label: t.heroTagHungTemple, term: "Đền Hùng" },
                  { label: t.heroTagHotSpring, term: "Khoáng nóng Thanh Thủy" },
                  { label: t.heroTagLongCoc, term: "Long Cốc" },
                  { label: t.heroTagTamDao, term: "Tam Đảo" },
                  { label: t.heroTagOcopFood, term: "OCOP" },
                ].map((chip) => (
                  <button
                    key={chip.term}
                    type="button"
                    className="hero__trending-chip"
                    onClick={() => {
                      setQuery(chip.term);
                      setSearchFocused(true);
                      setVisibleCount(8);
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* MODERN TRUST COUNTER GRID */}
              <div className="hero__trust-grid">
                <div className="hero__trust-card">
                  <div className="hero__trust-card-top">
                    <span className="hero__trust-card-icon">🏛️</span>
                    <span className="hero__trust-card-num">{places.length}+</span>
                  </div>
                  <span className="hero__trust-card-label">{t.tripPoints}</span>
                </div>
                <div className="hero__trust-card">
                  <div className="hero__trust-card-top">
                    <span className="hero__trust-card-icon">🗺️</span>
                    <span className="hero__trust-card-num">3</span>
                  </div>
                  <span className="hero__trust-card-label">{t.nearAll3Provinces}</span>
                </div>
                <div className="hero__trust-card">
                  <div className="hero__trust-card-top">
                    <span className="hero__trust-card-icon">🍵</span>
                    <span className="hero__trust-card-num">100%</span>
                  </div>
                  <span className="hero__trust-card-label">{t.heroTrustOcop}</span>
                </div>
              </div>
            </div>
            <div className="hero__visual">
              <span className="hero__badge-top">✦ {t.heroBadgeHeritage}</span>
              <img src={places[0].image} alt={places[0].name} loading="lazy" onError={handleImageError} />
              <div className="hero__caption">
                <span>{t.featuredDestCaption}</span>
                <strong>{places[0].name}</strong>
                <button onClick={() => openPlace(places[0])}>{t.openGuideBtn}</button>
              </div>
              <div className="hero__stamp"><b>01</b><span>{t.stampOriginTitle}<br />{t.stampOriginSub}</span></div>
            </div>
          </section>

          {/* SPECIAL HERITAGE PROGRAM & REWARDS BANNER (VIP REDESIGN - MỤC 8) */}
          <section className="special-heritage-banner">
            <div className="special-heritage-header">
              <span className="heritage-gold-tag">✦ {t.heritageTag1}</span>
              <span className="heritage-subtag">★ {t.heritageTag2}</span>
            </div>
            <h3 style={{ margin: "6px 0 10px", fontSize: "26px", color: "white", fontFamily: "var(--font-display)", letterSpacing: "0.01em" }}>
              {t.heritageTitle}
            </h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#dce3d8", maxWidth: "740px", lineHeight: "1.65" }}>
              {t.heritageDesc}
            </p>

            {/* VIP REWARD TICKET CARDS */}
            <div className="reward-ticket-grid">
              {/* Ticket 1: 30K Check-in Voucher */}
              <div className="reward-ticket">
                <div>
                  <div className="reward-ticket__top">
                    <span className="reward-ticket__badge">{t.rewardTicket1Badge}</span>
                    <span className="reward-ticket__icon">🎟️</span>
                  </div>
                  <div className="reward-ticket__title">{t.perk1Title}</div>
                  <p className="reward-ticket__desc">{t.perk1Desc}</p>
                </div>
                <button
                  type="button"
                  className="reward-ticket__cta"
                  onClick={() => {
                    setVouchersModalOpen(true);
                    showToast("✦ Đã mở ví voucher 30.000đ cho Đền Hùng!");
                  }}
                >
                  {t.rewardTicket1Btn}
                </button>
              </div>

              {/* Ticket 2: 15%-20% Tour Group Discount */}
              <div className="reward-ticket">
                <div>
                  <div className="reward-ticket__top">
                    <span className="reward-ticket__badge">{t.rewardTicket2Badge}</span>
                    <span className="reward-ticket__icon">🎁</span>
                  </div>
                  <div className="reward-ticket__title">{t.perk2Title}</div>
                  <p className="reward-ticket__desc">{t.perk2Desc}</p>
                </div>
                <button
                  type="button"
                  className="reward-ticket__cta"
                  onClick={() => {
                    setSelectedPlaceIds(["den-hung", "hung-lo", "thanh-thuy"]);
                    setDays(2);
                    setTravelers(3);
                    setActiveTab("trip");
                    showToast(t.openTripAssistant);
                  }}
                >
                  {t.rewardTicket2Btn}
                </button>
              </div>

              {/* Ticket 3: 5-Star OCOP Specialty Gift */}
              <div className="reward-ticket">
                <div>
                  <div className="reward-ticket__top">
                    <span className="reward-ticket__badge">{t.rewardTicket3Badge}</span>
                    <span className="reward-ticket__icon">🏆</span>
                  </div>
                  <div className="reward-ticket__title">{t.perk3Title}</div>
                  <p className="reward-ticket__desc">{t.perk3Desc}</p>
                </div>
                <button
                  type="button"
                  className="reward-ticket__cta"
                  onClick={() => {
                    const el = document.getElementById("gastronomy-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else showToast("Khám phá đặc sản thịt chua Thanh Sơn và chè Long Cốc bên dưới!");
                  }}
                >
                  {t.rewardTicket3Btn}
                </button>
              </div>
            </div>

            {/* 3-STEP HOW IT WORKS PROGRESS BAR */}
            <div className="reward-steps-bar">
              <div className="reward-steps-label">
                <span>⚡</span> {t.rewardStepsTitle}
              </div>
              <div className="reward-steps-list">
                <div className="reward-step-item">
                  <span className="reward-step-num">1</span>
                  <span className="reward-step-text">{t.rewardStep1}</span>
                </div>
                <div className="reward-step-item">
                  <span className="reward-step-num">2</span>
                  <span className="reward-step-text">{t.rewardStep2}</span>
                </div>
                <div className="reward-step-item">
                  <span className="reward-step-num">3</span>
                  <span className="reward-step-text">{t.rewardStep3}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="special-heritage-actions">
              <button
                type="button"
                className="button button--cream"
                onClick={() => setVouchersModalOpen(true)}
              >
                🎟️ {t.viewAllVouchersBtn} ({DEFAULT_VOUCHERS.length}) →
              </button>
              <button
                type="button"
                className="button button--outline"
                style={{ color: "#f3d495", borderColor: "#d7ab5a" }}
                onClick={() => {
                  setSelectedPlaceIds(["den-hung", "hung-lo", "thanh-thuy"]);
                  setDays(2);
                  setActiveTab("trip");
                  showToast(t.openTripAssistant);
                }}
              >
                ✦ {t.planTripRewardBtn}
              </button>
            </div>
          </section>

          {/* REGION & CATEGORY SELECTION */}
          <section className="content-section category-section">
            <div className="section-heading section-heading--inline">
              <div><span className="section-number">{t.section01Num}</span><h2>{t.section01Title}</h2></div>
              <button className="text-link" onClick={() => { setCategory("Tất cả"); setSelectedRegion("Tất cả"); setSeasonFilter("Tất cả"); setQuery(""); }}>{t.viewAllBtn}</button>
            </div>
            
            {/* PROVINCE SELECTOR: PHÚ THỌ - VĨNH PHÚC - HÒA BÌNH */}
            <div className="region-filter-bar" role="group" aria-label={t.nearAreaLabel}>
              <span className="region-filter-label">{t.selectProvinceLabel}</span>
              {[
                { id: "Tất cả", label: t.provAll },
                { id: "Phú Thọ", label: t.provPhuTho },
                { id: "Vĩnh Phúc", label: t.provVinhPhuc },
                { id: "Hòa Bình", label: t.provHoaBinh },
              ].map((reg) => (
                <button
                  key={reg.id}
                  className={`region-pill ${selectedRegion === reg.id ? "is-active" : ""}`}
                  onClick={() => { setSelectedRegion(reg.id as Region); setVisibleCount(8); }}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            <div className="category-row" role="group" aria-label={t.section01Title}>
              {categories.map((item) => (
                <button key={item.label} onClick={() => { setCategory(item.label); setSearchFocused(false); setVisibleCount(8); }} className={category === item.label ? "is-active" : ""}>
                  <span>{item.icon}</span>{getCategoryLabel(item.label, t)}
                </button>
              ))}
            </div>
            <div className="season-filter" role="group" aria-label={t.seasonLabel}>
              <span>{t.seasonLabel}</span>
              {seasonFilters.map((item) => (
                <button
                  key={item}
                  className={seasonFilter === item ? "is-active" : ""}
                  onClick={() => { setSeasonFilter(item); setVisibleCount(8); }}
                >
                  {item === "Đang hợp mùa"
                    ? `${t.seasonInSeason} (${currentMonth})`
                    : item === "Mùa xuân"
                    ? t.seasonSpring
                    : item === "Mùa hè"
                    ? t.seasonSummer
                    : item === "Mùa thu"
                    ? t.seasonAutumn
                    : item === "Mùa đông"
                    ? t.seasonWinter
                    : t.seasonAll}
                </button>
              ))}
            </div>
          </section>

          {/* PLACES GRID */}
          <section className="content-section places-section">
            <div className="section-heading section-heading--inline">
              <div>
                <span className="section-number">{t.section02Num}</span>
                <h2>{query && matchingFoodDishes.length ? `${t.nearServiceFood}: “${query}”` : query ? `“${query}”` : position ? t.section02TitleNear : t.section02TitleDefault}</h2>
                <p>{isServerSearching ? "..." : matchingFoodDishes.length ? `${matchingFoodDishes.length} ${t.profileItems}` : `${locationMessage} · ${filteredPlaces.length} ${t.tripPoints}`}</p>
              </div>
              {!position && <button className="location-link" onClick={locate}>{t.locateBtn}</button>}
            </div>
            {matchingFoodDishes.length > 0 && <div className="commerce-search-results">{matchingFoodDishes.map((dish) => renderFoodMarket(dish, "search"))}</div>}
            {filteredPlaces.length ? (
              <>
                <div className="place-grid">{filteredPlaces.slice(0, visibleCount).map((place) => renderPlaceCard(place))}</div>
                {filteredPlaces.length > visibleCount && (
                  <button className="load-more" onClick={() => setVisibleCount((count) => count + 4)}>{t.loadMorePlaces}</button>
                )}
              </>
            ) : matchingFoodDishes.length === 0 ? (
              <div className="empty-state"><b>{t.noResultsTitle}</b><span>{t.noResultsDesc}</span></div>
            ) : null}
          </section>

          {/* ITINERARY TEASER */}
          <section className="content-section itinerary-teaser">
            <div className="itinerary-teaser__copy">
              <span className="section-number section-number--light">{t.section03Num}</span>
              <span className="kicker kicker--light">{t.section03Kicker}</span>
              <h2>{t.section03Title1}<br /><em>{t.section03Title2}</em></h2>
              <p>{t.section03Desc}</p>
              <button className="button button--cream" onClick={() => setActiveTab("trip")}>{t.planTripSmartBtn}</button>
            </div>
            <div className="mini-itinerary">
              <div className="mini-itinerary__top"><span>{t.suggestedTourTitle}</span><b>{formatDaysNights(2, currentLang)}</b></div>
              {[places[0], places[7] || places[1], places[2], places[12] || places[3]].map((place, index) => (
                <div className="mini-stop" key={place.id}>
                  <span className="mini-stop__time">{place.bestStart}</span>
                  <span className="mini-stop__dot" />
                  <img src={place.image} alt="" loading="lazy" onError={handleImageError} />
                  <span><b>{place.shortName}</b><small>{getRegionLabel(place.region, t)} · {getCategoryLabel(place.category, t)}</small></span>
                </div>
              ))}
              <div className="route-summary"><span>{t.routeSummary1}</span><span>{t.routeSummary2}</span></div>
            </div>
          </section>

          {/* LOCAL GASTRONOMY (BẢN ĐỒ VỊ GIÁC) */}
          <section className="content-section local-guide" id="food-browser-section">
            <div className="local-guide__intro">
              <span className="kicker">{t.foodKicker}</span>
              <h2>{t.foodTitle1}<br />{t.foodTitle2}</h2>
              <p>{t.foodDesc}</p>
            </div>
            <div className="food-browser">
              <div className="food-region-tabs" role="tablist" aria-label="Chọn tỉnh ẩm thực">
                {foodRegions.map((region) => (
                  <button key={region.id} role="tab" aria-selected={foodRegionId === region.id} className={foodRegionId === region.id ? "is-active" : ""} onClick={() => setFoodRegionId(region.id)}>{region.label}</button>
                ))}
              </div>
              {foodRegions.filter((region) => region.id === foodRegionId).map((region) => (
                <div key={region.id} className="food-list">
                  <p className="food-region-note">{region.subtitle}</p>
                  {region.dishes.map((food, index) => (
                    <div className={`food-entry ${activeFoodId === food.id ? "is-active" : ""}`} key={food.id}>
                      <button
                        type="button"
                        className={`food-row ${activeFoodId === food.id ? "is-expanded" : ""}`}
                        aria-expanded={activeFoodId === food.id}
                        onClick={() => setActiveFoodId((current) => current === food.id ? null : food.id)}
                      >
                        <span className="food-row__num">{String(index + 1).padStart(2, "0")}</span>
                        <img className="food-row__thumb" src={food.image} alt={food.name} loading="lazy" onError={handleImageError} />
                        <div className="food-row__main">
                          <div className="food-row__header">
                            <b className="food-row__title">{food.name}</b>
                            <span className="food-row__price">{food.price}</span>
                          </div>
                          <p className="food-row__desc">{food.description}</p>
                          <div className="food-row__footer">
                            <span className="food-row__season">🗓️ {food.season}</span>
                            <span className="food-row__toggle">{activeFoodId === food.id ? t.foodToggleHide : t.foodToggleView}</span>
                          </div>
                        </div>
                      </button>
                      {activeFoodId === food.id && renderFoodMarket(food, "region")}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* TAB 2: LỊCH TRÌNH (TRIP - TOUR GUIDE) */}
      {activeTab === "trip" && (
        <section className="inner-page trip-page">
          <div className="inner-page__intro">
            <h1>{t.tripPageTitle1}<br /><em>{t.tripPageTitle2}</em></h1>
            <p>{t.tripPageDesc}</p>
          </div>

          <div className="builder-layout">
            <aside className="builder-card">
              <span className="builder-card__step">{t.tripControllerTitle}</span>
              <h2>{t.tripCustomize}</h2>

              {/* 1. CHỌN TỈNH */}
              <div className="builder-group">
                <label>{t.tripStep1}</label>
                <div className="region-pill-group">
                  {[
                    { id: "Tất cả", label: t.tripCombine3 },
                    { id: "Phú Thọ", label: "🏛️ " + t.provPhuTho },
                    { id: "Vĩnh Phúc", label: "☁️ " + t.provVinhPhuc },
                    { id: "Hòa Bình", label: "🌲 " + t.provHoaBinh },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`region-pill ${tripRegion === r.id ? "is-active" : ""}`}
                      onClick={() => {
                        setTripRegion(r.id);
                        setTripDistrict("Tất cả");
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CHỌN HUYỆN & HƯỚNG DẪN ĐƯỜNG */}
              <div className="builder-group">
                <label>{t.tripStep2}</label>
                <select
                  value={tripDistrict}
                  onChange={(event) => setTripDistrict(event.target.value)}
                  className="district-select"
                >
                  <option value="Tất cả">{t.tripAllDistricts}</option>
                  {availableDistricts.filter((d) => d !== "Tất cả").map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {activeDistrictGuide && (
                  <div className="district-travel-tip">
                    <div className="district-travel-tip__head">
                      <span>{t.tripDirectionGuide} <b>{activeDistrictGuide.district}</b></span>
                      <small>{activeDistrictGuide.region}</small>
                    </div>
                    <div className="district-travel-tip__metrics">
                      <span>📏 <b>{activeDistrictGuide.distanceFromHanoi}</b></span>
                      <span>⏱ <b>{activeDistrictGuide.travelTime}</b></span>
                      <span>🚗 <b>{activeDistrictGuide.recommendedTransport}</b></span>
                    </div>
                    <p className="district-travel-tip__route">
                      <strong>{t.tripRecommendedRoute}</strong> {activeDistrictGuide.bestRoutes}
                    </p>
                    <p className="district-travel-tip__foods">
                      <strong>{t.tripSignatureFoods}</strong> {activeDistrictGuide.signatureFoods.join(" · ")}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. GHÉP CÁC ĐIỂM THAM QUAN */}
              <div className="builder-group">
                <div className="group-header">
                  <label>{t.tripStep3}</label>
                  <span className="count-tag">{t.tripSelected} <b>{selectedPlaceIds.length}</b> {t.tripPoints}</span>
                </div>

                <div className="quick-combo-bar">
                  <small>{t.tripSuggestedCombos}</small>
                  <div className="quick-combo-chips">
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Cội Nguồn & Khoáng Nóng", ["den-hung", "hung-lo", "thanh-thuy"], 2)}
                    >
                      <span>🏛️ {t.comboTour1}</span>
                      <b>{formatDaysNights(2, currentLang)} →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Mây Núi 2 Tỉnh", ["tam-dao", "tay-thien", "ban-lac-mai-chau"], 2)}
                    >
                      <span>☁️ {t.comboTour2}</span>
                      <b>{formatDaysNights(2, currentLang)} →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Suối Khoáng 2 Tỉnh", ["thanh-thuy", "khoang-nong-kim-boi"], 2)}
                    >
                      <span>♨️ {t.comboTour3}</span>
                      <b>{formatDaysNights(2, currentLang)} →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Đại Hành Trình 3 Tỉnh", ["den-hung", "tam-dao", "ban-lac-mai-chau", "khoang-nong-kim-boi"], 3)}
                    >
                      <span>✨ {t.comboTour4}</span>
                      <b>{formatDaysNights(3, currentLang)} →</b>
                    </button>
                  </div>
                </div>

                <div className="place-check-grid">
                  {availablePlacesForSelection.map((p) => {
                    const isChecked = selectedPlaceIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        className={`place-check-card ${isChecked ? "is-checked" : ""}`}
                        onClick={() => togglePlaceSelection(p.id)}
                        aria-pressed={isChecked}
                      >
                        <div className="place-check-card__box">
                          <span>{isChecked ? "✓" : "+"}</span>
                        </div>
                        <img src={p.image} alt={p.name} className="place-check-card__thumb" loading="lazy" onError={handleImageError} />
                        <div className="place-check-card__meta">
                          <b>{p.shortName}</b>
                          <small>{p.district} · {getCategoryLabel(p.category, t)}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {availablePlacesForSelection.length > 0 && (
                  <div className="place-check-actions">
                    <button type="button" onClick={selectAllFilteredPlaces} className="link-btn">
                      {t.tripAddAll} ({availablePlacesForSelection.length} {t.tripPoints})
                    </button>
                    {selectedPlaceIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlaceIds([availablePlacesForSelection[0]?.id || "den-hung"])}
                        className="link-btn link-btn--danger"
                      >
                        {t.tripReset}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 4. SỐ NGÀY ĐI - INTERACTIVE STEPPER (+ / -) */}
              <div className="builder-group">
                <div className="group-header">
                  <label>{t.tripStep4}</label>
                  <span className="stepper-badge">{days} {t.tripDays} {days > 1 ? `${days - 1} ${t.tripNights}` : t.tripDayTrip}</span>
                </div>
                <div className="stepper-control">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setDays(Math.max(1, days - 1))}
                    disabled={days <= 1}
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="stepper-value"><b>{days}</b> <small>{t.tripDays}</small></span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setDays(Math.min(7, days + 1))}
                    disabled={days >= 7}
                    aria-label="+"
                  >
                    ＋
                  </button>
                </div>
                <div className="quick-stepper-chips">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={`quick-step-chip ${days === d ? "is-active" : ""}`}
                      onClick={() => setDays(d)}
                    >
                      {formatDaysNights(d, currentLang)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. SỐ LƯỢNG KHÁCH - INTERACTIVE STEPPER (+ / -) */}
              <div className="builder-group">
                <div className="group-header">
                  <label>{t.tripStep5}</label>
                  <span className="stepper-badge">{travelers} {t.tripPerson}</span>
                </div>
                <div className="stepper-control">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="stepper-value"><b>{travelers}</b> <small>{t.tripGuests}</small></span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setTravelers(Math.min(30, travelers + 1))}
                    disabled={travelers >= 30}
                    aria-label="+"
                  >
                    ＋
                  </button>
                </div>
                <div className="quick-stepper-chips">
                  {[
                    { count: 1, label: `1 ${t.tripPerson}` },
                    { count: 2, label: `2 ${t.tripPerson} (${t.tripCouple})` },
                    { count: 4, label: `4 ${t.tripPerson} (${t.tripFamily})` },
                    { count: 8, label: `8+ (${t.tripGroup})` },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.count}
                      className={`quick-step-chip ${travelers === item.count ? "is-active" : ""}`}
                      onClick={() => setTravelers(item.count)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. TIÊU CHUẨN NGÂN SÁCH CÓ CON SỐ CỤ THỂ */}
              <div className="builder-group">
                <label>{t.tripStep6}</label>
                <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                  <option value="Tiết kiệm (~500.000đ/ngày)">{t.tripBudgetEcon}</option>
                  <option value="Tiêu chuẩn (~1.000.000đ/ngày)">{t.tripBudgetStd}</option>
                  <option value="Cao cấp / Nghỉ dưỡng (~2.000.000đ/ngày)">{t.tripBudgetPrem}</option>
                </select>
              </div>

              {/* 7. PHƯƠNG TIỆN */}
              <div className="builder-group">
                <label>{t.tripStep7}</label>
                <select value={transport} onChange={(event) => setTransport(event.target.value)}>
                  <option value="Ô tô riêng">{t.tripCar}</option>
                  <option value="Xe máy">{t.tripMotorbike}</option>
                  <option value="Limousine / Xe khách">{t.tripLimousine}</option>
                  <option value="Taxi / xe hợp đồng">{t.tripTaxi}</option>
                </select>
              </div>

              {/* 8. PHONG CÁCH */}
              <div className="builder-group">
                <label>{t.tripStep8}</label>
                <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                  <option value="Văn hóa & cội nguồn">{t.tripStyleCulture}</option>
                  <option value="Nghỉ dưỡng khoáng nóng & Onsen">{t.tripStyleSpa}</option>
                  <option value="Phượt & săn mây sinh thái">{t.tripStyleAdventure}</option>
                  <option value="Gia đình có trẻ nhỏ/người cao tuổi">{t.tripStyleFamily}</option>
                  <option value="Ẩm thực bản địa">{t.tripStyleFood}</option>
                </select>
              </div>

              <button className="button button--dark button--full" onClick={handleGenerateItinerary}>
                ✦ {t.tripGenerateBtn} ({selectedPlaceIds.length} {t.tripPoints} · {days} {t.tripDays})
              </button>
              <small className="builder-note">{t.tripGenerateNote}</small>
            </aside>

            {/* PLAN RESULT PANEL */}
            <div className="plan-panel">
              <div className="guide-header-card">
                <div className="guide-header-card__top">
                  <div>
                    <div className="guide-header-card__meta">
                      <span>{getRegionLabel(generatedItinerary.region, t)}</span>
                      <span>{generatedItinerary.durationDays} {t.tripDayLabel}</span>
                      <span>{getStyleLabel(generatedItinerary.style, t)}</span>
                    </div>
                    <h2>{getLocalizedItineraryTitle(generatedItinerary, currentLang, t)}</h2>
                    <p>{getLocalizedItinerarySubtitle(generatedItinerary, currentLang, t)}</p>
                  </div>
                </div>

                <div className="guide-stat-grid">
                  <div className="guide-stat-item">
                    <small>{t.tripStatDistance}</small>
                    <b>~{generatedItinerary.totalDistanceKm} km</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>{t.tripStatDriveTime}</small>
                    <b>{getLocalizedDriveTime(generatedItinerary.totalDriveTime, currentLang)}</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>{t.tripStatTransport}</small>
                    <b>{getTransportLabel(generatedItinerary.transport, t)}</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>{t.tripStatCost}</small>
                    <b>{formatMoney(generatedItinerary.estimatedCostPerPerson)}</b>
                  </div>
                </div>

                {/* AUDIO GUIDE PLAYER WITH BILINGUAL & VOICE SWITCHER */}
                <div className="audio-controller-bar">
                  <div className="audio-controller-head">
                    <button
                      type="button"
                      className={`audio-play-btn ${audioGuidePlaying ? "is-playing" : ""}`}
                      onClick={toggleItineraryAudio}
                    >
                      <span>{audioGuidePlaying ? t.audioPause : t.audioListen}</span>
                    </button>
                    {audioGuidePlaying && (
                      <button type="button" className="audio-stop-btn" onClick={stopAllAudio}>■ {t.audioStop}</button>
                    )}

                    {/* Language Switcher */}
                    <div className="audio-lang-switcher" role="group" aria-label="Chọn ngôn ngữ thuyết minh">
                      <button
                        type="button"
                        className={`audio-lang-btn ${audioLang === "vi" ? "is-active" : ""}`}
                        onClick={() => {
                          stopAllAudio();
                          setAudioLang("vi");
                          setSelectedVoiceURI("ai-female-north");
                        }}
                      >
                        🇻🇳 Tiếng Việt
                      </button>
                      <button
                        type="button"
                        className={`audio-lang-btn ${audioLang === "en" ? "is-active" : ""}`}
                        onClick={() => {
                          stopAllAudio();
                          setAudioLang("en");
                          setSelectedVoiceURI("ai-en-us");
                        }}
                      >
                        🇬🇧 English
                      </button>
                    </div>
                  </div>

                  {/* Voice Selector, Volume Slider & Speed Controls */}
                  <div className="audio-settings-strip">
                    <div className="audio-voice-control">
                      <label htmlFor="voice-select">🗣️ {t.audioVoiceLabel}</label>
                      <select
                        id="voice-select"
                        className="audio-voice-select"
                        value={selectedVoiceURI}
                        onChange={(e) => {
                          setSelectedVoiceURI(e.target.value);
                          if (audioGuidePlaying) stopAllAudio();
                        }}
                      >
                        {voiceOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="audio-volume-control">
                      <span>🔊 {t.audioVolumeLabel}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={audioVolume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setAudioVolume(v);
                          if (speechRef.current) speechRef.current.volume = v;
                        }}
                        title={`${t.audioVolumeLabel} ${Math.round(audioVolume * 100)}%`}
                        aria-label={t.audioVolumeLabel}
                      />
                      <small>{Math.round(audioVolume * 100)}%</small>
                    </div>

                    <div className="audio-rate-control">
                      <span>{t.audioSpeedLabel}</span>
                      <div className="audio-rate-pills">
                        {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5].map((r) => (
                          <button
                            type="button"
                            key={r}
                            className={`rate-btn ${audioRate === r ? "is-active" : ""}`}
                            onClick={() => {
                              setAudioRate(r);
                              if (htmlAudioRef.current) htmlAudioRef.current.playbackRate = r;
                              if (speechRef.current) speechRef.current.rate = r;
                            }}
                          >
                            {r}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BAR */}
                <div className="guide-action-bar">
                  <a className="guide-action-btn" href={generatedItinerary.googleMapsUrl} target="_blank" rel="noreferrer">
                    {t.tripViewGoogleMaps}
                  </a>
                  <button className="guide-action-btn" onClick={() => window.print()}>
                    {t.tripPrintPdf}
                  </button>
                  <button className="guide-action-btn" onClick={sharePlan}>
                    {t.tripShare}
                  </button>
                  <button className="guide-action-btn" onClick={savePlan}>
                    {t.tripSaveNotebook}
                  </button>
                </div>

                <div className="guide-tips-box">
                  <b>{t.tripGuideTips}</b> {generatedItinerary.routeAdvice}
                  <br />
                  <b>{t.tripSafetyTips}</b> {generatedItinerary.cautionAdvice}
                </div>
              </div>

              {/* TIMELINE DAYS */}
              {generatedItinerary.days.map((dayPlan) => (
                <div className="timeline-day" key={dayPlan.dayNumber}>
                  <div className="timeline-day__header">
                    <div className="timeline-day__header-title">
                      <span className="timeline-day-pill">{t.tripDayLabel} {dayPlan.dayNumber}</span>
                      <h3>{dayPlan.dayTitle}</h3>
                    </div>
                    <span className="timeline-day__distance">{t.tripDayRoute} ~{dayPlan.dayDistanceKm} km ({t.tripDayLabel} {dayPlan.dayNumber})</span>
                  </div>

                  <div className="timeline-slots">
                    {dayPlan.slots.map((slot, sIdx) => {
                      const periodKey = slot.period.toLowerCase();
                      const tagModifier = periodKey.includes("sáng")
                        ? "sang"
                        : periodKey.includes("trưa")
                        ? "trua"
                        : periodKey.includes("chiều")
                        ? "chieu"
                        : "toi";

                      return (
                        <div className="slot-item" key={sIdx}>
                          <div className="slot-sidebar">
                            <span className={`slot-period-tag slot-period-tag--${tagModifier}`}>{getPeriodLabel(slot.period, t)}</span>
                            <span className="slot-time">{slot.timeSlot}</span>
                          </div>

                          <div className="slot-main">
                            <div className="slot-main__title">
                              <h4>{slot.title}</h4>
                              <span className="slot-cost">{formatMoney(slot.estimatedCostPerPerson)}/{t.tripPerson}</span>
                            </div>

                            {/* TRANSPORT TIP */}
                            <div className="slot-transport-strip">
                              <span>🚗</span>
                              <div>
                                <b>{t.tripTransportLabel}</b> {slot.transportAdvice}
                              </div>
                            </div>

                            {/* 4-ELEMENT DETAIL GRID */}
                            <div className="slot-detail-grid">
                              <div className="slot-detail-box">
                                <small>{t.slotWhereSightsee}</small>
                                <p>
                                  <b>{slot.activity}</b>
                                  {slot.place && (
                                    <>
                                      <br />
                                      <span>{t.slotDestination} <b>{slot.place.name}</b> ({slot.place.location})</span>
                                      <br />
                                      <span>{t.slotHighlights} {slot.place.highlights.slice(0, 3).join(" · ")}</span>
                                    </>
                                  )}
                                </p>
                              </div>

                              <div className="slot-detail-box">
                                <small>{t.slotWhereDine}</small>
                                <p>
                                  {slot.restaurant ? (
                                    <>
                                      <b>{slot.restaurant.name}</b> ({slot.restaurant.type})
                                      <br />
                                      <span>{t.slotSpecialtyMenu} {slot.restaurant.note}</span>
                                      <br />
                                      <small style={{ color: "var(--muted)" }}>{slot.restaurant.address} · {slot.restaurant.hours}</small>
                                    </>
                                  ) : (
                                    <span>{t.slotFreeDine}</span>
                                  )}
                                </p>
                              </div>

                              {slot.stay && (
                                <div className="slot-detail-box">
                                  <small>{t.slotWhereStay}</small>
                                  <p>
                                    <b>{slot.stay.name}</b> ({slot.stay.type})
                                    <br />
                                    <span>{t.slotAmenities} {slot.stay.note}</span>
                                    <br />
                                    <small style={{ color: "var(--muted)" }}>{t.addressLabel} {slot.stay.address}</small>
                                  </p>
                                </div>
                              )}
                            </div>

                            {slot.highlightNote && (
                              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                                💬 {t.slotGuideAdvice} {slot.highlightNote}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* QUICK TOUR TEMPLATES */}
              <div className="tour-template-section">
                <div className="tour-template-section__heading">
                  <div>
                    <span className="kicker">{t.tripSuggestedToursTitle}</span>
                    <h2 style={{ fontSize: "20px", margin: "4px 0" }}>{t.tripSuggestedToursDesc}</h2>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>{t.applyTourHint}</span>
                </div>

                <div className="tour-template-grid">
                  {tourTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      className="tour-template-card"
                      onClick={() => handleApplyTourTemplate(tmpl)}
                    >
                      <div className="tour-template-card__header">
                        <span className="tour-template-badge">{getRegionLabel(tmpl.region, t)} · {getTourBadgeLabel(tmpl.badge, currentLang)}</span>
                        <span className="tour-template-duration">⏱ {formatDaysNights(tmpl.durationDays, currentLang)}</span>
                      </div>
                      <h3>{tmpl.title}</h3>
                      <p>{tmpl.summary}</p>
                      <div className="tour-template-card__footer">
                        <span>{t.tripTransportLabel} {tmpl.recommendedTransport}</span>
                        <b>{tmpl.estimatedBudgetPerPerson}</b>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 100 DIRECTORY SECTION */}
              <div className="directory-section">
                <div className="directory-header">
                  <div>
                    <span className="kicker">{t.directoryKicker}</span>
                    <h3>{t.directoryTitle}</h3>
                    <p>{t.directoryDesc}</p>
                  </div>
                  <button
                    className="button button--ghost"
                    onClick={() => setShow100Directory((prev) => !prev)}
                  >
                    {show100Directory ? t.directoryCollapse : `${t.directoryExpand} (${phuTho100Directory.length} ${t.tripPoints}) ▼`}
                  </button>
                </div>

                {show100Directory && (
                  <>
                    <div className="directory-controls">
                      <input
                        type="text"
                        className="directory-search-input"
                        placeholder={t.directorySearchPlaceholder}
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                      />
                      <select
                        className="directory-select"
                        value={directoryDistrict}
                        onChange={(e) => setDirectoryDistrict(e.target.value)}
                      >
                        {directoryDistricts.map((d) => (
                          <option key={d} value={d}>{d === "Tất cả" ? t.directoryAllDistricts : `${t.directoryDistrictPrefix} ${d}`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="directory-table-container">
                      <table className="directory-table">
                        <thead>
                          <tr>
                            <th>{t.directoryColNo}</th>
                            <th>{t.directoryColName}</th>
                            <th>{t.directoryColType}</th>
                            <th>{t.directoryColArea}</th>
                            <th>{t.directoryColFood}</th>
                            <th>{t.directoryColStay}</th>
                            <th>{t.directoryColDist}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered100Places.map((row) => (
                            <tr key={row.stt}>
                              <td><b>{row.stt}</b></td>
                              <td><b>{row.name}</b></td>
                              <td><span className="pill pill--subtle">{row.category}</span></td>
                              <td>{row.district}</td>
                              <td>{row.restaurants}</td>
                              <td>{row.stays}</td>
                              <td><small>{row.distance}</small></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: GẦN TÔI & TIỆN ÍCH (NEAR ME) */}
      {activeTab === "near" && (
        <section className="inner-page near-page">
          <div className="near-header">
            <div>
              <span className="kicker">{t.nearKicker}</span>
              <h1>{t.nearTitle1}<br /><em>{t.nearTitle2}</em></h1>
            </div>
            <div className="near-location-card">
              <span className="pulse-dot" />
              <p>
                <b>{locationMessage}</b>
                <small>{position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : t.nearAllowLocation}</small>
              </p>
              <button onClick={locate}>{position ? t.nearUpdateGPS : t.nearEnableGPS}</button>
            </div>
          </div>

          {/* SERVICE CATEGORY TABS & PROVINCE FILTER */}
          <div className="service-filters-wrapper">
            <div className="service-province-tabs">
              <span>{t.nearAreaLabel}</span>
              {["Tất cả", "Phú Thọ", "Vĩnh Phúc", "Hòa Bình"].map((prov) => (
                <button
                  key={prov}
                  className={`province-tab ${serviceProvinceFilter === prov ? "is-active" : ""}`}
                  onClick={() => setServiceProvinceFilter(prov)}
                >
                  {prov === "Tất cả" ? t.nearAll3Provinces : prov === "Phú Thọ" ? t.provPhuTho : prov === "Vĩnh Phúc" ? t.provVinhPhuc : t.provHoaBinh}
                </button>
              ))}
            </div>

            <div className="service-tabs">
              {[
                { id: "Tất cả", label: t.provAll },
                { id: "Trạm xăng", label: t.nearServiceGasStation },
                { id: "Bãi đỗ xe", label: t.nearServiceParking },
                { id: "Y tế", label: t.nearServiceMedical },
                { id: "ATM", label: t.nearServiceATM },
                { id: "Trạm sạc EV", label: t.nearServiceEV },
                { id: "Cứu hộ", label: t.nearServiceRescue },
                { id: "Điểm đến", label: t.nearServiceDestination },
                { id: "Ăn uống", label: t.nearServiceFood },
                { id: "Lưu trú", label: t.nearServiceStay },
              ].map((item) => (
                <button key={item.id} className={serviceFilter === item.id ? "is-active" : ""} onClick={() => setServiceFilter(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="near-layout">
            <div className="map-panel">
              <svg className="map-vector-bg" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eef2ef" />
                    <stop offset="50%" stopColor="#e5ece7" />
                    <stop offset="100%" stopColor="#dbe5de" />
                  </linearGradient>
                  <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(24, 51, 44, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapBgGrad)" />
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                {/* Major water bodies: Sông Lô, Sông Hồng, Sông Đà */}
                <path d="M 120 0 Q 280 180 440 260 T 800 380" fill="none" stroke="#9bbdc9" strokeWidth="14" strokeLinecap="round" opacity="0.65" />
                <path d="M 440 0 Q 430 140 440 260" fill="none" stroke="#a4c6d1" strokeWidth="10" strokeLinecap="round" opacity="0.65" />
                <path d="M 0 320 Q 260 360 440 260" fill="none" stroke="#9bbdc9" strokeWidth="12" strokeLinecap="round" opacity="0.65" />
                {/* Main highways */}
                <path d="M 0 120 L 800 310" fill="none" stroke="#d5c8ad" strokeWidth="4" strokeDasharray="8 4" opacity="0.75" />
                <path d="M 300 0 L 520 500" fill="none" stroke="#d5c8ad" strokeWidth="3" opacity="0.75" />
                {/* Territory watermark labels */}
                <text x="310" y="210" fill="#72857c" fontSize="20" fontWeight="700" letterSpacing="6" opacity="0.5">PHÚ THỌ</text>
                <text x="560" y="140" fill="#72857c" fontSize="17" fontWeight="700" letterSpacing="4" opacity="0.5">VĨNH PHÚC</text>
                <text x="240" y="420" fill="#72857c" fontSize="17" fontWeight="700" letterSpacing="4" opacity="0.5">HÒA BÌNH</text>
                {/* Confluence */}
                <circle cx="440" cy="260" r="14" fill="rgba(155, 189, 201, 0.5)" />
                <text x="445" y="250" fill="#3b6271" fontSize="10.5" fontWeight="800">Ngã Ba Bạch Hạc</text>
              </svg>
              <div className="map-pins" aria-label={t.bottomNavAria}>
                {filteredNearItems.slice(0, 30).map((item) => (
                  <button
                    key={item.id}
                    style={mapPosition(item.lat, item.lng, item.id)}
                    className={`${selectedNearItem?.id === item.id ? "is-active" : ""} map-pin--${normalizeSearch(item.type).replace(/\s+/g, "-")}`}
                    onClick={() => setSelectedNearItemId(item.id)}
                    title={`${item.type}: ${item.name}`}
                    aria-label={`${item.type}: ${item.name}`}
                  >
                    <span>{item.icon}</span>
                  </button>
                ))}
                {position && <span className="user-map-pin" style={mapPosition(position.lat, position.lng)} title={t.profileGuest}>{currentLang === "vi" ? "Bạn" : currentLang === "zh" ? "您" : currentLang === "ko" ? "나" : currentLang === "ja" ? "現在地" : "You"}</span>}
              </div>
              {selectedNearItem && (
                <div className="map-selection">
                  <span>{selectedNearItem.icon}</span>
                  <p>
                    <small>{selectedNearItem.type}{selectedNearItem.province ? ` · ${selectedNearItem.province}` : ""}</small>
                    <b>{selectedNearItem.name}</b>
                    <em>{position ? `${formatDistance(haversine(position.lat, position.lng, selectedNearItem.lat, selectedNearItem.lng))} ${t.fromYou}` : selectedNearItem.address ?? selectedNearItem.note}</em>
                  </p>
                  <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selectedNearItem.lat},${selectedNearItem.lng}`}>{t.getDirectionsBtn}</a>
                </div>
              )}
              <span className="map-credit">{t.brandSubtitle}</span>
            </div>

            <div className="service-list">
              <div className="service-list-header">
                <b>{t.serviceListTitle} ({filteredNearItems.length})</b>
                <small>{t.serviceListSub}</small>
              </div>
              {filteredNearItems.slice(0, 15).map((item) => {
                const distance = position ? formatDistance(haversine(position.lat, position.lng, item.lat, item.lng)) : "—";
                return (
                  <article key={item.id} className={selectedNearItem?.id === item.id ? "is-active" : ""}>
                    <span className="service-icon">{item.icon}</span>
                    <button className="service-main" onClick={() => setSelectedNearItemId(item.id)}>
                      <span>{item.type}{item.province ? ` · ${item.province}` : ""}</span>
                      <b>{item.name}</b>
                      <small>{item.address || item.note}</small>
                    </button>
                    <div className="service-meta">
                      <b>{distance}</b>
                      {item.phone && <a href={`tel:${item.phone}`}>{t.callNowBtn}</a>}
                      <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}>{t.getDirectionsBtn}</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="sos-strip">
            <div><span>SOS</span><p><b>{t.sosTitle}</b><small>{t.sosSub}</small></p></div>
            <div className="sos-actions">
              <a href="tel:112"><b>112</b><small>{t.sosNationalRescue}</small></a>
              <a href="tel:113"><b>113</b><small>{t.sosPolice}</small></a>
              <a href="tel:115"><b>115</b><small>{t.sosAmbulance}</small></a>
              <a href="tel:0983116116"><b>0983 116 116</b><small>{t.sosTrafficRescue}</small></a>
            </div>
          </div>

          <section className="event-calendar">
            <div className="event-calendar__intro">
              <span className="kicker">{t.festivalKicker}</span>
              <h2>{t.festivalTitle1}<br /><em>{t.festivalTitle2}</em></h2>
              <p>{t.festivalDesc}</p>
            </div>
            <div className="event-list">
              {culturalEvents.map((event) => {
                const eventPlace = event.placeId ? places.find((place) => place.id === event.placeId) : null;
                const eventI18n = EVENT_I18N[event.id]?.[currentLang];
                const eventName = eventI18n?.name || event.name;
                const eventLocation = eventI18n?.location || event.location;
                const eventSchedule = eventI18n?.schedule || event.schedule;
                const eventDesc = eventI18n?.description || event.description;
                const eventSeason = getSeasonLabel(event.season, t);
                return (
                  <article key={event.id}>
                    <span>{eventSeason}</span>
                    <div>
                      <h3>{eventName}</h3>
                      <p>{eventDesc}</p>
                      <small>⌖ {eventLocation}</small>
                    </div>
                    <aside>
                      <b>{eventSchedule}</b>
                      {event.bookingRequired && <em>{t.bookingRequired}</em>}
                      {eventPlace && <button onClick={() => openPlace(eventPlace)}>{t.openPlaceBtn}</button>}
                    </aside>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      )}

      {/* TAB 4: SỔ TAY ĐÃ LƯU (SAVED - PLACES, FOODS, ITINERARY) */}
      {activeTab === "saved" && (
        <section className="inner-page saved-page">
          <div className="inner-page__intro">
            <span className="kicker">{t.savedNotebookKicker}</span>
            <h1>{t.savedNotebookTitle1}<br /><em>{t.savedNotebookTitle2}</em></h1>
            <p>{t.savedNotebookDesc}</p>
          </div>

          {/* SUB-TABS: PLACES, FOODS, ITINERARY */}
          <div className="saved-subtabs">
            <button
              className={savedSubTab === "places" ? "is-active" : ""}
              onClick={() => setSavedSubTab("places")}
            >
              🏛️ {t.savedPlacesTab} ({favorites.length})
            </button>
            <button
              className={savedSubTab === "foods" ? "is-active" : ""}
              onClick={() => setSavedSubTab("foods")}
            >
              🍲 {t.savedFoodsTab} ({savedDishes.length})
            </button>
            <button
              className={savedSubTab === "itinerary" ? "is-active" : ""}
              onClick={() => setSavedSubTab("itinerary")}
            >
              📅 {t.savedItineraryTab} ({savedItineraryList.length})
            </button>
          </div>

          {/* 1. SAVED PLACES */}
          {savedSubTab === "places" && (
            favorites.length ? (
              <div className="place-grid saved-grid">
                {places.filter((place) => favorites.includes(place.id)).map((place) => renderPlaceCard(place))}
              </div>
            ) : (
              <div className="saved-empty">
                <span>♡</span>
                <h2>{t.savedPlacesEmpty}</h2>
                <p>{t.savedPlacesEmptyDesc}</p>
                <button className="button button--dark" onClick={() => setActiveTab("explore")}>{t.explore} →</button>
              </div>
            )
          )}

          {/* 2. SAVED FOODS */}
          {savedSubTab === "foods" && (
            savedDishes.length ? (
              <div className="commerce-search-results">
                {foodCatalog
                  .filter(({ dish }) => savedDishes.includes(dish.id))
                  .map(({ dish }) => renderFoodMarket(dish, "region"))}
              </div>
            ) : (
              <div className="saved-empty">
                <span>♨</span>
                <h2>{t.savedFoodsEmpty}</h2>
                <p>{t.savedFoodsEmptyDesc}</p>
                <button className="button button--dark" onClick={() => setActiveTab("explore")}>{t.nearServiceFood} →</button>
              </div>
            )
          )}

          {/* 3. SAVED ITINERARIES */}
          {savedSubTab === "itinerary" && (
            savedItineraryList.length ? (
              <div className="saved-itinerary-list">
                {savedItineraryList.map((it) => (
                  <article className="saved-itinerary-card" key={it.id}>
                    <div className="saved-itinerary-card__header">
                      <div>
                        <span className="tour-template-badge">{it.region} · {it.durationDays} {t.tripDayLabel}</span>
                        <h3>{it.title}</h3>
                        <p>{it.subtitle}</p>
                      </div>
                      <button
                        type="button"
                        className="text-link text-link--danger"
                        onClick={() => {
                          const next = savedItineraryList.filter(item => item.id !== it.id);
                          setSavedItineraryList(next);
                          window.localStorage.setItem("datto-saved-itineraries", JSON.stringify(next));
                          showToast(t.savedDeletedToast);
                        }}
                      >
                        {t.savedDeleteItinerary}
                      </button>
                    </div>
                    <div className="saved-itinerary-card__stats">
                      <span>📏 ~{it.totalDistanceKm} km</span>
                      <span>⏱ {it.totalDriveTime}</span>
                      <span>🚗 {it.transport}</span>
                      <span>💰 {formatMoney(it.estimatedCostPerPerson)}{t.savedPerGuest}</span>
                    </div>
                    <div className="saved-itinerary-card__actions">
                      <button
                        className="button button--dark"
                        onClick={() => {
                          setGeneratedItinerary(it);
                          setActiveTab("trip");
                          showToast(t.savedOpenedToast);
                        }}
                      >
                        {t.savedOpenDetail}
                      </button>
                      <a className="button button--outline" href={it.googleMapsUrl} target="_blank" rel="noreferrer">
                        {t.savedOpenGoogleMaps}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="saved-empty">
                <span>📅</span>
                <h2>{t.savedItineraryEmpty}</h2>
                <p>{t.savedItineraryEmptyDesc}</p>
                <button className="button button--dark" onClick={() => setActiveTab("trip")}>{t.savedCreateTrip}</button>
              </div>
            )
          )}
        </section>
      )}

      {/* TAB 5: PROFILE */}
      {activeTab === "profile" && (
        <section className="inner-page profile-page">
          <div className="profile-hero">
            <div className="profile-avatar">
              {authUser ? (authUser.avatar || authUser.name.slice(0, 2).toUpperCase()) : "👤"}
            </div>
            <div>
              <span>
                {authUser
                  ? authUser.role === "admin"
                    ? t.profileSystemAdmin
                    : authUser.role === "merchant"
                    ? `${t.profileMerchantOwner} ${authUser.merchantName || t.profilePartner}`
                    : t.profileCustomer
                  : t.profileNotLoggedIn}
              </span>
              <h1>{authUser ? authUser.name : t.profileGuest}</h1>
              <p>
                {authUser
                  ? `${authUser.email} · ${t.profileLoginVia} ${authUser.provider === "google" ? "Gmail (Google)" : authUser.provider === "facebook" ? "Facebook" : "Email"}`
                  : t.profileLoginPrompt}
              </p>
            </div>
            {authUser ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setAuthModalOpen(true)}>{t.profileSwitchAccount}</button>
                <button type="button" onClick={handleLogout} style={{ color: "var(--red)" }}>{t.profileLogout}</button>
              </div>
            ) : (
              <button type="button" onClick={() => setAuthModalOpen(true)} style={{ background: "var(--red)", color: "white" }}>
                {t.profileLoginNow}
              </button>
            )}
          </div>

          {/* SHOPEE-STYLE ORDER HUB (MỤC 3 GÓP Ý - THEO DÕI ĐƠN HÀNG) */}
          <div style={{ marginBottom: "20px" }}>
            {renderShopeeOrderHub("profile")}
          </div>

          <div className="profile-grid">
            <article className="passport-card">
              <span className="kicker kicker--light">{t.passportKicker}</span>
              <h2>{t.passportTitle1}<br />{t.passportTitle2}</h2>
              <div className="stamp-row">
                <span className="stamp is-earned">ĐH<small>Đền Hùng</small></span>
                <span className="stamp is-earned">TĐ<small>Tam Đảo</small></span>
                <span className="stamp">MC<small>Mai Châu</small></span>
                <span className="stamp">TT<small>Thanh Thủy</small></span>
              </div>
              <p><b>2 / 4</b> {t.passportProgress}</p>
            </article>
            <article className="booking-card">
              <span>{t.quickBookKicker}</span>
              <h2>{t.quickBookTitle}</h2>
              <button onClick={() => { setActiveTab("trip"); showToast(t.openTripAssistant); }}>
                <i>▣</i><b>{t.btnTourDesignTitle}</b><small>{t.btnTourDesignSub}</small><em>→</em>
              </button>
              <button onClick={() => { setCategory("Nghỉ dưỡng & chữa lành"); setSelectedRegion("Tất cả"); setActiveTab("explore"); showToast(t.selectResortToast); }}>
                <i>⌂</i><b>{t.btnHotelsTitle}</b><small>{t.btnHotelsSub}</small><em>→</em>
              </button>
              <button onClick={() => { setVouchersModalOpen(true); }}>
                <i>🎁</i><b>{t.btnVouchersTitle}</b><small>{t.btnVouchersSub}</small><em>→</em>
              </button>
              <button onClick={() => { setCartOpen(true); setCartDrawerTab("cart"); }}>
                <i>◇</i><b>{t.btnOcopTitle}</b><small>{t.btnOcopSub} ({cartQuantity} {t.profileItems})</small><em>→</em>
              </button>

              {/* ROLE-BASED ORDER MANAGEMENT VISIBILITY */}
              {authUser && (authUser.role === "admin" || authUser.role === "merchant") ? (
                <button
                  onClick={() => setOrdersDashboardOpen(true)}
                  style={{ background: "#f0fdf4", border: "1.5px solid #86efac" }}
                >
                  <i>📊</i>
                  <b>{t.profileOrderMgmt}</b>
                  <small>
                    {authUser.role === "admin"
                      ? `${t.profileAdminOrderDesc} (${orderList.length} ${t.profileOrdersCount})`
                      : t.profileMerchantOrderDesc}
                  </small>
                  <em>→</em>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCartDrawerTab("orders");
                    setCartOpen(true);
                  }}
                  style={{ background: "#eff6ff", border: "1.5px solid #93c5fd" }}
                >
                  <i>📦</i>
                  <b style={{ color: "#1d4ed8" }}>{t.myOrders} ({userOrderList.length} {t.profileOrdersCount})</b>
                  <small>
                    {userOrderList.length > 0
                      ? `${userOrderList.length} ${t.profileOrdersPlaced}`
                      : t.profileNoOrders}
                  </small>
                  <em>→</em>
                </button>
              )}
            </article>
            <article className="partner-card">
              <span>{t.partnerKicker}</span>
              <h2>{t.partnerTitle}</h2>
              <p>{t.partnerDesc}</p>
              <button className="button button--outline" onClick={() => showToast(t.registerPartnerToast)}>{t.btnRegisterPartner}</button>
            </article>
          </div>
        </section>
      )}

      {/* SITE FOOTER */}
      <footer className="site-footer">
        <div className="brand brand--footer">
          <span className="brand__mark">Đ</span>
          <span><strong>Đất Tổ</strong><small>{t.brandSubtitle}</small></span>
        </div>
        <p>{t.footerDesc}</p>
        <span>{t.footerLink}</span>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="bottom-nav" aria-label={t.bottomNavAria}>
        {navigation.map((item) => (
          <button key={item.id} className={activeTab === item.id ? "is-active" : ""} onClick={() => setActiveTab(item.id)}>
            <span>{item.icon}</span>{item.label}
            {item.id === "saved" && (favorites.length + savedDishes.length + savedItineraryList.length > 0) && (
              <b className="bottom-nav-dot" />
            )}
          </button>
        ))}
      </nav>

      {/* PLACE DETAIL MODAL */}
      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="place-modal" role="dialog" aria-modal="true" aria-labelledby="place-modal-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label={t.authClose || "Đóng"}>×</button>
            <div className="modal-hero">
              <img src={selected.image} alt={selected.name} onError={handleImageError} />
              <span className="modal-hero__shade" />
              <div>
                <span>{selected.category} · {selected.region} · {selected.location}</span>
                <h2 id="place-modal-title">{selected.name}</h2>
                <p><b>★ {selected.rating}</b> ({selected.reviews.toLocaleString(currentLang === "vi" ? "vi-VN" : "en-US")} {t.modalReviews}) · {t.modalPhoto} {selected.imageCredit}</p>
              </div>
              <button className={`heart-button modal-heart ${favorites.includes(selected.id) ? "is-saved" : ""}`} onClick={() => toggleFavorite(selected.id)}>
                {favorites.includes(selected.id) ? "♥" : "♡"}
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-main">
                <div className={`season-callout ${isInSeason(selected, currentMonth) ? "is-good" : "is-caution"}`}>
                  <span>{isInSeason(selected, currentMonth) ? "✓" : "!"}</span>
                  <p><b>{isInSeason(selected, currentMonth) ? `${t.modalGoodSeason} ${currentMonth}` : `${t.modalCautionSeason} ${currentMonth}`}</b><small>{selected.season}</small></p>
                </div>
                <div className="fact-row fact-row--rich">
                  <span><small>{t.modalBestTime}</small><b>{selected.bestTime}</b></span>
                  <span><small>{t.modalDuration}</small><b>{selected.duration}</b></span>
                  <span><small>{t.modalFromVietTri}</small><b>{selected.distanceFromVietTri} km · {selected.travelFromVietTri}</b></span>
                  <span><small>{t.modalEstimatedCost}</small><b>{selected.price}</b></span>
                </div>
                <p className="modal-description">{selected.description}</p>
                <div className="highlight-section">
                  <span>{t.modalHighlightsTitle}</span>
                  <div>{selected.highlights.map((highlight) => <p key={highlight}><i>✦</i>{highlight}</p>)}</div>
                </div>
                {selected.warning && <div className="travel-warning"><b>{t.modalNoticeTitle}</b><p>{selected.warning}</p></div>}
                
                {selected.transportTips && (
                  <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "14px 18px", margin: "16px 0" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.modalTransportTipsTitle}</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginTop: "8px" }}>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>{t.modalVehicleLabel}</b> {selected.transportTips.recommendedVehicle}</div>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>{t.modalRouteLabel}</b> {selected.transportTips.routeAdvice}</div>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>{t.modalCautionLabel}</b> {selected.transportTips.caution}</div>
                    </div>
                  </div>
                )}

                {/* MODAL AUDIO CONTROLLER */}
                <div className="modal-audio-box">
                  <div className="modal-actions">
                    <a className="button button--dark" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}>
                      {t.modalOpenDirections}
                    </a>
                    <button className="button button--outline" onClick={() => togglePlaceAudio(selected)}>
                      {speechPlaceId === selected.id && audioState === "playing"
                        ? `⏸ ${t.audioPause}`
                        : speechPlaceId === selected.id && audioState === "paused"
                        ? t.audioResume
                        : t.audioListen}
                    </button>
                    {speechPlaceId === selected.id && audioState !== "idle" && (
                      <button className="audio-stop" onClick={stopAllAudio}>
                        ■ {t.audioStop}
                      </button>
                    )}

                    {/* Language Switcher in Modal */}
                    <div className="audio-lang-switcher" role="group" aria-label={t.audioVoiceLabel}>
                      <button
                        type="button"
                        className={`audio-lang-btn ${audioLang === "vi" ? "is-active" : ""}`}
                        onClick={() => {
                          stopAllAudio();
                          setAudioLang("vi");
                          setSelectedVoiceURI("ai-female-north");
                        }}
                      >
                        🇻🇳 Việt
                      </button>
                      <button
                        type="button"
                        className={`audio-lang-btn ${audioLang === "en" ? "is-active" : ""}`}
                        onClick={() => {
                          stopAllAudio();
                          setAudioLang("en");
                          setSelectedVoiceURI("ai-en-us");
                        }}
                      >
                        🇬🇧 Eng
                      </button>
                    </div>
                  </div>

                  <div className="audio-settings-strip" style={{ marginTop: "10px", padding: "8px 12px", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
                    <div className="audio-voice-control">
                      <label htmlFor="modal-voice-select">{t.audioVoiceLabel}</label>
                      <select
                        id="modal-voice-select"
                        className="audio-voice-select"
                        value={selectedVoiceURI}
                        onChange={(e) => {
                          setSelectedVoiceURI(e.target.value);
                          if (speechPlaceId) stopAllAudio();
                        }}
                      >
                        {voiceOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="audio-volume-control">
                      <span>🔊 {t.audioVolumeLabel}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={audioVolume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setAudioVolume(v);
                          if (speechRef.current) speechRef.current.volume = v;
                        }}
                        aria-label="Chỉnh âm lượng"
                      />
                      <small>{Math.round(audioVolume * 100)}%</small>
                    </div>

                    <div className="audio-rate-control">
                      <span>{t.audioSpeedLabel}</span>
                      <div className="audio-rate-pills">
                        {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5].map((r) => (
                          <button
                            type="button"
                            key={r}
                            className={`rate-btn ${audioRate === r ? "is-active" : ""}`}
                            onClick={() => {
                              setAudioRate(r);
                              if (htmlAudioRef.current) htmlAudioRef.current.playbackRate = r;
                              if (speechRef.current) speechRef.current.rate = r;
                            }}
                          >
                            {r}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nearby-section">
                  <div className="nearby-tabs">
                    <button className={detailMode === "eat" ? "is-active" : ""} onClick={() => setDetailMode("eat")}>🍲 {t.detailTabFood}</button>
                    <button className={detailMode === "stay" ? "is-active" : ""} onClick={() => setDetailMode("stay")}>🏨 {t.detailTabStay}</button>
                  </div>
                  {(detailMode === "eat" ? selected.restaurants : selected.stays).map((item) => (
                    <article className="nearby-card" key={item.name}>
                      <img src={item.image} alt={`Ảnh minh họa ${item.name}`} />
                      <div className="nearby-card__content">
                        <span>{item.type}{item.rating ? ` · ★ ${item.rating} (${item.reviewCount ?? 0})` : ""}</span>
                        <b>{item.name}</b>
                        <small>{item.note}</small>
                        {item.taste && <p><strong>{t.detailTasteLabel}</strong> {item.taste}</p>}
                        <p><strong>{t.addressLabel}</strong> {item.address}</p>
                        <p><strong>{t.detailOpenHours}</strong> {item.hours}</p>
                        <div className="nearby-card__links">
                          {item.phone && <a href={`tel:${item.phone}`}>☎ {item.phone.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3")}</a>}
                          <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address}`)}`}>{t.detailViewMap}</a>
                        </div>
                        {detailMode === "eat" && item.phone && <a className="nearby-reserve-link" href={`tel:${item.phone}`}>{t.detailCallBookTable}</a>}
                        {detailMode === "stay" && <button className="stay-book-button" onClick={() => openBooking(selected, item)}>{t.detailBookRoomFrom} {formatMoney(estimatedStayPrice(item))} {t.detailPerNightUnit}</button>}
                      </div>
                      <p className="nearby-card__distance"><b>{item.distance}</b><small>{item.travelTime}</small></p>
                    </article>
                  ))}
                </div>

                <section className="community-reviews">
                  <div className="community-reviews__heading">
                    <span>{t.detailReviewKicker}</span>
                    <h3>{t.detailReviewTitle}</h3>
                  </div>
                  <form className="review-form" onSubmit={submitReview}>
                    <div className="review-form__row">
                      <label>{t.detailReviewName}<input value={reviewName} maxLength={30} onChange={(event) => setReviewName(event.target.value)} /></label>
                      <label>{t.detailReviewRating}<span className="rating-picker">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} className={rating <= reviewRating ? "is-active" : ""} onClick={() => setReviewRating(rating)}>★</button>)}</span></label>
                    </div>
                    <label>{t.detailReviewShare}<textarea value={reviewComment} maxLength={500} onChange={(event) => setReviewComment(event.target.value)} placeholder={t.detailReviewPlaceholder} /></label>
                    <div className="review-upload">
                      <label>{t.detailReviewAddPhotos}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleReviewPhotos} /></label>
                      <span>{t.detailReviewPhotoLimit}</span>
                    </div>
                    {reviewPhotos.length > 0 && <div className="review-photo-preview">{reviewPhotos.map((photo, index) => <button type="button" key={`${photo.slice(0, 32)}-${index}`} onClick={() => setReviewPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}><img src={photo} alt={`Ảnh đánh giá ${index + 1}`} /><span>×</span></button>)}</div>}
                    <button className="button button--dark" type="submit">{t.detailReviewSubmit}</button>
                  </form>
                  <div className="review-list">
                    {selectedUserReviews.length ? selectedUserReviews.map((review) => (
                      <article key={review.id}>
                        <div><span className="review-avatar">{review.name.slice(0, 1).toLocaleUpperCase("vi")}</span><p><b>{review.name}</b><small>{new Date(review.createdAt).toLocaleDateString("vi-VN")} · {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</small></p></div>
                        <p>{review.comment}</p>
                        {review.photos.length > 0 && <div className="review-photos">{review.photos.map((photo, index) => <img key={`${review.id}-${index}`} src={photo} alt={`Ảnh của ${review.name}`} />)}</div>}
                      </article>
                    )) : <div className="review-empty">{t.detailReviewEmpty}</div>}
                  </div>
                </section>
              </div>
              <aside className="modal-map">
                <iframe title={`Bản đồ ${selected.name}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.035}%2C${selected.lat - 0.025}%2C${selected.lng + 0.035}%2C${selected.lat + 0.025}&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`} loading="lazy" />
                <div><span>⌖</span><p><b>{selected.location}</b><small>{position ? `${formatDistance(haversine(position.lat, position.lng, selected.lat, selected.lng))} · ${estimateTravel(haversine(position.lat, position.lng, selected.lat, selected.lng))} ${t.fromYou}` : `${selected.distanceFromVietTri} km · ${selected.travelFromVietTri} ${t.fromVietTri}`}</small></p></div>
              </aside>
            </div>
          </section>
        </div>
      )}

      {/* COMMERCE / CART & MY ORDERS DRAWER */}
      {cartOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <div className="commerce-drawer" role="dialog" aria-labelledby="commerce-drawer-title">
            <div className="commerce-drawer__heading">
              <div>
                <span>{t.cart.toUpperCase()} & ĐƠN HÀNG OCOP</span>
                <h2 id="commerce-drawer-title">Đặc Sản & Mua Sắm</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">×</button>
            </div>

            {/* Top 2 Tabs: Giỏ hàng vs Đơn mua */}
            <div className="auth-tab-switch" style={{ margin: "14px 0 18px" }}>
              <button
                type="button"
                className={`auth-tab-btn ${cartDrawerTab === "cart" ? "is-active" : ""}`}
                onClick={() => setCartDrawerTab("cart")}
              >
                🛒 {t.cart} ({cartQuantity})
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${cartDrawerTab === "orders" ? "is-active" : ""}`}
                onClick={() => setCartDrawerTab("orders")}
              >
                📦 {t.myOrders} ({userOrderList.length})
              </button>
            </div>

            {/* TAB 1: CART ITEMS & CHECKOUT */}
            {cartDrawerTab === "cart" && (
              <form onSubmit={submitDemoOrder}>
                {cartDetails.length === 0 ? (
                  <div className="cart-empty-state">
                    <span>🛒</span>
                    <h3>{t.cartEmptyTitle}</h3>
                    <p>{t.cartEmptyDesc}</p>
                    <button type="button" className="button button--dark" onClick={() => { setCartOpen(false); goToFoodSection(); }}>
                      {t.viewSpecialtiesBtn}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-lines">
                      {cartDetails.map((line) => (
                        <article key={`${line.dishId}-${line.sellerId}`}>
                          <img src={line.dish.image} alt="" onError={handleImageError} />
                          <div>
                            <b>{line.dish.name}</b>
                            <small>{line.seller.name}</small>
                            <span>{formatPrice(line.seller.price)}/{line.seller.unit}</span>
                          </div>
                          <div className="quantity-picker">
                            <button type="button" onClick={() => changeCartQuantity(line.dishId, line.sellerId, -1)}>−</button>
                            <b>{line.quantity}</b>
                            <button type="button" onClick={() => changeCartQuantity(line.dishId, line.sellerId, 1)}>＋</button>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* VOUCHER / PROMOTION BLOCK */}
                    <div style={{ background: "#fff8f6", border: "1.5px dashed #e39d91", borderRadius: "10px", padding: "12px 14px", margin: "14px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--red)", display: "flex", alignItems: "center", gap: "5px" }}>
                          🎁 {t.voucherPromotionsTitle}
                        </span>
                        <button
                          type="button"
                          className="text-link"
                          style={{ fontSize: "11px", color: "var(--red)" }}
                          onClick={() => setVouchersModalOpen(true)}
                        >
                          {t.chooseOtherVoucherBtn}
                        </button>
                      </div>

                      {appliedVoucher ? (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "8px 10px", borderRadius: "6px", border: "1px solid #f0b5ab" }}>
                          <div>
                            <span className="voucher-code-badge">{appliedVoucher.code}</span>
                            <small style={{ marginLeft: "8px", color: "var(--ink)", fontWeight: "700" }}>{appliedVoucher.title}</small>
                          </div>
                          <button
                            type="button"
                            style={{ border: 0, background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: "12px" }}
                            onClick={() => setAppliedVoucherCode(null)}
                            title={t.removeVoucherTitle}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input
                            type="text"
                            placeholder={t.voucherInputPlaceholder}
                            id="voucher-input-cart"
                            style={{ flex: 1, height: "36px", padding: "0 10px", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "12px", textTransform: "uppercase" }}
                          />
                          <button
                            type="button"
                            className="button button--dark"
                            style={{ minHeight: "36px", padding: "0 12px", fontSize: "11px" }}
                            onClick={() => {
                              const el = document.getElementById("voucher-input-cart") as HTMLInputElement;
                              const code = el?.value?.trim().toUpperCase();
                              const v = DEFAULT_VOUCHERS.find(item => item.code === code);
                              if (v) {
                                setAppliedVoucherCode(v.code);
                                showToast(`Đã áp dụng mã ${v.code} (${v.title})!`);
                              } else {
                                showToast("Mã giảm giá không hợp lệ hoặc đã hết hạn");
                              }
                            }}
                          >
                            {t.applyVoucherBtn}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* CURRENCY SELECTOR */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8faf9", border: "1px solid var(--line)", borderRadius: "8px", padding: "8px 12px", margin: "10px 0" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                        💱 {t.currencyLabel}
                      </span>
                      <div className="i18n-dropdown-container">
                        <button
                          type="button"
                          className="currency-pill-btn"
                          style={{ height: "30px", padding: "0 10px", fontSize: "11.5px", background: "white" }}
                          onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                          title="Đổi loại tiền tệ thanh toán"
                        >
                          <span>{CURRENCIES[currentCurrency].flag}</span>
                          <b>{currentCurrency} ({CURRENCIES[currentCurrency].symbol})</b>
                          <small>▾</small>
                        </button>
                        {currencyDropdownOpen && (
                          <div className="i18n-dropdown-menu" style={{ right: 0, left: "auto", top: "calc(100% + 4px)", minWidth: "170px" }}>
                            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                              <button
                                key={code}
                                type="button"
                                className={`i18n-dropdown-item ${currentCurrency === code ? "is-selected" : ""}`}
                                onClick={() => {
                                  setCurrentCurrency(code);
                                  setCurrencyDropdownOpen(false);
                                  showToast(`Đã chuyển tiền tệ sang ${CURRENCIES[code].label}`);
                                }}
                              >
                                <span>{CURRENCIES[code].flag} {CURRENCIES[code].label}</span>
                                {currentCurrency === code && <span>✓</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COMMERCE TOTAL WITH CURRENCY CONVERSION */}
                    <div className="commerce-total">
                      <span>{t.subtotalLabel} ({cartQuantity} {t.profileItems})</span>
                      <b>{formatPrice(cartSubtotal)}</b>
                      {voucherDiscount > 0 && (
                        <>
                          <span style={{ color: "var(--red)" }}>{t.discountVoucherLabel} ({appliedVoucher?.code})</span>
                          <b style={{ color: "var(--red)" }}>−{formatPrice(voucherDiscount)}</b>
                        </>
                      )}
                      <span style={{ fontWeight: "900", fontSize: "14px", marginTop: "4px" }}>{t.totalPayment} ({currentCurrency})</span>
                      <b style={{ color: "var(--red)", fontSize: "20px", marginTop: "4px" }}>{formatPrice(finalCartTotal)}</b>
                    </div>

                    {/* PAYMENT METHODS SELECTOR */}
                    <div style={{ margin: "16px 0 10px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink)", marginBottom: "8px" }}>
                        💳 {t.paymentMethods}
                      </label>
                      <div className="payment-methods-grid">
                        {PAYMENT_METHODS.map((method) => (
                          <div
                            key={method.id}
                            className={`payment-method-card ${paymentMethod === method.id ? "is-selected" : ""}`}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <span className="payment-method-icon">{method.icon}</span>
                            <div className="payment-method-text">
                              <b>{method.label}</b>
                              <small>{method.desc}</small>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* VietQR Quick Scan Box */}
                      {paymentMethod === "vietqr" && (
                        <div className="vietqr-box">
                          <span className="heritage-gold-tag" style={{ marginBottom: "8px", display: "inline-block" }}>
                            VIETQR CHUYỂN KHOẢN TỰ ĐỘNG
                          </span>
                          <p style={{ margin: "4px 0 10px", fontSize: "11.5px", color: "var(--muted)" }}>
                            Quét mã bằng app ngân hàng bất kỳ để thanh toán an toàn
                          </p>
                          <div className="vietqr-mock-qr">
                            <img
                              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=2026-DATTO-TRAVEL-PAYMENT"
                              alt="Mã VietQR"
                              style={{ width: "135px", height: "135px", objectFit: "contain" }}
                            />
                          </div>
                          <div className="vietqr-bank-details">
                            <div>🏦 <b>Ngân hàng:</b> MB Bank / Vietcombank</div>
                            <div>🔢 <b>Số tài khoản:</b> 09123456789 (Đất Tổ Travel)</div>
                            <div>💰 <b>Số tiền:</b> {formatPrice(finalCartTotal)}</div>
                            <div>📝 <b>Nội dung:</b> DT-{checkoutPhone.slice(-4) || "OCOP"}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AUTH GATE OR USER STATUS IN CART */}
                    {!authUser ? (
                      <div className="cart-auth-gate">
                        <div className="cart-auth-gate__header">
                          <span className="cart-auth-gate__icon">🔒</span>
                          <div>
                            <b>{t.authRequiredOrderTitle}</b>
                            <p>{t.authRequiredOrderDesc}</p>
                          </div>
                        </div>

                        <div className="auth-social-buttons">
                          <button
                            type="button"
                            className="auth-btn auth-btn--google"
                            onClick={() => setGoogleOAuthModalOpen(true)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/></svg>
                            {t.loginGoogle}
                          </button>
                          <button
                            type="button"
                            className="auth-btn auth-btn--facebook"
                            onClick={handleFacebookLogin}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            {t.loginFacebook}
                          </button>
                        </div>

                        <button
                          type="button"
                          className="text-link"
                          style={{ fontSize: "12px", marginTop: "4px" }}
                          onClick={() => {
                            setAuthModalTab("admin");
                            setAuthModalOpen(true);
                          }}
                        >
                          {t.loginAdminLink}
                        </button>
                      </div>
                    ) : (
                      <div className="cart-user-badge">
                        <div>
                          <span>👤 {t.orderAccountLabel}</span>
                          <b>{authUser.name} ({authUser.email})</b>
                          <span className="pill pill--subtle" style={{ marginTop: "2px", display: "inline-block" }}>
                            {authUser.role === "admin" ? "🛡️ Quản trị viên" : authUser.role === "merchant" ? `🏪 Chủ cơ sở: ${authUser.merchantName}` : "👤 Du khách"}
                          </span>
                        </div>
                        <button type="button" className="text-link" onClick={() => setAuthModalOpen(true)}>{t.changeAccountBtn}</button>
                      </div>
                    )}

                    <div className="commerce-form-fields" style={{ opacity: authUser ? 1 : 0.6, pointerEvents: authUser ? "auto" : "none" }}>
                      <label className="commerce-field">
                        {t.fullNameLabel} <small style={{ color: "red" }}>*</small>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(event) => setCheckoutName(event.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn An"
                        />
                      </label>

                      <label className="commerce-field">
                        {t.phoneNumberLabel} <small style={{ color: "red" }}>*</small>
                        <input
                          type="tel"
                          inputMode="tel"
                          required
                          value={checkoutPhone}
                          onChange={(event) => setCheckoutPhone(event.target.value)}
                          placeholder="Ví dụ: 0912 345 678"
                        />
                      </label>

                      <label className="commerce-field">
                        {t.shippingAddressLabel}
                        <input
                          type="text"
                          value={checkoutAddress}
                          onChange={(event) => setCheckoutAddress(event.target.value)}
                          placeholder="Ví dụ: Khách sạn Mường Thanh Phú Thọ, Phòng 502"
                        />
                      </label>

                      <label className="commerce-field">
                        {t.orderNoteLabel}
                        <input
                          type="text"
                          value={checkoutNote}
                          onChange={(event) => setCheckoutNote(event.target.value)}
                          placeholder={t.orderNotePlaceholder}
                        />
                      </label>
                    </div>

                    {authUser ? (
                      <button className="button button--dark button--full" type="submit">
                        {t.confirmOrderBtn} ({formatPrice(finalCartTotal)}) →
                      </button>
                    ) : (
                      <button
                        className="button button--dark button--full"
                        type="button"
                        onClick={() => setAuthModalOpen(true)}
                      >
                        {t.loginToCompleteOrder}
                      </button>
                    )}
                  </>
                )}
              </form>
            )}

            {/* TAB 2: MY ORDERS WITH SHOPEE-STYLE STATUS TABS */}
            {cartDrawerTab === "orders" && (
              <div>
                {/* Shopee-style Order Hub */}
                <div style={{ marginBottom: "14px" }}>
                  {renderShopeeOrderHub("drawer")}
                </div>

                {/* Filtered Order Cards */}
                {userOrderList.filter((o) => filterOrderByStatus(o, orderStatusTab)).length === 0 ? (
                  <div className="orders-empty-state" style={{ padding: "30px 10px" }}>
                    <span style={{ fontSize: "36px" }}>📦</span>
                    <h3 style={{ fontSize: "16px" }}>{t.noOrdersInStatus}</h3>
                    <p style={{ fontSize: "12px" }}>{t.noOrdersInStatusDesc}</p>
                  </div>
                ) : (
                  <div className="customer-order-cards">
                    {userOrderList.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                        <button
                          type="button"
                          onClick={clearMyOrders}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            fontSize: "11px",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          🗑️ {t.clearOrderHistoryBtn}
                        </button>
                      </div>
                    )}
                    {userOrderList
                      .filter((o) => filterOrderByStatus(o, orderStatusTab))
                      .map((order: any) => {
                        const isPending = !order.status || order.status === "Chờ xác nhận";
                        const isCancelled = order.status === "Đã hủy";
                        const isCompleted = order.status === "Hoàn thành" || order.status === "Đã giao";

                        return (
                          <article key={order.id} className="customer-order-card">
                            <div className="customer-order-top">
                              <div>
                                <span className={`status-badge ${isPending ? "status-badge--pending" : isCancelled ? "status-badge--cancelled" : isCompleted ? "status-badge--completed" : "status-badge--confirmed"}`}>
                                  {isPending ? "⏳ Chờ xác nhận" : isCancelled ? "✕ Đã hủy" : isCompleted ? "✓ Hoàn thành" : "⚡ Đang xử lý"}
                                </span>
                                <b>{t.orderNumberLabel} #{order.id}</b>
                                <small>🕒 {order.createdAt} · 💳 {order.paymentMethod || "VietQR"}</small>
                              </div>
                              <b style={{ color: "var(--red)", fontSize: "16px" }}>
                                {formatPrice(Number(order.totalAmount || 0))}
                              </b>
                            </div>

                            <div className="customer-order-body">
                              <p><b>Địa chỉ:</b> {order.address}</p>
                              {order.appliedVoucher && (
                                <p style={{ color: "var(--red)", fontSize: "11.5px" }}>🎁 <b>Ưu đãi:</b> {order.appliedVoucher}</p>
                              )}
                              <div className="customer-order-items">
                                {(order.items || []).map((it: any, i: number) => (
                                  <div key={i} className="customer-order-item-row">
                                    <span>• {it.dishName} (×{it.quantity})</span>
                                    <span className="pill pill--subtle">{it.sellerName}</span>
                                  </div>
                                ))}
                              </div>

                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed var(--line)" }}>
                                {isPending && (
                                  <button
                                    type="button"
                                    className="button button--outline"
                                    style={{ minHeight: "32px", padding: "0 10px", fontSize: "11px", color: "var(--red)", borderColor: "#f0b5ab" }}
                                    onClick={() => cancelOrder(order.id)}
                                  >
                                    {t.cancelOrderBtn}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="button button--dark"
                                  style={{ minHeight: "32px", padding: "0 12px", fontSize: "11px" }}
                                  onClick={() => reorderItems(order)}
                                >
                                  {t.reorderBtn}
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOOKING DIALOG */}
      {bookingOffer && (
        <div className="commerce-overlay booking-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOffer(null); }}>
          <form className="booking-dialog" onSubmit={submitBookingRequest}>
            <button className="booking-dialog__close" type="button" onClick={() => setBookingOffer(null)} aria-label={t.authClose || "Đóng"}>×</button>
            <span>{t.bookingStayRequest}</span>
            <h2>{bookingOffer.stay.name}</h2>
            <p>{bookingOffer.stay.address}</p>
            
            <div className="booking-price">
              <span>{t.priceFromLabel}</span>
              <b>{formatMoney(estimatedStayPrice(bookingOffer.stay))}<small>/đêm</small></b>
            </div>

            <div className="booking-fields">
              <label>
                {t.bookingRepName} <small style={{ color: "red" }}>*</small>
                <input
                  type="text"
                  required
                  value={bookingName}
                  onChange={(event) => setBookingName(event.target.value)}
                  placeholder="Ví dụ: Trần Thị Mai"
                />
              </label>

              <label>
                {t.phoneNumberLabel} <small style={{ color: "red" }}>*</small>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  value={bookingPhone}
                  onChange={(event) => setBookingPhone(event.target.value)}
                  placeholder="Số điện thoại nhận xác nhận"
                />
              </label>

              <label>
                {t.checkInDate} <small style={{ color: "red" }}>*</small>
                <input
                  type="date"
                  required
                  value={bookingCheckIn}
                  onChange={(event) => setBookingCheckIn(event.target.value)}
                />
              </label>

              <label>
                {t.checkOutDate} <small style={{ color: "red" }}>*</small>
                <input
                  type="date"
                  required
                  min={bookingCheckIn}
                  value={bookingCheckOut}
                  onChange={(event) => setBookingCheckOut(event.target.value)}
                />
              </label>

              <label>
                Số lượng khách
                <select value={bookingGuests} onChange={(event) => setBookingGuests(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => <option key={count} value={count}>{count} khách</option>)}
                </select>
              </label>

              <label>
                {t.specialRequest}
                <input
                  type="text"
                  value={bookingNote}
                  onChange={(event) => setBookingNote(event.target.value)}
                  placeholder="Yêu cầu giường đôi, view đẹp..."
                />
              </label>
            </div>

            <div className="booking-summary">
              <span>{bookingNights} đêm · {bookingGuests} khách</span>
              <b>{t.estimatedTotalStay}: {formatMoney(estimatedStayPrice(bookingOffer.stay) * bookingNights)}</b>
            </div>

            <button className="button button--dark button--full" type="submit">
              {t.sendBookingRequestBtn}
            </button>
          </form>
        </div>
      )}

      {/* ORDER CONFIRMATION & MERCHANT DISPATCH MODAL */}
      {confirmedOrder && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmedOrder(null); }}>
          <div className="order-success-modal" role="dialog" aria-labelledby="order-success-title">
            <div className="order-success-header">
              <span className="order-success-icon">🎉</span>
              <div>
                <span className="kicker" style={{ color: "#10b981" }}>{t.orderSuccessKicker}</span>
                <h2 id="order-success-title">{t.orderNumberLabel} #{confirmedOrder.order.id}</h2>
              </div>
              <button type="button" className="booking-dialog__close" onClick={() => setConfirmedOrder(null)} aria-label={t.authClose || "Đóng"}>×</button>
            </div>

            {/* Status Badge: Friendly for Customer, Sheets Sync for Admin/Merchant */}
            {authUser?.role === "admin" || authUser?.role === "merchant" ? (
              <div className="order-sheet-badge">
                <span>📊</span>
                <div>
                  <b>Tình trạng Trang Tính Google Sheets:</b>
                  <p>{confirmedOrder.sheetSyncStatus}</p>
                </div>
              </div>
            ) : (
              <div className="order-sheet-badge" style={{ background: "#ecfdf5", borderColor: "#a7f3d0" }}>
                <span>✅</span>
                <div>
                  <b style={{ color: "#065f46" }}>Đơn hàng đã được tiếp nhận thành công</b>
                  <p style={{ color: "#047857" }}>Thông tin món đặt đã được gửi tới chủ cơ sở OCOP để sẵn sàng chuẩn bị và giao hàng cho bạn.</p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="order-summary-box">
              <div className="order-summary-grid">
                <div>
                  <small>👤 NGƯỜI ĐẶT</small>
                  <b>{confirmedOrder.order.customerName}</b>
                  <span>📞 {confirmedOrder.order.phone}</span>
                </div>
                <div>
                  <small>📍 GIAO TỚI ĐÂU</small>
                  <b>{confirmedOrder.order.address}</b>
                  <span>Ghi chú: {confirmedOrder.order.note || "Không có"}</span>
                </div>
                <div>
                  <small>🕒 THỜI GIAN ĐẶT</small>
                  <b>{confirmedOrder.order.createdAt}</b>
                </div>
                <div>
                  <small>💰 TỔNG TIỀN THANH TOÁN</small>
                  <b style={{ color: "var(--red)", fontSize: "17px" }}>{formatMoney(confirmedOrder.order.totalAmount)}</b>
                </div>
              </div>

              <div className="order-items-list">
                <small>DANH SÁCH MÓN ĐẶT & DOANH NGHIỆP CUNG CẤP:</small>
                {confirmedOrder.order.items.map((it: any, idx: number) => (
                  <div key={idx} className="order-item-row">
                    <span><b>{it.dishName}</b> × {it.quantity} phần</span>
                    <span className="pill pill--subtle">{it.sellerName}</span>
                    <b>{formatMoney(it.totalPrice)}</b>
                  </div>
                ))}
              </div>
            </div>

            {/* MERCHANT NOTIFICATION & DISPATCH SECTION */}
            <div className="merchant-dispatch-section">
              <div className="merchant-dispatch-header">
                <span className="kicker" style={{ color: "var(--red)" }}>KẾT NỐI DOANH NGHIỆP & CHỦ CƠ SỞ</span>
                <h3>Thông báo đã tạo để Doanh nghiệp chuẩn bị đồ & Ship</h3>
                <p>Hệ thống tự động kết nối thông tin đơn tới chủ cơ sở OCOP để sẵn sàng đóng gói và giao hàng cho quý khách.</p>
              </div>

              <div className="merchant-card-list">
                {confirmedOrder.merchantNotifications.map((notif: any, idx: number) => (
                  <div key={idx} className="merchant-dispatch-card">
                    <div className="merchant-dispatch-top">
                      <div>
                        <b>🏪 {notif.sellerName}</b>
                        {notif.sellerPhone && <small>Hotline: {notif.sellerPhone}</small>}
                      </div>
                      <div className="merchant-actions">
                        {notif.zaloUrl && (
                          <a
                            href={notif.zaloUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button button--small button--dark"
                            title="Gửi tin nhắn Zalo cho chủ cơ sở"
                          >
                            💬 Nhắn Zalo chủ cơ sở
                          </a>
                        )}
                        {notif.sellerPhone && (
                          <a
                            href={`tel:${notif.sellerPhone}`}
                            className="button button--small button--outline"
                          >
                            📞 Gọi chủ quán
                          </a>
                        )}
                        <button
                          type="button"
                          className="button button--small button--ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(notif.message);
                            showToast(`Đã sao chép tin nhắn gửi tới ${notif.sellerName}!`);
                          }}
                        >
                          📋 Sao chép
                        </button>
                      </div>
                    </div>
                    <pre className="merchant-message-preview">{notif.message}</pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="order-success-actions" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "16px" }}>
              {authUser?.role === "admin" || authUser?.role === "merchant" ? (
                <button
                  type="button"
                  className="button button--dark button--lg"
                  onClick={() => {
                    setConfirmedOrder(null);
                    setOrdersDashboardOpen(true);
                  }}
                >
                  📊 Mở Bảng Quản Lý Đơn Hàng (Sheets View) →
                </button>
              ) : (
                <button
                  type="button"
                  className="button button--dark button--lg"
                  style={{ background: "var(--red)", color: "white", padding: "14px 20px", fontSize: "14px", fontWeight: "700" }}
                  onClick={() => {
                    setConfirmedOrder(null);
                    setCartDrawerTab("orders");
                    setCartOpen(true);
                  }}
                >
                  📦 {t.trackYourOrderBtn}
                </button>
              )}
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setConfirmedOrder(null)}
              >
                {t.continueExploreBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS GOOGLE SHEETS DASHBOARD MODAL (ADMIN & MERCHANT ONLY) */}
      {ordersDashboardOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOrdersDashboardOpen(false); }}>
          <div className="orders-dashboard-modal" role="dialog" aria-labelledby="orders-dashboard-title">
            <div className="orders-dashboard-header">
              <div>
                <span className="kicker" style={{ color: "#10b981" }}>
                  {authUser?.role === "admin"
                    ? "🛡️ QUYỀN HẠN: QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)"
                    : `🏪 QUYỀN HẠN: CHỦ CƠ SỞ OCOP - ${authUser?.merchantName || "ĐỐI TÁC"}`}
                </span>
                <h2 id="orders-dashboard-title">Bảng Quản Lý Đơn Hàng & Google Sheets</h2>
                <p>
                  {authUser?.role === "admin"
                    ? "Theo dõi toàn bộ đơn hàng của tất cả cơ sở OCOP, xuất dữ liệu và đồng bộ Google Sheets Webhook."
                    : `Theo dõi các đơn hàng liên quan đến cơ sở ${authUser?.merchantName || "của bạn"} để chuẩn bị đồ và giao cho khách.`}
                </p>
              </div>
              <button type="button" className="booking-dialog__close" onClick={() => setOrdersDashboardOpen(false)} aria-label="Đóng">×</button>
            </div>

            {/* Dashboard Control Bar */}
            <div className="orders-control-bar">
              <div className="orders-stat-pills">
                <span className="orders-stat-pill"><b>{orderList.length}</b> Tổng đơn</span>
                <span className="orders-stat-pill"><b>{orderList.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString("vi-VN")}đ</b> Doanh thu</span>
                <span className="orders-stat-pill" style={{ background: "#ecfdf5", color: "#065f46" }}>
                  👤 Đang đăng nhập: <b>{authUser?.name}</b>
                </span>
              </div>
              <div className="orders-action-buttons">
                <button type="button" className="button button--dark" onClick={exportOrdersToCSV}>
                  📥 Tải file CSV / Excel ({orderList.length} đơn)
                </button>
              </div>
            </div>

            {/* Google Sheets Webhook Integration Section (Admin Only) */}
            {authUser?.role === "admin" && (
              <>
                <div className="sheets-webhook-box">
                  <div className="sheets-webhook-title">
                    <span>🔗</span>
                    <div>
                      <b>Đồng bộ tự động về Google Sheets:</b>
                      <p>Nhập Google Apps Script Webhook URL để mỗi đơn hàng mới tự động ghi 1 dòng vào file Google Sheet quản lý chung.</p>
                    </div>
                  </div>
                  <div className="sheets-webhook-input-group">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={sheetWebhookUrl}
                      onChange={(e) => setSheetWebhookUrl(e.target.value)}
                    />
                    <button type="button" className="button button--dark" onClick={() => saveCustomSheetWebhook(sheetWebhookUrl)}>
                      Lưu kết nối Sheet
                    </button>
                  </div>
                  <details className="sheets-script-details">
                    <summary>👉 Xem mã Google Apps Script 1-Click để tạo Webhook Google Sheets</summary>
                    <div className="sheets-code-block">
                      <pre>{`// Dán mã này vào Tiện ích mở rộng > Apps Script trong Google Sheet của bạn:
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Mã Đơn", "Thời Gian", "Khách Hàng", "SĐT", "Địa Chỉ Giao", "Món & Số Lượng", "Doanh Nghiệp / Cơ Sở OCOP", "Tổng Tiền (VNĐ)", "Ghi Chú", "Trạng Thái"]);
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#e6f4ea");
    }
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([data.orderId, data.orderTime, data.customerName, "'" + data.phone, data.deliveryAddress, data.itemsDetail, data.sellersList, data.totalAmount, data.note, data.status]);
    return ContentService.createTextOutput(JSON.stringify({status:"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error",message:err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`}</pre>
                      <button
                        type="button"
                        className="button button--small button--dark"
                        onClick={() => {
                          navigator.clipboard.writeText(`function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Mã Đơn", "Thời Gian", "Khách Hàng", "SĐT", "Địa Chỉ Giao", "Món & Số Lượng", "Doanh Nghiệp / Cơ Sở OCOP", "Tổng Tiền (VNĐ)", "Ghi Chú", "Trạng Thái"]);
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#e6f4ea");
    }
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([data.orderId, data.orderTime, data.customerName, "'" + data.phone, data.deliveryAddress, data.itemsDetail, data.sellersList, data.totalAmount, data.note, data.status]);
    return ContentService.createTextOutput(JSON.stringify({status:"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error",message:err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`);
                          setSheetScriptCopied(true);
                          showToast("Đã sao chép mã Apps Script! Hãy dán vào Google Sheet của bạn.");
                        }}
                      >
                        {sheetScriptCopied ? "✓ Đã sao chép mã!" : "📋 Sao chép mã Google Apps Script"}
                      </button>
                    </div>
                  </details>
                </div>

                {/* ADMIN MERCHANT WHITELIST MANAGEMENT */}
                <div className="admin-merchant-mgmt-box">
                  <div className="admin-box-header">
                    <span>🏪</span>
                    <div>
                      <b>Quản lý phân quyền & Mật khẩu Chủ Doanh Nghiệp OCOP:</b>
                      <p>Admin cấp quyền và thiết lập mật khẩu đăng nhập cho từng cơ sở. Chỉ những ai có đúng Gmail và Mật khẩu này mới vào được giao diện Chủ doanh nghiệp.</p>
                    </div>
                  </div>

                  <form onSubmit={addMerchantToWhitelist} className="admin-add-merchant-form">
                    <input
                      type="email"
                      required
                      placeholder="Gmail cấp quyền (VD: chucoso@gmail.com)"
                      value={newMerchantEmail}
                      onChange={(e) => setNewMerchantEmail(e.target.value)}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Tên Cơ sở OCOP / Doanh nghiệp"
                      value={newMerchantName}
                      onChange={(e) => setNewMerchantName(e.target.value)}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Mật khẩu cấp (Mặc định: 123456)"
                      value={newMerchantPassword}
                      onChange={(e) => setNewMerchantPassword(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Hotline (VD: 0987 654 321)"
                      value={newMerchantPhone}
                      onChange={(e) => setNewMerchantPhone(e.target.value)}
                    />
                    <button type="submit" className="button button--dark">
                      ＋ Cấp quyền & Mật khẩu
                    </button>
                  </form>

                  <div className="merchant-whitelist-table-wrap">
                    <table className="merchant-whitelist-table">
                      <thead>
                        <tr>
                          <th>Gmail Được Cấp Quyền</th>
                          <th>Tên Cơ Sở OCOP</th>
                          <th>Mật Khẩu Cấp</th>
                          <th>Hotline</th>
                          <th>Ngày Cấp</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {merchantWhitelist.map((m) => (
                          <tr key={m.email}>
                            <td><b>✉️ {m.email}</b></td>
                            <td><span className="pill pill--subtle">{m.merchantName}</span></td>
                            <td><code style={{ background: "#fef3c7", padding: "2px 6px", borderRadius: "4px", color: "#92400e" }}>{m.password}</code></td>
                            <td><a href={`tel:${m.phone}`}>{m.phone}</a></td>
                            <td><small>{m.createdAt}</small></td>
                            <td>
                              <button
                                type="button"
                                className="text-link text-link--danger"
                                onClick={() => removeMerchantFromWhitelist(m.email)}
                              >
                                Thu hồi quyền
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Real-time Sheets Table */}
            <div className="orders-table-wrapper">
              {orderList.length === 0 ? (
                <div className="orders-empty-state">
                  <span>📋</span>
                  <h3>Chưa có đơn hàng nào được tạo</h3>
                  <p>Khi du khách đặt đặc sản OCOP, các đơn hàng sẽ tự động xuất hiện tại bảng này theo thời gian thực.</p>
                </div>
              ) : (
                <table className="orders-sheet-table">
                  <thead>
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Thời Gian Đặt</th>
                      <th>Khách Hàng</th>
                      <th>Số Điện Thoại</th>
                      <th>Địa Chỉ Giao Hàng</th>
                      <th>Món Đặt & Số Lượng</th>
                      <th>Cơ Sở / Doanh Nghiệp OCOP</th>
                      <th>Tổng Tiền</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((order: any) => (
                      <tr key={order.id}>
                        <td><b>{order.id}</b></td>
                        <td><small>{order.createdAt}</small></td>
                        <td><b>{order.customerName}</b></td>
                        <td><a href={`tel:${order.phone}`}>{order.phone}</a></td>
                        <td><small>{order.address}</small></td>
                        <td>
                          {(order.items || []).map((it: any, i: number) => (
                            <div key={i}>• {it.dishName} <b>×{it.quantity}</b></div>
                          ))}
                        </td>
                        <td>
                          {(order.items || []).map((it: any, i: number) => (
                            <span key={i} className="pill pill--subtle" style={{ marginRight: "4px", marginBottom: "2px", display: "inline-block" }}>
                              {it.sellerName}
                            </span>
                          ))}
                        </td>
                        <td><b style={{ color: "var(--red)" }}>{Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ</b></td>
                        <td>
                          <span className="order-status-badge">
                            {order.status || "Chờ xác nhận"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER PERSONAL ORDERS MODAL */}
      {customerOrdersOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setCustomerOrdersOpen(false); }}>
          <div className="orders-dashboard-modal" style={{ maxWidth: "760px" }} role="dialog" aria-labelledby="customer-orders-title">
            <div className="orders-dashboard-header">
              <div>
                <span className="kicker" style={{ color: "var(--red)" }}>LỊCH SỬ MUA SẮM CÁ NHÂN</span>
                <h2 id="customer-orders-title">{t.myOrders}</h2>
                <p>Theo dõi các món đặc sản OCOP bạn đã đặt và tiến độ giao nhận.</p>
              </div>
              <button type="button" className="booking-dialog__close" onClick={() => setCustomerOrdersOpen(false)} aria-label="Đóng">×</button>
            </div>

            {/* Shopee-style Order Hub */}
            <div style={{ marginBottom: "16px" }}>
              {renderShopeeOrderHub("modal")}
            </div>

            {userOrderList.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <button
                  type="button"
                  onClick={clearMyOrders}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "11px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  🗑️ {t.clearOrderHistoryBtn}
                </button>
              </div>
            )}

            {userOrderList.filter((o) => filterOrderByStatus(o, orderStatusTab)).length === 0 ? (
              <div className="orders-empty-state">
                <span>🛍️</span>
                <h3>{t.noOrdersInStatus}</h3>
                <p>{t.noOrdersInStatusDesc}</p>
                <button
                  type="button"
                  className="button button--dark"
                  onClick={() => {
                    setCustomerOrdersOpen(false);
                    goToFoodSection();
                  }}
                >
                  Khám phá đặc sản OCOP →
                </button>
              </div>
            ) : (
              <div className="customer-order-cards">
                {userOrderList
                  .filter((o) => filterOrderByStatus(o, orderStatusTab))
                  .map((order: any) => {
                    const isPending = !order.status || order.status === "Chờ xác nhận";
                    const isCancelled = order.status === "Đã hủy";
                    const isCompleted = order.status === "Hoàn thành" || order.status === "Đã giao";

                    return (
                      <article key={order.id} className="customer-order-card">
                        <div className="customer-order-top">
                          <div>
                            <span className={`status-badge ${isPending ? "status-badge--pending" : isCancelled ? "status-badge--cancelled" : isCompleted ? "status-badge--completed" : "status-badge--confirmed"}`}>
                              {isPending ? "⏳ Chờ xác nhận" : isCancelled ? "✕ Đã hủy" : isCompleted ? "✓ Hoàn thành" : "⚡ Đang xử lý"}
                            </span>
                            <b>{t.orderNumberLabel} #{order.id}</b>
                            <small>🕒 {order.createdAt} · 💳 {order.paymentMethod || "VietQR"}</small>
                          </div>
                          <b style={{ color: "var(--red)", fontSize: "16px" }}>
                            {formatPrice(Number(order.totalAmount || 0))}
                          </b>
                        </div>

                        <div className="customer-order-body">
                          <p><b>Địa chỉ giao:</b> {order.address}</p>
                          {order.appliedVoucher && (
                            <p style={{ color: "var(--red)", fontSize: "11.5px" }}>🎁 <b>Ưu đãi:</b> {order.appliedVoucher}</p>
                          )}
                          <div className="customer-order-items">
                            {(order.items || []).map((it: any, i: number) => (
                              <div key={i} className="customer-order-item-row">
                                <span>• {it.dishName} (×{it.quantity})</span>
                                <span className="pill pill--subtle">{it.sellerName}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed var(--line)" }}>
                            {isPending && (
                              <button
                                type="button"
                                className="button button--outline"
                                style={{ minHeight: "32px", padding: "0 10px", fontSize: "11px", color: "var(--red)", borderColor: "#f0b5ab" }}
                                onClick={() => cancelOrder(order.id)}
                              >
                                {t.cancelOrderBtn}
                              </button>
                            )}
                            <button
                              type="button"
                              className="button button--dark"
                              style={{ minHeight: "32px", padding: "0 12px", fontSize: "11px" }}
                              onClick={() => reorderItems(order)}
                            >
                              {t.reorderBtn}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VOUCHERS & PROMOTIONS MODAL */}
      {vouchersModalOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setVouchersModalOpen(false); }}>
          <div className="orders-dashboard-modal" style={{ maxWidth: "680px" }} role="dialog" aria-labelledby="vouchers-title">
            <div className="orders-dashboard-header">
              <div>
                <span className="heritage-gold-tag">ƯU ĐÃI & KHUYẾN MÃI</span>
                <h2 id="vouchers-title" style={{ margin: "8px 0 4px" }}>Mã Giảm Giá & Voucher Đất Tổ</h2>
                <p>Lưu mã và áp dụng trực tiếp khi đặt vé tour hoặc mua sắm đặc sản OCOP.</p>
              </div>
              <button type="button" className="booking-dialog__close" onClick={() => setVouchersModalOpen(false)} aria-label="Đóng">×</button>
            </div>

            <div className="voucher-grid">
              {DEFAULT_VOUCHERS.map((voucher) => {
                const isSaved = savedVouchers.includes(voucher.code);
                const isApplied = appliedVoucherCode === voucher.code;

                return (
                  <div key={voucher.code} className="voucher-card">
                    <div className="voucher-card-left">
                      <b>{voucher.discountPercent ? `${voucher.discountPercent}%` : `${Math.round((voucher.discountAmount || 0) / 1000)}K`}</b>
                      <small>GIẢM</small>
                    </div>
                    <div className="voucher-card-right">
                      <div>
                        <h4>{voucher.title}</h4>
                        <p>{voucher.description}</p>
                      </div>
                      <div className="voucher-card-actions">
                        <span className="voucher-code-badge">{voucher.code}</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className={`voucher-apply-btn ${isSaved ? "is-saved" : ""}`}
                            onClick={() => {
                              if (isSaved) {
                                setSavedVouchers(savedVouchers.filter((c) => c !== voucher.code));
                                showToast(`Đã bỏ lưu mã ${voucher.code}`);
                              } else {
                                setSavedVouchers([...savedVouchers, voucher.code]);
                                showToast(`✦ Đã lưu mã ${voucher.code} vào ví voucher!`);
                              }
                            }}
                          >
                            {isSaved ? "✓ Đã lưu" : "Lưu mã"}
                          </button>
                          <button
                            type="button"
                            className="voucher-apply-btn"
                            style={{ background: isApplied ? "#24483d" : "var(--red)" }}
                            onClick={() => {
                              setAppliedVoucherCode(voucher.code);
                              setCartDrawerTab("cart");
                              setVouchersModalOpen(false);
                              setCartOpen(true);
                              showToast(`✦ Đã áp dụng mã ${voucher.code} (${voucher.title})!`);
                            }}
                          >
                            {isApplied ? "Đang dùng" : "Dùng ngay"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL (LOGIN / REGISTER / ADMIN) */}
      {authModalOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false); }}>
          <div className="auth-dialog-modal" role="dialog" aria-labelledby="auth-dialog-title">
            <div className="auth-dialog-header">
              <div className="brand brand--footer" style={{ marginBottom: "6px" }}>
                <span className="brand__mark">Đ</span>
                <span><strong>Đất Tổ Travel</strong><small>HỆ THỐNG TÀI KHOẢN BẢO MẬT</small></span>
              </div>
              <h2 id="auth-dialog-title">
                {authModalTab === "login" ? t.authLoginTab : authModalTab === "register" ? t.authRegisterTab : t.authAdminTab}
              </h2>
              <p>Mỗi tài khoản đều được bảo vệ bằng mật khẩu riêng để đảm bảo an toàn thông tin cá nhân.</p>
              <button type="button" className="booking-dialog__close" onClick={() => setAuthModalOpen(false)} aria-label={t.authClose || "Đóng"}>×</button>
            </div>

            {/* 3 Tabs: Login / Register / Admin */}
            <div className="auth-tab-switch" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <button
                type="button"
                className={`auth-tab-btn ${authModalTab === "login" ? "is-active" : ""}`}
                onClick={() => { setAuthModalTab("login"); setLoginError(""); }}
              >
                🔑 {t.authLoginTab}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authModalTab === "register" ? "is-active" : ""}`}
                onClick={() => { setAuthModalTab("register"); setRegisterError(""); }}
              >
                📝 {t.authRegisterTab}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authModalTab === "admin" ? "is-active" : ""}`}
                onClick={() => { setAuthModalTab("admin"); setAdminLoginError(""); }}
              >
                🛡️ {t.authAdminTab}
              </button>
            </div>

            {/* TAB 1: LOGIN (EMAIL & PASSWORD) */}
            {authModalTab === "login" && (
              <div className="auth-options-group">
                {/* Google Sign-in with Password check */}
                <button
                  type="button"
                  className="auth-btn auth-btn--google auth-btn--lg"
                  onClick={() => {
                    setGoogleSelectedAccount(null);
                    setGoogleOAuthModalOpen(true);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/></svg>
                  <span>{t.loginGoogle}</span>
                </button>

                <div className="google-form-divider">
                  <span>HOẶC ĐĂNG NHẬP BẰNG MẬT KHẨU</span>
                </div>

                <form onSubmit={handleUserLogin} className="auth-form-body">
                  {loginError && <div className="admin-login-error">⚠️ {loginError}</div>}

                  <label className="commerce-field">
                    {t.authEmail} <small style={{ color: "red" }}>*</small>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Ví dụ: yourname@gmail.com"
                    />
                  </label>

                  <label className="commerce-field">
                    {t.authPassword} <small style={{ color: "red" }}>*</small>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Nhập mật khẩu tài khoản"
                        style={{ paddingRight: "40px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                      >
                        {showLoginPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </label>

                  <button type="submit" className="button button--dark button--full" style={{ height: "46px" }}>
                    {t.authLoginBtn} →
                  </button>
                </form>

                <div style={{ textAlign: "center", fontSize: "13px" }}>
                  Chưa có tài khoản?{" "}
                  <button type="button" className="text-link" onClick={() => setAuthModalTab("register")}>
                    <b>{t.authRegisterTab} ngay</b>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER (NEW CUSTOMER) */}
            {authModalTab === "register" && (
              <form onSubmit={handleUserRegister} className="auth-form-body">
                {registerError && <div className="admin-login-error">⚠️ {registerError}</div>}

                <label className="commerce-field">
                  {t.authRegisterName} <small style={{ color: "red" }}>*</small>
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                  />
                </label>

                <label className="commerce-field">
                  {t.authEmail} <small style={{ color: "red" }}>*</small>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Ví dụ: nguyenvanan@gmail.com"
                  />
                </label>

                <label className="commerce-field">
                  {t.authRegisterPhone}
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <label className="commerce-field">
                    {t.authPassword} <small style={{ color: "red" }}>*</small>
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Mật khẩu"
                    />
                  </label>

                  <label className="commerce-field">
                    {t.authRegisterConfirmPass} <small style={{ color: "red" }}>*</small>
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      required
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="Xác nhận"
                    />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="text-link"
                    style={{ fontSize: "12px" }}
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? "🙈 " + t.authHidePassword : "👁️ " + t.authShowPassword}
                  </button>
                </div>

                <button type="submit" className="button button--dark button--full" style={{ height: "46px" }}>
                  {t.authRegisterBtn} →
                </button>

                <div style={{ textAlign: "center", fontSize: "13px" }}>
                  Đã có tài khoản?{" "}
                  <button type="button" className="text-link" onClick={() => setAuthModalTab("login")}>
                    <b>{t.authLoginTab} ngay</b>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: ADMIN CREDENTIALS LOGIN */}
            {authModalTab === "admin" && (
              <form onSubmit={handleAdminLogin} className="admin-login-form">
                <div className="admin-login-notice">
                  🛡️ Cổng đăng nhập dành riêng cho Quản Trị Viên Hệ Thống.
                </div>

                {adminLoginError && (
                  <div className="admin-login-error">
                    ⚠️ {adminLoginError}
                  </div>
                )}

                <label className="commerce-field">
                  {t.authAdminUser} <small style={{ color: "red" }}>*</small>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                  />
                </label>

                <label className="commerce-field">
                  {t.authPassword} <small style={{ color: "red" }}>*</small>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                    >
                      {showAdminPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </label>

                <button type="submit" className="button button--dark button--full" style={{ height: "46px", marginTop: "4px" }}>
                  {t.authAdminLoginBtn} →
                </button>
              </form>
            )}

            <div className="auth-dialog-footer">
              <p>Mọi thông tin cá nhân và dữ liệu đơn hàng được mã hóa bảo mật tuyệt đối.</p>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE ACCOUNT CHOOSER WITH PASSWORD PROTECTION (2 STEPS) */}
      {googleOAuthModalOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setGoogleOAuthModalOpen(false); }}>
          <div className="google-oauth-modal" role="dialog" aria-labelledby="google-oauth-title">
            <div className="google-oauth-header">
              <svg width="28" height="28" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/></svg>
              <div>
                <h3 id="google-oauth-title">Đăng nhập bằng Google</h3>
                <p>{googleSelectedAccount ? "Bước 2: Xác thực mật khẩu bảo vệ tài khoản" : "Bước 1: Chọn tài khoản Gmail của bạn"}</p>
              </div>
              <button type="button" className="booking-dialog__close" onClick={() => setGoogleOAuthModalOpen(false)} aria-label="Đóng">×</button>
            </div>

            {/* STEP 1: CHOOSE ACCOUNT */}
            {!googleSelectedAccount ? (
              <>
                <div className="google-account-list">
                  <div className="google-account-list-label">TÀI KHOẢN DOANH NGHIỆP & DU KHÁCH:</div>
                  
                  {/* Whitelisted Merchant Accounts */}
                  {merchantWhitelist.map((m) => (
                    <button
                      key={m.email}
                      type="button"
                      className="google-account-item"
                      onClick={() => handleGoogleAccountSelect(m.email, m.merchantName)}
                    >
                      <span className="google-account-avatar" style={{ background: "#fef3c7", color: "#92400e" }}>🏪</span>
                      <div className="google-account-info">
                        <b>{m.merchantName} <small className="pill pill--subtle" style={{ color: "#b45309" }}>Chủ cơ sở OCOP</small></b>
                        <span>{m.email}</span>
                      </div>
                      <em>🔒 Cần mật khẩu →</em>
                    </button>
                  ))}

                  {/* Customer Account */}
                  <button
                    type="button"
                    className="google-account-item"
                    onClick={() => handleGoogleAccountSelect("hoangthanh.phutho@gmail.com", "Thanh Hoàng")}
                  >
                    <span className="google-account-avatar">TH</span>
                    <div className="google-account-info">
                      <b>Thanh Hoàng <small className="pill pill--subtle">Du khách cá nhân</small></b>
                      <span>hoangthanh.phutho@gmail.com</span>
                    </div>
                    <em>🔒 Cần mật khẩu →</em>
                  </button>
                </div>

                {/* Custom Email Input with Password */}
                <form onSubmit={handleCustomGoogleLogin} className="google-custom-login-form">
                  <div className="google-form-divider">
                    <span>HOẶC SỬ DỤNG GMAIL THẬT CỦA BẠN</span>
                  </div>

                  {googleInputError && (
                    <div className="admin-login-error">⚠️ {googleInputError}</div>
                  )}

                  <div className="google-input-group">
                    <input
                      type="email"
                      required
                      placeholder="Nhập địa chỉ Gmail của bạn (VD: name@gmail.com)"
                      value={googleInputEmail}
                      onChange={(e) => setGoogleInputEmail(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Họ và tên của bạn (Tùy chọn)"
                      value={googleInputName}
                      onChange={(e) => setGoogleInputName(e.target.value)}
                    />
                    <div style={{ position: "relative" }}>
                      <input
                        type={showGoogleInputPassword ? "text" : "password"}
                        required
                        placeholder="Mật khẩu bảo vệ (Tạo mới nếu là khách mới)"
                        value={googleInputPassword}
                        onChange={(e) => setGoogleInputPassword(e.target.value)}
                        style={{ width: "100%", paddingRight: "40px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowGoogleInputPassword(!showGoogleInputPassword)}
                        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                      >
                        {showGoogleInputPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <button type="submit" className="button button--dark" style={{ height: "42px" }}>
                      Đăng nhập / Tạo tài khoản với Gmail này →
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* STEP 2: PASSWORD VERIFICATION STEP */
              <form onSubmit={handleGoogleAccountPasswordConfirm} className="google-password-step-form">
                <div className="google-user-selected-card">
                  <span className="google-account-avatar" style={{ width: "44px", height: "44px", fontSize: "16px" }}>
                    {googleSelectedAccount.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <b>{googleSelectedAccount.name}</b>
                    <span>{googleSelectedAccount.email}</span>
                    <small className="pill pill--subtle" style={{ marginTop: "3px", display: "inline-block" }}>
                      {googleSelectedAccount.isMerchant ? `🏪 Chủ cơ sở: ${googleSelectedAccount.merchantName}` : "👤 Du khách cá nhân"}
                    </small>
                  </div>
                </div>

                {googlePasswordError && (
                  <div className="admin-login-error">⚠️ {googlePasswordError}</div>
                )}

                <div className="auth-hint-box" style={{ padding: "8px 12px" }}>
                  <span>🔒</span>
                  <p>
                    {googleSelectedAccount.isMerchant
                      ? "Đây là tài khoản Doanh nghiệp. Vui lòng nhập mật khẩu do Admin cấp để truy cập."
                      : "Vui lòng nhập mật khẩu tài khoản (nếu là lần đầu đăng nhập, mật khẩu bạn nhập sẽ trở thành mật khẩu bảo vệ của tài khoản này)."}
                  </p>
                </div>

                <label className="commerce-field">
                  Mật khẩu bảo vệ tài khoản <small style={{ color: "red" }}>*</small>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showGooglePassword ? "text" : "password"}
                      required
                      autoFocus
                      value={googleAccountPassword}
                      onChange={(e) => setGoogleAccountPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGooglePassword(!showGooglePassword)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                    >
                      {showGooglePassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </label>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => setGoogleSelectedAccount(null)}
                    style={{ flex: 1 }}
                  >
                    ← Đổi tài khoản
                  </button>
                  <button
                    type="submit"
                    className="button button--dark"
                    style={{ flex: 2 }}
                  >
                    Xác nhận & Đăng nhập →
                  </button>
                </div>
              </form>
            )}

            <div className="google-oauth-footer">
              <small>Mật khẩu được lưu trữ an toàn để bảo vệ quyền truy cập và dữ liệu cá nhân của bạn.</small>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART BUBBLE (BÓNG CHAT GIỎ HÀNG GÓC TRÁI - ẢNH 1) */}
      <button
        type="button"
        className="floating-cart-bubble"
        onClick={() => {
          setCartDrawerTab("cart");
          setCartOpen(true);
        }}
        aria-label={`${t.floatingCartLabel} (${cartQuantity})`}
        title={t.floatingCartLabel}
      >
        <div className="floating-cart-bubble__icon-wrapper">
          <span>🛒</span>
          {cartQuantity > 0 && (
            <span className="floating-cart-bubble__badge">{cartQuantity}</span>
          )}
        </div>
        <div className="floating-cart-bubble__text">
          <span className="floating-cart-bubble__label">{t.floatingCartLabel}</span>
          <span className="floating-cart-bubble__sub">
            {cartQuantity > 0 ? `${cartQuantity} · ${formatPrice(cartSubtotal)}` : t.floatingCartSubDefault}
          </span>
        </div>
      </button>

      {/* TOAST NOTIFICATION */}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
