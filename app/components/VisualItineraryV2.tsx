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
  onLanguageChange?: (lang: LanguageCode) => void;
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
  if (slot.restaurant?.address) return slot.restaurant.address.split(",").slice(0, 2).join(", ").trim();
  if (slot.stay?.address) return slot.stay.address.split(",").slice(0, 2).join(", ").trim();
  if (slot.place?.district) return `${slot.place.district}, ${slot.place.region}`;
  return "Điểm đến trong lịch trình";
}

function getSlotHighlightsLine(slot: ItinerarySlot): string {
  if (slot.type === "meal") {
    const dish = slot.restaurant?.taste || slot.restaurant?.note || slot.place?.restaurants?.[0]?.taste || "Gà đồi, rau su su, đặc sản bản địa...";
    return `Gợi ý món: ${dish.split(/[.;]/)[0].trim()}`;
  }
  if (slot.place?.highlights && slot.place.highlights.length > 0) {
    return `Check-in ${slot.place.highlights.slice(0, 3).join(", ")}.`;
  }
  if (slot.highlightNote) {
    return slot.highlightNote;
  }
  return "Trải nghiệm văn hóa & danh lam thắng cảnh bản địa.";
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
    ? activeDetailSlot.place.highlights
    : activeDetailSlot?.activity
    ? [activeDetailSlot.activity]
    : ["Khám phá không gian văn hóa & danh lam bản địa", "Trải nghiệm ẩm thực và ngắm cảnh thiên nhiên"];

  // Suggest restaurant
  const suggestDineName = activeDetailSlot?.restaurant?.name || activeDetailSlot?.place?.restaurants?.[0]?.name || "Nhà hàng đặc sản bản địa";
  const suggestDineDist = activeDetailSlot?.restaurant?.distance || activeDetailSlot?.place?.restaurants?.[0]?.distance || "cách 0,3 km (2 phút)";
  const suggestDineDishes = activeDetailSlot?.restaurant?.taste || activeDetailSlot?.place?.restaurants?.[0]?.taste || activeDetailSlot?.place?.restaurants?.[0]?.note || "Gà đồi, rau su su, cá suối, cơm lam...";

  // Script text for active detail slot
  const slotAudioVi = activeDetailSlot?.audioScript;
  const slotAudioEn = activeDetailSlot?.audioScriptEn;
  const placeAudioVi = activeDetailSlot?.place?.audioScript;
  const placeAudioEn = activeDetailSlot?.place?.audioScriptEn;

  const currentSlotAudio = audioLang === "en"
    ? (slotAudioEn || slotAudioVi || placeAudioEn || placeAudioVi)
    : (slotAudioVi || placeAudioVi);

  const activeQuoteScript = currentSlotAudio
    ? currentSlotAudio
    : activeDetailSlot?.highlightNote
    ? activeDetailSlot.highlightNote
    : `Chào mừng bạn đến với ${activeDetailSlot?.title}. Không gian thiên nhiên tươi đẹp và di sản cội nguồn sẽ mang lại trải nghiệm đáng nhớ cho hành trình.`;

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
              <b>{audioLang === "en" ? "Narration Voice & Speed" : "Cài đặt giọng đọc & tốc độ"}</b>
            </div>
            <div className="v2-audio-lang-switcher" role="group" aria-label="Chọn ngôn ngữ thuyết minh">
              <button
                type="button"
                className={`v2-lang-pill ${currentLang === "vi" ? "is-active" : ""}`}
                onClick={() => {
                  if (onLanguageChange) {
                    onLanguageChange("vi");
                  } else {
                    stopAllAudio();
                    setAudioLang("vi");
                  }
                }}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                type="button"
                className={`v2-lang-pill ${currentLang === "en" ? "is-active" : ""}`}
                onClick={() => {
                  if (onLanguageChange) {
                    onLanguageChange("en");
                  } else {
                    stopAllAudio();
                    setAudioLang("en");
                    setSelectedVoiceURI("ai-en-us");
                  }
                }}
              >
                🇬🇧 English
              </button>
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
                      if (audioGuidePlaying) stopAllAudio();
                      setSelectedVoiceURI("ai-male-north");
                      showToast("👔 Đã chọn: Giọng AI Nam Hà Nội (Chuẩn Studio - Trầm ấm)");
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
                        selectedVoiceURI !== "ai-male-north")
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
                      if (audioGuidePlaying) stopAllAudio();
                      setSelectedVoiceURI("ai-female-north");
                      showToast("🌸 Đã chọn: Giọng AI Nữ Hà Nội (Chuẩn Studio - Êm ái)");
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
                  const val = e.target.value;
                  setSelectedVoiceURI(val);
                  if (audioGuidePlaying) stopAllAudio();
                  const found = voiceOptions.find(o => o.id === val);
                  showToast(`✓ Đã đổi sang: ${found ? found.label : val}`);
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

            {/* 4 Metrics Strip - Căn đều 4 ô chuẩn xác */}
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

          {/* Timeline Flow - Tối giản theo đúng thiết kế mẫu image23.png */}
          <div className="v2-timeline-flow">
            {visibleSlots.map((slot, sIdx) => {
              const isSelected = activeDetailSlot === slot;
              const tag = getSlotCategoryTag(slot);
              const startTime = slot.timeSlot.split("–")[0]?.trim() || "07:30";
              const driveKm = slot.place ? Math.max(1, Math.round(slot.place.distanceFromVietTri * 0.4 || 12)) : 12;
              const driveMinutes = slot.travelMinutes || 45;

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
                        <span className="v2-loc-text">{getSlotLocationText(slot)}</span>
                      </div>

                      {/* Dòng 4: Thời gian di chuyển & thể loại */}
                      <div className="v2-card__meta-strip">
                        <span className="v2-meta-drive">
                          🚗 {driveMinutes} phút · {driveKm} km
                        </span>
                        <span className="v2-meta-sep">·</span>
                        <span className="v2-meta-type">
                          {slot.type === "meal" ? "🍜 Đặc sản địa phương" : `🎟️ ${tag.label}`}
                        </span>
                      </div>

                      {/* Dòng 5: Điểm nổi bật / Gợi ý món */}
                      <div className="v2-card__highlight-line">
                        <span className="v2-hl-star">⭐</span>
                        <span className="v2-hl-text">
                          <b>Điểm nổi bật:</b> {getSlotHighlightsLine(slot)}
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
                          <span>Xem chi tiết</span>
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
                    <b>Tiện ích & trải nghiệm:</b> {currentDayPlan.stayForNight.note || "Phòng nghỉ tiện nghi, ẩm thực bản địa chu đáo"}
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
                  <b>Lời dẫn hướng dẫn viên</b>
                  <small>
                    {currentDayPlan?.dayTitle || generatedItinerary.title} – câu chuyện 2 phút
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

            {/* 4 Value Badges Under Timeline theo mẫu image23.png */}
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
                  <b>Giữ đủ thông tin</b>
                  <small>nhưng không rối</small>
                </div>
              </div>

              <div className="v2-feature-pill">
                <span className="v2-feature-icon">📱</span>
                <div className="v2-feature-text">
                  <b>Thân thiện</b>
                  <small>trên cả máy tính & điện thoại</small>
                </div>
              </div>

              <div className="v2-feature-pill">
                <span className="v2-feature-icon">💚</span>
                <div className="v2-feature-text">
                  <b>Tăng trải nghiệm</b>
                  <small>và tỷ lệ sử dụng</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PANEL THEO MẪU CHUẨN IMAGE23.PNG */}
        <div className="v2-right-column" ref={detailPanelRef}>
          {activeDetailSlot && (
            <aside className="v2-detail-panel" aria-label="Thông tin chi tiết điểm đến">
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
                  title="Đóng"
                  aria-label="Đóng"
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
                  <span>{getSlotLocationText(activeDetailSlot)}</span>
                </div>

                {/* 🚗 Di chuyển & thể loại */}
                <div className="v2-detail-meta-row">
                  <span>🚗 {activeDetailSlot.travelMinutes || 45} phút · {activeDetailSlot.place ? Math.max(1, Math.round(activeDetailSlot.place.distanceFromVietTri * 0.4 || 12)) : 12} km</span>
                  <span className="v2-meta-badge">
                    {activeDetailSlot.type === "meal" ? "🍜 Ăn uống" : "🎟️ Tham quan"}
                  </span>
                </div>

                {/* ⭐ Điểm nổi bật */}
                <div className="v2-detail-highlight-card">
                  <div className="v2-hl-head">
                    <span className="v2-hl-star">⭐</span>
                    <b>Điểm nổi bật</b>
                  </div>
                  <p className="v2-hl-desc">{getSlotHighlightsLine(activeDetailSlot)}</p>
                </div>

                {/* 3. KHỐI "THÔNG TIN CHI TIẾT" CHUẨN IMAGE23.PNG */}
                <div className="v2-detail-section-title">
                  <h4>Thông tin chi tiết</h4>
                </div>

                {/* Mục 1: Điểm đến */}
                <div className="v2-info-item">
                  <div className="v2-info-item__label">
                    <span>📍</span>
                    <b>Điểm đến</b>
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
                    <b>Điểm tham quan</b>
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
                    <b>Ăn uống (gợi ý)</b>
                  </div>
                  <div className="v2-info-dine-box">
                    <p className="v2-dine-name">
                      <b>{suggestDineName}</b> <small>({suggestDineDist})</small>
                    </p>
                    <p className="v2-dine-dishes">
                      <span>Món ngon:</span> {suggestDineDishes}
                    </p>
                  </div>
                </div>

                {/* Mục 4: Lời dẫn hướng dẫn viên + Nút Nghe thuyết minh */}
                <div className="v2-info-item v2-info-item--audio">
                  <div className="v2-info-item__label">
                    <span>🔊</span>
                    <b>Lời dẫn hướng dẫn viên</b>
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
                      <span>{isDetailPlacePlaying ? "⏸ Tạm dừng nghe" : "▶ Nghe thuyết minh điểm này"}</span>
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
                    <b>Chỉ đường</b>
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
                            ? "Đã xóa khỏi sổ tay yêu thích"
                            : "Đã lưu vào sổ tay yêu thích! ✦"
                        );
                      } else {
                        savePlan();
                      }
                    }}
                  >
                    <span>🔖</span>
                    <b>
                      {activeDetailSlot.place && favorites.includes(activeDetailSlot.place.id)
                        ? "Đã lưu"
                        : "Lưu"}
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
