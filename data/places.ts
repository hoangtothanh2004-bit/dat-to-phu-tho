export type SearchablePlace = {
  id: string;
  name: string;
  shortName: string;
  category: "Tâm linh" | "Thiên nhiên" | "Nghỉ dưỡng" | "Văn hóa";
  location: string;
  tags: string[];
  lat: number;
  lng: number;
};

export const searchablePlaces: SearchablePlace[] = [
  {
    id: "den-hung",
    name: "Khu di tích lịch sử Đền Hùng",
    shortName: "Đền Hùng",
    category: "Tâm linh",
    location: "Hy Cương, Việt Trì, Phú Thọ",
    tags: ["di sản", "lịch sử", "tín ngưỡng", "Hát Xoan", "gia đình"],
    lat: 21.366,
    lng: 105.3246,
  },
  {
    id: "xuan-son",
    name: "Vườn quốc gia Xuân Sơn",
    shortName: "Xuân Sơn",
    category: "Thiên nhiên",
    location: "Xuân Sơn, Tân Sơn, Phú Thọ",
    tags: ["trekking", "Bản Cỏi", "sinh thái", "hang động", "Dao", "Mường"],
    lat: 21.1506,
    lng: 104.9327,
  },
  {
    id: "long-coc",
    name: "Đồi chè Long Cốc",
    shortName: "Long Cốc",
    category: "Thiên nhiên",
    location: "Long Cốc, Tân Sơn, Phú Thọ",
    tags: ["săn mây", "chụp ảnh", "đồi chè", "bình minh"],
    lat: 21.1804,
    lng: 105.0708,
  },
  {
    id: "thanh-thuy",
    name: "Khoáng nóng Thanh Thủy",
    shortName: "Thanh Thủy",
    category: "Nghỉ dưỡng",
    location: "La Phù, Thanh Thủy, Phú Thọ",
    tags: ["khoáng nóng", "gia đình", "spa", "resort", "sông Đà"],
    lat: 21.1511,
    lng: 105.2971,
  },
  {
    id: "hung-lo",
    name: "Đình cổ Hùng Lô",
    shortName: "Hùng Lô",
    category: "Văn hóa",
    location: "Hùng Lô, Việt Trì, Phú Thọ",
    tags: ["Hát Xoan", "làng cổ", "mì gạo", "bánh chưng", "làng nghề"],
    lat: 21.3712,
    lng: 105.4077,
  },
  {
    id: "van-lang",
    name: "Công viên Văn Lang",
    shortName: "Văn Lang",
    category: "Văn hóa",
    location: "Trung tâm Việt Trì, Phú Thọ",
    tags: ["hoàng hôn", "đi bộ", "buổi tối", "hồ", "ẩm thực"],
    lat: 21.3066,
    lng: 105.3998,
  },
];

function normalizeVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

export function searchPlaces(query: string, category: string) {
  const normalizedQuery = normalizeVietnamese(query);
  const normalizedCategory = normalizeVietnamese(category);

  return searchablePlaces.filter((place) => {
    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "tat ca" ||
      normalizeVietnamese(place.category) === normalizedCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const haystack = normalizeVietnamese(
      [place.name, place.shortName, place.category, place.location, ...place.tags].join(" "),
    );
    return normalizedQuery.split(/\s+/).every((term) => haystack.includes(term));
  });
}
