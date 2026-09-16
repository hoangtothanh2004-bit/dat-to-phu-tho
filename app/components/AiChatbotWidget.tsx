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

  const txt = (dict: { vi: string; en: string; zh?: string; ko?: string; ja?: string }): string => {
    if (currentLang === "en") return dict.en;
    if (currentLang === "zh") return dict.zh || dict.en;
    if (currentLang === "ko") return dict.ko || dict.en;
    if (currentLang === "ja") return dict.ja || dict.en;
    return dict.vi;
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  // Show floating tooltip greeting after 1.8s and auto-dismiss after 7.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1800);
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8500);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Dismiss tooltip on scroll so it never blocks content reading
  useEffect(() => {
    const handleScroll = () => {
      setShowTooltip(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        text: txt({
          vi: `Xin chào **${userName}**! 👋 Em là **Trợ lý du lịch Đất Tổ**.\n\nRất vui được đồng hành cùng bạn! Em có thể tự động hiểu yêu cầu và thiết kế lịch trình du lịch tối ưu cho **Phú Thọ và các tuyến liên kết (Tam Đảo, Tây Thiên, Mai Châu)**.\n\nBạn có thể nhắn tự nhiên cho em bất kỳ câu nào, ví dụ:\n- *"Lên lịch trình Tam Đảo 3 ngày 2 đêm cho 2 người"*\n- *"Đi Đền Hùng 1 ngày bằng xe máy"*\n- *"Đặc sản Phú Thọ có những món gì ngon?"*`,
          en: `Hello **${userName}**! 👋 I am **Dat To AI Assistant**.\n\nI can intelligently understand your travel needs and generate an optimized itinerary for **Phu Tho, Tam Dao, Mai Chau**!\n\nYou can chat naturally, for example:\n- *"Plan a 3 days 2 nights trip to Tam Dao for 2 people"*\n- *"1-day Hung Temple tour by motorbike"*\n- *"What are the best local specialties?"*`,
          zh: `您好 **${userName}**！👋 我是 **富寿文旅AI助手**。\n\n很高兴为您服务！我可以智能理解您的旅游需求，为您定制 **富寿、三岛、梅州** 的专属游览路线！\n\n您可以随时告诉我，例如：\n- *“规划三岛2天1晚2人游”*\n- *“雄王庙1日游”*\n- *“富寿有哪些特色美食？”*`,
          ko: `안녕하세요 **${userName}**님! 👋 저는 **푸토 스마트 AI 여행 비서**입니다.\n\n여행 일정 요청을 자연어로 이해하여 **푸토, 땀다오, 마이쩌우** 최적의 맞춤 일정을 즉시 생성해 드립니다!\n\n편하게 메시지를 입력해보세요, 예:\n- *“2인 땀다오 2박 3일 일정 짜줘”*\n- *“흥왕 신전 1일 투어”*\n- *“푸토의 유명한 특산물은 뭐야?”*`,
          ja: `こんにちは **${userName}**様！👋 私は**フート省AI観光アシスタント**です。\n\n旅行のご希望をインテリジェントに解析し、**フート、タムダオ、マイチャウ**の最適な旅程を自動生成します！\n\nお気軽に話しかけてください。例：\n- *“2名でタムダオ2泊3日の旅程を立てて”*\n- *“フン王廟の1日観光ツアー”*\n- *“フート省のおすすめグルメは？”*`,
        }),
        timestamp: time,
        options: [
          {
            label: txt({
              vi: "🌫️ Lên lịch trình Tam Đảo (2N1Đ / 3N2Đ)",
              en: "🌫️ Plan Tam Dao Trip (2D1N / 3D2N)",
              zh: "🌫️ 规划三岛行程 (2天1晚 / 3天2晚)",
              ko: "🌫️ 땀다오 일정 계획 (1박2일 / 2박3일)",
              ja: "🌫️ タムダオ旅程作成 (1泊2日 / 2泊3日)",
            }),
            value: "plan_tam_dao",
            icon: "🏔️",
          },
          {
            label: txt({
              vi: "🏛️ Tour cội nguồn Đền Hùng",
              en: "🏛️ Hung Temple Origin Tour",
              zh: "🏛️ 雄王祖庙溯源之旅",
              ko: "🏛️ 흥왕 신전 투어",
              ja: "🏛️ フン王廟ルーツツアー",
            }),
            value: "plan_den_hung",
            icon: "🏛️",
          },
          {
            label: txt({
              vi: "🍃 Săn mây Đồi chè Long Cốc",
              en: "🍃 Long Coc Tea Hill Cloud Hunting",
              zh: "🍃 龙谷茶丘云海仙境",
              ko: "🍃 롱꼭 차밭 구름 여행",
              ja: "🍃 ロンコック茶畑 雲海ツアー",
            }),
            value: "plan_long_coc",
            icon: "📸",
          },
          {
            label: txt({
              vi: "♨️ Nghỉ dưỡng khoáng nóng Thanh Thủy",
              en: "♨️ Thanh Thuy Hot Spring Resort",
              zh: "♨️ 清水温泉度假体验",
              ko: "♨️ 타잉투이 온천 힐링",
              ja: "♨️ タイントゥイ温泉リゾート",
            }),
            value: "plan_thanh_thuy",
            icon: "💆",
          },
          {
            label: txt({
              vi: "🍲 Gợi ý đặc sản OCOP",
              en: "🍲 Recommend OCOP Specialties",
              zh: "🍲 推荐OCOP特色美馔",
              ko: "🍲 OCOP 특산 음식 추천",
              ja: "🍲 OCOP特産グルメおすすめ",
            }),
            value: "ask_foods",
            icon: "🥢",
          },
        ],
      };
    } else {
      return {
        id: "msg-welcome",
        sender: "ai",
        text: txt({
          vi: `Xin chào bạn! 👋 Em là **Trợ lý du lịch Đất Tổ** — bạn đồng hành du lịch thông minh tại Phú Thọ & các tuyến liên kết.\n\nBạn chỉ cần cho em biết bạn muốn đi đâu, mấy ngày, mấy người (Ví dụ: *"Lên lịch trình Tam Đảo 3 ngày 2 đêm cho 2 người"*). Em sẽ tự động phân tích và tạo lịch trình trực quan ngay cho bạn!`,
          en: `Hello! 👋 I am **Dat To AI Assistant** — your smart travel companion in Phu Tho & connected destinations.\n\nTell me where you want to go, how many days, and how many people. I will build an accurate itinerary instantly!`,
          zh: `您好！👋 我是 **富寿文旅AI助手** — 您的富寿及周边专属智能旅游顾问。\n\n请告诉我您的目的地、游玩天数与人数（例如：“规划三岛2天1晚2人游”），我将立即为您智能生成可视化行程！`,
          ko: `안녕하세요! 👋 저는 **푸토 스마트 AI 여행 비서** — 푸토 및 인근 지역 전용 여행 동반자입니다.\n\n목적지, 여행 일수, 인원수를 알려주시면 (예: “2인 땀다오 2박 3일 일정 짜줘”) 최적의 일정을 즉시 생성해 드립니다!`,
          ja: `こんにちは！👋 私は**フート省AI観光アシスタント** — フート省および周辺ルートのスマート観光パートナーです。\n\n目的地、旅行日数、人数をお知らせいただければ（例：「2名でタムダオ2泊3日の旅程を立てて」）、すぐにビジュアル旅程を作成します！`,
        }),
        timestamp: time,
        options: [
          {
            label: txt({
              vi: "🌫️ Lên lịch trình Tam Đảo",
              en: "🌫️ Plan Tam Dao Trip",
              zh: "🌫️ 规划三岛行程",
              ko: "🌫️ 땀다오 일정 계획",
              ja: "🌫️ タムダオ旅程作成",
            }),
            value: "plan_tam_dao",
            icon: "🏔️",
          },
          {
            label: txt({
              vi: "🏛️ Khám phá Đền Hùng & Việt Trì",
              en: "🏛️ Explore Hung Temple & Viet Tri",
              zh: "🏛️ 探索雄王庙与越池",
              ko: "🏛️ 흥왕 신전 & 비엣찌 탐방",
              ja: "🏛️ フン王廟＆ヴィエットチー探訪",
            }),
            value: "plan_den_hung",
            icon: "🏛️",
          },
          {
            label: txt({
              vi: "🍃 Đồi chè Long Cốc & Xuân Sơn",
              en: "🍃 Long Coc Tea Hill & Xuan Son",
              zh: "🍃 龙谷茶丘与春山国家公园",
              ko: "🍃 롱꼭 차밭 & 쑤언선",
              ja: "🍃 ロンコック茶畑＆スアンソン",
            }),
            value: "plan_long_coc",
            icon: "📸",
          },
          {
            label: txt({
              vi: "♨️ Khoáng nóng Thanh Thủy",
              en: "♨️ Thanh Thuy Hot Spring",
              zh: "♨️ 清水矿泉水疗",
              ko: "♨️ 타잉투이 온천",
              ja: "♨️ タイントゥイ温泉",
            }),
            value: "plan_thanh_thuy",
            icon: "💆",
          },
          {
            label: txt({
              vi: "👤 Đăng nhập tài khoản để lưu lịch trình",
              en: "👤 Login to save trips",
              zh: "👤 登录账号保存行程",
              ko: "👤 일정 저장을 위한 로그인",
              ja: "👤 旅程保存用ログイン",
            }),
            value: "open_login",
            icon: "🔑",
          },
        ],
      };
    }
  };

  // Re-greet if authUser changes or language changes
  useEffect(() => {
    const currentUserId = authUser?.id || null;
    let shouldResetSurvey = false;
    
    setMessages((prev) => {
      if (prev.length === 0 || prevAuthUserIdRef.current !== currentUserId) {
        prevAuthUserIdRef.current = currentUserId;
        shouldResetSurvey = true;
        return [buildWelcomeMessage(authUser?.name)];
      } else if (prev.length > 0 && prev[0].id === "msg-welcome") {
        const newMessages = [...prev];
        newMessages[0] = buildWelcomeMessage(authUser?.name);
        return newMessages;
      }
      return prev;
    });
    
    if (shouldResetSurvey) {
      setSurvey(initialSurveyState);
    }
  }, [authUser?.id, authUser?.name, currentLang]);

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
              <div className="ai-launcher-tooltip__tag">{txt({ vi: "✦ Trợ lý du lịch Đất Tổ", en: "✦ Dat To AI Assistant", zh: "✦ 富寿AI文旅助手", ko: "✦ 푸토 AI 여행 비서", ja: "✦ フートAI観光アシスタント" })}</div>
              <div className="ai-launcher-tooltip__msg">
                {authUser ? (
                  <span>
                    {txt({
                      vi: `Xin chào ${authUser.name}! Cần em tự động lên lịch trình du lịch bấm đây nhé! 💬`,
                      en: `Hello ${authUser.name}! Need an automated itinerary? Click here! 💬`,
                      zh: `您好 ${authUser.name}！需要智能规划行程请点击这里！💬`,
                      ko: `안녕하세요 ${authUser.name}님! 여행 일정이 필요하시면 클릭하세요! 💬`,
                      ja: `こんにちは ${authUser.name}様！AIによる自動旅程作成はこちらをクリック！💬`,
                    })}
                  </span>
                ) : (
                  <span>
                    {txt({
                      vi: "Chào bạn! Cần trợ lý AI tự động lên lịch trình du lịch bấm đây nhé! 💬",
                      en: "Hello! Need an AI assistant to plan your trip? Click here! 💬",
                      zh: "您好！需要智能AI助手为您规划行程请点击这里！💬",
                      ko: "안녕하세요! AI 비서에게 일정을 맡겨보세요! 클릭! 💬",
                      ja: "こんにちは！AIアシスタントに旅程を作成してもらうにはこちらをクリック！💬",
                    })}
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
          aria-label={isOpen ? txt({ vi: "Thu nhỏ Trợ lý AI", en: "Minimize AI Assistant", zh: "收起AI助手", ko: "AI 비서 최소화", ja: "AIアシスタントを縮小" }) : txt({ vi: "Mở Trợ lý du lịch Đất Tổ", en: "Open Dat To Travel Assistant", zh: "打开富寿AI助手", ko: "푸토 AI 비서 열기", ja: "フートAIアシスタントを開く" })}
          title={txt({ vi: "Trợ lý du lịch Đất Tổ — Lên lịch trình thông minh", en: "Dat To Travel Assistant — Smart Itinerary Planner", zh: "富寿文旅AI助手 — 智能行程规划", ko: "푸토 AI 여행 비서 — 스마트 일정 생성", ja: "フートAI観光アシスタント — スマート旅程作成" })}
        >
          {/* MASCOT ROBOT AVATAR */}
          <div className="ai-mascot-avatar-wrapper">
            <img
              src={`${basePath}/images/ai-mascot-avatar.png`}
              alt="Linh vật Trợ lý du lịch Đất Tổ"
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
            <span className="ai-launcher-title">{txt({ vi: "Tôi là trợ lý du lịch Đất Tổ", en: "Dat To AI Assistant", zh: "富寿AI旅游助手", ko: "푸토 AI 여행 비서", ja: "フートAI観光アシスタント" })}</span>
            <span className="ai-launcher-sub">{txt({ vi: "Lên lịch trình", en: "Plan your trip", zh: "智能规划行程", ko: "일정 계획하기", ja: "旅程を作成する" })}</span>
          </div>
        </button>
      </div>

      {/* FLOATING CHAT WINDOW (MODAL / FLYOUT GLASSMORPHISM) */}
      {isOpen && (
        <aside className="ai-chat-window" aria-label="Khung trò chuyện Trợ lý du lịch Đất Tổ">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="ai-chat-header__info">
              <div className="ai-header-avatar">
                <img
                  src={`${basePath}/images/ai-mascot-avatar.png`}
                  alt="Trợ lý du lịch Đất Tổ"
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
                  {txt({ vi: "Trợ lý du lịch Đất Tổ", en: "Dat To Travel Assistant", zh: "富寿AI旅游助手", ko: "푸토 AI 여행 비서", ja: "フートAI観光アシスタント" })} <span className="ai-header-badge">AI 2.0</span>
                </div>
                <div className="ai-header-role">
                  {authUser
                    ? txt({ vi: `Đang hỗ trợ: ${authUser.name}`, en: `Assisting: ${authUser.name}`, zh: `正在为 ${authUser.name} 服务`, ko: `지원 중: ${authUser.name}`, ja: `ご案内中: ${authUser.name}` })
                    : txt({ vi: "Tư vấn & Lên lịch trình Đất Tổ", en: "Trip Planner & Advisor", zh: "富寿行程规划顾问", ko: "푸토 여행 일정 기획 및 안내", ja: "フート旅程プランナー＆アドバイザー" })}
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
                  showToast?.(txt({ vi: "Đã làm mới cuộc hội thoại", en: "Conversation refreshed", zh: "已重置对话", ko: "대화가 새로고침되었습니다", ja: "会話をリセットしました" }));
                }}
                title={txt({ vi: "Bắt đầu lại cuộc hội thoại", en: "Restart conversation", zh: "重新开始对话", ko: "대화 다시 시작", ja: "会話をやり直す" })}
                aria-label="Làm mới cuộc trò chuyện"
              >
                🔄
              </button>
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => setIsOpen(false)}
                title={txt({ vi: "Thu nhỏ", en: "Minimize", zh: "最小化", ko: "최소화", ja: "最小化" })}
                aria-label="Thu nhỏ"
              >
                —
              </button>
              <button
                type="button"
                className="ai-header-btn ai-header-btn--close"
                onClick={() => setIsOpen(false)}
                title={txt({ vi: "Đóng chat", en: "Close chat", zh: "关闭对话", ko: "채팅 닫기", ja: "チャットを閉じる" })}
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
                <strong>{txt({ vi: "Đất Tổ Smart AI Assistant", en: "Dat To Smart AI Assistant", zh: "富寿智能AI旅游助手", ko: "푸토 스마트 AI 여행 비서", ja: "フートスマートAI観光アシスタント" })}</strong>
                <p>{txt({
                  vi: "Hiểu ngôn ngữ tự nhiên, tự động lên lịch trình tối ưu theo điểm đến (Phú Thọ, Tam Đảo, Mai Châu), số người, số ngày và phương tiện.",
                  en: "Understands natural language, automatically plans optimal trips based on destinations (Phu Tho, Tam Dao, Mai Chau), travelers, duration, and transport.",
                  zh: "智能理解自然语言，根据目的地（富寿、三岛、梅州）、游玩人数、天数及交通方式自动优化专属行程。",
                  ko: "자연어를 이해하여 목적지(푸토, 땀다오, 마이쩌우), 인원, 일정, 교통편에 맞춘 최적의 여행 일정을 자동으로 계획합니다.",
                  ja: "自然言語を理解し、目的地（フート、タムダオ、マイチャウ）、人数、日数、移動手段に応じた最適な旅程を自動作成します。"
                })}</p>
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
                            {txt({
                              vi: `✦ Lịch trình AI đề xuất · ${msg.itinerary.durationDays} Ngày ${msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1} Đêm` : ""}`,
                              en: `✦ AI Recommended · ${msg.itinerary.durationDays}D ${msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1}N` : ""}`,
                              zh: `✦ AI推荐行程 · ${msg.itinerary.durationDays}天${msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1}晚` : ""}`,
                              ko: `✦ AI 추천 일정 · ${msg.itinerary.durationDays}일 ${msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1}박` : ""}`,
                              ja: `✦ AIおすすめ旅程 · ${msg.itinerary.durationDays}日間 ${msg.itinerary.durationDays > 1 ? `${msg.itinerary.durationDays - 1}泊` : ""}`,
                            })}
                          </span>
                          <span className="ai-itinerary-card__transport">
                            {msg.itinerary.transport}
                          </span>
                        </div>

                        <h4 className="ai-itinerary-card__title">{msg.itinerary.title}</h4>
                        <p className="ai-itinerary-card__sub">{msg.itinerary.subtitle}</p>

                        <div className="ai-itinerary-card__meta-grid">
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">{txt({ vi: "Quãng đường", en: "Distance", zh: "总行程", ko: "이동 거리", ja: "移動距離" })}</span>
                            <span className="ai-meta-item__val">~{msg.itinerary.totalDistanceKm} km</span>
                          </div>
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">{txt({ vi: "Thời gian di chuyển", en: "Drive Time", zh: "车程时间", ko: "이동 시간", ja: "所要時間" })}</span>
                            <span className="ai-meta-item__val">{msg.itinerary.totalDriveTime}</span>
                          </div>
                          <div className="ai-meta-item">
                            <span className="ai-meta-item__label">{txt({ vi: "Dự toán / người", en: "Est. Cost / Person", zh: "预计人均费用", ko: "1인 예상 비용", ja: "概算費用 / 人" })}</span>
                            <span className="ai-meta-item__val text-emerald">
                              {msg.itinerary.estimatedCostPerPerson.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        {/* DAY HIGHLIGHTS */}
                        <div className="ai-itinerary-card__days">
                          {msg.itinerary.days.map((d) => (
                            <div key={d.dayNumber} className="ai-day-pill">
                              <span className="ai-day-pill__badge">{txt({ vi: `Ngày ${d.dayNumber}`, en: `Day ${d.dayNumber}`, zh: `第${d.dayNumber}天`, ko: `${d.dayNumber}일차`, ja: `${d.dayNumber}日目` })}</span>
                              <span className="ai-day-pill__summary">{d.dayTitle} ({d.slots.length} {txt({ vi: "điểm dừng", en: "stops", zh: "个停靠点", ko: "곳 방문", ja: "スポット" })})</span>
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
                            <span>{txt({ vi: "👉 Xem trên Trang Lịch Trình trực quan ➔", en: "👉 View in Visual Itinerary Planner ➔", zh: "👉 在可视化行程页面查看 ➔", ko: "👉 시각적 일정 페이지에서 보기 ➔", ja: "👉 ビジュアル旅程ページで確認 ➔" })}</span>
                          </button>

                          <button
                            type="button"
                            className="ai-itinerary-btn ai-itinerary-btn--secondary"
                            onClick={() => {
                              onSaveItinerary?.(msg.itinerary!);
                              showToast?.(txt({ vi: "✦ Đã lưu lịch trình thành công vào Sổ tay du lịch!", en: "✦ Saved itinerary to notebook successfully!", zh: "✦ 已成功保存行程至我的旅行手册！", ko: "✦ 여행 수첩에 일정을 성공적으로 저장했습니다!", ja: "✦ 旅程をマイノートに正常に保存しました！" }));
                            }}
                          >
                            <span>{txt({ vi: "💾 Lưu vào Lịch trình của tôi", en: "💾 Save to My Itineraries", zh: "💾 保存至我的行程", ko: "💾 내 여행 일정에 저장", ja: "💾 マイ旅程に保存" })}</span>
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
                    <span className="ai-thinking-text">{txt({ vi: "Trợ lý AI đang xử lý & tối ưu lịch trình", en: "AI Assistant is optimizing your itinerary", zh: "AI正在处理并优化行程", ko: "AI 비서가 일정을 최적화하고 있습니다", ja: "AIアシスタントが旅程を最適化中" })}</span>
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
              placeholder={txt({
                vi: "Nhắn tự nhiên (vd: Lên lịch trình Tam Đảo 3 ngày 2 đêm 2 người...)",
                en: "Type naturally (e.g. Plan Tam Dao 3D2N for 2 people...)",
                zh: "自由输入（如：帮我安排三岛3天2晚2人游...）",
                ko: "자유롭게 입력하세요 (예: 2인 땀다오 2박 3일 일정 짜줘...)",
                ja: "自然な言葉で入力（例：2名でタムダオ2泊3日の旅程を立てて...）",
              })}
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
