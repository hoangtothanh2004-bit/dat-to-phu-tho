"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "explore" | "trip" | "near" | "saved" | "profile";
type Category = "Tất cả" | "Tâm linh" | "Thiên nhiên" | "Nghỉ dưỡng" | "Văn hóa";

type NearbyItem = {
  name: string;
  type: string;
  distance: string;
  note: string;
};

type Place = {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<Category, "Tất cả">;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  hours: string;
  price: string;
  description: string;
  tags: string[];
  lat: number;
  lng: number;
  featured?: boolean;
  restaurants: NearbyItem[];
  stays: NearbyItem[];
};

const places: Place[] = [
  {
    id: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    shortName: "Đền Hùng",
    category: "Tâm linh",
    location: "Hy Cương, Việt Trì",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/%C4%90%E1%BB%81n_H%C3%B9ng%2C_Ph%C3%BA_Th%E1%BB%8D_%281%29.jpg?width=1400",
    rating: 4.9,
    reviews: 2840,
    hours: "Mở cửa 06:00 – 18:00",
    price: "Tham quan miễn phí",
    description:
      "Quần thể đền thờ các Vua Hùng trên núi Nghĩa Lĩnh — điểm bắt đầu trọn vẹn cho hành trình tìm về cội nguồn dân tộc.",
    tags: ["Di sản", "Hát Xoan", "Gia đình"],
    lat: 21.366,
    lng: 105.3246,
    featured: true,
    restaurants: [
      { name: "Nhà hàng Quê Hương", type: "Ẩm thực Đất Tổ", distance: "0,8 km", note: "Món địa phương • Phù hợp nhóm" },
      { name: "Bánh tai Phú Thọ", type: "Ăn nhanh", distance: "1,2 km", note: "30–60 nghìn/người" },
      { name: "Cơm niêu Việt Trì", type: "Cơm Việt", distance: "2,7 km", note: "Có chỗ đỗ ô tô" },
    ],
    stays: [
      { name: "Sài Gòn – Phú Thọ Hotel", type: "Khách sạn", distance: "7,4 km", note: "Trung tâm Việt Trì" },
      { name: "Mường Thanh Luxury Phú Thọ", type: "Khách sạn", distance: "8,1 km", note: "Phòng gia đình • Hồ bơi" },
    ],
  },
  {
    id: "xuan-son",
    name: "Vườn quốc gia Xuân Sơn",
    shortName: "Xuân Sơn",
    category: "Thiên nhiên",
    location: "Xuân Sơn, Tân Sơn",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Xuan_Son_3.jpg?width=1400",
    rating: 4.8,
    reviews: 968,
    hours: "Mở cửa cả ngày",
    price: "Từ 40.000đ/người",
    description:
      "Rừng nguyên sinh trên núi đá vôi, hang động, suối và bản làng Dao – Mường. Lý tưởng cho trekking và du lịch cộng đồng.",
    tags: ["Trekking", "Bản Cỏi", "Sinh thái"],
    lat: 21.1506,
    lng: 104.9327,
    featured: true,
    restaurants: [
      { name: "Cơm nhà sàn bản Cỏi", type: "Ẩm thực Mường", distance: "0,4 km", note: "Gà nhiều cựa • Cá suối" },
      { name: "Bếp bản Dù", type: "Mâm cỗ lá", distance: "1,6 km", note: "Nên đặt trước" },
    ],
    stays: [
      { name: "Xuân Sơn Homestay", type: "Homestay", distance: "0,6 km", note: "Ngủ nhà sàn • Ăn sáng" },
      { name: "Lâm Homestay", type: "Homestay", distance: "1,1 km", note: "Gần đường trekking" },
    ],
  },
  {
    id: "long-coc",
    name: "Đồi chè Long Cốc",
    shortName: "Long Cốc",
    category: "Thiên nhiên",
    location: "Long Cốc, Tân Sơn",
    image: "https://dulichphutho.gov.vn/uploads/ThuVien/03.jpg",
    rating: 4.8,
    reviews: 1240,
    hours: "Đẹp nhất 05:00 – 08:00",
    price: "Tham quan miễn phí",
    description:
      "Những đồi chè hình bát úp nối tiếp trong sương sớm, thường được gọi là “vịnh Hạ Long vùng trung du”.",
    tags: ["Săn mây", "Chụp ảnh", "Đồi chè"],
    lat: 21.1804,
    lng: 105.0708,
    featured: true,
    restaurants: [
      { name: "Bếp Lá Long Cốc", type: "Mâm cỗ lá", distance: "0,7 km", note: "Đặc sản người Mường" },
      { name: "Quán chè cô Lan", type: "Trà & ăn nhẹ", distance: "1,3 km", note: "Trà Long Cốc tại vườn" },
    ],
    stays: [
      { name: "Long Cốc Ecolodge", type: "Homestay", distance: "0,9 km", note: "View đồi chè" },
      { name: "Mường Homestay", type: "Nhà sàn", distance: "2,2 km", note: "Có trải nghiệm bản địa" },
    ],
  },
  {
    id: "thanh-thuy",
    name: "Khoáng nóng Thanh Thủy",
    shortName: "Thanh Thủy",
    category: "Nghỉ dưỡng",
    location: "La Phù, Thanh Thủy",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
    rating: 4.7,
    reviews: 1678,
    hours: "Mở cửa 08:00 – 22:00",
    price: "Từ 200.000đ/người",
    description:
      "Cụm nghỉ dưỡng khoáng nóng bên sông Đà, phù hợp để thả lỏng sau một ngày khám phá và cho chuyến đi gia đình.",
    tags: ["Khoáng nóng", "Gia đình", "Spa"],
    lat: 21.1511,
    lng: 105.2971,
    featured: true,
    restaurants: [
      { name: "Nhà hàng Sông Đà", type: "Cá sông", distance: "0,5 km", note: "Cá ngạnh • Gà đồi" },
      { name: "Bếp Việt Thanh Thủy", type: "Cơm Việt", distance: "1,1 km", note: "Có phòng riêng" },
    ],
    stays: [
      { name: "Wyndham Thanh Thủy", type: "Resort", distance: "0,3 km", note: "Khoáng nóng • Hồ bơi" },
      { name: "Thanh Lâm Resort", type: "Resort", distance: "1,8 km", note: "Phù hợp gia đình" },
    ],
  },
  {
    id: "hung-lo",
    name: "Đình cổ Hùng Lô",
    shortName: "Hùng Lô",
    category: "Văn hóa",
    location: "Hùng Lô, Việt Trì",
    image:
      "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&w=1400&q=85",
    rating: 4.7,
    reviews: 426,
    hours: "Mở cửa 07:00 – 17:30",
    price: "Tham quan miễn phí",
    description:
      "Không gian đình cổ, làng nghề mì gạo và những buổi biểu diễn Hát Xoan đậm bản sắc vùng Đất Tổ.",
    tags: ["Hát Xoan", "Làng cổ", "Mì gạo"],
    lat: 21.3712,
    lng: 105.4077,
    restaurants: [
      { name: "Chợ quê Hùng Lô", type: "Đặc sản", distance: "0,2 km", note: "Bánh chưng • Mì gạo" },
      { name: "Bếp làng Xoan", type: "Cơm quê", distance: "0,8 km", note: "Đặt mâm theo nhóm" },
    ],
    stays: [
      { name: "Việt Trì Garden", type: "Khách sạn", distance: "4,4 km", note: "Gần trung tâm" },
    ],
  },
  {
    id: "van-lang",
    name: "Công viên Văn Lang",
    shortName: "Văn Lang",
    category: "Văn hóa",
    location: "Trung tâm Việt Trì",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    rating: 4.6,
    reviews: 1830,
    hours: "Mở cửa cả ngày",
    price: "Miễn phí",
    description:
      "Không gian xanh quanh hồ ở trung tâm thành phố, lý tưởng để đi bộ, ngắm hoàng hôn và khám phá ẩm thực buổi tối.",
    tags: ["Hoàng hôn", "Đi bộ", "Buổi tối"],
    lat: 21.3066,
    lng: 105.3998,
    restaurants: [
      { name: "Phố ẩm thực Việt Trì", type: "Ăn tối", distance: "0,4 km", note: "Nhiều lựa chọn" },
      { name: "Bún tôm Đất Tổ", type: "Đặc sản", distance: "0,9 km", note: "40–70 nghìn/người" },
    ],
    stays: [
      { name: "SOJO Hotel Việt Trì", type: "Khách sạn", distance: "0,7 km", note: "Trung tâm • Hiện đại" },
    ],
  },
];

const services = [
  { icon: "✚", name: "Bệnh viện Đa khoa tỉnh", type: "Y tế", lat: 21.3215, lng: 105.3926, note: "Cấp cứu 24/7" },
  { icon: "⛽", name: "Trạm xăng Hùng Vương", type: "Trạm xăng", lat: 21.3341, lng: 105.3835, note: "Mở cửa cả ngày" },
  { icon: "P", name: "Bãi xe trung tâm Đền Hùng", type: "Bãi đỗ xe", lat: 21.3612, lng: 105.3297, note: "Xe máy • Ô tô • Xe khách" },
  { icon: "▣", name: "ATM Vietcombank Việt Trì", type: "ATM", lat: 21.3048, lng: 105.4028, note: "Hoạt động 24/7" },
  { icon: "WC", name: "Nhà vệ sinh công cộng Văn Lang", type: "Tiện ích", lat: 21.307, lng: 105.4002, note: "Có lối tiếp cận" },
];

const categories: { label: Category; icon: string }[] = [
  { label: "Tất cả", icon: "⌘" },
  { label: "Tâm linh", icon: "◆" },
  { label: "Thiên nhiên", icon: "♧" },
  { label: "Nghỉ dưỡng", icon: "◌" },
  { label: "Văn hóa", icon: "◎" },
];

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
  if (distance < 1) return `${Math.max(50, Math.round(distance * 1000 / 50) * 50)} m`;
  if (distance > 999) return `${Math.round(distance).toLocaleString("vi-VN")} km`;
  return `${distance.toFixed(distance < 10 ? 1 : 0).replace(".", ",")} km`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [category, setCategory] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");
  const [serverResultIds, setServerResultIds] = useState<string[] | null>(null);
  const [isServerSearching, setIsServerSearching] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [detailMode, setDetailMode] = useState<"eat" | "stay">("eat");
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState("2–4 triệu");
  const [interest, setInterest] = useState("Văn hóa & cội nguồn");
  const [plan, setPlan] = useState<Place[]>([places[0], places[4], places[2], places[3]]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Chưa bật định vị");
  const [serviceFilter, setServiceFilter] = useState("Tất cả");
  const [weather, setWeather] = useState<{ temp: number; label: string }>({ temp: 29, label: "Nắng nhẹ" });
  const [toast, setToast] = useState("");
  const [isListening, setIsListening] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const favoritesTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("datto-favorites");
        if (stored) setFavorites(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("datto-favorites");
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

  useEffect(() => {
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
    showToast(next.includes(id) ? "Đã lưu để xem lại trên thiết bị" : "Đã bỏ khỏi danh sách lưu");
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Thiết bị không hỗ trợ định vị");
      return;
    }
    setLocationMessage("Đang xác định vị trí…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setLocationMessage("Đã dùng vị trí hiện tại");
        showToast("Đã sắp xếp gợi ý theo vị trí của bạn");
      },
      () => {
        setLocationMessage("Không thể lấy vị trí — hãy cấp quyền GPS");
        showToast("Bạn có thể bật quyền Vị trí trong cài đặt trình duyệt");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    const serverMatches = serverResultIds ? new Set(serverResultIds) : null;
    const matchingPlaces = serverMatches
      ? places.filter((place) => serverMatches.has(place.id))
      : places
          .filter((place) => category === "Tất cả" || place.category === category)
          .filter((place) =>
            [place.name, place.location, place.category, ...place.tags]
              .join(" ")
              .toLocaleLowerCase("vi")
              .includes(normalized),
          );

    return matchingPlaces
      .sort((a, b) => {
        if (!position) return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return (
          haversine(position.lat, position.lng, a.lat, a.lng) -
          haversine(position.lat, position.lng, b.lat, b.lng)
        );
      });
  }, [category, position, query, serverResultIds]);

  const generatePlan = () => {
    let pool = [...places];
    if (interest.includes("Thiên nhiên")) pool.sort((a) => (a.category === "Thiên nhiên" ? -1 : 1));
    if (interest.includes("Nghỉ dưỡng")) pool.sort((a) => (a.category === "Nghỉ dưỡng" ? -1 : 1));
    if (interest.includes("Ẩm thực")) pool = [places[4], places[0], places[2], places[5], places[3], places[1]];
    if (interest.includes("Văn hóa")) pool = [places[0], places[4], places[5], places[2], places[3], places[1]];
    setPlan(pool.slice(0, Math.min(days * 2, pool.length)));
    showToast(`Đã tạo lịch trình ${days} ngày theo sở thích của bạn`);
  };

  const movePlanItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= plan.length) return;
    const next = [...plan];
    [next[index], next[target]] = [next[target], next[index]];
    setPlan(next);
  };

  const dropPlanItem = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...plan];
    const from = next.findIndex((item) => item.id === draggedId);
    const to = next.findIndex((item) => item.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPlan(next);
    setDraggedId(null);
  };

  const speakGuide = (place: Place) => {
    if (!("speechSynthesis" in window)) {
      showToast("Thiết bị chưa hỗ trợ thuyết minh tự động");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Bạn đang khám phá ${place.name}. ${place.description}. Một số trải nghiệm nổi bật gồm ${place.tags.join(", ")}.`,
    );
    utterance.lang = "vi-VN";
    utterance.rate = 0.92;
    utterance.onstart = () => setIsListening(true);
    utterance.onend = () => setIsListening(false);
    utterance.onerror = () => setIsListening(false);
    window.speechSynthesis.speak(utterance);
  };

  const distanceFromUser = (place: Place) =>
    position ? formatDistance(haversine(position.lat, position.lng, place.lat, place.lng)) : null;

  const openPlace = (place: Place) => {
    setDetailMode("eat");
    setSelected(place);
  };

  const renderPlaceCard = (place: Place, compact = false) => (
    <article className={`place-card ${compact ? "place-card--compact" : ""}`} key={place.id}>
      <button className="place-card__image-button" onClick={() => openPlace(place)} aria-label={`Xem ${place.name}`}>
        <img className="place-card__image" src={place.image} alt={place.name} />
        <span className="place-card__category">{place.category}</span>
        {distanceFromUser(place) && <span className="place-card__distance">⌖ {distanceFromUser(place)}</span>}
      </button>
      <button
        className={`heart-button ${favorites.includes(place.id) ? "is-saved" : ""}`}
        onClick={() => toggleFavorite(place.id)}
        aria-label={favorites.includes(place.id) ? `Bỏ lưu ${place.name}` : `Lưu ${place.name}`}
      >
        {favorites.includes(place.id) ? "♥" : "♡"}
      </button>
      <button className="place-card__body" onClick={() => openPlace(place)}>
        <span className="eyebrow">{place.location}</span>
        <strong>{place.shortName}</strong>
        <span className="place-card__meta"><b>★ {place.rating}</b> ({place.reviews.toLocaleString("vi-VN")}) · {place.hours.replace("Mở cửa ", "")}</span>
        {!compact && <span className="place-card__footer">{place.tags.slice(0, 2).join(" · ")} <i>Khám phá →</i></span>}
      </button>
    </article>
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setActiveTab("explore")} aria-label="Về trang khám phá">
          <span className="brand__mark">Đ</span>
          <span><strong>Đất Tổ</strong><small>PHÚ THỌ TRAVEL</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navigation.slice(0, 4).map((item) => (
            <button key={item.id} className={activeTab === item.id ? "is-active" : ""} onClick={() => setActiveTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="topbar__actions">
          <button className="weather-pill" onClick={() => showToast(`${weather.label} tại Việt Trì · Dữ liệu thời tiết trực tuyến`)}>
            <span>☀</span><b>{weather.temp}°</b><small>Việt Trì</small>
          </button>
          <button className="avatar" onClick={() => setActiveTab("profile")} aria-label="Trang cá nhân">TH</button>
        </div>
      </header>

      {activeTab === "explore" && (
        <>
          <section className="hero">
            <div className="hero__content">
              <span className="kicker">VỀ MIỀN DI SẢN</span>
              <h1>Phú Thọ<br /><em>đi đâu, ăn gì?</em></h1>
              <p>Trợ lý bản địa giúp bạn lên đường tự tin — từ điểm đến, quán ngon đến chỗ nghỉ ngay gần bạn.</p>
              <div className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm Đền Hùng, món ngon, homestay…"
                  aria-label="Tìm kiếm điểm đến"
                />
                <button onClick={locate} title="Dùng vị trí hiện tại" aria-label="Dùng vị trí hiện tại">⌖</button>
              </div>
              <div className="hero__trust">
                <span><b>40+</b> điểm đến chọn lọc</span>
                <span><b>120+</b> dịch vụ địa phương</span>
                <span><b>24/7</b> hỗ trợ hành trình</span>
              </div>
            </div>
            <div className="hero__visual">
              <img src={places[0].image} alt="Cổng Khu di tích lịch sử Đền Hùng" />
              <div className="hero__caption">
                <span>GỢI Ý ĐẦU TIÊN</span>
                <strong>Khu di tích Đền Hùng</strong>
                <button onClick={() => openPlace(places[0])}>Mở cẩm nang →</button>
              </div>
              <div className="hero__stamp"><b>01</b><span>ĐIỂM<br />KHỞI ĐẦU</span></div>
            </div>
          </section>

          <section className="content-section category-section">
            <div className="section-heading section-heading--inline">
              <div><span className="section-number">01</span><h2>Khám phá theo cách của bạn</h2></div>
              <button className="text-link" onClick={() => { setCategory("Tất cả"); setQuery(""); }}>Xem tất cả →</button>
            </div>
            <div className="category-row" role="group" aria-label="Lọc theo danh mục">
              {categories.map((item) => (
                <button key={item.label} onClick={() => setCategory(item.label)} className={category === item.label ? "is-active" : ""}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="content-section places-section">
            <div className="section-heading section-heading--inline">
              <div>
                <span className="section-number">02</span>
                <h2>{query ? `Kết quả cho “${query}”` : position ? "Gần vị trí của bạn" : "Không thể bỏ lỡ"}</h2>
                <p>{isServerSearching ? "Đang tìm trên máy chủ…" : `${locationMessage} · ${filteredPlaces.length} gợi ý phù hợp`}</p>
              </div>
              {!position && <button className="location-link" onClick={locate}>⌖ Bật định vị</button>}
            </div>
            {filteredPlaces.length ? (
              <div className="place-grid">{filteredPlaces.slice(0, 4).map((place) => renderPlaceCard(place))}</div>
            ) : (
              <div className="empty-state"><b>Chưa tìm thấy kết quả</b><span>Thử từ khóa “thiên nhiên”, “Đền Hùng” hoặc chọn danh mục khác.</span></div>
            )}
          </section>

          <section className="content-section itinerary-teaser">
            <div className="itinerary-teaser__copy">
              <span className="section-number section-number--light">03</span>
              <span className="kicker kicker--light">TRỢ LÝ LỊCH TRÌNH</span>
              <h2>Hai ngày ở Đất Tổ,<br /><em>để chúng tôi lo.</em></h2>
              <p>Chọn thời gian, ngân sách và sở thích. Lịch trình cân bằng quãng đường, giờ mở cửa, ăn uống và nghỉ ngơi.</p>
              <button className="button button--cream" onClick={() => setActiveTab("trip")}>Tạo lịch trình miễn phí →</button>
            </div>
            <div className="mini-itinerary">
              <div className="mini-itinerary__top"><span>LỊCH TRÌNH MẪU</span><b>2N1Đ</b></div>
              {[places[0], places[4], places[2], places[3]].map((place, index) => (
                <div className="mini-stop" key={place.id}>
                  <span className="mini-stop__time">{["07:30", "11:30", "06:00", "16:00"][index]}</span>
                  <span className="mini-stop__dot" />
                  <img src={place.image} alt="" />
                  <span><b>{place.shortName}</b><small>{index === 1 ? "Ăn trưa & Hát Xoan" : place.location}</small></span>
                </div>
              ))}
              <div className="route-summary"><span>⌁ 148 km tổng tuyến</span><span>≈ 3 giờ 40 phút di chuyển</span></div>
            </div>
          </section>

          <section className="content-section local-guide">
            <div>
              <span className="kicker">ĂN NHƯ NGƯỜI BẢN ĐỊA</span>
              <h2>Mỗi điểm đến,<br />một món phải thử.</h2>
            </div>
            <div className="food-list">
              {[
                ["01", "Thịt chua Thanh Sơn", "Lá sung · Thính rang", "Từ 45.000đ"],
                ["02", "Gà nhiều cựa Xuân Sơn", "Gà bản · Mắc khén", "Từ 320.000đ"],
                ["03", "Bánh tai Phú Thọ", "Bột gạo · Nhân thịt", "Từ 10.000đ"],
                ["04", "Bưởi Đoan Hùng", "OCOP · Quà mang về", "Theo mùa"],
              ].map((food) => (
                <button key={food[0]} onClick={() => { setQuery(food[1]); setActiveTab("explore"); }}>
                  <span>{food[0]}</span><b>{food[1]}</b><small>{food[2]}</small><i>{food[3]} →</i>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "trip" && (
        <section className="inner-page trip-page">
          <div className="inner-page__intro">
            <span className="kicker">SMART ITINERARY</span>
            <h1>Lịch trình vừa vặn<br /><em>với riêng bạn.</em></h1>
            <p>Thay đổi lựa chọn, tạo gợi ý mới rồi kéo thả để sắp xếp theo nhịp đi của bạn.</p>
          </div>
          <div className="builder-layout">
            <aside className="builder-card">
              <span className="builder-card__step">BƯỚC 1 / 2</span>
              <h2>Bạn muốn đi thế nào?</h2>
              <label>Số ngày
                <div className="day-picker">
                  {[1, 2, 3, 4].map((item) => <button key={item} className={days === item ? "is-active" : ""} onClick={() => setDays(item)}>{item}<small>ngày</small></button>)}
                </div>
              </label>
              <label>Ngân sách
                <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                  <option>Dưới 2 triệu</option><option>2–4 triệu</option><option>4–7 triệu</option><option>Trên 7 triệu</option>
                </select>
              </label>
              <label>Sở thích chính
                <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                  <option>Văn hóa & cội nguồn</option><option>Thiên nhiên & trekking</option><option>Nghỉ dưỡng gia đình</option><option>Ẩm thực bản địa</option>
                </select>
              </label>
              <button className="button button--dark button--full" onClick={generatePlan}>Tạo lịch trình gợi ý ✦</button>
              <small className="builder-note">Không cần đăng nhập · Có thể chỉnh sửa sau khi tạo</small>
            </aside>
            <div className="plan-panel">
              <div className="plan-panel__header">
                <div><span>LỊCH TRÌNH CỦA BẠN</span><h2>{days} ngày · {interest.split(" & ")[0]}</h2></div>
                <button onClick={() => showToast("Đã lưu lịch trình trên thiết bị")}>♡ Lưu chuyến đi</button>
              </div>
              <div className="plan-summary">
                <span><b>{plan.length}</b> điểm dừng</span><span><b>{budget}</b> ngân sách</span><span><b>Hợp lý</b> nhịp di chuyển</span>
              </div>
              <div className="plan-list">
                {plan.map((place, index) => (
                  <article
                    key={place.id}
                    className={`plan-item ${draggedId === place.id ? "is-dragging" : ""}`}
                    draggable
                    onDragStart={() => setDraggedId(place.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => dropPlanItem(place.id)}
                  >
                    <span className="drag-handle" title="Kéo để sắp xếp">⠿</span>
                    <span className="plan-time">{index % 2 === 0 ? "08:00" : "14:00"}<small>NGÀY {Math.floor(index / 2) + 1}</small></span>
                    <img src={place.image} alt="" />
                    <button className="plan-item__main" onClick={() => openPlace(place)}><b>{place.shortName}</b><small>{place.location} · {place.category}</small></button>
                    <div className="plan-reorder">
                      <button onClick={() => movePlanItem(index, -1)} disabled={index === 0} aria-label="Di chuyển lên">↑</button>
                      <button onClick={() => movePlanItem(index, 1)} disabled={index === plan.length - 1} aria-label="Di chuyển xuống">↓</button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="route-card">
                <div><span>⌁</span><p><b>Tuyến đã được gom theo khu vực</b><small>Giảm quãng đường vòng và kết thúc ở điểm nghỉ dưỡng.</small></p></div>
                <a href={`https://www.google.com/maps/dir/${plan.map((item) => `${item.lat},${item.lng}`).join("/")}`} target="_blank" rel="noreferrer">Mở tuyến đường →</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "near" && (
        <section className="inner-page near-page">
          <div className="near-header">
            <div><span className="kicker">NEAR ME</span><h1>Tiện ích<br /><em>quanh bạn.</em></h1></div>
            <div className="near-location-card">
              <span className="pulse-dot" />
              <p><b>{locationMessage}</b><small>{position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "Cho phép vị trí để tính khoảng cách thực"}</small></p>
              <button onClick={locate}>{position ? "Cập nhật" : "Bật GPS"}</button>
            </div>
          </div>
          <div className="service-tabs">
            {["Tất cả", "Y tế", "Trạm xăng", "Bãi đỗ xe", "ATM", "Tiện ích"].map((item) => (
              <button key={item} className={serviceFilter === item ? "is-active" : ""} onClick={() => setServiceFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="near-layout">
            <div className="map-panel">
              <iframe
                title="Bản đồ tiện ích du lịch Phú Thọ"
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.286%2C21.285%2C105.428%2C21.385&layer=mapnik&marker=21.324%2C105.376"
                loading="lazy"
              />
              <span className="map-credit">Bản đồ © OpenStreetMap</span>
            </div>
            <div className="service-list">
              {services.filter((item) => serviceFilter === "Tất cả" || item.type === serviceFilter).map((item) => {
                const distance = position ? formatDistance(haversine(position.lat, position.lng, item.lat, item.lng)) : "—";
                return (
                  <article key={item.name}>
                    <span className="service-icon">{item.icon}</span>
                    <div><span>{item.type}</span><b>{item.name}</b><small>{item.note}</small></div>
                    <p><b>{distance}</b><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}>Chỉ đường →</a></p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="sos-strip">
            <div><span>SOS</span><p><b>Bạn cần trợ giúp khẩn cấp?</b><small>Chỉ sử dụng các số này khi có tình huống thực sự khẩn cấp.</small></p></div>
            <div className="sos-actions">
              <a href="tel:112"><b>112</b><small>Khẩn cấp quốc gia</small></a>
              <a href="tel:113"><b>113</b><small>Công an</small></a>
              <a href="tel:115"><b>115</b><small>Cấp cứu</small></a>
            </div>
          </div>
        </section>
      )}

      {activeTab === "saved" && (
        <section className="inner-page saved-page">
          <div className="inner-page__intro">
            <span className="kicker">SỔ TAY CỦA BẠN</span>
            <h1>Những nơi<br /><em>muốn quay lại.</em></h1>
            <p>Địa điểm đã lưu nằm trên thiết bị này để bạn dễ tìm lại khi lên đường.</p>
          </div>
          {favorites.length ? (
            <div className="place-grid saved-grid">{places.filter((place) => favorites.includes(place.id)).map((place) => renderPlaceCard(place))}</div>
          ) : (
            <div className="saved-empty">
              <span>♡</span><h2>Sổ tay đang trống</h2><p>Chạm biểu tượng trái tim ở bất kỳ điểm đến nào để lưu lại tại đây.</p>
              <button className="button button--dark" onClick={() => setActiveTab("explore")}>Bắt đầu khám phá →</button>
            </div>
          )}
        </section>
      )}

      {activeTab === "profile" && (
        <section className="inner-page profile-page">
          <div className="profile-hero">
            <div className="profile-avatar">TH</div>
            <div><span>DU KHÁCH ĐẤT TỔ</span><h1>Thanh Hoàng</h1><p>Hành trình đầu tiên đang chờ bạn.</p></div>
            <button onClick={() => showToast("Hồ sơ demo chưa yêu cầu đăng nhập")}>Chỉnh sửa hồ sơ</button>
          </div>
          <div className="profile-grid">
            <article className="passport-card">
              <span className="kicker kicker--light">HỘ CHIẾU ĐẤT TỔ</span><h2>Sưu tập dấu chân,<br />mở khóa đặc quyền.</h2>
              <div className="stamp-row"><span className="stamp is-earned">ĐH<small>Đền Hùng</small></span><span className="stamp">XS<small>Xuân Sơn</small></span><span className="stamp">LC<small>Long Cốc</small></span><span className="stamp">TT<small>Thanh Thủy</small></span></div>
              <p><b>1 / 4</b> điểm đã check-in · Thêm 3 dấu để nhận voucher 10%</p>
            </article>
            <article className="booking-card">
              <span>ĐẶT DỊCH VỤ</span><h2>Mọi thứ cho chuyến đi</h2>
              <button onClick={() => showToast("Form yêu cầu tour đã sẵn sàng kết nối đối tác")}><i>▣</i><b>Đặt tour địa phương</b><small>Gửi yêu cầu trong 1 phút</small><em>→</em></button>
              <button onClick={() => setActiveTab("saved")}><i>⌂</i><b>Khách sạn & homestay</b><small>Từ danh sách đã xác minh</small><em>→</em></button>
              <button onClick={() => showToast("Khu OCOP sẽ kết nối gian hàng chính hãng")}><i>◇</i><b>Quà OCOP chính hãng</b><small>Chè, bưởi, thịt chua…</small><em>→</em></button>
            </article>
            <article className="partner-card">
              <span>DÀNH CHO ĐỐI TÁC ĐỊA PHƯƠNG</span><h2>Đưa dịch vụ của bạn đến đúng du khách.</h2><p>Nhà hàng, homestay, hướng dẫn viên và cơ sở OCOP có thể đăng ký gian hàng đã xác minh.</p>
              <button className="button button--outline" onClick={() => showToast("Đã ghi nhận quan tâm — bước sau sẽ nối form đối tác")}>Đăng ký đối tác →</button>
            </article>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="brand brand--footer"><span className="brand__mark">Đ</span><span><strong>Đất Tổ</strong><small>PHÚ THỌ TRAVEL</small></span></div>
        <p>Bản mẫu sản phẩm du lịch thông minh · Thông tin dịch vụ cần được đối tác xác minh trước khi thương mại hóa.</p>
        <span>Made for Phú Thọ ↗</span>
      </footer>

      <nav className="bottom-nav" aria-label="Điều hướng trên điện thoại">
        {navigation.map((item) => (
          <button key={item.id} className={activeTab === item.id ? "is-active" : ""} onClick={() => setActiveTab(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="place-modal" role="dialog" aria-modal="true" aria-labelledby="place-modal-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Đóng">×</button>
            <div className="modal-hero">
              <img src={selected.image} alt={selected.name} />
              <span className="modal-hero__shade" />
              <div><span>{selected.category} · {selected.location}</span><h2 id="place-modal-title">{selected.name}</h2><p><b>★ {selected.rating}</b> ({selected.reviews.toLocaleString("vi-VN")} đánh giá)</p></div>
              <button className={`heart-button modal-heart ${favorites.includes(selected.id) ? "is-saved" : ""}`} onClick={() => toggleFavorite(selected.id)}>{favorites.includes(selected.id) ? "♥" : "♡"}</button>
            </div>
            <div className="modal-body">
              <div className="modal-main">
                <div className="fact-row"><span><small>GIỜ HOẠT ĐỘNG</small><b>{selected.hours}</b></span><span><small>CHI PHÍ THAM KHẢO</small><b>{selected.price}</b></span></div>
                <p className="modal-description">{selected.description}</p>
                <div className="tag-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="modal-actions">
                  <a className="button button--dark" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}>⌁ Chỉ đường</a>
                  <button className="button button--outline" onClick={() => speakGuide(selected)}>{isListening ? "◼ Dừng sau đoạn này" : "▶ Nghe thuyết minh"}</button>
                </div>
                <div className="nearby-section">
                  <div className="nearby-tabs"><button className={detailMode === "eat" ? "is-active" : ""} onClick={() => setDetailMode("eat")}>Ăn ngon gần đây</button><button className={detailMode === "stay" ? "is-active" : ""} onClick={() => setDetailMode("stay")}>Chỗ nghỉ gần đây</button></div>
                  {(detailMode === "eat" ? selected.restaurants : selected.stays).map((item) => (
                    <article key={item.name}><span>{detailMode === "eat" ? "♨" : "⌂"}</span><div><b>{item.name}</b><small>{item.type} · {item.note}</small></div><p>{item.distance}<a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} Phú Thọ`)}`}>Xem bản đồ →</a></p></article>
                  ))}
                </div>
              </div>
              <aside className="modal-map">
                <iframe title={`Bản đồ ${selected.name}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.035}%2C${selected.lat - 0.025}%2C${selected.lng + 0.035}%2C${selected.lat + 0.025}&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`} loading="lazy" />
                <div><span>⌖</span><p><b>{selected.location}</b><small>{distanceFromUser(selected) ? `${distanceFromUser(selected)} từ vị trí của bạn` : "Bật GPS để xem khoảng cách"}</small></p></div>
              </aside>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
