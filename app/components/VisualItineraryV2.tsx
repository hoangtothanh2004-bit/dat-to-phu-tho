"use client";

import React, { useState, useEffect, useRef } from "react";
import type { GeneratedItinerary, ItinerarySlot, ItineraryDay } from "@/lib/guidePlanner";
import type { Place } from "@/data/travel";
import type { LanguageCode } from "@/app/page";

export type VisualItineraryV2Props = {
  generatedItinerary: GeneratedItinerary;
  currentLang: LanguageCode;
  t: any;
  formatMoney: (amount: number, currency?: any) => string;
  currentCurrency?: string;
  getRegionLabel: (reg: string, t: any) => string;
  getTransportLabel: (trans: string, t: any) => string;
  getStyleLabel: (sty: string, t: any) => string;
  getLocalizedItineraryTitle: (itinerary: GeneratedItinerary, lang: LanguageCode, t: any) => string;
  getLocalizedItinerarySubtitle: (itinerary: GeneratedItinerary, lang: LanguageCode, t: any) => string;
  getLocalizedDriveTime: (driveTime: string, lang: LanguageCode) => string;
  toggleItineraryAudio: () => void;
  togglePlaceAudio: (place: Place) => void;
  stopAllAudio: () => void;
  audioGuidePlaying: boolean;
  audioState: "idle" | "playing" | "paused";
  speechPlaceId: string | null;
  audioLang: LanguageCode;
  setAudioLang: (lang: LanguageCode) => void;
  selectedVoiceURI: string;
  setSelectedVoiceURI: (uri: string) => void;
  voiceOptions: { id: string; label: string }[];
  audioVolume: number;
  setAudioVolume: (v: number) => void;
  audioRate: number;
  setAudioRate: (r: number) => void;
  sharePlan: () => void;
  savePlan: () => void;
  favorites: string[];
  toggleFavorite: (placeId: string) => void;
  showToast: (msg: string) => void;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  isBuilderCollapsed?: boolean;
  toggleBuilderCollapse?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
};

export const ITINERARY_I18N: Record<
  LanguageCode,
  {
    dayPrefix: string;
    totalDistance: string;
    estTime: string;
    transportLabel: string;
    stopsCount: (n: number) => string;
    inItinerary: string;
    estCost: string;
    highlightPrefix: string;
    viewDetail: string;
    nextStops: string;
    stopsUnit: string;
    collapse: string;
    nightStayTag: string;
    amenitiesExp: string;
    directionsToStay: string;
    guideNarration: string;
    twoMinStory: string;
    nowPlaying: string;
    backToList: string;
    detailSectionTitle: string;
    destinationLabel: string;
    sightseeLabel: string;
    diningLabel: string;
    tastyDish: string;
    listenGuide: string;
    pauseGuide: string;
    directions: string;
    save: string;
    saved: string;
    voiceSettings: string;
    chooseVoice: string;
    voiceList: string;
    volume: string;
    speed: string;
    customizeTrip: string;
    closeFilter: string;
    closeSettings: string;
    aiVoiceBtn: string;
    pills: [
      { b: string; s: string },
      { b: string; s: string },
      { b: string; s: string },
      { b: string; s: string }
    ];
  }
> = {
  vi: {
    dayPrefix: "NGÀY",
    totalDistance: "(tổng quãng đường)",
    estTime: "(thời gian dự kiến)",
    transportLabel: "(phương tiện)",
    stopsCount: (n) => `${n} điểm dừng`,
    inItinerary: "(trong lịch trình)",
    estCost: "(chi phí dự kiến)",
    highlightPrefix: "Điểm nổi bật:",
    viewDetail: "Xem chi tiết",
    nextStops: "Các điểm dừng tiếp theo",
    stopsUnit: "điểm",
    collapse: "Thu gọn ▴",
    nightStayTag: "🏨 ĐIỂM NGHỈ ĐÊM",
    amenitiesExp: "Tiện ích & trải nghiệm:",
    directionsToStay: "↗ Đường đến chỗ nghỉ",
    guideNarration: "Lời dẫn hướng dẫn viên",
    twoMinStory: "câu chuyện 2 phút",
    nowPlaying: "Đang phát",
    backToList: "↑ Trở lại danh sách các điểm dừng",
    detailSectionTitle: "Thông tin chi tiết",
    destinationLabel: "Điểm đến",
    sightseeLabel: "Điểm tham quan",
    diningLabel: "Ăn uống (gợi ý)",
    tastyDish: "Món ngon:",
    listenGuide: "▶ Nghe thuyết minh điểm này",
    pauseGuide: "⏸ Tạm dừng nghe",
    directions: "Chỉ đường",
    save: "Lưu",
    saved: "Đã lưu",
    voiceSettings: "Cài đặt giọng đọc & tốc độ",
    chooseVoice: "Chọn chất giọng AI:",
    voiceList: "Danh sách giọng chi tiết",
    volume: "Âm lượng:",
    speed: "Tốc độ đọc",
    customizeTrip: "Tùy biến chuyến đi",
    closeFilter: "Đóng bộ lọc",
    closeSettings: "Đóng cài đặt",
    aiVoiceBtn: "Giọng đọc AI",
    pills: [
      { b: "Gọn gàng", s: "trực quan" },
      { b: "Giữ đủ thông tin", s: "nhưng không rối" },
      { b: "Thân thiện", s: "trên cả máy tính & điện thoại" },
      { b: "Tăng trải nghiệm", s: "và tỷ lệ sử dụng" },
    ],
  },
  en: {
    dayPrefix: "DAY",
    totalDistance: "(total distance)",
    estTime: "(estimated time)",
    transportLabel: "(transport)",
    stopsCount: (n) => `${n} stops`,
    inItinerary: "(in itinerary)",
    estCost: "(estimated cost)",
    highlightPrefix: "Highlights:",
    viewDetail: "View details",
    nextStops: "Upcoming stops",
    stopsUnit: "stops",
    collapse: "Collapse ▴",
    nightStayTag: "🏨 OVERNIGHT STAY",
    amenitiesExp: "Amenities & experience:",
    directionsToStay: "↗ Directions to stay",
    guideNarration: "Tour Guide Narration",
    twoMinStory: "2-minute story",
    nowPlaying: "Playing",
    backToList: "↑ Back to stop list",
    detailSectionTitle: "Detailed Information",
    destinationLabel: "Destination",
    sightseeLabel: "Sightseeing Highlights",
    diningLabel: "Dining (Suggested)",
    tastyDish: "Specialty:",
    listenGuide: "▶ Listen to audio guide",
    pauseGuide: "⏸ Pause audio guide",
    directions: "Directions",
    save: "Save",
    saved: "Saved",
    voiceSettings: "Narration Voice & Speed",
    chooseVoice: "Choose AI Voice:",
    voiceList: "Detailed Voice List",
    volume: "Volume:",
    speed: "Reading Speed",
    customizeTrip: "Customize Trip",
    closeFilter: "Close Filter",
    closeSettings: "Close Settings",
    aiVoiceBtn: "AI Narration",
    pills: [
      { b: "Clean", s: "Intuitive" },
      { b: "Comprehensive", s: "Yet uncluttered" },
      { b: "Mobile-Friendly", s: "Desktop & mobile" },
      { b: "Enhanced Travel", s: "Smart exploration" },
    ],
  },
  zh: {
    dayPrefix: "第",
    totalDistance: "(总路程)",
    estTime: "(预计用时)",
    transportLabel: "(交通方式)",
    stopsCount: (n) => `${n} 个停靠点`,
    inItinerary: "(行程内)",
    estCost: "(预计费用)",
    highlightPrefix: "核心亮点：",
    viewDetail: "查看详情",
    nextStops: "后续停靠点",
    stopsUnit: "站",
    collapse: "收起 ▴",
    nightStayTag: "🏨 夜宿推荐",
    amenitiesExp: "设施与体验：",
    directionsToStay: "↗ 导航前往住处",
    guideNarration: "语音导游解说",
    twoMinStory: "2分钟精选解说",
    nowPlaying: "播放中",
    backToList: "↑ 返回行程列表",
    detailSectionTitle: "详细行程信息",
    destinationLabel: "目的地",
    sightseeLabel: "游览亮点",
    diningLabel: "餐饮（推荐）",
    tastyDish: "招牌风味：",
    listenGuide: "▶ 收听本景点语音解说",
    pauseGuide: "⏸ 暂停语音解说",
    directions: "导航路线",
    save: "收藏",
    saved: "已收藏",
    voiceSettings: "语音与语速设置",
    chooseVoice: "选择 AI 声音：",
    voiceList: "所有语音选项",
    volume: "音量：",
    speed: "朗读语速",
    customizeTrip: "自定义行程",
    closeFilter: "收起筛选",
    closeSettings: "关闭设置",
    aiVoiceBtn: "AI 语音解说",
    pills: [
      { b: "简洁明了", s: "清晰直观" },
      { b: "信息详实", s: "井然有序" },
      { b: "全端兼容", s: "手机电脑皆流畅" },
      { b: "品质体验", s: "旅行省心高效" },
    ],
  },
  ko: {
    dayPrefix: "",
    totalDistance: "(총 이동거리)",
    estTime: "(예상 소요시간)",
    transportLabel: "(이동 수단)",
    stopsCount: (n) => `${n}개 경유지`,
    inItinerary: "(일정 내)",
    estCost: "(예상 경비)",
    highlightPrefix: "주요 하이라이트:",
    viewDetail: "상세보기",
    nextStops: "다음 경유지",
    stopsUnit: "곳",
    collapse: "접기 ▴",
    nightStayTag: "🏨 추천 숙소",
    amenitiesExp: "편의시설 & 체험:",
    directionsToStay: "↗ 숙소 길찾기",
    guideNarration: "오디오 가이드 해설",
    twoMinStory: "2분 스토리",
    nowPlaying: "재생 중",
    backToList: "↑ 경유지 목록으로 돌아가기",
    detailSectionTitle: "상세 일정 정보",
    destinationLabel: "목적지",
    sightseeLabel: "관광 포인트",
    diningLabel: "식사 (추천)",
    tastyDish: "대표 메뉴:",
    listenGuide: "▶ 이 장소 오디오 가이드 듣기",
    pauseGuide: "⏸ 오디오 일시정지",
    directions: "길찾기",
    save: "저장",
    saved: "저장됨",
    voiceSettings: "음성 및 재생 속도 설정",
    chooseVoice: "AI 음성 선택:",
    voiceList: "상세 음성 목록",
    volume: "음량:",
    speed: "재생 속도",
    customizeTrip: "일정 맞춤설정",
    closeFilter: "필터 닫기",
    closeSettings: "설정 닫기",
    aiVoiceBtn: "AI 오디오",
    pills: [
      { b: "깔끔함", s: "직관적 구성" },
      { b: "알찬 정보", s: "한눈에 쏙" },
      { b: "반응형 지원", s: "PC & 모바일 최적화" },
      { b: "여행 만족도", s: "스마트한 여정" },
    ],
  },
  ja: {
    dayPrefix: "",
    totalDistance: "(総移動距離)",
    estTime: "(所要時間)",
    transportLabel: "(移動手段)",
    stopsCount: (n) => `${n}箇所の立ち寄り先`,
    inItinerary: "(旅程内)",
    estCost: "(概算費用)",
    highlightPrefix: "ハイライト:",
    viewDetail: "詳細を見る",
    nextStops: "次の立ち寄り先",
    stopsUnit: "箇所",
    collapse: "折りたたむ ▴",
    nightStayTag: "🏨 宿泊先",
    amenitiesExp: "設備と体験：",
    directionsToStay: "↗ 宿泊先への道順",
    guideNarration: "音声ガイド解説",
    twoMinStory: "2分間のストーリー",
    nowPlaying: "再生中",
    backToList: "↑ 立ち寄り先リストに戻る",
    detailSectionTitle: "詳細情報",
    destinationLabel: "目的地",
    sightseeLabel: "見どころ",
    diningLabel: "お食事（おすすめ）",
    tastyDish: "おすすめ料理：",
    listenGuide: "▶ このスポットの音声を聞く",
    pauseGuide: "⏸ 音声を一時停止",
    directions: "ルート案内",
    save: "保存",
    saved: "保存済み",
    voiceSettings: "音声＆再生速度の設定",
    chooseVoice: "AI音声を選択:",
    voiceList: "詳細な音声一覧",
    volume: "音量:",
    speed: "再生速度",
    customizeTrip: "旅程のカスタマイズ",
    closeFilter: "フィルターを閉じる",
    closeSettings: "設定を閉じる",
    aiVoiceBtn: "AI 音声解説",
    pills: [
      { b: "スマート", s: "直感的デザイン" },
      { b: "充実の情報", s: "見やすく整理" },
      { b: "マルチ対応", s: "スマホ＆PC最適化" },
      { b: "旅の満足度", s: "スマートな体験" },
    ],
  },
};

function formatDayBadge(dayNum: number, lang: LanguageCode): string {
  if (lang === "en") return `DAY ${dayNum}`;
  if (lang === "zh") return `第 ${dayNum} 天`;
  if (lang === "ko") return `${dayNum}일차`;
  if (lang === "ja") return `${dayNum}日目`;
  return `NGÀY ${dayNum}`;
}

function getSlotImage(slot: ItinerarySlot): string {
  if (slot.image) return slot.image;
  if (slot.place?.image) return slot.place.image;
  if (slot.restaurant?.image) return slot.restaurant.image;
  if (slot.stay?.image) return slot.stay.image;
  if (slot.title.toLowerCase().includes("việt trì")) {
    return "/images/places/viet-tri.jpg";
  }
  if (slot.type === "meal") return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80";
  if (slot.type === "stay") return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80";
}

function getSlotCategoryTag(slot: ItinerarySlot, lang: LanguageCode = "vi"): { label: string; modifier: string } {
  const isVi = lang === "vi";
  const isZh = lang === "zh";
  const isKo = lang === "ko";
  const isJa = lang === "ja";

  if (slot.type === "meal") {
    const label = isVi ? "Ăn uống" : isZh ? "特色餐饮" : isKo ? "식사" : isJa ? "お食事" : "Dining";
    return { label, modifier: "food" };
  }
  if (slot.type === "stay") {
    const label = isVi ? "Nghỉ ngơi" : isZh ? "住宿休息" : isKo ? "숙박" : isJa ? "宿泊" : "Stay";
    return { label, modifier: "stay" };
  }
  if (slot.place?.category === "Di sản & tâm linh") {
    const label = isVi ? "Tâm linh" : isZh ? "古迹文化" : isKo ? "문화유산" : isJa ? "名所旧跡" : "Heritage";
    return { label, modifier: "heritage" };
  }
  if (slot.place?.category === "Núi rừng & sinh thái") {
    const label = isVi ? "Sinh thái" : isZh ? "自然生态" : isKo ? "생태자연" : isJa ? "大自然" : "Nature";
    return { label, modifier: "nature" };
  }
  if (slot.place?.category === "Nghỉ dưỡng & chữa lành") {
    const label = isVi ? "Nghỉ dưỡng" : isZh ? "休闲疗愈" : isKo ? "힐링휴양" : isJa ? "温泉保養" : "Resort";
    return { label, modifier: "relax" };
  }
  const label = isVi ? "Tham quan" : isZh ? "观光打卡" : isKo ? "관광" : isJa ? "観光" : "Sightseeing";
  return { label, modifier: "sightsee" };
}

function getSlotLocationText(slot: ItinerarySlot, lang: LanguageCode = "vi"): string {
  if (lang !== "vi" && slot.place?.locationEn) return slot.place.locationEn;
  if (slot.place?.location) return slot.place.location;
  if (slot.restaurant?.address) return slot.restaurant.address.split(",").slice(0, 2).join(", ").trim();
  if (slot.stay?.address) return slot.stay.address.split(",").slice(0, 2).join(", ").trim();
  if (slot.place?.district) return `${slot.place.district}, ${slot.place.region}`;
  return lang === "en" ? "Itinerary Destination" : lang === "zh" ? "行程途经地" : lang === "ko" ? "여정 목적지" : lang === "ja" ? "旅程の目的地" : "Điểm đến trong lịch trình";
}

function getSlotHighlightsLine(slot: ItinerarySlot, lang: LanguageCode = "vi"): string {
  if (slot.type === "meal") {
    const dish = slot.restaurant?.taste || slot.restaurant?.note || slot.place?.restaurants?.[0]?.taste || "Gà đồi, rau su su, đặc sản bản địa...";
    const prefix = lang === "en" ? "Recommended: " : lang === "zh" ? "推荐品尝：" : lang === "ko" ? "추천 메뉴: " : lang === "ja" ? "おすすめ料理：" : "Gợi ý món: ";
    return `${prefix}${dish.split(/[.;]/)[0].trim()}`;
  }
  if (lang !== "vi" && slot.place?.highlightsEn && slot.place.highlightsEn.length > 0) {
    return slot.place.highlightsEn.slice(0, 3).join(", ") + ".";
  }
  if (slot.place?.highlights && slot.place.highlights.length > 0) {
    return `Check-in ${slot.place.highlights.slice(0, 3).join(", ")}.`;
  }
  if (slot.highlightNote) {
    return slot.highlightNote;
  }
  return lang === "en"
    ? "Experience cultural heritage and breathtaking landscapes."
    : lang === "zh"
    ? "体验传统文化遗产与壮丽自然风光。"
    : lang === "ko"
    ? "전통 문화유산과 수려한 자연경관을 체험합니다."
    : lang === "ja"
    ? "豊かな文化遺産と息をのむ大自然を体感。"
    : "Trải nghiệm văn hóa & danh lam thắng cảnh bản địa.";
}

export default function VisualItineraryV2(props: VisualItineraryV2Props) {
  const {
    generatedItinerary,
    currentLang,
    t,
    formatMoney,
    getTransportLabel,
    getLocalizedItineraryTitle,
    getLocalizedItinerarySubtitle,
    toggleItineraryAudio,
    togglePlaceAudio,
    stopAllAudio,
    audioGuidePlaying,
    audioState,
    speechPlaceId,
    audioLang,
    setAudioLang,
    selectedVoiceURI,
    setSelectedVoiceURI,
    voiceOptions,
    audioVolume,
    setAudioVolume,
    audioRate,
    setAudioRate,
    sharePlan,
    savePlan,
    favorites,
    toggleFavorite,
    showToast,
    handleImageError,
    isBuilderCollapsed = true,
    toggleBuilderCollapse,
    onLanguageChange,
  } = props;

  const [activeItineraryDay, setActiveItineraryDay] = useState<number>(1);
  const [selectedDetailSlot, setSelectedDetailSlot] = useState<ItinerarySlot | null>(null);
  const [expandedDayStops, setExpandedDayStops] = useState<Record<number, boolean>>({});
  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false);

  const detailPanelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const i18n = ITINERARY_I18N[currentLang] || ITINERARY_I18N.vi;

  // Reset day and slot when itinerary changes
  useEffect(() => {
    setActiveItineraryDay(1);
    setSelectedDetailSlot(null);
  }, [generatedItinerary.id]);

  const currentDayPlan =
    generatedItinerary.days.find((d) => d.dayNumber === activeItineraryDay) ||
    generatedItinerary.days[0];

  const activeDetailSlot = selectedDetailSlot || currentDayPlan?.slots[0] || null;
  const isExpandedStops = !!expandedDayStops[activeItineraryDay];
  const allSlots = currentDayPlan?.slots || [];
  const visibleSlots = isExpandedStops || allSlots.length <= 3 ? allSlots : allSlots.slice(0, 3);
  const hiddenCount = Math.max(0, allSlots.length - 3);

  const estimatedDayCost = currentDayPlan
    ? currentDayPlan.slots.reduce((sum, s) => sum + s.estimatedCostPerPerson, 0)
    : generatedItinerary.estimatedCostPerPerson;

  const firstTime = currentDayPlan?.slots[0]?.timeSlot.split("–")[0]?.trim() || "07:30";
  const lastTime =
    currentDayPlan?.slots[currentDayPlan.slots.length - 1]?.timeSlot.split("–")[1]?.trim() || "21:00";

  const handleCardClick = (slot: ItinerarySlot) => {
    setSelectedDetailSlot(slot);
    if (typeof window !== "undefined" && window.innerWidth <= 880) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Bullets for detail panel
  const detailBullets: string[] = activeDetailSlot?.place?.highlights && activeDetailSlot.place.highlights.length > 0
    ? (currentLang !== "vi" && activeDetailSlot.place.highlightsEn && activeDetailSlot.place.highlightsEn.length > 0
        ? activeDetailSlot.place.highlightsEn
        : activeDetailSlot.place.highlights)
    : activeDetailSlot?.activity
    ? [activeDetailSlot.activity]
    : [
        currentLang === "en" ? "Explore local culture and heritage" : currentLang === "zh" ? "探索当地文化与自然古迹" : currentLang === "ko" ? "지역 문화 및 명소 탐방" : currentLang === "ja" ? "地域の文化と自然の名所を巡る" : "Khám phá không gian văn hóa & danh lam bản địa",
        currentLang === "en" ? "Taste regional food & scenic views" : currentLang === "zh" ? "品味地道风味并欣赏自然山水" : currentLang === "ko" ? "향토 미식과 수려한 경관 체험" : currentLang === "ja" ? "郷土の味覚と絶景を楽しむ" : "Trải nghiệm ẩm thực và ngắm cảnh thiên nhiên"
      ];

  // Suggest restaurant
  const suggestDineName = activeDetailSlot?.restaurant?.name || activeDetailSlot?.place?.restaurants?.[0]?.name || (currentLang === "en" ? "Local Specialty Restaurant" : currentLang === "zh" ? "当地特色风味餐厅" : currentLang === "ko" ? "현지 특산 맛집" : currentLang === "ja" ? "郷土料理の名店" : "Nhà hàng đặc sản bản địa");
  const suggestDineDist = activeDetailSlot?.restaurant?.distance || activeDetailSlot?.place?.restaurants?.[0]?.distance || "cách 0,3 km (2 phút)";
  const suggestDineDishes = activeDetailSlot?.restaurant?.taste || activeDetailSlot?.place?.restaurants?.[0]?.taste || activeDetailSlot?.place?.restaurants?.[0]?.note || "Gà đồi, rau su su, cá suối, cơm lam...";

  // Script text for active detail slot
  const slotAudioVi = activeDetailSlot?.audioScript;
  const slotAudioEn = activeDetailSlot?.audioScriptEn;
  const placeAudioVi = activeDetailSlot?.place?.audioScript;
  const placeAudioEn = activeDetailSlot?.place?.audioScriptEn;

  const currentSlotAudio = audioLang !== "vi"
    ? (slotAudioEn || slotAudioVi || placeAudioEn || placeAudioVi)
    : (slotAudioVi || placeAudioVi);

  const activeQuoteScript = currentSlotAudio
    ? currentSlotAudio
    : activeDetailSlot?.highlightNote
    ? activeDetailSlot.highlightNote
    : `Chào mừng bạn đến với ${activeDetailSlot?.title}.`;

  const activeSlotAudioId = activeDetailSlot?.place?.id || `slot-${activeDetailSlot?.timeSlot}-${activeDetailSlot?.title}`;
  const isDetailPlacePlaying = !!((speechPlaceId === activeSlotAudioId || (activeDetailSlot?.place && speechPlaceId === activeDetailSlot.place.id)) && audioState === "playing");

  const googleMapsSearchUrl = activeDetailSlot?.place
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeDetailSlot.place.name} ${activeDetailSlot.place.location}`)}`
    : generatedItinerary.googleMapsUrl;

  return (
    <div className="v2-itinerary-workspace">
      {/* 1. TOP UTILITY ACTION BAR */}
      <div className="v2-action-bar">
        <div className="v2-action-group">
          {toggleBuilderCollapse && (
            <button
              type="button"
              className={`v2-action-btn ${isBuilderCollapsed ? "is-highlighted" : ""}`}
              onClick={toggleBuilderCollapse}
              title={isBuilderCollapsed ? i18n.customizeTrip : i18n.closeFilter}
            >
              <span>⚙️</span>
              <b>{isBuilderCollapsed ? i18n.customizeTrip : i18n.closeFilter}</b>
            </button>
          )}

          <a
            className="v2-action-btn"
            href={generatedItinerary.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>🗺️</span>
            <b>{t.tripViewGoogleMaps || "Xem trên Google Maps"}</b>
          </a>

          <button type="button" className="v2-action-btn" onClick={() => window.print()}>
            <span>📄</span>
            <b>{t.tripPrintPdf || "In / Xuất PDF"}</b>
          </button>

          <button type="button" className="v2-action-btn" onClick={sharePlan}>
            <span>↗</span>
            <b>{t.tripShare || "Chia sẻ lịch trình"}</b>
          </button>

          <button type="button" className="v2-action-btn" onClick={savePlan}>
            <span>🔖</span>
            <b>{t.tripSaveNotebook || "Lưu vào Sổ tay"}</b>
          </button>
        </div>

        <div className="v2-action-group v2-action-group--right">
          <button
            type="button"
            className={`v2-action-btn v2-action-btn--voice ${showAudioSettings ? "is-active" : ""}`}
            onClick={() => setShowAudioSettings(!showAudioSettings)}
            title={i18n.voiceSettings}
          >
            <span>🗣️</span>
            <b>{showAudioSettings ? i18n.closeSettings : i18n.aiVoiceBtn}</b>
          </button>
        </div>
      </div>

      {/* Expandable Audio Settings Strip */}
      {showAudioSettings && (
        <div className="v2-audio-settings-box">
          <div className="v2-audio-settings-head">
            <div className="v2-audio-settings-label">
              <span>🎙️</span>
              <b>{i18n.voiceSettings}</b>
            </div>
            <div className="v2-audio-lang-switcher" role="group" aria-label="Language Selector">
              {([
                { code: "vi" as const, label: "🇻🇳 Tiếng Việt" },
                { code: "en" as const, label: "🇬🇧 English" },
                { code: "zh" as const, label: "🇨🇳 中文" },
                { code: "ko" as const, label: "🇰🇷 한국어" },
                { code: "ja" as const, label: "🇯🇵 日本語" },
              ]).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`v2-lang-pill ${currentLang === item.code ? "is-active" : ""}`}
                  onClick={() => {
                    if (onLanguageChange) {
                      onLanguageChange(item.code);
                    } else {
                      stopAllAudio();
                      setAudioLang(item.code);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="v2-audio-settings-body">
            {/* Quick Gender Selection Buttons for Vietnamese */}
            {audioLang === "vi" && (
              <div className="v2-audio-control-item" style={{ gridColumn: "1 / -1", marginBottom: "4px" }}>
                <label style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Chọn chất giọng AI:</span>
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700 }}>
                    {selectedVoiceURI === "ai-male-north" || selectedVoiceURI.toLowerCase().includes("nam") || selectedVoiceURI.toLowerCase().includes("male")
                      ? "👔 Đang chọn: Nam trầm ấm"
                      : "🌸 Đang chọn: Nữ êm dịu"}
                  </span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    className={`v2-rate-pill ${
                      selectedVoiceURI === "ai-male-north" ||
                      selectedVoiceURI.toLowerCase().includes("nam") ||
                      selectedVoiceURI.toLowerCase().includes("male")
                        ? "is-active"
                        : ""
                    }`}
                    style={{
                      padding: "9px 12px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      border: "1.5px solid currentColor",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => {
                      setSelectedVoiceURI("ai-male-north");
                    }}
                  >
                    <span>👔</span> Giọng Nam trầm ấm
                  </button>
                  <button
                    type="button"
                    className={`v2-rate-pill ${
                      selectedVoiceURI === "ai-female-north" ||
                      (!selectedVoiceURI.toLowerCase().includes("nam") &&
                        !selectedVoiceURI.toLowerCase().includes("male") &&
                        (selectedVoiceURI.toLowerCase().includes("nữ") ||
                          selectedVoiceURI.toLowerCase().includes("female") ||
                          selectedVoiceURI === "ai-female-north"))
                        ? "is-active"
                        : ""
                    }`}
                    style={{
                      padding: "9px 12px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      border: "1.5px solid currentColor",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => {
                      setSelectedVoiceURI("ai-female-north");
                    }}
                  >
                    <span>🌸</span> Giọng Nữ êm dịu
                  </button>
                </div>
              </div>
            )}

            <div className="v2-audio-control-item v2-audio-control-item--voice">
              <label htmlFor="voice-select">Danh sách giọng chi tiết</label>
              <select
                id="voice-select"
                className="v2-voice-select"
                value={selectedVoiceURI}
                onChange={(e) => {
                  setSelectedVoiceURI(e.target.value);
                }}
              >
                {voiceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="v2-audio-control-item v2-audio-control-item--volume">
              <label>Âm lượng: {Math.round(audioVolume * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={audioVolume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setAudioVolume(v);
                }}
                title={`${t.audioVolumeLabel} ${Math.round(audioVolume * 100)}%`}
                aria-label={t.audioVolumeLabel}
              />
            </div>

            <div className="v2-audio-control-item v2-audio-control-item--speed">
              <label>Tốc độ đọc</label>
              <div className="v2-rate-pills">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`v2-rate-pill ${audioRate === r ? "is-active" : ""}`}
                    onClick={() => {
                      setAudioRate(r);
                      showToast(`✓ Đã chỉnh tốc độ đọc: ${r}x`);
                    }}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TWO-COLUMN SPLIT LAYOUT */}
      <div className="v2-split-layout">
        {/* LEFT COLUMN: DAY HEADER + TIMELINE FLOW + NIGHT STAY + AUDIO + VALUE BADGES */}
        <div className="v2-left-column" ref={timelineRef}>
          {/* Day Header Card */}
          <div className="v2-day-card">
            <div className="v2-day-card__header">
              <div className="v2-day-card__left">
                {generatedItinerary.days.length > 1 ? (
                  <div className="v2-day-badge-tabs" role="tablist">
                    {generatedItinerary.days.map((d) => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        className={`v2-day-pill-badge ${
                          activeItineraryDay === d.dayNumber ? "is-active" : "is-inactive"
                        }`}
                        onClick={() => {
                          setActiveItineraryDay(d.dayNumber);
                          setSelectedDetailSlot(d.slots[0] || null);
                        }}
                        role="tab"
                        aria-selected={activeItineraryDay === d.dayNumber}
                      >
                        {formatDayBadge(d.dayNumber, currentLang)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="v2-day-pill-badge is-active">{formatDayBadge(1, currentLang)}</span>
                )}

                <div className="v2-day-title-box">
                  <div className="v2-day-headline">
                    <svg className="v2-mountain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
                    </svg>
                    <h3 className="v2-day-title">
                      {currentDayPlan
                        ? currentDayPlan.dayTitle.toUpperCase()
                        : getLocalizedItineraryTitle(generatedItinerary, currentLang, t).toUpperCase()}
                    </h3>
                  </div>
                  <p className="v2-day-slogan">
                    {currentDayPlan?.daySummary
                      ? `“${currentDayPlan.daySummary}”`
                      : `“${getLocalizedItinerarySubtitle(generatedItinerary, currentLang, t)}”`}
                  </p>
                </div>
              </div>

              <div className="v2-day-distance-card">
                <div className="v2-distance-top">
                  <span className="v2-distance-pin">📍</span>
                  <b>~{currentDayPlan?.dayDistanceKm || generatedItinerary.totalDistanceKm} km</b>
                </div>
                <small>{i18n.totalDistance}</small>
              </div>
            </div>

            {/* 4 Metrics Strip - Căn đều 4 ô chuẩn xác */}
            <div className="v2-day-metrics-strip">
              <div className="v2-metric-item">
                <div className="v2-metric-icon">🕒</div>
                <div className="v2-metric-text">
                  <b>{firstTime} – {lastTime}</b>
                  <small>{i18n.estTime}</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">🚗</div>
                <div className="v2-metric-text">
                  <b>{getTransportLabel(generatedItinerary.transport, t)}</b>
                  <small>{i18n.transportLabel}</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">📍</div>
                <div className="v2-metric-text">
                  <b>{i18n.stopsCount(allSlots.length)}</b>
                  <small>{i18n.inItinerary}</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">💰</div>
                <div className="v2-metric-text">
                  <b>~{formatMoney(estimatedDayCost)}/{t.tripPerson}</b>
                  <small>{i18n.estCost}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Flow - Tối giản theo đúng thiết kế mẫu image23.png */}
          <div className="v2-timeline-flow">
            {visibleSlots.map((slot, sIdx) => {
              const isSelected = activeDetailSlot === slot;
              const tag = getSlotCategoryTag(slot, currentLang);
              const startTime = slot.timeSlot.split("–")[0]?.trim() || "07:30";
              const driveKm = slot.place ? Math.max(1, Math.round(slot.place.distanceFromVietTri * 0.4 || 12)) : 12;
              const driveMinutes = slot.travelMinutes || 45;
              const minuteUnit = currentLang === "en" ? "mins" : currentLang === "zh" ? "分钟" : currentLang === "ko" ? "분" : currentLang === "ja" ? "分" : "phút";
              const mealTypeLabel = currentLang === "en" ? "🍜 Local Specialties" : currentLang === "zh" ? "🍜 地道风味" : currentLang === "ko" ? "🍜 현지 특산 요리" : currentLang === "ja" ? "🍜 郷土料理" : "🍜 Đặc sản địa phương";

              return (
                <div className="v2-timeline-item" key={sIdx}>
                  <div className="v2-timeline-node">
                    <span className="v2-time-bubble">{startTime}</span>
                    <div className="v2-timeline-line"></div>
                  </div>

                  <article
                    className={`v2-card ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleCardClick(slot)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(slot);
                      }
                    }}
                  >
                    <div className="v2-card__thumb-wrap">
                      <img
                        src={getSlotImage(slot)}
                        alt={slot.title}
                        className="v2-card__thumb"
                        loading="lazy"
                        onError={handleImageError}
                      />
                    </div>

                    <div className="v2-card__content">
                      {/* Dòng 1: Tag phân loại & Giá tiền */}
                      <div className="v2-card__head">
                        <span className={`v2-tag v2-tag--${tag.modifier}`}>{tag.label}</span>
                        <span className="v2-card__cost">
                          {formatMoney(slot.estimatedCostPerPerson)}/{t.tripPerson}
                        </span>
                      </div>

                      {/* Dòng 2: Tiêu đề chặng */}
                      <h4 className="v2-card__title">{slot.title}</h4>
                      
                      {/* Dòng 3: Địa điểm tóm tắt */}
                      <div className="v2-card__location">
                        <span className="v2-loc-pin">📍</span>
                        <span className="v2-loc-text">{getSlotLocationText(slot, currentLang)}</span>
                      </div>

                      {/* Dòng 4: Thời gian di chuyển & thể loại */}
                      <div className="v2-card__meta-strip">
                        <span className="v2-meta-drive">
                          🚗 {driveMinutes} {minuteUnit} · {driveKm} km
                        </span>
                        <span className="v2-meta-sep">·</span>
                        <span className="v2-meta-type">
                          {slot.type === "meal" ? mealTypeLabel : `🎟️ ${tag.label}`}
                        </span>
                      </div>

                      {/* Dòng 5: Điểm nổi bật / Gợi ý món */}
                      <div className="v2-card__highlight-line">
                        <span className="v2-hl-star">⭐</span>
                        <span className="v2-hl-text">
                          <b>{i18n.highlightPrefix}</b> {getSlotHighlightsLine(slot, currentLang)}
                        </span>
                      </div>

                      {/* Dòng 6: Nút Xem chi tiết */}
                      <div className="v2-card__foot">
                        <button
                          type="button"
                          className="v2-expand-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(slot);
                          }}
                        >
                          <span>{i18n.viewDetail}</span>
                          <span className="v2-expand-arrow">⌵</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}

            {/* Collapsible "Các điểm dừng tiếp theo" if > 3 stops */}
            {allSlots.length > 3 && (
              <div className="v2-timeline-item v2-timeline-item--more">
                <div className="v2-timeline-node">
                  <span className="v2-time-bubble v2-time-bubble--more">···</span>
                  <div className="v2-timeline-line"></div>
                </div>
                <button
                  type="button"
                  className="v2-next-stops-toggle"
                  onClick={() =>
                    setExpandedDayStops((prev) => ({
                      ...prev,
                      [activeItineraryDay]: !prev[activeItineraryDay],
                    }))
                  }
                >
                  <span>
                    {i18n.nextStops} (
                    {hiddenCount > 0 && !isExpandedStops
                      ? `${hiddenCount} ${i18n.stopsUnit}`
                      : `${allSlots.length - 3} ${i18n.stopsUnit}`}
                    )
                  </span>
                  <b>{isExpandedStops ? i18n.collapse : "›"}</b>
                </button>
              </div>
            )}

            {/* DEDICATED NIGHT STAY CARD (Ở ĐÂU / NGHỈ ĐÊM) */}
            {currentDayPlan?.stayForNight && (
              <div className="v2-timeline-item v2-timeline-item--night">
                <div className="v2-timeline-node">
                  <span className="v2-timeline-dot v2-timeline-dot--moon">🌙</span>
                  <div className="v2-timeline-line"></div>
                </div>
                <div className="v2-night-stay-card">
                  <div className="v2-night-stay-head">
                    <span className="v2-night-tag">{i18n.nightStayTag} {formatDayBadge(activeItineraryDay, currentLang)}</span>
                    <span className="v2-night-type">{currentDayPlan.stayForNight.type || "Resort / Homestay"}</span>
                  </div>
                  <h4 className="v2-night-title">{currentDayPlan.stayForNight.name}</h4>
                  <p className="v2-night-desc">
                    <b>{i18n.amenitiesExp}</b> {currentDayPlan.stayForNight.note || "Phòng nghỉ tiện nghi, ẩm thực bản địa chu đáo"}
                  </p>
                  <div className="v2-night-foot">
                    <span className="v2-night-addr">📍 {currentDayPlan.stayForNight.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        currentDayPlan.stayForNight.name + " " + currentDayPlan.stayForNight.address
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="v2-night-map-btn"
                    >
                      {i18n.directionsToStay}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Guide Player - Lời dẫn hướng dẫn viên toàn chặng */}
            <div className="v2-timeline-item v2-timeline-item--audio">
              <div className="v2-timeline-node">
                <span className="v2-timeline-dot"></span>
              </div>
              <div className="v2-audio-card">
                <div className="v2-audio-speaker-wrap">
                  <span>🔊</span>
                </div>
                <div className="v2-audio-info">
                  <b>{i18n.guideNarration}</b>
                  <small>
                    {currentDayPlan?.dayTitle || generatedItinerary.title} – {i18n.twoMinStory}
                  </small>
                </div>
                <button
                  type="button"
                  className={`v2-audio-play-btn ${audioGuidePlaying ? "is-playing" : ""}`}
                  onClick={toggleItineraryAudio}
                  title={audioGuidePlaying ? t.audioPause : t.audioListen}
                  aria-label={audioGuidePlaying ? t.audioPause : t.audioListen}
                >
                  {audioGuidePlaying ? "⏸" : "▶"}
                </button>
                <div className="v2-audio-scrubber">
                  <div className="v2-audio-track" onClick={toggleItineraryAudio}>
                    <div
                      className="v2-audio-progress"
                      style={{ width: audioGuidePlaying ? "75%" : "40%" }}
                    ></div>
                  </div>
                  <span className="v2-audio-time">{audioGuidePlaying ? i18n.nowPlaying : "02:15"}</span>
                </div>
              </div>
            </div>

            {/* 4 Value Badges Under Timeline theo mẫu image23.png */}
            <div className="v2-features-strip">
              {i18n.pills.map((pill, pIdx) => {
                const icons = ["🍃", "✨", "📱", "💚"];
                return (
                  <div className="v2-feature-pill" key={pIdx}>
                    <span className="v2-feature-icon">{icons[pIdx] || "✦"}</span>
                    <div className="v2-feature-text">
                      <b>{pill.b}</b>
                      <small>{pill.s}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PANEL THEO MẪU CHUẨN IMAGE23.PNG */}
        <div className="v2-right-column" ref={detailPanelRef}>
          {activeDetailSlot && (
            <aside className="v2-detail-panel" aria-label={i18n.detailSectionTitle}>
              {/* Mobile Back-to-Timeline Button */}
              <div className="v2-mobile-back-bar">
                <button
                  type="button"
                  className="v2-mobile-back-btn"
                  onClick={scrollToTimeline}
                >
                  {i18n.backToList}
                </button>
              </div>

              {/* 1. HERO PHOTO + TIME BADGE */}
              <div className="v2-detail-hero">
                <img
                  src={getSlotImage(activeDetailSlot)}
                  alt={activeDetailSlot.title}
                  className="v2-detail-hero__img"
                  onError={handleImageError}
                />
                <span className="v2-detail-hero__time">{activeDetailSlot.timeSlot}</span>
                <button
                  type="button"
                  className="v2-detail-hero__close"
                  onClick={() => setSelectedDetailSlot(currentDayPlan?.slots[0] || null)}
                  title="✕"
                  aria-label="✕"
                >
                  ✕
                </button>
              </div>

              {/* 2. BODY CONTENT */}
              <div className="v2-detail-body">
                {/* Header chặng: Icon + Tiêu đề + Giá */}
                <div className="v2-detail-header-row">
                  <h3 className="v2-detail-title">
                    <span className="v2-detail-type-icon">
                      {activeDetailSlot.type === "meal"
                        ? "🍽️"
                        : activeDetailSlot.type === "stay"
                        ? "🏨"
                        : "🚗"}
                    </span>{" "}
                    {activeDetailSlot.title}
                  </h3>
                  <span className="v2-detail-cost">
                    {formatMoney(activeDetailSlot.estimatedCostPerPerson)}/{t.tripPerson}
                  </span>
                </div>

                {/* 📍 Địa điểm */}
                <div className="v2-detail-location">
                  <span className="v2-loc-pin">📍</span>
                  <span>{getSlotLocationText(activeDetailSlot, currentLang)}</span>
                </div>

                {/* 🚗 Di chuyển & thể loại */}
                <div className="v2-detail-meta-row">
                  <span>🚗 {activeDetailSlot.travelMinutes || 45} {currentLang === "en" ? "mins" : currentLang === "zh" ? "分钟" : currentLang === "ko" ? "분" : currentLang === "ja" ? "分" : "phút"} · {activeDetailSlot.place ? Math.max(1, Math.round(activeDetailSlot.place.distanceFromVietTri * 0.4 || 12)) : 12} km</span>
                  <span className="v2-meta-badge">
                    {activeDetailSlot.type === "meal" ? (currentLang === "en" ? "🍜 Dining" : currentLang === "zh" ? "🍜 美食餐饮" : currentLang === "ko" ? "🍜 미식" : currentLang === "ja" ? "🍜 グルメ" : "🍜 Ăn uống") : (currentLang === "en" ? "🎟️ Sightseeing" : currentLang === "zh" ? "🎟️ 观光游览" : currentLang === "ko" ? "🎟️ 관광" : currentLang === "ja" ? "🎟️ 観光" : "🎟️ Tham quan")}
                  </span>
                </div>

                {/* ⭐ Điểm nổi bật */}
                <div className="v2-detail-highlight-card">
                  <div className="v2-hl-head">
                    <span className="v2-hl-star">⭐</span>
                    <b>{i18n.highlightPrefix.replace(":", "")}</b>
                  </div>
                  <p className="v2-hl-desc">{getSlotHighlightsLine(activeDetailSlot, currentLang)}</p>
                </div>

                {/* 3. KHỐI "THÔNG TIN CHI TIẾT" CHUẨN IMAGE23.PNG */}
                <div className="v2-detail-section-title">
                  <h4>{i18n.detailSectionTitle}</h4>
                </div>

                {/* Mục 1: Điểm đến */}
                <div className="v2-info-item">
                  <div className="v2-info-item__label">
                    <span>📍</span>
                    <b>{i18n.destinationLabel}</b>
                  </div>
                  <p className="v2-info-item__val">
                    {activeDetailSlot.place
                      ? `${activeDetailSlot.place.name} (${activeDetailSlot.place.location})`
                      : activeDetailSlot.title}
                  </p>
                </div>

                {/* Mục 2: Điểm tham quan (danh sách bullet) */}
                <div className="v2-info-item">
                  <div className="v2-info-item__label">
                    <span>⭐</span>
                    <b>{i18n.sightseeLabel}</b>
                  </div>
                  <ul className="v2-info-bullets">
                    {detailBullets.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <span className="v2-bullet-dot">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mục 3: Ăn uống (gợi ý) */}
                <div className="v2-info-item">
                  <div className="v2-info-item__label">
                    <span>🍽️</span>
                    <b>{i18n.diningLabel}</b>
                  </div>
                  <div className="v2-info-dine-box">
                    <p className="v2-dine-name">
                      <b>{suggestDineName}</b> <small>({suggestDineDist})</small>
                    </p>
                    <p className="v2-dine-dishes">
                      <span>{i18n.tastyDish}</span> {suggestDineDishes}
                    </p>
                  </div>
                </div>

                {/* Mục 4: Lời dẫn hướng dẫn viên + Nút Nghe thuyết minh */}
                <div className="v2-info-item v2-info-item--audio">
                  <div className="v2-info-item__label">
                    <span>🔊</span>
                    <b>{i18n.guideNarration}</b>
                  </div>
                  <div className="v2-quote-card">
                    <p className="v2-quote-text">
                      “{activeQuoteScript}”
                    </p>

                    <button
                      type="button"
                      className={`v2-listen-guide-btn ${isDetailPlacePlaying ? "is-playing" : ""}`}
                      onClick={() => {
                        if (currentSlotAudio) {
                          togglePlaceAudio({
                            id: activeSlotAudioId,
                            name: activeDetailSlot.title,
                            audioScript: slotAudioVi || placeAudioVi || currentSlotAudio,
                            audioScriptEn: slotAudioEn || placeAudioEn || currentSlotAudio,
                          } as any);
                        } else if (activeDetailSlot.place) {
                          togglePlaceAudio(activeDetailSlot.place);
                        } else {
                          toggleItineraryAudio();
                        }
                      }}
                    >
                      <span>{isDetailPlacePlaying ? i18n.pauseGuide : i18n.listenGuide}</span>
                    </button>
                  </div>
                </div>

                {/* 4. CHÂN BẢNG: 2 NÚT HÀNH ĐỘNG "CHỈ ĐƯỜNG" & "LƯU" */}
                <div className="v2-detail-action-footer">
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="v2-action-cta v2-action-cta--map"
                  >
                    <span>↗</span>
                    <b>{i18n.directions}</b>
                  </a>

                  <button
                    type="button"
                    className={`v2-action-cta v2-action-cta--save ${
                      activeDetailSlot.place && favorites.includes(activeDetailSlot.place.id) ? "is-saved" : ""
                    }`}
                    onClick={() => {
                      if (activeDetailSlot.place) {
                        toggleFavorite(activeDetailSlot.place.id);
                        showToast(
                          favorites.includes(activeDetailSlot.place.id)
                            ? (currentLang === "en" ? "Removed from favorites" : currentLang === "zh" ? "已从收藏夹中移除" : currentLang === "ko" ? "즐겨찾기에서 제거되었습니다" : currentLang === "ja" ? "お気に入りから削除しました" : "Đã xóa khỏi sổ tay yêu thích")
                            : (currentLang === "en" ? "Saved to favorites! ✦" : currentLang === "zh" ? "已保存到收藏夹！✦" : currentLang === "ko" ? "즐겨찾기에 저장되었습니다! ✦" : currentLang === "ja" ? "お気に入りに保存しました！✦" : "Đã lưu vào sổ tay yêu thích! ✦")
                        );
                      } else {
                        savePlan();
                      }
                    }}
                  >
                    <span>🔖</span>
                    <b>
                      {activeDetailSlot.place && favorites.includes(activeDetailSlot.place.id)
                        ? i18n.saved
                        : i18n.save}
                    </b>
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
