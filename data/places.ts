import { foodRegions, places, type Category } from "./travel";

export type SearchablePlace = {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<Category, "Tất cả">;
  location: string;
  district: string;
  tags: string[];
  lat: number;
  lng: number;
};

export const searchablePlaces: SearchablePlace[] = places.map((place) => ({
  id: place.id,
  name: place.name,
  shortName: place.shortName,
  category: place.category,
  location: place.location,
  district: place.district,
  tags: [
    ...place.tags,
    ...place.highlights,
    place.season,
    place.bestTime,
    ...place.restaurants.flatMap((item) => [item.name, item.type, item.address, item.taste ?? ""]),
    ...place.stays.flatMap((item) => [item.name, item.type, item.address]),
    ...foodRegions.flatMap((region) =>
      region.dishes
        .filter((dish) => dish.placeId === place.id)
        .flatMap((dish) => [dish.name, dish.description, region.label]),
    ),
  ].filter(Boolean),
  lat: place.lat,
  lng: place.lng,
}));

export function normalizeVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

export function searchPlaces(query: string, category: string) {
  const normalizedTerms = normalizeVietnamese(query).split(/\s+/).filter(Boolean);
  const normalizedCategory = normalizeVietnamese(category);

  return searchablePlaces.filter((place) => {
    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "tat ca" ||
      normalizeVietnamese(place.category) === normalizedCategory;
    if (!matchesCategory) return false;
    if (!normalizedTerms.length) return true;

    const haystack = normalizeVietnamese(
      [place.name, place.shortName, place.category, place.location, place.district, ...place.tags].join(" "),
    );
    return normalizedTerms.every((term) => haystack.includes(term));
  });
}
