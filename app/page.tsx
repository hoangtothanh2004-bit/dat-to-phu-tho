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

const services = [
  { icon: "✚", name: "Bệnh viện Đa khoa tỉnh", type: "Y tế", lat: 21.3215, lng: 105.3926, note: "Cấp cứu 24/7" },
  { icon: "⛽", name: "Trạm xăng Hùng Vương", type: "Trạm xăng", lat: 21.3341, lng: 105.3835, note: "Mở cửa cả ngày" },
  { icon: "P", name: "Bãi xe trung tâm Đền Hùng", type: "Bãi đỗ xe", lat: 21.3612, lng: 105.3297, note: "Xe máy • Ô tô • Xe khách" },
  { icon: "▣", name: "ATM Vietcombank Việt Trì", type: "ATM", lat: 21.3048, lng: 105.4028, note: "Hoạt động 24/7" },
  { icon: "WC", name: "Nhà vệ sinh công cộng Văn Lang", type: "Tiện ích", lat: 21.307, lng: 105.4002, note: "Có lối tiếp cận" },
];

const categories = categoryLabels.map((label) => ({ label, icon: categoryIcons[label] }));
const foodCatalog = foodRegions.flatMap((region) => region.dishes.map((dish) => ({ dish, region })));
const seasonFilters: SeasonFilter[] = ["Tất cả", "Đang hợp mùa", "Mùa xuân", "Mùa hè", "Mùa thu", "Mùa đông"];
const seasonMonths: Record<Exclude<SeasonFilter, "Tất cả" | "Đang hợp mùa">, number[]> = {
  "Mùa xuân": [1, 2, 3, 4],
  "Mùa hè": [5, 6, 7],
  "Mùa thu": [8, 9, 10],
  "Mùa đông": [11, 12, 1],
};
const mapBounds = { minLat: 21.08, maxLat: 21.58, minLng: 104.88, maxLng: 105.48 };

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

function formatMoney(amount: number) {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

function estimatedStayPrice(stay: NearbyItem) {
  const key = normalizeSearch(`${stay.name} ${stay.type}`);
  if (key.includes("wyndham")) return 1_500_000;
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
  const minutes = Math.max(5, Math.round((distance / (distance > 35 ? 48 : 35)) * 60 / 5) * 5);
  if (minutes < 60) return `Khoảng ${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `Khoảng ${hours} giờ${remainder ? ` ${remainder} phút` : ""}`;
}

function isInSeason(place: Place, month = new Date().getMonth() + 1) {
  return place.seasonMonths.includes(month);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [selectedRegion, setSelectedRegion] = useState<Region>("Tất cả");
  const [category, setCategory] = useState<Category>("Tất cả");
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>("Tất cả");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [serverResultIds, setServerResultIds] = useState<string[] | null>(null);
  const [isServerSearching, setIsServerSearching] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [detailMode, setDetailMode] = useState<"eat" | "stay">("eat");
  const [targetPlaceId, setTargetPlaceId] = useState<string>(places[0]?.id || "den-hung");
  const [tripRegion, setTripRegion] = useState<string>("Tất cả");
  const [tripDistrict, setTripDistrict] = useState<string>("Tất cả");
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([places[0]?.id || "den-hung"]);
  const [days, setDays] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [transport, setTransport] = useState("Ô tô riêng");
  const [budget, setBudget] = useState("Tiêu chuẩn");
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
  const [audioGuidePlaying, setAudioGuidePlaying] = useState(false);

  const availableDistricts = useMemo(() => {
    if (tripRegion === "Phú Thọ lõi") {
      return ["Tất cả", "TP. Việt Trì", "Huyện Tân Sơn", "Huyện Thanh Thủy", "Huyện Hạ Hòa"];
    }
    if (tripRegion === "Vùng Vĩnh Phúc") {
      return ["Tất cả", "Huyện Tam Đảo", "TP. Phúc Yên", "TP. Vĩnh Yên", "Huyện Bình Xuyên"];
    }
    if (tripRegion === "Vùng Hòa Bình") {
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
    });
    setGeneratedItinerary(res);
    showToast(`✦ Đã áp dụng ${name}!`);
  };
  const [show100Directory, setShow100Directory] = useState(false);
  const [directoryDistrict, setDirectoryDistrict] = useState("Tất cả");
  const [directorySearch, setDirectorySearch] = useState("");
  const [plan, setPlan] = useState<Place[]>([places[0], places[1], places[2], places[3]]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Chưa bật định vị");
  const [serviceFilter, setServiceFilter] = useState("Tất cả");
  const [selectedNearItemId, setSelectedNearItemId] = useState("place-den-hung");
  const [weather, setWeather] = useState<{ temp: number; label: string }>({ temp: 29, label: "Nắng nhẹ" });
  const [toast, setToast] = useState("");
  const [foodRegionId, setFoodRegionId] = useState(foodRegions[0].id);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [speechPlaceId, setSpeechPlaceId] = useState<string | null>(null);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewName, setReviewName] = useState("Du khách");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [bookingOffer, setBookingOffer] = useState<BookingOffer | null>(null);
  const [bookingCheckIn, setBookingCheckIn] = useState("");
  const [bookingCheckOut, setBookingCheckOut] = useState("");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingPhone, setBookingPhone] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const favoritesTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("datto-favorites");
        if (stored) setFavorites(JSON.parse(stored));
        const storedReviews = window.localStorage.getItem("datto-reviews");
        if (storedReviews) setUserReviews(JSON.parse(storedReviews));
        const storedCart = window.localStorage.getItem("datto-cart");
        if (storedCart) setCart(JSON.parse(storedCart));
      } catch {
        window.localStorage.removeItem("datto-favorites");
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

  const currentMonth = new Date().getMonth() + 1;

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
        meta: `${place.category} · ${place.district}`,
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
  const bookingNights = useMemo(() => {
    if (!bookingCheckIn || !bookingCheckOut) return 1;
    const milliseconds = new Date(bookingCheckOut).getTime() - new Date(bookingCheckIn).getTime();
    return Math.max(1, Math.ceil(milliseconds / 86_400_000));
  }, [bookingCheckIn, bookingCheckOut]);

  const planDistance = useMemo(
    () => plan.slice(1).reduce((total, item, index) => total + haversine(plan[index].lat, plan[index].lng, item.lat, item.lng) * 1.22, 0),
    [plan],
  );
  const transportRate = transport === "Xe máy" ? 2_500 : transport === "Taxi / xe hợp đồng" ? 12_000 : 7_000;
  const planTransportCost = Math.round((planDistance * transportRate) / 10_000) * 10_000;
  const planMealCost = days * travelers * 220_000;
  const planStayCost = Math.max(0, days - 1) * Math.ceil(travelers / 2) * (interest.includes("Nghỉ dưỡng") ? 1_100_000 : 650_000);
  const planTicketCost = plan.length * travelers * 40_000;
  const estimatedPlanCost = planTransportCost + planMealCost + planStayCost + planTicketCost;
  const availablePlanPlaces = places.filter((place) => !plan.some((item) => item.id === place.id));

  const nearItems = useMemo<NearItem[]>(() => {
    const destinationItems = places.map((place) => ({
      id: `place-${place.id}`, name: place.shortName, type: "Điểm đến", icon: "⌖", lat: place.lat, lng: place.lng,
      note: `${place.bestTime} · ${place.category}`, address: place.location, place,
    }));
    const serviceItems = services.map((item, index) => ({ ...item, id: `service-${index}` }));
    const restaurantItems = places.flatMap((place, placeIndex) => place.restaurants.slice(0, 2).map((item, itemIndex) => ({
      id: `eat-${place.id}-${itemIndex}`, name: item.name, type: "Ăn uống", icon: "♨",
      lat: place.lat + (itemIndex + 1) * 0.0015, lng: place.lng + ((placeIndex % 2 ? -1 : 1) * (itemIndex + 1) * 0.0018),
      note: `${item.note} · ${item.hours}`, address: item.address, phone: item.phone, place,
    })));
    const stayItems = places.flatMap((place, placeIndex) => place.stays.slice(0, 2).map((item, itemIndex) => ({
      id: `stay-${place.id}-${itemIndex}`, name: item.name, type: "Lưu trú", icon: "⌂",
      lat: place.lat - (itemIndex + 1) * 0.0014, lng: place.lng + ((placeIndex % 2 ? 1 : -1) * (itemIndex + 1) * 0.0016),
      note: `${item.note} · ${item.hours}`, address: item.address, phone: item.phone, place,
    })));
    return [...destinationItems, ...restaurantItems, ...stayItems, ...serviceItems];
  }, []);
  const filteredNearItems = useMemo(() => nearItems
    .filter((item) => serviceFilter === "Tất cả" || item.type === serviceFilter)
    .slice()
    .sort((a, b) => position
      ? haversine(position.lat, position.lng, a.lat, a.lng) - haversine(position.lat, position.lng, b.lat, b.lng)
      : a.name.localeCompare(b.name, "vi")), [nearItems, position, serviceFilter]);
  const selectedNearItem = filteredNearItems.find((item) => item.id === selectedNearItemId) ?? filteredNearItems[0] ?? null;

  const generatePlan = () => {
    const pool = [...places];
    const targetCategory = interest.includes("Thiên nhiên") || interest.includes("Phượt")
      ? "Núi rừng & sinh thái"
      : interest.includes("Nghỉ dưỡng")
        ? "Nghỉ dưỡng & chữa lành"
        : interest.includes("Văn hóa")
          ? "Di sản & tâm linh"
          : null;
    pool.sort((a, b) => {
      const categoryScore = (place: Place) => (targetCategory && place.category === targetCategory ? 3 : 0);
      const seasonScore = (place: Place) => (isInSeason(place, currentMonth) ? 2 : 0);
      return categoryScore(b) + seasonScore(b) - categoryScore(a) - seasonScore(a);
    });
    if (interest.includes("Ẩm thực")) {
      pool.sort((a, b) => b.restaurants.length - a.restaurants.length || Number(isInSeason(b, currentMonth)) - Number(isInSeason(a, currentMonth)));
    }
    if (interest.includes("Gia đình")) {
      const familyOrder = ["van-lang", "thanh-thuy", "dao-ngoc-xanh", "den-hung"];
      const familyScore = (place: Place) => {
        const index = familyOrder.indexOf(place.id);
        return index === -1 ? 999 : index;
      };
      pool.sort((a, b) => familyScore(a) - familyScore(b));
    }
    setPlan(pool.slice(0, Math.min(days * 2, pool.length)));
    showToast(`Đã ưu tiên điểm phù hợp tháng ${currentMonth} cho lịch trình ${days} ngày`);
  };

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

  const movePlanItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= plan.length) return;
    const next = [...plan];
    [next[index], next[target]] = [next[target], next[index]];
    setPlan(next);
  };

  const removePlanItem = (id: string) => {
    setPlan((current) => current.filter((item) => item.id !== id));
    showToast("Đã bỏ điểm khỏi lịch trình");
  };

  const addPlanItem = (place: Place) => {
    setPlan((current) => [...current, place]);
    showToast(`Đã thêm ${place.shortName} vào lịch trình`);
  };

  const savePlan = () => {
    window.localStorage.setItem("datto-itinerary", JSON.stringify(generatedItinerary));
    showToast("Đã lưu lịch trình hướng dẫn viên trên thiết bị");
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

  const toggleItineraryAudio = () => {
    if (!("speechSynthesis" in window)) {
      showToast("Thiết bị chưa hỗ trợ phát giọng đọc");
      return;
    }
    if (audioGuidePlaying) {
      window.speechSynthesis.cancel();
      setAudioGuidePlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(generatedItinerary.audioGuideScript);
    const vietnameseVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("vi"));
    utterance.voice = vietnameseVoices.find((voice) => /google|microsoft|natural/i.test(voice.name)) ?? vietnameseVoices[0] ?? null;
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setAudioGuidePlaying(true);
    utterance.onend = () => setAudioGuidePlaying(false);
    utterance.onerror = () => setAudioGuidePlaying(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateItinerary = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setAudioGuidePlaying(false);
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
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setAudioGuidePlaying(false);
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
      region: tmpl.region === "Liên thông 3 vùng" ? "Tất cả" : tmpl.region,
      durationDays: tmpl.durationDays,
      transport: tVehicle,
      budget,
      style: tmpl.theme,
      travelers,
    });
    setGeneratedItinerary(res);
    showToast(`Đã chọn: ${tmpl.title}`);
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

  const stopGuide = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speechRef.current = null;
    setAudioState("idle");
    setSpeechPlaceId(null);
  };

  const toggleGuide = (place: Place) => {
    if (!("speechSynthesis" in window)) {
      showToast("Thiết bị chưa hỗ trợ thuyết minh tự động");
      return;
    }

    if (speechPlaceId === place.id && audioState === "playing") {
      window.speechSynthesis.pause();
      setAudioState("paused");
      return;
    }

    if (speechPlaceId === place.id && audioState === "paused") {
      window.speechSynthesis.resume();
      setAudioState("playing");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(place.audioScript);
    const vietnameseVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("vi"));
    utterance.voice = vietnameseVoices.find((voice) => /google|microsoft|natural/i.test(voice.name)) ?? vietnameseVoices[0] ?? null;
    utterance.lang = "vi-VN";
    utterance.rate = 0.86;
    utterance.pitch = 0.98;
    utterance.volume = 1;
    utterance.onstart = () => {
      setSpeechPlaceId(place.id);
      setAudioState("playing");
    };
    utterance.onend = stopGuide;
    utterance.onerror = stopGuide;
    speechRef.current = utterance;
    setSpeechPlaceId(place.id);
    window.speechSynthesis.speak(utterance);
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
    showToast(`Đã thêm ${dish.name} vào giỏ`);
  };

  const changeCartQuantity = (dishId: string, sellerId: string, change: number) => {
    const next = cart
      .map((line) => line.dishId === dishId && line.sellerId === sellerId ? { ...line, quantity: line.quantity + change } : line)
      .filter((line) => line.quantity > 0);
    setCart(next);
    window.localStorage.setItem("datto-cart", JSON.stringify(next));
  };

  const submitDemoOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkoutPhone.replace(/\D/g, "").length < 9 || !cartDetails.length) {
      showToast("Hãy nhập số điện thoại hợp lệ để người bán xác nhận");
      return;
    }
    const stored = JSON.parse(window.localStorage.getItem("datto-demo-orders") ?? "[]") as unknown[];
    const order = { id: `DT-${String(stored.length + 1).padStart(6, "0")}`, phone: checkoutPhone, items: cartDetails, total: cartSubtotal, createdAt: new Date().toISOString() };
    window.localStorage.setItem("datto-demo-orders", JSON.stringify([order, ...stored]));
    setCart([]);
    window.localStorage.removeItem("datto-cart");
    setCartOpen(false);
    setCheckoutPhone("");
    showToast(`Đã lưu đơn mẫu ${order.id} trên thiết bị — chưa gửi tới người bán`);
  };

  const openBooking = (place: Place, stay: NearbyItem) => {
    setBookingOffer({ place, stay });
    setBookingCheckIn("");
    setBookingCheckOut("");
    setBookingGuests(2);
    setBookingPhone("");
  };

  const submitBookingRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    const request = { id: `DP-${String(stored.length + 1).padStart(6, "0")}`, stay: bookingOffer.stay.name, place: bookingOffer.place.shortName, checkIn: bookingCheckIn, checkOut: bookingCheckOut, guests: bookingGuests, phone: bookingPhone, total, createdAt: new Date().toISOString() };
    window.localStorage.setItem("datto-booking-requests", JSON.stringify([request, ...stored]));
    setBookingOffer(null);
    showToast(`Đã lưu yêu cầu ${request.id} — cần máy chủ để gửi tới nơi nghỉ`);
  };

  const handleReviewPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 2);
    if (!files.length) return;
    if (files.some((file) => file.size > 800_000)) {
      showToast("Mỗi ảnh demo cần nhỏ hơn 800 KB");
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
    showToast("Đã đăng đánh giá trên thiết bị này");
  };

  const distanceFromUser = (place: Place) =>
    position ? formatDistance(haversine(position.lat, position.lng, place.lat, place.lng)) : null;

  const selectedUserReviews = selected ? userReviews.filter((review) => review.placeId === selected.id) : [];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.dataset.fallback) {
      target.dataset.fallback = "true";
      target.src = "/images/places/tam-dao.jpg";
    }
  };

  const openPlace = (place: Place) => {
    stopGuide();
    setDetailMode("eat");
    setSelected(place);
  };

  const renderPlaceCard = (place: Place, compact = false) => (
    <article className={`place-card ${compact ? "place-card--compact" : ""}`} key={place.id}>
      <button className="place-card__image-button" onClick={() => openPlace(place)} aria-label={`Xem ${place.name}`}>
        <img className="place-card__image" src={place.image} alt={place.name} loading="lazy" onError={handleImageError} />
        <span className="place-card__category">{place.category}</span>
        <span className="place-card__region-badge">{place.region}</span>
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
        <span className="place-card__meta"><b>★ {place.rating}</b> ({place.reviews.toLocaleString("vi-VN")}) · {place.bestTime}</span>
        {!compact && <span className="place-card__highlight">✦ {place.highlights[0]}</span>}
        {!compact && (
          <span className="place-card__footer">
            <span>{distanceFromUser(place) ? `${distanceFromUser(place)} · ${estimateTravel(haversine(position!.lat, position!.lng, place.lat, place.lng))}` : `${place.distanceFromVietTri} km từ Việt Trì · ${place.travelFromVietTri}`}</span>
            <i>Chi tiết →</i>
          </span>
        )}
      </button>
      {!compact && <a className="place-card__quick-map" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`} aria-label={`Chỉ đường tới ${place.name}`}>⌁ Chỉ đường</a>}
    </article>
  );

  const renderFoodMarket = (dish: FoodDish, context: "search" | "region") => (
    <article className={`food-market food-market--${context}`} key={`${context}-${dish.id}`}>
      <div className="food-market__intro">
        <img src={dish.image} alt={`Ảnh minh họa ${dish.name}`} loading="lazy" onError={handleImageError} />
        <div><span>GIAN HÀNG MẪU · CẦN ĐỐI TÁC XÁC MINH</span><h3>{dish.name}</h3><p>{dish.description}</p></div>
      </div>
      <div className="seller-grid">
        {dish.sellers.map((seller) => (
          <section className="seller-card" key={seller.id}>
            <div className="seller-card__top"><span>{seller.verified ? "✓ Đã xác minh" : "○ Đang chờ xác minh"}</span><b>★ {seller.rating}{seller.reviewCount ? ` (${seller.reviewCount})` : " · mới"}</b></div>
            <h4>{seller.name}</h4>
            <p><strong>Địa chỉ:</strong> {seller.address}</p>
            <p><strong>Giờ bán:</strong> {seller.hours}</p>
            <p><strong>Điện thoại:</strong> {seller.verified ? seller.phone : "Chờ đối tác xác minh"}</p>
            <p><strong>Nhận món:</strong> {seller.pickupNote}</p>
            <div className="seller-card__buy">
              <span><b>{formatMoney(seller.price)}</b><small>/{seller.unit}</small></span>
              <button onClick={() => addToCart(dish, seller)}>＋ Thêm giỏ</button>
            </div>
            <div className="seller-card__links">{seller.verified && <a href={`tel:${seller.phone}`}>Gọi người bán</a>}<a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`}>Mở bản đồ →</a></div>
          </section>
        ))}
      </div>
      <p className="food-market__notice">Mức giá và điểm bán đang là dữ liệu minh họa. Khi đối tác xác minh, app có thể nhận khoảng 5% hoa hồng từ người bán cho mỗi đơn thành công; khách không trả thêm phí này.</p>
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
              <h1>Đi đúng mùa.<br /><em>Chạm đúng Đất Tổ.</em></h1>
              <p>Tìm đúng nơi, đúng giờ và đúng món ngon — cùng khoảng cách, thời gian di chuyển và kinh nghiệm cần biết trước khi lên đường.</p>
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
                    placeholder="Thử “săn mây”, “thịt chua”, “Hạ Hòa”…"
                    aria-label="Tìm kiếm điểm đến, món ăn hoặc chỗ nghỉ"
                    aria-controls="search-suggestions"
                  />
                  <button onClick={() => { setSearchFocused(false); locate(); }} title="Dùng vị trí hiện tại" aria-label="Dùng vị trí hiện tại">⌖</button>
                </div>
                {searchFocused && searchSuggestions.length > 0 && (
                  <div className="search-suggestions" id="search-suggestions" role="listbox">
                    <span className="search-suggestions__label">{query ? "Gợi ý phù hợp" : "Được tìm nhiều"}</span>
                    {searchSuggestions.map((item) => (
                      <button key={item.id} role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => item.kind === "place" ? selectSearchSuggestion(item.place, item.label) : selectFoodSuggestion(item.dish)}>
                        <span>{item.icon}</span><p><b>{item.label}</b><small>{item.meta}</small></p><i>↗</i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="hero__trust">
                <span><b>{places.length}</b> điểm đã biên tập</span>
                <span><b>5</b> vùng ẩm thực</span>
                <span><b>Mùa</b> gợi ý theo thời điểm</span>
              </div>
            </div>
            <div className="hero__visual">
              <img src={places[0].image} alt="Cổng Khu di tích lịch sử Đền Hùng" loading="lazy" onError={handleImageError} />
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
              <div><span className="section-number">01</span><h2>Khám phá theo cách của&nbsp;bạn</h2></div>
              <button className="text-link" onClick={() => { setCategory("Tất cả"); setSelectedRegion("Tất cả"); setSeasonFilter("Tất cả"); setQuery(""); }}>Xem tất cả →</button>
            </div>
            <div className="region-filter-bar" role="group" aria-label="Lọc theo vùng sáp nhập">
              <span className="region-filter-label">3 VÙNG SÁP NHẬP:</span>
              {regionLabels.map((reg) => (
                <button
                  key={reg}
                  className={`region-pill ${selectedRegion === reg ? "is-active" : ""}`}
                  onClick={() => { setSelectedRegion(reg); setVisibleCount(8); }}
                >
                  {reg === "Tất cả" ? "🌐 Toàn tỉnh (3 vùng)" : reg === "Phú Thọ lõi" ? "🏛️ Phú Thọ lõi" : reg === "Vùng Vĩnh Phúc" ? "☁️ Vùng Vĩnh Phúc" : "🌲 Vùng Hòa Bình"}
                </button>
              ))}
            </div>
            <div className="category-row" role="group" aria-label="Lọc theo danh mục">
              {categories.map((item) => (
                <button key={item.label} onClick={() => { setCategory(item.label); setSearchFocused(false); setVisibleCount(8); }} className={category === item.label ? "is-active" : ""}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
            <div className="season-filter" role="group" aria-label="Lọc địa điểm theo mùa">
              <span>ĐI THEO MÙA</span>
              {seasonFilters.map((item) => <button key={item} className={seasonFilter === item ? "is-active" : ""} onClick={() => { setSeasonFilter(item); setVisibleCount(8); }}>{item === "Đang hợp mùa" ? `Hợp tháng ${currentMonth}` : item}</button>)}
            </div>
          </section>

          <section className="content-section places-section">
            <div className="section-heading section-heading--inline">
              <div>
                <span className="section-number">02</span>
                <h2>{query && matchingFoodDishes.length ? `Điểm bán cho “${query}”` : query ? `Kết quả cho “${query}”` : position ? "Gần vị trí của\u00a0bạn" : "Không thể bỏ\u00a0lỡ"}</h2>
                <p>{isServerSearching ? "Đang tìm trên máy chủ…" : matchingFoodDishes.length ? `${matchingFoodDishes.length} món · ${matchingFoodDishes.reduce((total, dish) => total + dish.sellers.length, 0)} điểm bán mẫu` : `${locationMessage} · ${filteredPlaces.length} gợi ý phù hợp`}</p>
              </div>
              {!position && <button className="location-link" onClick={locate}>⌖ Bật định vị</button>}
            </div>
            {matchingFoodDishes.length > 0 && <div className="commerce-search-results">{matchingFoodDishes.map((dish) => renderFoodMarket(dish, "search"))}</div>}
            {filteredPlaces.length ? (
              <>
                {matchingFoodDishes.length > 0 && <div className="related-places-heading"><span>ĐỊA ĐIỂM DU LỊCH LIÊN QUAN TRỰC TIẾP</span><p>Chỉ hiện khi tên món cũng khớp thật sự với thông tin của địa điểm; món ăn không còn bị gắn nhầm vào công viên.</p></div>}
                <div className="place-grid">{filteredPlaces.slice(0, visibleCount).map((place) => renderPlaceCard(place))}</div>
                {filteredPlaces.length > visibleCount && (
                  <button className="load-more" onClick={() => setVisibleCount((count) => count + 4)}>Xem thêm {Math.min(4, filteredPlaces.length - visibleCount)} địa điểm →</button>
                )}
              </>
            ) : matchingFoodDishes.length === 0 ? (
              <div className="empty-state"><b>Chưa tìm thấy kết quả</b><span>Thử “săn mây”, “thịt chua”, “Hạ Hòa” hoặc chọn một gợi ý trong ô tìm kiếm.</span></div>
            ) : null}
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
                  <span className="mini-stop__time">{place.bestStart}</span>
                  <span className="mini-stop__dot" />
                  <img src={place.image} alt="" loading="lazy" onError={handleImageError} />
                  <span><b>{place.shortName}</b><small>{index === 1 ? "Hát Xoan · cần đặt lịch" : place.bestTime}</small></span>
                </div>
              ))}
              <div className="route-summary"><span>⌁ Gom theo cụm Việt Trì – Tân Sơn – Thanh Thủy</span><span>Giờ đến được điều chỉnh theo từng điểm</span></div>
            </div>
          </section>

          <section className="content-section local-guide">
            <div className="local-guide__intro">
              <span className="kicker">BẢN ĐỒ VỊ GIÁC</span>
              <h2>Mỗi vùng đất,<br />một vị riêng.</h2>
              <p>Ẩm thực được chia theo địa phương để bạn ghép món ăn vào đúng cung đường.</p>
            </div>
            <div className="food-browser">
              <div className="food-region-tabs" role="tablist" aria-label="Chọn vùng ẩm thực">
                {foodRegions.map((region) => (
                  <button key={region.id} role="tab" aria-selected={foodRegionId === region.id} className={foodRegionId === region.id ? "is-active" : ""} onClick={() => setFoodRegionId(region.id)}>{region.label}</button>
                ))}
              </div>
              {foodRegions.filter((region) => region.id === foodRegionId).map((region) => (
                <div key={region.id} className="food-list">
                  <p className="food-region-note">{region.subtitle}</p>
                  {region.dishes.map((food, index) => (
                    <div className="food-entry" key={food.id}>
                      <button className="food-row" aria-expanded={activeFoodId === food.id} onClick={() => setActiveFoodId((current) => current === food.id ? null : food.id)}>
                        <span>{String(index + 1).padStart(2, "0")}</span><img src={food.image} alt={food.name} loading="lazy" onError={handleImageError} /><b>{food.name}</b><small>{food.description}</small><i>{food.price}<em>{food.season}</em></i><strong>{activeFoodId === food.id ? "Thu gọn −" : "Xem điểm bán +"}</strong>
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

      {activeTab === "trip" && (
        <section className="inner-page trip-page">
          <div className="inner-page__intro">
            <span className="kicker">AI TOUR GUIDE · PHÚ THỌ MỚI</span>
            <h1>Lập lịch trình thông minh<br /><em>cùng hướng dẫn viên bản địa.</em></h1>
            <p>Hệ thống tự động lập lịch trình đầy đủ 4 yếu tố: <b>Đi tham quan ở đâu · Ăn món gì · Ngủ ở đâu · Đi bằng phương tiện nào & thời gian ra sao</b> trên toàn địa bàn 3 vùng (Phú Thọ lõi, Vĩnh Phúc, Hòa Bình).</p>
          </div>

          <div className="builder-layout">
            <aside className="builder-card">
              <span className="builder-card__step">BỘ ĐIỀU KHIỂN LỊCH TRÌNH</span>
              <h2>Bạn muốn đi đâu & như thế nào?</h2>

              {/* 1. CHỌN VÙNG / TỈNH */}
              <div className="builder-group">
                <label>1. Chọn Tỉnh / Vùng du lịch</label>
                <div className="region-pill-group">
                  {[
                    { id: "Tất cả", label: "✨ Ghép 3 Tỉnh" },
                    { id: "Phú Thọ lõi", label: "🏛️ Phú Thọ" },
                    { id: "Vùng Vĩnh Phúc", label: "☁️ Vĩnh Phúc" },
                    { id: "Vùng Hòa Bình", label: "🌲 Hòa Bình" },
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

              {/* 2. CHỌN HUYỆN / THỊ XÃ & HƯỚNG DẪN ĐƯỜNG ĐI */}
              <div className="builder-group">
                <label>2. Chọn Huyện / Thị xã muốn tới</label>
                <select
                  value={tripDistrict}
                  onChange={(event) => setTripDistrict(event.target.value)}
                  className="district-select"
                >
                  <option value="Tất cả">Toàn bộ các huyện (Lập tuyến tự do)</option>
                  {availableDistricts.filter((d) => d !== "Tất cả").map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* HỘP HƯỚNG DẪN ĐƯỜNG ĐI TỚI HUYỆN */}
                {activeDistrictGuide && (
                  <div className="district-travel-tip">
                    <div className="district-travel-tip__head">
                      <span>🧭 HƯỚNG DẪN ĐƯỜNG ĐI: <b>{activeDistrictGuide.district}</b></span>
                      <small>{activeDistrictGuide.region}</small>
                    </div>
                    <div className="district-travel-tip__metrics">
                      <span>📏 <b>{activeDistrictGuide.distanceFromHanoi}</b></span>
                      <span>⏱ <b>{activeDistrictGuide.travelTime}</b></span>
                      <span>🚗 <b>{activeDistrictGuide.recommendedTransport}</b></span>
                    </div>
                    <p className="district-travel-tip__route">
                      <strong>Tuyến đường:</strong> {activeDistrictGuide.bestRoutes}
                    </p>
                    <p className="district-travel-tip__foods">
                      <strong>Món ngon đặc sản:</strong> {activeDistrictGuide.signatureFoods.join(" · ")}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. GHÉP CÁC ĐỊA ĐIỂM VÀO LỊCH TRÌNH */}
              <div className="builder-group">
                <div className="group-header">
                  <label>3. Ghép các điểm đến vào tour</label>
                  <span className="count-tag">Đã chọn <b>{selectedPlaceIds.length}</b> điểm</span>
                </div>

                {/* GỢI Ý GHÉP NHANH CÁC TUYẾN PHỔ BIẾN */}
                <div className="quick-combo-bar">
                  <small>Gợi ý tuyến ghép nhanh:</small>
                  <div className="quick-combo-chips">
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Cội Nguồn & Khoáng Nóng", ["den-hung", "hung-lo", "thanh-thuy"], 2)}
                    >
                      <span>🏛️ Đền Hùng + Khoáng nóng Thanh Thủy</span>
                      <b>2N1Đ →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Mây Núi 2 Tỉnh", ["tam-dao", "tay-thien", "ban-lac-mai-chau"], 2)}
                    >
                      <span>☁️ Tam Đảo + Thung lũng Mai Châu</span>
                      <b>2N1Đ →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Tour Suối Khoáng 2 Vùng", ["thanh-thuy", "khoang-nong-kim-boi"], 2)}
                    >
                      <span>♨️ Khoáng nóng Thanh Thủy + Kim Bôi</span>
                      <b>2N1Đ →</b>
                    </button>
                    <button
                      type="button"
                      className="quick-chip"
                      onClick={() => applyQuickCombination("Đại Hành Trình 3 Tỉnh", ["den-hung", "tam-dao", "ban-lac-mai-chau", "khoang-nong-kim-boi"], 3)}
                    >
                      <span>✨ Trọn Vẹn 3 Tỉnh (Phú Thọ – Vĩnh Phúc – Hòa Bình)</span>
                      <b>3N2Đ →</b>
                    </button>
                  </div>
                </div>

                {/* LƯỚI CHỌN TỪNG ĐIỂM THAM QUAN */}
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
                          <small>{p.district} · {p.category}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {availablePlacesForSelection.length > 0 && (
                  <div className="place-check-actions">
                    <button type="button" onClick={selectAllFilteredPlaces} className="link-btn">
                      + Thêm tất cả ({availablePlacesForSelection.length} điểm)
                    </button>
                    {selectedPlaceIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlaceIds([availablePlacesForSelection[0]?.id || "den-hung"])}
                        className="link-btn link-btn--danger"
                      >
                        ↺ Đặt lại (chỉ giữ 1 điểm)
                      </button>
                    )}
                  </div>
                )}
              </div>

              <label>
                Số ngày đi
                <div className="day-picker">
                  {[1, 2, 3, 4].map((item) => (
                    <button key={item} className={days === item ? "is-active" : ""} onClick={() => setDays(item)}>
                      {item}<small>ngày</small>
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Phương tiện di chuyển
                <select value={transport} onChange={(event) => setTransport(event.target.value)}>
                  <option>Ô tô riêng</option>
                  <option>Xe máy</option>
                  <option>Limousine / Xe khách</option>
                  <option>Taxi / xe hợp đồng</option>
                </select>
              </label>

              <label>
                Phong cách chuyến đi
                <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                  <option>Văn hóa & cội nguồn</option>
                  <option>Nghỉ dưỡng khoáng nóng & Onsen</option>
                  <option>Phượt & săn mây sinh thái</option>
                  <option>Gia đình có trẻ nhỏ/người cao tuổi</option>
                  <option>Ẩm thực bản địa</option>
                </select>
              </label>

              <label>
                Tiêu chuẩn ngân sách
                <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                  <option>Tiết kiệm</option>
                  <option>Tiêu chuẩn</option>
                  <option>Cao cấp / Nghỉ dưỡng</option>
                </select>
              </label>

              <label>
                Số lượng khách
                <select value={travelers} onChange={(event) => setTravelers(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                    <option key={count} value={count}>{count} người</option>
                  ))}
                </select>
              </label>

              <button className="button button--dark button--full" onClick={handleGenerateItinerary}>
                ✦ Lập Lịch Trình Tuyến Đã Ghép ({selectedPlaceIds.length} Điểm)
              </button>
              <small className="builder-note">Tự động tính quãng đường, chi phí, thực đơn và lời thuyết minh</small>
            </aside>

            <div className="plan-panel">
              {/* GUIDE HEADER CARD */}
              <div className="guide-header-card">
                <div className="guide-header-card__top">
                  <div>
                    <div className="guide-header-card__meta">
                      <span>{generatedItinerary.region}</span>
                      <span>{generatedItinerary.durationDays} NGÀY</span>
                      <span>{generatedItinerary.style}</span>
                    </div>
                    <h2>{generatedItinerary.title}</h2>
                    <p>{generatedItinerary.subtitle}</p>
                  </div>
                </div>

                <div className="guide-stat-grid">
                  <div className="guide-stat-item">
                    <small>CỰ LY LỘ TRÌNH</small>
                    <b>~{generatedItinerary.totalDistanceKm} km</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>THỜI GIAN LÁI XE</small>
                    <b>{generatedItinerary.totalDriveTime}</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>PHƯƠNG TIỆN</small>
                    <b>{generatedItinerary.transport}</b>
                  </div>
                  <div className="guide-stat-item">
                    <small>DỰ TOÁN / KHÁCH</small>
                    <b>{formatMoney(generatedItinerary.estimatedCostPerPerson)}</b>
                  </div>
                </div>

                {/* ACTION BAR */}
                <div className="guide-action-bar">
                  <a className="guide-action-btn" href={generatedItinerary.googleMapsUrl} target="_blank" rel="noreferrer">
                    🗺️ Tuyến Google Maps
                  </a>
                  <button className="guide-action-btn" onClick={() => window.print()}>
                    ▤ In / Xuất PDF
                  </button>
                  <button className="guide-action-btn" onClick={sharePlan}>
                    ↗ Chia sẻ lộ trình
                  </button>
                  <button className="guide-action-btn" onClick={savePlan}>
                    ♡ Lưu lịch trình
                  </button>
                </div>

                <div className="guide-tips-box">
                  <b>💡 Lời khuyên Hướng dẫn viên:</b> {generatedItinerary.routeAdvice}
                  <br />
                  <b>🛡️ Lưu ý an toàn & di chuyển:</b> {generatedItinerary.cautionAdvice}
                </div>
              </div>

              {/* TIMELINE DAYS */}
              {generatedItinerary.days.map((dayPlan) => (
                <div className="timeline-day" key={dayPlan.dayNumber}>
                  <div className="timeline-day__header">
                    <div className="timeline-day__header-title">
                      <span className="timeline-day-pill">NGÀY {dayPlan.dayNumber}</span>
                      <h3>{dayPlan.dayTitle}</h3>
                    </div>
                    <span className="timeline-day__distance">Lộ trình ngày: ~{dayPlan.dayDistanceKm} km ({dayPlan.dateLabel})</span>
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
                            <span className={`slot-period-tag slot-period-tag--${tagModifier}`}>{slot.period}</span>
                            <span className="slot-time">{slot.timeSlot}</span>
                          </div>

                          <div className="slot-main">
                            <div className="slot-main__title">
                              <h4>{slot.title}</h4>
                              <span className="slot-cost">{formatMoney(slot.estimatedCostPerPerson)}/người</span>
                            </div>

                            {/* TRANSPORT TIP */}
                            <div className="slot-transport-strip">
                              <span>🚗</span>
                              <div>
                                <b>Di chuyển & Lộ trình:</b> {slot.transportAdvice}
                              </div>
                            </div>

                            {/* DETAIL BLOCKS */}
                            <div className="slot-detail-grid">
                              <div className="slot-detail-box">
                                <small>🏛️ ĐI THAM QUAN Ở ĐÂU</small>
                                <p>
                                  <b>{slot.activity}</b>
                                  {slot.place && (
                                    <>
                                      <br />
                                      <span>Điểm đến: <b>{slot.place.name}</b> ({slot.place.location})</span>
                                      <br />
                                      <span>Điểm nhấn: {slot.place.highlights.slice(0, 3).join(" · ")}</span>
                                    </>
                                  )}
                                </p>
                              </div>

                              <div className="slot-detail-box">
                                <small>🍲 ĂN Ở ĐÂU & MÓN GÌ</small>
                                <p>
                                  {slot.restaurant ? (
                                    <>
                                      <b>{slot.restaurant.name}</b> ({slot.restaurant.type})
                                      <br />
                                      <span>Ghi chú: {slot.restaurant.note}</span>
                                      <br />
                                      <small style={{ color: "#777" }}>{slot.restaurant.address} · {slot.restaurant.hours}</small>
                                    </>
                                  ) : (
                                    <span>Tự do thưởng thức ẩm thực đặc sản địa phương trên cung đường.</span>
                                  )}
                                </p>
                              </div>

                              {slot.stay && (
                                <div className="slot-detail-box">
                                  <small>🛏️ NGỦ NGHỈ Ở ĐÂU</small>
                                  <p>
                                    <b>{slot.stay.name}</b> ({slot.stay.type})
                                    <br />
                                    <span>Đặc điểm: {slot.stay.note}</span>
                                    <br />
                                    <small style={{ color: "#777" }}>Địa chỉ: {slot.stay.address}</small>
                                  </p>
                                </div>
                              )}
                            </div>

                            {slot.highlightNote && (
                              <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                                💬 Lời dặn: {slot.highlightNote}
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
                    <span className="kicker">TOUR MẪU THIẾT KẾ SẴN</span>
                    <h2 style={{ fontSize: "20px", margin: "4px 0" }}>Chọn nhanh hành trình tiêu biểu 3 vùng</h2>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Bấm vào tour để xem chi tiết ngay</span>
                </div>

                <div className="tour-template-grid">
                  {tourTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      className="tour-template-card"
                      onClick={() => handleApplyTourTemplate(tmpl)}
                    >
                      <div className="tour-template-card__header">
                        <span className="tour-template-badge">{tmpl.region}</span>
                        <span className="tour-template-duration">⏱ {tmpl.durationLabel}</span>
                      </div>
                      <h3>{tmpl.title}</h3>
                      <p>{tmpl.summary}</p>
                      <div className="tour-template-card__footer">
                        <span>Phương tiện: {tmpl.recommendedTransport}</span>
                        <b>{tmpl.estimatedBudgetPerPerson}</b>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 100 DIRECTORY SECTION FROM TÀI LIỆU 3 */}
              <div className="directory-section">
                <div className="directory-header">
                  <div>
                    <span className="kicker">DỮ LIỆU TỔNG HỢP TỪ TÀI LIỆU 3</span>
                    <h3>Danh bạ 100 Điểm Du lịch – Ăn uống – Lưu trú Phú Thọ</h3>
                    <p>Tra cứu thông tin điểm tham quan, ẩm thực gần điểm và địa chỉ lưu trú theo từng huyện/thị thành.</p>
                  </div>
                  <button
                    className="button button--ghost"
                    onClick={() => setShow100Directory((prev) => !prev)}
                  >
                    {show100Directory ? "Thu gọn bảng danh bạ ▲" : `Mở toàn bộ 100 điểm (${phuTho100Directory.length}) ▼`}
                  </button>
                </div>

                {show100Directory && (
                  <>
                    <div className="directory-controls">
                      <input
                        type="text"
                        className="directory-search-input"
                        placeholder="Tìm theo tên điểm, món ăn, khách sạn..."
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                      />
                      <select
                        className="directory-select"
                        value={directoryDistrict}
                        onChange={(e) => setDirectoryDistrict(e.target.value)}
                      >
                        {directoryDistricts.map((d) => (
                          <option key={d} value={d}>{d === "Tất cả" ? "Tất cả huyện/thị" : `Huyện/Thị: ${d}`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="directory-table-container">
                      <table className="directory-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên điểm đến</th>
                            <th>Loại hình</th>
                            <th>Địa bàn</th>
                            <th>Ẩm thực & Quán ăn gần điểm</th>
                            <th>Lưu trú / Khách sạn gần điểm</th>
                            <th>Cự ly</th>
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
            {["Tất cả", "Điểm đến", "Ăn uống", "Lưu trú", "Y tế", "Trạm xăng", "Bãi đỗ xe", "ATM", "Tiện ích"].map((item) => (
              <button key={item} className={serviceFilter === item ? "is-active" : ""} onClick={() => setServiceFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="near-layout">
            <div className="map-panel">
              <iframe
                title="Bản đồ tiện ích du lịch Phú Thọ"
                src="https://www.openstreetmap.org/export/embed.html?bbox=104.88%2C21.08%2C105.48%2C21.58&layer=mapnik"
                loading="lazy"
              />
              <div className="map-pins" aria-label="Các ghim trên bản đồ">
                {filteredNearItems.slice(0, 24).map((item) => <button key={item.id} style={mapPosition(item.lat, item.lng, item.id)} className={`${selectedNearItem?.id === item.id ? "is-active" : ""} map-pin--${normalizeSearch(item.type).replace(/\s+/g, "-")}`} onClick={() => setSelectedNearItemId(item.id)} title={item.name} aria-label={`${item.type}: ${item.name}`}><span>{item.icon}</span></button>)}
                {position && <span className="user-map-pin" style={mapPosition(position.lat, position.lng)} title="Vị trí của bạn">Bạn</span>}
              </div>
              {selectedNearItem && <div className="map-selection"><span>{selectedNearItem.icon}</span><p><small>{selectedNearItem.type}</small><b>{selectedNearItem.name}</b><em>{position ? `${formatDistance(haversine(position.lat, position.lng, selectedNearItem.lat, selectedNearItem.lng))} từ bạn` : selectedNearItem.address ?? selectedNearItem.note}</em></p><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selectedNearItem.lat},${selectedNearItem.lng}`}>Chỉ đường →</a></div>}
              <span className="map-credit">Bản đồ © OpenStreetMap</span>
            </div>
            <div className="service-list">
              {filteredNearItems.slice(0, 10).map((item) => {
                const distance = position ? formatDistance(haversine(position.lat, position.lng, item.lat, item.lng)) : "—";
                return (
                  <article key={item.id} className={selectedNearItem?.id === item.id ? "is-active" : ""}>
                    <span className="service-icon">{item.icon}</span>
                    <button className="service-main" onClick={() => setSelectedNearItemId(item.id)}><span>{item.type}</span><b>{item.name}</b><small>{item.note}</small></button>
                    <p><b>{distance}</b>{item.phone && <a href={`tel:${item.phone}`}>Gọi ngay</a>}<a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}>Chỉ đường →</a></p>
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
          <section className="event-calendar">
            <div className="event-calendar__intro"><span className="kicker">LỊCH VĂN HÓA</span><h2>Đi đúng ngày,<br /><em>chạm đúng lễ hội.</em></h2><p>Ngày âm lịch được giữ nguyên để tránh nhầm giữa các năm. Hãy xác nhận lại với điểm đến trước khi khởi hành.</p></div>
            <div className="event-list">
              {culturalEvents.map((event) => {
                const eventPlace = event.placeId ? places.find((place) => place.id === event.placeId) : null;
                return <article key={event.id}><span>{event.season}</span><div><h3>{event.name}</h3><p>{event.description}</p><small>⌖ {event.location}</small></div><aside><b>{event.schedule}</b>{event.bookingRequired && <em>CẦN ĐẶT TRƯỚC</em>}{eventPlace && <button onClick={() => openPlace(eventPlace)}>Mở điểm đến →</button>}</aside></article>;
              })}
            </div>
          </section>
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
              <button onClick={() => { setCategory("Nghỉ dưỡng & chữa lành"); setQuery(""); setActiveTab("explore"); showToast("Chọn một điểm nghỉ dưỡng rồi mở mục Chỗ nghỉ gần đây để đặt phòng"); }}><i>⌂</i><b>Khách sạn & homestay</b><small>Đặt qua app · đối tác trả hoa hồng</small><em>→</em></button>
              <button onClick={() => { setCategory("Tất cả"); setSeasonFilter("Tất cả"); setQuery("Thịt chua Thanh Sơn"); setActiveFoodId("thit-chua-thanh-son"); setActiveTab("explore"); showToast("Đã mở khu đặc sản; gian hàng thật sẽ cần đối tác xác minh"); }}><i>◇</i><b>Quà OCOP & đặc sản</b><small>Thịt chua, bưởi, chè… có giỏ hàng</small><em>→</em></button>
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
              <img src={selected.image} alt={selected.name} onError={handleImageError} />
              <span className="modal-hero__shade" />
              <div><span>{selected.category} · {selected.location}</span><h2 id="place-modal-title">{selected.name}</h2><p><b>★ {selected.rating}</b> ({selected.reviews.toLocaleString("vi-VN")} đánh giá tham khảo) · Ảnh: {selected.imageCredit}</p></div>
              <button className={`heart-button modal-heart ${favorites.includes(selected.id) ? "is-saved" : ""}`} onClick={() => toggleFavorite(selected.id)}>{favorites.includes(selected.id) ? "♥" : "♡"}</button>
            </div>
            <div className="modal-body">
              <div className="modal-main">
                <div className={`season-callout ${isInSeason(selected, currentMonth) ? "is-good" : "is-caution"}`}>
                  <span>{isInSeason(selected, currentMonth) ? "✓" : "!"}</span>
                  <p><b>{isInSeason(selected, currentMonth) ? `Phù hợp để đi trong tháng ${currentMonth}` : `Tháng ${currentMonth} cần cân nhắc thời tiết`}</b><small>{selected.season}</small></p>
                </div>
                <div className="fact-row fact-row--rich">
                  <span><small>KHUNG GIỜ ĐẸP</small><b>{selected.bestTime}</b></span>
                  <span><small>THỜI LƯỢNG</small><b>{selected.duration}</b></span>
                  <span><small>TỪ VIỆT TRÌ</small><b>{selected.distanceFromVietTri} km · {selected.travelFromVietTri}</b></span>
                  <span><small>CHI PHÍ THAM KHẢO</small><b>{selected.price}</b></span>
                </div>
                <p className="modal-description">{selected.description}</p>
                <div className="highlight-section"><span>ĐIỂM NỔI BẬT</span><div>{selected.highlights.map((highlight) => <p key={highlight}><i>✦</i>{highlight}</p>)}</div></div>
                {selected.warning && <div className="travel-warning"><b>Lưu ý trước khi đi</b><p>{selected.warning}</p></div>}
                {selected.transportTips && (
                  <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "14px 18px", margin: "16px 0" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>GỢI Ý PHƯƠNG TIỆN & CUNG ĐƯỜNG</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginTop: "8px" }}>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>🚗 Phương tiện gợi ý:</b> {selected.transportTips.recommendedVehicle}</div>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>🛣️ Cung đường:</b> {selected.transportTips.routeAdvice}</div>
                      <div style={{ fontSize: "12px", lineHeight: "1.4" }}><b>⚠️ Lưu ý:</b> {selected.transportTips.caution}</div>
                    </div>
                  </div>
                )}
                <div className="modal-actions">
                  <a className="button button--dark" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}>⌁ Chỉ đường</a>
                  <button className="button button--outline" onClick={() => toggleGuide(selected)}>
                    {speechPlaceId === selected.id && audioState === "playing" ? "Ⅱ Tạm dừng" : speechPlaceId === selected.id && audioState === "paused" ? "▶ Nghe tiếp" : "▶ Nghe thuyết minh"}
                  </button>
                  {speechPlaceId === selected.id && audioState !== "idle" && <button className="audio-stop" onClick={stopGuide}>■ Dừng hẳn</button>}
                </div>
                <div className="nearby-section">
                  <div className="nearby-tabs"><button className={detailMode === "eat" ? "is-active" : ""} onClick={() => setDetailMode("eat")}>Ăn ngon gần đây</button><button className={detailMode === "stay" ? "is-active" : ""} onClick={() => setDetailMode("stay")}>Chỗ nghỉ gần đây</button></div>
                  {(detailMode === "eat" ? selected.restaurants : selected.stays).map((item) => (
                    <article className="nearby-card" key={item.name}>
                      <img src={item.image} alt={`Ảnh minh họa ${item.name}`} />
                      <div className="nearby-card__content">
                        <span>{item.type}{item.rating ? ` · ★ ${item.rating} (${item.reviewCount ?? 0})` : ""}</span>
                        <b>{item.name}</b>
                        <small>{item.note}</small>
                        {item.taste && <p><strong>Hương vị:</strong> {item.taste}</p>}
                        <p><strong>Địa chỉ:</strong> {item.address}</p>
                        <p><strong>Giờ bán:</strong> {item.hours}</p>
                        <div className="nearby-card__links">
                          {item.phone && <a href={`tel:${item.phone}`}>☎ {item.phone.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3")}</a>}
                          <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address}`)}`}>Xem bản đồ →</a>
                        </div>
                        {detailMode === "eat" && item.phone && <a className="nearby-reserve-link" href={`tel:${item.phone}`}>Gọi đặt bàn / đặt món trước →</a>}
                        {detailMode === "stay" && <button className="stay-book-button" onClick={() => openBooking(selected, item)}>Đặt phòng qua app · từ {formatMoney(estimatedStayPrice(item))}/đêm →</button>}
                      </div>
                      <p className="nearby-card__distance"><b>{item.distance}</b><small>{item.travelTime}</small></p>
                    </article>
                  ))}
                </div>

                <section className="community-reviews">
                  <div className="community-reviews__heading"><span>GÓC NHÌN DU KHÁCH</span><h3>Ảnh thật, nhận xét thật trên thiết bị của bạn.</h3><p>Bản demo lưu nội dung trong trình duyệt; khi có máy chủ, đánh giá sẽ được kiểm duyệt và chia sẻ công khai.</p></div>
                  <form className="review-form" onSubmit={submitReview}>
                    <div className="review-form__row">
                      <label>Tên hiển thị<input value={reviewName} maxLength={30} onChange={(event) => setReviewName(event.target.value)} /></label>
                      <label>Chấm điểm<span className="rating-picker">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} className={rating <= reviewRating ? "is-active" : ""} onClick={() => setReviewRating(rating)}>★</button>)}</span></label>
                    </div>
                    <label>Chia sẻ trải nghiệm<textarea value={reviewComment} maxLength={500} onChange={(event) => setReviewComment(event.target.value)} placeholder="Bạn thích điều gì? Thời điểm nào đẹp? Có lưu ý gì cho người đi sau?" /></label>
                    <div className="review-upload">
                      <label>＋ Thêm tối đa 2 ảnh<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleReviewPhotos} /></label>
                      <span>Mỗi ảnh dưới 800 KB</span>
                    </div>
                    {reviewPhotos.length > 0 && <div className="review-photo-preview">{reviewPhotos.map((photo, index) => <button type="button" key={`${photo.slice(0, 32)}-${index}`} onClick={() => setReviewPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}><img src={photo} alt={`Ảnh đánh giá ${index + 1}`} /><span>×</span></button>)}</div>}
                    <button className="button button--dark" type="submit">Đăng đánh giá</button>
                  </form>
                  <div className="review-list">
                    {selectedUserReviews.length ? selectedUserReviews.map((review) => (
                      <article key={review.id}>
                        <div><span className="review-avatar">{review.name.slice(0, 1).toLocaleUpperCase("vi")}</span><p><b>{review.name}</b><small>{new Date(review.createdAt).toLocaleDateString("vi-VN")} · {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</small></p></div>
                        <p>{review.comment}</p>
                        {review.photos.length > 0 && <div className="review-photos">{review.photos.map((photo, index) => <img key={`${review.id}-${index}`} src={photo} alt={`Ảnh của ${review.name}`} />)}</div>}
                      </article>
                    )) : <div className="review-empty">Chưa có đánh giá từ người dùng demo. Hãy là người đầu tiên chia sẻ trải nghiệm.</div>}
                  </div>
                </section>
              </div>
              <aside className="modal-map">
                <iframe title={`Bản đồ ${selected.name}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.035}%2C${selected.lat - 0.025}%2C${selected.lng + 0.035}%2C${selected.lat + 0.025}&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`} loading="lazy" />
                <div><span>⌖</span><p><b>{selected.location}</b><small>{position ? `${formatDistance(haversine(position.lat, position.lng, selected.lat, selected.lng))} · ${estimateTravel(haversine(position.lat, position.lng, selected.lat, selected.lng))} từ bạn` : `${selected.distanceFromVietTri} km · ${selected.travelFromVietTri} từ Việt Trì`}</small></p></div>
              </aside>
            </div>
          </section>
        </div>
      )}

      {cartQuantity > 0 && !cartOpen && (
        <button className="cart-dock" onClick={() => setCartOpen(true)}><span>Giỏ đặc sản <b>{cartQuantity}</b></span><strong>{formatMoney(cartSubtotal)} →</strong></button>
      )}

      {cartOpen && (
        <div className="commerce-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <form className="commerce-drawer" onSubmit={submitDemoOrder}>
            <div className="commerce-drawer__heading"><div><span>GIỎ ĐẶC SẢN</span><h2>Gửi đơn tới người bán</h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">×</button></div>
            <p className="demo-commerce-note">Bản GitHub Pages hiện chỉ lưu đơn mẫu trên thiết bị. Khi có máy chủ, đơn mới được chuyển trực tiếp tới đối tác để xác nhận.</p>
            <div className="cart-lines">
              {cartDetails.map((line) => (
                <article key={`${line.dishId}-${line.sellerId}`}>
                  <img src={line.dish.image} alt="" />
                  <div><b>{line.dish.name}</b><small>{line.seller.name}</small><span>{formatMoney(line.seller.price)}/{line.seller.unit}</span></div>
                  <div className="quantity-picker"><button type="button" onClick={() => changeCartQuantity(line.dishId, line.sellerId, -1)}>−</button><b>{line.quantity}</b><button type="button" onClick={() => changeCartQuantity(line.dishId, line.sellerId, 1)}>＋</button></div>
                </article>
              ))}
            </div>
            <div className="commerce-total"><span>Tạm tính</span><b>{formatMoney(cartSubtotal)}</b><small>Hoa hồng dự kiến cho app: {formatMoney(Math.round(cartSubtotal * 0.05))} do người bán chi trả.</small></div>
            <label className="commerce-field">Số điện thoại nhận xác nhận<input inputMode="tel" value={checkoutPhone} onChange={(event) => setCheckoutPhone(event.target.value)} placeholder="Ví dụ: 0912 345 678" /></label>
            <button className="button button--dark button--full" type="submit">Lưu đơn đặt món mẫu →</button>
          </form>
        </div>
      )}

      {bookingOffer && (
        <div className="commerce-overlay booking-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOffer(null); }}>
          <form className="booking-dialog" onSubmit={submitBookingRequest}>
            <button className="booking-dialog__close" type="button" onClick={() => setBookingOffer(null)} aria-label="Đóng form đặt phòng">×</button>
            <span>ĐẶT PHÒNG QUA ĐẤT TỔ</span><h2>{bookingOffer.stay.name}</h2><p>{bookingOffer.stay.address}</p>
            <div className="booking-price"><span>Giá đối tác minh họa từ</span><b>{formatMoney(estimatedStayPrice(bookingOffer.stay))}<small>/đêm</small></b></div>
            <div className="booking-fields">
              <label>Ngày nhận phòng<input type="date" value={bookingCheckIn} onChange={(event) => setBookingCheckIn(event.target.value)} /></label>
              <label>Ngày trả phòng<input type="date" min={bookingCheckIn} value={bookingCheckOut} onChange={(event) => setBookingCheckOut(event.target.value)} /></label>
              <label>Số khách<select value={bookingGuests} onChange={(event) => setBookingGuests(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} khách</option>)}</select></label>
              <label>Điện thoại<input inputMode="tel" value={bookingPhone} onChange={(event) => setBookingPhone(event.target.value)} placeholder="Số để nơi nghỉ xác nhận" /></label>
            </div>
            <div className="booking-summary"><span>{bookingNights} đêm · {bookingGuests} khách</span><b>Dự kiến {formatMoney(estimatedStayPrice(bookingOffer.stay) * bookingNights)}</b><small>App dự kiến nhận 8% hoa hồng từ nơi nghỉ, không cộng thêm vào giá khách trả.</small></div>
            <p className="demo-commerce-note">Đây là yêu cầu demo, chưa phải xác nhận phòng. Cần máy chủ và hợp đồng đối tác để đồng bộ phòng trống, giá thật và thanh toán.</p>
            <button className="button button--dark button--full" type="submit">Lưu yêu cầu đặt phòng mẫu →</button>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
