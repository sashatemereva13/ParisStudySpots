import areasJson from "@/data/areas.json";
import reviewsJson from "@/data/reviews.json";
import spotsJson from "@/data/spots.json";
import type { Area, Review, Spot } from "@/lib/types";

const areas = areasJson as Area[];
const reviews = reviewsJson as Review[];
const spots = spotsJson as Spot[];

export async function getAreaById(id: number): Promise<Area | null> {
  return areas.find((area) => area.id === id) ?? null;
}

export async function getAreas(): Promise<Area[]> {
  return areas;
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
  return areas.find((area) => area.slug === slug) ?? null;
}

export async function getSpots(): Promise<Spot[]> {
  return spots;
}

export async function getSpotBySlug(slug: string): Promise<Spot | null> {
  return spots.find((spot) => spot.slug === slug) ?? null;
}

export async function getSpotsByArea(areaId: number): Promise<Spot[]> {
  return spots.filter((spot) => spot.areaId === areaId);
}

export async function getReviews(spotId: number): Promise<Review[]> {
  return reviews.filter((review) => review.spotId === spotId);
}
