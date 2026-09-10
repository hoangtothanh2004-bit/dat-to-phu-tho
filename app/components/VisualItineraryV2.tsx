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
  audioLang: "vi" | "en";
  setAudioLang: (lang: "vi" | "en") => void;
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
};

function getSlotImage(slot: ItinerarySlot): string {
  if (slot.place?.image) return slot.place.image;
  if (slot.restaurant?.image) return slot.restaurant.image;
  if (slot.stay?.image) return slot.stay.image;
  if (slot.type === "meal") return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80";
  if (slot.type === "stay") return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80";
}

function getSlotCategoryTag(slot: ItinerarySlot): { label: string; modifier: string } {
  if (slot.type === "meal") {
    return { label: "Ăn uống", modifier: "food" };
  }
  if (slot.type === "stay") {
    return { label: "Nghỉ ngơi", modifier: "stay" };
  }
  if (slot.place?.category === "Di sản & tâm linh") {
    return { label: "Tâm linh", modifier: "heritage" };
  }
  if (slot.place?.category === "Núi rừng & sinh thái") {
    return { label: "Sinh thái", modifier: "nature" };
  }
  if (slot.place?.category === "Nghỉ dưỡng & chữa lành") {
    return { label: "Nghỉ dưỡng", modifier: "relax" };
  }
  return { label: "Tham quan", modifier: "sightsee" };
}

function getSlotLocationText(slot: ItinerarySlot): string {
  if (slot.place?.location) return slot.place.location;
  if (slot.restaurant?.address) return slot.restaurant.address;
  if (slot.stay?.address) return slot.stay.address;
  if (slot.place?.district) return `${slot.place.district}, ${slot.place.region}`;
  return "Điểm đến trong lịch trình";
}

export type SlotFivePillars = {
  where: {
    label: string;
    title: string;
    detail: string;
    highlights: string[];
  };
  dine: {
    label: string;
    title: string;
    detail: string;
    distance: string;
  };
  stay: {
    label: string;
    title: string;
    detail: string;
    isNightStay: boolean;
  };
  transport: {
    label: string;
    title: string;
    detail: string;
    distanceKm: number;
  };
  duration: {
    label: string;
    timeSlot: string;
    durationText: string;
  };
};

function getSlotPillars(slot: ItinerarySlot, dayPlan?: ItineraryDay): SlotFivePillars {
  // 1. Đi đâu
  const whereTitle = slot.place?.name || (slot.type === "meal" ? (slot.restaurant?.name || "Điểm dừng ẩm thực") : slot.title);
  const whereDetail = slot.place
    ? `${slot.place.location} (${slot.place.district}, ${slot.place.region})`
    : slot.activity;
  const whereHighlights = slot.place?.highlights || [];

  // 2. Ăn gì
  const dineTitle = slot.restaurant
    ? slot.restaurant.name
    : slot.place?.restaurants?.[0]?.name
    ? slot.place.restaurants[0].name
    : "Đặc sản bản địa theo vùng";
  const dineDetail = slot.restaurant
    ? `${slot.restaurant.note || slot.restaurant.taste || "Món ngon nổi bật"} – ${slot.restaurant.address}`
    : slot.place?.restaurants?.[0]
    ? `${slot.place.restaurants[0].note || slot.place.restaurants[0].taste || "Món ngon địa phương"} – ${slot.place.restaurants[0].address}`
    : "Gà đồi nướng, cá lăng om chuối đậu, rau su su, thịt chua Thanh Sơn";
  const dineDistance = slot.restaurant?.distance || slot.place?.restaurants?.[0]?.distance || "Khu vực lân cận (~1-3 km)";

  // 3. Ở đâu
  const hasDirectStay = !!slot.stay;
  const stayTitle = slot.stay
    ? slot.stay.name
    : dayPlan?.stayForNight
    ? dayPlan.stayForNight.name
    : "Khách sạn / Homestay trung tâm";
  const stayDetail = slot.stay
    ? `${slot.stay.note || "Tiêu chuẩn lưu trú chất lượng"} – ${slot.stay.address}`
    : dayPlan?.stayForNight
    ? `${dayPlan.stayForNight.note || "Resort / Homestay nghỉ đêm lý tưởng"} – ${dayPlan.stayForNight.address}`
    : "Nghỉ ngơi linh hoạt gần trung tâm các điểm tham quan";

  // 4. Phương tiện
  const transportTitle = slot.transportAdvice
    ? slot.transportAdvice.split(".")[0].slice(0, 48)
    : "Ô tô riêng / Xe máy du lịch";
  const transportDetail = slot.transportAdvice || "Di chuyển trên các trục đường nhựa chính, giao thông kết nối thông suốt";
  const distanceKm = slot.place ? Math.max(1, Math.round(slot.place.distanceFromVietTri * 0.4 || 12)) : 12;

  // 5. Thời gian
  const timeSlot = slot.timeSlot;
  const durationText = slot.travelMinutes
    ? `Dừng trải nghiệm ~${Math.max(60, 180 - slot.travelMinutes)} phút (di chuyển ~${slot.travelMinutes}p)`
    : "Thời gian thư thái: 90 – 120 phút";

  return {
    where: { label: "Đi đâu", title: whereTitle, detail: whereDetail, highlights: whereHighlights },
    dine: { label: "Ăn gì", title: dineTitle, detail: dineDetail, distance: dineDistance },
    stay: { label: "Ở đâu", title: stayTitle, detail: stayDetail, isNightStay: !hasDirectStay && !!dayPlan?.stayForNight },
    transport: { label: "Phương tiện", title: transportTitle, detail: transportDetail, distanceKm },
    duration: { label: "Thời gian", timeSlot, durationText },
  };
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
  } = props;

  const [activeItineraryDay, setActiveItineraryDay] = useState<number>(1);
  const [selectedDetailSlot, setSelectedDetailSlot] = useState<ItinerarySlot | null>(null);
  const [isDetailAccordionOpen, setIsDetailAccordionOpen] = useState<boolean>(true);
  const [expandedDayStops, setExpandedDayStops] = useState<Record<number, boolean>>({});
  const [expandedCardSlots, setExpandedCardSlots] = useState<Record<string, boolean>>({});
  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false);

  const detailPanelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Reset day and slot when itinerary changes
  useEffect(() => {
    setActiveItineraryDay(1);
    setSelectedDetailSlot(null);
    setExpandedCardSlots({});
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

  const toggleCardExpanded = (slotKey: string, slot: ItinerarySlot) => {
    setExpandedCardSlots((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey],
    }));
    setSelectedDetailSlot(slot);
  };

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activePillars = activeDetailSlot ? getSlotPillars(activeDetailSlot, currentDayPlan) : null;

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
              title={isBuilderCollapsed ? "Mở bộ lọc để chỉnh sửa điểm đến" : "Thu gọn bộ lọc để xem toàn cảnh"}
            >
              <span>⚙️</span>
              <b>{isBuilderCollapsed ? "Tùy biến chuyến đi" : "Đóng bộ lọc"}</b>
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
            title="Tùy chỉnh giọng đọc thuyết minh AI"
          >
            <span>🗣️</span>
            <b>{showAudioSettings ? "Đóng cài đặt" : "Giọng đọc AI"}</b>
          </button>
        </div>
      </div>

      {/* Expandable Audio Settings Strip */}
      {showAudioSettings && (
        <div className="v2-audio-settings-box">
          <div className="v2-audio-settings-head">
            <div className="v2-audio-settings-label">
              <span>🎙️</span>
              <b>{t.audioVoiceLabel || "Cài đặt giọng đọc thuyết minh"}:</b>
            </div>
            <div className="v2-audio-lang-switcher" role="group" aria-label="Chọn ngôn ngữ thuyết minh">
              <button
                type="button"
                className={`v2-lang-pill ${audioLang === "vi" ? "is-active" : ""}`}
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
                className={`v2-lang-pill ${audioLang === "en" ? "is-active" : ""}`}
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

          <div className="v2-audio-settings-body">
            <div className="v2-audio-control-item v2-audio-control-item--voice">
              <label htmlFor="voice-select">Giọng đọc</label>
              <select
                id="voice-select"
                className="v2-voice-select"
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
                {[0.75, 0.9, 1.0, 1.25, 1.5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`v2-rate-pill ${audioRate === r ? "is-active" : ""}`}
                    onClick={() => setAudioRate(r)}
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
                        NGÀY {d.dayNumber}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="v2-day-pill-badge is-active">NGÀY 1</span>
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
                <small>(tổng quãng đường)</small>
              </div>
            </div>

            {/* 4 Metrics Strip */}
            <div className="v2-day-metrics-strip">
              <div className="v2-metric-item">
                <div className="v2-metric-icon">🕒</div>
                <div className="v2-metric-text">
                  <b>{firstTime} – {lastTime}</b>
                  <small>(thời gian dự kiến)</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">🚗</div>
                <div className="v2-metric-text">
                  <b>{getTransportLabel(generatedItinerary.transport, t)}</b>
                  <small>(phương tiện)</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">📍</div>
                <div className="v2-metric-text">
                  <b>{allSlots.length} điểm dừng</b>
                  <small>(trong lịch trình)</small>
                </div>
              </div>

              <div className="v2-metric-item">
                <div className="v2-metric-icon">💰</div>
                <div className="v2-metric-text">
                  <b>~{formatMoney(estimatedDayCost)}/{t.tripPerson}</b>
                  <small>(chi phí dự kiến)</small>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Flow */}
          <div className="v2-timeline-flow">
            {visibleSlots.map((slot, sIdx) => {
              const isSelected = activeDetailSlot === slot;
              const tag = getSlotCategoryTag(slot);
              const pillars = getSlotPillars(slot, currentDayPlan);
              const startTime = slot.timeSlot.split("–")[0]?.trim() || "07:30";
              const slotKey = `${activeItineraryDay}-${sIdx}-${slot.title}`;
              const isCardExpanded = !!expandedCardSlots[slotKey];

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
                      <div className="v2-card__head">
                        <span className={`v2-tag v2-tag--${tag.modifier}`}>{tag.label}</span>
                        <span className="v2-card__cost">
                          {formatMoney(slot.estimatedCostPerPerson)}/{t.tripPerson}
                        </span>
                      </div>

                      <h4 className="v2-card__title">{slot.title}</h4>
                      
                      <div className="v2-card__location">
                        <span>📍</span>
                        <span title={getSlotLocationText(slot)}>{getSlotLocationText(slot)}</span>
                      </div>

                      {/* 5-PILLARS COMPACT STRIP */}
                      <div className="v2-card-pillars">
                        <div className="v2-card-pillar-row">
                          <span className="v2-pillar-badge-label">📍 Đi đâu:</span>
                          <span className="v2-pillar-badge-val">{pillars.where.title}</span>
                        </div>
                        <div className="v2-card-pillar-row">
                          <span className="v2-pillar-badge-label">🍽️ Ăn gì:</span>
                          <span className="v2-pillar-badge-val">{pillars.dine.title}</span>
                        </div>
                        <div className="v2-card-pillar-row">
                          <span className="v2-pillar-badge-label">🏨 Ở đâu:</span>
                          <span className="v2-pillar-badge-val">{pillars.stay.title}</span>
                        </div>
                        <div className="v2-card-pillar-row v2-card-pillar-row--meta">
                          <span>🚗 {pillars.transport.title}</span>
                          <span>⏱️ {slot.timeSlot}</span>
                        </div>
                      </div>

                      <div className="v2-card__foot">
                        <button
                          type="button"
                          className={`v2-expand-btn ${isCardExpanded ? "is-expanded" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardExpanded(slotKey, slot);
                          }}
                        >
                          <span>{isCardExpanded ? "Thu gọn chi tiết 5 yếu tố" : "Xem chi tiết 5 yếu tố"}</span>
                          <span className="v2-expand-arrow">{isCardExpanded ? "▴" : "⌵"}</span>
                        </button>
                      </div>

                      {/* IN-PLACE ACCORDION: EXPANDED 5 PILLARS */}
                      {isCardExpanded && (
                        <div className="v2-card-expanded-pillars" onClick={(e) => e.stopPropagation()}>
                          <div className="v2-expanded-pillar-item">
                            <div className="v2-expanded-pillar-head">
                              <span className="v2-expanded-pillar-icon">📍</span>
                              <b>1. Đi đâu: {pillars.where.title}</b>
                            </div>
                            <p className="v2-expanded-pillar-body">{pillars.where.detail}</p>
                            {pillars.where.highlights && pillars.where.highlights.length > 0 && (
                              <div className="v2-expanded-highlights">
                                {pillars.where.highlights.map((h, i) => (
                                  <span key={i} className="v2-expanded-badge">✨ {h}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="v2-expanded-pillar-item">
                            <div className="v2-expanded-pillar-head">
                              <span className="v2-expanded-pillar-icon">🍽️</span>
                              <b>2. Ăn gì: {pillars.dine.title}</b>
                              {pillars.dine.distance && (
                                <span className="v2-expanded-tag">Cách ~{pillars.dine.distance}</span>
                              )}
                            </div>
                            <p className="v2-expanded-pillar-body">{pillars.dine.detail}</p>
                          </div>

                          <div className="v2-expanded-pillar-item">
                            <div className="v2-expanded-pillar-head">
                              <span className="v2-expanded-pillar-icon">🏨</span>
                              <b>3. Ở đâu: {pillars.stay.title}</b>
                            </div>
                            <p className="v2-expanded-pillar-body">{pillars.stay.detail}</p>
                          </div>

                          <div className="v2-expanded-pillar-item">
                            <div className="v2-expanded-pillar-head">
                              <span className="v2-expanded-pillar-icon">🚗</span>
                              <b>4. Phương tiện: {pillars.transport.title} (~{pillars.transport.distanceKm} km)</b>
                            </div>
                            <p className="v2-expanded-pillar-body">{pillars.transport.detail}</p>
                          </div>

                          <div className="v2-expanded-pillar-item v2-expanded-pillar-item--meta">
                            <div className="v2-expanded-meta-col">
                              <span className="v2-expanded-meta-label">⏱️ Khung giờ & Thời lượng:</span>
                              <span className="v2-expanded-meta-val">{slot.timeSlot} – {pillars.duration.durationText}</span>
                            </div>
                            <div className="v2-expanded-meta-col">
                              <span className="v2-expanded-meta-label">💵 Chi phí ước tính:</span>
                              <span className="v2-expanded-meta-val text-emerald">
                                {formatMoney(slot.estimatedCostPerPerson)} / người
                              </span>
                            </div>
                          </div>

                          {slot.highlightNote && (
                            <div className="v2-expanded-tip">
                              <span>💡 <b>Lưu ý trải nghiệm:</b> {slot.highlightNote}</span>
                            </div>
                          )}
                        </div>
                      )}
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
                    Các điểm dừng tiếp theo (
                    {hiddenCount > 0 && !isExpandedStops
                      ? `${hiddenCount} điểm`
                      : `${allSlots.length - 3} điểm`}
                    )
                  </span>
                  <b>{isExpandedStops ? "Thu gọn ▴" : "›"}</b>
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
                    <span className="v2-night-tag">🏨 ĐIỂM NGHỈ ĐÊM NGÀY {activeItineraryDay}</span>
                    <span className="v2-night-type">{currentDayPlan.stayForNight.type || "Resort / Homestay"}</span>
                  </div>
                  <h4 className="v2-night-title">{currentDayPlan.stayForNight.name}</h4>
                  <p className="v2-night-desc">
                    <b>Tiện ích & trải nghiệm:</b> {currentDayPlan.stayForNight.note || "Phòng nghỉ tiện nghi, ẩm thực bản địa"}
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
                      ↗ Đường đến chỗ nghỉ
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Guide Player */}
            <div className="v2-timeline-item v2-timeline-item--audio">
              <div className="v2-timeline-node">
                <span className="v2-timeline-dot"></span>
              </div>
              <div className="v2-audio-card">
                <div className="v2-audio-speaker-wrap">
                  <span>🔊</span>
                </div>
                <div className="v2-audio-info">
                  <b>Lời dẫn hướng dẫn viên toàn chặng</b>
                  <small>
                    {currentDayPlan?.dayTitle || generatedItinerary.title} – câu chuyện văn hóa bản địa
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
                  <span className="v2-audio-time">{audioGuidePlaying ? "Đang phát" : "02:15"}</span>
                </div>
              </div>
            </div>

            {/* 4 Value Badges Under Timeline */}
            <div className="v2-features-strip">
              <div className="v2-feature-pill">
                <span className="v2-feature-icon">🍃</span>
                <div className="v2-feature-text">
                  <b>Gọn gàng</b>
                  <small>trực quan</small>
                </div>
              </div>

              <div className="v2-feature-pill">
                <span className="v2-feature-icon">✨</span>
                <div className="v2-feature-text">
                  <b>Đủ 5 yếu tố</b>
                  <small>Đi đâu · Ăn gì · Ở đâu</small>
                </div>
              </div>

              <div className="v2-feature-pill">
                <span className="v2-feature-icon">📱</span>
                <div className="v2-feature-text">
                  <b>Thân thiện</b>
                  <small>chuẩn máy tính & điện thoại</small>
                </div>
              </div>

              <div className="v2-feature-pill">
                <span className="v2-feature-icon">💚</span>
                <div className="v2-feature-text">
                  <b>Tối ưu trải nghiệm</b>
                  <small>chuyến đi thảnh thơi</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PANEL */}
        <div className="v2-right-column" ref={detailPanelRef}>
          {activeDetailSlot && activePillars && (
            <aside className="v2-detail-panel" aria-label="Chi tiết điểm tham quan và 5 yếu tố">
              {/* Mobile Back-to-Timeline Button */}
              <div className="v2-mobile-back-bar">
                <button
                  type="button"
                  className="v2-mobile-back-btn"
                  onClick={scrollToTimeline}
                >
                  ↑ Trở lại danh sách các điểm dừng
                </button>
              </div>

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
                  title="Điểm đầu tiên"
                  aria-label="Điểm đầu tiên"
                >
                  ✕
                </button>
              </div>

              <div className="v2-detail-body">
                <div className="v2-detail-header-row">
                  <h3 className="v2-detail-title">
                    <span className="v2-detail-type-icon">
                      {activeDetailSlot.type === "meal"
                        ? "🍽️"
                        : activeDetailSlot.type === "stay"
                        ? "🏨"
                        : "📍"}
                    </span>{" "}
                    {activeDetailSlot.title}
                  </h3>
                  <span className="v2-detail-cost">
                    {formatMoney(activeDetailSlot.estimatedCostPerPerson)}/{t.tripPerson}
                  </span>
                </div>

                <div className="v2-detail-location">
                  <span>📍</span>
                  <span>{getSlotLocationText(activeDetailSlot)}</span>
                </div>

                {/* HIGHLIGHTED 5 PILLARS SYSTEM CARD */}
                <div className="v2-detail-pillars-box">
                  <div className="v2-detail-pillars-head">
                    <span className="v2-pillars-spark">✦</span>
                    <div>
                      <h4>5 YẾU TỐ HÀNH TRÌNH TIÊU CHUẨN</h4>
                      <small>Thông tin cốt lõi trả lời trọn vẹn thắc mắc của bạn</small>
                    </div>
                  </div>

                  <div className="v2-pillar-grid">
                    {/* 1. Đi đâu */}
                    <div className="v2-pillar-block v2-pillar-block--where">
                      <div className="v2-pillar-block__head">
                        <span className="v2-pillar-badge">📍 ĐI ĐÂU</span>
                        <b>{activePillars.where.title}</b>
                      </div>
                      <p>{activePillars.where.detail}</p>
                      {activePillars.where.highlights.length > 0 && (
                        <div className="v2-pillar-sub-chips">
                          {activePillars.where.highlights.slice(0, 3).map((h, i) => (
                            <span key={i} className="v2-sub-chip">✓ {h}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. Ăn gì */}
                    <div className="v2-pillar-block v2-pillar-block--dine">
                      <div className="v2-pillar-block__head">
                        <span className="v2-pillar-badge">🍽️ ĂN GÌ</span>
                        <b>{activePillars.dine.title}</b>
                      </div>
                      <p>{activePillars.dine.detail}</p>
                      <small className="v2-pillar-note">Khoảng cách: {activePillars.dine.distance}</small>
                    </div>

                    {/* 3. Ở đâu */}
                    <div className="v2-pillar-block v2-pillar-block--stay">
                      <div className="v2-pillar-block__head">
                        <span className="v2-pillar-badge">🏨 Ở ĐÂU</span>
                        <b>{activePillars.stay.title}</b>
                      </div>
                      <p>{activePillars.stay.detail}</p>
                      {activePillars.stay.isNightStay && (
                        <span className="v2-night-tag-small">🌙 Điểm lưu trú nghỉ đêm của ngày</span>
                      )}
                    </div>

                    {/* 4. Phương tiện */}
                    <div className="v2-pillar-block v2-pillar-block--transport">
                      <div className="v2-pillar-block__head">
                        <span className="v2-pillar-badge">🚗 PHƯƠNG TIỆN</span>
                        <b>{activePillars.transport.title}</b>
                      </div>
                      <p>{activePillars.transport.detail}</p>
                      <small className="v2-pillar-note">Cự ly chặng: ~{activePillars.transport.distanceKm} km</small>
                    </div>

                    {/* 5. Thời gian */}
                    <div className="v2-pillar-block v2-pillar-block--duration">
                      <div className="v2-pillar-block__head">
                        <span className="v2-pillar-badge">⏱️ THỜI GIAN</span>
                        <b>{activePillars.duration.timeSlot}</b>
                      </div>
                      <p>{activePillars.duration.durationText}</p>
                      <small className="v2-pillar-note">Khung giờ trải nghiệm lý tưởng</small>
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion "Mẹo & Thuyết minh mở rộng" */}
                <div className="v2-accordion">
                  <button
                    type="button"
                    className="v2-accordion-head"
                    onClick={() => setIsDetailAccordionOpen(!isDetailAccordionOpen)}
                    aria-expanded={isDetailAccordionOpen}
                  >
                    <span>Mẹo du lịch & Lời dẫn thuyết minh</span>
                    <b className="v2-accordion-arrow">{isDetailAccordionOpen ? "⌃" : "⌄"}</b>
                  </button>

                  {isDetailAccordionOpen && (
                    <div className="v2-accordion-content">
                      {/* Lời khuyên của hướng dẫn viên */}
                      {activeDetailSlot.highlightNote && (
                        <div className="v2-detail-info-block">
                          <label>💡 Lời khuyên du lịch</label>
                          <p className="v2-detail-tip-text">
                            {activeDetailSlot.highlightNote}
                          </p>
                        </div>
                      )}

                      {/* Lời dẫn thuyết minh */}
                      <div className="v2-detail-info-block">
                        <label>🎙️ Lời dẫn hướng dẫn viên AI</label>
                        <div className="v2-detail-quote">
                          “
                          {activeDetailSlot.place?.audioScript
                            ? activeDetailSlot.place.audioScript.slice(0, 190) + "..."
                            : activeDetailSlot.activity}
                          ”
                        </div>

                        <button
                          type="button"
                          className="v2-detail-audio-btn"
                          onClick={() => {
                            if (activeDetailSlot.place) {
                              togglePlaceAudio(activeDetailSlot.place);
                            } else {
                              toggleItineraryAudio();
                            }
                          }}
                        >
                          {speechPlaceId === activeDetailSlot.place?.id && audioState === "playing"
                            ? "⏸ Tạm dừng thuyết minh"
                            : "▶ Nghe thuyết minh điểm này"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="v2-detail-footer">
                <a
                  href={
                    activeDetailSlot.place
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          activeDetailSlot.place.name + " " + activeDetailSlot.place.location
                        )}`
                      : generatedItinerary.googleMapsUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="v2-detail-btn v2-detail-btn--primary"
                >
                  ↗ Chỉ đường Google Maps
                </a>

                <button
                  type="button"
                  className="v2-detail-btn v2-detail-btn--outline"
                  onClick={() => {
                    if (activeDetailSlot.place) {
                      toggleFavorite(activeDetailSlot.place.id);
                      showToast(
                        favorites.includes(activeDetailSlot.place.id)
                          ? "Đã bỏ lưu điểm"
                          : "Đã lưu điểm vào Sổ tay du lịch!"
                      );
                    } else {
                      showToast("Đã lưu điểm dừng vào hành trình!");
                    }
                  }}
                >
                  🔖{" "}
                  {activeDetailSlot.place && favorites.includes(activeDetailSlot.place.id)
                    ? "Đã lưu"
                    : "Lưu sổ tay"}
                </button>
              </div>
            </aside>
          )}

          {/* Handwritten annotation */}
          <div className="v2-handwritten-note">
            <svg className="v2-handwritten-arrow" viewBox="0 0 44 44" fill="none" stroke="currentColor">
              <path d="M 38 38 C 22 42 12 28 10 10" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 5 18 L 10 10 L 18 14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>
              Đầy đủ 5 câu hỏi cốt lõi: <b>Đi đâu – Ăn gì – Ở đâu – Phương tiện – Thời gian</b>.<br />
              Bấm vào từng điểm dừng để xem chi tiết từng chặng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
