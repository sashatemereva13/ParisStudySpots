import areasJson from "@/data/areas.json";
import reviewsJson from "@/data/reviews.json";
import spotsJson from "@/data/spots.json";
import type { Area, Review, Spot } from "@/lib/types";
import type { CheckIn } from "@/lib/types";

const areas = areasJson as Area[];
const reviews = reviewsJson as Review[];
const spots = spotsJson as Spot[];
let nextSpotId = Math.max(0, ...spots.map((spot) => spot.id)) + 1;
let nextReviewId = Math.max(0, ...reviews.map((review) => review.id)) + 1;
let nextCheckInId = 1;
const checkIns: CheckIn[] = [];

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
  // Simulate a brief lookup delay so the spot page loading state can be seen.
  await new Promise((resolve) => setTimeout(resolve, 500));
  return spots.find((spot) => spot.slug === slug) ?? null;
}

export async function getSpotsByArea(areaId: number): Promise<Spot[]> {
  return spots.filter((spot) => spot.areaId === areaId);
}

export async function getReviews(spotId: number): Promise<Review[]> {
  return reviews.filter((review) => review.spotId === spotId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPublicReviews(spotId: number) {
  return (await getReviews(spotId)).map((review) => ({ id: review.id, spotId: review.spotId, nickname: review.nickname, wifi: review.wifi, outlets: review.outlets, noise: review.noise, comfort: review.comfort, comment: review.comment, createdAt: review.createdAt, updatedAt: review.updatedAt }));
}

export async function createReview(input: Omit<Review, "id" | "editToken" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const review: Review = { ...input, id: nextReviewId++, editToken: crypto.randomUUID(), createdAt: now, updatedAt: now };
  reviews.push(review);
  return review;
}

export async function updateReview(id: number, editToken: string, input: Pick<Review, "nickname" | "wifi" | "outlets" | "noise" | "comfort" | "comment">) {
  const review = reviews.find((item) => item.id === id);
  if (!review || review.editToken !== editToken) return null;
  Object.assign(review, input, { updatedAt: new Date().toISOString() });
  return review;
}

export async function deleteReview(id: number, editToken: string) {
  const index = reviews.findIndex((item) => item.id === id);
  if (index < 0 || reviews[index].editToken !== editToken) return false;
  reviews.splice(index, 1);
  return true;
}

export async function createCheckIn(spotId: number, crowd: CheckIn["crowd"]) {
  const checkIn: CheckIn = { id: nextCheckInId++, spotId, crowd, createdAt: new Date().toISOString() };
  checkIns.push(checkIn);
  return checkIn;
}

export async function getCrowd(spotId: number) {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  const active = checkIns.filter((item) => item.spotId === spotId && Date.parse(item.createdAt) >= cutoff);
  const counts = { quiet: 0, busy: 0, full: 0 };
  for (const item of active) counts[item.crowd]++;
  const total = active.length;
  const level = total ? (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof counts) : null;
  return { level, counts, total };
}

export async function createSpot(input: Omit<Spot, "id" | "slug"> & { slug?: string }) {
  const slug = (input.slug || input.name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug || slug === "new" || spots.some((spot) => spot.slug === slug)) return null;
  const spot: Spot = { ...input, id: nextSpotId++, slug };
  spots.push(spot);
  return spot;
}

export async function searchSpots(
  query: string,
  type?: string,
): Promise<Spot[]> {
  const normalizedQuery = query.trim().toLowerCase();

  return spots.filter((spot) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      spot.name.toLowerCase().includes(normalizedQuery) ||
      spot.address.toLowerCase().includes(normalizedQuery);

    const matchesType = !type || spot.type === type;

    return matchesQuery && matchesType;
  });
}
