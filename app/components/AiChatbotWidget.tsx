"use client";

import React, { useState, useEffect, useRef } from "react";
import { buildItinerary, type GeneratedItinerary } from "@/lib/guidePlanner";
import { places } from "@/data/travel";

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

type ChatStep = "idle" | "destination" | "duration" | "travelers" | "transport" | "style" | "completed";

type ChatMessage = {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  options?: Array<{ label: string; value: string; icon?: string }>;
  itinerary?: GeneratedItinerary;
  meta?: {
    step?: ChatStep;
    action?: "view_trip" | "save_trip" | "open_auth";
  };
};

type UserSurvey = {
  destinationText: string;
  anchorPlaceId: string;
  district?: string;
  region?: string;
  durationDays: number;
  travelers: number;
  transport: string;
  budget: string;
  style: string;
};

const defaultSurvey: UserSurvey = {
  destinationText: "Toàn cảnh Phú Thọ",
  anchorPlaceId: "den-hung",
  district: undefined,
  region: undefined,
  durationDays: 2,
  travelers: 2,
  transport: "Ô tô riêng",
  budget: "Tiêu chuẩn (~1.000.000đ/ngày)",
  style: "Văn hóa & cội nguồn",
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
  const [currentStep, setCurrentStep] = useState<ChatStep>("idle");
  const [survey, setSurvey] = useState<UserSurvey>(defaultSurvey);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevAuthUserIdRef = useRef<string | null>(null);

  const isEn = currentLang === "en";

  // Auto-scroll chat to latest message
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

  // Generate initial greeting message based on auth status
  const buildWelcomeMessage = (userName?: string): ChatMessage => {
    const time = getTimeString();
    if (userName) {
      return {
        id: "msg-welcome",
        sender: "ai",
        text: isEn
          ? `Hello **${userName}**! 👋 I am **Dat To AI Assistant**.\n\nGreat to accompany you on your Phu Tho exploration today! I can automatically generate an optimized, personalized itinerary for you. Let's get started:`
          : `Xin chào **${userName}**! 👋 Em là **Trợ lý AI Đất Tổ**.\n\nRất vui được đồng hành cùng bạn khám phá Phú Thọ hôm nay! Em có thể tự động lên kế hoạch và tối ưu lịch trình du lịch cho bạn trong chớp mắt. Hãy bắt đầu nhé:`,
        timestamp: time,
        options: [
          { label: isEn ? "✨ Plan Itinerary for me" : "✨ Lên lịch trình tự động giúp tôi", value: "start_planner", icon: "🗺️" },
          { label: isEn ? "🏛️ Recommend Top Attractions" : "🏛️ Gợi ý điểm đến Đất Tổ nổi tiếng", value: "ask_places", icon: "📍" },
          { label: isEn ? "🍲 Phu Tho Signature Foods" : "🍲 Món ngon & đặc sản OCOP", value: "ask_foods", icon: "🥢" },
          { label: isEn ? "♨️ Hot Spring Resorts" : "♨️ Resort suối khoáng nóng Thanh Thủy", value: "ask_onsen", icon: "💆" },
        ],
      };
    } else {
      return {
        id: "msg-welcome",
        sender: "ai",
        text: isEn
          ? `Hello there! 👋 I am **Dat To AI Assistant** — your smart travel companion in Phu Tho.\n\nI can help you build an interactive itinerary step-by-step. Let me ask you a few quick questions to customize your trip!`
          : `Xin chào bạn! 👋 Em là **Trợ lý AI Đất Tổ** — người bạn đồng hành du lịch số tại Phú Thọ.\n\nEm có thể hỗ trợ bạn tự động lên lịch trình du lịch chi tiết và trực quan theo đúng mong muốn. Hãy cùng em khám phá nhé!`,
        timestamp: time,
        options: [
          { label: isEn ? "✨ Plan Itinerary for me" : "✨ Lên lịch trình tự động giúp tôi", value: "start_planner", icon: "🗺️" },
          { label: isEn ? "👤 Sign in to save trips" : "👤 Đăng nhập tài khoản để lưu lịch trình", value: "open_login", icon: "🔑" },
          { label: isEn ? "🍃 Long Coc Tea Hills" : "🍃 Đồi chè Long Cốc & săn mây", value: "ask_longcoc", icon: "📸" },
          { label: isEn ? "🍲 Phu Tho Specialties" : "🍲 Đặc sản Phú Thọ làm quà", value: "ask_foods", icon: "🎁" },
        ],
      };
    }
  };

  // Initialize or update welcome greeting when authUser changes
  useEffect(() => {
    const currentUserId = authUser?.id || null;
    if (messages.length === 0 || prevAuthUserIdRef.current !== currentUserId) {
      prevAuthUserIdRef.current = currentUserId;
      const welcome = buildWelcomeMessage(authUser?.name);
      setMessages([welcome]);
      setCurrentStep("idle");
    }
  }, [authUser?.id, authUser?.name, isEn]);

  // Steps definition for questionnaire
  const promptNextQuestion = (step: ChatStep, updatedSurvey: UserSurvey) => {
    const time = getTimeString();
    let nextMsg: ChatMessage;

    switch (step) {
      case "destination":
        nextMsg = {
          id: `q-dest-${Date.now()}`,
          sender: "ai",
          text: isEn
            ? "📍 **Question 1:** Where would you like to explore in Phu Tho?"
            : "📍 **Câu hỏi 1:** Bạn muốn đi đâu hoặc khám phá khu vực nào tại Phú Thọ?",
          timestamp: time,
          options: [
            { label: "🏛️ Đền Hùng & TP Việt Trì", value: "den_hung" },
            { label: "🍃 Đồi chè Long Cốc (Săn mây)", value: "long_coc" },
            { label: "🌲 Vườn quốc gia Xuân Sơn", value: "xuan_son" },
            { label: "♨️ Suối khoáng nóng Thanh Thủy", value: "thanh_thuy" },
            { label: "🏞️ Đầm Ao Châu & Đền Mẫu Hạ Hòa", value: "ha_hoa" },
            { label: "✨ Toàn cảnh các điểm đẹp nhất Phú Thọ", value: "all_phutho" },
          ],
          meta: { step: "destination" },
        };
        break;

      case "duration":
        nextMsg = {
          id: `q-dur-${Date.now()}`,
          sender: "ai",
          text: isEn
            ? `🗓️ **Question 2:** How many days is your trip to **${updatedSurvey.destinationText}**?`
            : `🗓️ **Câu hỏi 2:** Bạn dự định đi **${updatedSurvey.destinationText}** trong mấy ngày?`,
          timestamp: time,
          options: [
            { label: "⚡ 1 ngày (Đi trong ngày)", value: "1_day" },
            { label: "⭐ 2 ngày 1 đêm (Cuối tuần lý tưởng)", value: "2_days" },
            { label: "🌿 3 ngày 2 đêm (Trọn vẹn & Thư thái)", value: "3_days" },
            { label: "🏕️ 4 ngày 3 đêm (Khám phá chuyên sâu)", value: "4_days" },
          ],
          meta: { step: "duration" },
        };
        break;

      case "travelers":
        nextMsg = {
          id: `q-trav-${Date.now()}`,
          sender: "ai",
          text: isEn
            ? "👥 **Question 3:** How many people are traveling with you?"
            : "👥 **Câu hỏi 3:** Chuyến đi này bạn đi mấy người?",
          timestamp: time,
          options: [
            { label: "👤 1 người (Đi một mình / Solo)", value: "1_person" },
            { label: "👫 2 người (Cặp đôi / Bạn thân)", value: "2_persons" },
            { label: "👨‍👩‍👧‍👦 Gia đình (3 - 5 người)", value: "family_4" },
            { label: "🚌 Nhóm bạn / Đoàn đông (6+ người)", value: "group_8" },
          ],
          meta: { step: "travelers" },
        };
        break;

      case "transport":
        nextMsg = {
          id: `q-trans-${Date.now()}`,
          sender: "ai",
          text: isEn
            ? "🚗 **Question 4:** What transport will you be using?"
            : "🚗 **Câu hỏi 4:** Bạn đi bằng phương tiện gì?",
          timestamp: time,
          options: [
            { label: "🏍️ Xe máy (Phượt tự do, ngắm cảnh)", value: "Xe máy" },
            { label: "🚗 Ô tô riêng / Tự lái (Tiện lợi, an toàn)", value: "Ô tô riêng" },
            { label: "🚐 Limousine / Xe khách (Thoải mái)", value: "Limousine / Xe khách" },
          ],
          meta: { step: "transport" },
        };
        break;

      case "style":
        nextMsg = {
          id: `q-style-${Date.now()}`,
          sender: "ai",
          text: isEn
            ? "🎯 **Question 5:** What is your preferred travel style & interest?"
            : "🎯 **Câu hỏi 5:** Phong cách du lịch ưu tiên của bạn là gì?",
          timestamp: time,
          options: [
            { label: "🏛️ Văn hóa, lịch sử & cội nguồn", value: "Văn hóa & cội nguồn" },
            { label: "📸 Sống ảo, thiên nhiên & săn mây", value: "Nhiếp ảnh & thiên nhiên" },
            { label: "♨️ Nghỉ dưỡng Onsen & ẩm thực", value: "Nghỉ dưỡng & ẩm thực" },
            { label: "🎒 Trải nghiệm mạo hiểm & phượt", value: "Trải nghiệm & mạo hiểm" },
          ],
          meta: { step: "style" },
        };
        break;

      default:
        return;
    }

    setMessages((prev) => [...prev, nextMsg]);
    setCurrentStep(step);
  };

  // Generate itinerary automatically when survey completes
  const handleFinalizeItinerary = (finalSurvey: UserSurvey) => {
    setIsThinking(true);
    setCurrentStep("completed");

    setTimeout(() => {
      // Find matching anchor place or fallback to den-hung
      let anchorId = finalSurvey.anchorPlaceId;
      if (!anchorId || !places.some((p) => p.id === anchorId)) {
        anchorId = "den-hung";
      }

      // Generate itinerary using the core planner
      const generated = buildItinerary({
        anchorPlaceId: anchorId,
        selectedPlaceIds: [anchorId],
        district: finalSurvey.district,
        region: finalSurvey.region,
        durationDays: finalSurvey.durationDays,
        transport: finalSurvey.transport,
        budget: finalSurvey.budget,
        style: finalSurvey.style,
        travelers: finalSurvey.travelers,
      });

      const time = getTimeString();
      const aiResponseMsg: ChatMessage = {
        id: `itinerary-${Date.now()}`,
        sender: "ai",
        text: isEn
          ? `🎉 **Awesome!** I have customized a complete **${finalSurvey.durationDays}-day** itinerary for **${finalSurvey.travelers} traveler(s)** to **${finalSurvey.destinationText}**!`
          : `🎉 **Tuyệt vời!** Em đã thiết kế xong lịch trình **${finalSurvey.durationDays} ngày ${finalSurvey.durationDays > 1 ? `${finalSurvey.durationDays - 1} đêm` : ""}** cho **${finalSurvey.travelers} người** đi **${finalSurvey.destinationText}** bằng **${finalSurvey.transport}**!`,
        timestamp: time,
        itinerary: generated,
        options: [
          { label: isEn ? "👉 View on Visual Itinerary Page ➔" : "👉 Xem trên Trang Lịch Trình trực quan ➔", value: "view_trip_now", icon: "🗺️" },
          { label: isEn ? "💾 Save to My Trips" : "💾 Lưu vào Lịch trình của tôi", value: "save_trip_now", icon: "⭐" },
          { label: isEn ? "🔄 Plan a different trip" : "🔄 Lên lịch trình khác", value: "start_planner", icon: "🔁" },
        ],
      };

      setMessages((prev) => [...prev, aiResponseMsg]);
      setIsThinking(false);
      showToast?.(`✦ AI đã lên xong lịch trình: ${generated.title}`);
    }, 1200);
  };

  // Handle user selecting an option chip
  const handleSelectOption = (value: string, label: string) => {
    const time = getTimeString();

    // Add user selection as a message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: label,
      timestamp: time,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Check specific actions
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
      setSurvey(defaultSurvey);
      promptNextQuestion("destination", defaultSurvey);
      return;
    }

    // Handle questionnaire transitions
    if (currentStep === "destination") {
      let anchorId = "den-hung";
      let destText = "Đền Hùng & TP Việt Trì";
      let dist: string | undefined = "TP. Việt Trì";

      if (value === "long_coc") {
        anchorId = "doi-che-long-coc";
        destText = "Đồi chè Long Cốc (Tân Sơn)";
        dist = "Huyện Tân Sơn";
      } else if (value === "xuan_son") {
        anchorId = "vuon-quoc-gia-xuan-son";
        destText = "Vườn quốc gia Xuân Sơn";
        dist = "Huyện Tân Sơn";
      } else if (value === "thanh_thuy") {
        anchorId = "khoang-nong-thanh-thuy";
        destText = "Suối khoáng nóng Thanh Thủy";
        dist = "Huyện Thanh Thủy";
      } else if (value === "ha_hoa") {
        anchorId = "dam-ao-chau";
        destText = "Đầm Ao Châu & Đền Mẫu Âu Cơ";
        dist = "Huyện Hạ Hòa";
      } else if (value === "all_phutho") {
        anchorId = "den-hung";
        destText = "Toàn cảnh Phú Thọ";
        dist = undefined;
      }

      const updated = { ...survey, destinationText: destText, anchorPlaceId: anchorId, district: dist };
      setSurvey(updated);
      promptNextQuestion("duration", updated);
      return;
    }

    if (currentStep === "duration") {
      let days = 2;
      if (value === "1_day") days = 1;
      else if (value === "2_days") days = 2;
      else if (value === "3_days") days = 3;
      else if (value === "4_days") days = 4;

      const updated = { ...survey, durationDays: days };
      setSurvey(updated);
      promptNextQuestion("travelers", updated);
      return;
    }

    if (currentStep === "travelers") {
      let num = 2;
      if (value === "1_person") num = 1;
      else if (value === "2_persons") num = 2;
      else if (value === "family_4") num = 4;
      else if (value === "group_8") num = 8;

      const updated = { ...survey, travelers: num };
      setSurvey(updated);
      promptNextQuestion("transport", updated);
      return;
    }

    if (currentStep === "transport") {
      const updated = { ...survey, transport: value };
      setSurvey(updated);
      promptNextQuestion("style", updated);
      return;
    }

    if (currentStep === "style") {
      const updated = { ...survey, style: value };
      setSurvey(updated);
      handleFinalizeItinerary(updated);
      return;
    }

    // Handle common general knowledge queries
    handleKnowledgeQuery(value);
  };

  // Smart answers for general questions
  const handleKnowledgeQuery = (query: string) => {
    setIsThinking(true);
    setTimeout(() => {
      const lower = query.toLowerCase();
      let answerText = "";
      let suggestions: Array<{ label: string; value: string; icon?: string }> = [];

      if (lower.includes("đặc sản") || lower.includes("món ngon") || lower.includes("ăn gì") || query === "ask_foods") {
        answerText =
          "🥢 **Top đặc sản Phú Thọ nức tiếng bạn nhất định phải thử:**\n\n" +
          "1. **Thịt chua Thanh Sơn:** Thịt lợn lên men thính ngô thơm bùi, ăn kèm lá sung, ổi, đinh lăng chấm tương ớt.\n" +
          "2. **Cá lăng sông Đà / sông Lô:** Thịt chắc, thơm ngọt, ngon nhất khi nướng riềng mẻ hoặc om chuối đậu.\n" +
          "3. **Gà nhiều cựa Xuân Sơn:** Đặc sản huyền thoại dâng tiến Vua Hùng, thịt thơm ngọt tự nhiên.\n" +
          "4. **Bánh tai Phú Thọ:** Bánh dẻo thơm nhân thịt lợn tiêu xay nóng hổi.\n" +
          "5. **Chè búp Long Cốc:** Hương cốm non thanh tao đặc trưng của đất trung du.";
        suggestions = [
          { label: "✨ Lên lịch trình ẩm thực 2N1Đ", value: "start_planner" },
          { label: "♨️ Suối khoáng nóng Thanh Thủy", value: "ask_onsen" },
        ];
      } else if (lower.includes("long cốc") || lower.includes("đồi chè") || query === "ask_longcoc") {
        answerText =
          "📸 **Kinh nghiệm khám phá Đồi chè Long Cốc (Huyện Tân Sơn):**\n\n" +
          "- **Vẻ đẹp:** Được mệnh danh là 'Ốc đảo chè đẹp nhất Việt Nam' với hàng trăm đồi chè bát úp nhấp nhô tuyệt mỹ.\n" +
          "- **Thời điểm đẹp nhất:** Sáng sớm (5:30 - 7:30) mùa thu - đông (tháng 9 đến tháng 12) khi mây bồng bềnh phủ quanh các ngọn đồi.\n" +
          "- **Gợi ý:** Nên kết hợp cắm trại đêm hoặc nghỉ tại homestay Tân Sơn để đón bình minh săn mây trọn vẹn!";
        suggestions = [
          { label: "🗺️ Lên tour phượt Long Cốc 2N1Đ", value: "start_planner" },
          { label: "🌲 Khám phá VQG Xuân Sơn gần đó", value: "ask_xuanson" },
        ];
      } else if (lower.includes("khoáng nóng") || lower.includes("thanh thủy") || lower.includes("onsen") || query === "ask_onsen") {
        answerText =
          "♨️ **Khu du lịch Suối khoáng nóng Thanh Thủy:**\n\n" +
          "- **Nguồn nước khoáng:** Giàu vi chất Radon quý hiếm, nhiệt độ tự nhiên 37°C - 53°C rất tốt cho xương khớp và phục hồi sức khỏe.\n" +
          "- **Khu nghỉ dưỡng nổi bật:** Wyndham Lynn Times Thanh Thủy (chuẩn Onsen Nhật Bản), Bamboo Resort, Tre Nguồn Resort, Đảo Ngọc Xanh.\n" +
          "- **Phù hợp:** Cặp đôi thư giãn, gia đình có người lớn tuổi & trẻ nhỏ nghỉ dưỡng cuối tuần.";
        suggestions = [
          { label: "💆 Lên tour nghỉ dưỡng Thanh Thủy 2N1Đ", value: "start_planner" },
          { label: "🏛️ Kết hợp thăm Đền Hùng", value: "start_planner" },
        ];
      } else if (lower.includes("đền hùng") || query === "ask_places") {
        answerText =
          "🏛️ **Khu di tích Lịch sử Quốc gia đặc biệt Đền Hùng:**\n\n" +
          "- Nơi thờ phụng các Vua Hùng đã có công dựng nước Văn Lang trên núi Nghĩa Lĩnh hùng vĩ.\n" +
          "- **Tuyến tham quan chính:** Đền Hạ ➔ Đền Trung ➔ Đền Thượng & Lăng Hùng Vương ➔ Đền Giếng (thờ công chúa Tiên Dung & Ngọc Hoa).\n" +
          "- **Nghi lễ:** Giỗ Tổ Hùng Vương diễn ra vào mùng 10 tháng 3 Âm lịch hàng năm thu hút hàng triệu đồng bào cả nước.";
        suggestions = [
          { label: "✨ Lên lịch trình tham quan Đền Hùng", value: "start_planner" },
          { label: "🍲 Tìm quán ăn ngon gần Đền Hùng", value: "ask_foods" },
        ];
      } else {
        // Natural language query - extract and guide
        answerText =
          `Em đã ghi nhận câu hỏi của bạn: "${query}".\n\n` +
          `Để chuyến đi Phú Thọ của bạn được chu đáo nhất, em có thể hỗ trợ bạn lên ngay **Lịch trình du lịch tự động** được tối ưu điểm đến, thời gian di chuyển, ăn uống và chi phí. Bạn có muốn bắt đầu ngay không?`;
        suggestions = [
          { label: "✨ Bắt đầu lên lịch trình tự động", value: "start_planner" },
          { label: "🏛️ Tìm hiểu điểm đến nổi tiếng", value: "ask_places" },
          { label: "🍲 Xem gợi ý đặc sản ẩm thực", value: "ask_foods" },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: "ai",
          text: answerText,
          timestamp: getTimeString(),
          options: suggestions,
        },
      ]);
      setIsThinking(false);
    }, 900);
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

    // Check if user is answering current step textually
    if (currentStep === "destination") {
      const updated = { ...survey, destinationText: userText };
      setSurvey(updated);
      promptNextQuestion("duration", updated);
      return;
    }

    if (currentStep === "duration") {
      const match = userText.match(/\d+/);
      const days = match ? parseInt(match[0], 10) : 2;
      const updated = { ...survey, durationDays: Math.min(Math.max(days, 1), 5) };
      setSurvey(updated);
      promptNextQuestion("travelers", updated);
      return;
    }

    if (currentStep === "travelers") {
      const match = userText.match(/\d+/);
      const trav = match ? parseInt(match[0], 10) : 2;
      const updated = { ...survey, travelers: Math.max(trav, 1) };
      setSurvey(updated);
      promptNextQuestion("transport", updated);
      return;
    }

    if (currentStep === "transport") {
      const updated = { ...survey, transport: userText };
      setSurvey(updated);
      promptNextQuestion("style", updated);
      return;
    }

    if (currentStep === "style") {
      const updated = { ...survey, style: userText };
      setSurvey(updated);
      handleFinalizeItinerary(updated);
      return;
    }

    // Default conversational AI processing
    handleKnowledgeQuery(userText);
  };

  // Trigger navigation to visual itinerary
  const handleViewVisualItinerary = (itinerary: GeneratedItinerary) => {
    onApplyItinerary(itinerary, {
      days: survey.durationDays,
      transport: survey.transport,
      style: survey.style,
      travelers: survey.travelers,
      anchorId: survey.anchorPlaceId,
    });
    // Auto-minimize chat so user can see full visual itinerary workspace unobstructed
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
                    Xin chào <strong>{authUser.name}</strong>! Cần em tự động lên lịch trình Phú Thọ bấm đây nhé! 💬
                  </span>
                ) : (
                  <span>
                    Chào bạn! Cần trợ lý AI lên lịch trình du lịch Phú Thọ bấm đây nhé! 💬
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
                  {authUser ? `Đang hỗ trợ: ${authUser.name}` : "Tư vấn & Lên lịch trình Phú Thọ"}
                </div>
              </div>
            </div>

            <div className="ai-chat-header__actions">
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => {
                  setSurvey(defaultSurvey);
                  setCurrentStep("idle");
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
                <p>Hỗ trợ tự động thiết kế lịch trình theo nhu cầu, tính toán chi phí, thời gian và đề xuất món ngon đặc sản Phú Thọ.</p>
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
                    {/* Render text with basic bold / break formatting */}
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
                            ✦ Lịch trình AI đề xuất · {msg.itinerary.durationDays} Ngày
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
                    <span className="ai-thinking-text">Trợ lý AI đang xử lý</span>
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
              placeholder={
                currentStep === "destination"
                  ? "Nhập điểm muốn đến (vd: Đồi chè Long Cốc, Đền Hùng...)"
                  : currentStep === "duration"
                  ? "Nhập số ngày dự kiến (vd: 2 ngày 1 đêm...)"
                  : currentStep === "travelers"
                  ? "Nhập số người đi (vd: 4 người...)"
                  : "Hỏi AI hoặc gõ yêu cầu chuyến đi của bạn..."
              }
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

// Utility to parse markdown-like bold (**text**)
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
