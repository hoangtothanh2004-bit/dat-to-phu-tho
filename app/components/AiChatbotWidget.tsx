"use client";

import React, { useState, useEffect, useRef } from "react";
import { type GeneratedItinerary } from "@/lib/guidePlanner";
import { processAiMessage, type AiSurveyState, checkOutOfScope } from "@/lib/aiChatEngine";

export type AiChatbotWidgetProps = {
  authUser: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: string;
  } | null;
  onOpenAuthModal?: () => void;
  onApplyItinerary: (itinerary: GeneratedItinerary, params?: {
    days: number;
    transport: string;
    style: string;
    travelers: number;
    anchorId: string;
  }) => void;
  onSaveItinerary?: (itinerary: GeneratedItinerary) => void;
  showToast?: (message: string) => void;
  currentLang?: string;
};

type ChatMessage = {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  options?: Array<{ label: string; value: string; icon?: string }>;
  itinerary?: GeneratedItinerary;
};

const initialSurveyState: AiSurveyState = {
  destinationText: "",
  anchorPlaceId: "",
  selectedPlaceIds: [],
  durationDays: undefined,
  travelers: undefined,
  transport: undefined,
  budget: "Tiêu chuẩn",
  style: undefined,
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function AiChatbotWidget({
  authUser,
  onOpenAuthModal,
  onApplyItinerary,
  onSaveItinerary,
  showToast,
  currentLang = "vi",
}: AiChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [survey, setSurvey] = useState<AiSurveyState>(initialSurveyState);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevAuthUserIdRef = useRef<string | null>(null);

  const isEn = currentLang === "en";

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  // Show floating tooltip greeting after 1.8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Format current time
  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  // Generate initial greeting message
  const buildWelcomeMessage = (userName?: string): ChatMessage => {
    const time = getTimeString();
    if (userName) {
      return {
        id: "msg-welcome",
        sender: "ai",
        text: isEn
          ? `Hello **${userName}**! 👋 I am **Dat To AI Assistant**.\n\nI can intelligently understand your travel needs and generate an optimized itinerary for **Phu Tho, Tam Dao, Mai Chau**!\n\nYou can chat naturally, for example:\n- *"Plan a 3 days 2 nights trip to Tam Dao for 2 people"*\n- *"1-day Hung Temple tour by motorbike"*\n- *"What are the best local specialties?"*`
          : `Xin chào **${userName}**! 👋 Em là **Trợ lý AI Đất Tổ**.\n\nRất vui được đồng hành cùng bạn! Em có thể tự động hiểu yêu cầu và thiết kế lịch trình du lịch tối ưu cho **Phú Thọ và các tuyến liên kết (Tam Đảo, Tây Thiên, Mai Châu)**.\n\nBạn có thể nhắn tự nhiên cho em bất kỳ câu nào, ví dụ:\n- *"Lên lịch trình Tam Đảo 3 ngày 2 đêm cho 2 người"*\n- *"Đi Đền Hùng 1 ngày bằng xe máy"*\n- *"Đặc sản Phú Thọ có những món gì ngon?"*`,
        timestamp: time,
        options: [
          { label: "🌫️ Lên lịch trình Tam Đảo (2N1Đ / 3N2Đ)", value: "plan_tam_dao", icon: "🏔️" },
          { label: "🏛️ Tour cội nguồn Đền Hùng", value: "plan_den_hung", icon: "🏛️" },
          { label: "🍃 Săn mây Đồi chè Long Cốc", value: "plan_long_coc", icon: "📸" },
          { label: "♨️ Nghỉ dưỡng khoáng nóng Thanh Thủy", value: "plan_thanh_thuy", icon: "💆" },
          { label: "🍲 Gợi ý đặc sản OCOP", value: "ask_foods", icon: "🥢" },
        ],
      };
    } else {
      return {
        id: "msg-welcome",
        sender: "ai",
        text: isEn
          ? `Hello! 👋 I am **Dat To AI Assistant** — your smart travel companion in Phu Tho & connected destinations.\n\nTell me where you want to go, how many days, and how many people. I will build an accurate itinerary instantly!`
          : `Xin chào bạn! 👋 Em là **Trợ lý AI Đất Tổ** — bạn đồng hành du lịch thông minh tại Phú Thọ & các tuyến liên kết.\n\nBạn chỉ cần cho em biết bạn muốn đi đâu, mấy ngày, mấy người (Ví dụ: *"Lên lịch trình Tam Đảo 3 ngày 2 đêm cho 2 người"*). Em sẽ tự động phân tích và tạo lịch trình trực quan ngay cho bạn!`,
        timestamp: time,
        options: [
          { label: "🌫️ Lên lịch trình Tam Đảo", value: "plan_tam_dao", icon: "🏔️" },
          { label: "🏛️ Khám phá Đền Hùng & Việt Trì", value: "plan_den_hung", icon: "🏛️" },
          { label: "🍃 Đồi chè Long Cốc & Xuân Sơn", value: "plan_long_coc", icon: "📸" },
          { label: "♨️ Khoáng nóng Thanh Thủy", value: "plan_thanh_thuy", icon: "💆" },
          { label: "👤 Đăng nhập tài khoản để lưu lịch trình", value: "open_login", icon: "🔑" },
        ],
      };
    }
  };

  // Re-greet if authUser changes
  useEffect(() => {
    const currentUserId = authUser?.id || null;
    if (messages.length === 0 || prevAuthUserIdRef.current !== currentUserId) {
      prevAuthUserIdRef.current = currentUserId;
      const welcome = buildWelcomeMessage(authUser?.name);
      setMessages([welcome]);
      setSurvey(initialSurveyState);
    }
  }, [authUser?.id, authUser?.name, isEn]);

  const surveyRef = useRef(survey);
  surveyRef.current = survey;

  // Core Natural Language Processor
  const handleProcessInput = (text: string, overrideSurvey?: AiSurveyState) => {
    setIsThinking(true);

    setTimeout(() => {
      const activeSurvey = overrideSurvey || surveyRef.current;
      const res = processAiMessage(text, activeSurvey, authUser?.name);
      setSurvey(res.updatedSurvey);
      surveyRef.current = res.updatedSurvey;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.text,
        timestamp: getTimeString(),
        options: res.options,
        itinerary: res.itinerary,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      if (res.itinerary) {
        showToast?.(`✦ AI đã lên xong lịch trình: ${res.itinerary.title}`);
      }
    }, 700);
  };

  // Handle user selecting an option chip
  const handleSelectOption = (value: string, label: string) => {
    const time = getTimeString();

    // Add user click as message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: label,
      timestamp: time,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Handlers
    if (value === "open_login") {
      onOpenAuthModal?.();
      return;
    }

    if (value === "view_trip_now") {
      const latestItinerary = [...messages].reverse().find((m) => m.itinerary)?.itinerary;
      if (latestItinerary) {
        handleViewVisualItinerary(latestItinerary);
      }
      return;
    }

    if (value === "save_trip_now") {
      const latestItinerary = [...messages].reverse().find((m) => m.itinerary)?.itinerary;
      if (latestItinerary) {
        onSaveItinerary?.(latestItinerary);
        showToast?.("✦ Đã lưu lịch trình thành công vào Sổ tay du lịch!");
      }
      return;
    }

    if (value === "start_planner") {
      setSurvey(initialSurveyState);
      surveyRef.current = initialSurveyState;
      handleProcessInput("giúp tôi lên lịch trình", initialSurveyState);
      return;
    }

    if (value === "plan_tam_dao") {
      handleProcessInput("Tôi muốn đi du lịch Tam Đảo");
      return;
    }

    if (value === "plan_den_hung") {
      handleProcessInput("Tôi muốn đi Đền Hùng");
      return;
    }

    if (value === "plan_long_coc") {
      handleProcessInput("Tôi muốn đi Đồi chè Long Cốc");
      return;
    }

    if (value === "plan_thanh_thuy") {
      handleProcessInput("Tôi muốn đi Suối khoáng nóng Thanh Thủy");
      return;
    }

    if (value === "plan_xuan_son") {
      handleProcessInput("Tôi muốn đi Vườn quốc gia Xuân Sơn");
      return;
    }

    if (value === "plan_food_tour") {
      handleProcessInput("Lên lịch trình tour ẩm thực đặc sản 2 ngày 1 đêm");
      return;
    }

    if (value === "ask_foods") {
      handleProcessInput("Đặc sản Phú Thọ có gì ngon?");
      return;
    }

    // Specific duration buttons like choose_dur_2_district-doan-hung
    if (value.startsWith("choose_dur_")) {
      const parts = value.split("_");
      const targetAnchor = parts.slice(3).join("_");
      const nextSurvey = { ...surveyRef.current };
      if (targetAnchor) {
        nextSurvey.anchorPlaceId = targetAnchor;
        nextSurvey.selectedPlaceIds = [targetAnchor];
      }
      setSurvey(nextSurvey);
      surveyRef.current = nextSurvey;
      handleProcessInput(label, nextSurvey);
      return;
    }

    // Specific spot button like choose_spot_doan-hung_0
    if (value.startsWith("choose_spot_")) {
      const parts = value.split("_");
      const distId = parts[2];
      const spotIdx = parseInt(parts[3] || "0", 10);
      const targetAnchor = distId ? `district-${distId}${spotIdx > 0 ? `-spot-${spotIdx}` : ""}` : "";
      const nextSurvey = { ...surveyRef.current };
      if (targetAnchor) {
        nextSurvey.anchorPlaceId = targetAnchor;
        nextSurvey.selectedPlaceIds = [targetAnchor];
      }
      setSurvey(nextSurvey);
      surveyRef.current = nextSurvey;
      handleProcessInput(label, nextSurvey);
      return;
    }

    // Specific district combo button like plan_doan_hung_combo
    if (value.startsWith("plan_") && value.endsWith("_combo")) {
      const distId = value.replace(/^plan_/, "").replace(/_combo$/, "").replace(/_/g, "-");
      const targetAnchor = `district-${distId}`;
      const nextSurvey = {
        ...surveyRef.current,
        anchorPlaceId: targetAnchor,
        selectedPlaceIds: [targetAnchor],
      };
      setSurvey(nextSurvey);
      surveyRef.current = nextSurvey;
      handleProcessInput(label, nextSurvey);
      return;
    }

    // Explore spots button like explore_spots_doan-hung
    if (value.startsWith("explore_spots_")) {
      const distId = value.replace("explore_spots_", "");
      const targetAnchor = `district-${distId}`;
      const nextSurvey = {
        ...surveyRef.current,
        anchorPlaceId: targetAnchor,
        selectedPlaceIds: [targetAnchor],
      };
      setSurvey(nextSurvey);
      surveyRef.current = nextSurvey;
      handleProcessInput(label, nextSurvey);
      return;
    }

    if (value.startsWith("choose_family_")) {
      handleProcessInput("Gia đình 4 người 2 ngày 1 đêm");
      return;
    }

    // Default: feed label into AI processor
    handleProcessInput(label);
  };

  // Submit free text input
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isThinking) return;

    const userText = inputVal.trim();
    setInputVal("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    handleProcessInput(userText);
  };

  // Trigger navigation to visual itinerary
  const handleViewVisualItinerary = (itinerary: GeneratedItinerary) => {
    onApplyItinerary(itinerary, {
      days: itinerary.durationDays,
      transport: itinerary.transport,
      style: itinerary.style,
      travelers: itinerary.travelers,
      anchorId: survey.anchorPlaceId || "tam-dao",
    });

    // Auto-minimize chat so user can view full itinerary workspace
    setIsOpen(false);

    // Smooth scroll to visual itinerary workspace
    setTimeout(() => {
      const el =
        document.querySelector(".v2-itinerary-workspace") ||
        document.querySelector(".plan-panel") ||
        document.getElementById("visual-itinerary-workspace");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON (GÓC PHẢI - MASCOT ROBOT ĐẤT TỔ) */}
      <div className="ai-mascot-launcher-container" id="ai-chat-launcher">
        {/* WELCOME SPEECH BUBBLE TOOLTIP (When chat is closed) */}
        {!isOpen && showTooltip && (
          <div className="ai-launcher-tooltip" role="status">
            <button
              type="button"
              className="ai-launcher-tooltip__close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Đóng gợi ý"
            >
              ×
            </button>
            <div className="ai-launcher-tooltip__content" onClick={() => setIsOpen(true)}>
              <div className="ai-launcher-tooltip__tag">✦ Trợ lý AI Đất Tổ</div>
              <div className="ai-launcher-tooltip__msg">
                {authUser ? (
                  <span>
                    Xin chào <strong>{authUser.name}</strong>! Cần em tự động lên lịch trình du lịch bấm đây nhé! 💬
                  </span>
                ) : (
                  <span>
                    Chào bạn! Cần trợ lý AI tự động lên lịch trình du lịch bấm đây nhé! 💬
                  </span>
                )}
              </div>
            </div>
            <div className="ai-launcher-tooltip__arrow" />
          </div>
        )}

        <button
          type="button"
          className={`ai-mascot-launcher-btn ${isOpen ? "is-active" : ""}`}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          aria-label={isOpen ? "Thu nhỏ Trợ lý AI" : "Mở Trợ lý AI Đất Tổ"}
          title="Trợ lý AI Đất Tổ — Lên lịch trình thông minh"
        >
          {/* MASCOT ROBOT AVATAR */}
          <div className="ai-mascot-avatar-wrapper">
            <img
              src={`${basePath}/images/ai-mascot-avatar.png`}
              alt="Linh vật Trợ lý AI Đất Tổ"
              className="ai-mascot-img"
              width={56}
              height={56}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `${basePath}/images/ai-mascot.png`;
              }}
            />
            {/* Pulsing online status indicator */}
            <span className="ai-online-pulse" title="Trực tuyến" />
          </div>

          {/* Mini label on desktop */}
          <div className="ai-mascot-launcher-btn__text">
            <span className="ai-launcher-title">Trợ lý AI</span>
            <span className="ai-launcher-sub">Lên lịch trình</span>
          </div>
        </button>
      </div>

      {/* FLOATING CHAT WINDOW (MODAL / FLYOUT GLASSMORPHISM) */}
      {isOpen && (
        <aside className="ai-chat-window" aria-label="Khung trò chuyện Trợ lý AI Đất Tổ">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="ai-chat-header__info">
              <div className="ai-header-avatar">
                <img
                  src={`${basePath}/images/ai-mascot-avatar.png`}
                  alt="Trợ lý AI Đất Tổ"
                  width={42}
                  height={42}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `${basePath}/images/ai-mascot.png`;
                  }}
                />
                <span className="ai-header-status-dot" />
              </div>
              <div className="ai-header-titles">
                <div className="ai-header-name">
                  Trợ lý AI Đất Tổ <span className="ai-header-badge">AI 2.0</span>
                </div>
                <div className="ai-header-role">
                  {authUser ? `Đang hỗ trợ: ${authUser.name}` : "Tư vấn & Lên lịch trình Đất Tổ"}
                </div>
              </div>
            </div>

            <div className="ai-chat-header__actions">
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => {
                  setSurvey(initialSurveyState);
                  const welcome = buildWelcomeMessage(authUser?.name);
                  setMessages([welcome]);
                  showToast?.("Đã làm mới cuộc hội thoại");
                }}
                title="Bắt đầu lại cuộc hội thoại"
                aria-label="Làm mới cuộc trò chuyện"
              >
                🔄
              </button>
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ cửa sổ chat"
                aria-label="Thu nhỏ"
              >
                —
              </button>
              <button
                type="button"
                className="ai-header-btn ai-header-btn--close"
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                aria-label="Đóng chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES BODY */}
          <div className="ai-chat-messages">
            {/* GREETING CARD BANNER */}
            <div className="ai-intro-card">
              <div className="ai-intro-card__icon">✦</div>
              <div className="ai-intro-card__content">
                <strong>Đất Tổ Smart AI Assistant</strong>
                <p>Hiểu ngôn ngữ tự nhiên, tự động lên lịch trình tối ưu theo điểm đến (Phú Thọ, Tam Đảo, Mai Châu), số người, số ngày và phương tiện.</p>
              </div>
            </div>

            {/* MESSAGE LIST */}
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message-row ai-message-row--${msg.sender}`}>
                {msg.sender === "ai" && (
                  <div className="ai-bubble-avatar">
                    <img
                      src={`${basePath}/images/ai-mascot-avatar.png`}
                      alt="AI"
                      width={30}
                      height={30}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `${basePath}/images/ai-mascot.png`;
                      }}
                    />
                  </div>
                )}

                <div className="ai-bubble-container">
                  <div className="ai-bubble-content">
                    {/* Render text with basic formatting */}
                    <div className="ai-bubble-text">
                      {msg.text.split("\n\n").map((para, idx) => (
                        <p key={idx}>
                          {para.split("\n").map((line, lIdx) => (
                            <React.Fragment key={lIdx}>
                              {renderFormattedText(line)}
                              {lIdx < para.split("\n").length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      ))}
                    </div>

                    {/* ITINERARY RESULT CARD (Generated by AI) */}
                    {msg.itinerary && (
                      <div className="ai-itinerary-preview-card">
                        <div className="ai-itinerary-card__header">
                          <span className="ai-itinerary-card__badge">
                            ✦ Lịch trình AI đề xuất · {msg.itinerary.durationDays} Ngày {msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1} Đêm` : ""}
                          </span>
                          <span className="ai-itinerary-card__transport">
                            {msg.itinerary.transport}
                          </span>
                        </div>

                        <h4 className="ai-itinerary-card__title">{msg.itinerary.title}</h4>
                        <p className="ai-itinerary-card__sub">{msg.itinerary.subtitle}</p>

                        <div className="ai-itinerary-card__meta-grid">
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">Quãng đường</span>
                            <span className="ai-meta-item__val">~{msg.itinerary.totalDistanceKm} km</span>
                          </div>
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">Thời gian di chuyển</span>
                            <span className="ai-meta-item__val">{msg.itinerary.totalDriveTime}</span>
                          </div>
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">Dự toán / người</span>
                            <span className="ai-meta-item__val text-emerald">
                              {msg.itinerary.estimatedCostPerPerson.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        {/* DAY HIGHLIGHTS */}
                        <div className="ai-itinerary-card__days">
                          {msg.itinerary.days.map((d) => (
                            <div key={d.dayNumber} className="ai-day-pill">
                              <span className="ai-day-pill__badge">Ngày {d.dayNumber}</span>
                              <span className="ai-day-pill__summary">{d.dayTitle} ({d.slots.length} điểm dừng)</span>
                            </div>
                          ))}
                        </div>

                        {/* ACTION BUTTONS (CLICK DIRECTLY INTO VISUAL ITINERARY PAGE) */}
                        <div className="ai-itinerary-card__actions">
                          <button
                            type="button"
                            className="ai-itinerary-btn ai-itinerary-btn--primary"
                            onClick={() => handleViewVisualItinerary(msg.itinerary!)}
                          >
                            <span>👉 Xem trên Trang Lịch Trình trực quan ➔</span>
                          </button>

                          <button
                            type="button"
                            className="ai-itinerary-btn ai-itinerary-btn--secondary"
                            onClick={() => {
                              onSaveItinerary?.(msg.itinerary!);
                              showToast?.("✦ Đã lưu lịch trình thành công vào Sổ tay du lịch!");
                            }}
                          >
                            <span>💾 Lưu vào Lịch trình của tôi</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* INTERACTIVE QUICK REPLY PILLS / OPTIONS */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="ai-quick-options">
                        {msg.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            className="ai-option-chip"
                            onClick={() => handleSelectOption(opt.value, opt.label)}
                          >
                            {opt.icon && <span className="ai-option-icon">{opt.icon}</span>}
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="ai-bubble-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* THINKING / TYPING INDICATOR */}
            {isThinking && (
              <div className="ai-message-row ai-message-row--ai">
                <div className="ai-bubble-avatar">
                  <img
                    src={`${basePath}/images/ai-mascot-avatar.png`}
                    alt="AI"
                    width={30}
                    height={30}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `${basePath}/images/ai-mascot.png`;
                    }}
                  />
                </div>
                <div className="ai-bubble-container">
                  <div className="ai-bubble-content ai-thinking-bubble">
                    <span className="ai-thinking-text">Trợ lý AI đang xử lý & tối ưu lịch trình</span>
                    <div className="ai-typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER INPUT */}
          <form className="ai-chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="ai-chat-input"
              placeholder="Nhắn tự nhiên (vd: Lên lịch trình Tam Đảo 3 ngày 2 đêm 2 người...)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isThinking}
            />
            <button
              type="submit"
              className="ai-chat-send-btn"
              disabled={!inputVal.trim() || isThinking}
              aria-label="Gửi tin nhắn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </aside>
      )}
    </>
  );
}

// Utility to parse markdown-like bold (**text**) and italic (*text*)
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
